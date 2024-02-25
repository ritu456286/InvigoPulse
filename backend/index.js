const express = require('express');
const app = express();
const port = 5000; // or any other port you prefer

app.get('/homepage', (req, res) => {
  // Handle your API logic here
  const data = { message: 'InvigoPulse - One stop solution for both Inventory and Deadstock Management.' };
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});