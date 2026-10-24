
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Create one Scanner to read all user input
        Scanner console = new Scanner(System.in);

        // Create the main menu and pass it the Scanner
        MenuData mainMenu = new MenuData(console);

        // Display the menu and store the user's choice
        int choice = mainMenu.menu();

        // If the user chooses option 1, start weightlifting
        if (choice == 1) {
            // Create a Workout object and pass it the Scanner
            Workout workout = new Workout(console);

            // Start the weightlifting program
            workout.startWeightLifting();
        } else {
            // Cardio and Yoga have not been implemented yet
            System.out.println("That workout option is not implemented yet.");
        }

        // Close the Scanner when the program finishes
        console.close();
    }
}
