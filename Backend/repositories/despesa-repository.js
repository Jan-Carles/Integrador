const model = require("../models");

// Função para obter todas as despesas
const obterTodasDespesas = async () => {
    return await model.Despesa.findAll({
        order: [['data_despesa', 'DESC']] // Ordena pela data mais recente
    });
};

// Função para obter despesa por ID
const obterDespesaPorId = async (idDespesa) => {
    return await model.Despesa.findByPk(idDespesa);
};

// Função para criar uma nova despesa
const criarDespesa = async (despesa) => {
    const novaDespesa = await model.Despesa.create(despesa);
    return novaDespesa;
};

// Função para atualizar uma despesa
const atualizarDespesa = async (despesa) => {
    try {
        const [numRowsUpdated] = await model.Despesa.update(despesa, { 
            where: { id_despesa: despesa.id_despesa } 
        });

        if (numRowsUpdated === 0) {
            return null; // Nenhuma despesa encontrada/atualizada
        }

        // Retorna a despesa atualizada
        return await model.Despesa.findByPk(despesa.id_despesa);
    } catch (error) {
        throw error;
    }
};

// Função para deletar uma despesa
const deletarDespesa = async (idDespesa) => {
    try {
        const despesaRemovida = await model.Despesa.findByPk(idDespesa);
        if (!despesaRemovida) return null;

        await model.Despesa.destroy({ where: { id_despesa: idDespesa } });
        return despesaRemovida;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodasDespesas,
    obterDespesaPorId,
    criarDespesa,
    atualizarDespesa,
    deletarDespesa,
};