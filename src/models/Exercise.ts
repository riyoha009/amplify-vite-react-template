// Importing the necessary classes and types that will be used by Exercise
import { WorkoutSet } from "./WorkoutSet";
import type { MuscleGroup } from "./WorkoutType";

// Define the exercise class to represent an exercise and its workout sets
export class Exercise {
  public sets: WorkoutSet[] = [];

  // Initialize an exercise with its name and target muscle group
  constructor(
    public name: string,
    public muscleGroup: MuscleGroup
  ) {
    if (name.trim() === "") {
      throw new Error("Exercise name cannot be empty.");
    }
  }

  // Add a new set to this exercise
  addSet(reps: number, weight: number): void {
    const setNumber = this.sets.length + 1;

    const newSet = new WorkoutSet(
      setNumber,
      reps,
      weight
    );

    this.sets.push(newSet);
  }

  // Remove a set and renumber the remaining sets
  removeSet(setNumber: number): void {
    this.sets = this.sets.filter(
      set => set.setNumber !== setNumber
    );

    this.sets.forEach((set, index) => {
      set.setNumber = index + 1;
    });
  }

  // Return the number of sets
  getSetCount(): number {
    return this.sets.length;
  }

  // Calculate total weightlifting volume
  getTotalVolume(): number {
    return this.sets.reduce(
      (total, set) => total + set.reps * set.weight,
      0
    );
  }

  // Return a summary of the exercise
  getSummary(): string {
    return `${this.name} (${this.muscleGroup}): ${this.getSetCount()} sets`;
  }
}
