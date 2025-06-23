import PedidoEntity from "../entities/pedidoEntity.js";
import PedidoItemEntity from "../entities/pedidoItemEntity.js";
import PedidoRepository from "../repositories/pedidoRepository.js";
import PedidoItemRepository from "../repositories/pedidoItemRepository.js";
import ProdutoRepository from "../repositories/produtoRepository.js";
import PagamentoRepository from "../repositories/pagamentoRepository.js";

export default class PedidoController {

    async listar(req, res) {
        try {
            const repo = new PedidoRepository();
            const pedidos = await repo.listar();

            if (!pedidos || pedidos.length === 0) {
                return res.status(404).json({ msg: "Nenhum pedido cadastrado!" });
            }

            // Adiciona os itens a cada pedido
            for (let pedido of pedidos) {
                const itens = await repo.listarItensPedido(pedido.id);
                pedido.itens = itens; // Adiciona os itens como array dentro do pedido
            }

            res.status(200).json(pedidos);
        } catch (ex) {
            console.error("Erro ao listar pedidos:", ex);
            res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req, res) {
        try {
            const { id } = req.params;
            const repo = new PedidoRepository();
            const pedido = await repo.obter(id);

            if (pedido) {
                res.status(200).json(pedido);
            } else {
                res.status(404).json({ msg: "Pedido não encontrado!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async gravar(req, res) {
        try {
            const { pedido: pedidoBody, itens: itensBody } = req.body;

            if (!pedidoBody || !Array.isArray(itensBody) || itensBody.length === 0) {
                return res.status(400).json({ msg: "Dados do pedido ou itens estão inválidos ou ausentes." });
            }

            const produtoRepo = new ProdutoRepository();
            const itensInvalidos = [];

            // Validação de estoque
            for (const item of itensBody) {
                const estoqueDisponivel = await produtoRepo.validarEstoque(item.id_produto, item.quantidade);
                if (!estoqueDisponivel) {
                    itensInvalidos.push(item.id_produto);
                }
            }

            if (itensInvalidos.length > 0) {
                return res.status(400).json({
                    msg: "Estoque insuficiente para os produtos",
                    produtos: itensInvalidos
                });
            }

            // Criação do pedido
            const pedidoEntity = new PedidoEntity(
                0,
                pedidoBody.id_cliente,
                pedidoBody.data_pedido,
                pedidoBody.status,
                pedidoBody.num_parcelas,
                pedidoBody.taxa_entrega,
                pedidoBody.valor_desconto,
                pedidoBody.valor_total,
                pedidoBody.id_funcionario,
                pedidoBody.opcao,
                pedidoBody.cep,
                pedidoBody.rua,
                pedidoBody.bairro,
                pedidoBody.cidade,
                pedidoBody.numero
            );

            const pedidoRepo = new PedidoRepository();
            const pedidoId = await pedidoRepo.gravar(pedidoEntity);

            if (!pedidoId) {
                throw new Error("Erro ao gravar pedido.");
            }

            const itemRepo = new PedidoItemRepository();

            for (const item of itensBody) {
                const produto = await produtoRepo.obter(item.id_produto);

                // Atualiza estoque
                const novaQuantidade = produto.quantidade - item.quantidade;
                await produtoRepo.atualizarEstoque(item.id_produto, novaQuantidade); 

                // Grava item do pedido
                const itemEntity = new PedidoItemEntity(
                    0,
                    pedidoId,
                    item.id_produto,
                    item.quantidade,
                    produto.preco
                );
                await itemRepo.gravar(itemEntity);
            }

            res.status(201).json({ msg: "Pedido gravado com sucesso!", id: pedidoId });

        } catch (ex) {
            console.error("Erro ao gravar pedido:", ex);
            res.status(500).json({ msg: ex.message });
        }
    }

    // Listar pedidos de um cliente específico
    async listarPorCliente(req, res) {
        try {
            const { id_cliente } = req.params;
            
            if (!id_cliente) {
                return res.status(400).json({ msg: "ID do cliente não informado!" });
            }
            
            const repository = new PedidoRepository();
            const pedidos = await repository.listarPorCliente(id_cliente);
            
            // Enriquecer os dados dos pedidos com informações de pagamento
            const pagamentoRepo = new PagamentoRepository();
            
            for (let pedido of pedidos) {
                const pagamentos = await pagamentoRepo.listarPorPedido(pedido.id);
                pedido.pagamento = pagamentos.length > 0 ? pagamentos[0] : null;
                
                // Adicionar itens do pedido
                const itens = await repository.listarItensPedido(pedido.id);
                pedido.itens = itens;
            }
            
            res.json(pedidos);
        } catch (erro) {
            console.error("Erro ao listar pedidos do cliente:", erro);
            res.status(500).json({ msg: "Erro ao listar pedidos do cliente." });
        }
    }

    // Obter detalhes de um pedido específico
    async detalhesPedido(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "ID do pedido não informado!" });
        }

        const repository = new PedidoRepository();

        // Obter o pedido com os dados do cliente
        const pedido = await repository.obter(id);

        if (!pedido) {
            return res.status(404).json({ msg: "Pedido não encontrado!" });
        }

        // Buscar os itens vinculados a esse pedido
        const itens = await repository.listarItensPedido(id);
        pedido.itens = itens;

        return res.json(pedido);

    } catch (erro) {
        console.error("Erro ao obter detalhes do pedido:", erro);
        return res.status(500).json({ msg: "Erro ao obter detalhes do pedido." });
    }
    }

    // Cancelar um pedido
    async cancelarPedido(req, res) {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({ msg: "ID do pedido não informado!" });
            }
            
            const repository = new PedidoRepository();
            const pedido = await repository.obter(id);
            
            if (!pedido) {
                return res.status(404).json({ msg: "Pedido não encontrado!" });
            }
            
            // Verificar se o pedido pode ser cancelado (status pendente)
            if (pedido.status !== 1) {
                return res.status(400).json({ msg: "Apenas pedidos pendentes podem ser cancelados!" });
            }
            
            // Atualizar status para cancelado (5)
            await repository.atualizarStatus(id, 5);
            
            res.json({ msg: "Pedido cancelado com sucesso!" });
        } catch (erro) {
            console.error("Erro ao cancelar pedido:", erro);
            res.status(500).json({ msg: "Erro ao cancelar pedido." });
        }
    }

    // Atualizar um pedido
    async atualizarPedido(req, res) {
        try {
            const { id } = req.params;
            const { pedido, itens } = req.body;
            
            if (!id) {
                return res.status(400).json({ msg: "ID do pedido não informado!" });
            }
            
            const repository = new PedidoRepository();
            const pedidoExistente = await repository.obter(id);
            
            if (!pedidoExistente) {
                return res.status(404).json({ msg: "Pedido não encontrado!" });
            }
            
            // Verificar se o pedido pode ser editado (status pendente)
            if (pedidoExistente.status !== 1) {
                return res.status(400).json({ msg: "Apenas pedidos pendentes podem ser editados!" });
            }
            
            // Atualizar o pedido
            await repository.atualizar(id, pedido);
            
            // Remover itens antigos
            await repository.removerItensPedido(id);
            
            // Adicionar novos itens
            const produtoRepo = new ProdutoRepository();
            
            for (let item of itens) {
                const produto = await produtoRepo.obter(item.id_produto);
                
                // Grava item do pedido com o preço atual do produto
                await repository.adicionarItemPedido(id, {
                    id_produto: item.id_produto,
                    quantidade: item.quantidade,
                    preco_unitario: produto.preco
                });
            }
            
            res.json({ 
                msg: "Pedido atualizado com sucesso!",
                id
            });
        } catch (erro) {
            console.error("Erro ao atualizar pedido:", erro);
            res.status(500).json({ msg: "Erro ao atualizar pedido." });
        }
    }
}