import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert ,TextInput} from 'react-native';
import { getCustomers, deleteCustomer,createCustomer ,updateCustomer} from '../api'; 

interface Customer {
  CustomerID: string;
  FullName: string;
  Gender: string;
  DateOfBirth: string;
  Occupation: string;
  Contacts: Contact[];
}

interface Contact {
  Type: string;
  SubType: string;
  Value: string;
}

const App = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [age, setAge] = useState('');
  const [newCustomerData, setNewCustomerData] = useState({
    CustomerID :'',
    FullName:'' ,
    Gender: '',
    DateOfBirth: '',
    Occupation: '',
    Contacts: [
      { Type: '', SubType: '', Value: '' },
      { Type: '', SubType: '', Value: '' },
    ],
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCustomers();
        

        if (data.length > 0) {
          setCustomer(data[0]); 
        }
        
      } catch (error) {
        console.error('Error fetching customers:', error);
        
      }
    };

    fetchCustomer();
  }, []);
  const handleDateChange = (text: String) => {
    // Remove any non-numeric characters
    let cleaned = text.replace(/[^0-9]/g, '');
    let formatted = '';

    // Format the date as dd-mm-yyyy
    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    } else if (cleaned.length <= 8) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4)}`;
    } else {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
    }

    setNewCustomerData({ ...newCustomerData, DateOfBirth: formatted });

  };

  const validateDate = (text: string) => {
    const datePattern = /^([0-2][0-9]|(3)[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!datePattern.test(text)) {
      alert('Invalid date format. Please use dd-mm-yyyy.');
    }
  };

  const calculateAge = (dob: String) => {
    const [day, month, year] = dob.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fillEmptyFields = (data1: Customer, data2: Customer): Customer => {
    const filledData: Customer = {
        Contacts: data2.Contacts.map((contact: any, index: number) => ({
            SubType: contact.SubType !== "" ? contact.SubType : data1.Contacts[index].SubType,
            Type: contact.Type !== "" ? contact.Type : data1.Contacts[index].Type,
            Value: contact.Value !== "" ? contact.Value : data1.Contacts[index].Value,
        })),
        CustomerID: data2.CustomerID !== "" ? data2.CustomerID : data1.CustomerID,
        DateOfBirth: data2.DateOfBirth !== "" ? data2.DateOfBirth : data1.DateOfBirth,
        FullName: data2.FullName !== "" ? data2.FullName : data1.FullName,
        Gender: data2.Gender !== "" ? data2.Gender : data1.Gender,
        Occupation: data2.Occupation !== "" ? data2.Occupation : data1.Occupation,
    };

    return filledData;
};

  const handleModify = async () => {
    if (!customer) {
      return; // Exit early if customer is null
    }
    const cleanedCustomerData = fillEmptyFields(customer, newCustomerData);
    const customerId = customer.CustomerID;
    const UpdateCustomer = await updateCustomer(customerId,cleanedCustomerData);
    console.log('Modify button clicked');
  };

  const handleDelete = async () => {
    if (!customer) {
      return;
    }
    try {
      const age = calculateAge(newCustomerData.DateOfBirth).toString(); // Convert age to string
      setAge(age);
      await deleteCustomer(customer.CustomerID); // deleteCustomer function deletes customer by ID
      Alert.alert('Success', 'Customer deleted successfully');
      setCustomer(null); // Clear customer after deletion 
    } catch (error) {
      console.error('Error deleting customer:', error);
      Alert.alert('Error', 'Failed to delete customer');
    }
  };
  
  const isFormValid = newCustomerData.FullName !== '' && newCustomerData.DateOfBirth !== '' && newCustomerData.Occupation !== '' && newCustomerData.Gender !== '' && newCustomerData.Contacts[0].Type !== '' && newCustomerData.Contacts[0].SubType !== '' && newCustomerData.Contacts[0].Value !== '' && newCustomerData.Contacts[1].Type !== '' && newCustomerData.Contacts[1].SubType !== '' && newCustomerData.Contacts[1].Value !== '';
  
  const handleCreate = async () => {
    try {
      const randomCustomerID = Math.floor(10000 + Math.random() * 90000);
      const updatedCustomerData = { ...newCustomerData, CustomerID: randomCustomerID };
      const createdCustomer = await createCustomer(updatedCustomerData);
      Alert.alert('Success', 'Customer created successfully');
      setCustomer(createdCustomer); 
      setNewCustomerData({
        CustomerID: '',
        FullName: '',
        Gender: '',
        DateOfBirth: '',
        Occupation: '',
        Contacts: [
          { Type: '', SubType: '', Value: '' },
          { Type: '', SubType: '', Value: '' },
        ],
      }); 
    } catch (error) {
      console.error('Error creating customer:', error);
      Alert.alert('Error', 'Failed to create customer');
    }
  };

  useEffect(() => {
    if (newCustomerData.DateOfBirth.length === 10) {
      const age = calculateAge(newCustomerData.DateOfBirth).toString(); 
      setAge(age);
    }
  }, [newCustomerData.DateOfBirth]);

  useEffect(() => {
    if (customer && customer.DateOfBirth) {
      const age = calculateAge(customer.DateOfBirth).toString();
      setAge(age);
    }
  }, [customer]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      maxWidth: '100%', 
      maxHeight: '100%', 
    },
    card: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 20,
      width: 550,
      height: 750,
      margin: 8,
      maxWidth: '100%', 
      maxHeight: '100%', 
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: '#4d96da',
      textAlign: 'center',
      marginBottom: 16,
      color: 'white',
      paddingVertical: 10
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignSelf: 'center',
      marginBottom: 16,
    },
    detailsContainer: {
      marginBottom: 16,
    },
    contactTitle: {
      fontSize: 18,
      backgroundColor: '#0d6083',
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
      color: 'white',
      paddingVertical: 10,
    },
    contactContainer: {
      marginBottom: 16,
    },
    boldText: {
      fontWeight: 'bold',
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'center',
      marginBottom: 0,
    },
    containerbtn: {
      flex: 1,
      justifyContent: 'space-between', 
      padding: 0,
    },
    inputContainer: {
      flexDirection: 'row', 
      alignItems: 'center',
      marginBottom: 1, 
    },    
    contactInputContainer: {
      flexDirection: 'row', 
      alignItems: 'center',
    },  
    inputSubType:{
      flex: 1, 
      borderWidth: 1,
      maxWidth: 100,
      borderColor: '#ccc',
      paddingVertical: 5,
      paddingHorizontal: 10,
      fontSize: 16,
      borderRadius: 2,
      textAlign: 'left',
    },
    inputValue:{
      flex: 1, 
      borderWidth: 1,
      borderColor: '#ccc',
      paddingVertical: 5,
      paddingHorizontal: 12,
      fontSize: 16,
      borderRadius: 2,
      textAlign: 'left',
    } ,   
    input: {
      flex: 1, 
      borderWidth: 1,
      borderColor: '#ccc',
      paddingVertical: 5,
      paddingHorizontal: 12,
      fontSize: 16,
      borderRadius: 6,
      textAlign: 'right',
    },
  });


  return (
    <View style={styles.container}>
      {customer ? (
        <View style={styles.card}>
          <Text style={styles.title}>Customer Profile</Text>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }} 
            style={styles.profileImage}
          />
          <View style={styles.detailsContainer}>
            <View style={styles.inputContainer}>
            <Text style={styles.boldText}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder={customer ? customer.FullName : ''}
              value={newCustomerData.FullName}
              onChangeText={(text) => setNewCustomerData({ ...newCustomerData, FullName: text })}
            />
            </View>
            <View style={styles.inputContainer}>
            <Text style={styles.boldText}>Gender: </Text>
            <TextInput
              style={styles.input}
              placeholder={customer.Gender}
              value={newCustomerData.Gender}
              onChangeText={(text) => setNewCustomerData({ ...newCustomerData, Gender: text })}
            />
            </View>            
            <View style={styles.inputContainer}>
            <Text style={styles.boldText}>Age: </Text>
            <TextInput
              style={styles.input}
              placeholder={`${age ? age : ''} Years Old`}
              value={`${age ? age : ''} Years Old`}
              editable={false}
            />
            </View>      
            <View style={styles.inputContainer}>
              <Text style={styles.boldText}>Date Of Birth: </Text>
              <TextInput
                style={styles.input}
                placeholder= {customer.DateOfBirth}
                value={newCustomerData.DateOfBirth}
                onChangeText={handleDateChange}
                onEndEditing={(e) => validateDate(e.nativeEvent.text)}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <View style={styles.inputContainer}>
            <Text style={styles.boldText}>Occupation: </Text>
            <TextInput
              style={styles.input}
              placeholder={customer.Occupation}
              value={newCustomerData.Occupation}
              onChangeText={(text) => setNewCustomerData({ ...newCustomerData, Occupation: text })}
            />
            </View>      
          </View>
          <Text style={styles.contactTitle}>Contact</Text>
          <View style={styles.contactContainer}>
            {customer.Contacts.map((contact, index) => (
              <View key={index} >
                <TextInput
                  placeholder={contact.Type}
                  value={newCustomerData.Contacts[index].Type}
                  onChangeText={(text) =>
                    setNewCustomerData((prevData) => {
                      const updatedContacts = [...prevData.Contacts];
                      updatedContacts[index].Type = text;
                      return { ...prevData, Contacts: updatedContacts };
                    })
                  }
                />
                <View style={styles.contactInputContainer}>
                  <TextInput
                    style={styles.inputSubType}
                    placeholder={contact.SubType}
                    value={newCustomerData.Contacts[index].SubType}
                    onChangeText={(text) =>
                      setNewCustomerData((prevData) => {
                        const updatedContacts = [...prevData.Contacts];
                        updatedContacts[index].SubType = text;
                        return { ...prevData, Contacts: updatedContacts };
                      })
                    }
                  />
                  <TextInput
                    style={styles.inputValue}
                    placeholder={contact.Value}
                    value={newCustomerData.Contacts[index].Value}
                    onChangeText={(text) =>
                      setNewCustomerData((prevData) => {
                        const updatedContacts = [...prevData.Contacts];
                        updatedContacts[index].Value = text;
                        return { ...prevData, Contacts: updatedContacts };
                      })
                    }
                  />
                </View>
              </View>
            ))}
          </View>
          <View style={styles.containerbtn}>
            <View style={styles.buttonContainer}>
              <Button title="Modify" onPress={handleModify} color="#00A4FF" />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Delete" onPress={handleDelete} color="#FF0000" />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
        <Text style={styles.title}>Customer Profile</Text>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder image URL
          style={styles.profileImage}
        />
        <View style={styles.detailsContainer}>
          <View style={styles.inputContainer}>
          <Text style={styles.boldText}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newCustomerData.FullName}
            onChangeText={(text) => setNewCustomerData({ ...newCustomerData, FullName: text })}
          />
          </View>
          <View style={styles.inputContainer}>
          <Text style={styles.boldText}>Gender: </Text>
          <TextInput
            style={styles.input}
            placeholder="Gender"
            value={newCustomerData.Gender}
            onChangeText={(text) => setNewCustomerData({ ...newCustomerData, Gender: text })}
          />
          </View>            
          <View style={styles.inputContainer}>
          <Text style={styles.boldText}>Age: </Text>
          <TextInput
            style={styles.input}
            placeholder={`${age ? age : ''} Years Old`}
            value={`${age ? age : ''} Years Old`}
            editable={false}
          />
          </View>      
          <View style={styles.inputContainer}>
            <Text style={styles.boldText}>Date Of Birth: </Text>
            <TextInput
              style={styles.input}
              placeholder= "Date of Birth (dd-mm-mm)"
              value={newCustomerData.DateOfBirth}
              onChangeText={handleDateChange}
              onEndEditing={(e) => validateDate(e.nativeEvent.text)}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.boldText}>Occupation: </Text>
            <TextInput
              style={styles.input}
              placeholder="Occupation"
              value={newCustomerData.Occupation}
              onChangeText={(text) => setNewCustomerData({ ...newCustomerData, Occupation: text })}
            />
          </View>      
        </View>
        <Text style={styles.contactTitle}>Contact</Text>
        <View style={styles.contactContainer}>
          <View key="0">
            <TextInput
              placeholder="Type"
              value={newCustomerData.Contacts[0].Type}
              onChangeText={(text) =>
                setNewCustomerData((prevData) => {
                  const updatedContacts = [...prevData.Contacts];
                  updatedContacts[0].Type = text;
                  return { ...prevData, Contacts: updatedContacts };
                })
              }
            />
            <View style={styles.contactInputContainer}>
            <TextInput
              style={styles.inputSubType}
              placeholder="SubType"
              value={newCustomerData.Contacts[0].SubType}
              onChangeText={(text) =>
                setNewCustomerData((prevData) => {
                  const updatedContacts = [...prevData.Contacts];
                  updatedContacts[0].SubType = text;
                  return { ...prevData, Contacts: updatedContacts };
                })
              }
            />
            <TextInput
              style={styles.inputValue}
              placeholder="Value"
              value={newCustomerData.Contacts[0].Value}
              onChangeText={(text) =>
                setNewCustomerData((prevData) => {
                  const updatedContacts = [...prevData.Contacts];
                  updatedContacts[0].Value = text;
                  return { ...prevData, Contacts: updatedContacts };
                })
              }
            />
            </View>
          </View>
          <View key="1">
          <TextInput
            placeholder="Type"
            value={newCustomerData.Contacts[1].Type}
            onChangeText={(text) =>
              setNewCustomerData((prevData) => {
                const updatedContacts = [...prevData.Contacts];
                updatedContacts[1].Type = text;
                return { ...prevData, Contacts: updatedContacts };
              })
            }
          />
          <View style={styles.contactInputContainer}>
            <TextInput
              style={styles.inputSubType}
              placeholder="SubType"
              value={newCustomerData.Contacts[1].SubType}
              onChangeText={(text) =>
                setNewCustomerData((prevData) => {
                  const updatedContacts = [...prevData.Contacts];
                  updatedContacts[1].SubType = text;
                  return { ...prevData, Contacts: updatedContacts };
                })
              }
            />
            <TextInput
              style={styles.inputValue}
              placeholder="Value"
              value={newCustomerData.Contacts[1].Value}
              onChangeText={(text) =>
                setNewCustomerData((prevData) => {
                  const updatedContacts = [...prevData.Contacts];
                  updatedContacts[1].Value = text;
                  return { ...prevData, Contacts: updatedContacts };
                })
              }
            />
          </View>
          </View>
        </View>
        <Button title="Create" onPress={handleCreate} color="#00A4FF" disabled={!isFormValid}/>
        </View>
      ) 
   }</View>
  );
};

export default App;
