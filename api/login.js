const lib = require("./common-lib");
import jwt from "njwt";

module.exports = async (req, res) => {
  // Get a database connection, cached or otherwise,
  // using the connection string environment variable as the argument
  const db = await lib.connectToDatabase(process.env.MONGODB_URI, res);

  if (!db) {
    lib.httpResponse({
      response: res,
      type: "error",
      code: 400,
      message: "Não foi posssível se conectar ao banco de dados",
    });
  }

  if (!req.body.email) {
    lib.httpResponse({
      response: res,
      type: "error",
      code: 400,
      message: "E-mail é um campo obrigatório.",
    });
  }

  if (!req.body.password) {
    lib.httpResponse({
      response: res,
      type: "error",
      code: 400,
      message: "Senha é um campo obrigatório.",
    });
  }

  // Select the "users" collection from the database
  const collection = await db.collection("users");

  const password = lib.crypto
    .createHash("md5")
    .update(req.body.password)
    .digest("hex");

  // Select the users collection from the database
  const user = await collection.findOne({
    email: req.body.email,
    password: password,
  });

  if (!user) {
    lib.httpResponse({
      response: res,
      type: "error",
      code: 400,
      message: "Usuário ou senha não correspondem a um usuário válido.",
    });
  }

  const payload = { email: req.body.email };
  const token = jwt.create(payload, process.env.JWT_PHRASE);
  token.setExpiration(new Date().getTime() + 60 * 1000);

  res.status(200).json({ token: token });
};
