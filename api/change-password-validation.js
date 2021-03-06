const lib = require("./common-lib");

module.exports = async (req, res) => {
  // Get a database connection, cached or otherwise,
  // using the connection string environment variable as the argument
  const db = await lib.connectToDatabase(process.env.MONGODB_URI, res);

  // Select the "users" collection from the database
  const collection = await db.collection("users");

  // Select the users collection from the database
  const user = await collection.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Esse usuário não existe em nossa base de dados.",
      },
    });
    return;
  }
  if (user.changePassword.key !== req.body.key) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Esse código para mudança de senha não é mais válido. Peça um novo e-mail para mudança de senha.",
      },
    });
    return;
  }

  collection.updateOne(
    { email: user.email },
    {
      $set: {
        password: req.body.newPassword,
      },
    },
    (error) => {
      if (error)
        res.status(400).json({
          error: {
            code: 400,
            message: error,
          },
        });
      else {
        res.status(200).json(true);
      }
    }
  );
};
