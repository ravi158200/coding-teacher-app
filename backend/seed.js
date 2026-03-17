const mongoose = require('mongoose');
const Course = require('./models/Course');
const dotenv = require('dotenv');

dotenv.config();

const courses = [
    {
        title: "Complete Web Development Bootcamp",
        description: "Learn HTML, CSS, JavaScript, React, Node and more! Become a full-stack developer.",
        instructor: "Dr. Angela Yu",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        category: "Web Development",
        price: 49.99,
        lessons: [
            { title: "Introduction to HTML", content: "HTML stands for HyperText Markup Language...", videoUrl: "https://www.youtube.com/embed/qz0aGYMCzl0", duration: "10:00" },
            { title: "CSS Styling Basics", content: "Cascading Style Sheets (CSS) is used to style elements...", videoUrl: "https://www.youtube.com/embed/1Rs2ND1ryYc", duration: "15:00" }
        ],
        quizzes: [
            { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Tabular Multi Language"], correctAnswer: 0 }
        ]
    },
    {
        title: "Python for Data Science",
        description: "Master Python for data analysis, visualization and machine learning.",
        instructor: "Jose Portilla",
        thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
        category: "Data Science",
        price: 59.99,
        lessons: [
            { title: "Python Basics", content: "Variables, types and operations in Python...", videoUrl: "https://www.youtube.com/embed/rfscVS0vtbw", duration: "12:00" }
        ],
        quizzes: [
            { question: "Which library is used for data manipulation?", options: ["Matplotlib", "Pandas", "Request"], correctAnswer: 1 }
        ]
    },
    {
        title: "Full Stack Elite Batch",
        description: "Intensive 3-month live bootcamp to master MERN stack.",
        instructor: "Sam Teacher",
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80",
        category: "Web Development",
        price: 199,
        originalPrice: 499,
        isBatch: true,
        startDate: new Date("2026-04-01"),
        lessons: [{ title: "Orientation", content: "Welcome to the elite flight...", videoUrl: "", duration: "1h" }],
        quizzes: []
    },
    {
        title: "Data Mastery Python Batch",
        description: "Live interactive sessions on Data Science and ML.",
        instructor: "Jose Portilla",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bbbda546697c?auto=format&fit=crop&w=800&q=80",
        category: "Data Science",
        price: 299,
        originalPrice: 499,
        isBatch: true,
        startDate: new Date("2026-04-15"),
        lessons: [{ title: "Setup Environment", content: "Installing Anaconda...", videoUrl: "", duration: "45m" }],
        quizzes: []
    },
    {
        title: "Gen-AI & MLOps Masterclass",
        description: "The ultimate guide to generative AI and Ops.",
        instructor: "Adv AI",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
        category: "AI & Machine Learning",
        price: 399,
        originalPrice: 599,
        isBatch: true,
        startDate: new Date("2026-05-05"),
        lessons: [{ title: "LLM Fundamentals", content: "Scaling laws...", videoUrl: "", duration: "2h" }],
        quizzes: []
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coding_teaching_db');
        await Course.deleteMany();
        await Course.insertMany(courses);
        console.log('Database Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data', error);
        process.exit(1);
    }
};

seedDB();
