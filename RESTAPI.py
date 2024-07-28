from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
import mysql.connector
import uuid

app = Flask(__name__)
CORS(app)
api = Api(app)

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "Lakers20!",  # Replace with your MySQL root password
    "database": "presentation_db"
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

class NewSession(Resource):
    def post(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid1())
        cursor.execute("SELECT word FROM valid_words ORDER BY RAND() LIMIT 1")
        solution_word = cursor.fetchone()
        if solution_word:
            solution_word = solution_word[0]
            print(f"Selected solution word: {solution_word}")
            cursor.execute("INSERT INTO game_sessions (session_id, user_id, solution_word) VALUES (%s, %s, %s)", (session_id, user_id, solution_word))
            conn.commit()
            cursor.close()
            conn.close()
            return {"session_id": session_id, "user_id": user_id, "solution_word": solution_word}, 201
        else:
            cursor.close()
            conn.close()
            return {"error": "No valid words found"}, 500

class GuessWord(Resource):
    def post(self):
        data = request.get_json()
        session_id = data.get("session_id")
        user_id = data.get("user_id")
        guessed_word = data.get("guessed_word").lower()  # Ensure the guessed word is in lowercase

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT solution_word FROM game_sessions WHERE session_id = %s AND user_id = %s", (session_id, user_id))
        solution_word = cursor.fetchone()
        if solution_word:
            solution_word = solution_word[0].lower()  # Ensure the solution word is in lowercase
            print(f"Solution word for session {session_id}: {solution_word}")
            print(f"Guessed word: {guessed_word}")

            cursor.execute("SELECT COUNT(*) FROM valid_words WHERE word = %s", (guessed_word,))
            is_valid = cursor.fetchone()[0] > 0

            if not is_valid:
                result = "invalid"
            elif guessed_word == solution_word:
                result = "correct"
            else:
                result = "incorrect"

            cursor.execute("INSERT INTO word_attempts (session_id, user_id, attempted_word) VALUES (%s, %s, %s)", (session_id, user_id, guessed_word))
            conn.commit()
            cursor.close()
            conn.close()

            print(f"Result for guessed word: {result}")
            return {"result": result, "solution_word": solution_word}, 200  # Always include solution_word in the response
        else:
            cursor.close()
            conn.close()
            print("Session not found or invalid.")
            return {"error": "Session not found or invalid"}, 404

api.add_resource(NewSession, "/new_session")
api.add_resource(GuessWord, "/guess_word")

if __name__ == "__main__":
    app.run(debug=True)
