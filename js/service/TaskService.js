import ApiClient from "../api/ApiClient.js";
import TaskView from "../ui/TaskView.js";

export default class TaskService {

    static async loadContent() {
        try {
            const tasksList = await ApiClient.readAll();
            TaskView.renderContent(tasksList);
            TaskView.initializeEventListeners(tasksList);
        } catch (error) {
            console.error(error.stack);
        }
    }

    static async createTask(task) {
        try {
            await ApiClient.create(task);
            await this.loadContent();
        } catch (error) {
            console.error(error.stack);
        }
    }

    static async editTask(task) {
        try {
            await ApiClient.update(task)
            await this.loadContent();
        } catch(error) {
            console.error(error.stack);
        }
    }

    static async deleteTask(task) {
        try {
            await ApiClient.delete(task);
            await this.loadContent();
        } catch(error) {
            console.error(error.stack);
        }
    }

    static async searchTaskByName(regex) {
        try {
            const tasks = await ApiClient.readByName(regex);
            TaskView.renderContent(tasks);
        } catch(error) {
            console.error(error.stack);
        }
    }
}