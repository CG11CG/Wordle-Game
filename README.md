# Green Team Wordle Group Project

**Institution:** Eastern Oregon University Computer Science Department  
**Project Title:** Wordle Game  
**Project Status:** Release  
**Version:** 1.1  
**Date:** 06/15/2024  

---

## Table of Contents
1. [Setup Instructions](#setup-instructions)
2. [Design Overview](#design-overview)
3. [System Components](#system-components)
4. [Data Flow](#data-flow)
5. [System Architecture](#system-architecture)
6. [Conclusion](#conclusion)

---
## Setup Instructions

### Prerequisites

- MySQL Server and MySQL Workbench installed on your machine.
- Python installed on your machine.
- Internet connection to download necessary packages.

### Step-by-Step Setup

#### 1. Clone the Repository

```git clone https://github.com/EasternOregonUniversity/CS362Spring2024Green.git ```
```cd CS362Spring2024Green ```

#### 2. Set Up the MySQL Database
1. Start MySQL Server
2. Open MySQL Workbench
3.  Download and Import the Database
Download the self-contained file for the database.
In MySQL Workbench, navigate to Server > Data Import.
Select Import from Self-Contained File and choose the downloaded file.
Select the target database or create a new database, then click Start Import.

4. Update Database name in 'RESTAPI.py'
Open RESTAPI.py and update the db_config dictionary to match the name of your database.

```
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "yourpassword",  # Replace with your MySQL root password
    "database": "your_database_name"  # Replace with your database name
}
```


#### 3. Set Up the Python Environment
1. Run the python script
```python RESTAPI.py ```


#### 4. Open index.html in a browser

## Design Overview

Green Team’s Wordle Game entails the creation of an interactive web-based version of the popular Wordle game. Users guess a five-letter word and receive immediate feedback on the accuracy of their guesses. This feedback is visually represented, helping players understand how close their guess is to the target word.

The project employs a robust three-tier architecture consisting of:
- A web front end
- A REST API server
- A database server

When a user accesses the Wordle Game, they are presented with a web interface where they can start a new game without needing to log in. The user types a five-letter word guess using either their keyboard or the on-screen buttons. After entering their guess, the user presses the enter key to submit it. The game then provides immediate visual feedback by changing the colors of the letters in their guess:
- Green for correct letters in the right position
- Yellow for correct letters in the wrong position
- White for incorrect letters

The user has six attempts to guess the correct word. If the user guesses the word correctly within six tries, a "You Win" message is displayed; if not, a "You Lose" message appears. The user can then choose to restart the game and play again. This document provides a comprehensive overview of each system component, detailing their functions and interactions.

---

## System Components

### Web Front End
The web front end is the user-facing part of the application. It is designed using HTML, CSS, and JavaScript to create a responsive and interactive user interface. This interface is crucial as it directly impacts user experience.

#### Functionality:
- **User Input:** Users can input their guesses using either the physical keyboard or on-screen buttons. All guesses and words are 5 letters, and the user gets a maximum of six guesses.
- **Feedback:** After each guess, the system provides visual feedback by changing the colors of the letters:
  - Green: The letter is in the word and in the correct position.
  - Yellow: The letter is in the word but in the incorrect position.
  - White: The letter is not in the word at all.
  The digital keyboard is also updated in correspondence with the accuracy of the guesses:
  - Green: The letter is in the word.
  - Grey: The letter has been used.
- **Game Control:** The front end includes controls to start a new game, reset the current game, and handle end-of-game scenarios.

### REST API Server
The REST API Server acts as a bridge between the web front end and the database server. It is implemented using Python and Flask Restful.

#### Functionality:
- **Request Handling:** The server processes requests from the front end, such as validating a word guess or fetching the solution word for the current game session.
- **Endpoints:**
  - `/generate_user_id`: Generates a unique user ID for each game session, ensuring that multiple players can play simultaneously without interference.
  - `/check_word`: Validates whether the guessed word is correct and returns the appropriate feedback to the front end.
  - `/get_solution`: Retrieves the current session’s solution word from the database.
- **JSON Communication:** Data exchange between the front end and REST API server is done using JSON.

### Database Server
The database server is a MySQL server that stores all game-related data and is running its own process.

#### Functionality:
- **Data Storage:**
  - A table containing the list of all acceptable words for the game.
  - Each game session’s solution word, randomly selected from the valid words list.
  - Records player performance data, including wins, losses, and streaks.
- **Data Retrieval:** Queries the database to fetch solution words and validate guesses.

---

## Data Flow

The interaction between the system components follows a structured flow:

### Game Start:
1. The user opens the game in a web browser. The front end sends a request to the `/generate_user_id` endpoint of the REST API server.
2. The REST API server generates a unique user ID and returns it to the front end.
3. The front end then sends a request to the `/get_solution` endpoint, passing the user ID to retrieve a solution word.
4. The REST API server queries the database for a random valid word, stores it as the solution word for the user ID, and returns it to the front end.

### Gameplay:
1. The user inputs a guess and submits it. The front end sends the guessed word and user ID to the `/check_word` endpoint.
2. The REST API server checks if the guessed word is valid. If valid, it compares the guessed word with the solution word.
3. The server constructs a response indicating which letters are correct, which are in the wrong position, and which are incorrect.
4. The front end receives this response and updates the UI to reflect the feedback, changing the colors of the guessed letters.

### Game End:
1. After 6 attempts or a correct guess, the game concludes.
2. The front end displays an appropriate message (“You Win” or “You Lose”).
3. The popup message contains information about the stats accumulated by that particular computer.
4. The user can choose to start a new game, which resets the session and repeats the process.

---

## System Architecture

![Screenshot 2024-06-02 152621](https://github.com/EasternOregonUniversity/CS362Spring2024Green/assets/129999712/4d310307-2acd-43df-86ae-ac7176bc1edd)


The above diagram visually represents the interactions and data flow between the system components. The web front end captures user interactions and sends requests to the REST API server. The REST API server processes these requests, interacts with the database server, and returns the necessary data to the front end.

---

## Conclusion

This high-level design overview provides a detailed look at the architecture and components of the Wordle project. By employing a three-tier structure, the design ensures clear separation of concerns, facilitating easier development, testing, and maintenance. The web front end offers a user-friendly interface, the REST API server handles business logic and data processing, and the database server ensures data persistence and integrity. Together, these components create a cohesive system that delivers an engaging and seamless gaming experience.

---
