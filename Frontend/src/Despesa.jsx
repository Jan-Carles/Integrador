import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

function Despesa() {
  const [despesas, setDespesas] = useState([]);
  const [tipo, setTipo] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");

  const buscarDespesas = async () => {
    try {
      const response = await axios.get("http://localhost:3002/despesas");
      setDespesas(response.data);
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
    }
  };

  useEffect(() => {
    buscarDespesas();
  }, []);

  const adicionarDespesa = async () => {
    try {
      if (!tipo || !data || !valor) {
        alert("Preencha todos os campos.");
        return;
      }

      await axios.post("http://localhost:3002/despesas", {
        tipo_despesa: tipo,
        data_despesa: data,
        valor: parseFloat(valor),
        descricao: tipo,
      });

      setTipo("");
      setData("");
      setValor("");
      buscarDespesas();
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      alert("Erro ao adicionar despesa.");
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "40px" }}>
      <Paper elevation={3} style={{ padding: "30px" }}>
        <Typography variant="h5" gutterBottom>
          Despesas
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Categoria"
              fullWidth
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <MenuItem value="Ingredientes">Ingredientes</MenuItem>
              <MenuItem value="Energia">Energia</MenuItem>
              <MenuItem value="Alimentação">Alimentação</MenuItem>
              <MenuItem value="Material">Material</MenuItem>
              <MenuItem value="Fixo">Outros</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Data"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Valor (R$)"
              type="number"
              fullWidth
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={adicionarDespesa}>
              + Adicionar nova despesa
            </Button>
          </Grid>
        </Grid>

        <Typography variant="h6" style={{ marginTop: "30px" }}>
          Recentes
        </Typography>

        {despesas.length === 0 ? (
          <Typography>Nenhuma despesa registrada.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Categoria</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {despesas.map((despesa) => (
                <TableRow key={despesa.id_despesa}>
                  <TableCell>{despesa.tipo_despesa}</TableCell>
                  <TableCell>{new Date(despesa.data_despesa).toLocaleDateString()}</TableCell>
                  <TableCell>R$ {parseFloat(despesa.valor).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
}

export default Despesa;
