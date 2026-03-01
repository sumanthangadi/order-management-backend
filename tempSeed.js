const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./src/models/Admin').default || require('./src/models/Admin');

const run = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/oms');
        console.log('Connected to MongoDB');

        const admin = await mongoose.connection.collection('admins').findOne({ email: 'admin@shop.com' });
        if (admin) {
            console.log('Admin already exists:', admin);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('admin123', salt);
        await mongoose.connection.collection('admins').insertOne({
            email: 'admin@shop.com',
            password,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('Admin inserted successfully!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
