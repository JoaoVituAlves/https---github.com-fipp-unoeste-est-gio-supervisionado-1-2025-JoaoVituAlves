import ImagemProdutoEntity from "../entities/imagemProdutoEntity.js";
import BaseRepository from "./baseRepository.js";


export default class ImagemProdutoRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async obter(id) {

        const sql = "select * from tb_imagemproduto where id_produto = ?";
        const valores = [id];

        const rows = await this.db.ExecutaComando(sql, valores);

        return this.toMap(rows);
    }

    toMap(rows) {

        let lista = [];
        for(const row of rows) {
            const obj = new ImagemProdutoEntity();
            obj.id = row["id"];
            
            if(row["imagem_blob"] != null) {
                obj.tipo = "jpeg";
                obj.blob = row["imagem_blob"].toString("base64");
            }
                

            lista.push(obj);
        }


        return lista;
    }

}