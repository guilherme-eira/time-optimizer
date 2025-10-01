const URL_BASE = "http://localhost:3000"

export default class ApiClient {

    static async readAll() {
        try {
            const response = await fetch(`${URL_BASE}/tasks`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar todas as tarefas: ${response.status} ${response.statusText}`);
            }
            return response.json();
        } catch (erro) {
            throw new Error("Erro em buscaTodasAsTarefas: " + erro.message);
        }
    }

    static async create(tarefa) {
        try {
            const response = await fetch(`${URL_BASE}/tasks`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(tarefa),
            });
            if (!response.ok) {
                throw new Error(`Erro ao criar tarefa: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (erro) {
            throw new Error("Erro em criaNovaTarefa: " + erro.message);
        }
    }

    static async update(tarefa) {
        try {
            const response = await fetch(`${URL_BASE}/tasks/${tarefa.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(tarefa)
            })
            if (!response.ok) {
                throw new Error(`Erro ao editar tarefa: ${response.status} ${response.statusText}`);
            }
            return response.json();
        } catch (erro) {
            throw new Error("Erro em editaTarefa: " + erro.message);
        }
    }

    static async delete(tarefa) {
        try {
            const response = await fetch(`${URL_BASE}/tasks/${tarefa.id}`, {
                method: "DELETE"
            })
            if (!response.ok) {
                throw new Error(`Erro ao excluir tarefa: ${response.status} ${response.statusText}`);
            }
        } catch (erro) {
            throw new Error("Erro em excluiTarefa: " + erro.message);
        }
    }

    static async readByName(regex) {
        try {
            const tasks = await this.readAll();
            const filteredTasks = tasks.filter(task => {
                return task.name.match(regex)
            })
            return filteredTasks;
        } catch (erro) {
            throw new Error("Erro em buscaTarefaPorNome: " + erro.message);
        }
    }
}