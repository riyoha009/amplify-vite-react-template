/*
Eromonsele Iyoha
Written in TypeScript on 11/14/2026
*/

import { FoodItem } from "./FoodItem";

export class Meal {
  public id?: string;
  public foods: FoodItem[] = [];

  constructor (
    public name: string,
    public date: Date
  ) {}

  // Method to add food to the Meal
  addFood(foodItem: FoodItem): void {
    this.foods.push(foodItem);
  }

  // Method to remove food from the Meal using the index
  removeFood(index: number): void {
    if (!Number.isInteger(index) ||
        index < 0 ||
        index >= this.foods.length) {
      throw new Error("Invalid food index.");
    }

    this.foods.splice(index, 1);
  }

  // Method to calculate total calories across the entire Meal
  getTotalCalories(): number {
    return this.foods.reduce(
      (total, foodItem) => total + foodItem.getTotalCalories(),
      0
    );
  }

  // Method to calculate total carbohydrates across the entire Meal
  getTotalCarbohydrates(): number {
    return this.foods.reduce(
      (total, foodItem) => total + foodItem.getTotalCarbohydrates(),
      0
    );
  }

  // Method to calculate total protein across the entire Meal
  getTotalProtein(): number {
    return this.foods.reduce(
      (total, foodItem) => total + foodItem.getTotalProtein(),
      0
    );
  }
  
  // Method to calculate total fats across the entire Meal
  getTotalFats(): number {
    return this.foods.reduce(
      (total, foodItem) => total + foodItem.getTotalFats(),
      0
    );
  }
}
