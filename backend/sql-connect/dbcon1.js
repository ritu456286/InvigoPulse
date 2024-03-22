const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Create a connection to MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'db'
});

// Establish connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);

  // Create the city table
  const createCityTableQuery = `
    CREATE TABLE IF NOT EXISTS city (
      InventoryId VARCHAR(255) PRIMARY KEY,
      City VARCHAR(255)
    )`;

  // Execute the create city table query
  connection.query(createCityTableQuery, (err, results, fields) => {
    if (err) {
      console.error('Error creating city table: ' + err.stack);
      return;
    }
    console.log('Table city created successfully');

    // Read data from city.csv file and insert into the city table
    const cityCsvFilePath = path.join(__dirname, 'csv', 'city.csv');

    fs.createReadStream(cityCsvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const insertCityQuery = `INSERT INTO city (InventoryId, City) 
        VALUES (?, ?)`;

        const values = [
          row.InventoryId,
          row.City
        ];

        // Execute the insert city query with row values
        connection.query(insertCityQuery, values, (err, results, fields) => {
          if (err) {
            console.error('Error inserting city data: ' + err.stack);
            return;
          }
          console.log('City data inserted successfully');
        });
      })
      .on('end', () => {
        console.log('City CSV file successfully processed');
        connection.end(); // Close connection after all queries are executed
      })
      .on('error', (err) => {
        console.error('Error reading city CSV file:', err);
      });
  });
});
