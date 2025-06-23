import ProdutoEntity from "../entities/produtoEntity.js";
import ImagemProdutoEntity from "../entities/imagemProdutoEntity.js";
import ProdutoRepository from "../repositories/produtoRepository.js";

export default class ProdutoController {

    async listar(req, res) {
      try {
        const repo = new ProdutoRepository();
        const lista = await repo.listar();
        if (lista && lista.length > 0) {
          res.status(200).json(lista);
        } else {
          res.status(404).json({ msg: "Nenhum produto cadastrado!" });
        }
      } catch (ex) {
        res.status(500).json({ msg: ex.message });
      }
    }

    async obter(req, res) {
      try {
        const { id } = req.params;
        const repo = new ProdutoRepository();
        const entidade = await repo.obter(id);
        if (entidade) {
          res.status(200).json(entidade);
        } else {
          res.status(404).json({ msg: "Produto não encontrado!" });
        }
      } catch (ex) {
        res.status(500).json({ msg: ex.message });
      }
    }

    async gravar(req, res) {
      try {
        const {
          nome, descricao, id_categoria, marca, preco,
          quantidade, data_validade, id_fornecedor,
          status_web, ativo
        } = req.body;

        if (nome && descricao && id_categoria && marca && preco && quantidade) {
          let imagens = req.files;
          let imagensProduto = [];

          if (imagens) {
            for (let imagem of imagens) {
              let tipo = imagem.mimetype.split("/").pop();
              let entidadeImagem = new ImagemProdutoEntity();
              entidadeImagem.tipo = tipo;
              entidadeImagem.blob = imagem.buffer;
              imagensProduto.push(entidadeImagem);
            }
          }

          const entidade = new ProdutoEntity(
            0,
            nome,
            descricao,
            id_categoria,
            marca,
            preco,
            quantidade,
            data_validade || null,
            id_fornecedor || null,
            imagensProduto, // imagens associadas
            status_web || 1,
            ativo ?? 1
          );

          const repo = new ProdutoRepository();
          const result = await repo.gravar(entidade);

          if (result) {
            res.status(201).json({ msg: "Produto cadastrado com sucesso!" });
          } else {
            throw new Error("Erro ao inserir produto no banco de dados");
          }
        } else {
          res.status(400).json({ msg: "Parâmetros obrigatórios não informados!" });
        }
      } catch (ex) {
        res.status(500).json({ msg: ex.message });
      }
    }

    async alterar(req, res) {
      try {
        const {
          id, nome, descricao, id_categoria, marca, preco,
          quantidade, data_validade, id_fornecedor,
          status_web, ativo
        } = req.body;

        if (id && nome && descricao && id_categoria && marca && preco && quantidade) {
          const repo = new ProdutoRepository();

          if (await repo.obter(id)) {
            let imagens = req.files;
            let imagensProduto = [];

            if (imagens) {
              for (let imagem of imagens) {
                let tipo = imagem.mimetype.split("/").pop();
                let entidadeImagem = new ImagemProdutoEntity();
                entidadeImagem.tipo = tipo;
                entidadeImagem.blob = imagem.buffer;
                imagensProduto.push(entidadeImagem);
              }
            }

            const entidade = new ProdutoEntity(
              id,
              nome,
              descricao,
              id_categoria,
              marca,
              preco,
              quantidade,
              data_validade || null,
              id_fornecedor || null,
              imagensProduto, // novas imagens
              status_web || 1,
              ativo ?? 1
            );

            const result = await repo.alterar(entidade);

            if (result) {
              res.status(200).json({ msg: "Produto alterado com sucesso!" });
            } else {
              throw new Error("Erro ao alterar produto no banco de dados");
            }
          } else {
            res.status(404).json({ msg: "Produto não encontrado para alteração" });
          }
        } else {
          res.status(400).json({ msg: "Informe todos os parâmetros obrigatórios!" });
        }
      } catch (ex) {
        res.status(500).json({ msg: ex.message });
      }
    }

    async deletar(req, res) {
      try {
        const { id } = req.params;
        const repo = new ProdutoRepository();
        if (await repo.obter(id)) {
          const result = await repo.deletar(id);
          if (result) {
            res.status(200).json({ msg: "Produto deletado com sucesso!" });
          } else {
            throw new Error("Erro ao deletar produto no banco de dados");
          }
        } else {
          res.status(404).json({ msg: "Produto não encontrado" });
        }
      } catch (ex) {
        res.status(500).json({ msg: ex.message });
      }
    }

    async visivel(req, res) {
      try {
          let { id } = req.body;
  
          if (!id) {
              return res.status(400).json({ msg: "ID do produto é obrigatório!" });
          }
  
          let repo = new ProdutoRepository();
          let produto = await repo.obter(id);
          if(produto) {
              let linhasAfetadas = await repo.visivel(id);
  
              if (linhasAfetadas > 0) {
                  res.status(200).json({ msg: "Produto visível na vitrine!" });
              } else {
                  res.status(400).json({ msg: "Produto já está visível na vitrine!" });
              }
          }
          else {
              return res.status(404).json({ msg: "Produto não encontrado para ação!" });
          }

      } catch (ex) {
          res.status(500).json({ msg: ex.message });
      }
    } 

    async oculto(req, res) {
      try {
          let { id } = req.body;
  
          if (!id) {
              return res.status(400).json({ msg: "ID do produto é obrigatório!" });
          }
  
          let repo = new ProdutoRepository();
          let produto = await repo.obter(id);
          if(produto) {
              let linhasAfetadas = await repo.oculto(id);
  
              if (linhasAfetadas > 0) {
                  res.status(200).json({ msg: "Produto ocultado na vitrine!" });
              } else {
                  res.status(400).json({ msg: "Produto já está oculto na vitrine!" });
              }
          }
          else {
              return res.status(404).json({ msg: "Produto não encontrado para ação!" });
          }

      } catch (ex) {
          res.status(500).json({ msg: ex.message });
      }
    } 

    async ativar(req, res) {
      try {
          let { id } = req.body;
  
          if (!id) {
              return res.status(400).json({ msg: "ID do produto é obrigatório!" });
          }
  
          let repo = new ProdutoRepository();
          let produto = await repo.obter(id);
          if(produto) {
              let linhasAfetadas = await repo.ativar(id);
  
              if (linhasAfetadas > 0) {
                  res.status(200).json({ msg: "Produto ativado!" });
              } else {
                  res.status(400).json({ msg: "Produto já está ativo!" });
              }
          }
          else {
              return res.status(404).json({ msg: "Produto não encontrado para ação!" });
          }

      } catch (ex) {
          res.status(500).json({ msg: ex.message });
      }
    } 

    async inativar(req, res) {
      try {
          let { id } = req.body;
  
          if (!id) {
              return res.status(400).json({ msg: "ID do produto é obrigatório!" });
          }
  
          let repo = new ProdutoRepository();
          let produto = await repo.obter(id);
          if(produto) {
              let linhasAfetadas = await repo.inativar(id);
  
              if (linhasAfetadas > 0) {
                  res.status(200).json({ msg: "Produto inativado!" });
              } else {
                  res.status(400).json({ msg: "Produto já está inativo!" });
              }
          }
          else {
              return res.status(404).json({ msg: "Produto não encontrado para ação!" });
          }

      } catch (ex) {
          res.status(500).json({ msg: ex.message });
      }
    } 
}