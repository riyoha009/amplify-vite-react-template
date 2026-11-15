/*
Eromonsele Iyoha
Written in TypeScript on 11/14/2026
*/

import { useState } from "react";
import type { FormEvent } from "react";
import { FoodItem } from "../models/FoodItem";
import { Meal } from "../models/Meal";

interface MealFormProps {
  onCancel: () => void;
  onSave: (meal: Meal) => void;
}

function MealForm({ onCancel, onSave }: MealFormProps) {
  const [mealName, setMealName] = useState<string>("");
  const [mealDate, setMealDate] = useState<string>("");
  const [foodName, setFoodName] = useState<string>("");
  const [servings, setServings] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [carbohydrates, setCarbohydrates] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [fats, setFats] = useState<string>("");
  const [foods, setFoods] = useState<FoodItem[]>([]);

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

    const servingsNumber = Number(servings);
    const caloriesNumber = Number(calories);
    const carbohydratesNumber = Number(carbohydrates);
    const proteinNumber = Number(protein);
    const fatsNumber = Number(fats);

    try {
      const newFoodItem = new FoodItem(foodName, servingsNumber, caloriesNumber, carbohydratesNumber, proteinNumber, fatsNumber);

      setFoods(previousFoods => [...previousFoods, newFoodItem]);

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

  function handleRemoveFood(index: number) {
    setFoods(previousFoods => previousFoods.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleSaveMeal(event: FormEvent<HTMLFormElement>) {
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

    const date = new Date(mealDate);
    
    if (Number.isNaN(date.getTime())) {
      alert("Please enter a valid meal date.");
      return;
    }

    const newMeal = new Meal(mealName.trim(), date);

    foods.forEach(foodItem => {
      newMeal.addFood(foodItem);
    });

    onSave(newMeal);
  }

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