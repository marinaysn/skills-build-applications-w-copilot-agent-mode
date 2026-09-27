import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');
    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const teams = await Team.insertMany([
      { name: 'Velocity Vipers' },
      { name: 'Core Crusaders' },
      { name: 'Endurance Engineers' },
    ]);

    const users = await User.insertMany([
      { name: 'Maya Chen', email: 'maya.chen@example.com', teamId: teams[0]._id },
      { name: 'Jordan Rivera', email: 'jordan.rivera@example.com', teamId: teams[0]._id },
      { name: 'Avery Brooks', email: 'avery.brooks@example.com', teamId: teams[1]._id },
      { name: 'Sam Patel', email: 'sam.patel@example.com', teamId: teams[2]._id },
    ]);

    await Promise.all([
      Team.findByIdAndUpdate(teams[0]._id, { members: [users[0]._id, users[1]._id] }),
      Team.findByIdAndUpdate(teams[1]._id, { members: [users[2]._id] }),
      Team.findByIdAndUpdate(teams[2]._id, { members: [users[3]._id] }),
    ]);

    await Activity.insertMany([
      { userId: users[0]._id, type: 'Trail run', durationMinutes: 42, completedAt: new Date('2026-09-20T12:00:00Z') },
      { userId: users[1]._id, type: 'Strength circuit', durationMinutes: 35, completedAt: new Date('2026-09-21T12:00:00Z') },
      { userId: users[2]._id, type: 'Spin class', durationMinutes: 50, completedAt: new Date('2026-09-22T12:00:00Z') },
      { userId: users[3]._id, type: 'Yoga flow', durationMinutes: 30, completedAt: new Date('2026-09-23T12:00:00Z') },
      { userId: users[0]._id, type: 'Rowing intervals', durationMinutes: 28, completedAt: new Date('2026-09-24T12:00:00Z') },
    ]);

    await Leaderboard.insertMany([
      { userId: users[0]._id, points: 1480 },
      { userId: users[1]._id, points: 1325 },
      { userId: users[2]._id, points: 1210 },
      { userId: users[3]._id, points: 1095 },
    ]);

    await Workout.insertMany([
      {
        name: 'Morning Mobility Reset',
        difficulty: 'Beginner',
        durationMinutes: 20,
        description: 'Low-impact mobility work for hips, shoulders, and spine before a workday.',
      },
      {
        name: 'Lunch Break HIIT',
        difficulty: 'Intermediate',
        durationMinutes: 25,
        description: 'Bodyweight intervals mixing squats, pushups, planks, and recovery walks.',
      },
      {
        name: '5K Pace Builder',
        difficulty: 'Advanced',
        durationMinutes: 45,
        description: 'Structured tempo run with warmup, pace repeats, and cooldown.',
      },
      {
        name: 'Weekend Strength Base',
        difficulty: 'Intermediate',
        durationMinutes: 40,
        description: 'Full-body dumbbell strength session focused on legs, back, and core.',
      },
    ]);

    console.log('Database seeding complete');
    console.log(`Created ${users.length} users, ${teams.length} teams, 5 activities, 4 leaderboard entries, and 4 workouts`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
