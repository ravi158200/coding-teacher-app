const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'email name role');
        console.log('--- USERS IN DATABASE ---');
        users.forEach(u => console.log(`${u.name} | ${u.email} | Role: ${u.role}`));
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

listUsers();
