const model = require("../models"); 

// Função para obter todos os produtos
const obterTodosProdutos = async () => {
    return await model.Produto.findAll();
};

// Função para obter produto por ID
const obterProdutoPorId = async (idProduto) => {
    // findByPk usa a chave primária, que definimos como id_produto
    return await model.Produto.findByPk(idProduto);
};

// Função para criar um novo produto
const criarProduto = async (produto) => {
    // Cria o produto no banco
    const novoProduto = await model.Produto.create(produto);
    return novoProduto;
};

// Função para atualizar um produto
const atualizarProduto = async (produto) => {
    try {
        // Atualiza o produto com base no id_produto
        const [numRowsUpdated] = await model.Produto.update(produto, { 
            where: { id_produto: produto.id_produto } 
        });

        if (numRowsUpdated === 0) {
            return null; // Nenhum produto encontrado/atualizado
        }

        // Retorna o produto atualizado
        return await model.Produto.findByPk(produto.id_produto);
    } catch (error) {
        throw error;
    }
};

// Função para deletar um produto
const deletarProduto = async (idProduto) => {
    try {
        // Busca o produto antes de deletar (opcional, mas bom para retornar o objeto removido)
        const produtoRemovido = await model.Produto.findByPk(idProduto);
        if (!produtoRemovido) return null;

        await model.Produto.destroy({ where: { id_produto: idProduto } });
        return produtoRemovido;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodosProdutos,
    obterProdutoPorId,
    criarProduto,
    atualizarProduto,
    deletarProduto,
};