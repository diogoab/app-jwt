require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const http = require('http');
const express = require('express');
const app = express();

const blacklist = [];

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  console.log("Requisição recebida em /");
  res.json({ message: "Tudo ok por aqui!" });
});

app.get('/clientes', verifyJWT, (req, res, next) => {
  console.log("Retornou todos os clientes!");
  res.json([{ id: 1, nome: 'Diogo' }]);
});

function verifyJWT(req, res, next) {
  console.log("Verificando token JWT...");

  var token = req.headers['x-access-token'];
  if (!token) {
    console.log("Token não fornecido.");
    return res.status(401).json({ auth: false, message: 'No token provided.' });
  }

  const index = blacklist.findIndex(item => item === token);
  if (index !== -1) {
    console.log("Token inválido encontrado na blacklist.");
    return res.status(401).end();
  }

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) {
      console.log("Falha ao autenticar o token.");
      return res.status(401).json({ auth: false, message: 'Failed to authenticate token.' });
    }

    // Se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    console.log("Token JWT verificado com sucesso!");
    next();
  });
}

app.post('/login', (req, res, next) => {
  console.log("Tentativa de login...");

  // Esse teste abaixo deve ser feito no seu banco de dados
  if (req.body.user === 'diogo' && req.body.pwd === '123456') {
    // Auth ok
    const userId = 1; // Esse id viria do banco de dados
    const token = jwt.sign({ userId }, process.env.SECRET, {
      expiresIn: 300 // Expires in 5min
    });
    console.log("Login bem-sucedido! Token JWT gerado.");
    return res.json({ auth: true, token: token });
  }

  console.log("Login inválido!");
  res.status(401).json({ message: 'Login inválido!' });
});

app.post('/logout', function (req, res) {
  blacklist.push(req.headers['x-access-token']);
  console.log("Token adicionado à blacklist. Logout realizado.");
  res.json({ auth: false, token: null });
});

const server = http.createServer(app);
server.listen(3000);
console.log("Servidor escutando na porta 3000...");