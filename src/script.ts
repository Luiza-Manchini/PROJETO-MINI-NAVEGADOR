


// CRIAR CLASSE PILHA

class Pilha<T> { // classe generica, o nosso vai aceitar URL
    private itens: T[] = [];  //ninguem fora da classe pode mexer nesse array, obrigda o codigo a usar metodos certos

    empilhar(item: T): void { //esse metodo adciona um item no topo da pilha, vai guardar a pagina atual antes de ir para a prox
        this.itens.push(item);
    }

    desempilhar(): T | undefined { //esse metodo remove e devolver o ultimo item colocado
        return this.itens.pop();
    }

    estaVazia(): boolean {
        return this.itens.length === 0
    }

    limpar(): void {
        this.itens = [];    //esvazia a pilha
    }
}



//PEGAR ELEMENTOS NO HTML


const inputUrl = document.getElementById("inputUrl") as HTMLInputElement;

const btnIr = document.getElementById("btnIr") as HTMLButtonElement;

const btnVoltar = document.getElementById("btnVoltar") as HTMLButtonElement;

const btnAvancar = document.getElementById("btnAvancar") as HTMLButtonElement;

const iframeNavegador = document.getElementById("iframeNavegador") as HTMLIFrameElement;

const listaHistorico = document.getElementById("listaHistorico") as HTMLUListElement;

const bntFavoritar = document.getElementById("btnFavoritar") as HTMLButtonElement;

const listaFavoritos = document.getElementById("listaFavoritos") as HTMLUListElement;





//VARIAVEIS PRINCIPAIS


let paginaAtual: string = "https://www.example.com"; // variavel que guarda a pagina que esta aberta no momento

const historico: string[] = [];  //onde vai guardar cada URL que será acessada

const pilhaVoltar = new Pilha<string>(); //essa é a pilha para controlar o botão de voltar , guarda as paginas anteriores

const pilhaAvancar = new Pilha<string>();   // pilha que controla o avançar

const favoritos: string [] = []; //cria a lista dos favoritos







//FUNÇAO NORMALIZAR A URL


function normalizarUrl(url:string): string {///recebe e devolver a URL em formato de texto
    let urlTratada: string = url.trim();  //remove os espaços

    if (urlTratada === "") {  //verifica e devolve se estiver vazio
        return "";
    }

    if (!urlTratada.startsWith("http://") && !urlTratada.startsWith("https://")) {  //se estiver sem https corretamente, ele corrige e roda no iframe
        urlTratada = "https://" + urlTratada
    }

    return urlTratada
}

// FUNÇÃO NAVEGAR PARA

function navegarPara(url:string): void {  //recebe url como texto
    const urlTratada: string = normalizarUrl(url); // se digitou faltando http, ele transforma

    if (urlTratada === "") {
        alert("Digite uma URL válida.");   //verifica se está vazia e cria o alerta
        return;
    }

    pilhaVoltar.empilhar(paginaAtual);  //antes de trocar, ele guarda a atual na pilha

    pilhaAvancar.limpar(); // limpa a pilha

    paginaAtual = urlTratada;  //atualiza a variavel com a URL atual

    iframeNavegador.src =paginaAtual;  //carrega a pagina atual

    historico.push(paginaAtual);  //adc a pagina atual no historico

    salvarDados();

    inputUrl.value = paginaAtual;  //atualiza o campo de texto com a URL completa

    atualizarHistorico();

}

// ATUALIZA HISTORICO + BOTAO exluir

function atualizarHistorico(): void {    //atualiza a tela
    listaHistorico.innerHTML = "";     //evita que os itens fiquem duplicados toda vez que atualizar.

    historico.forEach(function(url:string): void {  //para cada o URL no historico, a funçao executa um bloco
        const item = document.createElement("li");   //criando li pelo JS

        const textoUrl = document.createElement("span");    //apos criar o elemento do historico, ele cria o botão para excluir
        textoUrl.textContent = url;

        textoUrl.addEventListener("click", function(): void {   // quando clicar na URL...navega ate a URL
            navegarPara(url);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";

        botaoExcluir.addEventListener("click", function(): void {
            removerHistorico(url);
        });

        item.appendChild(textoUrl);
        item.appendChild(botaoExcluir);

        listaHistorico.appendChild(item);  //coloca a lista dentro do HTML


    });
}

// REMOVER HISTORICO

function removerHistorico(url: string): void {
  const indice: number = historico.indexOf(url);   // PROCURA DENTRO DO ARRAY

  if (indice === -1) {
    return;
  }

  historico.splice(indice, 1);    //REMOVE UM ITEM DO HISTORICO COMEÇANDO NA POSIÇÃO ENCONTRADA

  salvarDados();

  atualizarHistorico();
}


//FUNÇAO DE VOLTAR A PAGINA

function voltarPagina(): void {   //funçao voltar a pagina
  if (pilhaVoltar.estaVazia()) {     //a pilha esta vazia?
    alert("Não há página anterior.");   //alerta
    return;
  }

  pilhaAvancar.empilhar(paginaAtual);

  const paginaAnterior: string | undefined = pilhaVoltar.desempilhar();  //tira a ultima pagina da pilha

  if (paginaAnterior === undefined) {   //verificação
    return;
  }

  paginaAtual = paginaAnterior;   //pagina atual passará a ser a anterior

  iframeNavegador.src = paginaAtual;   //iframe carrega anterior

  inputUrl.value = paginaAtual;   //atualiza o URL

  historico.push(paginaAtual);    // adc no historico

  atualizarHistorico();
}


//FUNÇAO AVANÇAR PAGINA

function avancarPagina(): void {
    if (pilhaAvancar.estaVazia()) {
        alert("Não há página para avançar.");
        return;
    }

    pilhaVoltar.empilhar(paginaAtual);   //guardo a pg atual na pilha de voltar

    const proximaPagina: string | undefined = pilhaAvancar.desempilhar();  //pega a proxima pagina

    if(proximaPagina === undefined){
        return;
    }

    paginaAtual = proximaPagina;    //atualiza e carrega no iframe

    iframeNavegador.src = paginaAtual;

    inputUrl.value = paginaAtual;

    historico.push(paginaAtual);

    atualizarHistorico();
}

//FUNÇAO ATUALIZAR FAVORITOS + BOTAO excluir

function atualizarFavoritos(): void {
  listaFavoritos.innerHTML = "";

  favoritos.forEach(function (url: string): void {
    const item = document.createElement("li");

    const textoUrl = document.createElement("span");
    textoUrl.textContent = url;

    textoUrl.addEventListener ("click", function(): void {
        navegarPara(url);
    });

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";

    botaoExcluir.addEventListener("click", function (): void {
      removerFavorito(url);
    });

    item.appendChild(textoUrl);
    item.appendChild(botaoExcluir);

    listaFavoritos.appendChild(item);
  });
}

//FUNÇAO EXLCUIR FAVORITOS

function removerFavorito(url:string): void {
    const indice:number = favoritos.indexOf(url);

    if (indice === -1) {
        return
    }

    favoritos.splice(indice,1);

    salvarDados();

    atualizarFavoritos();

}

// FUNÇAO FAVORITAR PAGINA

function favoritarPagina(): void {     //pergunt se a pagina atual ja existe nos favoritos, com o metodo inludes
    if(favoritos.includes(paginaAtual)) {
        alert("Essa página já está nos favoritos");
        return;
    }

    favoritos.push(paginaAtual);

    salvarDados();

    atualizarFavoritos();
}

//FUNÇAO SALVAR DADOS

 function salvarDados(): void {
    localStorage.setItem("historico", JSON.stringify(historico));   //salva a info no navegador e transf. o array em texto
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
 }

// FUNÇAO CARREGAR DADOS

function carregarDados(): void {
    const historicoSalvo: string | null = localStorage.getItem("historico");  //busca no navegador o historico salvo
    const favoritosSalvos: string | null = localStorage.getItem("favoritos");

    if (historicoSalvo !==null) {
        historico.push(...JSON.parse(historicoSalvo));   //transforma o texto salvo de volt em array
    }

    if (favoritosSalvos !== null ) {
        favoritos.push(...JSON.parse(favoritosSalvos));
    }

    atualizarHistorico();
    atualizarFavoritos();

}



// BOTÃO IR

btnIr.addEventListener("click", function(): void {    //vai exectar a função quando o botão for clicado
    navegarPara(inputUrl.value);   //pega o dado input e manda para a função
});


// BOTÃO VOLTAR

btnVoltar.addEventListener("click", function (): void {
    voltarPagina();            //verifica a pilha e pega a pagina anterior e carrega no iframe
});

// BOTÃO FAVORITAR

bntFavoritar.addEventListener("click", function(): void {   //pega a pagina atual e salva no array de favoritos
    favoritarPagina();
});


//BOTAO AVANÇAR

btnAvancar.addEventListener("click", function (): void {
  avancarPagina();
});


carregarDados();
