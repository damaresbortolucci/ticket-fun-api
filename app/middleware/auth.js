import bcrypt from "bcryptjs";
import User from "../model/user.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { ObjectId } from "bson";

// REQ -> Request
// RES -> Response
export const signup = (req, res) => {
  // Pegamos os dados do request e criamos o modelo.
  
  const user = new User({
    nome: req.body.nome,
    email: req.body.email,
    role: req.body.role,
    senha: bcrypt.hashSync(req.body.senha),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(201).send({ message: "Criado com sucesso!" });
    return;
  });
};

export const login = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {

    if (!user) {
      res.status(401).send({
        message: "Conta não cadastrada com esse email"
      });
      return;
    }

    let passwordIsValid = bcrypt.compareSync(req.body.senha, user.senha);

    if (!passwordIsValid) {
      res.status(401).send({
        message: "Você não me engana não. Errou.",
      });
    }

    let token = jwt.sign({ id: user.id }, config.SECRET, {
      expiresIn: 86400, // 24 horas em segundos.
    });
    
    res.status(200).send({
      nome: user.nome,
      email: user.email,
      role: user.role,
      accessToken: token
    });
  });
};


export const validaHeader = (req, res, next) => {
  let token = req.get('X-token');

  if (!token) {
    return res.status(403).send({ message: "Sem token no validaheader." });
  }

  // Token.findOne({ acess_token: token }).exec(
  //   (err, token) => {
  //     console.log(token);
  //     if (token && token.acess_token && token.acess_token == token) {
  //       console.log("token invalidado já cadastrado na blacklist!!");
  //       return res.status(401).send({ message: "Você não me engana" });
  //     }

  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Você não me engana validaheader" });
    }

    User.findById({ _id: ObjectId(decoded.id)}).exec((err, user) => {
     
      if (req.url.includes("usuarios") && user.role != 'administrador'){
        return res.status(403).send({ message: "Sem permissão de acesso." });
      }

      if (req.url.includes("produtos") && user.role != 'administrador' && user.role != 'vendedor'){
        return res.status(403).send({ message: "Sem permissão de acesso." });
      }
      
      res.header("x-roles", user.role);
      next();
    });
  });
};


export const valida = (req, res) => {
  let token = req.body.token;

  if (!token) {
    return res.status(403).send({ message: "Sem token para validação." });
  }

  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err) {
      console.log("erro ao validar token");
      return res.status(401).send({ message: "Erro ao validar token" });
    }

    User.findById({ _id: ObjectId(decoded.id)}).exec((err, user) => {
      
      return res.status(200).send({
        user_id: decoded.id,
        role: user.role
      });
    });
  });
};


export const logout = (req, res) => {
  let token = req.body.token;

  const tokenDb = new Token({
    access_token: token
  });

  tokenDb.save((err, token) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ message: "Logout realizado com sucesso!" });
    return;
  });
}