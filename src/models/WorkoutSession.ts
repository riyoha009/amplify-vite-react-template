
import { Exercise } from "./Exercise";
import type { WorkoutType, MuscleGroup } from "./WorkoutType";

export class WorkoutSession {
  public exercises: Exercise[] = [];

  constructor(
    public id: string,
    public workoutType: WorkoutType,
    public date: string,
    public muscleGroup?: MuscleGroup
  ) {}

  // Add an exercise to the workout
  addExercise(exercise: Exercise): void {
    this.exercises.push(exercise);
  }

  // Remove an exercise by its position
  removeExercise(index: number): void {
    if (!Number.isInteger(index) ||
        index < 0 ||
        index >= this.exercises.length) {
      throw new Error("Invalid exercise index.");
    }

    this.exercises.splice(index, 1);
  }

  // Count the number of exercises
  getExerciseCount(): number {
    return this.exercises.length;
  }

  // Count all sets across all exercises
  getTotalSets(): number {
    return this.exercises.reduce(
      (total, exercise) => total + exercise.getSetCount(),
      0
    );
  }

  // Calculate the total workout volume
  getTotalVolume(): number {
    return this.exercises.reduce(
      (total, exercise) => total + exercise.getTotalVolume(),
      0
    );
  }

  // Return a summary of the workout
  getSummary(): string {
    return `${this.workoutType} on ${this.date}: ` +
      `${this.getExerciseCount()} exercises, ` +
      `${this.getTotalSets()} sets`;
  }
}
