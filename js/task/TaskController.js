import DataService from "../api/DataService.js";
import TaskView from "./TaskView.js";

export default class TaskController {

    static async loadContent() {
        try {
            const tasksList = await DataService.readAll();
            TaskView.renderContent(tasksList);
            TaskView.initializeEventListeners(tasksList);
        } catch (erro) {
            console.error(erro.stack);
        }
    }

    static async createTask(task) {
        try {
            await DataService.create(task);
            await this.loadContent();
        } catch (erro) {
            console.error(erro.stack);
        }
    }

    static async editTask(task) {
        try {
            await DataService.update(task)
            await this.loadContent();
        } catch(erro) {
            console.error(erro.stack);
        }
    }

    static async deleteTask(task) {
        try {
            await DataService.delete(task);
            await this.loadContent();
        } catch(erro) {
            console.error(erro.stack);
        }
    }

    static async searchTaskByName(regex) {
        try {
            const tasks = await DataService.readByName(regex);
            TaskView.renderContent(tasks);
        } catch(erro) {
            console.error(erro.stack);
        }
    }
}