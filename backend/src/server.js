require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);

const PORT = process.env.PORT || 5000;

 connectDB().then(()=> {
 app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  })
 