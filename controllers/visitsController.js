const Student = require('../models/Student');

const recordVisit = async (req, res) => {
  try {
    const { itemType, itemId } = req.body; // itemType: 'Subject' | 'Chapter'
    const studentId = req.user.id;

    if (!itemType || !itemId) {
      return res.status(400).json({ error: 'itemType and itemId are required' });
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const visitIndex = student.frequentVisits.findIndex(
      v => v.itemId.toString() === itemId && v.itemType === itemType
    );

    if (visitIndex > -1) {
      student.frequentVisits[visitIndex].count += 1;
      student.frequentVisits[visitIndex].lastVisited = Date.now();
    } else {
      student.frequentVisits.push({ itemType, itemId, count: 1, lastVisited: Date.now() });
    }

    await student.save();
    res.json({ message: 'Visit recorded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFrequentVisits = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await Student.findById(studentId)
      .populate('frequentVisits.itemId'); // Populates Subject or Chapter based on refPath

    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Filter out invalid itemIds in case they were deleted from DB
    const validVisits = student.frequentVisits.filter(v => v.itemId);

    // Sort by count (descending), then by lastVisited (descending)
    const sortedVisits = validVisits.sort((a, b) => {
      if (b.count === a.count) {
        return new Date(b.lastVisited) - new Date(a.lastVisited);
      }
      return b.count - a.count;
    });

    // Get top 3
    const topVisits = sortedVisits.slice(0, 3);
    res.json(topVisits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  recordVisit,
  getFrequentVisits
};
