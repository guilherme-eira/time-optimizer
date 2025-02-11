# TimeOptimizer

TimeOptimizer é uma aplicação web projetada para ajudar os usuários a otimizar seu tempo de estudo, gerenciando suas tarefas, controlando o tempo dedicado a cada atividade e monitorando o progresso por meio de gráficos e relatórios. A aplicação permite que os usuários se concentrem em suas tarefas de maneira eficiente, facilitando a organização do tempo e aumentando a produtividade.

## Funcionalidades

- **Gerenciamento de Tarefas (MyTasks):** Organize, adicione, edite e remova tarefas para o seu planejamento de estudo.
- **Controle de Tempo (Timer):** Use um timer para gerenciar o tempo de estudo e descanso de maneira eficiente.
- **Dashboard:** Acompanhe seu progresso com gráficos dinâmicos, mostrando estatísticas sobre o tempo de estudo e a conclusão das tarefas.

## Tecnologias Utilizadas

- **HTML:** Estrutura da página.
- **CSS:** Estilização da interface.
- **JavaScript:** Lógica de funcionamento da aplicação.
- **Chart.js (via CDN):** Para exibição dos gráficos no dashboard.
- **JSON Server:** Para simulação de uma API RESTful para armazenamento e manipulação de dados de tarefas.

## Como Usar

### Instale as dependências:
Para instalar as dependências do projeto, execute o seguinte comando no terminal:

```bash
npm install
```

### Inicie o servidor JSON:
Para rodar o servidor de mock de dados, execute o seguinte comando no terminal:

```bash
npx json-server --watch db.json --port 3000
```

 Você também pode utilizar o script configurado no `package.json`:

```bash
npm run db
```

 Isso irá iniciar o json-server e a aplicação estará rodando localmente em http://localhost:3000.
 
### População de Dados
O arquivo `db.json` já estará populado com dados de exemplo para que você possa visualizar o funcionamento do site. Se preferir, basta entrar no arquivo `db.json` e apagar os itens da lista para começar com dados vazios.

### Acesse a aplicação
Para visualizar a aplicação, abra o arquivo `index.html` usando a extensão Live Server no VS Code ou outro servidor local.

## Considerações Finais
Este projeto teve como objetivo consolidar meus conhecimentos em HTML, CSS e JavaScript, proporcionando uma experiência prática no desenvolvimento de uma aplicação web interativa. Espero que o **TimeOptimizer** seja útil para ajudar na organização do tempo de estudo e aumento da produtividade. 

Agradeço por utilizar a aplicação! Caso tenha sugestões ou queira contribuir com melhorias, sinta-se à vontade para abrir uma issue ou pull request. Ficarei feliz em receber seu feedback!

