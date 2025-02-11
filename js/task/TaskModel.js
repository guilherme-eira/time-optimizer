export default class TaskModel {
    constructor(name, description, date, priority, id = null, pending = true) {
        if (id != null) {
            this.id = id;
        }
        this.name = name;
        this.description= description;
        this.date = date;
        this.priority = priority;
        this.pending = pending; 
    }
}