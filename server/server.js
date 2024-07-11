"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 8000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// MongoDB connection
mongoose_1.default.connect('mongodb://0.0.0.0:27017/ReactTestDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log("Error connecting to MongoDB:", err));
// Define schemas and models
const { Schema } = mongoose_1.default;
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
    Occupation: { type: String, required: true },
    Contacts: [ContactSchema]
}, { timestamps: true });
const Customer = mongoose_1.default.model('Customer', CustomerSchema);
// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});
// Create a customer
app.post('/api/customer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCustomer = new Customer(req.body);
        const savedCustomer = yield newCustomer.save();
        res.status(201).json(savedCustomer);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create customer' });
    }
}));
// Get all customers
app.get('/api/customers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield Customer.find();
        res.status(200).json(customers);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
}));
// Update a customer
app.put('/api/customer/:customerId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.customerId;
        const updatedCustomer = yield Customer.findOneAndUpdate({ CustomerID: customerId }, req.body, { new: true });
        if (!updatedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json(updatedCustomer);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update customer' });
    }
}));
// Delete a customer by ID
app.delete('/api/customer/:customerId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.customerId;
        const deletedCustomer = yield Customer.findOneAndDelete({ CustomerID: customerId });
        if (!deletedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete customer' });
    }
}));
// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
