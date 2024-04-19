// Define a URL base da API onde as requisições de tarefas serão enviadas
const apiUrl = 'http://127.0.0.1:5000/';

/**
 * Função assíncrona para adicionar ou alterar um tipo de tarefa.
 * Captura os dados do formulário na página, define a URL apropriada
 * baseando-se no ID da tarefa e realiza uma requisição POST para o servidor.
 * Exibe mensagens adequadas com base no resultado da operação.
 */
async function adicionarTarefaTipo() {
  // Preparando os dados do formulário para envio
  const formData = new FormData();
  formData.append('descricao', document.getElementById('descricao').value);
  formData.append('tempo', document.getElementById('tempo').value);
  formData.append('id_tarefa_tipo', document.getElementById('id_tarefa_tipo').value);

  // Logs para depuração que podem ser removidos em produção
  console.log(formData);
  console.log("ID");
  console.log(document.getElementById('id_tarefa_tipo').value);

  // Determina a URL da API com base no valor do ID
  let tipourl = "";
  if (document.getElementById('id_tarefa_tipo').value > 0) {
    // Se ID é maior que 0, a tarefa já existe e a operação é uma alteração
    tipourl = `${apiUrl}/tarefa_tipo_alteracao`;
  } else {
    // Se ID é 0 ou indefinido, a operação é de criação de nova tarefa
    tipourl = `${apiUrl}/tarefa_tipo`;
  }

  let url = tipourl;

  // Realiza a requisição POST com os dados do formulário
  fetch(url, {
    method: 'post',
    body: formData
  })
  .then(response => {
    // Verifica se a resposta é bem-sucedida
    if (response.ok) {        
      console.log('Tarefa atualizada com sucesso!');          
    } else {
      // Lança uma exceção se a resposta não for bem-sucedida
      throw new Error('Falha ao adicionar a tarefa. Tente novamente.');
    }
  })
  .then(data => {
    // Informa o usuário do sucesso da operação, atualiza a lista e limpa os campos
    alert('Tipo de Tarefa atualizada com sucesso!');
    listarTarefasTipos(); // Atualiza a lista de tipos de tarefa
    limparcampos();       // Limpa os campos do formulário
    console.log(data);    // Logs para depuração
  })
  .catch(error => {      
    // Captura e trata qualquer erro ocorrido durante a requisição
    console.error('Erro:', error);
    alert('Erro: ' + error.message); 
  });
  limparcampos()
}



/**
 * Função assíncrona para buscar e exibir os tipos de tarefa em uma tabela HTML.
 * A função faz uma requisição à API para obter os tipos de tarefa e os apresenta
 * em uma tabela com colunas para descrição, tempo necessário, e opções para editar e excluir.
 */
async function listarTarefasTipos() {
  // Faz uma requisição GET para obter a lista de tipos de tarefa da API
  const response = await fetch(`${apiUrl}/lista_tarefa_tipo`);
  const data = await response.json(); // Converte a resposta em JSON

  // Ordena os tipos de tarefa por descrição de forma alfabética
  data.tarefa_tipos.sort((a, b) => a.descricao.localeCompare(b.descricao));

  // Seleciona o elemento tabela no documento HTML
  const tabela = document.getElementById('tabelaTarefasTipos');
  tabela.innerHTML = '';  // Limpa o conteúdo anterior da tabela

  // Cria e insere o cabeçalho da tabela
  let cabecalho = tabela.createTHead();
  let row = cabecalho.insertRow();
  let colunas = ['Descrição', 'Tempo(horas)', 'Editar', 'Excluir']; // Define os títulos das colunas
  colunas.forEach((coluna, index) => {
      let th = document.createElement('th'); // Cria o elemento cabeçalho da coluna
      th.textContent = coluna; // Define o texto do cabeçalho
      // Aplica classe de centralização exceto para a coluna 'Descrição'
      if (index > 0) {
          th.classList.add('centralizado');
      }
      row.appendChild(th); // Adiciona o cabeçalho à linha
  });

  // Cria e prepara o corpo da tabela
  let tbody = tabela.createTBody();

  // Itera sobre cada tipo de tarefa recebido da API e adiciona uma linha na tabela para cada um
  data.tarefa_tipos.forEach(tarefaTipo => {
      let linha = tbody.insertRow(); // Cria uma nova linha no corpo da tabela

      // Célula de descrição
      let descricaoCell = linha.insertCell();
      descricaoCell.textContent = tarefaTipo.descricao;

      // Célula de tempo, formatada em horas e minutos
      let tempoCell = linha.insertCell();      
      tempoCell.textContent = formatarTempoEmHorasEMinutos(tarefaTipo.tempo);
      tempoCell.classList.add('centralizado'); 

      // Célula de edição, inclui um ícone interativo para editar
      let editarCell = linha.insertCell();
      let editarIcone = document.createElement('i'); // Cria um ícone
      editarIcone.className = 'fas fa-edit';
      editarIcone.style.cursor = 'pointer';
      editarIcone.title = `Editar: ${tarefaTipo.descricao}`;
      editarIcone.onclick = () => editarTarefaTipo(tarefaTipo.id_tarefa_tipo, tarefaTipo.descricao, tarefaTipo.tempo);
      editarCell.appendChild(editarIcone);
      editarCell.classList.add('centralizado');

      // Célula de exclusão, inclui um ícone interativo para excluir
      let excluirCell = linha.insertCell();
      let excluirIcone = document.createElement('i'); // Cria um ícone
      excluirIcone.className = 'fas fa-trash-alt';
      excluirIcone.style.cursor = 'pointer';
      excluirIcone.title = `Excluir: ${tarefaTipo.descricao}`;
      excluirIcone.onclick = () => excluirTarefaTipo(tarefaTipo.id_tarefa_tipo, tarefaTipo.descricao);
      excluirCell.appendChild(excluirIcone);
      excluirCell.classList.add('centralizado');
  });
}

/**
 * Função assíncrona para preencher o formulário de edição com os dados existentes de um tipo de tarefa.
 * Essa função é utilizada para carregar os dados no formulário quando um usuário deseja editar um tipo de tarefa existente. *
 */
async function editarTarefaTipo(id_tarefa_tipo, descricao, tempo) {
  document.getElementById('descricao').value = descricao;
  document.getElementById('tempo').value = tempo;
  document.getElementById('id_tarefa_tipo').value = id_tarefa_tipo;
}

/**
 * Função assíncrona para excluir um tipo de tarefa.
 * A função pede confirmação ao usuário antes de prosseguir com a exclusão.
 * Se confirmado, realiza uma requisição DELETE para a API e processa a resposta.
 *
 * @param {number} id_tarefa_tipo - O ID do tipo de tarefa a ser excluída.
 * @param {string} descricao - A descrição do tipo de tarefa, usada para confirmar a exclusão.
 */
async function excluirTarefaTipo(id_tarefa_tipo, descricao) {
  // Solicita a confirmação do usuário para excluir o tipo de tarefa
  const confirmar = confirm("Tem certeza que deseja excluir esta tarefa tipo: <<" + descricao + ">>?");
  if (confirmar) {
      try {
          // Constrói a URL para a requisição DELETE incluindo o ID do tipo de tarefa
          const url = new URL(`${apiUrl}/tarefa_tipo_id`);
          url.searchParams.append('id_tarefa_tipo', id_tarefa_tipo);

          // Faz a requisição DELETE
          const response = await fetch(url, {
              method: 'DELETE'
          });

          // Verifica se a resposta da API foi bem-sucedida
          if (!response.ok) {
              // Se a resposta não foi bem-sucedida, tenta obter a mensagem de erro do corpo da resposta
              const errorResponse = await response.json();
              throw new Error(errorResponse.message || 'Falha ao excluir a tarefa tipo.');
          }

          // Lê a resposta JSON da API
          const data = await response.json();
          // Exibe uma mensagem com o resultado da operação
          alert(data.message || 'Tarefa tipo excluída com sucesso!');

          // Atualiza a lista de tipos de tarefa após a exclusão
          listarTarefasTipos();
      } catch (error) {
          // Trata qualquer erro que ocorra durante a requisição ou processamento da resposta
          console.error('Erro:', error);
          alert('Erro ao excluir a tarefa tipo: ' + error.message);
      }
  }
  limparcampos()
}

async function excluirTodasTarefaTipo() {
  const confirmar = confirm("Tem certeza que deseja apagar todas as tarefas?");
  if (confirmar) {
      const tarefasNaoExcluidas = [];

      try {
          const response = await fetch(`${apiUrl}/lista_tarefa_tipo`);
          if (!response.ok) {
              throw new Error('Falha ao obter as tarefas.');
          }
          const { tarefa_tipos } = await response.json();
          
          for (const tarefaTipo of tarefa_tipos) {
              try {

                  const url = new URL(`${apiUrl}/tarefa_tipo_id`);
                  url.searchParams.append('id_tarefa_tipo', tarefaTipo.id_tarefa_tipo); 
        
                  const deleteResponse = await fetch(url, {
                      method: 'DELETE'
                  });
                  if (!deleteResponse.ok) {
                      throw new Error(`Falha ao excluir tarefa ID ${tarefaTipo.id_tarefa_tipo}`);
                  }
              } catch (error) {
                  // Adiciona o ID e a descrição da tarefa ao array de tarefas não excluídas
                  tarefasNaoExcluidas.push({ id: tarefaTipo.id_tarefa_tipo, descricao: tarefaTipo.descricao });                  
              }
          }

          if (tarefasNaoExcluidas.length > 0) {
              // Constrói uma mensagem listando as tarefas não excluídas
              let mensagemErro = 'Algumas tarefas (' + tarefasNaoExcluidas.length + ') não puderam ser excluídas:\n';
              tarefasNaoExcluidas.forEach(tarefa => {
                  mensagemErro += `ID: ${tarefa.id} - ${tarefa.descricao}\n`;
              });
              console.log(mensagemErro);
              alert(mensagemErro);
          } else {
              alert('Todas as tarefas foram apagadas com sucesso!');
          }
          listarTarefasTipos(); 
      } catch (error) {
          console.error('Erro ao obter lista de tarefas:', error);
          alert('Erro ao apagar todas as tarefas: ' + error.message);
      }
  }
  listarTarefasTipos()
  listarBlocosPadrao()
  limparcampos()
}


function formatarTempoEmHorasEMinutos(minutos) {
  let horas = Math.floor(minutos / 60);
  let mins = minutos % 60;  
  horas = horas.toString().padStart(2, '0');
  mins = mins.toString().padStart(2, '0');
  return `${horas}:${mins}`;
}

async function listarBlocosPadrao() {
  const response = await fetch(`${apiUrl}/blocos`);
  const blocos = await response.json();

  const tabela = document.getElementById('tabelaBlocosPadrao');
  tabela.innerHTML = '';

  let cabecalho = tabela.createTHead();
  let row = cabecalho.insertRow();
  let colunas = ['ID', 'Descrição', 'Tempo', 'Dias da Semana', 'Tarefas','Excluir'];
  colunas.forEach(coluna => {
      let th = document.createElement('th');
      th.textContent = coluna;
      row.appendChild(th);
  });

  let tbody = tabela.createTBody();

  blocos.forEach(bloco => {
      console.log('Bloco: ' + bloco.descricao);
      let linha = tbody.insertRow();
      linha.insertCell().textContent = bloco.id_bloco_padrao;
      linha.insertCell().textContent = bloco.descricao;
      linha.insertCell().textContent = bloco.tempo + ' minutos';
      linha.insertCell().textContent = bloco.dias_semana;

      let icon = document.createElement('i');
      icon.className = 'fas fa-eye'; 
      icon.title = 'Clique para ver as tarefas'; 

      let tarefasList = bloco.tarefas.map(tarefa => tarefa.descricao_tarefa_tipo).join(', ');
      let tarefasCell = linha.insertCell();      
      tarefasCell.appendChild(document.createTextNode(tarefasList + " "));      
      tarefasCell.appendChild(icon);
      
      tarefasCell.style.cursor = 'pointer';
      tarefasCell.classList.add('link-style');
      tarefasCell.onclick = () => mostrarTarefas(bloco.tarefas);
      tarefasCell.classList.add('interactive-cell');            

      let acaoCell = linha.insertCell();      
      let deleteIcon = document.createElement('i');
      deleteIcon.className = 'fas fa-trash-alt';
      deleteIcon.style.cursor = 'pointer';
      deleteIcon.title = 'Excluir Bloco';
      deleteIcon.onclick = () => excluirBlocoPadrao(bloco.id_bloco_padrao);
      acaoCell.appendChild(deleteIcon); 
      acaoCell.classList.add('centralizado_bloco');     
      

  });
}

async function mostrarTarefas(tarefas) {
  document.getElementById('popupTarefas').style.display = 'block';
  const tabela = document.getElementById('detalhesTarefas').getElementsByTagName('tbody')[0];
  tabela.innerHTML = '';

  let horarioAtual = new Date(); // Usado para calcular horários sequenciais
  horarioAtual.setHours(0, 0, 0, 0); // Configura a hora inicial para 00:00

  // Ordenando as tarefas pelo id_tarefa_padrao antes de inseri-las na tabela
  tarefas.sort((a, b) => a.id_tarefa_padrao - b.id_tarefa_padrao);

  tarefas.forEach(tarefa => {
      let row = tabela.insertRow();
      row.insertCell().textContent = tarefa.descricao_tarefa_tipo;      
      row.insertCell().textContent = tarefa.detalhes;      
      row.insertCell().textContent = tarefa.tempo + ' minutos';

      // Cálculo do horário de término
      let horarioInicio = new Date(horarioAtual.getTime()); // Cópia do horário atual para o horário de início
      horarioAtual.setMinutes(horarioAtual.getMinutes() + tarefa.tempo); // Adiciona o tempo da tarefa ao horário atual

      // Formata os horários para exibição
      let horarioInicioStr = horarioInicio.toTimeString().substr(0, 5);
      let horarioTerminoStr = horarioAtual.toTimeString().substr(0, 5);

      row.insertCell().textContent = horarioInicioStr;
      row.insertCell().textContent = horarioTerminoStr;
  });
}

async function excluirBlocoPadrao(id_bloco_padrao) {
  const confirmar = confirm("Tem certeza que deseja excluir este bloco padrão?");
  if (confirmar) {

      const url = new URL(`${apiUrl}/apagar_bloco_padrao`);
      url.searchParams.append('id_bloco_padrao', id_bloco_padrao); 
      const response = await fetch(url, {
          method: 'DELETE'
      });
      if (response.ok) {
          alert('Bloco padrão excluído com sucesso!');
          listarBlocosPadrao(); // Atualiza a lista após a exclusão
      } else {
          alert('Erro ao excluir bloco padrão.');
      }
  }
}

document.addEventListener('keydown', function(event) {
  // Verifica se a tecla pressionada foi 'Esc'
  if (event.key === "Escape") {
    // Chama a função para fechar o popup
    fecharPopup();
  }
});

function fecharPopup() {
  document.getElementById('popupTarefas').style.display = 'none';
}

async function limparcampos() {
  const descricao = document.getElementById('descricao');
  const tempo = document.getElementById('tempo');
  const id = document.getElementById('id_tarefa_tipo');

  if (descricao) descricao.value = "";
  if (tempo) tempo.value = "";
  if (id_tarefa_tipo) id.value = "";
}  


// Carrega a lista inicialmente
listarTarefasTipos();
listarBlocosPadrao();