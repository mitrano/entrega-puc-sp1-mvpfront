# Frontend Daily Plan

## Descrição do Sistema de Gerenciamento de Tarefas e Blocos Padrão

### Visão Geral do Sistema

O sistema é projetado para oferecer uma solução de gerenciamento de tarefas e blocos padrão, ideal para pessoas que buscam otimizar a alocação de seu tempo diário (as 24 horas do dia). O foco principal é permitir que os usuários criem, gerenciem e monitorem tarefas agrupadas em blocos padrão, com aplicação em diversos cenários de atividade da vida das pessoas.

### Objetivos de Negócio

- Melhoria da Eficácia Operacional: Automatizar o planejamento de tarefas repetitivas e rotineiras para reduzir o tempo de setup e evitar que a pessoa se perca durante o dia em tarefas não planejadas e dispersantes.
- Flexibilidade na Gestão de Tarefas: Facilitar a customização e ajustes de tarefas e blocos de trabalho conforme necessidades específicas da pessoa.
- Visibilidade Aprimorada: Prover relatórios detalhados e visualizações claras das atividades planejadas e sua execução, ajudando na tomada de decisão e na melhoria contínua das atividades diárias (sem funcionalidades ainda disponíveis nesta primeira versão).

### Características Principais

- Gestão de Tarefas e Blocos Padrão: Criação e gerenciamento de tarefas individuais e agrupamento delas em blocos padrão, cada um podendo ser configurado para ocorrer em dias específicos da semana.
- Relatórios com as tarefas mais executadas e a transparência da diferença entre o planejado e executado.

### Tecnologias Utilizadas

- HTML: A estrutura da página é definida no arquivo index.html, que inclui formulários para a entrada de dados (descrição e tempo das tarefas), e tabelas para exibição dos dados cadastrados. Utilizo elementos semânticos para garantir acessibilidade e boa estruturação do conteúdo.

- CSS: O estilo da aplicação é gerenciado pelo arquivo style.css, onde defini a estética da página incluindo layout, esquemas de cores, e estilos de texto. A aplicação é responsiva, adaptando-se a diferentes tamanhos de tela para garantir uma boa experiência de usuário em dispositivos móveis e desktops.

- JavaScript: A dinâmica da página é controlada pelo arquivo app.js. Implementei funcionalidades para manipular o DOM conforme as interações do usuário, como adicionar e remover tarefas, e realizar chamadas assíncronas (AJAX) para a API REST sem necessidade de recarregar a página.

- Font Awesome: Integrei ícones do Font Awesome para melhorar a interface visual e proporcionar uma interação mais intuitiva, utilizando ícones para funções de edição e exclusão de tarefas.
---
## Como executar 

### Execução do Frontend

Para executar o frontend deste sistema de gerenciamento de tarefas, que interage com uma API REST desenvolvida em Python com Flask, siga os passos abaixo.

- Baixe os arquivos do repositório em sua máquina
- Execute o comando abaixo no Visula Studio Code

```comando
python -m http.server 5001
```

- Acesse a aplicação no browser chamando a seguinte url

```
http://127.0.0.1:5001/
```

### Execução da API

Inicie a API conforme está definido no arquivo readme.md do respectivo repositório abaixo:

---
## Endpoints eleitos para avaliação da disciplina Full Stack Básico - Sprint 01

Estes três endpoints são utilizados na aplicação chamados através do frontend.

### GET /blocos

Endpoint GET para buscar todos os Blocos Padrão com suas respectivas tarefas padrão cadastrados.

### POST /tarefa_tipo

Endpoint POST para adicionar um novo tipo de tarefa na base de dados.

### DELETE /tarefa_tipo_id

Endpoint DELETE para deletar um tipo de tarefa específico por ID.

## Demais Endpoints Utilizados na Aplicação 

Estes endpoints abaixo são utilizados na aplicação (chamados através do frontend).

- POST /tarefa_tipo_alteracao
- GET /listar_tipo_tarefa
- DELETE /apagar_bloco_padrao

## Demais Endpoints não utilizados na aplicação

Estes endpoints abaixo não são utilizados na aplicação, foram criados durante o desenvolvimento mas não houve tempo de incluir a sua chamada pelo front end.

- POST /bloco
- DELETE /tarefa_tipo_descricao
