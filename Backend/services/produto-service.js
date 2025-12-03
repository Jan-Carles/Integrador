const produtoRepository = require("../repositories/produto-repository");

// Função para retornar todos os produtos
const retornaTodosProdutos = async (req, res) => {
    try {
        const produtos = await produtoRepository.obterTodosProdutos();
        res.status(200).json(produtos);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.sendStatus(500);
    }
};

// Função para criar um novo produto 
const criaProduto = async (req, res) => {
    const { nome_produto, preco_unitario } = req.body;
    try {
        // Validação básica do corpo da requisição
        if (!nome_produto || preco_unitario === undefined || preco_unitario <= 0) {
            return res.status(400).json({ message: "Nome e preço válido são obrigatórios." });
        }
        
        const novoProduto = await produtoRepository.criarProduto({ nome_produto, preco_unitario });
        res.status(201).json(novoProduto); 
    } catch (error) {
        console.error("Erro ao criar produto:", error.message);
        res.status(500).json({ message: "Erro interno ao criar produto." });
    }
};

// Função para buscar produto por ID
const retornaProdutoPorId = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const produto = await produtoRepository.obterProdutoPorId(id);
        if (produto) {
            res.status(200).json(produto);
        } else {
            res.status(404).json({ message: "Produto não encontrado." });
        }
    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        res.sendStatus(500);
    }
};

// Função para atualizar um produto
const atualizaProduto = async (req, res) => {
    const id_produto = parseInt(req.params.id);
    const { nome_produto, preco_unitario } = req.body;
    
    try {
        const produtoAtualizado = await produtoRepository.atualizarProduto({
            id_produto,
            nome_produto,
            preco_unitario,
        });

        if (produtoAtualizado) {
            res.status(200).json(produtoAtualizado);
        } else {
            res.status(404).json({ message: "Produto não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao atualizar produto:", error.message);
        res.status(500).json({ message: "Erro interno ao atualizar produto." });
    }
};

// Função para deletar um produto
const deletaProduto = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const produtoRemovido = await produtoRepository.deletarProduto(id);

        if (produtoRemovido) {
            res.status(200).json({
                message: "Produto removido com sucesso.",
                produto: produtoRemovido,
            });
        } else {
            res.status(404).json({ message: "Produto não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        res.status(500).json({ message: "Erro interno ao deletar produto" });
    }
};

module.exports = {
    retornaTodosProdutos,
    criaProduto,
    retornaProdutoPorId,
    atualizaProduto,
    deletaProduto,
};