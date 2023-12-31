// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');
const schoolsRoutes = require('./routes/schools');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/schools', schoolsRoutes);

app.get("/",(req,res)=>{
  res.send("Hi, Welcome to service provider  ");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
