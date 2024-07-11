import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://0.0.0.0:27017/ReactTestDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any).then(() => console.log('MongoDB connected'))
    .catch(err => console.log("Error connecting to MongoDB:", err));
    
// Define schemas and models
const { Schema } = mongoose;

const ContactSchema = new Schema({
  Type: { type: String, required: true },
  SubType: { type: String, required: true },
  Value: { type: String, required: true }
}, { _id: false });

const CustomerSchema = new Schema({
  CustomerID: { type: String, required: true },
  FullName: { type: String, required: true },
  DateOfBirth: { type: String, required: true },
  Gender: { type: String, required: true },
  Occupation : { type: String, required: true },
  Contacts: [ContactSchema]
}, { timestamps: true });

const Customer = mongoose.model('Customer', CustomerSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Create a customer
app.post('/api/customer', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Update a customer
app.put('/api/customer/:customerId', async (req, res) => {
    try {
      const customerId = req.params.customerId;
      const updatedCustomer = await Customer.findOneAndUpdate({ CustomerID: customerId }, req.body, { new: true });
      if (!updatedCustomer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.status(200).json(updatedCustomer);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update customer' });
    }
  });

// Delete a customer by ID
app.delete('/api/customer/:customerId', async (req, res) => {
    try {
      const customerId = req.params.customerId;
      const deletedCustomer = await Customer.findOneAndDelete({ CustomerID: customerId });
      if (!deletedCustomer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete customer' });
    }
  });

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});