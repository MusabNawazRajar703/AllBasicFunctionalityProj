import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const FirebaseApI = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [idCard, setIdCard] = useState('');
  const [salary, setSalary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !gender || !age || !phoneNumber || !city || !idCard || !salary) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://practiceproject-a949d-default-rtdb.firebaseio.com/users.json', {
        name,
        gender,
        age,
        phoneNumber,
        city,
        idCard,
        salary,
        createdAt: new Date().toISOString(),
      });
      console.log('User added:', response.data);
      
      // Reset form after submission
      setName('');
      setGender('');
      setAge('');
      setPhoneNumber('');
      setCity('');
      setIdCard('');
      setSalary('');
      setError('');
      alert('User added successfully!');
    } catch (error) {
      console.error(error);
      setError('Error adding user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Text style={styles.label}>Gender</Text>
      <Picker
        selectedValue={gender}
        style={styles.input}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Select gender" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Enter your age"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>City</Text>
      <Picker
        selectedValue={city}
        style={styles.input}
        onValueChange={(itemValue) => setCity(itemValue)}
      >
        <Picker.Item label="Select city" value="" />
        <Picker.Item label="Rajar" value="Rajar" />
        <Picker.Item label="Khushab" value="Khushab" />
        <Picker.Item label="Jauharabad" value="Jauharabad" />
        <Picker.Item label="Sargodha" value="Sargodha" />
        <Picker.Item label="Lahore" value="Lahore" />
        <Picker.Item label="Pelowains" value="Pelowains" />
      </Picker>
      <Text style={styles.label}>ID Card</Text>
      <TextInput
        style={styles.input}
        value={idCard}
        onChangeText={setIdCard}
        placeholder="Enter your ID card number"
        keyboardType='number-pad'
      />
      <Text style={styles.label}>Salary</Text>
      <TextInput
        style={styles.input}
        value={salary}
        onChangeText={setSalary}
        placeholder="Enter your salary"
        keyboardType="numeric"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Submit" onPress={handleSubmit} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
});

export default FirebaseApI;
