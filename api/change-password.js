const lib = require("./common-lib");

module.exports = async (req, res) => {
  if (!req.body.email) {
    res
      .status(404)
      .json({ message: "Não foi possível identificar o usuário." });
    return;
  }

  if (!req.body.key) {
    res.status(404).json({
      message: "Não foi possível identificar a chave para mudança de senha.",
    });
    return;
  }

  if (!req.body.newPassword) {
    res.status(400).json({ message: "A senha é um campo obrigatório." });
    return;
  }

  if (!req.body.newPasswordAgain) {
    res.status(400).json({ message: "É preciso preencher a senha novamente." });
    return;
  }

  if (req.body.newPassword !== req.body.newPasswordAgain) {
    res.status(400).json({ message: "As senhas precisam ser iguais." });
    return;
  }

  const db = await lib.connectToDatabase(process.env.MONGODB_URI);
  const collection = await db.collection("users");

  const user = await collection.findOne({ email: req.body.email });
  if (!user) {
    res
      .status(404)
      .json({ message: "Esse usuário não existe na nossa base de dados." });
    return;
  }

  if (user.changePassword.key !== req.body.key) {
    res.status(400).json({
      message: "Esse código para mudança de senha não é mais válido.",
    });
    return;
  }

  // Update password
  collection.update(
    { user: user.user },
    {
      $set: {
        password: req.body.newPassword,
        changePassword: {
          key: "",
        },
      },
    }
  );

  // Respond with a JSON string of all users in the collection
  res.status(200).json({
    success: {
      code: 200,
      message: "Senha atualizada com sucesso.",
    },
  });
};
