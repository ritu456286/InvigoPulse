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

  // Create the customer table
  const createCustomerTableQuery = `
    CREATE TABLE IF NOT EXISTS customer (
      email VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      phone VARCHAR(20),
      city VARCHAR(255),
      address VARCHAR(255)
    )`;

  // Execute the create customer table query
  connection.query(createCustomerTableQuery, (err, results, fields) => {
    if (err) {
      console.error('Error creating customer table: ' + err.stack);
      return;
    }
    console.log('Table customer created successfully');

    // Read data from customer.csv file and insert into the customer table
    const customerCsvFilePath = path.join(__dirname, 'csv', 'customer.csv');

    fs.createReadStream(customerCsvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const insertCustomerQuery = `INSERT INTO customer (email, name, phone, city, address) 
        VALUES (?, ?, ?, ?, ?)`;

        const values = [
          row.email,
          row.name,
          row.phone,
          row.city,
          row.address
        ];

        // Execute the insert customer query with row values
        connection.query(insertCustomerQuery, values, (err, results, fields) => {
          if (err) {
            console.error('Error inserting customer data: ' + err.stack);
            return;
          }
          console.log('Customer data inserted successfully');
        });
      })
      .on('end', () => {
        console.log('Customer CSV file successfully processed');
        connection.end(); // Close connection after all queries are executed
      })
      .on('error', (err) => {
        console.error('Error reading customer CSV file:', err);
      });
  });
});
