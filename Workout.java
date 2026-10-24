
import java.util.Scanner;

public class Workout {
    // Store the name of the selected workout
    private String nameOfWorkout;

    // Track which type of workout was selected
    private boolean isWeightLifting;
    private boolean isCardio;
    private boolean isYoga;

    // Scanner used for all workout questions
    private final Scanner console;

    // Constructor initializes the workout variables
    public Workout(Scanner console) {
        // Store the Scanner passed in from Main
        this.console = console;

        // Start with no workout selected
        nameOfWorkout = "";

        // Set all workout types to false initially
        isWeightLifting = false;
        isCardio = false;
        isYoga = false;
    }

    // Constructor that allows workout information to be provided
    public Workout(String nameOfWorkout, boolean isWeightLifting,
                   boolean isCardio, boolean isYoga, Scanner console) {
        // Store the provided workout information
        this.console = console;
        this.nameOfWorkout = nameOfWorkout;
        this.isWeightLifting = isWeightLifting;
        this.isCardio = isCardio;
        this.isYoga = isYoga;
    }

    // Set the workout type based on the menu selection
    public void SetWorkout(int response) {
        // Option 1 means Weight Lifting
        if (response == 1) {
            nameOfWorkout = "Weight Lifting";
            isWeightLifting = true;
            isCardio = false;
            isYoga = false;
        }
        // Option 2 means Cardio
        else if (response == 2) {
            nameOfWorkout = "Cardio";
            isWeightLifting = false;
            isCardio = true;
            isYoga = false;
        }
        // Option 3 means Yoga
        else if (response == 3) {
            nameOfWorkout = "Yoga";
            isWeightLifting = false;
            isCardio = false;
            isYoga = true;
        }
    }

    // Display the workout selected by the user
    public void ShowSelectedWorkout() {
        System.out.println("The user has selected " + nameOfWorkout
                + " for their workout today.");
    }

    // Run the weightlifting portion of the program
    public void startWeightLifting() {
        // Set the selected workout to Weight Lifting
        SetWorkout(1);

        // Display the selected workout
        ShowSelectedWorkout();

        // Create an array containing the available muscle groups
        String[] muscleGroups = {
                "Back", "Chest", "Shoulders", "Arms", "Legs"
        };

        // Ask the user to choose a muscle group
        System.out.println("\nChoose a muscle group:");

        // Display each muscle group with a number
        for (int i = 0; i < muscleGroups.length; i++) {
            System.out.println((i + 1) + ". " + muscleGroups[i]);
        }

        // Declare a variable to store the selected muscle group
        String muscleGroup;

        // Keep asking until the user selects a valid muscle group
        while (true) {
            System.out.print("Enter the number of your choice: ");
            String input = console.nextLine().trim();

            try {
                // Convert the user's input to an integer
                int choice = Integer.parseInt(input);

                // Check that the selection is within the valid range
                if (choice >= 1 && choice <= muscleGroups.length) {
                    // Arrays start at index 0, so subtract 1 from the choice
                    muscleGroup = muscleGroups[choice - 1];
                    break;
                }
            } catch (NumberFormatException ignored) {
                // Ask again if the input is not a valid number
            }

            // Tell the user how to enter a valid selection
            System.out.println("Please enter a number from 1 to "
                    + muscleGroups.length + ".");
        }

        // Display the selected muscle group
        System.out.println("Selected muscle group: " + muscleGroup);

        // Start by assuming the user wants to enter an exercise
        boolean anotherExercise = true;

        // Repeat the exercise process while the answer is yes
        while (anotherExercise) {
            // Ask the user for the name of their exercise
            System.out.print("\nWhat lift are you doing? ");
            String lift = console.nextLine().trim();

            // Require the user to enter an exercise name
            while (lift.isEmpty()) {
                System.out.print("Please enter an exercise name: ");
                lift = console.nextLine().trim();
            }

            // Start counting sets at 1
            int setNumber = 1;

            // Assume the user wants to complete at least one set
            boolean anotherSet = true;

            // Repeat the set questions while the answer is yes
            while (anotherSet) {
                // Ask for the number of repetitions completed
                int reps = readPositiveInt(
                        "How many reps did you do? "
                );

                // Ask for the amount of weight lifted
                double weight = readNonNegativeDouble(
                        "How much weight did you lift? "
                );

                // Display the details entered for this set
                System.out.println("Recorded set " + setNumber
                        + " of " + lift + ": " + reps
                        + " reps at " + weight + " weight.");

                // Ask whether the user wants to do another set
                anotherSet = askYesNo(
                        "Are you doing another set? (y/n): "
                );

                // Increase the set number for the next set
                setNumber++;
            }

            // Once the sets are finished, ask about another exercise
            anotherExercise = askYesNo(
                    "Are you doing another exercise? (y/n): "
            );
        }

        // Display a message when the workout is finished
        System.out.println("\nWorkout complete. Great job!");
    }

    // Ask for a whole number greater than zero
    private int readPositiveInt(String question) {
        // Continue asking until the user enters a valid number
        while (true) {
            System.out.print(question);
            String input = console.nextLine().trim();

            try {
                // Convert the input to an integer
                int value = Integer.parseInt(input);

                // Reps must be greater than zero
                if (value > 0) {
                    return value;
                }
            } catch (NumberFormatException ignored) {
                // Ask again if the input is not a whole number
            }

            // Explain the valid input requirement
            System.out.println(
                    "Please enter a whole number greater than 0."
            );
        }
    }

    // Ask for a valid weight that is zero or greater
    private double readNonNegativeDouble(String question) {
        // Continue asking until the user enters a valid weight
        while (true) {
            System.out.print(question);
            String input = console.nextLine().trim();

            try {
                // Convert the input to a decimal number
                double value = Double.parseDouble(input);

                // Accept only finite numbers that are zero or greater
                if (Double.isFinite(value) && value >= 0) {
                    return value;
                }
            } catch (NumberFormatException ignored) {
                // Ask again if the input is not a valid number
            }

            // Explain the valid input requirement
            System.out.println(
                    "Please enter a valid weight of 0 or more."
            );
        }
    }

    // Ask a yes-or-no question and return true for yes
    private boolean askYesNo(String question) {
        // Keep asking until the user enters y or n
        while (true) {
            System.out.print(question);

            // Convert the answer to lowercase to accept Y or N too
            String answer = console.nextLine().trim().toLowerCase();

            // Return true when the answer is yes
            if (answer.equals("y")) {
                return true;
            }

            // Return false when the answer is no
            if (answer.equals("n")) {
                return false;
            }

            // Ask again if the answer is neither y nor n
            System.out.println("Please enter y for yes or n for no.");
        }
    }
}
