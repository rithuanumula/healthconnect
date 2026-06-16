const mongoose = require('mongoose');
const dns = require('dns');

// Override DNS servers to resolve MongoDB SRV lookup issues in Node
dns.setServers(['8.8.8.8']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
