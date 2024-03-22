# Backend Routes Documentation

This document outlines the backend routes available in the application.

## Customer Routes

### 1. POST /addcart
- Description: Adds the item to the customer cart in the cart table, linking with customer email as a foreign key.

### 2. GET /customerprofile
- Description: Sends information regarding a particular customer from the customer table.

### 3. POST /updatecustomerprofile
- Description: Updates customer profile with new data.

### 4. GET /customercart
- Description: Gets data from the cart table for that customer with the same email ID.

### 5. POST /customerdeleteitem
- Description: Deletes the particular item from the customer cart.

### 6. POST /customercheckout
- Description: Checks out from customer cart and adds it to the orders table.

### 7. GET /customerorders
- Description: Fetches data about a particular customer order.

### 8. POST /addeditreview
- Description: Adds or edits the review given by the customer for a particular order.

## Company Routes

### 1. POST /companyemailreg
- Description: Registers the company details in the company table.

### 2. GET /companyprofile
- Description: Gives information about the company profile.

### 3. POST /updatecompanyprofile
- Description: Updates company profile with new data.

### 4. POST /inventoryaddtosale
- Description: Adds the particular stock to sales and offers for customers.

### 5. POST /inventorydelete
- Description: Deletes the particular item from inventory.

### 6. POST /addstock
- Description: Adds the stock with given values to inventory.

### 7. GET /dashboardcompany
- Description: Gets the data to be displayed on the company dashboard.

### 8. GET /companywarehouse
- Description: Gets the stocks for company inventory.

### 9. GET /companysales
- Description: Gets data from company sales.

## Product Routes

### 1. GET /productssales
- Description: Gets data for products to be displayed on the customer browse section.

### 2. GET /productsoffers
- Description: Gets the data for the items in offers/sales section of the customer.

