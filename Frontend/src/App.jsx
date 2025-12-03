import { useState, useEffect } from "react";
import axios from "axios";
import CadastroProduto from "./CadastroProduto";
import Vendas from "./Vendas";
import Despesa from "./Despesa";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Cadastrar from "./Cadastrar";

import {
  AppBar,
  Tabs,
  Tab,
  Toolbar,
  Typography,
  Box,
  Paper,
  Stack,
  Button,
} from "@mui/material";

function App() {
  const [tela, setTela] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [mostrarCadastro, setMostrarCadastro] = useState(false); // ✅ controla login/cadastro

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.username) {
          setUserEmail(payload.username);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogin = (success, username = null) => {
    if (success) {
      if (username) setUserEmail(username);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setUserEmail("");
      localStorage.removeItem("token");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    localStorage.removeItem("token");
  };

  const handleChange = (event, newValue) => {
    setTela(newValue);
  };

  // Se não estiver logado, mostra login OU cadastro
  if (!isLoggedIn) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Stack spacing={4} alignItems="center">
          <Typography variant="h4" component="h1">
            Bem-vindo
          </Typography>

          {!mostrarCadastro ? (
            <>
              <Login handleLogin={handleLogin} />
              <Button
                variant="contained"
                onClick={() => setMostrarCadastro(true)}
              >
                Cadastrar
              </Button>
            </>
          ) : (
            <>
              <Cadastrar />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setMostrarCadastro(false)}
              >
                Voltar ao Login
              </Button>
            </>
          )}
        </Stack>
      </Box>
    );
  }

  // Se estiver logado, mostra o sistema com abas
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sistema Financeiro
          </Typography>
          <Typography sx={{ mr: 2 }}>Usuário: {userEmail}</Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            style={{ width: "120px" }}
          >
            Logout
          </Button>
        </Toolbar>
        <Tabs
          value={tela}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          centered
        >
          <Tab label="Dashboard" value="dashboard" />
          <Tab label="Produtos" value="produto" />
          <Tab label="Vendas" value="vendas" />
          <Tab label="Despesas" value="despesa" />
        </Tabs>
      </AppBar>

      <Paper sx={{ p: 3, mt: 2 }}>
        {tela === "dashboard" && <Dashboard />}
        {tela === "produto" && <CadastroProduto />}
        {tela === "vendas" && <Vendas />}
        {tela === "despesa" && <Despesa />}
      </Paper>
    </Box>
  );
}

export default App;
