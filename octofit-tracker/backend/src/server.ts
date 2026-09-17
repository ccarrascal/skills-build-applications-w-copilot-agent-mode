import express from 'express';
import { apiBaseUrl, connectDatabase } from './config/database.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models/index.js';

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(express.json());

const fallbackUsers = [
  { id: 'user-1', name: 'Ada', email: 'ada@example.com', fitnessLevel: 'advanced' },
  { id: 'user-2', name: 'Sam', email: 'sam@example.com', fitnessLevel: 'intermediate' },
  { id: 'user-3', name: 'Priya', email: 'priya@example.com', fitnessLevel: 'beginner' },
];

const fallbackTeams = [
  { id: 'team-1', name: 'Trailblazers', members: 3, focus: 'endurance' },
  { id: 'team-2', name: 'Iron Pioneers', members: 2, focus: 'strength' },
];

const fallbackActivities = [
  { id: 'activity-1', userId: 'user-1', type: 'run', durationMinutes: 30, calories: 320 },
  { id: 'activity-2', userId: 'user-2', type: 'lift', durationMinutes: 45, calories: 280 },
];

const fallbackLeaderboard = [
  { id: 'leaderboard-1', userId: 'user-1', score: 980, rank: 1 },
  { id: 'leaderboard-2', userId: 'user-2', score: 870, rank: 2 },
];

const fallbackWorkouts = [
  { id: 'workout-1', title: 'HIIT Cardio', difficulty: 'moderate', durationMinutes: 25 },
  { id: 'workout-2', title: 'Strength Circuit', difficulty: 'advanced', durationMinutes: 40 },
];

const normalizeDocument = (item: Record<string, unknown> & { _id?: unknown }) => {
  const { _id, ...rest } = item;
  const id = typeof item.id === 'string' ? item.id : _id ? String(_id) : undefined;

  return {
    ...rest,
    ...(id ? { id } : {}),
  };
};

const buildResponse = (resource: string, data: Array<Record<string, unknown>>) => ({
  resource,
  count: data.length,
  baseUrl: apiBaseUrl,
  data,
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', baseUrl: apiBaseUrl });
});

app.get('/api/config', (_request, response) => {
  response.json({
    port,
    baseUrl: apiBaseUrl,
    codespaceName: process.env.CODESPACE_NAME || null,
  });
});

app.get('/api/users/', async (_request, response) => {
  try {
    const users = await User.find().lean<Record<string, unknown> & { _id?: unknown }[]>();
    const normalizedUsers = users.length > 0 ? users.map(normalizeDocument) : fallbackUsers.map((item) => normalizeDocument(item as Record<string, unknown> & { _id?: unknown }));
    response.json(buildResponse('users', normalizedUsers));
  } catch (error) {
    console.warn('Falling back to sample user data:', error);
    response.json(buildResponse('users', fallbackUsers.map((item) => normalizeDocument(item as Record<string, unknown> & { _id?: unknown }))));
  }
});

app.get('/api/teams/', async (_request, response) => {
  try {
    const teams = await Team.find().lean<Record<string, unknown> & { _id?: unknown }[]>();
    const normalizedTeams = teams.length > 0 ? teams.map(normalizeDocument) : fallbackTeams.map((item) => normalizeDocument(item as Record<string, unknown> & { _id?: unknown }));
    response.json(buildResponse('teams', normalizedTeams));
  } catch (error) {
    console.warn('Falling back to sample team data:', error);
    response.json(buildResponse('teams', fallbackTeams.map((item) => normalizeDocument(item as Record<string, unknown> & { _id?: unknown }))));
  }
});

app.get('/api/activities/', async (_request, response) => {
  try {
    const activities = await Activity.find().lean<Record<string, unknown> & { _id?: unknown }[]>();
    const normalizedActivities = activities.length > 0 ? activities.map(normalizeDocument) : fallbackActivities.map((item) => normalizeDocument(item as Record<string, unknown> & { _id?: unknown }));
    response.json(buildResponse('activities', normalizedActivities));
  } catch (error) {
    console.warn('Falling back to sample activity data:', error);
    response.json(buildResponse('activities', fallbackActivities.map((item) => normalizeDocument(item as Record<string, unknown> & { _id?: unknown }))));
  }
});

app.get('/api/leaderboard/', async (_request, response) => {
  try {
    const leaderboard = await LeaderboardEntry.find().lean<Record<string, unknown> & { _id?: unknown }[]>();
    const normalizedLeaderboard = leaderboard.length > 0 ? leaderboard.map(normalizeDocument) : fallbackLeaderboard.map((item) => normalizeDocument(item as Record<string, unknown> & { _id?: unknown }));
    response.json(buildResponse('leaderboard', normalizedLeaderboard));
  } catch (error) {
    console.warn('Falling back to sample leaderboard data:', error);
    response.json(buildResponse('leaderboard', fallbackLeaderboard.map((item) => normalizeDocument(item as Record<string, unknown> & { _id?: unknown }))));
  }
});

app.get('/api/workouts/', async (_request, response) => {
  try {
    const workouts = await Workout.find().lean<Record<string, unknown> & { _id?: unknown }[]>();
    const normalizedWorkouts = workouts.length > 0 ? workouts.map(normalizeDocument) : fallbackWorkouts.map((item) => normalizeDocument(item as Record<string, unknown> & { _id?: unknown }));
    response.json(buildResponse('workouts', normalizedWorkouts));
  } catch (error) {
    console.warn('Falling back to sample workout data:', error);
    response.json(buildResponse('workouts', fallbackWorkouts.map((item) => normalizeDocument(item as Record<string, unknown> & { _id?: unknown }))));
  }
});

const startServer = async () => {
  try {
    await connectDatabase();
  } catch (error) {
    console.warn('MongoDB is not available; API will continue with fallback mock data.', error);
  }

  app.listen(port, () => {
    console.log(`OctoFit API listening on port ${port}`);
    console.log(`API base URL: ${apiBaseUrl}`);
  });
};

startServer();