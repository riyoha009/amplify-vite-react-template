// Define the WorkoutSet class to represent a single set of an exercise
export class WorkoutSet {
  
  // Initialize a workout set with its set number, repetitions, and weight
  constructor(
    public setNumber: number,
    public reps: number,
    public weight: number
  ) {
    if (!Number.isInteger(setNumber) || setNumber <= 0) {
      throw new Error(
        "Set number must be a positive integer."
      );
    }

    if (!Number.isInteger(reps) || reps <= 0) {
      throw new Error(
        "Reps must be a positive integer."
      );
    }

    if (!Number.isFinite(weight) || weight < 0) {
      throw new Error(
        "Weight must be zero or greater."
      );
    }
  }

  // Return a readable summary of the set's repetitions and weight
  getSummary(): string {
    return `Set ${this.setNumber}: ${this.reps} reps at ${this.weight} lbs`;
  }
}
