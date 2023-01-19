import express from "express";
import init from "./database/init.js";
import cors from "cors";
import { signup, login, valida, validaHeader } from "./middleware/auth.js";
import { listUsuarios, retornaUser, atualizaUser, removeUser, buscaUserPorNome,} from "./middleware/users.js";
import mongoose from "mongoose";
import { addProduto, atualizaProduto, buscaProductPorNome, listaProdutos, removeProduto, retornaProduto } from "./middleware/products.js";

mongoose.Promise = global.Promise;

// Inicializando o framework responsável por expor rotas e métodos HTTP.
const app = express();

// Porta da aplicação que vamos utilizar
const PORT = 5000;

// Vamos inicializar o banco!!
init();

const corsOptions = {
  origin: "http://localhost:4200",
};

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Configurando para que a app permita requests do frontend
app.use(cors(corsOptions));

// Aqui estamos falando que vamos aceitar json
app.use(express.json());

// Aqui estamos falando que vamos aceitar o url-encoded
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => console.log("subiuuuu!"));

// Middleware -> (req, res) => faz as manipulações dentro
// É permitido ter uma lista de middleware
app.post("/signup", signup);
app.post("/login", login);
app.post("/valida", valida);

app.get("/usuarios", validaHeader, listUsuarios);
app.get("/usuarios/:id", validaHeader, retornaUser);
app.get("/busca", validaHeader, buscaUserPorNome); //busca por nome

app.put("/usuarios/:id", validaHeader, atualizaUser);

app.delete("/usuarios/:id", validaHeader, removeUser);



// produtos

app.get("/produtos", listaProdutos);
app.get("/produtos/:id", retornaProduto);
app.get("/filtro", validaHeader, buscaProductPorNome); // buscar por nome

app.post("/produto", validaHeader, addProduto);

app.put("/produtos/:id", validaHeader, atualizaProduto);

app.delete("/produtos/:id", validaHeader, removeProduto);
