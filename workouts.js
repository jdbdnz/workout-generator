/**
 * Example: Node.js module to generate a workout program based on date.
 *
 * /*
 * USAGE EXAMPLE:
 *
 * const today = new Date();
 * const workout = getWorkoutByDate(today);
 * console.log(workout);
 *
 * Sample Output (for a lower body day):
 * [
 *   {
 *     name: 'RDL',
 *     type: 'compound',
 *     unilateral: false,
 *     primaryMuscles: [ 'Hamstrings', 'Glutes' ],
 *     sets: 3,
 *     reps: '8-12'
 *   },
 *   {
 *     name: 'Bulgarian Split Squat',
 *     type: 'compound',
 *     unilateral: true,
 *     primaryMuscles: [ 'Quads', 'Glutes' ],
 *     sets: 3,
 *     reps: '8-12'
 *   },
 *   {
 *     name: 'Reverse Lunge',
 *     type: 'compound',
 *     unilateral: true,
 *     primaryMuscles: [ 'Quads', 'Glutes', 'Hamstrings' ],
 *     sets: 3,
 *     reps: '8-12'
 *   },
 *   {
 *     name: 'BOSU Hamstring Curl',
 *     type: 'isolation',
 *     unilateral: false,
 *     primaryMuscles: [ 'Hamstrings' ],
 *     sets: 3,
 *     reps: '15-20'
 *   },
 *   {
 *     name: 'Banded Side Steps',
 *     type: 'isolation',
 *     unilateral: true,
 *     primaryMuscles: [ 'Glute Medius / Abductors' ],
 *     sets: 3,
 *     reps: '15-20'
 *   }
 * ]
 *
 * */


/**
 * All available exercises (simplified).
 * You can expand or reduce these lists as desired.
 * Each exercise has:
 *   - name: string
 *   - type: 'compound' | 'isolation'
 *   - primaryMuscles: string[]
 *   - unilateral: boolean (whether it trains one side at a time)
 */
const LOWER_BODY_COMPOUND = [
  {
    name: 'RDL',
    type: 'compound',
    primaryMuscles: ['Hamstrings', 'Glutes'],
    unilateral: false
  },
  {
    name: 'Goblet Squat',
    type: 'compound',
    primaryMuscles: ['Quads', 'Glutes'],
    unilateral: false
  },
  {
    name: 'Bulgarian Split Squat',
    type: 'compound',
    primaryMuscles: ['Quads', 'Glutes'],
    unilateral: true
  },
  {
    name: 'Sumo Squat',
    type: 'compound',
    primaryMuscles: ['Quads', 'Glutes', 'Adductors'],
    unilateral: false
  },
  {
    name: 'Reverse Lunge',
    type: 'compound',
    primaryMuscles: ['Quads', 'Glutes', 'Hamstrings'],
    unilateral: true
  },
  {
    name: 'Step Up',
    type: 'compound',
    primaryMuscles: ['Quads', 'Glutes'],
    unilateral: true
  },
  {
    name: 'Single Leg RDL',
    type: 'compound',
    primaryMuscles: ['Hamstrings', 'Glutes'],
    unilateral: true
  }
];

const LOWER_BODY_ISOLATION = [
  {
    name: 'BOSU Hamstring Curl',
    type: 'isolation',
    primaryMuscles: ['Hamstrings'],
    unilateral: false
  },
  {
    name: 'Banded Side Steps',
    type: 'isolation',
    primaryMuscles: ['Glute Medius / Abductors'],
    unilateral: true
  },
  {
    name: 'Clam Shell',
    type: 'isolation',
    primaryMuscles: ['Glute Medius / Abductors'],
    unilateral: false
  }
];

const UPPER_BODY_COMPOUND = [
  {
    name: 'Chest Press',
    type: 'compound',
    primaryMuscles: ['Chest', 'Shoulders', 'Triceps'],
    unilateral: false
  },
  {
    name: 'Incline Chest Press',
    type: 'compound',
    primaryMuscles: ['Chest (Upper)', 'Shoulders', 'Triceps'],
    unilateral: false
  },
  {
    name: 'Shoulder Press',
    type: 'compound',
    primaryMuscles: ['Shoulders', 'Triceps'],
    unilateral: false
  },
  {
    name: 'Single Arm Bent Over Row',
    type: 'compound',
    primaryMuscles: ['Back', 'Biceps'],
    unilateral: true
  },
  {
    name: 'Quadruped Row',
    type: 'compound',
    primaryMuscles: ['Back', 'Biceps'],
    unilateral: true
  },
  {
    name: 'Chest Supported Row',
    type: 'compound',
    primaryMuscles: ['Back', 'Biceps'],
    unilateral: false
  },
  {
    name: 'Push-Ups',
    type: 'compound',
    primaryMuscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    unilateral: false
  },
  {
    name: 'Bench Dips',
    type: 'compound',
    primaryMuscles: ['Triceps', 'Chest', 'Shoulders'],
    unilateral: false
  },
  {
    name: 'Renegade Row',
    type: 'compound',
    primaryMuscles: ['Back', 'Biceps', 'Core'],
    unilateral: true
  }
];

const UPPER_BODY_ISOLATION = [
  {
    name: 'Bicep Curls',
    type: 'isolation',
    primaryMuscles: ['Biceps'],
    unilateral: false
  },
  {
    name: 'Hammer Curls',
    type: 'isolation',
    primaryMuscles: ['Biceps', 'Forearms'],
    unilateral: false
  },
  {
    name: 'Overhead Tricep Extension',
    type: 'isolation',
    primaryMuscles: ['Triceps'],
    unilateral: false
  },
  {
    name: 'Skull Crusher',
    type: 'isolation',
    primaryMuscles: ['Triceps'],
    unilateral: false
  },
  {
    name: 'Chest Fly',
    type: 'isolation',
    primaryMuscles: ['Chest'],
    unilateral: false
  },
  {
    name: 'Lat Pull Over',
    type: 'isolation',
    primaryMuscles: ['Lats'],
    unilateral: false
  },
  {
    name: 'Lateral Raises',
    type: 'isolation',
    primaryMuscles: ['Shoulders (Lateral Delts)'],
    unilateral: false
  }
];

/**
 * Helper to produce a seeded RNG so each date returns the same random results.
 * This is a simplistic approach: we turn YYYYMMDD into a number, then use it
 */
function createSeedFromDate(date) {
  // E.g. '2025-03-23' => 20250323
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return parseInt(`${yyyy}${mm}${dd}`);
}

/**
 * Main function to generate a workout for a given date.
 * Exports an array of exercise objects with sets/reps recommended.
 */
function getWorkoutByDate(date) {
  // 1) Determine if it's "Upper Body" day or "Lower Body" day.
  //    Simplistic approach: Even day of month => Lower, Odd day of month => Upper
  const dayOfMonth = date.getDate();
  const isLowerDay = (dayOfMonth % 2 === 0);

  // 2) Convert date to a seed for consistent RNG.
  const seed = createSeedFromDate(date);

  // Lodash doesn't have a built-in "seed" param for shuffle in standard,
  // but you can set up your own PRNG or rely on an external library.
  // For simplicity, let's store a small pseudo-seed object
  // and increment it each time we call getRandomExercises
  const seedObj = { current: seed };

  // We'll define a simple function that updates the seed.
  // (Not a robust PRNG, just a consistent technique for example.)
  function nextSeed() {
    // A super-simple linear congruential generator (LCG)-style update:
    // (seed * 9301 + 49297) % 233280
    seedObj.current = (seedObj.current * 9301 + 49297) % 233280;
    return seedObj.current;
  }

  // We'll monkey-patch our own shuffle that uses nextSeed
  // to scramble array in a consistent way.
  function seededShuffle(arr, sObj) {
    // Make a copy
    const newArr = arr.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
      // update the seed
      const randVal = nextSeed();
      // pick a random index
      const j = Math.floor(randVal % (i + 1));
      // swap
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  // Override getRandomExercises to use our seededShuffle
  function getRandomExercisesSeeded(array, count) {
    const shuffled = seededShuffle(array, seedObj);
    return shuffled.slice(0, count);
  }

  // 3) Build the workout
  let workout = [];

  if (isLowerDay) {
    // Lower Body Day

    // a) Pick 2-3 compound exercises.
    const lowerCompound = getRandomExercisesSeeded(LOWER_BODY_COMPOUND, 3);

    // b) Ensure at least one is unilateral. If not, swap one out.
    if (!lowerCompound.some(ex => ex.unilateral)) {
      // Insert a known unilateral from the list (e.g. Bulgarian Split Squat or Reverse Lunge)
      // We'll just forcibly pick 1 unilateral from the pool and then replace the last one in the array
      const unilateralPool = LOWER_BODY_COMPOUND.filter(ex => ex.unilateral);
      // Unilateral pick
      lowerCompound[lowerCompound.length - 1] = getRandomExercisesSeeded(unilateralPool, 1)[0];
    }

    // We'll limit ourselves to exactly 3 compounds for this example.
    const finalLowerCompound = lowerCompound.slice(0, 3);

    // c) Pick 1-2 isolation exercises
    const lowerIsolation = getRandomExercisesSeeded(LOWER_BODY_ISOLATION, 2);
    // Combine them
    workout = [...finalLowerCompound, ...lowerIsolation];
  } else {
    // Upper Body Day

    // a) Pick 2-3 compound exercises.
    const upperCompound = getRandomExercisesSeeded(UPPER_BODY_COMPOUND, 3);

    // b) Ensure at least one unilateral
    if (!upperCompound.some(ex => ex.unilateral)) {
      // Insert a unilateral from the pool
      const unilateralPool = UPPER_BODY_COMPOUND.filter(ex => ex.unilateral);
      // Unilateral pick
      upperCompound[upperCompound.length - 1] = getRandomExercisesSeeded(unilateralPool, 1)[0];;
    }
    const finalUpperCompound = upperCompound.slice(0, 3);

    // c) Pick 1-2 isolation exercises
    const upperIsolation = getRandomExercisesSeeded(UPPER_BODY_ISOLATION, 2);

    // Combine them
    workout = [...finalUpperCompound, ...upperIsolation];
  }

  // 4) Attach recommended sets/reps and return workoutWithSetsReps
  //    - Compound: 3 x 8-12
  //    - Isolation: 3 x 12-15 (or 3 x 15-20 for some glute/leg isolation)

  return workout.map(ex => {
    let sets = 3;
    let repsRange = '8-12';

    // If it's isolation, we might go 12-15 or 15-20 for glutes
    if (ex.type === 'isolation') {
      // Quick hack: if it hits glutes or hamstrings we might do 15-20,
      // otherwise 12-15
      const primary = ex.primaryMuscles.map(m => m.toLowerCase()).join(' ');
      if (primary.includes('glute') || primary.includes('hamstring')) {
        repsRange = '15-20';
      } else {
        repsRange = '12-15';
      }
    }

    return {
      name: ex.name,
      type: ex.type,
      unilateral: ex.unilateral,
      primaryMuscles: ex.primaryMuscles,
      sets: sets,
      reps: repsRange
    };
  });
}

// If you want to expose the function as the main export:
export { getWorkoutByDate }
