const lib = require("./common-lib");

module.exports = async (req, res) => {
  // Get a database connection, cached or otherwise,
  // using the connection string environment variable as the argument
  const db = await connectToDatabase(process.env.MONGODB_URI);

  if (!req.body.email) {
    res.status(400).json({ message: "E-mail é um campo obrigatório." });
    return;
  }

  if (!req.body.password) {
    res.status(400).json({ message: "Senha é um campo obrigatório." });
    return;
  }

  // Select the "users" collection from the database
  const collection = await db.collection("users");

  // Select the users collection from the database
  const user = await collection.find({
    email: req.body.email,
    password: req.body.password,
  });
  if (user) {
    res.status(400).json({
      message: "Usuário ou senha não correspondem a um usuário válido.",
    });
    return;
  }

  const payload = { userKey: req.body.userKey };
  const token = jwt.create(payload, process.env.JWT_PHRASE);
  token.setExpiration(new Date().getTime() + 60 * 1000);
  res.status(200).json({ token: token });
};
