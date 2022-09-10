console.log('Carregando JS inicial da pagina');

import { cadastrarListeners } from "./listeners/listeners.js";
import Cobrinha from "./cobrinha/cobrinha.js"
import { CONSTANTES, criarElemento } from "../utils/utils.js"

/**
 * Representa a DIV onde a cobra se movimenta
 * @type {HTMLElement}
 */
var jogoArea;

/**
 * Representa DIV onde o elemento da cobra do jogador estara, incluindo a cobra e seus rabos
 * @type {HTMLElement}
 */
var jogadorElemento;

/**
 * Contem informações uteis sobre o estado do jogo
 */
var estadoJogo = {
    loopTaskid: -1,
    velocidadeCobra: CONSTANTES.JOGO.VELOCIDADE_INICIAL
}

/**
 * Representa a cobrinha do jogador
 * @type {Cobrinha}
 */
var jogadorCobrinha = null

/**
 * Lista de comidas existentes na arena
 * @type {[elemento: HTMLElement]}
 */
var comidas = []

/**
 * Executa ações para preparar a pagina para o jogo
 */
function inicio() {

    // Pega algumas referencias importantes
    console.log(`Executando etapas iniciais da pagina`);
    document.getElementById("iniciar_jogo").onclick = (ev) => {
        iniciarJogo();
    };
    document.getElementById("parar_jogo").onclick = (ev) => {
        pararJogo();
    };
    document.getElementById("criar_comida").onclick = (ev) => {
        gerarComida();
    };

    jogoArea = document.getElementById("jogo_area");
    jogadorElemento = document.getElementById("jogador")

    // Realiza o cadastro dos listeners de evento da pagina
    cadastrarListeners()
}

/**
 * Inicia o jogo, liberando a cobrinha para se mexer e fazendo os preparativos iniciais
 */
function iniciarJogo() {
    avisoEstadoJogo(`Iniciando jogo`)

    let cobrinha = new Cobrinha();
    jogadorCobrinha = cobrinha;
    jogadorElemento.append(jogadorCobrinha.elementoHtml);

    // Variavel que mostra quando o proximo movimento da cobrinha estará disponivel
    let proximoMovimentoCobra = 0;
    // Inicia o loop
    estadoJogo.loopTaskid = setInterval(() => {

        // Se ela puder se mover, avança a cobrinha
        if (proximoMovimentoCobra >= estadoJogo.velocidadeCobra) {
            moverCobrinha()
            checarColisaoComida()
            proximoMovimentoCobra = 0
        } else {
            proximoMovimentoCobra += 60 / 1000
        }


    }, 60);
    avisoEstadoJogo(`Task id do loop atual é: ${estadoJogo.loopTaskid}`);

    // Gera uma comida no inicio do game
    gerarComida()
}

/**
 * Verifica se a cobrinha esta passando por alguma comida
 */
function checarColisaoComida() {
    let cobrinha = jogadorCobrinha
    let cobrinhaPosicao = jogadorCobrinha.elementoHtml.getClientRects()[0];

    // Verifica se o jogador passou em cima de alguma comidinha
    for (const comida of comidas) {
        let comidaPosicao = comida.getClientRects()[0]

        if (((cobrinhaPosicao.left + cobrinhaPosicao.width) >= comidaPosicao.left && cobrinhaPosicao.left <= (comidaPosicao.left + comidaPosicao.width)) &&
            ((cobrinhaPosicao.top + cobrinhaPosicao.height) >= comidaPosicao.top && cobrinhaPosicao.top <= (comidaPosicao.top + comidaPosicao.height))
        ) {

            // Remove a comida do jogo
            comidas = comidas.filter(comida_info => comida_info.codigo_unico != comida.codigo_unico)
            comida.remove()

            // Gera outra comida
            gerarComida()

            // Adiciona o ponto pra cobrinha
            cobrinha.comeuComida()
            estadoJogo.velocidadeCobra -= 0.1
        }
    }
}

/**
 * Realiza a função de mover a cobrinha para a direção atual dela
 */
function moverCobrinha() {

    let cobrinha = jogadorCobrinha;
    let arenaPosicao = jogoArea.getClientRects()[0];
    let cobrinhaPosicao = jogadorCobrinha.elementoHtml.getClientRects()[0];

    let direcaoAtual = jogadorCobrinha.movimentoEstado.direcaoProxima
    let podeMover = false;
    switch (direcaoAtual) {
        case CONSTANTES.MOVIMENTO.CIMA:
            if ((cobrinhaPosicao.top - cobrinhaPosicao.height) > arenaPosicao.top) {
                podeMover = true
            }
            break;
        case CONSTANTES.MOVIMENTO.DIREITA:
            if ((cobrinhaPosicao.left + cobrinhaPosicao.width) < arenaPosicao.right) {
                podeMover = true

            };
            break;
        case CONSTANTES.MOVIMENTO.BAIXO:
            if ((cobrinhaPosicao.top + cobrinhaPosicao.height) < arenaPosicao.bottom) {
                podeMover = true

            }
            break;
        case CONSTANTES.MOVIMENTO.ESQUERDA:
            if ((cobrinhaPosicao.left - cobrinhaPosicao.width) > arenaPosicao.left) {
                podeMover = true
            };
            break;
        default:
            break;
    }

    if (podeMover) {
        cobrinha.moverCobrinha()
    } else {
        console.log(`Cobrinha não pode mais mover para direção atual!`);
    }
}

/**
 * Gera uma comida para ser coletada
 */
function gerarComida() {
    console.log(`Gerando uma comida...`);

    let arenaBoundaries = jogoArea.getClientRects()[0]

    let widthRandom = Math.random() * arenaBoundaries.width
    let heigthRandom = Math.random() * arenaBoundaries.height

    let comidaElemento = criarElemento("div", { classes: ['comida'] })
    jogoArea.appendChild(comidaElemento)

    if (widthRandom + comidaElemento.getClientRects()[0].width > arenaBoundaries.width) widthRandom = arenaBoundaries.width - comidaElemento.getClientRects()[0].width
    if (heigthRandom + comidaElemento.getClientRects()[0].height > arenaBoundaries.height) heigthRandom = arenaBoundaries.height - comidaElemento.getClientRects()[0].height

    comidaElemento.style.left = widthRandom + 'px'
    comidaElemento.style.top = heigthRandom + 'px'
    comidaElemento.codigo_unico = `${widthRandom}${heigthRandom}`
    comidas.push(comidaElemento)
}

/**
 * Parar o jogo
 */
function pararJogo() {
    avisoEstadoJogo(`Parando jogo...`)
    clearInterval(estadoJogo.loopTaskid)
    estadoJogo.loopTaskid = -1
}

/**
 * Mensagens para enviar
 */
function avisoEstadoJogo(msg) {
    console.log(`ESTADO DO GAME: ${msg}`);
}

// Inicio das preparações do game
inicio();