
import java.util.Scanner;

public class MenuData {
    // Store the Scanner used to read user input
    private final Scanner console;

    // Store the question displayed above the menu options
    private final String prompt;

    // Store the available workout options
    private final String[] options;

    // Constructor initializes the menu
    public MenuData(Scanner console) {
        // Use the Scanner passed in from Main
        this.console = console;

        // Set the question the user will see
        prompt = "What type of workout would you like to do today?";

        // Create the list of workout choices
        options = new String[] {"Weight Lifting", "Cardio", "Yoga"};
    }

    // Display the menu and return the user's selection
    public int menu() {
        // Keep asking until the user enters a valid choice
        while (true) {
            // Display the menu question
            System.out.println(prompt);

            // Display each option with a number starting at 1
            for (int i = 0; i < options.length; i++) {
                System.out.println((i + 1) + ". " + options[i]);
            }

            // Ask the user to enter their choice
            System.out.print("Enter the number of your choice: ");
            String input = console.nextLine().trim();

            try {
                // Convert the user's input from a String to an integer
                int response = Integer.parseInt(input);

                // Check that the number matches an available option
                if (response >= 1 && response <= options.length) {
                    // Return the valid selection
                    return response;
                }
            } catch (NumberFormatException ignored) {
                // If the input is not a number, ask again
            }

            // Display an error message for invalid input
            System.out.println(
                    "Please enter a number from 1 to " + options.length + "."
            );
        }
    }
}
