/*
This component provides the user interface for recording new workouts.
User can select a workout type and muscle group, add exercises, and record
number of sets, reps, and weight for each exercise. WorkoutForm validates
the entered information, creates a WorkoutSession object, and passes the
completed workout to the Dashboard for saving in the workout history. We
will have to change this around as we complete the Cardio and Yoga sections.
ChatGPT aided us in writing this code.
*/
  
import { useState } from "react";
import type { FormEvent } from "react";
import { Exercise } from "../models/Exercise";
import { WorkoutSession } from "../models/WorkoutSession";
import {
  WORKOUT_TYPES,
  MUSCLE_GROUPS
} from "../models/WorkoutType";
import type {
  WorkoutType,
  MuscleGroup
} from "../models/WorkoutType";

type WorkoutFormProps = {
  onSave: (workout: WorkoutSession) => void;
  onCancel: () => void;
};

type SetInput = {
  reps: string;
  weight: string;
};

type ExerciseInput = {
  name: string;
  sets: SetInput[];
};

function newExercise(): ExerciseInput {
  return {
    name: "",
    sets: [{ reps: "", weight: "" }]
  };
}

export default function WorkoutForm({
  onSave,
  onCancel
}: WorkoutFormProps) {
  const [workoutType, setWorkoutType] =
    useState<WorkoutType>("Weight Lifting");

  const [muscleGroup, setMuscleGroup] =
    useState<MuscleGroup>("Chest");

  const [exercises, setExercises] =
    useState<ExerciseInput[]>([newExercise()]);

  const [error, setError] = useState("");

  function addExercise() {
    setExercises(previous => [
      ...previous,
      newExercise()
    ]);
  }

  function removeExercise(index: number) {
    setExercises(previous =>
      previous.filter((_, i) => i !== index)
    );
  }

  function updateExerciseName(
    index: number,
    name: string
  ) {
    setExercises(previous =>
      previous.map((exercise, i) =>
        i === index
          ? { ...exercise, name }
          : exercise
      )
    );
  }

  function addSet(exerciseIndex: number) {
    setExercises(previous =>
      previous.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                { reps: "", weight: "" }
              ]
            }
          : exercise
      )
    );
  }

  function removeSet(
    exerciseIndex: number,
    setIndex: number
  ) {
    setExercises(previous =>
      previous.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.filter(
                (_, j) => j !== setIndex
              )
            }
          : exercise
      )
    );
  }

  function updateSet(
    exerciseIndex: number,
    setIndex: number,
    field: keyof SetInput,
    value: string
  ) {
    setExercises(previous =>
      previous.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, j) =>
                j === setIndex
                  ? { ...set, [field]: value }
                  : set
              )
            }
          : exercise
      )
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (workoutType !== "Weight Lifting") {
      setError(
        "Cardio and Yoga will be implemented later."
      );
      return;
    }

    try {
      const workout = new WorkoutSession(
        crypto.randomUUID(),
        workoutType,
        new Date().toISOString(),
        muscleGroup
      );

      if (exercises.length === 0) {
        throw new Error("Add at least one exercise.");
      }

      for (const exerciseInput of exercises) {
        if (!exerciseInput.name.trim()) {
          throw new Error(
            "Every exercise must have a name."
          );
        }

        if (exerciseInput.sets.length === 0) {
          throw new Error(
            "Every exercise needs at least one set."
          );
        }

        const exercise = new Exercise(
          exerciseInput.name.trim(),
          muscleGroup
        );

        for (const set of exerciseInput.sets) {
          const reps = Number(set.reps);
          const weight = Number(set.weight);

          if (
            set.reps.trim() === "" ||
            set.weight.trim() === ""
          ) {
            throw new Error(
              "Enter reps and weight for every set."
            );
          }

          exercise.addSet(reps, weight);
        }

        workout.addExercise(exercise);
      }

      onSave(workout);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save workout."
      );
    }
  }

  return (
    <div className="workout-form-container">
      <h2>Add Workout</h2>

      <form onSubmit={handleSubmit}>
        <div className="workout-field">
          <label htmlFor="workout-type">
            Workout Type
          </label>

          <select
            id="workout-type"
            value={workoutType}
            onChange={event =>
              setWorkoutType(
                event.target.value as WorkoutType
              )
            }
          >
            {WORKOUT_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {workoutType === "Weight Lifting" ? (
          <>
            <div className="workout-field">
              <label htmlFor="muscle-group">
                Muscle Group
              </label>

              <select
                id="muscle-group"
                value={muscleGroup}
                onChange={event =>
                  setMuscleGroup(
                    event.target.value as MuscleGroup
                  )
                }
              >
                {MUSCLE_GROUPS.map(group => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {exercises.map((exercise, exerciseIndex) => (
              <div
                className="workout-exercise"
                key={exerciseIndex}
              >
                <h3>
                  Exercise {exerciseIndex + 1}
                </h3>

                <div className="workout-field">
                  <label>
                    Exercise Name
                    <input
                      type="text"
                      value={exercise.name}
                      placeholder="e.g. Bench Press"
                      onChange={event =>
                        updateExerciseName(
                          exerciseIndex,
                          event.target.value
                        )
                      }
                    />
                  </label>
                </div>

                {exercise.sets.map((set, setIndex) => (
                  <div
                    className="workout-set-row"
                    key={setIndex}
                  >
                    <span>Set {setIndex + 1}</span>

                    <label>
                      Reps
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={set.reps}
                        onChange={event =>
                          updateSet(
                            exerciseIndex,
                            setIndex,
                            "reps",
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      Weight (lbs)
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={set.weight}
                        onChange={event =>
                          updateSet(
                            exerciseIndex,
                            setIndex,
                            "weight",
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        removeSet(
                          exerciseIndex,
                          setIndex
                        )
                      }
                      disabled={exercise.sets.length === 1}
                    >
                      Remove Set
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addSet(exerciseIndex)}
                >
                  + Add Set
                </button>

                <button
                  type="button"
                  onClick={() =>
                    removeExercise(exerciseIndex)
                  }
                  disabled={exercises.length === 1}
                >
                  Remove Exercise
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addExercise}
            >
              + Add Exercise
            </button>
          </>
        ) : (
          <p>
            {workoutType} workouts are coming soon.
          </p>
        )}

        {error && (
          <p className="workout-error" role="alert">
            {error}
          </p>
        )}

        <div className="workout-form-actions">
          <button
            type="submit"
            disabled={workoutType !== "Weight Lifting"}
          >
            Save Workout
          </button>

          <button
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
