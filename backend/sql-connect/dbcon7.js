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

  // Create the sales table
  const createSalesTableQuery = `
    CREATE TABLE IF NOT EXISTS sales (
      InventoryId VARCHAR(255),
      Brand VARCHAR(255),
      Description VARCHAR(255),
      Size VARCHAR(50),
      SalesQuantity INT,
      SalesDollars DECIMAL(10,2),
      SalesPrice DECIMAL(10,2),
      SalesDate DATE,
      customeremail VARCHAR(255),
      companyemail VARCHAR(255),
      stockid INT,
      review TEXT,
      orderid BIGINT,
      FOREIGN KEY (InventoryId) REFERENCES city(InventoryId),
      FOREIGN KEY (customeremail) REFERENCES customer(email),
      FOREIGN KEY (companyemail) REFERENCES company(email)
    )`;

  // Execute the create sales table query
  connection.query(createSalesTableQuery, (err, results, fields) => {
    if (err) {
      console.error('Error creating sales table: ' + err.stack);
      return;
    }
    console.log('Table sales created successfully');

    // Read data from sales.csv file and insert into the sales table
    const salesCsvFilePath = path.join(__dirname, 'csv', 'sales.csv');

    fs.createReadStream(salesCsvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const insertSalesQuery = `INSERT INTO sales (InventoryId, Brand, Description, Size, SalesQuantity, SalesDollars, SalesPrice, SalesDate, customeremail, companyemail, stockid, review, orderid) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
          row.InventoryId,
          row.Brand,
          row.Description,
          row.Size,
          parseInt(row.SalesQuantity),
          parseFloat(row.SalesDollars),
          parseFloat(row.SalesPrice),
          new Date(row.SalesDate),
          row.customeremail,
          row.companyemail,
          parseInt(row.stockid),
          row.review,
          parseInt(row.orderid)
        ];

        // Execute the insert sales query with row values
        connection.query(insertSalesQuery, values, (err, results, fields) => {
          if (err) {
            console.error('Error inserting sales data: ' + err.stack);
            return;
          }
          console.log('Sales data inserted successfully');
        });
      })
      .on('end', () => {
        console.log('Sales CSV file successfully processed');
        connection.end(); // Close connection after all queries are executed
      })
      .on('error', (err) => {
        console.error('Error reading sales CSV file:', err);
      });
  });
});
