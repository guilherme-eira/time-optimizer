import DashboardService from "./service/DashboardService.js";
import TaskService from "./service/TaskService.js"; 
import TimerView from "./ui/TimerView.js";

document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.getAttribute("data-page");

    if (page === "tasks") {
        TaskService.loadContent();
    }

    if (page === "timer") {
        TimerView.loadContent();
        TimerView.initializeEventListeners();
    }

    if (page === "dashboard") {
        DashboardService.loadContent();
    }
})