import UtilityFunctions from "../shared/UtilityFunctions.js";
import TaskService from "../service/TaskService.js";
import TaskPayload from "../payload/TaskPayload.js";

const newTaskForm = document.querySelector('.new-task-form');
const newTaskButton = document.querySelector('#new-task-button');
const newTaskButtonMobile = document.querySelector('#new-task-button-mobile');
const cancelButton = document.querySelector('.cancel-new-task-button');
const formTitle = document.querySelector('.form-title');
const idInput = document.getElementById('id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const priorityInput = document.getElementById('priority');
const submitFormButton = document.querySelector('.send-new-task-button');
const confirmationDialog = document.querySelector('.confirmation-dialog');
const dialogText = document.querySelector('.confirmation-text');
const confirmButton = document.getElementById('confirm');
const cancelButtonDialog = document.getElementById('cancel');
const searchInput = document.querySelector('.search-input');
const sortingSelector = document.querySelector('.sorting-selector');
const filterSelector = document.querySelector('.filter-selector');
const selectList = document.querySelectorAll('select');
const emptyListMessage = document.querySelector('.empty-list-message');
const invalidInputMessage = document.querySelector('.invalid-input-message');

const date = new Date();

let taskToManipulate = null;

export default class TaskView {

    static renderContent(tasks) {
        const ul = document.querySelector('.tasks-list');
        ul.innerHTML = '';

        if (localStorage.getItem('sorting')) {
            sortingSelector.value = localStorage.getItem('sorting');
        }

        if (localStorage.getItem('filter')) {
            filterSelector.value = localStorage.getItem('filter');
        }

        const sortedTasks = this.applySorting(tasks);
        const filteredTasks = this.applyFilter(sortedTasks);

        if (filteredTasks.length === 0) {
            emptyListMessage.classList.remove('hidden');
        } else {
            emptyListMessage.classList.add('hidden');
        }

        filteredTasks.forEach(task => {
            const li = this.createTask(task);
            ul.appendChild(li);
        })
    }

    static initializeEventListeners(tasks) {
        newTaskButton.addEventListener('click', () => UtilityFunctions.handleOverlay('open', newTaskForm));
        newTaskButtonMobile.addEventListener('click', () => UtilityFunctions.handleOverlay('open', newTaskForm));
        submitFormButton.addEventListener('click', (e) => this.validateForm(e));
        cancelButton.addEventListener('click', (e) => this.handleCancelNewTaskForm(e));
        confirmButton.addEventListener('click', () => this.handleConfirm());
        cancelButtonDialog.addEventListener('click', (e) => this.handleCancel(e));
        searchInput.addEventListener('input', () => this.searchTaskByName());
        selectList.forEach(selector => selector.addEventListener('change', (e) => this.handleSelectorChange(e, tasks)));
    }

    static createTask(task) {
        const li = document.createElement('li');
        li.classList.add('list-item');

        if (!task.pending) {
            li.classList.add('completed');
        }

        const h5 = document.createElement('h5');
        h5.classList.add('task-name')
        h5.textContent = task.name;

        const pDescription = document.createElement('p');
        pDescription.classList.add('task-description');
        pDescription.textContent = task.description;

        const divFooter = document.createElement('div');
        divFooter.classList.add('task-footer');

        const divDate = document.createElement('p');
        divDate.classList.add('task-div-date');

        const pDateDescription= document.createElement('p');
        pDateDescription.classList.add('task-date-description');
        pDateDescription.textContent = task.pending ? 'Criado em:' : 'Concluído em:';

        const pDate = document.createElement('p');
        pDate.classList.add('task-date');
        pDate.textContent = new Date(task.date).toLocaleDateString('pt-br');

        const pPriority = document.createElement('p');
        pPriority.classList.add('task-priority');
        pPriority.classList.add(this.definePriorityStyling(task.priority))
        pPriority.textContent = task.priority

        if (!task.pending) {
            pPriority.classList.add('neutral');
        }

        const divOptions = document.createElement('div');
        divOptions.classList.add('task-options');

        const completeButton = this.createButton(task.pending ? '../../assets/check-square.svg' : '../../assets/check-square-fill.svg', task.pending ? 'ícone de confirmação para adicionar tarfeas a lista de concluídas' : 'ícone de confirmação para adicionar tarfeas a lista de concluídas selecionado');

        completeButton.addEventListener('click', () => {
            if (task.pending) {
                this.createDialog('complete');
            } else {
                this.createDialog('remove');
            }
            taskToManipulate = [li, task];
        })

        const editButton = this.createButton('../../assets/pencil-square.svg', 'ícone de edição');

        editButton.addEventListener('click', () => this.handleEditButton(task));

        if (!task.pending) {
            editButton.classList.add('hidden');
        }

        const deleteButton = this.createButton('../../assets/trash3.svg', 'ícone de lixeira representando o botão de excluir');

        deleteButton.addEventListener('click', () => {
            this.createDialog('delete');
            taskToManipulate = [li, task];
        })

        divOptions.appendChild(completeButton);
        divOptions.appendChild(editButton);
        divOptions.appendChild(deleteButton);
        divDate.appendChild(pDateDescription);
        divDate.appendChild(pDate);
        divFooter.appendChild(divDate);
        divFooter.appendChild(pPriority);
        divFooter.appendChild(divOptions);
        li.appendChild(h5);
        li.appendChild(pDescription);
        li.appendChild(divFooter);

        return li;
    }

    static createButton(srcButtonImage, altButtonImage) {
        const button = document.createElement('button');
        const buttonImage = document.createElement('img');
        buttonImage.src = srcButtonImage;
        buttonImage.alt = altButtonImage;
        button.appendChild(buttonImage);
        return button;
    }

    static validateForm(e) {
        e.preventDefault();
        if (titleInput.value.trim() == '' || descriptionInput.value.trim() == '') {
            invalidInputMessage.classList.remove('hidden');
        } else {
            invalidInputMessage.classList.add('hidden');
            this.handleSubmitNewTaskForm();
        }
    }

    static handleSubmitNewTaskForm() {
        UtilityFunctions.handleOverlay('close', newTaskForm);
        if (idInput.value) {
            TaskService.editTask(new TaskPayload(titleInput.value, descriptionInput.value, date, priorityInput.value, idInput.value));
        } else {
            TaskService.createTask(new TaskPayload(titleInput.value, descriptionInput.value, date, priorityInput.value));
        }
    }

    static handleCancelNewTaskForm(e) {
        e.preventDefault();
        this.resetNewTaskForm();
        UtilityFunctions.handleOverlay('close', newTaskForm);
    }

    static resetNewTaskForm() {
        invalidInputMessage.classList.add('hidden');
        formTitle.textContent = 'Criar nova tarefa';
        submitFormButton.textContent = 'Criar';
        titleInput.value = '';
        descriptionInput.value = '';
        priorityInput.value = 'Baixa prioridade';
    }

    static definePriorityStyling(priority) {
        if (priority == 'Muito importante') return 'very-important';
        else if (priority == 'Importante') return 'important';
        else return 'low-priority';
    }

    static handleEditButton(task) {
        formTitle.textContent = 'Editar tarefa';
        submitFormButton.textContent = 'Confirmar';
        idInput.value = task.id;
        titleInput.value = task.name;
        descriptionInput.value = task.description;
        priorityInput.value = task.priority;
        UtilityFunctions.handleOverlay('open', newTaskForm);
    }

    static createDialog(dialogType) {
        if (dialogType == 'delete') {
            dialogText.innerHTML = "Tem certeza que deseja excluir a tarefa? <br><br> <span class='dialog-remocao'>Atenção: Essa alteração afetará o histórico de tarefas<span>";
            confirmButton.value = 'delete'
        } else if (dialogType == 'complete') {
            dialogText.innerHTML = 'Tem certeza que deseja marcar a tarefa como concluída?';
            confirmButton.value = 'complete'
        } else {
            dialogText.innerHTML = "Tem certeza que deseja remover a tarefa da lista de concluídas? <br><br> <span class='dialog-remocao'>Atenção: Essa alteração afetará o histórico de tarefas<span>";
            confirmButton.value = 'remove'
        }

        UtilityFunctions.handleOverlay('open', confirmationDialog)
    }

    static handleConfirm() {
        if (confirmButton.value == 'delete') {
            this.handleDeleteConfirmation();
        } else {
            this.handleCompleteConfirmation();
        }
    }

    static handleCompleteConfirmation() {
        const task = taskToManipulate[1]
        if (task.pending == true) {
            TaskService.editTask(new TaskPayload(task.name, task.description, date, task.priority, task.id, false))
        } else {
            TaskService.editTask(new TaskPayload(task.name, task.description, date, task.priority, task.id))
        }
        taskToManipulate = null;
        UtilityFunctions.handleOverlay('close', confirmationDialog)
    }

    static handleDeleteConfirmation() {
        taskToManipulate[0].remove();
        TaskService.deleteTask(taskToManipulate[1]);
        taskToManipulate = null;
        UtilityFunctions.handleOverlay('close', confirmationDialog)
    }

    static handleCancel(e) {
        e.preventDefault();
        UtilityFunctions.handleOverlay('close', confirmationDialog);
        taskToManipulate = null;
    }

    static handleSelectorChange(e, tasks) {
        if (e.target.name == 'sorting') {
            localStorage.setItem('sorting', sortingSelector.value);
        } if (e.target.name  == 'filter') {
            localStorage.setItem('filter', filterSelector.value);
        }
        this.renderContent(tasks);
    }

    static searchTaskByName() {
        const regex = new RegExp(searchInput.value, 'i');
        TaskService.searchTaskByName(regex);
    }

    static applySorting(tasks) {
        let sortedTasks;
        if (sortingSelector.value == 'priority') {
            const priorityMap = {
                'Muito importante': 1,
                'Importante': 2,
                'Baixa prioridade': 3
            };

            sortedTasks = tasks.sort((a, b) => {
                return priorityMap[a.priority] - priorityMap[b.priority];
            });

        } else {
            sortedTasks = tasks.sort((a, b) => {
                if (new Date(a.date) > new Date(b.date)) {
                    return -1
                } else if (new Date(a.date) < new Date(b.date)) {
                    return +1
                } else {
                    return 0;
                }
            })
        }
        return sortedTasks;
    }

    static applyFilter(tasks) {
        let filteredTasks;
        if (filterSelector.value == 'pending') {
            filteredTasks = tasks.filter(task => {
                return task.pending == true;
            })
        } else if (filterSelector.value == 'completed') {
            filteredTasks = tasks.filter(task => {
                return task.pending == false;
            })
        } else {
            filteredTasks = tasks;
        }
        return filteredTasks;
    }
}