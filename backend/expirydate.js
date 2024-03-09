const mysql = require('mysql');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'db'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
  
    // Alter purchaseinvoice table to add expirydate column
    connection.query(`
      ALTER TABLE purchaseinvoice 
      ADD COLUMN expirydate DATE;
    `, (err, results) => {
      if (err) {
        console.error('Error altering purchaseinvoice table:', err);
        return;
      }
      console.log('purchaseinvoice table altered successfully');
  
      // Update expirydate for each PONumber
      connection.query(`
        UPDATE purchaseinvoice 
        SET expirydate = DATE_ADD(PODate, INTERVAL 14 MONTH);
      `, (err, results) => {
        if (err) {
          console.error('Error updating expirydate:', err);
          return;
        }
        console.log('expirydate updated successfully');
  
        // Close the MySQL connection
        connection.end();
      });
    });
  });
