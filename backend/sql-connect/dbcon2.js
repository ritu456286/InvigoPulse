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

  // Create the company table
  const createCompanyTableQuery = `
    CREATE TABLE IF NOT EXISTS company (
      email VARCHAR(255) PRIMARY KEY,
      companyName VARCHAR(255),
      ownerName VARCHAR(255),
      address VARCHAR(255),
      city VARCHAR(255),
      phoneNumber VARCHAR(20)
    )`;

  // Execute the create company table query
  connection.query(createCompanyTableQuery, (err, results, fields) => {
    if (err) {
      console.error('Error creating company table: ' + err.stack);
      return;
    }
    console.log('Table company created successfully');

    // Read data from company.csv file and insert into the company table
    const companyCsvFilePath = path.join(__dirname, 'csv', 'company.csv');

    fs.createReadStream(companyCsvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const insertCompanyQuery = `INSERT INTO company (email, companyName, ownerName, address, city, phoneNumber) 
        VALUES (?, ?, ?, ?, ?, ?)`;

        const values = [
          row.email,
          row.companyName,
          row.ownerName,
          row.address,
          row.city,
          row.phoneNumber
        ];

        // Execute the insert company query with row values
        connection.query(insertCompanyQuery, values, (err, results, fields) => {
          if (err) {
            console.error('Error inserting company data: ' + err.stack);
            return;
          }
          console.log('Company data inserted successfully');
        });
      })
      .on('end', () => {
        console.log('Company CSV file successfully processed');
        connection.end(); // Close connection after all queries are executed
      })
      .on('error', (err) => {
        console.error('Error reading company CSV file:', err);
      });
  });
});
