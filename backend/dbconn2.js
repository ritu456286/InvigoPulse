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

  // Create PurchaseInvoice table if not exists
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS PurchaseInvoice (
      PONumber INT PRIMARY KEY,
      VendorNumber INT,
      VendorName VARCHAR(255),
      InvoiceDate DATE,
      PODate DATE,
      PayDate DATE,
      Quantity INT,
      Dollars DECIMAL(10,2),
      Freight DECIMAL(10,2),
      Approval VARCHAR(50)
    )`;

  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table: ' + err.stack);
      return;
    }
    console.log('PurchaseInvoice table created successfully');

    // Read the CSV file
    fs.createReadStream('FilteredPurchasesInvoice.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Insert each row into the database
        connection.query('INSERT INTO PurchaseInvoice (PONumber, VendorNumber, VendorName, InvoiceDate, PODate, PayDate, Quantity, Dollars, Freight, Approval) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [row.PONumber, row.VendorNumber, row.VendorName, row.InvoiceDate, row.PODate, row.PayDate, row.Quantity, row.Dollars, row.Freight, row.Approval],
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
