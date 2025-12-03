const express = require("express");
const vendaService = require("../services/venda-service");

const vendaRouter = express.Router();

// POST /vendas - Registrar nova venda (RF02)
vendaRouter.post("/", vendaService.criaVenda);

// GET /vendas - Retornar todas as vendas (RF06 - Histórico)
vendaRouter.get("/", vendaService.retornaTodasVendas);

// GET /vendas/:id - Retornar venda por ID
vendaRouter.get("/:id", vendaService.retornaVendaPorId);

// PUT /vendas/:id - Atualizar venda
vendaRouter.put("/:id", vendaService.atualizaVenda);

// DELETE /vendas/:id - Deletar venda
vendaRouter.delete("/:id", vendaService.deletaVenda);

module.exports = vendaRouter;