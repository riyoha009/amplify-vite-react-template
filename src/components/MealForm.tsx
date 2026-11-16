/*
Eromonsele Iyoha
Written in TypeScript on 11/14/2026
*/

import { useState } from "react";
import type { FormEvent } from "react";
import { FoodItem } from "../models/FoodItem";
import { Meal } from "../models/Meal";

// Interface defines what information MealForm expects to receive from Dashboard.tsx
// so that it can communicate user actions back to the Dashboard
interface MealFormProps {
  onCancel: () => void;
  onSave: (meal: Meal) => void;
}

// JavaScript object destructuring: extracts the two properties from MealFormProps
function MealForm({ onCancel, onSave }: MealFormProps) {
  // Array destructuring used to retrieve the current state value and its corresponding
  // Setter function from the array returned by React's useState() hook
  const [mealName, setMealName] = useState<string>("");
  const [mealDate, setMealDate] = useState<string>("");
  const [foodName, setFoodName] = useState<string>("");
  const [servings, setServings] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [carbohydrates, setCarbohydrates] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [fats, setFats] = useState<string>("");
  const [foods, setFoods] = useState<FoodItem[]>([]);

  // This function is responsible for adding a food item to the meal and error checking
  function handleAddFood() {
    if (foodName.trim() === "") {
      alert("Please enter a food name.");
      return;
    }

    if (servings.trim() === "" || calories.trim() === "" || carbohydrates.trim() === "" ||
      protein.trim() === "" || fats.trim() === "") {
      alert("Please enter all nutritional values.");
      return;
    }

    // Creates new variables with Number type so we can use for arguments for newFoodItem later
    const servingsNumber = Number(servings);
    const caloriesNumber = Number(calories);
    const carbohydratesNumber = Number(carbohydrates);
    const proteinNumber = Number(protein);
    const fatsNumber = Number(fats);

    try {
      // Create a FoodItem object
      const newFoodItem = new FoodItem(foodName, servingsNumber, caloriesNumber, carbohydratesNumber, proteinNumber, fatsNumber);

      // Create a new array containing previous foods and the new FoodItem appended to the end
      // and updates the foods state
      setFoods(previousFoods => [...previousFoods, newFoodItem]);

      // Clear input fields after user has successfully added a food item
      setFoodName("");
      setServings("");
      setCalories("");
      setCarbohydrates("");
      setProtein("");
      setFats("");

    } catch (error) {
        if (error instanceof Error) {
	  alert(error.message);
        }
    }
  }

  // Removes food item from the foods array by index
  // Filter method creates a new array containing only the elements that satisfy the condition
  // The condition is currentIndex is not equal to the index that is to be deleted
  // Underscore represents te food item itself, which is not needed
  function handleRemoveFood(index: number) {
    setFoods(previousFoods => previousFoods.filter((_, currentIndex) => currentIndex !== index));
  }

  // Runs when user submits the form to add meal
  function handleSaveMeal(event: FormEvent<HTMLFormElement>) {
    // Prevents browser's default behavior of reloading page when form is submitted
    event.preventDefault();

    if (mealName.trim() === "") {
      alert("Please enter a meal name.");
      return;
    }

    if (mealDate.trim() === "") {
      alert("Please select a meal date.");
      return;
    }

    if (foods.length === 0) {
      alert("Please add at least one food item.");
      return;
    }

    // Convert date string into date object because Meal constructor expects date object
    const date = new Date(mealDate);
    
    if (Number.isNaN(date.getTime())) {
      alert("Please enter a valid meal date.");
      return;
    }

    // Create a Meal object
    const newMeal = new Meal(mealName.trim(), date);

    // Adding the foods to the Meal object's array
    foods.forEach(foodItem => {
      newMeal.addFood(foodItem);
    });

    // Passes completed Meal object to function handleSaveMeal() in Dashboard.tsx
    onSave(newMeal);
  }

  // This portion of code defines the UI that appears when user clicks Add Meal
  // event.target.value retrieves the current text from the HTML input
  return (
    <div>
      <h2>Add Meal</h2>
        <form onSubmit={handleSaveMeal}>
	  <label>
	    Meal Name:
	    <input type="text" value={mealName} onChange={event => setMealName(event.target.value)} />
	  </label>

	  <label>
	    Meal Date:
	    <input type="datetime-local" value={mealDate} onChange={event => setMealDate(event.target.value)} />
	  </label>

	  <label>
	    Food Name:
	    <input type="text" value={foodName} onChange={event => setFoodName(event.target.value)} />
	  </label>

	  <label>
	    Servings:
	    <input type="number" min="0.01" step="any" value={servings} onChange={event => setServings(event.target.value)} />
	  </label>

	  <label>
	    Calories:
	    <input type="number" min="0" step="any" value={calories} onChange={event => setCalories(event.target.value)} />
	  </label>

	  <label>
	    Carbohydrates:
	    <input type="number" min="0" step="any" value={carbohydrates} onChange={event => setCarbohydrates(event.target.value)} />
	  </label>

	  <label>
	    Protein:
	    <input type="number" min="0" step="any" value={protein} onChange={event => setProtein(event.target.value)} />
	  </label>

	  <label>
	    Fats:
	    <input type="number" min="0" step="any" value={fats} onChange={event => setFats(event.target.value)} />
	  </label>

	  <button type="button" onClick={handleAddFood}>
	    Add Food
	  </button>

	  <button type="button" onClick={onCancel}>
	    Cancel
	  </button>

	  <button type="submit">
	    Save Meal
	  </button>

	  <h3>Foods Added</h3>
            <ul>
	      {foods.map((foodItem, index) => (
	        <li key={index}>
		  {foodItem.name} - {foodItem.servings} servings - {foodItem.getTotalCalories()} calories
		  <button type="button" onClick={() => handleRemoveFood(index)}>Remove</button>
		</li>
	      ))}
	    </ul>
	</form>
    </div>
  );
}

export default MealForm;