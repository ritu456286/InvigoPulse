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

  // Create the orders table
  const createOrdersTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
      inventoryId VARCHAR(255),
      brand VARCHAR(255),
      Description VARCHAR(255),
      quantity INT,
      useremail VARCHAR(255),
      companyemail VARCHAR(255),
      stockid INT,
      size VARCHAR(50),
      review TEXT,
      date DATE,
      orderid BIGINT AUTO_INCREMENT PRIMARY KEY,
      FOREIGN KEY (useremail) REFERENCES customer(email),
      FOREIGN KEY (companyemail) REFERENCES company(email),
      FOREIGN KEY (inventoryId) REFERENCES city(InventoryId)
    )`;

  // Execute the create orders table query
  connection.query(createOrdersTableQuery, (err, results, fields) => {
    if (err) {
      console.error('Error creating orders table: ' + err.stack);
      return;
    }
    console.log('Table orders created successfully');

    // Read data from orders.csv file and insert into the orders table
    const ordersCsvFilePath = path.join(__dirname, 'csv', 'orders.csv');

    fs.createReadStream(ordersCsvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const insertOrdersQuery = `INSERT INTO orders (inventoryId, brand, Description, quantity, useremail, companyemail, stockid, size, review, date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
          row.inventoryId,
          row.brand,
          row.Description,
          parseInt(row.quantity),
          row.useremail,
          row.companyemail,
          parseInt(row.stockid),
          row.size,
          row.review,
          new Date(row.date)
        ];

        // Execute the insert orders query with row values
        connection.query(insertOrdersQuery, values, (err, results, fields) => {
          if (err) {
            console.error('Error inserting orders data: ' + err.stack);
            return;
          }
          console.log('Orders data inserted successfully');
        });
      })
      .on('end', () => {
        console.log('Orders CSV file successfully processed');
        connection.end(); // Close connection after all queries are executed
      })
      .on('error', (err) => {
        console.error('Error reading orders CSV file:', err);
      });
  });
});
