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

  // Create Sales table if not exists
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Sales (
    InventoryId VARCHAR(255),
    Store INT,
    Brand VARCHAR(255),
    Description VARCHAR(255),
    Size VARCHAR(50),
    SalesQuantity INT,
    SalesDollars DECIMAL(10,2),
    SalesPrice DECIMAL(10,2),
    SalesDate DATE,
    Volume INT,
    Classification INT,
    ExciseTax DECIMAL(10,2),
    VendorNo INT,
    VendorName VARCHAR(255),
    FOREIGN KEY (Brand, Description) REFERENCES PurchasePrices(Brand, Description)
  )`;

  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table: ' + err.stack);
      return;
    }
    console.log('Sales table created successfully');

    // Read the CSV file
    fs.createReadStream('Sales.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Convert SalesDate to MySQL format
        const salesDateParts = row.SalesDate.split('/');
        const salesDate = salesDateParts[2] + '-' + salesDateParts[0].padStart(2, '0') + '-' + salesDateParts[1].padStart(2, '0');

        // Insert each row into the database
        connection.query('INSERT INTO Sales (InventoryId, Store, Brand, Description, Size, SalesQuantity, SalesDollars, SalesPrice, SalesDate, Volume, Classification, ExciseTax, VendorNo, VendorName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [row.InventoryId, row.Store, row.Brand, row.Description, row.Size, row.SalesQuantity, row.SalesDollars, row.SalesPrice, salesDate, row.Volume, row.Classification, row.ExciseTax, row.VendorNo, row.VendorName],
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
