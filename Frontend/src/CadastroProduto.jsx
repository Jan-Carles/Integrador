import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

function CadastroProduto() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [editando, setEditando] = useState(null);

  const buscarProdutos = async () => {
    try {
      const response = await axios.get("http://localhost:3002/produtos");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const salvarProduto = async () => {
    try {
      if (!nome || !preco) {
        alert("Preencha todos os campos.");
        return;
      }

      if (editando) {
        // Atualizar produto
        await axios.put(`http://localhost:3002/produtos/${editando}`, {
          nome_produto: nome,
          preco_unitario: parseFloat(preco),
        });
        setEditando(null);
      } else {
        // Criar novo produto
        await axios.post("http://localhost:3002/produtos", {
          nome_produto: nome,
          preco_unitario: parseFloat(preco),
        });
      }

      setNome("");
      setPreco("");
      buscarProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto.");
    }
  };

  const editarProduto = (produto) => {
    setNome(produto.nome_produto);
    setPreco(produto.preco_unitario);
    setEditando(produto.id_produto);
  };

  const cancelarEdicao = () => {
    setNome("");
    setPreco("");
    setEditando(null);
  };

  const deletarProduto = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/produtos/${id}`);
      buscarProdutos();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto.");
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "40px" }}>
      <Paper elevation={3} style={{ padding: "30px" }}>
        <Typography variant="h5" gutterBottom>
          Cadastro de Produtos
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nome do Produto"
              fullWidth
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Preço Unitário (R$)"
              type="number"
              fullWidth
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={salvarProduto}
              style={{ marginRight: "10px" }}
            >
              {editando ? "Atualizar Produto" : "+ Adicionar Produto"}
            </Button>

            {editando && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={cancelarEdicao}
              >
                Cancelar
              </Button>
            )}
          </Grid>
        </Grid>

        <Typography variant="h6" style={{ marginTop: "30px" }}>
          Produtos Cadastrados
        </Typography>

        {produtos.length === 0 ? (
          <Typography>Nenhum produto cadastrado.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Preço Unitário</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {produtos.map((produto) => (
                <TableRow key={produto.id_produto}>
                  <TableCell>{produto.nome_produto}</TableCell>
                  <TableCell>
                    R$ {parseFloat(produto.preco_unitario).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => editarProduto(produto)}
                      style={{ marginRight: "10px" }}
                    >
                      Atualizar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => deletarProduto(produto.id_produto)}
                    >
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
}

export default CadastroProduto;
