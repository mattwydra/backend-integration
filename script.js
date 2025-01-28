const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

const API_BASE = 'http://127.0.0.1:5000';

// Fetch tasks from the Flask backend
const loadTasks = async () => {
    try {
        const response = await fetch(`${API_BASE}/tasks`);
        const tasks = await response.json();
        taskList.innerHTML = ''; // Clear the task list
        tasks.forEach(addTaskToDOM);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

// Add a task to the backend and the DOM
const addTask = async (task) => {
    try {
        const response = await fetch(`${API_BASE}/add-task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task }),
        });
        if (response.ok) {
            addTaskToDOM(task);
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
};

// Delete a task from the backend and the DOM
const deleteTask = async (task, taskElement) => {
    try {
        const response = await fetch(`${API_BASE}/delete-task`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task }),
        });
        if (response.ok) {
            taskElement.remove();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};

// Add a task to the DOM
const addTaskToDOM = (task) => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.innerHTML = `
                <span>${task}</span>
                <button class="delete-btn">Delete</button>
            `;
    taskList.appendChild(taskDiv);

    // Add delete functionality
    taskDiv.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTask(task, taskDiv);
    });
};

// Handle form submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = taskInput.value.trim();
    if (task) {
        addTask(task);
        taskInput.value = '';
    }
});

// Initialize the app
loadTasks();