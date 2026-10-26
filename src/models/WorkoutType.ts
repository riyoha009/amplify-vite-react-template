// Define three valid workout types
export type WorkoutType =
  | "Weight Lifting"
  | "Cardio"
  | "Yoga";

// Store the workout types in an arry for use in the workout form
export const WORKOUT_TYPES: WorkoutType[] = [
  "Weight Lifting",
  "Cardio",
  "Yoga"
];

// Define the available muscle groups for weightlifting exercises
// 'as const' prevents these values from being changed
export const MUSCLE_GROUPS = [
  "Back",
  "Chest",
  "Shoulders",
  "Arms",
  "Legs",
  "Core"
] as const;

// Creates a MuscleGroup type from the values in the MUSCLE_GROUPS array
export type MuscleGroup =
  (typeof MUSCLE_GROUPS)[number];
