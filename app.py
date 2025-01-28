from flask import Flask, request, jsonify
import sqlite3

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize SQLite DB
def init_db():
    conn = sqlite3.connect("tasks.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

# Route: Get all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    conn = sqlite3.connect("tasks.db")
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM tasks")
    tasks = [row[0] for row in cursor.fetchall()]
    conn.close()
    return jsonify(tasks)

# Route: Add a task
@app.route('/add-task', methods=['POST'])
def add_task():
    task = request.json.get('task')
    if not task:
        return jsonify({"error": "Task name is required"}), 400

    conn = sqlite3.connect("tasks.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO tasks (name) VALUES (?)", (task,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task added successfully"}), 201

# Route: Delete a task
@app.route('/delete-task', methods=['DELETE'])
def delete_task():
    task = request.json.get('task')
    if not task:
        return jsonify({"error": "Task name is required"}), 400

    conn = sqlite3.connect("tasks.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE name = ?", (task,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task deleted successfully"}), 200

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
