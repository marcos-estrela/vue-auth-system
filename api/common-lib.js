const url = require("url");
const MongoClient = require("mongodb").MongoClient;
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const crypto = require("crypto");

// Create cached connection variable
let cachedDb = null;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri, response) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  try {
    // If no connection is cached, create a new one
    const client = await MongoClient.connect(uri, { useNewUrlParser: true });

    // Select the database through the connection,
    // using the database path of the connection string
    const db = client.db(url.parse(uri).pathname.substr(1));

    // Cache the database connection and return the connection
    cachedDb = db;
    return db;
  } catch (error) {
    httpResponse({
      response: response,
      type: "error",
      code: 400,
      message: "Não foi posssível se conectar ao banco de dados",
    });
  }
}

async function httpResponse({ response, type, code, message }) {
  var responseObject = {};
  responseObject[type] = {
    code: code,
    message: message,
  };
  response.status(code).json(responseObject);
  response.send();
}

module.exports = { sgMail, crypto, connectToDatabase, httpResponse };
