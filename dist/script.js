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
const historico = []; //onde vai guardar cada URL que sera acessada
const pilhaVoltar = new Pilha(); //essa e a pilha para controlar o botao de voltar , guarda as paginas anteriores
const pilhaAvancar = new Pilha(); // pilha que controla o avancar
const favoritos = []; //cria a lista dos favoritos
//FUNCAO NORMALIZAR A URL
function normalizarUrl(url) {
    let urlTratada = url.trim(); //remove os espacos
    if (urlTratada === "") { //verifica e devolve se estiver vazio
        return "";
    }
    if (!urlTratada.startsWith("http://") && !urlTratada.startsWith("https://")) { //se estiver sem https corretamente, ele corrige e roda no iframe
        urlTratada = "https://" + urlTratada;
    }
    return urlTratada;
}
// FUNCAO NAVEGAR PARA
function navegarPara(url) {
    const urlTratada = normalizarUrl(url); // se digitou faltando http, ele transforma
    if (urlTratada === "") {
        alert("Digite uma URL valida."); //verifica se esta vazia e cria o alerta
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
        const textoUrl = document.createElement("span"); //apos criar o elemento do historico, ele cria o botao para excluir
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
    historico.splice(indice, 1); //REMOVE UM ITEM DO HISTORICO COMECANDO NA POSICAO ENCONTRADA
    salvarDados();
    atualizarHistorico();
}
//FUNCAO DE VOLTAR A PAGINA
function voltarPagina() {
    if (pilhaVoltar.estaVazia()) { //a pilha esta vazia?
        alert("Nao ha pagina anterior."); //alerta
        return;
    }
    pilhaAvancar.empilhar(paginaAtual);
    const paginaAnterior = pilhaVoltar.desempilhar(); //tira a ultima pagina da pilha
    if (paginaAnterior === undefined) { //verificacao
        return;
    }
    paginaAtual = paginaAnterior; //pagina atual passara a ser a anterior
    iframeNavegador.src = paginaAtual; //iframe carrega anterior
    inputUrl.value = paginaAtual; //atualiza o URL
    historico.push(paginaAtual); // adc no historico
    atualizarHistorico();
}
//FUNCAO AVANCAR PAGINA
function avancarPagina() {
    if (pilhaAvancar.estaVazia()) {
        alert("Nao ha pagina para avancar.");
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
//FUNCAO ATUALIZAR FAVORITOS + BOTAO excluir
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
//FUNCAO EXLCUIR FAVORITOS
function removerFavorito(url) {
    const indice = favoritos.indexOf(url);
    if (indice === -1) {
        return;
    }
    favoritos.splice(indice, 1);
    salvarDados();
    atualizarFavoritos();
}
// FUNCAO FAVORITAR PAGINA
function favoritarPagina() {
    if (favoritos.includes(paginaAtual)) {
        alert("Essa pagina ja esta nos favoritos");
        return;
    }
    favoritos.push(paginaAtual);
    salvarDados();
    atualizarFavoritos();
}
//FUNCAO SALVAR DADOS
function salvarDados() {
    localStorage.setItem("historico", JSON.stringify(historico)); //salva a info no navegador e transf. o array em texto
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}
// FUNCAO CARREGAR DADOS
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
// BOTAO IR
btnIr.addEventListener("click", function () {
    navegarPara(inputUrl.value); //pega o dado input e manda para a funcao
});
// BOTAO VOLTAR
btnVoltar.addEventListener("click", function () {
    voltarPagina(); //verifica a pilha e pega a pagina anterior e carrega no iframe
});
// BOTAO FAVORITAR
bntFavoritar.addEventListener("click", function () {
    favoritarPagina();
});
//BOTAO AVANCAR
btnAvancar.addEventListener("click", function () {
    avancarPagina();
});
carregarDados();
