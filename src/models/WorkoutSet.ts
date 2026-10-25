
export class WorkoutSet {
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

  getSummary(): string {
    return `Set ${this.setNumber}: ${this.reps} reps at ${this.weight} lbs`;
  }
}
