import mongoose from 'mongoose';

export const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
export const codespaceName = process.env.CODESPACE_NAME;
export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

export async function connectDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');
    return mongoose.connection;
  } catch (error) {
    console.error('Error connecting to octofit_db:', error);
    throw error;
  }
}

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

export default mongoose.connection;
