const lib = require("./common-lib");

module.exports = async (req, res) => {
  if (!req.body.email) {
    res.status(400).json({ message: "O e-mail é um campo obrigatório." });
    return;
  }

  if (!req.body.password) {
    res.status(400).json({ message: "A senha é um campo obrigatório." });
    return;
  }

  const db = await lib.connectToDatabase(process.env.MONGODB_URI);
  const collection = await db.collection("users");

  // Check if the username does not exists in the collection
  const user = await collection.findOne({ email: req.body.email });

  if (user) {
    res
      .status(409)
      .json({ message: "Esse usuário já existe em nossa base de dados." });
    return;
  }

  const confirmKey = lib.crypto.randomBytes(32).toString("hex");

  await collection.insertOne(
    {
      email: req.body.email,
      password: req.body.password,
      changePassword: {
        key: "",
      },
      mailValidation: {
        key: confirmKey,
        validated: false,
      },
    },
    async (error) => {
      if (error) res.status(400).json({ error });
      else {
        // Send e-mail to the user
        try {
          await lib.sgMail.send({
            to: req.body.email,
            from: "marcos.estrela@hotmail.com",
            subject: "Seja bem vindo ao Monitora Sefaz!",
            html: `<p>Olá,</p>
              <p>Você acaba de fazer o registro na plataforma do Monitora Sefaz. Para confirmar o seu e-mail, basta clicar no link abaixo.</p>
              <a href="${req.headers.origin}/validate?key=${confirmKey}&user=${req.body.email}" target="_blank">Confirmar meu e-mail</a>
              <p>Se você não fez esse cadastro, por favor ignore esse e-mail.</p>
              <p>Obrigado,<br>
              Equipe Monitora Sefaz</p>
            `,
          });
        } catch (error) {
          return res
            .status(error.statusCode || 500)
            .json({ error: error.message });
        }

        res.status(200).json({
          message:
            "Usuário cadastrado com sucesso. Um e-mail de confirmação foi enviado para seu endereço de e-mail. Verifique seu e-mail, siga as instruções e confirme sua nova conta.",
          type: "info",
        });
      }
    }
  );
};
