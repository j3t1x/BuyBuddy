const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');
const listRoutes = require('./routes/listRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/items', itemRoutes);
app.use('/lists', listRoutes);
app.use('/users', userRoutes);

// MongoDB Connection
const dbURI = 'mongodb://127.0.0.1:27017/shoppinglist';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    console.error('Full error:', JSON.stringify(err, null, 2));
  });

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
