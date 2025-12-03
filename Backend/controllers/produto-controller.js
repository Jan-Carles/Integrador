const express = require("express");
const produtoService = require("../services/produto-service");

const produtoRouter = express.Router();

// POST /produtos - Criar novo produto (RF01)
produtoRouter.post("/", produtoService.criaProduto);

// GET /produtos - Retornar todos os produtos
produtoRouter.get("/", produtoService.retornaTodosProdutos);

// GET /produtos/:id - Retornar produto por ID
produtoRouter.get("/:id", produtoService.retornaProdutoPorId);

// PUT /produtos/:id - Atualizar produto
produtoRouter.put("/:id", produtoService.atualizaProduto);

// DELETE /produtos/:id - Deletar produto
produtoRouter.delete("/:id", produtoService.deletaProduto);

module.exports = produtoRouter;