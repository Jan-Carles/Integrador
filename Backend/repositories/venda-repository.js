const model = require("../models");
const { sequelize } = require("../models"); 

// Função para incluir os detalhes dos itens e produtos nas consultas
const includeOptions = {
    include: [{ 
        model: model.ItemVenda, 
        as: 'itens', 
        include: [{ 
            model: model.Produto, 
            as: 'produto', 
            attributes: ['nome_produto', 'preco_unitario'] 
        }]
    }]
};


// Função para obter todas as vendas com detalhes
const obterTodasVendas = async () => {
    return await model.Venda.findAll({
        ...includeOptions,
        order: [['data_venda', 'DESC']]
    });
};

// Função para obter venda por ID
const obterVendaPorId = async (idVenda) => {
    return await model.Venda.findByPk(idVenda, includeOptions);
};


// Função para criar uma Venda e seus Itens em uma transação
const criarVenda = async (dadosVenda) => {
    const t = await sequelize.transaction();
    try {
        // 1. Cria a Venda
        const novaVenda = await model.Venda.create({
            data_venda: dadosVenda.data_venda,
            valor_total: dadosVenda.valor_total,
        }, { transaction: t });

        // 2. Prepara os Itens de Venda
        const itensVenda = dadosVenda.itens.map(item => ({
            ...item,
            id_venda: novaVenda.id_venda,
        }));

        // 3. Cria todos os Itens de Venda
        await model.ItemVenda.bulkCreate(itensVenda, { transaction: t });

        await t.commit();

        // Retorna a venda completa criada
        return obterVendaPorId(novaVenda.id_venda);

    } catch (error) {
        await t.rollback();
        throw error;
    }
};


const atualizarVenda = async (idVenda, novosItens, novoValorTotal) => {
     const t = await sequelize.transaction();
    try {
        const vendaExistente = await model.Venda.findByPk(idVenda, { transaction: t });
        if (!vendaExistente) {
            await t.rollback();
            return null;
        }

        // 1. Atualiza o cabeçalho da Venda
        await vendaExistente.update({ valor_total: novoValorTotal }, { transaction: t });

        // 2. Deleta todos os Itens de Venda antigos
        await model.ItemVenda.destroy({ 
            where: { id_venda: idVenda }, 
            transaction: t 
        });

        // 3. Cria os novos Itens de Venda
        const itensVenda = novosItens.map(item => ({
            ...item,
            id_venda: idVenda,
        }));
        await model.ItemVenda.bulkCreate(itensVenda, { transaction: t });

        await t.commit();
        
        return obterVendaPorId(idVenda);
    } catch (error) {
        await t.rollback();
        throw error;
    }
};


// Função para deletar uma venda
const deletarVenda = async (idVenda) => {
    try {
        const vendaRemovida = await obterVendaPorId(idVenda);
        if (!vendaRemovida) return null;

        //Por causa do ON DELETE CASCADE no DDL, deletar a VENDA já deleta os ITEM_VENDA.
        const linhasDeletadas = await model.Venda.destroy({ where: { id_venda: idVenda } });
        
        return linhasDeletadas > 0 ? vendaRemovida : null;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    obterTodasVendas,
    obterVendaPorId,
    criarVenda,
    atualizarVenda,
    deletarVenda,
};