const express = require('express');
const app = express();
const port = 5000; // or any other port you prefer
const mysql = require('mysql');
const bodyParser = require('body-parser');
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
});
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'db',
  connectionLimit: 10
});
app.use(bodyParser.json());
//same for cart and order table
const createCartTableSQL = `
  CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventoryId VARCHAR(255),
    brand VARCHAR(255),
    Description VARCHAR(255),
    quantity INT,
    useremail VARCHAR(255)
  )
`;

// Execute the SQL query to create the cart table
pool.query(createCartTableSQL, (err, results) => {
  if (err) {
    console.error('Error creating order table:', err);
  } else {
    console.log('order table created successfully');
  }
});

// Handle POST request to /addcart
app.post('/addcart', (req, res) => {
  const { inventoryId, brand, Description, quantity } = req.body;
  const useremail = '123@gmail.com'; // Hardcoded for demonstration

  // Check if the product already exists in the cart
  const checkIfExistsQuery = 'SELECT * FROM cart WHERE inventoryId = ? AND brand = ? AND Description = ? AND useremail = ?';
  const checkIfExistsValues = [inventoryId, brand, Description, useremail];

  pool.query(checkIfExistsQuery, checkIfExistsValues, (err, existingProduct) => {
    if (err) {
      console.error('Error checking existing product:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (existingProduct.length > 0) {
      // If the product already exists, update its quantity
      const updatedQuantity = quantity;
      const updateQuery = 'UPDATE cart SET quantity = ? WHERE inventoryId = ? AND brand = ? AND Description = ? AND useremail = ?';
      const updateValues = [updatedQuantity, inventoryId, brand, Description, useremail];

      pool.query(updateQuery, updateValues, (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Error updating product quantity:', updateErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Product quantity updated successfully');
        res.json({ message: 'Product quantity updated successfully' });
      });
    } else {
      // If the product does not exist, insert it into the cart
      const insertQuery = 'INSERT INTO cart (inventoryId, brand, Description, quantity, useremail) VALUES (?, ?, ?, ?, ?)';
      const insertValues = [inventoryId, brand, Description, quantity, useremail];

      pool.query(insertQuery, insertValues, (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error adding product to cart:', insertErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Product added to cart successfully');
        res.json({ message: 'Product added to cart successfully' });
      });
    }
  });
});

app.get('/customercart', (req, res) => {
  const useremail = '123@gmail.com'; // Hardcoded for demonstration

  // Query to fetch unique cart data with price and quantity
  const query = `
    SELECT DISTINCT c.id, c.inventoryId, c.brand, c.Description, c.quantity, p.Price, p.Size
    FROM cart AS c
    LEFT JOIN purchaseprices AS p ON c.brand = p.brand AND c.Description = p.Description
    LEFT JOIN purchasefinal AS f ON c.inventoryId = f.InventoryId AND c.brand = f.Brand AND c.Description = f.Description
    WHERE c.useremail = ?
  `;
  const values = [useremail];

  // Execute the SQL query
  pool.query(query, values, (err, results) => {
    if (err) {
      console.error('Error fetching unique cart data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // If query is successful, return the results as JSON
      res.json(results);
    }
  });
});

app.post('/customerdeleteitem', (req, res) => {
  const { brand, Description, inventoryId, quantity } = req.body;
  const useremail = '123@gmail.com'; // Hardcoded for demonstration

  // Delete the item from the cart table
  const sql = 'DELETE FROM cart WHERE brand = ? AND Description = ? AND inventoryId = ? AND quantity = ? AND useremail = ?';
  const values = [brand, Description, inventoryId, quantity, useremail];

  // Execute the SQL query
  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error deleting item:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Item deleted successfully');
      res.json({ message: 'Item deleted successfully' });
    }
  });
});
app.post('/updateinventory', (req, res) => {
  const {
    InventoryId,
    Brand,
    Description,
    Size,
    PONumber,
    PurchasePrice,
    Quantity,
    Dollars,
    Price
  } = req.body;

  // Update purchasefinal table
  const updatePurchaseFinalQuery = `UPDATE purchasefinal SET InventoryId = ?, Brand = ?, Description = ?, Size = ?, PONumber = ?, PurchasePrice = ?, Quantity = ?, Dollars = ? WHERE InventoryId = ? AND Brand = ? AND Description = ?`;

  connection.query(
    updatePurchaseFinalQuery,
    [InventoryId, Brand, Description, Size, PONumber, PurchasePrice, Quantity, Dollars, InventoryId, Brand, Description],
    (err, result) => {
      if (err) {
        console.error('Error updating purchasefinal table:', err);
        res.status(500).json({ error: 'Error updating purchasefinal table' });
        return;
      }
      console.log('Updated purchasefinal table:', result.affectedRows);
    }
  );

  // Update purchaseprice table
  const updatePurchasePriceQuery = `UPDATE purchaseprices SET Brand = ?, Description = ?, Price = ? WHERE Brand = ? AND Description = ?`;

  connection.query(
    updatePurchasePriceQuery,
    [Brand, Description, Price, Brand, Description],
    (err, result) => {
      if (err) {
        console.error('Error updating purchaseprice table:', err);
        res.status(500).json({ error: 'Error updating purchaseprice table' });
        return;
      }
      console.log('Updated purchaseprice table:', result.affectedRows);
    }
  );

  res.status(200).json({ message: 'Update successful' });
});
app.post('/inventorydelete', (req, res) => {
  const { InventoryId, Brand, Description, PONumber } = req.body;

  // Delete from purchasefinal table
  const deletePurchaseFinalQuery = `DELETE FROM purchasefinal WHERE InventoryId = ? AND Brand = ? AND Description = ? AND PONumber = ?`;
  connection.query(deletePurchaseFinalQuery, [InventoryId, Brand, Description, PONumber], (err, result) => {
    if (err) {
      console.error('Error deleting from purchasefinal table:', err);
      res.status(500).json({ error: 'Error deleting from purchasefinal table' });
      return;
    }
    console.log('Deleted from purchasefinal table:', result.affectedRows);
  });

  // Delete from purchaseinvoice table
  // const deletePurchaseInvoiceQuery = `DELETE FROM purchaseinvoice WHERE PONumber = ?`;
  // connection.query(deletePurchaseInvoiceQuery, [PONumber], (err, result) => {
  //   if (err) {
  //     console.error('Error deleting from purchaseinvoice table:', err);
  //     res.status(500).json({ error: 'Error deleting from purchaseinvoice table' });
  //     return;
  //   }
  //   console.log('Deleted from purchaseinvoice table:', result.affectedRows);
  // });

  res.status(200).json({ message: 'Deletion successful' });
});
app.post('/customercheckout', (req, res) => {
  const { brand, Description, inventoryId, quantity, Size, Price } = req.body;
  const useremail = '123@gmail.com'; // Hardcoded for demonstration
  console.log(Price);
  // Decrease the quantity in the purchasefinal table
  const updateSql = 'UPDATE purchasefinal SET quantity = Quantity - ? WHERE Brand = ? AND Description = ? AND InventoryId = ?';
  const updateValues = [quantity, brand, Description, inventoryId];

  // Execute the update SQL query
  pool.query(updateSql, updateValues, (updateErr, updateResults) => {
    if (updateErr) {
      console.error('Error updating quantity in purchasefinal table:', updateErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Quantity updated in purchasefinal table');

      // Delete the item from the cart table
      const deleteSql = 'DELETE FROM cart WHERE brand = ? AND Description = ? AND inventoryId = ? AND quantity = ? AND useremail = ?';
      const deleteValues = [brand, Description, inventoryId, quantity, useremail];

      // Execute the delete SQL query
      pool.query(deleteSql, deleteValues, (deleteErr, deleteResults) => {
        if (deleteErr) {
          console.error('Error deleting item from cart:', deleteErr);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Item deleted from cart successfully');

          // Insert the item into the orders table
          const insertSql = 'INSERT INTO orders (inventoryId, brand, Description, quantity, useremail) VALUES (?, ?, ?, ?, ?)';
          const insertValues = [inventoryId, brand, Description, quantity, useremail];

          // Execute the insert SQL query
          pool.query(insertSql, insertValues, (insertErr, insertResults) => {
            if (insertErr) {
              console.error('Error inserting item into orders:', insertErr);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              console.log('Item inserted into orders successfully');

              // Insert sales data into the sales table
              const salesInsertSql = 'INSERT INTO sales (InventoryId, Brand, Description, Size, SalesQuantity, SalesDollars, SalesPrice) VALUES (?, ?, ?, ?, ?, ?, ?)';
              const salesInsertValues = [inventoryId, brand, Description, Size, quantity, quantity * Price, Price,];

              // Execute the sales insert SQL query
              pool.query(salesInsertSql, salesInsertValues, (salesInsertErr, salesInsertResults) => {
                if (salesInsertErr) {
                  console.error('Error inserting sales data into sales:', salesInsertErr);
                  res.status(500).json({ error: 'Internal Server Error' });
                } else {
                  console.log('Sales data inserted into sales successfully');
                  res.json({ message: 'Order placed successfully' });
                }
              });
            }
          });
        }
      });
    }
  });
});

app.get('/customerorders', (req, res) => {
  const useremail = '123@gmail.com'; // Hardcoded for demonstration

  // Query to fetch all customer orders for the specified useremail
  const query = 'SELECT * FROM orders WHERE useremail = ?';
  const values = [useremail];

  // Execute the SQL query
  pool.query(query, values, (err, results) => {
    if (err) {
      console.error('Error fetching customer orders:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // If query is successful, return the results as JSON
      res.json(results);
    }
  });
});


app.post('/addstock', async (req, res) => {
  const {
    InventoryId,

    Brand,
    Description,
    Price,
    Size,


    PurchasePrice,

    PONumber,
    PODate,

    Quantity,
    Dollars,

  } = req.body;
  console.log(req.body);
  try {
    // Start transaction
    await beginTransaction();

    // Insert into purchaseprices table
    const purchasePricesId = await insertIntoPurchasePrices(Brand, Description, PurchasePrice, Size, Price);

    // Insert into purchaseinvoice table
    const purchaseInvoiceId = await insertIntoPurchaseInvoice(PONumber, PODate, Quantity, Dollars);

    // Insert into purchasefinal table
    await insertIntoPurchaseFinal(InventoryId, Brand, Description, Size, PONumber, PODate, PurchasePrice, Quantity, Dollars);

    // Commit transaction
    await commitTransaction();

    res.status(200).send('Stock added successfully');
  } catch (error) {
    // Rollback transaction on error
    await rollbackTransaction();
    console.error('Error adding stock:', error.message);
    res.status(500).send('Error adding stock');
  }
});

// Function to begin transaction
function beginTransaction() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      connection.beginTransaction((err) => {
        if (err) reject(err);
        resolve();
      });
      connection.release();
    });
  });
}

// Function to commit transaction
function commitTransaction() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      connection.commit((err) => {
        if (err) reject(err);
        resolve();
      });
      connection.release();
    });
  });
}

// Function to rollback transaction
function rollbackTransaction() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      connection.rollback(() => {
        resolve();
      });
      connection.release();
    });
  });
}


// Function to insert into purchaseinvoice table
function insertIntoPurchasePrices(Brand, Description, PurchasePrice, Size, Price) {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO purchaseprices (Brand, Description, Price, Size, PurchasePrice ) VALUES (?, ?, ?, ?, ?)', [Brand, Description, Price, Size, PurchasePrice], (err, result) => {
      if (err) {
        console.error('Error inserting into purchaseprices:', err);
        reject(err);
      } else {
        console.log('Inserted into purchaseprices:', result);
        resolve(result.insertId);
      }
    });
  });
}

// Function to insert into purchaseinvoice table
function insertIntoPurchaseInvoice(PONumber, PODate, Quantity, Dollars) {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO purchaseinvoice (PONumber, PODate,  Quantity, Dollars) VALUES (?, ?, ?, ?)', [PONumber, PODate, Quantity, Dollars], (err, result) => {
      if (err) {
        console.error('Error inserting into purchaseinvoice:', err);
        reject(err);
      } else {
        console.log('Inserted into purchaseinvoice:', result);
        resolve(result.insertId);
      }
    });
  });
}

// Function to insert into purchasefinal table
function insertIntoPurchaseFinal(InventoryId, Brand, Description, Size, PONumber, PODate, PurchasePrice, Quantity, Dollars) {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO purchasefinal (InventoryId, Brand, Description, Size, PONumber, PODate, PurchasePrice, Quantity, Dollars) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [InventoryId, Brand, Description, Size, PONumber, PODate, PurchasePrice, Quantity, Dollars], (err, result) => {
      if (err) {
        console.error('Error inserting into purchasefinal:', err);
        reject(err);
      } else {
        console.log('Inserted into purchasefinal:', result);
        resolve(result.insertId);
      }
    });
  });
}

app.get('/dashboardcompany', async (req, res) => {
  try {
    const countQuery = 'SELECT COUNT(DISTINCT Brand, Description) AS count FROM PurchaseFinal';
    const salesQuery = 'SELECT SUM(SalesDollars) AS total_sales FROM Sales';
    const profitQuery = `
      SELECT SUM((s.SalesDollars / s.SalesPrice) * (s.SalesPrice - p.PurchasePrice)) AS total_profit
      FROM Sales s
      JOIN PurchasePrices p ON s.Brand = p.Brand AND s.Description = p.Description
    `;
    const brandVsSalesQuery = `
      SELECT Brand, SUM(SalesDollars) AS total_sales
      FROM Sales
      GROUP BY Brand
    `;
    const inventoryVsSalesQuery = `
      SELECT InventoryId, SUM(SalesDollars) AS total_sales
      FROM Sales
      GROUP BY InventoryId
    `;
    const salesVsDateQuery = `
      SELECT SalesDate, SUM(SalesDollars) AS total_sales
      FROM Sales
      GROUP BY SalesDate
    `;
    const [countResult, salesResult, profitResult, brandVsSalesResult, inventoryVsSalesResult, salesVsDateResult] = await Promise.all([
      executeQuery(countQuery),
      executeQuery(salesQuery),
      executeQuery(profitQuery),
      executeQuery(brandVsSalesQuery),
      executeQuery(inventoryVsSalesQuery),
      executeQuery(salesVsDateQuery)
    ]);

    const totalUniqueProducts = countResult[0].count;
    const totalSales = salesResult[0].total_sales;
    const totalProfit = profitResult[0].total_profit;
    const brandVsSales = {};
    brandVsSalesResult.forEach((row) => {
      brandVsSales[row.Brand] = row.total_sales;
    });
    const inventoryVsSales = {};
    inventoryVsSalesResult.forEach((row) => {
      inventoryVsSales[row.InventoryId] = row.total_sales;
    });
    const salesVsDate = {};
    salesVsDateResult.forEach((row) => {
      salesVsDate[row.SalesDate] = row.total_sales;
    });
    res.json({
      total_unique_products: totalUniqueProducts,
      total_sales: totalSales,
      total_profit: totalProfit,
      brand_vs_sales: brandVsSales,
      inventory_vs_sales: inventoryVsSales,
      sales_vs_date: salesVsDate
    });
  } catch (error) {
    console.error('Error querying database: ' + error.stack);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/companywarehouse', async (req, res) => {
  try {
    const companyWarehouseQuery = `
      SELECT pf.InventoryId, pf.Store, pf.Brand, pf.Description, pf.Size, pf.PONumber, pf.PurchasePrice, pf.Quantity, pf.Dollars, pp.Price
      FROM PurchaseFinal pf
      LEFT JOIN PurchasePrices pp ON pf.Brand = pp.Brand AND pf.Description = pp.Description
    `;

    const companyWarehouseResult = await executeQuery(companyWarehouseQuery);

    res.json(companyWarehouseResult);
  } catch (error) {
    console.error('Error querying database: ' + error.stack);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/companysales', async (req, res) => {
  try {
    const extractQuery = `
      SELECT InventoryId, Store, Brand, Description, Size, SalesQuantity, SalesDollars, SalesPrice, SalesDate, Volume
      FROM Sales
    `;

    const extractResult = await executeQuery(extractQuery);

    res.json(extractResult);
  } catch (error) {
    console.error('Error querying database: ' + error.stack);
    res.status(500).send('Internal Server Error');
  }
});
// Function to execute SQL query
function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

app.get('/homepage', (req, res) => {
  // Handle your API logic here
  const data = { message: 'InvigoPulse - One stop solution for both Inventory and Deadstock Management.' };
  res.json(data);
});

app.get('/companydashboard', (req, res) => {
  // Handle your API logic here
  const data = {
    name: 'InvigoPulse',
    earning: 'Rs. 1,00,00,000',
    expenditure: 'Rs. 1,00,00,000',
    profit: 'Rs. 1,00,00,000',
    stocks: '2,000',
    deadstocks: '100'
  };
  res.json(data);
});
app.get('/productssales', (req, res) => {
  // Query to fetch InventoryID, Brand, Description, Size, and total Quantity from purchasefinal and PurchasePrice from purchaseprices tables
  const query = `
    SELECT pf.InventoryID, pf.Brand, pf.Description, pf.Size, pp.Price, SUM(pf.Quantity) as TotalQuantity
    FROM purchasefinal pf
    INNER JOIN purchaseprices pp ON pf.Brand = pp.Brand AND pf.Description = pp.Description
    GROUP BY pf.InventoryID, pf.Brand, pf.Description, pf.Size, pp.Price
  `;

  // Execute the query
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching product sales data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    // If query is successful, return the results as JSON
    res.json(results);
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});