const mysql = require('mysql');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'db'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Create city table
  connection.query(`
    CREATE TABLE IF NOT EXISTS city (
      InventoryId VARCHAR(255) PRIMARY KEY,
      City VARCHAR(255)
    );
  `, (err, results) => {
    if (err) {
      console.error('Error creating city table:', err);
      return;
    }
    console.log('City table created successfully');

    // Map each unique InventoryId in the purchasefinal table to a random city
    connection.query('SELECT DISTINCT InventoryId FROM purchasefinal', (err, results) => {
      if (err) {
        console.error('Error selecting distinct InventoryIds:', err);
        return;
      }

      const inventoryIds = results.map(row => row.InventoryId);
      for (const inventoryId of inventoryIds) {
        const city = getRandomCity();
        // Insert or update into the city table
        connection.query(`
          INSERT INTO city (InventoryId, City) VALUES (?, ?)
          ON DUPLICATE KEY UPDATE City = VALUES(City);
        `, [inventoryId, city], (err, results) => {
          if (err) {
            console.error('Error inserting into city table:', err);
            return;
          }
        });
      }
      console.log('City table populated successfully!');

      // Close the MySQL connection
      connection.end();
    });
  });
});

// Function to generate a random city
function getRandomCity() {
  const cities = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
}
