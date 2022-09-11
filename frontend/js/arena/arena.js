/**
 * A classe Arena representa a arena do jogo onde a cobrinha irá se mover
 */
export default class Arena {

    /**
     * O elemento HTML da arena
     * @type {HTMLElement}
     */
    elementoHTML;

    /**
     * Inicia um objeto arena
     * @param {HTMLElement} elementoHTML 
     */
    constructor(elementoHTML) {
        this.elementoHTML = elementoHTML
    }
}