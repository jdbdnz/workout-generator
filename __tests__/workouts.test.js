import {describe, expect, test, beforeAll} from 'vitest';

import {JSDOM} from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('getWorkoutByDate', () => {
  let getWorkoutByDate;

  beforeAll(async () => {
    // Read the HTML file
    const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');

    // Create a new JSDOM instance
    const dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: `file://${path.resolve(__dirname, '../index.html')}`,
    });

    // Wait for scripts to load and execute
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the window object
    const window = dom.window;

    // If getWorkoutByDate is still undefined, we need to debug
    if (typeof window.getWorkoutByDate !== 'function') {
      console.error('getWorkoutByDate is not defined on window. HTML content:', html);
      throw new Error('getWorkoutByDate is not defined');
    } else {
      // Now you can access getWorkoutByDate
      getWorkoutByDate = window.getWorkoutByDate;
    }
  });

  test('returns a workout for a given date', () => {
    const date = new Date('2023-07-01'); // A specific date for consistent results
    const workout = getWorkoutByDate(date);

    // Check if the workout is an array
    expect(Array.isArray(workout)).toBe(true);

    // Check if the workout has the expected number of exercises
    expect(workout.length).toBeGreaterThanOrEqual(3);
    expect(workout.length).toBeLessThanOrEqual(5);

    // Check if each exercise has the required properties
    workout.forEach(exercise => {
      expect(exercise).toHaveProperty('name');
      expect(exercise).toHaveProperty('type');
      expect(exercise).toHaveProperty('unilateral');
      expect(exercise).toHaveProperty('primaryMuscles');
      expect(exercise).toHaveProperty('sets');
      expect(exercise).toHaveProperty('reps');
    });
  });

  test('starts with compound exercises', () => {
    const workout = getWorkoutByDate(new Date());
    const firstExercises = workout.slice(0, 2);
    expect(firstExercises.every(ex => ex.type === 'compound')).toBe(true);
  });

  test('includes 2-3 compound exercises', () => {
    const workout = getWorkoutByDate(new Date());
    const compoundExercises = workout.filter(ex => ex.type === 'compound');
    expect(compoundExercises.length).toBeGreaterThanOrEqual(2);
    expect(compoundExercises.length).toBeLessThanOrEqual(3);
  });

  test('includes isolation exercises after compound exercises', () => {
    const workout = getWorkoutByDate(new Date());
    const firstIsolationIndex = workout.findIndex(ex => ex.type === 'isolation');
    const lastCompoundIndex = workout.findLastIndex(ex => ex.type === 'compound');
    expect(firstIsolationIndex).toBeGreaterThan(lastCompoundIndex);
  });

  test('includes at least one unilateral exercise', () => {
    const workout = getWorkoutByDate(new Date());
    const hasUnilateral = workout.some(ex => ex.unilateral);
    expect(hasUnilateral).toBe(true);
  });

  test('alternates between upper and lower body workouts', () => {
    const date1 = new Date('2023-07-01');
    const date2 = new Date('2023-07-02');
    const workout1 = getWorkoutByDate(date1);
    const workout2 = getWorkoutByDate(date2);

    const isLowerBody = (w) => w.some(ex => ex.primaryMuscles.some(m => ['Quads', 'Hamstrings', 'Glutes'].includes(m)));
    expect(isLowerBody(workout1)).not.toBe(isLowerBody(workout2));
  });

  test('sets and reps are within expected ranges', () => {
    const workout = getWorkoutByDate(new Date());
    workout.forEach(exercise => {
      expect(exercise.sets).toBe(3);
      if (exercise.type === 'compound') {
        expect(exercise.reps).toBe('8-12');
      } else {
        expect(['12-15', '15-20']).toContain(exercise.reps);
      }
    });
  });

  test('lower body workout includes exercises for hamstrings, glutes, and quads', () => {
    const date = new Date('2023-07-01'); // Ensure this is a lower body day
    const workout = getWorkoutByDate(date);
    const muscleGroups = workout.flatMap(ex => ex.primaryMuscles);
    expect(muscleGroups).toContain('Hamstrings');
    expect(muscleGroups).toContain('Glutes');
    expect(muscleGroups).toContain('Quads');
  });

  test('upper body workout includes exercises for chest, back, and arms', () => {
    const date = new Date('2023-07-02'); // Ensure this is an upper body day
    const workout = getWorkoutByDate(date);
    const muscleGroups = workout.flatMap(ex => ex.primaryMuscles);
    expect(muscleGroups.some(m => ['Chest', 'Pecs'].includes(m))).toBe(true);
    expect(muscleGroups.some(m => ['Back', 'Lats'].includes(m))).toBe(true);
    expect(muscleGroups.some(m => ['Biceps', 'Triceps'].includes(m))).toBe(true);
  });
});
