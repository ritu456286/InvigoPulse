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

app.post('/addstock', async (req, res) => {
  const {
    InventoryId,
    Store,
    Brand,
    Description,
    Price,
    Size,
    Volume,
    Classification,
    PurchasePrice,
    VendorNumber,
    VendorName,
    InvoiceDate,
    PONumber,
    PODate,
    ReceivingDate,
    PayDate,
    Quantity,
    Dollars,
    Freight,
    Approval
  } = req.body;
  console.log(req.body);
  try {
    // Start transaction
    await beginTransaction();

    // Insert into purchaseprices table
    const purchasePricesId = await insertIntoPurchasePrices(Brand, Description, PurchasePrice, Size, Volume, Classification);

    // Insert into purchaseinvoice table
    const purchaseInvoiceId = await insertIntoPurchaseInvoice(VendorNumber, VendorName, InvoiceDate, PONumber, PODate, PayDate, Quantity, Dollars, Freight, Approval);

    // Insert into purchasefinal table
    await insertIntoPurchaseFinal(InventoryId, Store, Brand, Description, Size, VendorNumber, VendorName, PONumber, PODate, ReceivingDate, InvoiceDate, PayDate, PurchasePrice, Quantity, Dollars, Classification);

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
function insertIntoPurchasePrices(Brand, Description, Price, Size, Volume, Classification) {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO purchaseprices (Brand, Description, Price, Size, Volume, Classification) VALUES (?, ?, ?, ?, ?, ?)', [Brand, Description, Price, Size, Volume, Classification], (err, result) => {
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
function insertIntoPurchaseInvoice(VendorNumber, VendorName, InvoiceDate, PONumber, PODate, PayDate, Quantity, Dollars, Freight, Approval) {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO purchaseinvoice (VendorNumber, VendorName, InvoiceDate, PONumber, PODate, PayDate, Quantity, Dollars, Freight, Approval) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [VendorNumber, VendorName, InvoiceDate, PONumber, PODate, PayDate, Quantity, Dollars, Freight, Approval], (err, result) => {
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
function insertIntoPurchaseFinal(InventoryId, Store, Brand, Description, Size, VendorNumber, VendorName, PONumber, PODate, ReceivingDate, InvoiceDate, PayDate, PurchasePrice, Quantity, Dollars, Classification) {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO purchasefinal (InventoryId, Store, Brand, Description, Size, VendorNumber, VendorName, PONumber, PODate, ReceivingDate, InvoiceDate, PayDate, PurchasePrice, Quantity, Dollars, Classification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [InventoryId, Store, Brand, Description, Size, VendorNumber, VendorName, PONumber, PODate, ReceivingDate, InvoiceDate, PayDate, PurchasePrice, Quantity, Dollars, Classification], (err, result) => {
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
    const [countResult, salesResult, profitResult,brandVsSalesResult,inventoryVsSalesResult, salesVsDateResult] = await Promise.all([
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
      SELECT InventoryId, Store, Brand, Description, Size, PONumber, PurchasePrice, Quantity, Dollars
      FROM PurchaseFinal
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
  const data = { name: 'InvigoPulse',
  earning: 'Rs. 1,00,00,000',
  expenditure: 'Rs. 1,00,00,000',
  profit: 'Rs. 1,00,00,000',
  stocks: '2,000',
  deadstocks: '100' };
  res.json(data);
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});