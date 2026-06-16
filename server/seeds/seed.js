import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load models
import User from '../models/User.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import Technician from '../models/Technician.js';
import Setting from '../models/Setting.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import Message from '../models/Message.js';
import ContactMessage from '../models/ContactMessage.js';
import AdminLog from '../models/AdminLog.js';

import { ROLES } from '../config/constants.js';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Category.deleteMany();
        await Service.deleteMany();
        await Technician.deleteMany();
        await Setting.deleteMany();
        await Booking.deleteMany();
        await Review.deleteMany();
        await Payment.deleteMany();
        await Notification.deleteMany();
        await Message.deleteMany();
        await ContactMessage.deleteMany();
        await AdminLog.deleteMany();
        console.log('🗑️  Data Destroyed!');
    } catch (error) {
        console.error(`❌ Error destroying data: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await destroyData();

        // 1. Settings
        await Setting.insertMany([
            { key: 'site_name', value: 'FixIt Hub Pakistan', group: 'general' },
            { key: 'site_email', value: 'info@fixithub.pk', group: 'general' },
            { key: 'site_phone', value: '+92 300 1234567', group: 'general' },
            { key: 'commission_rate', value: '15', group: 'payment' },
            { key: 'min_booking_hours', value: '2', group: 'booking' }
        ]);
        console.log('✅ Settings seeded');

        // 2. Users (Admin, User, Techs)
        const bcrypt = await import('bcryptjs');
        const salt = await bcrypt.default.genSalt(12);
        const hashedPassword = await bcrypt.default.hash('password', salt);

        const users = await User.insertMany([
            { name: 'Admin User', email: 'admin@fixithub.pk', phone: '+923001234567', password: hashedPassword, role: ROLES.ADMIN, city: 'Islamabad' },
            { name: 'Ahmed Khan', email: 'ahmed@example.com', phone: '+923011111111', password: hashedPassword, role: ROLES.USER, city: 'Islamabad', address: 'F-8 Markaz' },
            { name: 'Sara Ali', email: 'sara@example.com', phone: '+923022222222', password: hashedPassword, role: ROLES.USER, city: 'Lahore', address: 'DHA Phase 5' },
            { name: 'Usman Electrician', email: 'usman@example.com', phone: '+923044444444', password: hashedPassword, role: ROLES.TECHNICIAN, city: 'Islamabad' },
            { name: 'Kamran AC Expert', email: 'kamran@example.com', phone: '+923055555555', password: hashedPassword, role: ROLES.TECHNICIAN, city: 'Lahore' },
        ]);
        console.log('✅ Users seeded');

        const adminId = users[0]._id;
        const usmanId = users[3]._id;
        const kamranId = users[4]._id;

        // 3. Categories
        const categories = await Category.insertMany([
            { name: 'Mobile Repair', slug: 'mobile-repair', icon: 'Smartphone', sortOrder: 1 },
            { name: 'Laptop Repair', slug: 'laptop-repair', icon: 'Laptop', sortOrder: 2 },
            { name: 'Electrician', slug: 'electrician', icon: 'Zap', sortOrder: 3 },
            { name: 'Plumbing', slug: 'plumbing', icon: 'Droplets', sortOrder: 4 },
            { name: 'AC Services', slug: 'ac-services', icon: 'Snowflake', sortOrder: 5 },
        ]);
        console.log('✅ Categories seeded');

        // 4. Services
        const services = await Service.insertMany([
            { category: categories[0]._id, name: 'Screen Replacement', slug: 'screen-replacement', basePrice: 2500, durationMinutes: 60 },
            { category: categories[0]._id, name: 'Battery Replacement', slug: 'battery-replacement', basePrice: 1500, durationMinutes: 30 },
            { category: categories[2]._id, name: 'Wiring Installation', slug: 'wiring-installation', basePrice: 3000, durationMinutes: 120 },
            { category: categories[2]._id, name: 'Switch & Socket Repair', slug: 'switch-socket-repair', basePrice: 800, durationMinutes: 30 },
            { category: categories[4]._id, name: 'AC Installation', slug: 'ac-installation', basePrice: 3500, durationMinutes: 120 },
            { category: categories[4]._id, name: 'AC Gas Refill', slug: 'ac-gas-refill', basePrice: 2500, durationMinutes: 60 },
        ]);
        console.log('✅ Services seeded');

        // 5. Technicians
        await Technician.insertMany([
            {
                user: usmanId,
                bio: 'Certified electrician with 8+ years of experience.',
                skills: ['Wiring', 'Circuit Breakers'],
                hourlyRate: 800,
                experienceYears: 8,
                status: 'approved',
                avgRating: 4.8,
                totalReviews: 120,
                totalJobs: 250,
                serviceAreas: ['Islamabad', 'Rawalpindi'],
                services: [
                    { service: services[2]._id, customPrice: 3500 },
                    { service: services[3]._id, customPrice: 1000 }
                ]
            },
            {
                user: kamranId,
                bio: 'Professional AC technician specializing in all major brands.',
                skills: ['AC Installation', 'Gas Refill', 'Compressor'],
                hourlyRate: 1000,
                experienceYears: 6,
                status: 'approved',
                avgRating: 4.6,
                totalReviews: 85,
                totalJobs: 180,
                serviceAreas: ['Lahore'],
                services: [
                    { service: services[4]._id, customPrice: 4000 },
                    { service: services[5]._id, customPrice: 3000 }
                ]
            }
        ]);
        console.log('✅ Technicians seeded');

        const usmanProfile = await Technician.findOne({ user: usmanId });
        const kamranProfile = await Technician.findOne({ user: kamranId });

        // 6. Bookings
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 5);
        
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 2);

        const bookings = await Booking.insertMany([
            {
                bookingNumber: 'AF-1001',
                user: users[1]._id, // Ahmed
                technician: usmanProfile._id,
                service: services[2]._id, // Wiring
                status: 'completed',
                bookingDate: pastDate,
                bookingTime: '10:00 AM',
                address: users[1].address,
                city: users[1].city,
                phone: users[1].phone,
                totalAmount: 3500,
                completedAt: pastDate
            },
            {
                bookingNumber: 'AF-1002',
                user: users[2]._id, // Sara
                technician: kamranProfile._id,
                service: services[4]._id, // AC Install
                status: 'pending',
                bookingDate: futureDate,
                bookingTime: '02:00 PM',
                address: users[2].address,
                city: users[2].city,
                phone: users[2].phone,
                totalAmount: 4000
            },
            {
                bookingNumber: 'AF-1003',
                user: users[1]._id, // Ahmed
                technician: kamranProfile._id,
                service: services[5]._id, // AC Gas
                status: 'in_progress',
                bookingDate: new Date(),
                bookingTime: '11:30 AM',
                address: users[1].address,
                city: users[1].city,
                phone: users[1].phone,
                totalAmount: 3000
            }
        ]);
        console.log('✅ Bookings seeded');

        // 7. Payments
        await Payment.insertMany([
            {
                booking: bookings[0]._id,
                amount: 3500,
                method: 'cash',
                status: 'completed',
                paidAt: pastDate
            }
        ]);
        console.log('✅ Payments seeded');

        // 8. Reviews
        await Review.insertMany([
            {
                booking: bookings[0]._id,
                user: users[1]._id,
                technician: usmanProfile._id,
                rating: 5,
                comment: 'Excellent service, highly recommended!'
            }
        ]);
        console.log('✅ Reviews seeded');

        // 9. Notifications & Messages
        await Notification.insertMany([
            { user: users[1]._id, title: 'Booking Confirmed', message: 'Your booking AF-1001 has been confirmed.', type: 'booking' },
            { user: usmanId, title: 'New Review', message: 'You received a 5-star review.', type: 'review' },
            { user: adminId, title: 'New Booking', message: 'Booking AF-1002 was just created.', type: 'system' }
        ]);

        await Message.insertMany([
            { sender: users[1]._id, receiver: usmanId, booking: bookings[0]._id, message: 'Are you on your way?' },
            { sender: usmanId, receiver: users[1]._id, booking: bookings[0]._id, message: 'Yes, I will be there in 10 mins.' }
        ]);
        console.log('✅ Notifications & Messages seeded');

        // 10. Admin Logs & Contact
        await AdminLog.insertMany([
            { admin: adminId, action: 'Updated Settings', details: 'Changed commission rate to 15%' }
        ]);

        await ContactMessage.insertMany([
            { name: 'Guest User', email: 'guest@example.com', subject: 'Inquiry', message: 'Do you offer generator repair?' }
        ]);
        console.log('✅ Admin Logs & Contact seeded');

        console.log('🎉 Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error importing data: ${error.message}`);
        process.exit(1);
    }
};

connectDB().then(() => {
    if (process.argv[2] === '-d') {
        destroyData().then(() => process.exit());
    } else {
        importData();
    }
});
