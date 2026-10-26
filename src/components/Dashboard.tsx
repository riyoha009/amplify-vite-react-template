// Import the necessary files and requirements to create the Dashboard
import { useState } from "react";
import "../App.css";
import WorkoutForm from "./WorkoutForm";
import { WorkoutSession } from "../models/WorkoutSession";

// Define the pages that users can navigate to in the Dashboard
type Page =
  | "Dashboard"
  | "My Workouts"
  | "My Meals"
  | "Progress"
  | "Fitness Goals"
  | "AI Assistant";

// Define the properties that the Dashboard component receives
type DashboardProps = {
  username: string;
  onSignOut: () => void;
};

// Responsible for displaying the application's pages
export default function Dashboard({
  username,
  onSignOut
}: DashboardProps) {
  
  // Track which page is currently selected in the sidebar
  const [page, setPage] = useState<Page>("Dashboard");
  
  // Controls whether the Add Workout form is visible
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  
  // Store the user's workout sessions in an array
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);

  // Save a completed workout to the workout history
  function handleSaveWorkout(workout: WorkoutSession) {
  setWorkouts(previous => [workout, ...previous]);
  setShowWorkoutForm(false);
}

  // Define the pages that will appear in the sidebar menu
  const menu: Page[] = [
    "Dashboard",
    "My Workouts",
    "My Meals",
    "Progress",
    "Fitness Goals",
    "AI Assistant"
  ];

  // Return the JSX thats defines the dashboard's UI
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="brand">FitTrack</h2>
        <p className="sidebar-label">YOUR WORKSPACE</p>

        <nav aria-label="Main navigation">
          {menu.map((item) => (
            <button
              key={item}
              className={
                page === item ? "nav-item active" : "nav-item"
              }
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
  <p className="sidebar-username">{username}</p>

  <button
    className="signout-button"
    onClick={onSignOut}
  >
    Sign Out
  </button>
</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR FITNESS SPACE</p>
            <h1>{page}</h1>
          </div>

          <div className="avatar" aria-label="User profile">
            FT
          </div>
        </header>

	{/* Only display the following content when Dashboard is selected */}
        {page === "Dashboard" && (
          <>
            <section className="welcome-card">
              <h2>Welcome to FitTrack</h2>
              <p>
                Track your training, nutrition, and fitness
                goals all in one place.
              </p>

              <button
                className="primary-button"
                onClick={() => setPage("My Workouts")}
              >
                View My Workouts
              </button>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <p>Total Workouts</p>
                <h2>0</h2>
                <span>All time</span>
              </div>

              <div className="stat-card">
                <p>Workouts This Week</p>
                <h2>0</h2>
                <span>Current week</span>
              </div>

              <div className="stat-card">
                <p>Active Goals</p>
                <h2>0</h2>
                <span>Goals in progress</span>
              </div>

              <div className="stat-card">
                <p>Training Minutes</p>
                <h2>0</h2>
                <span>All time</span>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="panel">
                <h2>Workout Activity</h2>

                <div className="empty-chart">
                  Your workout chart will appear here.
                </div>
              </div>

              <div className="panel">
                <h2>Recent Workouts</h2>
                <p className="muted">
                  No workouts recorded yet.
                </p>
              </div>
            </section>
          </>
        )}


{/* Only display the following when My Workouts is selected */}        
{page === "My Workouts" && (
  <>
    {showWorkoutForm ? (
      <WorkoutForm
        onSave={handleSaveWorkout}
        onCancel={() => setShowWorkoutForm(false)}
      />
    ) : (
      <section className="panel">
        <h2>My Workouts</h2>
        <p>Record and manage your workout sessions.</p>

        <button
          className="primary-button"
          onClick={() => setShowWorkoutForm(true)}
        >
          Add Workout
        </button>

        <div className="workout-history">
          <h3>Workout History</h3>

          {workouts.length === 0 ? (
            <p>No workouts recorded yet.</p>
          ) : (
            workouts.map(workout => (
              <div
                className="workout-history-card"
                key={workout.id}
              >
                <h4>{workout.workoutType}</h4>

                <p>
                  Date:{" "}
                  {new Date(workout.date).toLocaleDateString()}
                </p>

                {workout.muscleGroup && (
                  <p>
                    Muscle Group: {workout.muscleGroup}
                  </p>
                )}

                <p>
                  Exercises: {workout.getExerciseCount()}
                </p>

                <p>
                  Total Sets: {workout.getTotalSets()}
                </p>

                <p>
                  Total Volume: {workout.getTotalVolume()} lbs
                </p>

                {workout.exercises.map((exercise, index) => (
                  <div key={index}>
                    <h5>{exercise.name}</h5>

                    {exercise.sets.map(set => (
                      <p key={set.setNumber}>
                        Set {set.setNumber}: {set.reps} reps
                        at {set.weight} lbs
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </section>
    )}
  </>
)}


        {/* Only display the following when My Meals is selected */}
	{page === "My Meals" && (
          <>
            <section className="meal-summary">
              <div className="stat-card">
                <p>Calories Today</p>
                <h2>0</h2>
                <span>kcal consumed</span>
              </div>

              <div className="stat-card">
                <p>Protein</p>
                <h2>0 g</h2>
                <span>Today's total</span>
              </div>

              <div className="stat-card">
                <p>Carbohydrates</p>
                <h2>0 g</h2>
                <span>Today's total</span>
              </div>

              <div className="stat-card">
                <p>Fats</p>
                <h2>0 g</h2>
                <span>Today's total</span>
              </div>
            </section>

            <section className="panel">
              <div className="meal-header">
                <div>
                  <h2>Meal History</h2>
                  <p className="muted">
                    Track your meals and daily nutrition.
                  </p>
                </div>

                <button className="primary-button">
                  Add Meal
                </button>
              </div>

              <div className="meal-empty">
                <h3>No meals recorded yet</h3>
                <p>
                  Your meals will appear here once
                  you start logging them.
                </p>
              </div>
            </section>
          </>
        )}

	{/* This section is displayed when the Progress tab is selected; not fully functional yet*/}
        {page === "Progress" && (
          <section className="panel">
            <h2>My Progress</h2>
            <p>
              Your exercise progress and training charts
              will appear here.
            </p>
          </section>
        )}

	{/* This section is displayed when the Fitness Goals tab is selected; not fully functional yet */}
        {page === "Fitness Goals" && (
          <section className="panel">
            <h2>Fitness Goals</h2>
            <p>Set goals and monitor your progress.</p>

            <button className="primary-button">
              Add Goal
            </button>
          </section>
        )}

	{/* This section is displayed when the AI Assistant tab is selected; not fully functional yet */}
        {page === "AI Assistant" && (
          <section className="panel">
            <h2>AI Fitness Assistant</h2>
            <p>
              Soon you'll be able to ask questions about
              your workouts, nutrition, and fitness goals.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
