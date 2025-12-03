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

function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [vendas, setVendas] = useState([]);

  const buscarProdutos = async () => {
    try {
      const response = await axios.get("http://localhost:3002/produtos");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const buscarVendas = async () => {
    try {
      const response = await axios.get("http://localhost:3002/vendas");
      setVendas(response.data);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    }
  };

  useEffect(() => {
    buscarProdutos();
    buscarVendas();
  }, []);

  const handleQuantidadeChange = (id_produto, quantidade) => {
    setQuantidades((prev) => ({
      ...prev,
      [id_produto]: quantidade,
    }));
  };

  const registrarVenda = async () => {
    try {
      const itens = Object.entries(quantidades)
        .filter(([_, qtd]) => qtd > 0)
        .map(([id_produto, qtd]) => ({
          id_produto: parseInt(id_produto),
          quantidade: parseInt(qtd),
        }));

      if (itens.length === 0) {
        alert("Selecione ao menos um produto com quantidade maior que 0.");
        return;
      }

      const response = await axios.post("http://localhost:3002/vendas", {
        itens,
      });

      alert("Venda registrada com sucesso! ID: " + response.data.id_venda);
      setQuantidades({});
      buscarVendas();
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      alert("Erro ao registrar venda.");
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "40px" }}>
      <Paper elevation={3} style={{ padding: "30px" }}>
        <Typography variant="h5" gutterBottom>
          Registrar Venda
        </Typography>

        {produtos.length === 0 ? (
          <Typography>Nenhum produto disponível.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Quantidade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {produtos.map((produto) => (
                <TableRow key={produto.id_produto}>
                  <TableCell>{produto.nome_produto}</TableCell>
                  <TableCell>R$ {produto.preco_unitario}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0 }}
                      value={quantidades[produto.id_produto] || ""}
                      onChange={(e) =>
                        handleQuantidadeChange(
                          produto.id_produto,
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Grid container justifyContent="flex-end" style={{ marginTop: "20px" }}>
          <Button variant="contained" color="primary" onClick={registrarVenda}>
            Registrar Venda
          </Button>
        </Grid>

        <Typography variant="h6" style={{ marginTop: "40px" }}>
          Histórico de Vendas
        </Typography>

        <Typography>
          Total de vendas: {vendas.length}
        </Typography>
        <Typography>
          Valor acumulado: R${" "}
          {vendas.reduce((acc, venda) => acc + parseFloat(venda.valor_total), 0).toFixed(2)}
        </Typography>

        {vendas.length > 0 && (
          <Table style={{ marginTop: "10px" }}>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Valor Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendas.map((venda) => (
                <TableRow key={venda.id_venda}>
                  <TableCell>{new Date(venda.data_venda).toLocaleDateString()}</TableCell>
                  <TableCell>R$ {parseFloat(venda.valor_total).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
}

export default Vendas;
