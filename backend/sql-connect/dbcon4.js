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

  // SQL query to create the purchasefinal table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS purchasefinal (
    InventoryId VARCHAR(255),
    Brand VARCHAR(255),
    Description VARCHAR(255),
    Size VARCHAR(50),
    PONumber INT,
    PODate DATE,
    PurchasePrice DECIMAL(10,2),
    Quantity INT,
    Dollars DECIMAL(10,2),
    companyemail VARCHAR(255),
    stockid INT AUTO_INCREMENT PRIMARY KEY,
    Price DECIMAL(10,2),
    addtosale VARCHAR(3),
    expirydate DATE,
    FOREIGN KEY (companyemail) REFERENCES company(email),
    FOREIGN KEY (InventoryId) REFERENCES city(InventoryId)
);`;

  // Execute the create table query
  connection.query(createTableQuery, (err, results, fields) => {
    if (err) {
      console.error('Error creating table: ' + err.stack);
      return;
    }
    console.log('Table purchasefinal created successfully');

    // Read data from CSV file and insert into the purchasefinal table
    const csvFilePath = path.join(__dirname, 'csv', 'purchasefinal.csv'); // Change the path accordingly

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const insertQuery = `INSERT INTO purchasefinal (InventoryId, Brand, Description, Size, PONumber, PODate, PurchasePrice, Quantity, Dollars, companyemail, Price, addtosale, expirydate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
          row.InventoryId,
          row.Brand,
          row.Description,
          row.Size,
          parseInt(row.PONumber),
          new Date(row.PODate),
          parseFloat(row.PurchasePrice),
          parseInt(row.Quantity),
          parseFloat(row.Dollars),
          row.companyemail,
          parseFloat(row.Price),
          row.addtosale,
          new Date(row.expirydate)
        ];

        // Execute the insert query with row values
        connection.query(insertQuery, values, (err, results, fields) => {
          if (err) {
            console.error('Error inserting data: ' + err.stack);
            return;
          }
          console.log('Data inserted successfully');
        });
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        connection.end(); // Close connection after all queries are executed
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
      });
  });
});
