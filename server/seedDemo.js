import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import User from './models/User.js';
import Technician from './models/Technician.js';
import Category from './models/Category.js';
import Service from './models/Service.js';
import Booking from './models/Booking.js';
import Message from './models/Message.js';
import Notification from './models/Notification.js';
import Review from './models/Review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        // Don't fail — just skip the image
        console.log(`  ⚠ Skipped ${path.basename(filepath)} (HTTP ${res.statusCode})`);
        resolve(filepath);
      }
    }).on('error', (err) => {
      console.log(`  ⚠ Skipped ${path.basename(filepath)}: ${err.message}`);
      resolve(filepath); // Don't fail entirely
    });
  });
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Create directories
    ['avatars', 'services', 'categories'].forEach(dir => {
      const dirPath = path.join(__dirname, 'uploads', dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });

    // ──────────────────────────────────────────
    // 1. CLEAR OLD DEMO DATA
    // ──────────────────────────────────────────
    console.log('\n🗑  Clearing existing demo data...');
    const demoEmails = ['admin@fixithub.pk', 'ahmed@example.com', 'usman@example.com', 'ali@example.com', 'fatima@example.com'];
    const oldUsers = await User.find({ email: { $in: demoEmails } }).select('_id');
    const oldUserIds = oldUsers.map(u => u._id);

    await Message.deleteMany({ $or: [{ sender: { $in: oldUserIds } }, { receiver: { $in: oldUserIds } }] });
    await Notification.deleteMany({ user: { $in: oldUserIds } });
    await Booking.deleteMany({ user: { $in: oldUserIds } });
    await Review.deleteMany({ user: { $in: oldUserIds } });
    await Technician.deleteMany({ user: { $in: oldUserIds } });
    await User.deleteMany({ email: { $in: demoEmails } });
    await Category.deleteMany({ slug: { $in: ['plumbing', 'electrical', 'ac-hvac', 'home-cleaning'] } });
    await Service.deleteMany({ slug: { $in: ['pipe-leak-repair', 'toilet-installation', 'wiring-repair', 'ac-installation', 'deep-cleaning', 'fan-installation'] } });

    // ──────────────────────────────────────────
    // 2. DOWNLOAD IMAGES
    // ──────────────────────────────────────────
    console.log('\n📥 Downloading images...');
    const imgs = [
      // Avatars
      ['https://placehold.co/400x400/10b981/ffffff.png?text=Admin', 'uploads/avatars/admin.png'],
      ['https://placehold.co/400x400/3b82f6/ffffff.png?text=Ahmed', 'uploads/avatars/ahmed.png'],
      ['https://placehold.co/400x400/f59e0b/ffffff.png?text=Usman', 'uploads/avatars/usman.png'],
      ['https://placehold.co/400x400/8b5cf6/ffffff.png?text=Ali', 'uploads/avatars/ali.png'],
      ['https://placehold.co/400x400/ec4899/ffffff.png?text=Fatima', 'uploads/avatars/fatima.png'],
      // Categories
      ['https://placehold.co/800x500/0d9488/ffffff.png?text=Plumbing', 'uploads/categories/plumbing.png'],
      ['https://placehold.co/800x500/f59e0b/ffffff.png?text=Electrical', 'uploads/categories/electrical.png'],
      ['https://placehold.co/800x500/6366f1/ffffff.png?text=AC+%26+HVAC', 'uploads/categories/ac-hvac.png'],
      ['https://placehold.co/800x500/ec4899/ffffff.png?text=Cleaning', 'uploads/categories/cleaning.png'],
      // Services
      ['https://placehold.co/800x500/14b8a6/ffffff.png?text=Pipe+Leak+Repair', 'uploads/services/pipe-repair.png'],
      ['https://placehold.co/800x500/0ea5e9/ffffff.png?text=Toilet+Installation', 'uploads/services/toilet-install.png'],
      ['https://placehold.co/800x500/eab308/ffffff.png?text=Wiring+Repair', 'uploads/services/wiring-repair.png'],
      ['https://placehold.co/800x500/8b5cf6/ffffff.png?text=AC+Installation', 'uploads/services/ac-install.png'],
      ['https://placehold.co/800x500/f472b6/ffffff.png?text=Deep+Cleaning', 'uploads/services/deep-cleaning.png'],
      ['https://placehold.co/800x500/a3e635/1e293b.png?text=Fan+Installation', 'uploads/services/fan-install.png'],
    ];
    for (const [url, rel] of imgs) {
      await downloadImage(url, path.join(__dirname, rel));
    }
    console.log('  Done.');

    // ──────────────────────────────────────────
    // 3. USERS (Mongoose pre-save hashes passwords)
    // ──────────────────────────────────────────
    console.log('\n👤 Creating demo users...');
    const admin = await User.create({ name: 'Admin User', email: 'admin@fixithub.pk', password: 'password', role: 'admin', city: 'Islamabad', avatar: 'admin.png', isActive: true });
    const ahmed = await User.create({ name: 'Ahmed Khan', email: 'ahmed@example.com', password: 'password', role: 'user', city: 'Lahore', phone: '0301-1234567', avatar: 'ahmed.png', isActive: true });
    const fatima = await User.create({ name: 'Fatima Noor', email: 'fatima@example.com', password: 'password', role: 'user', city: 'Islamabad', phone: '0333-9876543', avatar: 'fatima.png', isActive: true });
    const usman = await User.create({ name: 'Usman Ali', email: 'usman@example.com', password: 'password', role: 'technician', city: 'Karachi', phone: '0312-5555555', avatar: 'usman.png', isActive: true });
    const ali = await User.create({ name: 'Ali Raza', email: 'ali@example.com', password: 'password', role: 'technician', city: 'Lahore', phone: '0345-1112233', avatar: 'ali.png', isActive: true });

    // ──────────────────────────────────────────
    // 4. CATEGORIES
    // ──────────────────────────────────────────
    console.log('\n📂 Creating categories...');
    const catPlumbing = await Category.create({ name: 'Plumbing', slug: 'plumbing', description: 'Expert plumbing services — leaks, drains, pipes & installations.', image: 'plumbing.png', isActive: true });
    const catElectrical = await Category.create({ name: 'Electrical', slug: 'electrical', description: 'Safe and reliable electrical repairs, wiring & installations.', image: 'electrical.png', isActive: true });
    const catAC = await Category.create({ name: 'AC & HVAC', slug: 'ac-hvac', description: 'Air conditioning installation, repair and maintenance.', image: 'ac-hvac.png', isActive: true });
    const catCleaning = await Category.create({ name: 'Home Cleaning', slug: 'home-cleaning', description: 'Professional deep cleaning and regular maintenance.', image: 'cleaning.png', isActive: true });

    // ──────────────────────────────────────────
    // 5. SERVICES
    // ──────────────────────────────────────────
    console.log('\n🔧 Creating services...');
    const srvPipe = await Service.create({ name: 'Pipe Leak Repair', slug: 'pipe-leak-repair', category: catPlumbing._id, basePrice: 1500, duration: '1 Hour', description: 'Quick and efficient repair for all types of pipe leaks in your home.', image: 'pipe-repair.png', isActive: true });
    const srvToilet = await Service.create({ name: 'Toilet Installation', slug: 'toilet-installation', category: catPlumbing._id, basePrice: 3500, duration: '2 Hours', description: 'Professional toilet installation with quality plumbing work.', image: 'toilet-install.png', isActive: true });
    const srvWiring = await Service.create({ name: 'Wiring Repair', slug: 'wiring-repair', category: catElectrical._id, basePrice: 2000, duration: '1.5 Hours', description: 'Expert electrical wiring repair to keep your home safe.', image: 'wiring-repair.png', isActive: true });
    const srvAC = await Service.create({ name: 'AC Installation', slug: 'ac-installation', category: catAC._id, basePrice: 4500, duration: '3 Hours', description: 'Complete split AC installation with copper piping and gas filling.', image: 'ac-install.png', isActive: true });
    const srvClean = await Service.create({ name: 'Deep Cleaning', slug: 'deep-cleaning', category: catCleaning._id, basePrice: 5000, duration: '4 Hours', description: 'Thorough deep cleaning of your entire home — floors, bathrooms, kitchen.', image: 'deep-cleaning.png', isActive: true });
    const srvFan = await Service.create({ name: 'Fan Installation', slug: 'fan-installation', category: catElectrical._id, basePrice: 1200, duration: '45 Minutes', description: 'Ceiling and exhaust fan installation with safe wiring.', image: 'fan-install.png', isActive: true });

    // ──────────────────────────────────────────
    // 6. TECHNICIAN PROFILES
    // ──────────────────────────────────────────
    console.log('\n🛠  Creating technician profiles...');
    const techUsman = await Technician.create({
      user: usman._id,
      cnic: '42201-1234567-1',
      status: 'approved',
      bio: 'I am a certified plumber and AC technician with over 5 years of hands-on experience. I take pride in clean, lasting work.',
      skills: ['Plumbing', 'AC Repair', 'AC Installation', 'Water Heater'],
      hourlyRate: 1000,
      avgRating: 4.7,
      totalReviews: 3,
      totalJobs: 28,
      experienceYears: 5,
      services: [
        { service: srvPipe._id, customPrice: 1600 },
        { service: srvToilet._id, customPrice: 3800 },
        { service: srvAC._id, customPrice: 4800 },
      ],
      availability: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], startTime: '09:00', endTime: '18:00' }
    });

    const techAli = await Technician.create({
      user: ali._id,
      cnic: '35202-9876543-9',
      status: 'approved',
      bio: 'Experienced electrician and cleaning specialist. I guarantee safe, reliable work and always arrive on time.',
      skills: ['Electrical', 'Wiring', 'Fan Installation', 'Deep Cleaning'],
      hourlyRate: 800,
      avgRating: 4.5,
      totalReviews: 2,
      totalJobs: 15,
      experienceYears: 3,
      services: [
        { service: srvWiring._id, customPrice: 2200 },
        { service: srvFan._id, customPrice: 1300 },
        { service: srvClean._id, customPrice: 5200 },
      ],
      availability: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], startTime: '10:00', endTime: '17:00' }
    });

    // ──────────────────────────────────────────
    // 7. BOOKINGS
    // ──────────────────────────────────────────
    console.log('\n📋 Creating demo bookings...');
    const booking1 = await Booking.create({
      bookingNumber: 'FIX-20260001',
      user: ahmed._id,
      technician: techUsman._id,
      service: srvPipe._id,
      bookingDate: new Date('2026-06-25'),
      bookingTime: '10:00 AM',
      address: 'House 12, Street 5, Johar Town',
      city: 'Lahore',
      phone: '0301-1234567',
      description: 'Kitchen pipe is leaking badly, needs urgent fix.',
      totalAmount: 1600,
      status: 'completed',
      completedAt: new Date('2026-06-25T14:00:00'),
      statusHistory: [
        { status: 'pending', notes: 'Booking created', changedBy: ahmed._id },
        { status: 'accepted', notes: 'Accepted by Usman', changedBy: usman._id },
        { status: 'completed', notes: 'Job completed successfully', changedBy: usman._id },
      ]
    });

    const booking2 = await Booking.create({
      bookingNumber: 'FIX-20260002',
      user: ahmed._id,
      technician: techAli._id,
      service: srvWiring._id,
      bookingDate: new Date('2026-06-28'),
      bookingTime: '2:00 PM',
      address: 'House 12, Street 5, Johar Town',
      city: 'Lahore',
      phone: '0301-1234567',
      description: 'Some switches sparking, need wiring check.',
      totalAmount: 2200,
      status: 'accepted',
      statusHistory: [
        { status: 'pending', notes: 'Booking created', changedBy: ahmed._id },
        { status: 'accepted', notes: 'Accepted by Ali', changedBy: ali._id },
      ]
    });

    const booking3 = await Booking.create({
      bookingNumber: 'FIX-20260003',
      user: fatima._id,
      technician: techUsman._id,
      service: srvAC._id,
      bookingDate: new Date('2026-06-30'),
      bookingTime: '11:00 AM',
      address: 'Apartment 4B, Civic Center, F-8',
      city: 'Islamabad',
      phone: '0333-9876543',
      description: 'Need a new split AC installed in the bedroom.',
      totalAmount: 4800,
      status: 'pending',
      statusHistory: [
        { status: 'pending', notes: 'Booking created', changedBy: fatima._id },
      ]
    });

    // ──────────────────────────────────────────
    // 8. REVIEWS
    // ──────────────────────────────────────────
    console.log('\n⭐ Creating demo reviews...');
    await Review.create({ user: ahmed._id, technician: techUsman._id, booking: booking1._id, rating: 5, comment: 'Excellent work! Usman fixed my pipe leak in under an hour. Very professional and clean.', status: 'approved' });
    await Review.create({ user: fatima._id, technician: techUsman._id, booking: booking3._id, rating: 4, comment: 'Good technician, arrived on time. Slightly expensive but quality work.', status: 'approved' });
    await Review.create({ user: ahmed._id, technician: techAli._id, booking: booking2._id, rating: 5, comment: 'Ali is very knowledgeable about electrical work. Highly recommended!', status: 'approved' });

    // ──────────────────────────────────────────
    // 9. MESSAGES (so the chat pages have content)
    // ──────────────────────────────────────────
    console.log('\n💬 Creating demo messages...');
    const now = Date.now();
    await Message.create({ sender: ahmed._id, receiver: usman._id, message: 'Hi Usman, I have a leaking pipe. Can you come tomorrow?', createdAt: new Date(now - 7200000), isRead: true });
    await Message.create({ sender: usman._id, receiver: ahmed._id, message: 'Salam Ahmed! Yes, I can come around 10 AM. Please share your address.', createdAt: new Date(now - 7100000), isRead: true });
    await Message.create({ sender: ahmed._id, receiver: usman._id, message: 'Great! House 12, Street 5, Johar Town, Lahore. See you then!', createdAt: new Date(now - 7000000), isRead: true });
    await Message.create({ sender: usman._id, receiver: ahmed._id, message: 'Perfect, I\'ll be there on time. JazakAllah!', createdAt: new Date(now - 6900000), isRead: true });

    await Message.create({ sender: fatima._id, receiver: usman._id, message: 'Assalam-o-Alaikum Usman, can you install a 1.5 ton split AC?', createdAt: new Date(now - 3600000), isRead: true });
    await Message.create({ sender: usman._id, receiver: fatima._id, message: 'Walaikum Assalam! Yes, I can. Do you already have the AC unit or do you need me to arrange one?', createdAt: new Date(now - 3500000), isRead: false });

    await Message.create({ sender: ahmed._id, receiver: ali._id, message: 'Hi Ali, some switches in my house are sparking. Can you take a look?', createdAt: new Date(now - 1800000), isRead: true });
    await Message.create({ sender: ali._id, receiver: ahmed._id, message: 'Sure Ahmed! That could be dangerous. I can come today at 2 PM if that works?', createdAt: new Date(now - 1700000), isRead: false });

    // ──────────────────────────────────────────
    // 10. NOTIFICATIONS
    // ──────────────────────────────────────────
    console.log('\n🔔 Creating demo notifications...');
    await Notification.create({ user: ahmed._id, title: 'Booking Completed', message: 'Your booking #FIX-20260001 (Pipe Leak Repair) has been completed successfully!', type: 'booking', isRead: false });
    await Notification.create({ user: ahmed._id, title: 'Booking Accepted', message: 'Ali Raza has accepted your booking #FIX-20260002 (Wiring Repair).', type: 'booking', isRead: false });
    await Notification.create({ user: ahmed._id, title: 'New Message', message: 'You have a new message from Ali Raza.', type: 'message', isRead: false });

    await Notification.create({ user: usman._id, title: 'New Booking Request', message: 'Fatima Noor has requested an AC Installation service. Check your dashboard.', type: 'booking', isRead: false });
    await Notification.create({ user: usman._id, title: 'Review Received', message: 'Ahmed Khan gave you a 5-star review for Pipe Leak Repair!', type: 'review', isRead: false });

    await Notification.create({ user: ali._id, title: 'Booking Accepted', message: 'You accepted a Wiring Repair booking from Ahmed Khan.', type: 'booking', isRead: true });

    await Notification.create({ user: fatima._id, title: 'Booking Created', message: 'Your AC Installation booking #FIX-20260003 has been submitted.', type: 'booking', isRead: false });

    console.log('\n✅ ─────────────────────────────────────────');
    console.log('  DEMO DATA SEEDED SUCCESSFULLY!');
    console.log('  ─────────────────────────────────────────');
    console.log('  🔑 Login Credentials (all passwords: "password"):');
    console.log('     Admin:      admin@fixithub.pk');
    console.log('     User 1:     ahmed@example.com');
    console.log('     User 2:     fatima@example.com');
    console.log('     Tech 1:     usman@example.com');
    console.log('     Tech 2:     ali@example.com');
    console.log('  ─────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
