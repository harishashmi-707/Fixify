import mongoose from 'mongoose';

const cached = global.mongoose;

if (!cached) {
  global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(process.env.MONGO_URI, { family: 4 }).then((conn) => {
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      global.mongoose.conn = conn;
      return conn;
    });
  }

  try {
    return await global.mongoose.promise;
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
