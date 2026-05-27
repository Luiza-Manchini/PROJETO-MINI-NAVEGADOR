"use strict";
// CRIAR CLASSE PILHA
class Pilha {
    constructor() {
        this.itens = []; //ninguem fora da classe pode mexer nesse array, obrigda o codigo a usar metodos certos
    }
    empilhar(item) {
        this.itens.push(item);
    }
    desempilhar() {
        return this.itens.pop();
    }
    estaVazia() {
        return this.itens.length === 0;
    }
    limpar() {
        this.itens = []; //esvazia a pilha
    }
}
//PEGAR ELEMENTOS NO HTML
const inputUrl = document.getElementById("inputUrl");
const btnIr = document.getElementById("btnIr");
const btnVoltar = document.getElementById("btnVoltar");
const btnAvancar = document.getElementById("btnAvancar");
const iframeNavegador = document.getElementById("iframeNavegador");
const listaHistorico = document.getElementById("listaHistorico");
const bntFavoritar = document.getElementById("btnFavoritar");
const listaFavoritos = document.getElementById("listaFavoritos");
//VARIAVEIS PRINCIPAIS
let paginaAtual = "https://www.example.com"; // variavel que guarda a pagina que esta aberta no momento
const historico = []; //onde vai guardar cada URL que será acessada
const pilhaVoltar = new Pilha(); //essa é a pilha para controlar o botão de voltar , guarda as paginas anteriores
const pilhaAvancar = new Pilha(); // pilha que controla o avançar
const favoritos = []; //cria a lista dos favoritos
//FUNÇAO NORMALIZAR A URL
function normalizarUrl(url) {
    let urlTratada = url.trim(); //remove os espaços
    if (urlTratada === "") { //verifica e devolve se estiver vazio
        return "";
    }
    if (!urlTratada.startsWith("http://") && !urlTratada.startsWith("https://")) { //se estiver sem https corretamente, ele corrige e roda no iframe
        urlTratada = "https://" + urlTratada;
    }
    return urlTratada;
}
// FUNÇÃO NAVEGAR PARA
function navegarPara(url) {
    const urlTratada = normalizarUrl(url); // se digitou faltando http, ele transforma
    if (urlTratada === "") {
        alert("Digite uma URL válida."); //verifica se está vazia e cria o alerta
        return;
    }
    pilhaVoltar.empilhar(paginaAtual); //antes de trocar, ele guarda a atual na pilha
    pilhaAvancar.limpar(); // limpa a pilha
    paginaAtual = urlTratada; //atualiza a variavel com a URL atual
    iframeNavegador.src = paginaAtual; //carrega a pagina atual
    historico.push(paginaAtual); //adc a pagina atual no historico
    salvarDados();
    inputUrl.value = paginaAtual; //atualiza o campo de texto com a URL completa
    atualizarHistorico();
}
// ATUALIZA HISTORICO + BOTAO exluir
function atualizarHistorico() {
    listaHistorico.innerHTML = ""; //evita que os itens fiquem duplicados toda vez que atualizar.
    historico.forEach(function (url) {
        const item = document.createElement("li"); //criando li pelo JS
        const textoUrl = document.createElement("span"); //apos criar o elemento do historico, ele cria o botão para excluir
        textoUrl.textContent = url;
        textoUrl.addEventListener("click", function () {
            navegarPara(url);
        });
        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.addEventListener("click", function () {
            removerHistorico(url);
        });
        item.appendChild(textoUrl);
        item.appendChild(botaoExcluir);
        listaHistorico.appendChild(item); //coloca a lista dentro do HTML
    });
}
// REMOVER HISTORICO
function removerHistorico(url) {
    const indice = historico.indexOf(url); // PROCURA DENTRO DO ARRAY
    if (indice === -1) {
        return;
    }
    historico.splice(indice, 1); //REMOVE UM ITEM DO HISTORICO COMEÇANDO NA POSIÇÃO ENCONTRADA
    salvarDados();
    atualizarHistorico();
}
//FUNÇAO DE VOLTAR A PAGINA
function voltarPagina() {
    if (pilhaVoltar.estaVazia()) { //a pilha esta vazia?
        alert("Não há página anterior."); //alerta
        return;
    }
    pilhaAvancar.empilhar(paginaAtual);
    const paginaAnterior = pilhaVoltar.desempilhar(); //tira a ultima pagina da pilha
    if (paginaAnterior === undefined) { //verificação
        return;
    }
    paginaAtual = paginaAnterior; //pagina atual passará a ser a anterior
    iframeNavegador.src = paginaAtual; //iframe carrega anterior
    inputUrl.value = paginaAtual; //atualiza o URL
    historico.push(paginaAtual); // adc no historico
    atualizarHistorico();
}
//FUNÇAO AVANÇAR PAGINA
function avancarPagina() {
    if (pilhaAvancar.estaVazia()) {
        alert("Não há página para avançar.");
        return;
    }
    pilhaVoltar.empilhar(paginaAtual); //guardo a pg atual na pilha de voltar
    const proximaPagina = pilhaAvancar.desempilhar(); //pega a proxima pagina
    if (proximaPagina === undefined) {
        return;
    }
    paginaAtual = proximaPagina; //atualiza e carrega no iframe
    iframeNavegador.src = paginaAtual;
    inputUrl.value = paginaAtual;
    historico.push(paginaAtual);
    atualizarHistorico();
}
//FUNÇAO ATUALIZAR FAVORITOS + BOTAO excluir
function atualizarFavoritos() {
    listaFavoritos.innerHTML = "";
    favoritos.forEach(function (url) {
        const item = document.createElement("li");
        const textoUrl = document.createElement("span");
        textoUrl.textContent = url;
        textoUrl.addEventListener("click", function () {
            navegarPara(url);
        });
        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.addEventListener("click", function () {
            removerFavorito(url);
        });
        item.appendChild(textoUrl);
        item.appendChild(botaoExcluir);
        listaFavoritos.appendChild(item);
    });
}
//FUNÇAO EXLCUIR FAVORITOS
function removerFavorito(url) {
    const indice = favoritos.indexOf(url);
    if (indice === -1) {
        return;
    }
    favoritos.splice(indice, 1);
    salvarDados();
    atualizarFavoritos();
}
// FUNÇAO FAVORITAR PAGINA
function favoritarPagina() {
    if (favoritos.includes(paginaAtual)) {
        alert("Essa página já está nos favoritos");
        return;
    }
    favoritos.push(paginaAtual);
    salvarDados();
    atualizarFavoritos();
}
//FUNÇAO SALVAR DADOS
function salvarDados() {
    localStorage.setItem("historico", JSON.stringify(historico)); //salva a info no navegador e transf. o array em texto
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}
// FUNÇAO CARREGAR DADOS
function carregarDados() {
    const historicoSalvo = localStorage.getItem("historico"); //busca no navegador o historico salvo
    const favoritosSalvos = localStorage.getItem("favoritos");
    if (historicoSalvo !== null) {
        historico.push(...JSON.parse(historicoSalvo)); //transforma o texto salvo de volt em array
    }
    if (favoritosSalvos !== null) {
        favoritos.push(...JSON.parse(favoritosSalvos));
    }
    atualizarHistorico();
    atualizarFavoritos();
}
// BOTÃO IR
btnIr.addEventListener("click", function () {
    navegarPara(inputUrl.value); //pega o dado input e manda para a função
});
// BOTÃO VOLTAR
btnVoltar.addEventListener("click", function () {
    voltarPagina(); //verifica a pilha e pega a pagina anterior e carrega no iframe
});
// BOTÃO FAVORITAR
bntFavoritar.addEventListener("click", function () {
    favoritarPagina();
});
//BOTAO AVANÇAR
btnAvancar.addEventListener("click", function () {
    avancarPagina();
});
carregarDados();
