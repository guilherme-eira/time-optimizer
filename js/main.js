import DashboardController from "./dashboard/DashboardController.js";
import TaskController from "./task/TaskController.js"; 
import TimerView from "./timer/TimerView.js";

document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.getAttribute("data-page");

    if (page === "tasks") {
        TaskController.loadContent();
    }

    if (page === "timer") {
        TimerView.loadContent();
        TimerView.initializeEventListeners();
    }

    if (page === "dashboard") {
        DashboardController.loadContent();
    }
})