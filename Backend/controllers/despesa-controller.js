const express = require("express");
const despesaService = require("../services/despesa-service");

const despesaRouter = express.Router();

// POST /despesas - Criar nova despesa (RF03)
despesaRouter.post("/", despesaService.criaDespesa);

// GET /despesas - Retornar todas as despesas
despesaRouter.get("/", despesaService.retornaTodasDespesas);

// GET /despesas/:id - Retornar despesa por ID
despesaRouter.get("/:id", despesaService.retornaDespesaPorId);

// PUT /despesas/:id - Atualizar despesa
despesaRouter.put("/:id", despesaService.atualizaDespesa);

// DELETE /despesas/:id - Deletar despesa
despesaRouter.delete("/:id", despesaService.deletaDespesa);

module.exports = despesaRouter;