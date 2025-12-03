const despesaRepository = require("../repositories/despesa-repository");

// Função para retornar todas as despesas
const retornaTodasDespesas = async (req, res) => {
    try {
        const despesas = await despesaRepository.obterTodasDespesas();
        res.status(200).json(despesas);
    } catch (error) {
        console.error("Erro ao buscar despesas:", error);
        res.sendStatus(500);
    }
};

// Função para criar uma nova despesa (RF03)
const criaDespesa = async (req, res) => {
    const { data_despesa, tipo_despesa, descricao, valor } = req.body;
    
    try {
        // Validação básica
        if (!data_despesa || !tipo_despesa || valor === undefined || valor <= 0) {
            return res.status(400).json({ 
                message: "Data, tipo da despesa e valor positivo são obrigatórios." 
            });
        }
        
        const novaDespesa = await despesaRepository.criarDespesa({ 
            data_despesa, 
            tipo_despesa, 
            descricao, 
            valor 
        });

        res.status(201).json(novaDespesa); // 201 Created
    } catch (error) {
        console.error("Erro ao criar despesa:", error.message);
        res.status(500).json({ message: "Erro interno ao criar despesa." });
    }
};

// Função para buscar despesa por ID
const retornaDespesaPorId = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const despesa = await despesaRepository.obterDespesaPorId(id);
        if (despesa) {
            res.status(200).json(despesa);
        } else {
            res.status(404).json({ message: "Despesa não encontrada." });
        }
    } catch (error) {
        console.error("Erro ao buscar despesa:", error);
        res.sendStatus(500);
    }
};

// Função para atualizar uma despesa
const atualizaDespesa = async (req, res) => {
    const id_despesa = parseInt(req.params.id);
    const { data_despesa, tipo_despesa, descricao, valor } = req.body;
    
    try {
        // Objeto com os dados a serem atualizados
        const dadosAtualizados = { 
            id_despesa, 
            data_despesa, 
            tipo_despesa, 
            descricao, 
            valor 
        };

        const despesaAtualizada = await despesaRepository.atualizarDespesa(dadosAtualizados);

        if (despesaAtualizada) {
            res.status(200).json(despesaAtualizada);
        } else {
            res.status(404).json({ message: "Despesa não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao atualizar despesa:", error.message);
        res.status(500).json({ message: "Erro interno ao atualizar despesa." });
    }
};

// Função para deletar uma despesa
const deletaDespesa = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const despesaRemovida = await despesaRepository.deletarDespesa(id);

        if (despesaRemovida) {
            res.status(200).json({
                message: "Despesa removida com sucesso.",
                despesa: despesaRemovida,
            });
        } else {
            res.status(404).json({ message: "Despesa não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao deletar despesa:", error);
        res.status(500).json({ message: "Erro interno ao deletar despesa" });
    }
};

module.exports = {
    retornaTodasDespesas,
    criaDespesa,
    retornaDespesaPorId,
    atualizaDespesa,
    deletaDespesa,
};