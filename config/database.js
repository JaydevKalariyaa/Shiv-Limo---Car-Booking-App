const mongoose = require('mongoose');

// Connection options for better performance and reliability
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: process.env.NODE_ENV === 'production' ? 5 : 10, // Smaller pool for serverless
  minPoolSize: 1, // Minimum connections in pool
  serverSelectionTimeoutMS: 10000, // Increased timeout for production
  socketTimeoutMS: 45000, // Socket timeout
  connectTimeoutMS: 30000, // Connection timeout
  retryWrites: true, // Enable retryable writes
  w: 'majority', // Write concern
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  heartbeatFrequencyMS: 10000, // Heartbeat frequency
};

// Global variable to cache the connection
let cachedConnection = null;

// Function to connect to MongoDB with caching and retry
const connectToDatabase = async (retryCount = 0) => {
  const maxRetries = 3;
  
  // If we already have a cached connection, return it
  if (cachedConnection) {
    console.log('Using cached database connection');
    return cachedConnection;
  }

  try {
    console.log(`Creating new database connection... (attempt ${retryCount + 1})`);
    
    // Create new connection
    const connection = await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    
    // Cache the connection
    cachedConnection = connection;
    
    console.log('MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cachedConnection = null; // Clear cache on error
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cachedConnection = null; // Clear cache on disconnect
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      cachedConnection = mongoose.connection; // Update cache
    });
    
    return connection;
  } catch (error) {
    console.error(`Failed to connect to MongoDB (attempt ${retryCount + 1}):`, error);
    cachedConnection = null; // Clear cache on error
    
    // Retry logic
    if (retryCount < maxRetries) {
      console.log(`Retrying connection in 2 seconds... (${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return connectToDatabase(retryCount + 1);
    }
    
    throw error;
  }
};

// Function to close the database connection
const closeDatabaseConnection = async () => {
  if (cachedConnection) {
    await mongoose.connection.close();
    cachedConnection = null;
    console.log('Database connection closed');
  }
};

// Function to check if database is connected
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  isDatabaseConnected,
  mongoose
}; 