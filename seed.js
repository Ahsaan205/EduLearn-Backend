require('dotenv').config();
const mongoose = require('mongoose');
const Board = require('./models/Board');
const Class = require('./models/Class');
const Subject = require('./models/Subject');

const MONGODB_URI = process.env.MONGODB_URI;

const boardsData = [
  { name: 'Federal Board', type: 'Federal' },
  { name: 'Punjab Board', type: 'Punjab' }
];

const classesData = [9, 10, 11, 12];

const subjects9th = [
  'English', 'Urdu', 'Islamic Studies (for Muslims)', 
  'Tarjama-tul-Quran', 'Mathematics (Science Group)', 'Physics', 
  'Chemistry', 'Biology', 'Computer Science'
];
const subjects10th = [
  'English', 'Urdu', 'Pakistan Studies', 
  'Tarjama-tul-Quran', 'Mathematics (Science Group)', 'Physics', 
  'Chemistry', 'Biology', 'Computer Science'
];
const subjectsInterPart1 = [
  'English', 'Urdu', 'Islamic Studies', 'Tarjama-tul-Quran', 
  'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science'
];
const subjectsInterPart2 = [
  'English', 'Urdu', 'Pakistan Studies', 'Tarjama-tul-Quran', 
  'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science'
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Board.deleteMany({});
    await Class.deleteMany({});
    await Subject.deleteMany({});
    console.log('Cleared existing Boards, Classes, and Subjects.');

    // Seed Boards
    const createdBoards = await Board.insertMany(boardsData);
    console.log(`Seeded ${createdBoards.length} boards.`);

    const classesToInsert = [];
    
    // Prepare Classes for each Board
    for (const board of createdBoards) {
      for (const grade of classesData) {
        classesToInsert.push({
          gradeLevel: grade,
          boardId: board._id
        });
      }
    }

    // Seed Classes
    const createdClasses = await Class.insertMany(classesToInsert);
    console.log(`Seeded ${createdClasses.length} classes.`);

    const subjectsToInsert = [];

    // Prepare Subjects for each Class
    for (const cls of createdClasses) {
      let subjectsList = [];
      if (cls.gradeLevel === 9) {
        subjectsList = subjects9th;
      } else if (cls.gradeLevel === 10) {
        subjectsList = subjects10th;
      } else if (cls.gradeLevel === 11) {
        subjectsList = subjectsInterPart1;
      } else if (cls.gradeLevel === 12) {
        subjectsList = subjectsInterPart2;
      }

      for (const subjName of subjectsList) {
        subjectsToInsert.push({
          name: subjName,
          classId: cls._id
        });
      }
    }

    // Seed Subjects
    const createdSubjects = await Subject.insertMany(subjectsToInsert);
    console.log(`Seeded ${createdSubjects.length} subjects.`);

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
