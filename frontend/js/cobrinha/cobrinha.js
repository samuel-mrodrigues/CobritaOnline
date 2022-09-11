import { criarElemento, CONSTANTES } from "../../utils/utils.js"
import { onTeclaPressionada } from "../listeners/listeners.js";

/**
 * Representa uma Cobrinha
 */
export default class Cobra {

    /**
     * Elemento HTML do jogador, onde a cobra ficara dentro dele
     * @type {HTMLElement}
     */
    elementoJogadorHTML;

    /**
     * Elemento HTML da cobra que estara no HTML
     * @type {HTMLElement}
     */
    elementoCobraHTML;

    /**
     * Estado da movimentação da cobrinha
     */
    movimentoEstado = {
        /**
         * Direção atual contem qual foi a ultima direção que ela se moveu
         * @type {CONSTANTES.MOVIMENTO}
         */
        direcaoAtual: null,
        /**
         * Direção antiga contem a direção anterior da atual
         * @type {CONSTANTES.MOVIMENTO}
         */
        direcaoAntiga: null,
        /**
         * Direção proxima contem a proxima direção que a cobrinha irá se mexer
         * @type {CONSTANTES.MOVIMENTO}
         */
        direcaoProxima: null,
        /**
         * Posição X relativo ao elemento HTML da arena
         * @type {Number}
         */
        x: 0,
        /**
         * Posição Y relativo ao elemento HTML da arena
         * @type {Number}
         */
        y: 0
    }

    /**
     * Total de pontos("comida") que a cobrinha já deovorou
     * @type {Number}
     */
    pontosComida = 0

    /**
     * Contem todas as caudas dessa cobrinha
     * @type {[{elemento: HTMLElement, posicao: {x: Number, y: Number, movimentoUltimo: String, movimentoAtual: String}}]}
     */
    rabosElementos = []

    /**
     * Inicia um novo objeto cobrinha vinculado ao elemento HTML
     * @param {HTMLElement} elementoJogador
     */
    constructor(elementoJogador) {
        this.elementoJogadorHTML = elementoJogador

        let elemento = criarElemento("div", { id: 'cobrinha' });
        this.elementoCobraHTML = elemento;
        this.elementoJogadorHTML.appendChild(elemento)

        this.#cadastrarEventos();
    }

    /**
     ** Realiza as preparações iniciais
     */
    #cadastrarEventos() {
        this.#cadastraListenersMovimento();
    }

    /**
     ** Cadastra os botões para mover a cobrinha
     */
    #cadastraListenersMovimento() {
        let funcaoCallback = (ev) => {
            let keyPressionada = ev.key.toLowerCase();

            let movimentoAcionado;
            switch (keyPressionada) {
                case 'W':
                    movimentoAcionado = CONSTANTES.MOVIMENTO.CIMA;
                    break;
                case 'arrowup':
                    movimentoAcionado = CONSTANTES.MOVIMENTO.CIMA;
                    break;
                case 'd':
                    movimentoAcionado = CONSTANTES.MOVIMENTO.DIREITA;
                    break;
                case 'arrowright':
                    movimentoAcionado = CONSTANTES.MOVIMENTO.DIREITA;
                    break;
                case 's':
                    movimentoAcionado = CONSTANTES.MOVIMENTO.BAIXO;
                    break;
                case 'arrowdown':
                    movimentoAcionado = CONSTANTES.MOVIMENTO.BAIXO;
                    break;
                case 'a':
                    movimentoAcionado = CONSTANTES.MOVIMENTO.ESQUERDA;
                    break;
                case 'arrowleft':
                    movimentoAcionado = CONSTANTES.MOVIMENTO.ESQUERDA;
                    break;
                default:
                    movimentoAcionado = CONSTANTES.MOVIMENTO.CIMA;
                    break;
            }

            // Se o novo movimento for a mesma eu ignoro
            if (this.movimentoEstado.direcaoProxima == movimentoAcionado) return

            this.log(`Se movendo para a direção ${movimentoAcionado}`);
            this.movimentoEstado.direcaoProxima = movimentoAcionado;
        }

        onTeclaPressionada(funcaoCallback)
    }

    /**
     ** Move a cobrinha em sua proxima direção
     */
    moverCobrinha() {
        let novoX = this.movimentoEstado.x;
        let novoY = this.movimentoEstado.y;

        console.log(`Movendo cobrinha para ${this.movimentoEstado.direcaoProxima}`);
        switch (this.movimentoEstado.direcaoProxima) {
            case CONSTANTES.MOVIMENTO.CIMA:
                novoY = novoY - this.elementoCobraHTML.getClientRects()[0].height
                break;
            case CONSTANTES.MOVIMENTO.DIREITA:
                novoX = novoX + this.elementoCobraHTML.getClientRects()[0].width
                break;
            case CONSTANTES.MOVIMENTO.BAIXO:
                novoY = novoY + this.elementoCobraHTML.getClientRects()[0].height
                break;
            case CONSTANTES.MOVIMENTO.ESQUERDA:
                novoX = novoX - this.elementoCobraHTML.getClientRects()[0].width
                break;
            default:
                break;
        }

        // Atualiza somente as novas coordenadas
        if (this.movimentoEstado.x != novoX) this.movimentoEstado.x = novoX
        if (this.movimentoEstado.y != novoY) this.movimentoEstado.y = novoY

        // Move o elemento HTML no template
        this.elementoCobraHTML.style.transform = `translateX(${novoX}px) translateY(${this.movimentoEstado.y}px)`;

        // Atualiza os movimentos antigos e novos 
        this.movimentoEstado.direcaoAntiga = this.movimentoEstado.direcaoAtual != null ? this.movimentoEstado.direcaoAtual : this.movimentoEstado.direcaoProxima
        this.movimentoEstado.direcaoAtual = this.movimentoEstado.direcaoProxima

        // Move os rabos
        this.moverRabos()
    }

    /**
     ** Move todos os rabos da cobra para sua proxima posição
     */
    moverRabos() {
        if (this.rabosElementos.length == 0) {
            console.log(`Nenhum rabo para mover!`);
            return;
        }

        // Passo por cada que rabo que preciso mover para a proxima direção
        for (let index = 0; index < this.rabosElementos.length; index++) {
            let raboAtual = this.rabosElementos[index];

            let novoMovimento = {
                x: raboAtual.posicao.x,
                y: raboAtual.posicao.y,
                direcaoMover: null
            }

            // Verificar se o rabo atual é o primeiro depois da cabeça da cobra ou um rabo vizinho
            let primeiroRabo = index == 0
            if (primeiroRabo) {
                novoMovimento.direcaoMover = this.movimentoEstado.direcaoAntiga
            } else {
                let raboVizinho = this.rabosElementos[index - 1]

                novoMovimento.direcaoMover = raboVizinho.posicao.movimentoUltimo;
            }

            switch (novoMovimento.direcaoMover) {
                case CONSTANTES.MOVIMENTO.CIMA:
                    novoMovimento.y -= raboAtual.elemento.getClientRects()[0].height;
                    break;
                case CONSTANTES.MOVIMENTO.DIREITA:
                    novoMovimento.x += raboAtual.elemento.getClientRects()[0].width;
                    break;
                case CONSTANTES.MOVIMENTO.BAIXO:
                    novoMovimento.y += raboAtual.elemento.getClientRects()[0].height;
                    break;
                case CONSTANTES.MOVIMENTO.ESQUERDA:
                    novoMovimento.x -= raboAtual.elemento.getClientRects()[0].width;
                    break;
                default:
                    break;
            }

            // Atualiza somente as posições novas
            if (raboAtual.posicao.x != novoMovimento.x) raboAtual.posicao.x = novoMovimento.x;
            if (raboAtual.posicao.y != novoMovimento.y) raboAtual.posicao.y = novoMovimento.y;

            // Atualiza o elemento HTML com as novas posições
            raboAtual.elemento.style.transform = `translateX(${novoMovimento.x}px) translateY(${novoMovimento.y}px)`;

            // Salva os movimentos feitos nesse rabo
            raboAtual.posicao.movimentoUltimo = raboAtual.posicao.movimentoAtual;
            raboAtual.posicao.movimentoAtual = novoMovimento.direcaoMover;
        }

    }

    /**
     * Gera um novo rabo para a cobrinha
     */
    gerarRabo() {
        let elemento_rabo = criarElemento("div", { classes: ['rabo'] })

        this.elementoCobraHTML.insertAdjacentElement("afterend", elemento_rabo)

        // Gero um rabo com a posição atual da cobra
        let posicaoRabo = {
            x: this.movimentoEstado.x,
            y: this.movimentoEstado.y,
            movimentoUltimo: this.movimentoEstado.direcaoAtual,
            movimentoAtual: null
        }

        // Se não for o primeiro rabo, eu pego o rabo vizinho, irei usar ele como posição atual
        if (this.rabosElementos.length != 0) {
            let ultimoRabo = this.rabosElementos[this.rabosElementos.length - 1]

            posicaoRabo.x = ultimoRabo.posicao.x
            posicaoRabo.y = ultimoRabo.posicao.y
            posicaoRabo.movimentoUltimo = ultimoRabo.posicao.movimentoAtual
        }

        switch (posicaoRabo.movimentoUltimo) {
            case CONSTANTES.MOVIMENTO.CIMA:
                posicaoRabo.y += elemento_rabo.getClientRects()[0].height
                break;
            case CONSTANTES.MOVIMENTO.DIREITA:
                posicaoRabo.x -= elemento_rabo.getClientRects()[0].width
                break;
            case CONSTANTES.MOVIMENTO.BAIXO:
                posicaoRabo.y -= elemento_rabo.getClientRects()[0].height
                break;
            case CONSTANTES.MOVIMENTO.ESQUERDA:
                posicaoRabo.x += elemento_rabo.getClientRects()[0].width
                break;
            default:
                break;
        }

        elemento_rabo.style.transform = `translate(${posicaoRabo.x}px, ${posicaoRabo.y}px)`

        // Adiciona o rabo novo a lista de rabos
        this.rabosElementos.push({
            elemento: elemento_rabo,
            posicao: posicaoRabo
        })
    }

    /**
     * Aumenta a pontuação da cobrinha e gera um rabo novo
     */
    comeuComida() {
        this.pontosComida++
        this.gerarRabo()
    }

    /**
     * Mostra alguma mensagem de log
     */
    log(msg = "") {
        console.log(`Cobrinha: ${msg}`);
    }
}