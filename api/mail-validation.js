const lib = require("./common-lib");

module.exports = async (req, res) => {
  // Get a database connection, cached or otherwise,
  // using the connection string environment variable as the argument
  const db = await lib.connectToDatabase(process.env.MONGODB_URI);

  // Select the "users" collection from the database
  const collection = await db.collection("users");

  // Select the users collection from the database
  const user = await collection.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).json({
      message: "Esse usuário não existe em nossa base de dados.",
    });
    return;
  }

  if (user.mailValidation.key !== req.body.key) {
    res.status(400).json({
      message: "Esse código não é válido para esse usuário.",
    });
    return;
  }

  collection.updateOne(
    { email: req.body.email },
    {
      $set: { "mailValidation.validated": true },
    },
    (error) => {
      if (error) res.status(400).json({ error });
      else {
        res.status(200).json({
          message:
            "Obrigado por validar o seu e-mail. Agora você já pode utilizar o nosso sistema.",
          type: "success",
        });
      }
    }
  );

  // res.status(200).json({ user });
};
