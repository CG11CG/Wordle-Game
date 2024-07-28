import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Lakers20!",  # Replace with your MySQL root password
    database="wordle_db"
)

cursor = db.cursor()

with open("sgb-words.txt", "r") as file:
    words = file.readlines()

cursor.execute("DELETE FROM valid_words")

for word in words:
    cursor.execute("INSERT INTO valid_words (word) VALUES (%s)", (word.strip(),))

db.commit()
cursor.close()
db.close()
