import DataService from "../api/DataService.js";
import DashboardView from "./DashboardView.js";

export default class DashboardController {

    static async loadContent() {
        try {
            const tasksList = await DataService.readAll();
            DashboardView.renderContent(tasksList);
        } catch (erro) {
            console.error(erro.stack);
        }
    }
}