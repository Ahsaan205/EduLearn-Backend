const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');

const adminLogin = (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, user: { email, role: 'admin' } });
  }
  res.status(401).json({ message: 'Invalid credentials' });
};

const registerStudent = async (req, res) => {
  try {
    const { name, email, password, age, gender, phone, address } = req.body;
    let student = await Student.findOne({ email });
    if (student) return res.status(400).json({ message: 'Student already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    student = new Student({ name, email, password: hashedPassword, age, gender, phone, address });
    await student.save();

    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: student._id, name, email, role: 'student' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const unifiedLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check Admin
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, user: { email, role: 'admin', name: 'Administrator' } });
    }

    // Check Student
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: student._id, name: student.name, email, age: student.age, gender: student.gender, phone: student.phone, address: student.address, image: student.image, role: 'student' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const cloudinary = require('../config/cloudinary');

const updateProfile = async (req, res) => {
  try {
    const { name, age, gender, phone, address } = req.body;
    const studentId = req.user.id;
    let imageUrl = undefined;

    if (req.file) {
      // Upload to Cloudinary using a buffer stream
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'eduplatform/profiles' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const updateData = { name, age, gender, phone, address };
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true }
    );

    if (!student) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated', user: { id: student._id, name: student.name, email: student.email, age: student.age, gender: student.gender, phone: student.phone, address: student.address, image: student.image, role: 'student' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    student.password = hashedPassword;
    await student.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const axios = require('axios');

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body; // This is the access_token from the frontend
    
    // Fetch user info from Google using the access token
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { email, name, picture } = data;

    let student = await Student.findOne({ email });

    // If student doesn't exist, create a new account
    if (!student) {
      // Generate random password for google sign-in users
      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      student = new Student({
        name: name || email.split('@')[0],
        email,
        password: hashedPassword,
        image: picture,
        gender: 'Not Selected',
      });
      await student.save();
    }

    const jwtToken = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token: jwtToken, 
      user: { 
        id: student._id, 
        name: student.name, 
        email: student.email, 
        age: student.age, 
        gender: student.gender, 
        phone: student.phone, 
        address: student.address, 
        image: student.image, 
        role: 'student' 
      } 
    });

  } catch (err) {
    console.error("Google login error: ", err);
    res.status(500).json({ message: err.response?.data?.error || err.message || 'Google Auth failed' });
  }
}

module.exports = { adminLogin, registerStudent, unifiedLogin, updateProfile, changePassword, googleLogin };
