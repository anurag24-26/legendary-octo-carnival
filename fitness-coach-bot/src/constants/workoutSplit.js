// The split is a CYCLE, not tied to calendar days.
// A user's `splitIndex` (stored on their profile) points to the NEXT workout
// they owe. It only advances on /done, never on the calendar clock.
// This is what makes missed workouts "shift" everything automatically —
// skipping a day just means tomorrow's /today still shows today's owed workout.
export const WORKOUT_SPLIT = [
  {
    key: "chest_shoulders_1",
    label: "Chest + Shoulders",
    emoji: "🏋️",
    focus: ["Upper Chest", "Front/Side Delts", "Pressing Strength"],
    exercises: [
      "Incline Pike/Backpack Press x4",
      "Standing Pike Push-up x4",
      "Chair Dips x4",
      "Backpack Front Raise x3",
      "Backpack Lateral Raise x3",
      "Wall Handstand Hold x3",
    ],
  },
  {
    key: "back_arms_1",
    label: "Back + Arms",
    emoji: "🦾",
    focus: ["Upper Back Width", "Posture", "Biceps/Triceps"],
    exercises: [
      "Backpack Bent-over Row x4",
      "Superman Hold x4",
      "Doorframe/Towel Row x4",
      "Backpack Bicep Curl x3",
      "Diamond Push-up (Triceps) x3",
      "Reverse Snow Angel x3",
    ],
  },
  {
    key: "fatloss_core",
    label: "Fat Loss + Core",
    emoji: "🔥",
    focus: ["Body Fat Reduction", "Core", "Conditioning"],
    exercises: [
      "Jump Rope / High Knees x5min",
      "Mountain Climbers x4",
      "Plank x4",
      "Bicycle Crunches x4",
      "Burpees x3",
      "Water Bottle Woodchoppers x3",
    ],
  },
  {
    key: "chest_shoulders_2",
    label: "Chest + Shoulders",
    emoji: "🏋️",
    focus: ["Upper Chest", "Shoulder Width", "Volume"],
    exercises: [
      "Decline Push-up (feet on chair) x4",
      "Pike Push-up x4",
      "Backpack Arnold Press x3",
      "Backpack Front Raise x3",
      "Wide Push-up x3",
      "Chair Dips x3",
    ],
  },
  {
    key: "back_arms_2",
    label: "Back + Arms",
    emoji: "🦾",
    focus: ["Back Thickness", "Posture", "Arm Definition"],
    exercises: [
      "Backpack Row (wide grip) x4",
      "Towel Bicep Curl x4",
      "Superman Row x3",
      "Close-grip Push-up (Triceps) x3",
      "Backpack Hammer Curl x3",
      "Reverse Fly with Bottles x3",
    ],
  },
  {
    key: "shoulder_specialization",
    label: "Shoulder Specialization",
    emoji: "💪",
    focus: ["3D Delts", "V-Taper", "Shoulder Width"],
    exercises: [
      "Backpack Lateral Raise x5",
      "Pike Push-up x4",
      "Backpack Front Raise x4",
      "Backpack Rear Delt Fly x4",
      "Wall Handstand Hold x3",
      "Arm Circles (weighted) x3",
    ],
  },
  {
    key: "recovery",
    label: "Recovery",
    emoji: "🧘",
    focus: ["Mobility", "Sleep", "Joint Health"],
    exercises: [
      "Light Walk 20-30min",
      "Full Body Stretch 10min",
      "Shoulder Mobility Drill x3",
      "Deep Breathing / Posture Reset 5min",
    ],
  },
];

export function getWorkoutByIndex(index) {
  const i = ((index % WORKOUT_SPLIT.length) + WORKOUT_SPLIT.length) % WORKOUT_SPLIT.length;
  return WORKOUT_SPLIT[i];
}
