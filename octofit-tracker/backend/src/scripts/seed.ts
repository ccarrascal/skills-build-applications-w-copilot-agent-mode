import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { name: 'Ada', email: 'ada@example.com', fitnessLevel: 'advanced' },
      { name: 'Sam', email: 'sam@example.com', fitnessLevel: 'intermediate' },
      { name: 'Priya', email: 'priya@example.com', fitnessLevel: 'beginner' },
      { name: 'Leo', email: 'leo@example.com', fitnessLevel: 'advanced' },
    ]);

    const teams = await Team.insertMany([
      { name: 'Trailblazers', members: 3, focus: 'endurance' },
      { name: 'Iron Pioneers', members: 2, focus: 'strength' },
      { name: 'Sunrise Striders', members: 4, focus: 'mobility' },
    ]);

    const activities = await Activity.insertMany([
      { userId: users[0]._id.toString(), type: 'run', durationMinutes: 30, calories: 320 },
      { userId: users[1]._id.toString(), type: 'lift', durationMinutes: 45, calories: 280 },
      { userId: users[2]._id.toString(), type: 'cycle', durationMinutes: 40, calories: 360 },
    ]);

    const leaderboard = await LeaderboardEntry.insertMany([
      { userId: users[0]._id.toString(), score: 980, rank: 1 },
      { userId: users[3]._id.toString(), score: 920, rank: 2 },
      { userId: users[1]._id.toString(), score: 870, rank: 3 },
    ]);

    const workouts = await Workout.insertMany([
      { title: 'HIIT Cardio', difficulty: 'moderate', durationMinutes: 25 },
      { title: 'Strength Circuit', difficulty: 'advanced', durationMinutes: 40 },
      { title: 'Recovery Yoga Flow', difficulty: 'beginner', durationMinutes: 20 },
    ]);

    console.log('Seeded users:', users.length);
    console.log('Seeded teams:', teams.length);
    console.log('Seeded activities:', activities.length);
    console.log('Seeded leaderboard entries:', leaderboard.length);
    console.log('Seeded workouts:', workouts.length);
    console.log('Database seeding complete');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
