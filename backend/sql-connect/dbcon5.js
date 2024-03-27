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

  // Create the cart table
  const createCartTableQuery = `
    CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      inventoryId VARCHAR(255),
      brand VARCHAR(255),
      Description VARCHAR(255),
      quantity INT,
      useremail VARCHAR(255),
      city VARCHAR(255),
      price DECIMAL(10,2),
      companyemail VARCHAR(255),
      stockid INT,
      size VARCHAR(50),
      FOREIGN KEY (useremail) REFERENCES customer(email),
      FOREIGN KEY (companyemail) REFERENCES company(email),
      FOREIGN KEY (inventoryId) REFERENCES city(InventoryId)
    )`;

  // Execute the create cart table query
  connection.query(createCartTableQuery, (err, results, fields) => {
    if (err) {
      console.error('Error creating cart table: ' + err.stack);
      return;
    }
    console.log('Table cart created successfully');

    // Read data from cart.csv file and insert into the cart table
    const cartCsvFilePath = path.join(__dirname, 'csv', 'cart.csv');

    fs.createReadStream(cartCsvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const insertCartQuery = `INSERT INTO cart (inventoryId, brand, Description, quantity, useremail, city, price, companyemail, stockid, size) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
          row.inventoryId,
          row.brand,
          row.Description,
          parseInt(row.quantity),
          row.useremail,
          row.city,
          parseFloat(row.price),
          row.companyemail,
          parseInt(row.stockid),
          row.size
        ];

        // Execute the insert cart query with row values
        connection.query(insertCartQuery, values, (err, results, fields) => {
          if (err) {
            console.error('Error inserting cart data: ' + err.stack);
            return;
          }
          console.log('Cart data inserted successfully');
        });
      })
      .on('end', () => {
        console.log('Cart CSV file successfully processed');
        connection.end(); // Close connection after all queries are executed
      })
      .on('error', (err) => {
        console.error('Error reading cart CSV file:', err);
      });
  });
});
