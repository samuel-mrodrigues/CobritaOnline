//Esse arquivo trata dos eventos de listener existentes na pagina

/**
 * Array contendo funções que serão chamadas quando o usuario pressiona alguma tecla
 * @type {[{id: Number, funcao: Function}]}
 */
let listenersTeclaPressionada = []

let idUnico = 0

/**
 * Executa o callback passando o evento do teclado que foi acionado
 * @callback keyboardEvento
 * @param {KeyboardEvent} eventoDados
 */

/**
 * Cadastra um callback para ser executado quando o usuario pressiona uma tecla
 * @param {keyboardEvento} callback
 * @return {Number} ID do listener criado
 */
function onTeclaPressionada(callback) {
    let novoListener = {
        id: idUnico,
        funcao: callback
    }

    listenersTeclaPressionada.push(novoListener)
    console.log(`Registrando novo listener(ID ${novoListener.id}) de tecla pressionada`);
    idUnico++
    return novoListener.id
}

/**
 * Exclui um listener cadastrado a partir do ID
 * @param {Number} id 
 */
function excluirListener(id) {

}

/**
 * Realiza o cadastro inicial dos listeners para saber quando eles são disparados
 */
function cadastrarListeners() {
    console.log(`Cadastrando listeners da pagina...`);
    document.onkeydown = (eventoTeclado) => {
        for (const listener of listenersTeclaPressionada) {
            listener.funcao(eventoTeclado)
        }
    }
}

export { cadastrarListeners, onTeclaPressionada }