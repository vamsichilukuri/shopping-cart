const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Cart = require("../models/cart");
const HomeProducts = require("../models/homeproducts");
const Products = require("../models/products");
const jwt = require("jsonwebtoken");
router.get("/", (req, res) => {
  res.send("From API route");
});

function verifyToken(req, res, next) {
  if (!req.header.authorization) {
    return res.status(401).send("Unauthorized requset");
  }

  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("Unauthorization request");
  }
  let payload = jwt.verify(token, "secretKey");
  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }
  req.userId = payload.subject;
  next();
}

/*
 ***** SIGNUP *****
 */

//new user (signup)
router.post("/signup", (req, res) => {
  let userData = req.body;
  let user = new User(userData);
  user.save((err, newUserData) => {
    if (err) {
      console.log(err);
    } else {
      let payload = { subject: newUserData._id };
      let token = jwt.sign(payload, "secretKey");
      res.status(200).send({ token });
    }
  });
});

/*
 ***** LOGIN *****
 */

//user login
router.post("/login", (req, res) => {
  let userData = req.body;
  User.findOne({ username: userData.username }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (!user) {
        res.status(401).send("Invalid username");
      } else {
        if (user.password !== userData.password) {
          res.status(401).send("Invalid password");
        } else {
          let payload = { subject: user._id };
          let token = jwt.sign(payload, "secretKey");
          res.status(200).send({ token });
        }
      }
    }
  });
});

/*
 ***** CART *****
 */

//GET  get all cart to item
router.get("/cart", async (req, res) => {
  try {
    const items = await Cart.find();
    res.send(items);
  } catch (error) {
    res.send("Error " + error);
  }
});

// DETELE  cart to item
router.delete("/cart/:id", (req, res) => {
  Cart.deleteOne({ id: req.params.id })
    .then((cart) => {
      res.send(cart);
    })
    .catch((error) => console.log(error));
});

//POST add cart to item
router.post("/cart", async (req, res) => {
  const cart = new Cart({
    id: req.body._id,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    qty: req.body.qty,
    total: req.body.total,
  });
  try {
    const c1 = await cart.save();
    res.send(c1);
  } catch (error) {
    res.send("Error " + error);
  }
});

/*
 ***** HOME *****
 */

//HOME products GET
router.get("/home", async (req, res) => {
  try {
    const home = await HomeProducts.find();
    res.send(home);
  } catch (error) {
    res.status(500).send("Error while connecting to the collection " + error);
  }
});

//POST a new Product
router.post("/home", async (req, res) => {
  const home = new HomeProducts({
    id: req.body.id,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    qty: req.body.qty,
  });
  try {
    const h1 = await home.save();
    res.send(h1);
  } catch (error) {
    res.status(500).send("Error while connecting to the collection " + error);
  }
});

//UPDATE Home products
router.put("/home/:id", (req, res) => {
  HomeProducts.updateOne(
    { _id: req.params.id },
    {
      $set: {
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
      },
    }
  )
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((error) => console.error(error));
});

//DELETE Home products
router.delete("/home/:id", (req, res) => {
  HomeProducts.deleteOne({ _id: req.params.id })
    .then((item) => {
      res.send(item);
    })
    .catch((err) => console.log(err));
});

/*
 ***** PRODUCTS *****
 */

// Products GET
router.get("/products", async (req, res) => {
  try {
    const products = await Products.find();
    res.send(products);
  } catch (error) {
    res.status(500).send("Error while connecting to the collection " + error);
  }
});

//Products POST
router.post("/products", async (req, res) => {
  const products = new Products({
    id: req.body.id,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    qty: req.body.qty,
  });

  try {
    const p1 = await products.save();
    res.send(p1);
  } catch (error) {
    res.status(500).send("Error while connecting to the collection " + error);
  }
});

//UPDATE Home products
router.put("/products/:id", (req, res) => {
  Products.updateOne(
    { _id: req.params.id },
    {
      $set: {
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
      },
    }
  )
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((error) => console.error(error));
});

//DELETE Home products
router.delete("/products/:id", (req, res) => {
  Products.deleteOne({ _id: req.params.id })
    .then((item) => {
      res.send(item);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
