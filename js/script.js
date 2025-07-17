// script.js - Código principal com a lógica de interface otimizada para imagens 900x900

// 🔄 Carrega nomes dos produtos do carrinho (não os objetos)
let carrinhoNomes = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para tratar erro de imagem com fallback melhorado
function tratarErroImagem(img) {
  img.onerror = function() {
    this.src = 'img/produto-nao-encontrado.png';
    this.alt = 'Produto não encontrado';
    this.onerror = null; // Evita loop infinito
  };
  
  // Adicionar loading lazy para performance
  img.loading = 'lazy';
  
  // Definir dimensões otimizadas para 900x900
  img.style.objectFit = 'cover';
  img.style.objectPosition = 'center';
}

// Função para criar HTML do produto otimizado
function criarProdutoHTML(produto) {
  return `
    <div class="produto-card">
      <div class="produto-imagem-container">
        <div class="produto-imagem-wrapper">
          <img 
            src="img/${produto.foto}" 
            alt="${produto.nome}" 
            class="produto-imagem"
            data-nome="${produto.nome}"
            width="900"
            height="900"
          >
          <div class="produto-overlay">
            <button class="btn-adicionar" data-produto="${produto.nome}">
              <span class="icone-carrinho">🛒</span>
              <span class="btn-texto">Adicionar ao Carrinho</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="produto-info">
        <h3 class="produto-nome" title="${produto.nome}">${produto.nome}</h3>
        <div class="produto-detalhes">
          <span class="produto-preco">${produto.valor_venda}</span>
          ${produto.tamanhos ? `<span class="produto-tamanhos">Tamanhos: ${produto.tamanhos.join(', ')}</span>` : ''}
        </div>
        <span class="produto-categoria">${produto.categoria}</span>
        ${produto.descricao ? `<h6 class="produto-descricao">${produto.descricao}</h6>` : ''}
      </div>
    </div>
  `;
}

// Exibir produtos na página
function exibirProdutos() {
  const container = document.getElementById('produtos');
  container.innerHTML = '';

  produtos.forEach((produto, index) => {
    const div = document.createElement('div');
    div.classList.add('produto');
    
    // Adicionar animação escalonada
    div.style.animationDelay = `${index * 0.1}s`;
    
    div.innerHTML = criarProdutoHTML(produto);

    // Tratar imagem
    const img = div.querySelector('.produto-imagem');
    tratarErroImagem(img);
    
    // Adicionar evento de carregamento da imagem
    img.addEventListener('load', function() {
      this.classList.add('carregada');
    });

    // Adicionar evento ao botão
    const botao = div.querySelector('.btn-adicionar');
    botao.addEventListener('click', (e) => {
      e.preventDefault();
      adicionarAoCarrinho(produto.nome);
    });
    
    container.appendChild(div);
  });
}

// Função para mostrar notificação com cor específica
function mostrarNotificacao(mensagem, tipo = 'info') {
  const notificacao = document.getElementById('notificacao');
  const mensagemNotificacao = document.getElementById('mensagemNotificacao');
  
  // Remover todas as classes de cor anteriores
  notificacao.classList.remove('notificacao-sucesso', 'notificacao-erro', 'notificacao-info');
  
  // Adicionar a classe baseada no tipo
  switch(tipo) {
    case 'sucesso':
      notificacao.classList.add('notificacao-sucesso');
      break;
    case 'erro':
      notificacao.classList.add('notificacao-erro');
      break;
    default:
      notificacao.classList.add('notificacao-info');
  }
  
  mensagemNotificacao.textContent = mensagem;
  notificacao.classList.add('mostrar');
  
  // Remove a notificação após 3 segundos
  setTimeout(() => {
    notificacao.classList.remove('mostrar');
  }, 3000);
}

// Função para adicionar ao carrinho com feedback visual
function adicionarAoCarrinho(nomeProduto) {
  const produto = produtos.find(p => p.nome === nomeProduto);
  
  if (!produto) {
    mostrarNotificacao('Produto não encontrado!', 'erro');
    return;
  }

  if (!carrinhoNomes.includes(nomeProduto)) {
    carrinhoNomes.push(nomeProduto);
    localStorage.setItem('carrinho', JSON.stringify(carrinhoNomes));
    
    // Feedback visual no botão
    const botao = document.querySelector(`[data-produto="${nomeProduto}"]`);
    if (botao) {
      botao.classList.add('adicionado');
      setTimeout(() => botao.classList.remove('adicionado'), 1000);
    }
    
    mostrarNotificacao(`${nomeProduto} adicionado ao carrinho!`, 'sucesso');
  } else {
    mostrarNotificacao('Este produto já está no seu carrinho!', 'info');
  }

  atualizarCarrinho();
  atualizarContadorCarrinho();
}

// Função para remover produto do carrinho
function removerProduto(index) {
  const nomeProduto = carrinhoNomes[index];
  carrinhoNomes.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinhoNomes));
  atualizarCarrinho();
  atualizarContadorCarrinho();
  
  mostrarNotificacao(`${nomeProduto} removido do carrinho.`, 'erro');
}

// Função para filtrar produtos otimizada
function filtrarProdutos() {
  const termoBusca = document.getElementById('busca').value.toLowerCase();
  const tipoSelecionado = document.getElementById('filtroTipo').value;

  // Exibir botão de limpar quando houver texto
  const clearBtn = document.getElementById('clear-search');
  if (clearBtn) {
    clearBtn.style.display = termoBusca ? 'block' : 'none';
  }

  const container = document.getElementById('produtos');
  container.innerHTML = '';

  // Filtrar produtos
  const produtosFiltrados = produtos.filter(produto => {
    const nomeMatch = produto.nome.toLowerCase().includes(termoBusca);
    const tipoMatch = !tipoSelecionado || produto.categoria === tipoSelecionado;
    return nomeMatch && tipoMatch;
  });
  
  // Exibir produtos filtrados
  produtosFiltrados.forEach((produto, index) => {
    const div = document.createElement('div');
    div.classList.add('produto');
    div.style.animationDelay = `${index * 0.05}s`;
    
    div.innerHTML = criarProdutoHTML(produto);

    // Tratar imagem
    const img = div.querySelector('.produto-imagem');
    tratarErroImagem(img);
    
    img.addEventListener('load', function() {
      this.classList.add('carregada');
    });

    // Adicionar evento ao botão
    const botao = div.querySelector('.btn-adicionar');
    botao.addEventListener('click', (e) => {
      e.preventDefault();
      adicionarAoCarrinho(produto.nome);
    });
    
    container.appendChild(div);
  });
  
  // Atualizar texto de resultado
  atualizarResultadoBusca(produtosFiltrados.length, termoBusca, tipoSelecionado);
}

// Função para mostrar resultado da busca
function atualizarResultadoBusca(quantidade, termo, tipo) {
  const mensagemEl = document.getElementById('resultado-busca');
  
  if (!mensagemEl) return;
  
  if (quantidade === 0) {
    mensagemEl.textContent = 'Nenhum produto encontrado';
    return;
  }
  
  let mensagem = `Encontrado${quantidade > 1 ? 's' : ''} ${quantidade} produto${quantidade > 1 ? 's' : ''}`;
  
  // Adicionar termos de filtro à mensagem
  if (termo && tipo) {
    const tipoTexto = document.querySelector(`#filtroTipo option[value="${tipo}"]`)?.textContent || tipo;
    mensagem += ` de "${tipoTexto}" contendo "${termo}"`;
  } else if (termo) {
    mensagem += ` contendo "${termo}"`;
  } else if (tipo) {
    const tipoTexto = document.querySelector(`#filtroTipo option[value="${tipo}"]`)?.textContent || tipo;
    mensagem += ` de "${tipoTexto}"`;
  }
  
  mensagemEl.textContent = mensagem;
}

// Funções do modal
function abrirModal() {
  const modal = document.getElementById('modalCarrinho');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Previne scroll do body
  }
}

function fecharModal() {
  const modal = document.getElementById('modalCarrinho');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Função para finalizar compra
function finalizarCompra() {
  if (carrinhoNomes.length === 0) {
    mostrarNotificacao('Seu carrinho está vazio!', 'info');
    return;
  }

  const mensagem = carrinhoNomes.map(nome => {
    const p = produtos.find(prod => prod.nome === nome);
    return `${p.nome} - ${p.valor_venda}`;
  }).join('\n');

  const total = carrinhoNomes.reduce((soma, nome) => {
    const prod = produtos.find(p => p.nome === nome);
    return soma + parseFloat(prod.valor_venda.replace(/[^\d,]/g, '').replace(',', '.'));
  }, 0);

  const texto = `Olá! Gostaria de comprar:\n\n${mensagem}\n\nTotal: R$ ${total.toFixed(2).replace('.', ',')}\n\nAguardo retorno. Obrigado!`;

  const url = `https://wa.me/5516994357868?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
  
  // Limpar o carrinho após finalizar compra
  carrinhoNomes = [];
  localStorage.setItem('carrinho', JSON.stringify(carrinhoNomes));
  atualizarCarrinho();
  atualizarContadorCarrinho();
  
  fecharModal();
  mostrarNotificacao('Compra finalizada com sucesso!', 'sucesso');
}

// Função para atualizar contador do carrinho
function atualizarContadorCarrinho() {
  const contador = document.querySelector('.carrinho-contador');
  const botaoCarrinho = document.getElementById('botaoCarrinho');
  
  if (contador) {
    contador.textContent = carrinhoNomes.length;
    contador.setAttribute('data-count', carrinhoNomes.length);
  }
  
  if (botaoCarrinho) {
    botaoCarrinho.setAttribute('data-count', carrinhoNomes.length);
  }
}

// Função para atualizar carrinho
function atualizarCarrinho() {
  const lista = document.getElementById('carrinho');
  const carrinhoVazio = document.getElementById('carrinhoVazio');
  
  if (!lista) return;
  
  lista.innerHTML = '';

  if (carrinhoNomes.length === 0) {
    if (carrinhoVazio) carrinhoVazio.style.display = 'flex';
    lista.style.display = 'none';
  } else {
    if (carrinhoVazio) carrinhoVazio.style.display = 'none';
    lista.style.display = 'block';
    
    carrinhoNomes.forEach((nome, index) => {
      const produto = produtos.find(p => p.nome === nome);
      if (!produto) return;
      
      const li = document.createElement('li');
      
      li.innerHTML = `
        <div class="item-info">
          <img 
            src="img/${produto.foto}" 
            alt="${produto.nome}" 
            class="item-imagem"
            width="60"
            height="60"
          >
          <div class="item-detalhes">
            <h4 class="item-nome">${produto.nome}</h4>
            <p class="item-preco">${produto.valor_venda}</p>
          </div>
        </div>
        <div class="item-acoes">
          <button class="btn-remover" data-index="${index}">Remover</button>
        </div>
      `;
      
      // Tratar erro da imagem do carrinho
      const img = li.querySelector('.item-imagem');
      tratarErroImagem(img);
      
      // Adicionar evento ao botão remover
      const btnRemover = li.querySelector('.btn-remover');
      btnRemover.addEventListener('click', (e) => {
        e.preventDefault();
        removerProduto(index);
      });
      
      lista.appendChild(li);
    });
  }

  // Atualizar total
  const total = carrinhoNomes.reduce((soma, nome) => {
    const prod = produtos.find(p => p.nome === nome);
    if (!prod) return soma;
    const preco = parseFloat(prod.valor_venda.replace(/[^\d,]/g, '').replace(',', '.'));
    return soma + preco;
  }, 0);

  const totalElement = document.getElementById('total');
  if (totalElement) {
    totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }
}

// Função para limpar busca
function limparBusca() {
  const buscaInput = document.getElementById('busca');
  if (buscaInput) {
    buscaInput.value = '';
    filtrarProdutos();
  }
}

// Inicializar ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  exibirProdutos();
  atualizarCarrinho();
  atualizarContadorCarrinho();
  
  // Fechar modal clicando fora
  const modal = document.getElementById('modalCarrinho');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        fecharModal();
      }
    });
  }
});

// Prevenir envio de formulário ao pressionar Enter
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
    e.preventDefault();
  }
});
