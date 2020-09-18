const lib = require("./common-lib");

module.exports = async (req, res) => {
  // Get a database connection, cached or otherwise,
  // using the connection string environment variable as the argument
  if (!req.body.email) {
    res.status(402).json({
      message: "Campo de e-mail vazio. Por favor preencha com o seu e-mail.",
    });
    return;
  }

  const db = await lib.connectToDatabase(process.env.MONGODB_URI);

  // Select the "users" collection from the database
  const collection = await db.collection("users");

  // Check if the user exists in the database
  const user = await collection.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json("Esse usuário não existe na nossa base de dados.");
    return;
  }

  const changePasswordKey = lib.crypto.randomBytes(32).toString("hex");
  collection.updateOne(
    { email: req.body.email },
    {
      $set: { "changePassword.key": changePasswordKey },
    },
    (error) => {
      if (error) {
        res.status(400).json({ error });
        return;
      }
    }
  );

  // Send e-mail to the user
  try {
    await lib.sgMail.send({
      to: req.body.email,
      from: "marcos.estrela@hotmail.com",
      subject: "Sua requisição para mudança de senha do Monitora Sefaz",
      html: `<p>Olá,</p>
        <p>Alguém requisitou um link para mudar a sua senha. Você pode fazer isso clicando no link abaixo.</p>
        <a href="${req.headers.origin}/change-password?key=${changePasswordKey}&email=${req.body.email}" target="_blank">Mudar minha senha</a>
        <p>Se você não fez essa requisição, por favor ignore esse e-mail.</p>
        <p>Obrigado,<br>
        Equipe Monitora Sefaz</p>
      `,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  // Respond with a JSON string of all users in the collection
  res.status(200).json({
    message:
      "E-mail enviado com sucesso. Verifique seu e-mail e siga as instruções para trocar a sua senha.",
    type: "info",
  });
};
