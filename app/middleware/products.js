import Product from "../model/product.js";
import { ObjectId } from "bson";



export const addProduto = (req, res) => {
    
    const user = new Product({
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        stock: req.body.stock
    });
    console.log(user);
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(201).send({ message: "Criado com sucesso!" });
      return;
    });
  };



export const listaProdutos = (req, res) => {
    Product.find({}, "_id image title description price quantity stock").exec((err, products) => {
    res.status(200).send(products);
  });
};

export const retornaProduto = (req, res) => {
    Product.findOne({ _id: ObjectId(req.params.id) }, "_id image title description price quantity stock").exec((err, product) => {
    res.status(200).send(product);
  });
};

export const atualizaProduto = (req, res) => {
    Product.findByIdAndUpdate({ _id: ObjectId(req.params.id) }, req.body).exec(
    (err, product) => {
      res.status(200).send(product);
    }
  );
};

export const removeProduto = (req, res) => {
    Product.deleteOne({ _id: ObjectId(req.params.id) }).exec((err, product) => {
    console.log(product);
    res.status(200).send(product);
    
  });
};

export const buscaProductPorNome = (req, res) => {
  Product.find({ title: { $regex: req.query.title } }, "_id image title description price quantity stock").exec(
    (err, products) => {
      res.status(200).send(products);
    }
  );
};

