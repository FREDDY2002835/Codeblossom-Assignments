"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Task {
    constructor(id, title, description) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = false;
    }
}
class TaskManager {
    constructor() {
        this.tasks = [];
    }
    addTask(task) {
        this.tasks.push(task);
    }
    listAllTasks() {
        if (this.tasks.length === 0) {
            console.log("No tasks available.");
            return;
        }
        this.tasks.forEach(task => {
            console.log(`ID: ${task.id} | Title: ${task.title} | Completed: ${task.completed}`);
        });
    }
    markTaskComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) {
            console.log("Task not found.");
            return;
        }
        task.completed = true;
        console.log(`Task with ID ${id} marked as complete.`);
    }
}
const manager = new TaskManager();
const task1 = new Task(1, "learn", "Understand");
const task2 = new Task(2, "build", "practice");
manager.addTask(task1);
manager.addTask(task2);
console.log("Before completion");
manager.listAllTasks();
manager.markTaskComplete(1);
console.log("After completion");
manager.listAllTasks();
//# sourceMappingURL=index.js.map