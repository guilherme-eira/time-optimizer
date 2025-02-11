const overlay = document.querySelector('.overlay');

export default class UtilityFunctions {

    static handleOverlay(action, form) {

        if (action == "open") {
            form.classList.remove('hidden');
            overlay.classList.remove('hidden');
        }
        else {
            form.classList.add('hidden');
            overlay.classList.add('hidden');
        }
    }
}