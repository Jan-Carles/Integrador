const vendaRepository = require("../repositories/venda-repository");
const produtoRepository = require("../repositories/produto-repository"); 


const calcularValorTotal = async (itens) => {
    let valorTotalVenda = 0;
    const itensComSubtotal = [];

    for (const item of itens) {
        if (!item.id_produto || item.quantidade <= 0) {
            throw new Error("Cada item deve ter um produto e quantidade positiva.");
        }
        
        const produto = await produtoRepository.obterProdutoPorId(item.id_produto);
        
        if (!produto) {
            throw new Error(`Produto com ID ${item.id_produto} não encontrado.`);
        }

        const precoUnitario = parseFloat(produto.preco_unitario);
        const subtotal = precoUnitario * item.quantidade;
        
        valorTotalVenda += subtotal;
        
        itensComSubtotal.push({
            id_produto: item.id_produto,
            quantidade: item.quantidade,
            subtotal: subtotal.toFixed(2)
        });
    }

    return { 
        valor_total: valorTotalVenda.toFixed(2), 
        itens_formatados: itensComSubtotal 
    };
};



// Função para retornar todas as vendas
const retornaTodasVendas = async (req, res) => {
    try {
        const vendas = await vendaRepository.obterTodasVendas();
        res.status(200).json(vendas);
    } catch (error) {
        console.error("Erro ao buscar vendas:", error);
        res.sendStatus(500);
    }
};

// Função para retornar venda por ID
const retornaVendaPorId = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const venda = await vendaRepository.obterVendaPorId(id);
        if (venda) {
            res.status(200).json(venda);
        } else {
            res.status(404).json({ message: "Venda não encontrada." });
        }
    } catch (error) {
        console.error("Erro ao buscar venda:", error);
        res.sendStatus(500);
    }
};


// Função para criar uma nova venda
const criaVenda = async (req, res) => {
    const { itens, data_venda } = req.body; 

    try {
        if (!itens || itens.length === 0) {
            return res.status(400).json({ message: "É necessário informar pelo menos um item para registrar a venda." });
        }
        
        // 1. Validar e calcular total
        const { valor_total, itens_formatados } = await calcularValorTotal(itens);
        
        // 2. Montar objeto para o Repository
        const dadosVenda = {
            data_venda: data_venda || new Date(),
            valor_total: valor_total,
            itens: itens_formatados
        };

        // 3. Registrar no banco via Repository
        const novaVenda = await vendaRepository.criarVenda(dadosVenda);

        res.status(201).json(novaVenda);

    } catch (error) {
        // Captura erros de validação do Helper e erros do Repository
        console.error("Erro ao criar venda:", error.message);
        const statusCode = error.message.includes("encontrado") || error.message.includes("obrigatório") ? 400 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};



// Função para atualizar uma venda 
const atualizaVenda = async (req, res) => {
    const id_venda = parseInt(req.params.id);
    const { itens, data_venda } = req.body; 

    try {
        if (!itens || itens.length === 0) {
            return res.status(400).json({ message: "É necessário informar pelo menos um item para atualizar a venda." });
        }

        // 1. Validar e recalcular total
        const { valor_total, itens_formatados } = await calcularValorTotal(itens);
        
        // 2. Chama o Repository para atualizar
        const vendaAtualizada = await vendaRepository.atualizarVenda(id_venda, itens_formatados, valor_total);

        if (vendaAtualizada) {
            res.status(200).json(vendaAtualizada);
        } else {
            res.status(404).json({ message: "Venda não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao atualizar venda:", error.message);
        const statusCode = error.message.includes("encontrado") ? 404 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};



// Função para deletar uma venda
const deletaVenda = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const vendaRemovida = await vendaRepository.deletarVenda(id);

        if (vendaRemovida) {
            res.status(200).json({
                message: "Venda e seus itens removidos com sucesso.",
                venda: vendaRemovida,
            });
        } else {
            res.status(404).json({ message: "Venda não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao deletar venda:", error);
        res.status(500).json({ message: "Erro interno ao deletar venda" });
    }
};

module.exports = {
    retornaTodasVendas,
    retornaVendaPorId,
    criaVenda,
    atualizaVenda,
    deletaVenda,
};