
export type WorkoutType =
  | "Weight Lifting"
  | "Cardio"
  | "Yoga";

export const WORKOUT_TYPES: WorkoutType[] = [
  "Weight Lifting",
  "Cardio",
  "Yoga"
];

export const MUSCLE_GROUPS = [
  "Back",
  "Chest",
  "Shoulders",
  "Arms",
  "Legs"
] as const;

export type MuscleGroup =
  (typeof MUSCLE_GROUPS)[number];
