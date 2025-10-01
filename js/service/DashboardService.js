import ApiClient from "../api/ApiClient.js";
import DashboardView from "../ui/DashboardView.js";

export default class DashboardService {

    static async loadContent() {
        try {
            const tasksList = await ApiClient.readAll();
            DashboardView.renderContent(tasksList);
        } catch (error) {
            console.error(error.stack);
        }
    }
}