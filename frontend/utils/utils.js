/**
 ** Cria um elemento HTML 
 * @param {keyof HTMLElementTagNameMap} tipo_elemento Tipo do elemento
 * @param {{id: String, classes: [String]}} props_elemento Propriedades adicionais para aplicar
 * @returns {HTMLElement} Um elemento HTML
 */
export function criarElemento(tipo_elemento = "div", props_elemento = { id: '', classes: [''] }) {
    let novoElemento = document.createElement(tipo_elemento);

    if (props_elemento.id != undefined && props_elemento.id != '') novoElemento.setAttribute("id", props_elemento.id);
    if (props_elemento.classes != undefined && props_elemento.classes.length != 0) props_elemento.classes.forEach(classe_nome => novoElemento.classList.add(classe_nome));

    return novoElemento;
}

/**
 * Constantes para serem utilizadas em varias partes do jogo
 */
export const CONSTANTES = {
    MOVIMENTO: {
        CIMA: 'CIMA',
        DIREITA: 'DIREITA',
        BAIXO: 'BAIXO',
        ESQUERDA: 'ESQUERDA'
    },
    JOGO: {
        VELOCIDADE_INICIAL: 0.2
    }
}