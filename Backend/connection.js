const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cafenodejs",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to test the database connection
async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Connected to the database!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
}

// Test the connection on startup
testConnection();

// Export the pool for use in other parts of the application
module.exports = pool;
