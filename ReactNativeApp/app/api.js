// api.js
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://192.168.0.191:8000/api', 
});

export const getCustomers = async () => {
  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    throw error;
  }
};

export const createCustomer = async (customer) => {
  try {
    const response = await api.post('/customer', customer);
    return response.data;
  } catch (error) {
    console.error('Failed to create customer:', error);
    throw error;
  }
};

export const updateCustomer = async (customerId, customer) => {
  try {
    const response = await api.put(`/customer/${customerId}`, customer);
    return response.data;
  } catch (error) {
    console.error('Failed to update customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    await api.delete(`/customer/${customerId}`);
  } catch (error) {
    console.error('Failed to delete customer:', error);
    throw error;
  }
};
