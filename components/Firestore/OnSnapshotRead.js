import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ReadFirestore = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create a reference to the Firestore collection
    const usersCollection = firestore().collection('users');

    // Function to fetch data
    const fetchData = async () => {
      try {
        const querySnapshot = await usersCollection
          .orderBy('createdAt', 'desc')
          .get();
        
        const usersArray = querySnapshot.docs.map(documentSnapshot => ({
          ...documentSnapshot.data(),
          id: documentSnapshot.id,
        }));
        
        setUsers(usersArray);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch data function
    fetchData();

    // Optional: Handle cleanup if using real-time listeners
    // const unsubscribe = usersCollection.onSnapshot(querySnapshot => {
    //   const usersArray = querySnapshot.docs.map(documentSnapshot => ({
    //     ...documentSnapshot.data(),
    //     id: documentSnapshot.id,
    //   }));
    //   setUsers(usersArray);
    //   setLoading(false);
    // });

    // Return a cleanup function (if using onSnapshot)
    return () => {
      // If using onSnapshot, call unsubscribe here
      // unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Name: {item.name}</Text>
      <Text style={styles.itemText}>Gender: {item.gender}</Text>
      <Text style={styles.itemText}>Age: {item.age}</Text>
      <Text style={styles.itemText}>Phone: {item.phoneNumber}</Text>
      <Text style={styles.itemText}>City: {item.city}</Text>
      <Text style={styles.itemText}>ID Card: {item.idCard}</Text>
      <Text style={styles.itemText}>Salary: {item.salary}</Text>
    </View>
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
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
});

export default ReadFirestore;
