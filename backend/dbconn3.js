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

  // Create PurchaseFinal table if not exists
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS PurchaseFinal (
      InventoryId VARCHAR(255),
      Store INT,
      Brand VARCHAR(255),
      Description VARCHAR(255),
      Size VARCHAR(50),
      VendorNumber INT,
      VendorName VARCHAR(255),
      PONumber INT,
      PODate DATE,
      ReceivingDate DATE,
      InvoiceDate DATE,
      PayDate DATE,
      PurchasePrice DECIMAL(10,2),
      Quantity INT,
      Dollars DECIMAL(10,2),
      Classification INT,
      FOREIGN KEY (Brand, Description) REFERENCES PurchasePrices(Brand, Description),
      FOREIGN KEY (PONumber) REFERENCES PurchaseInvoice(PONumber)
    )`;

  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table: ' + err.stack);
      return;
    }
    console.log('PurchaseFinal table created successfully');

    // Read the CSV file
    fs.createReadStream('FilteredPurchaseFinal.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Insert each row into the database
        connection.query('INSERT INTO PurchaseFinal (InventoryId, Store, Brand, Description, Size, VendorNumber, VendorName, PONumber, PODate, ReceivingDate, InvoiceDate, PayDate, PurchasePrice, Quantity, Dollars, Classification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [row.InventoryId, row.Store, row.Brand, row.Description, row.Size, row.VendorNumber, row.VendorName, row.PONumber, row.PODate, row.ReceivingDate, row.InvoiceDate, row.PayDate, row.PurchasePrice, row.Quantity, row.Dollars, row.Classification],
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
