import React from "react";
import axios from "axios";
import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";

export default function Cadastrar() {
  const [username, setUsername] = React.useState("");
  const [passwd, setPasswd] = React.useState("");
  const [nome, setNome] = React.useState("");

  const [openMessage, setOpenMessage] = React.useState(false);
  const [messageText, setMessageText] = React.useState("");
  const [messageSeverity, setMessageSeverity] = React.useState("success");

  async function enviaCadastro(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/novoUsuario", {
        username: username,
        passwd: passwd,
        nome: nome,
      });

      if (response.status >= 200 && response.status < 300) {
        setOpenMessage(true);
        setMessageText("Usuário cadastrado com sucesso!");
        setMessageSeverity("success");
        // limpa os campos
        setUsername("");
        setPasswd("");
        setNome("");
      } else {
        setOpenMessage(true);
        setMessageText("Falha ao cadastrar usuário!");
        setMessageSeverity("error");
      }
    } catch (error) {
      console.error(error);
      setOpenMessage(true);
      setMessageText("Erro na requisição de cadastro!");
      setMessageSeverity("error");
    }
  }

  function cancelaCadastro() {
    setUsername("");
    setPasswd("");
    setNome("");
    setOpenMessage(true);
    setMessageText("Cadastro cancelado!");
    setMessageSeverity("warning");
  }

  function handleCloseMessage(_, reason) {
    if (reason === "clickaway") return;
    setOpenMessage(false);
  }

  return (
    <Box style={{ maxWidth: "300px" }}>
      <Stack spacing={2}>
        <TextField
          required
          id="nome-input"
          label="Nome"
          size="small"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
        />
        <TextField
          required
          id="username-input"
          label="Email"
          size="small"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          required
          id="passwd-input"
          label="Senha"
          type="password"
          size="small"
          value={passwd}
          onChange={(event) => setPasswd(event.target.value)}
        />
        <Stack direction="row" spacing={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={enviaCadastro}
            style={{ maxWidth: "100px", minWidth: "100px" }}
          >
            Enviar
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={cancelaCadastro}
            style={{ maxWidth: "100px", minWidth: "100px" }}
          >
            Cancelar
          </Button>
        </Stack>
        <Snackbar
          open={openMessage}
          autoHideDuration={6000}
          onClose={handleCloseMessage}
        >
          <Alert severity={messageSeverity} onClose={handleCloseMessage}>
            {messageText}
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
}
