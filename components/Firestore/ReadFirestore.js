import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ReadFirestore = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up a real-time listener
    const unsubscribe = firestore()
      .collection('users')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const usersArray = querySnapshot.docs.map(documentSnapshot => ({
          ...documentSnapshot.data(),
          id: documentSnapshot.id,
        }));
        setUsers(usersArray);
        setLoading(false);
      });

    // Cleanup function to unsubscribe from the listener
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handlePress = (item) => {
    // Handle item press here
    console.log('Item pressed:', item);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
      <Text style={styles.itemText}>Name: {item.name}</Text>
      <Text style={styles.itemText}>Gender: {item.gender}</Text>
      <Text style={styles.itemText}>Age: {item.age}</Text>
      <Text style={styles.itemText}>Phone: {item.phoneNumber}</Text>
      <Text style={styles.itemText}>City: {item.city}</Text>
      <Text style={styles.itemText}>ID Card: {item.idCard}</Text>
      <Text style={styles.itemText}>Salary: {item.salary}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={users}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ReadFirestore;
