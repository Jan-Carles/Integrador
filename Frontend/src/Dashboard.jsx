import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function DashboardFinanceiro() {
  const [vendas, setVendas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [lucro, setLucro] = useState(0);
  const [filtro, setFiltro] = useState("todos");

  const buscarDados = async () => {
    try {
      const resVendas = await axios.get("http://localhost:3002/vendas");
      const resDespesas = await axios.get("http://localhost:3002/despesas");

      setVendas(resVendas.data);
      setDespesas(resDespesas.data);

      const totalVendas = resVendas.data.reduce(
        (acc, venda) => acc + parseFloat(venda.valor_total),
        0
      );
      const totalDespesas = resDespesas.data.reduce(
        (acc, despesa) => acc + parseFloat(despesa.valor),
        0
      );
      setLucro(totalVendas - totalDespesas);
    } catch (error) {
      console.error("Erro ao buscar dados financeiros:", error);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const agruparPorMes = (lista, campoData, campoValor) => {
    const agrupado = {};
    lista.forEach((item) => {
      const data = new Date(item[campoData]);
      const chave =
        filtro === "ano"
          ? data.getFullYear()
          : filtro === "mes"
          ? `${data.getMonth() + 1}/${data.getFullYear()}`
          : filtro === "dia"
          ? data.toLocaleDateString()
          : data.toLocaleString("pt-BR", { month: "short", year: "2-digit" });

      agrupado[chave] = (agrupado[chave] || 0) + parseFloat(item[campoValor]);
    });
    return agrupado;
  };

  const vendasPorPeriodo = agruparPorMes(vendas, "data_venda", "valor_total");
  const despesasPorPeriodo = agruparPorMes(despesas, "data_despesa", "valor");

  const periodos = Array.from(
    new Set([...Object.keys(vendasPorPeriodo), ...Object.keys(despesasPorPeriodo)])
  );

  const chartData = {
    labels: periodos,
    datasets: [
      {
        label: "Vendas",
        data: periodos.map((p) => vendasPorPeriodo[p] || 0),
        backgroundColor: "rgba(76, 175, 80, 0.7)",
        borderRadius: 6,
      },
      {
        label: "Despesas",
        data: periodos.map((p) => despesasPorPeriodo[p] || 0),
        backgroundColor: "rgba(244, 67, 54, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `R$ ${context.raw.toFixed(2)}`,
        },
      },
    },
  };

  const totalVendas = vendas.reduce((acc, v) => acc + parseFloat(v.valor_total), 0);
  const totalDespesas = despesas.reduce((acc, d) => acc + parseFloat(d.valor), 0);

  return (
    <Container maxWidth="lg" style={{ marginTop: "40px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard Financeiro
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <Card sx={{ backgroundColor: "#e0f7fa" }}>
            <CardContent>
              <Typography variant="subtitle2">Vendas</Typography>
              <Typography variant="h5" color="primary">
                R$ {totalVendas.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card sx={{ backgroundColor: "#ffebee" }}>
            <CardContent>
              <Typography variant="subtitle2">Despesas</Typography>
              <Typography variant="h5" color="error">
                R$ {totalDespesas.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card sx={{ backgroundColor: "#e8f5e9" }}>
            <CardContent>
              <Typography variant="subtitle2">Lucro</Typography>
              <Typography
                variant="h5"
                color={lucro >= 0 ? "success.main" : "error"}
              >
                R$ {lucro.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card sx={{ backgroundColor: "#ede7f6" }}>
            <CardContent>
              <Typography variant="subtitle2">Vendas Realizadas</Typography>
              <Typography variant="h5" color="secondary">
                {vendas.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider style={{ margin: "30px 0" }} />

      <Paper elevation={3} style={{ padding: "20px" }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Vendas e Despesas</Typography>
          <FormControl size="small" style={{ minWidth: 120 }}>
            <InputLabel>Filtro</InputLabel>
            <Select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="dia">Dia</MenuItem>
              <MenuItem value="mes">Mês</MenuItem>
              <MenuItem value="ano">Ano</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Bar data={chartData} options={chartOptions} />
      </Paper>
    </Container>
  );
}

export default DashboardFinanceiro;
