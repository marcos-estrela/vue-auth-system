// Import Dependencies
const url = require("url");
const MongoClient = require("mongodb").MongoClient;

// Create cached connection variable
let cachedDb = null;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });

  // Select the database through the connection,
  // using the database path of the connection string
  const db = await client.db(url.parse(uri).pathname.substr(1));

  // Cache the database connection and return the connection
  cachedDb = db;
  return db;
}

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
module.exports = async (req, res) => {
  // Get a database connection, cached or otherwise,
  // using the connection string environment variable as the argument
  const db = await connectToDatabase(process.env.MONGODB_URI);

  if (!req.body.email) {
    res.status(400).json({ message: "O e-mail é um campo obrigatório." });
    return;
  }

  if (!req.body.password) {
    res.status(400).json({ message: "A senha é um campo obrigatório." });
    return;
  }

  // Select the "users" collection from the database
  const collection = await db.collection("users");

  // Check if the username does not exists in the collection
  const user = await collection.find({ mail: req.body.email }).toArray();
  if (user.length)
    res.status(409).json({ message: "Esse usuário já existe em nossa base." });

  await collection.insertOne(
    { mail: req.body.email, password: req.body.password },
    (error) => {
      if (error) res.status(400).json({ error });
      else res.status(200).json({ message: "Usuário cadastrado com sucesso" });
    }
  );
};
