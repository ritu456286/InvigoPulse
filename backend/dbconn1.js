const mysql = require('mysql');
const fs = require('fs');
const csv = require('csv-parser');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'db'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }

  console.log('Connected to MySQL database as id ' + connection.threadId);

  // Create PurchasePrices table if not exists
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS PurchasePrices (
      Brand VARCHAR(255) NOT NULL,
      Description VARCHAR(255) NOT NULL,
      Price DECIMAL(10,2) NOT NULL,
      Size VARCHAR(50),
      Volume INT,
      Classification INT,
      PurchasePrice DECIMAL(10,2),
      VendorNumber INT,
      VendorName VARCHAR(255),
      PRIMARY KEY (Brand, Description)
    )`;

  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table: ' + err.stack);
      return;
    }
    console.log('PurchasePrices table created successfully');

    // Read the CSV file
    fs.createReadStream('FilteredPurchasePrices.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Insert each row into the database
        connection.query('INSERT INTO PurchasePrices (Brand, Description, Price, Size, Volume, Classification, PurchasePrice, VendorNumber, VendorName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [row.Brand, row.Description, row.Price, row.Size, row.Volume, row.Classification, row.PurchasePrice, row.VendorNumber, row.VendorName],
          (err, result) => {
            if (err) {
              console.error('Error inserting row: ' + err.stack);
              return;
            }
            console.log('Row inserted: ' + result.insertId);
          });
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        // Close the database connection when done
        connection.end();
      });
  });
});
