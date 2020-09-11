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
  if (!req.body.email){
    res.status(402).json({ message: "Campo de e-mail vazio. Por favor preencha com o seu e-mail." });
    return
  }


  const db = await connectToDatabase(process.env.MONGODB_URI)

  // Select the "users" collection from the database
  const collection = await db.collection('users')

  // Check if the user exists in the database
  const user = await collection.find({ user: "testando" }).toArray()
  if (!user.length) {
    res.status(404).json({ message: "Usuário não existe na nossa base de dados." })
    return
  }

  // Send e-mail to the user
  // TODO: Mail sender

  // Respond with a JSON string of all users in the collection
  res.status(200).json({ message: "E-mail enviado com sucesso."})
}