/*
Eromonsele Iyoha
Written in TypeScript on 11/14/2026
*/

// This defines the FoodItem class 
export class FoodItem {
  constructor (
    public name: string,
    public servings: number,
    public calories: number,
    public carbohydrates: number,
    public protein: number,
    public fats: number
  ) {
    if (name.trim() === "") {
      throw new Error("Food Item name cannot be empty.");
    }
    if (!Number.isFinite(servings) || servings <= 0) {
      throw new Error("Servings must be a positive number.");
    }
    if (!Number.isFinite(calories) || calories < 0) {
      throw new Error("Calories must be a positive number or zero.");
    }
    if (!Number.isFinite(carbohydrates) || carbohydrates < 0) {
      throw new Error("Carbohydrates must be a positive number or zero.");
    }
    if (!Number.isFinite(protein) || protein < 0) {
      throw new Error("Protein must be a positive number or zero.");
    }
    if (!Number.isFinite(fats) || fats < 0) {
      throw new Error("Fats must be a positive number or zero.");
    }
  }

  // Method to return the total number of calories from the food item
  getTotalCalories(): number {
    return this.servings * this.calories;
  }

  // Method to return the total number of carbohydrates from the food item
  getTotalCarbohydrates(): number {
    return this.servings * this.carbohydrates;
  }

  // Method to return the total number of protein from the food item
  getTotalProtein(): number {
    return this.servings * this.protein;
  }

  // Method to return the total number of fats from the food item
  getTotalFats(): number {
    return this.servings * this.fats;
  }
}
