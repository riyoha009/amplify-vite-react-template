// Import the necessary files and requirements to create the Dashboard
import { useState, useEffect } from "react";
import "../App.css";
import WorkoutForm from "./WorkoutForm";
import { WorkoutSession } from "../models/WorkoutSession";
import MealForm from "./MealForm";
import { Meal } from "../models/Meal";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { FoodItem } from "../models/FoodItem";

// Creates a client we can use to perform database operations
const client = generateClient<Schema>();

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

  // Controls whether the Add Meal form is visible
  const [showMealForm, setShowMealForm] = useState(false);
  
  // Stores the array of Meal objects displayed in Meal History
  const [meals, setMeals] = useState<Meal[]>([]);

  // This function retrieves previously saved Meals and their associated Food Items from AWS Amplify,
  // reconstructs them as TypeScript objects,
  // and displays them in FitTrack Meal History
  useEffect(() => {
    async function loadMeals() {
      const { data, errors } = await client.models.Meal.list();

      // ? operator is optional chaining
      // allows JavaScript to check errors.length w/o throwing an error if errors is
      // null or undefined
      if (errors?.length) {
        console.error("Failed to load meals:", errors);
	return;
      }

      // Iterate through Meal records retrieved from AWS Amplify and
      // create a new Meal object for each one
      const loadedMeals = data.map(async record => {
        const meal = new Meal(record.name, new Date(record.date));
	meal.id = record.id;
        const { data: foodRecords, errors: foodErrors } = await record.foods();

	if (foodErrors?.length) {
	  console.error("Failed to load food items:", foodErrors);
	  throw new Error("Could not load food items.");
        }

        // Reconstruct FoodItem objects, then add it to current Meal object's foods array
	foodRecords.forEach(foodRecord => {
          const foodItem = new FoodItem(
            foodRecord.name,
            foodRecord.servings,
            foodRecord.calories,
            foodRecord.carbohydrates,
            foodRecord.protein,
            foodRecord.fats
          );

          meal.addFood(foodItem);
        });
        return meal;
      });

      // An array of Promises is initially produced for loadedMeals array
      // A Promise represents the eventual result of an asynchronous operation
      // Promise.all() waits until every Promise has successfully resolved
      // setMeals() updates state 
      const completedMeals = await Promise.all(loadedMeals);
      setMeals(completedMeals);
    }
    void loadMeals();
  }, []);

  // Save a completed workout to the workout history
  function handleSaveWorkout(workout: WorkoutSession) {
  setWorkouts(previous => [workout, ...previous]);
  setShowWorkoutForm(false);
}

  // Saves a completed meal and all of its food items to AWS Amplify database and
  // updates meal history displayed in FitTrack
  async function handleSaveMeal(meal: Meal) {
    try {
      const { data: savedMeal, errors } = await client.models.Meal.create({
        name: meal.name,
	date: meal.date.toISOString()
      });

      if (errors?.length || !savedMeal) {
        console.error("Failed to save meal:", errors);
	alert("Could not save the meal.");
	return;
      }

      // Assign database ID to the Meal object
      meal.id = savedMeal.id;

      // Creates a separate database record for each food item
      for (const foodItem of meal.foods) {
        const { errors: foodErrors } = await client.models.FoodItem.create({
          name: foodItem.name,
	  servings: foodItem.servings,
	  calories: foodItem.calories,
	  carbohydrates: foodItem.carbohydrates,
	  protein: foodItem.protein,
	  fats: foodItem.fats,
	  mealId: savedMeal.id
	});

        if (foodErrors?.length) {
	  console.error("Failed to save food item:", foodErrors);
	  alert("A food item could not be saved.");
	  return;
	}
      }

      // Updates the Meal History state in React
      // Creates new array, copies elements from previousMeals and appends newly saved meal to it
      // Hides form after meal has been saved successfully
      setMeals(previousMeals => [...previousMeals, meal]);
      setShowMealForm(false);
      
    } catch (error) {
        console.error("Error saving meal:", error);
        alert("An error occurred while saving the meal.");
    }
  }

  // Identifies which meal the user wants to delete,
  // retrieves its associated food items from AWS Amplify,
  // deletes food items and meal from database 
  async function handleDeleteMeal(index: number) {
    const confirmed = window.confirm("Are you sure you want to delete this meal?");
    if (!confirmed) {
      return;
    }

    const mealToDelete = meals[index];
    if (!mealToDelete || !mealToDelete.id) {
      alert("Could not find the saved meal.");
      return;
    }

    try {

    // Retrieves food item records associated w/ the meal using filter
    // Uses mealId to associate food items w/ the correct meal 
    const { data: foodRecords, errors: foodErrors } =
      await client.models.FoodItem.list({
        filter: {
	  mealId: {
	    eq: mealToDelete.id
	  }
	}
      });

    if (foodErrors?.length) {
      console.error("Failed to retrieve food items:", foodErrors);
      alert("Could not retrieve the meal's food items.");
      return;
    }

    // Loops through foodRecords and deletes each FoodItem
    for (const foodRecord of foodRecords) {
      const { errors: deleteErrors } = await client.models.FoodItem.delete({
        id: foodRecord.id
      });

      if (deleteErrors?.length) {
        console.error("Failed to delete food item:", deleteErrors);
	alert("Could not delete all food items.");
	return;
      }
    }

    // Deletes the Meal from AWS Amplify
    const { errors: mealDeleteErrors } = await client.models.Meal.delete({
      id: mealToDelete.id
    });

    if (mealDeleteErrors?.length) {
      console.error("Failed to delete meal:", mealDeleteErrors);
      alert("Could not delete the meal.");
      return;
    } 

    // Updates the React state
    setMeals(previousMeals =>
      previousMeals.filter(meal => meal.id !== mealToDelete.id)
    );
    
    } catch (error) {
      console.error("Error deleting meal:", error);
      alert("An error occurred while deleting the meal.");
    }
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

	    {showMealForm ? (
	      <MealForm
	        onSave={handleSaveMeal}
	        onCancel={() => setShowMealForm(false)}
	      />
	    ) : (

            <section className="panel">
              <div className="meal-header">
                <div>
                  <h2>Meal History</h2>
                  <p className="muted">
                    Track your meals and daily nutrition.
                  </p>
                </div>

                <button className="primary-button" onClick={() => setShowMealForm(true)}>
                  Add Meal
                </button>
              </div>

	    {meals.length === 0 ? (
              <div className="meal-empty">
                <h3>No meals recorded yet</h3>
                <p>
                  Your meals will appear here once
                  you start logging them.
                </p>
              </div>
	    ) : (
	      <div className="meal-history">
	        {meals.map((meal, index) => (
		  <div key={index}>
		    <h3>{meal.name}</h3>
		    <p>{meal.date.toLocaleString()}</p>
		    <p>Total Calories: {meal.getTotalCalories()}</p>
		    <p>Total Carbohydrates: {meal.getTotalCarbohydrates()} g</p>
		    <p>Total Protein: {meal.getTotalProtein()} g</p>
		    <p>Total Fats: {meal.getTotalFats()} g</p>

		    <h4>Foods:</h4>
		    <ul>
		      {meal.foods.map((foodItem, foodIndex) => (
			<li key={foodIndex}>
			  {foodItem.name} - {foodItem.servings} servings
			</li>
		      ))}
		    </ul>
		    <button
		      type="button"
		      onClick={() => handleDeleteMeal(index)}
		    >
		      Delete Meal
		    </button>
		  </div>
		))}
	      </div>
	    )}
            </section>
	    )}
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
