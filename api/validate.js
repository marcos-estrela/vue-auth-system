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

  // Select the "users" collection from the database
  const collection = await db.collection("users");

  // Select the users collection from the database
  const user = await collection
    .find({ user: parameters.userKey, password: parameters.password })
    .toArray();

  if (!user.length) {
    res.status(400).json({
      message: "Usuário ou senha não correspondem a um usuário válido.",
    });
    return;
  }

  const payload = { userKey: parameters.userKey };
  const token = jwt.create(payload, process.env.JWT_PHRASE);
  token.setExpiration(new Date().getTime() + 60 * 1000);
  res.status(200).json({ token: token.compact() });
};
