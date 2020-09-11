// Import Dependencies
const url = require('url')
const MongoClient = require('mongodb').MongoClient

// Create cached connection variable
let cachedDb = null

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, { useNewUrlParser: true })

  // Select the database through the connection,
  // using the database path of the connection string
  const db = await client.db(url.parse(uri).pathname.substr(1))

  // Cache the database connection and return the connection
  cachedDb = db
  return db
}

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
module.exports = async (req, res) => {
  // Get a database connection, cached or otherwise,
  // using the connection string environment variable as the argument
  // if (!req.body.key) {
  //   res.status(404).json({ message: "Não foi possível identificar o usuário." });
  //   return
  // }

  if (!req.body.newPassword) {
    res.status(400).json({ message: "A senha é um campo obrigatório." });
    return
  }

  if (!req.body.newPasswordAgain) {
    res.status(400).json({ message: "É preciso preencher a senha novamente." });
    return
  }

  if (req.body.newPassword !== req.body.newPasswordAgain) {
    res.status(400).json({ message: "As senhas precisam ser iguais." });
    return
  }

  const db = await connectToDatabase(process.env.MONGODB_URI)

  // Select the "users" collection from the database
  var collection = await db.collection('users')

  // Check if the user exists in the database
  const user = await collection.find({ user: "testando" }).toArray()

  if (!user.length) {
    res.status(400).json({ message: "Usuário não existe na nossa base de dados." })
    return
  }
  
  // Select the "users" collection from the database
  var  collection = await db.collection('users')

  // Update password
  collection.update({ user: user.user },
    {
      $set: {
        password: req.body.newPassword
      }
    })

  // Respond with a JSON string of all users in the collection
  res.status(200).json({ message: "Senha atualizada com sucesso." })
}