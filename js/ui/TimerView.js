import UtilityFunctions from "../shared/UtilityFunctions.js";

const newStrategyButton = document.querySelector('.new-strategy-button');
const newStrategyForm = document.querySelector('.new-strategy-form');
const sendStrategyButton = document.querySelector('.send-strategy-button');
const cancelStrategyButton = document.querySelector('.cancel-strategy-button');
const focusInput = document.getElementById('focus');
const shortRestInput = document.getElementById('short-rest');
const longRestInput = document.getElementById('long-rest');
const cycleButtons = document.querySelectorAll('.cycle-item');
const counter = document.querySelector('.counter');
const startButton = document.querySelector('.start-button');
const restartButton = document.querySelector('.restart-button');
const strategySelector = document.querySelector('.strategy-selector');
const invalidValuesMessage = document.querySelector('.invalid-values-message');

let focusCurrentValue;
let shortRestCurrentValue;
let longRestCurrentValue;
let firstClick = true;
let strategyCurrentValue;
let cycleCurrentValue;
let countCurrentValue;
let interval = null;

export default class TimerView {

    static loadContent() {

        if (localStorage.getItem('cycle')) {
            cycleCurrentValue = localStorage.getItem('cycle');
        } else {
            cycleCurrentValue = 'focus';
        }

        if (localStorage.getItem('count')) {
            countCurrentValue = localStorage.getItem('count');
        } else {
            countCurrentValue = 1500000;
        }

        if (localStorage.getItem('first-click')) {
            firstClick = localStorage.getItem('first-click');

            if (firstClick == 'false') {
                restartButton.classList.remove('hidden');
                startButton.innerHTML = "Continuar <img class='start-button-image' src='../assets/play-fill.svg'></button>";
            }
        }

        if (localStorage.getItem('strategy')) {
            strategyCurrentValue = localStorage.getItem('strategy');

            if (strategyCurrentValue == 'custom') {
                this.createNewOptionInSelector();
            }

            strategySelector.value = strategyCurrentValue;
            this.applyChange(strategyCurrentValue);
        } else {
            strategyCurrentValue = 'pomodoro';
        }

        if (localStorage.getItem('strategy-details')) {
            this.createNewOptionInSelector();
        }

        cycleButtons.forEach(button => {
            button.classList.remove('checked');
            if (button.value == cycleCurrentValue) {
                button.classList.add('checked');
            }
        })

        this.formatCount();
    }

    static initializeEventListeners() {
        newStrategyButton.addEventListener('click', () => UtilityFunctions.handleOverlay('open', newStrategyForm));
        sendStrategyButton.addEventListener('click', (e) => this.validateForm(e));
        cancelStrategyButton.addEventListener('click', (e) => this.handleCancel(e));
        strategySelector.addEventListener('change', () => this.changeStrategy());
        cycleButtons.forEach(button => button.addEventListener('click', () => this.changeCycle(button)));
        startButton.addEventListener('click', () => this.handleStartOrPause());
        restartButton.addEventListener('click', () => this.resetCounter());
    }

    static validateForm(e) {
        e.preventDefault();

        const inputs = [focusInput.value, shortRestInput.value, longRestInput.value];
        if (inputs.some(value => value <= 0 || value > 240)) {
            invalidValuesMessage.textContent = 'Campo(s) preenchido(s) incorretamente. Por favor preencha apenas com valores positivos e inferiores a 240'
            invalidValuesMessage.classList.remove('hidden');
        } else {
            invalidValuesMessage.classList.add('hidden');
            this.handleFormSubmit();
        }
    }

    static handleFormSubmit() {
        const newStrategy = {
            focus: focusInput.value,
            shortRest: shortRestInput.value,
            longRest: longRestInput.value
        }

        localStorage.setItem('strategy-details', JSON.stringify(newStrategy));

        this.createNewOptionInSelector();

        this.resetNewStrategyForm();
        UtilityFunctions.handleOverlay('close', newStrategyForm);
        strategySelector.value = 'custom';
        localStorage.setItem('strategy', 'custom');
        this.changeStrategy();
    }

    static createNewOptionInSelector() {
        let customOption = strategySelector.querySelector("option[value='custom']");

        if (!customOption) {
            customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = 'Personalizado';
            strategySelector.appendChild(customOption);
        }
    }

    static handleCancel(e) {
        e.preventDefault();
        this.resetNewStrategyForm();
        UtilityFunctions.handleOverlay('close', newStrategyForm);
    }

    static resetNewStrategyForm() {
        invalidValuesMessage.classList.add('hidden');
        focusInput.value = '';
        shortRestInput.value = '';
        longRestInput.value = '';
    }

    static changeCycle(button) {
        console.log(button.value);
        if (button.value == 'focus') {
            cycleCurrentValue = 'focus';
        } else if (button.value == 'short-rest') {
            cycleCurrentValue = 'short-rest';
        } else {
            cycleCurrentValue = 'long-rest';
        }
        localStorage.setItem('cycle', cycleCurrentValue);
        this.applyChange();
        this.resetCounter();
    }

    static changeStrategy() {
        //redefine a visibilidade de todos os botões para garantir que descanso curto seja exibido independentemente da estratégia anterior
        cycleButtons.forEach(button => button.classList.remove('hidden'));

        if (strategySelector.value == 'pomodoro') {
            strategyCurrentValue = 'pomodoro';
        } else if (strategySelector.value == '52') {
            strategyCurrentValue = '52';
        } else if (strategySelector.value == '112') {
            strategyCurrentValue = '112';
        } else {
            strategyCurrentValue = 'custom';
        }
        localStorage.setItem('strategy', strategyCurrentValue);
        this.applyChange();
        this.resetCounter();
    }

    static applyChange() {
        if (strategyCurrentValue == 'pomodoro') {
            this.setCycleValues(25, 5, 15);
        } else if (strategyCurrentValue == '52') {
            this.setCycleValues(52, null, 17);
            // Altera para focus caso o cycle atual seja short-rest pois nessa estratégia só há dois cycles
            if (cycleCurrentValue == 'short-rest') {
                cycleCurrentValue = 'focus';
                cycleButtons[0].classList.add('checked');
                localStorage.setItem('cycle', cycleCurrentValue);
            }
            // Esconde o botão de descanso curto
            cycleButtons[1].classList.add('hidden');
        } else if (strategyCurrentValue == '112') {
            this.setCycleValues(112, null, 26);
            // Altera para focus caso o cycle atual seja short-rest pois nessa estratégia só há dois cycles
            if (cycleCurrentValue === 'short-rest') {
                cycleCurrentValue = 'focus';
                cycleButtons[0].classList.add('checked');
                localStorage.setItem('cycle', cycleCurrentValue);
            }
            // Esconde o botão de descanso curto
            cycleButtons[1].classList.add('hidden');
        } else {
            const details = JSON.parse(localStorage.getItem('strategy-details'));
            this.setCycleValues(details.focus, details.shortRest, details.longRest);
        }
    }

    static setCycleValues(cycleFocus, cycleShortRest, cycleLongRest) {
        focusCurrentValue = cycleFocus * 60 * 1000;
        shortRestCurrentValue = cycleShortRest * 60 * 1000;
        longRestCurrentValue = cycleLongRest * 60 * 1000;
    }

    static handleStartOrPause() {
        if (interval) {
            startButton.innerHTML = "Continuar <img class='start-button-image' src='../assets/play-fill.svg'></button>";
            clearInterval(interval);
            interval = null;
            restartButton.classList.remove('hidden');
            return;
        }
        firstClick = false;
        localStorage.setItem('first-click', false);
        restartButton.classList.add('hidden');
        interval = setInterval(() => this.countdown(), 1000);
        startButton.innerHTML = "Pausar <img class='start-button-image' src='../assets/pause-fill.svg'></button>";
    }

    static countdown() {
        if (countCurrentValue <= 0) {
            this.finishCount();
            return;
        }
        countCurrentValue -= 1000;
        localStorage.setItem('count', countCurrentValue);
        this.formatCount();
    }

    static finishCount() {
        localStorage.removeItem('count');
        this.showCompletedTasks();
        this.resetCounter();
    }

    static resetCounter() {
        clearInterval(interval);
        interval = null;
        firstClick = true;
        restartButton.classList.add('hidden');
        startButton.innerHTML = "Começar <img class='start-button-image' src='../assets/play-fill.svg'></button>";
        if (cycleCurrentValue == 'focus') {
            countCurrentValue = focusCurrentValue;
        } else if (cycleCurrentValue == 'short-rest') {
            countCurrentValue = shortRestCurrentValue;
        } else {
            countCurrentValue = longRestCurrentValue;
        }
        localStorage.setItem('first-click', true);
        localStorage.setItem('count', countCurrentValue);
        this.loadContent();
    }

    static formatCount() {
        if (countCurrentValue >= 3600000) {
            counter.textContent = new Date(Number(countCurrentValue)).toLocaleTimeString('pt-Br', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' });
        } else {
            counter.textContent = new Date(Number(countCurrentValue)).toLocaleTimeString('pt-Br', { minute: '2-digit', second: '2-digit' });
        }
    }

    static showCompletedTasks() {
        const notification = document.querySelector('.completion-notification');
        notification.classList.add('show');

        setTimeout(() => {
           notification.classList.remove('show');
        }, 3000);
    }
}