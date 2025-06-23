

export default class ProdutoErro extends Error {

    #insertProduto;
    #insertImages;

    get insertProduto() {
        return this.#insertProduto;
    }
    set insertProduto(value) {
        this.#insertProduto = value;
    }

    get insertImages() {
        return this.#insertImages;
    }
    set insertImages(value) {
        this.#insertImages = value;
    }

    constructor(insertProduto, insertImages, message){
        super(message);
        this.#insertProduto = insertProduto;
        this.#insertImages = insertImages;
    }
}