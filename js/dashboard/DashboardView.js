const completionPercentage = document.getElementById('completion-percentage');
const completionPercentageMobile = document.getElementById('completion-percentage-mobile');
const dailyAverage = document.getElementById('daily-average');
const dailyAverageMobile = document.getElementById('daily-average-mobile');
const mostTasksCompleted = document.getElementById('most-tasks-completed');
const mostTasksCompletedMobile = document.getElementById('most-tasks-completed-mobile');
const feedbackText = document.getElementById('feedback-text');

let dailyProgressChart;
let priorityDistributionChart;
let statusDistributionChart;

export default class DashboardView {

    static renderContent(tasks) {
        window.addEventListener('resize', () => {
            dailyProgressChart.destroy();
            priorityDistributionChart.destroy();
            statusDistributionChart.destroy();
            this.fillCharts(tasks);
            this.fillCards(tasks);
        });
        this.fillCharts(tasks)
        this.fillCards(tasks);
    }

    static fillCharts(tasks) {
        this.loadDailyProgressChart(tasks);
        this.loadPriorityDistributionChart(tasks);
        this.loadStatusDistributionChart(tasks);
    }

    static fillCards(tasks) {
        this.updateCompletionPercentage(tasks);
        this.updateDailyAverage(tasks);
        this.updateDayWithMostTasks(tasks);
        this.updateFeedback(tasks);
    }

    static loadDailyProgressChart(tasks) {
        const tasksCompletedByDate = this.countTasksCompletedByDate(tasks);
        const formattedDates = [];
        for (let date in tasksCompletedByDate) {
            formattedDates.push(new Date(this.formatDate(date) + 'T00:00:00').toLocaleDateString('pt-br', { day: 'numeric', month: 'short' }));
        }

        dailyProgressChart = new Chart(document.querySelector('.daily-progress-chart'), {
            type: 'bar',
            data: {
                labels: formattedDates.slice(-20),
                datasets: [{
                    label: 'Tasks Concluídas',
                    data: Object.values(tasksCompletedByDate),
                    backgroundColor: '#20b2aa',
                    borderColor: '#20b2aa',
                    fill: true
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    static loadPriorityDistributionChart(tasks) {

        const tasksDistributedByPriority = [[], [], []];
        tasks
            .filter(task => task.pending == true)
            .forEach(task => {
                if (task.priority == 'Muito importante') tasksDistributedByPriority[0].push(task);
                else if (task.priority == 'Importante') tasksDistributedByPriority[1].push(task);
                else tasksDistributedByPriority[2].push(task);
            })

        statusDistributionChart = new Chart(document.querySelector('.priority-distribution-chart'), {
            type: 'pie',
            data: {
                labels: ['Muito Importante', 'Importante', 'Baixa prioridade'],
                datasets: [{
                    data: [tasksDistributedByPriority[0].length, tasksDistributedByPriority[1].length, tasksDistributedByPriority[2].length],
                    backgroundColor: ['#0c4240', '#20b2aa', '#a4e2df']
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    static loadStatusDistributionChart(tasks) {

        const tasksDistributedByStatus = [[], []];

        tasks.forEach(task => {
            if (task.pending == true) tasksDistributedByStatus[0].push(task);
            else tasksDistributedByStatus[1].push(task);
        })

        priorityDistributionChart = new Chart(document.querySelector('.status-distribution-chart'), {
            type: 'bar',
            data: {
                labels: ['Pendentes', 'Concluídas'],
                datasets: [{
                    label: 'Status das Tarefas',
                    data: [tasksDistributedByStatus[0].length, tasksDistributedByStatus[1].length],
                    backgroundColor: ['#0c4240', '#a4e2df']
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y'
            }
        });
    }

    static countTasksCompletedByDate(tasks) {

        const tasksCountByDate = {}
        let firstDate;
        let lastDate;
        const completedTasks = tasks.filter((task) => task.pending == false);
        completedTasks.map((task, taskIndex) => {
            if (taskIndex == 0) {
                firstDate = task.date;
                lastDate = task.date;
            }
            if (task.date < firstDate) firstDate = task.date;
            if (task.date > lastDate) lastDate = task.date;

            if (tasksCountByDate[this.formatDate(task.date)]) tasksCountByDate[this.formatDate(task.date)]++;
            else tasksCountByDate[this.formatDate(task.date)] = 1;
        })

        let currentDate = new Date(firstDate);

        while (currentDate < new Date(lastDate)) {
            if (!tasksCountByDate[this.formatDate(currentDate)]) tasksCountByDate[this.formatDate(currentDate)] = 0;
            currentDate.setDate(currentDate.getDate() + 1)
        }

        const sortedTasksByDate = Object.keys(tasksCountByDate)
            .sort((a, b) => new Date(a) - new Date(b))
            .reduce((acc, date) => {
                acc[date] = tasksCountByDate[date];
                return acc;
            }, {});

        return sortedTasksByDate;
    }

    static updateCompletionPercentage(tasks) {
        if (tasks.length == 0) {
            return;
        }

        const totalTasks = tasks.length;

        const completedTasks = [];

        tasks.forEach(task => {
            if (task.pending == false) completedTasks.push(task);
        })

        const percentage = (completedTasks.length / totalTasks) * 100;
        completionPercentage.textContent = percentage.toFixed(2) + '%';
        completionPercentageMobile.textContent = percentage.toFixed(2) + '%';
    }

    static updateDailyAverage(tasks) {
        if (tasks.length == 0) {
            return;
        }

        const tasksByDate = this.countTasksCompletedByDate(tasks);

        if (Object.values(tasksByDate).length == 0) {
            dailyAverage.textContent = '0';
            dailyAverageMobile.textContent = '0';
            return;
        }

        let sum = 0;
        let totalTasks = 0;

        for (let date in tasksByDate) {
            sum += tasksByDate[date];
            totalTasks++;
        }

        dailyAverage.textContent = (sum / totalTasks).toFixed(2);
        dailyAverageMobile.textContent = (sum / totalTasks).toFixed(2);
    }

    static updateDayWithMostTasks(tasks) {
        if (tasks.length == 0) {
            return;
        }

        const tasksByDate = this.countTasksCompletedByDate(tasks);

        if (Object.values(tasksByDate).length == 0) {
            mostTasksCompleted.textContent = 'Nenhum';
            mostTasksCompletedMobile.textContent = 'Nenhum';
            return;
        }

        let dayWithMostTasksCompleted;
        let totalTasks = 0;

        for (let date in tasksByDate) {
            if (tasksByDate[date] > totalTasks) {
                totalTasks = tasksByDate[date];
                dayWithMostTasksCompleted = new Date(this.formatDate(date) + 'T00:00:00').toLocaleDateString('pt-br');
            }
        }

        mostTasksCompleted.textContent = dayWithMostTasksCompleted;
        mostTasksCompletedMobile.textContent = dayWithMostTasksCompleted;
    }

    static updateFeedback(tasks) {
        const veryImportantPending = [];
        tasks.forEach(task => {
            if (task.pending == true && task.priority == 'Muito importante') veryImportantPending.push(task);
        })

        const completedTasks = [];
        tasks.forEach(task => {
            if (task.pending == false) completedTasks.push(task);
        })

        const totalTasks = tasks.length;
        const completionPercentage = (completedTasks.length / totalTasks) * 100;

        if (completionPercentage < 30 && veryImportantPending.length > 3) {
            feedbackText.textContent = '⚠️ Baixa produtividade: Menos de 30% concluído e muitas tarefas críticas pendentes. Priorize suas tarefas importantes!';
        } else if (completionPercentage < 30 && veryImportantPending.length <= 3) {
            feedbackText.textContent = '🔧 Baixa produtividade: Menos de 30% concluído, mas poucas tarefas críticas pendentes. Considere definir metas menores.';
        } else if (completionPercentage >= 30 && completionPercentage < 60 && veryImportantPending.length > 3) {
            feedbackText.textContent = '📋 Progresso moderado: Concluiu entre 30% e 60%, mas ainda há muitas tarefas críticas pendentes. Foque no essencial!';
        } else if (completionPercentage >= 30 && completionPercentage < 60 && veryImportantPending.length <= 3) {
            feedbackText.textContent = '🔄 Progresso moderado: Você está indo bem, mas ainda pode otimizar suas prioridades.';
        } else if (completionPercentage >= 60 && completionPercentage < 90 && veryImportantPending.length > 2) {
            feedbackText.textContent = '✨ Boa produtividade: Concluiu mais de 60%, mas ainda há tarefas críticas. Concentre-se nelas para finalizar com sucesso!';
        } else if (completionPercentage >= 60 && completionPercentage < 90 && veryImportantPending.length <= 2) {
            feedbackText.textContent = '🎉 Excelente progresso! Continue assim e finalize o que resta.';
        } else if (completionPercentage >= 90) {
            feedbackText.textContent = '🚀 Fantástico! Quase tudo concluído. Revise se há algo pendente.';
        }
    }

    static formatDate(date) {
        if (typeof date === 'string') {
            return date.split('T')[0];
        }
        return date.toISOString().split('T')[0];
    }
}




