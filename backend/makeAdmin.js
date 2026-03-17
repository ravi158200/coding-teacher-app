const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const makeAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
        if (user) {
            console.log(`User ${email} is now an admin.`);
        } else {
            console.log(`User ${email} not found.`);
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const email = process.argv[2];
if (!email) {
    console.log("Please provide an email: node makeAdmin.js user@example.com");
    process.exit(1);
}

makeAdmin(email);
