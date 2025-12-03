const express = require("express");
const cors = require("cors");
const session = require("express-session"); 
const passport = require("passport");

// Routers
const produtoRouter = require("./controllers/produto-controller");
const despesaRouter = require("./controllers/despesa-controller");
const vendaRouter = require("./controllers/venda-controller");
const usuarioRouter = require("./controllers/usuario-controller");
const usuarioPermissaoRouter = require("./controllers/usuario_permissao-controller");
const authRouter = require("./controllers/auth-controller");
const permissaoRouter = require("./controllers/permissao-controller");

// Services
const authService = require("./services/auth-service");

// Inicializa o app
const app = express();
app.use(cors());
app.use(express.json());


app.use(
  session({
    secret: "alguma_frase_muito_doida_pra_servir_de_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar estratégias do Passport
authService.configureLocalStrategy();
authService.configureJwtStrategy();
authService.configureSerialization();

// Rotas
app.use("/", authRouter);              // Autenticação (login, logout, novoUsuario)
app.use("/produtos", produtoRouter);       // Produtos
app.use("/despesas", despesaRouter);       // Despesas
app.use("/vendas", vendaRouter);           // Vendas
app.use("/usuarios", usuarioRouter);       // Usuários
app.use("/usuario-permissoes", usuarioPermissaoRouter); // Permissões de usuários
app.use("/permissoes", permissaoRouter);   // Permissões

// Porta
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}.`);
});
