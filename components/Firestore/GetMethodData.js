import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {date} from 'yup';

const ReadFirestore = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fallbackText, setFallBackText] = useState('');

  useEffect(() => {
    // Create a reference to the Firestore collection
    const usersCollection = firestore().collection('users');

    // Fetch data from Firestore
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
        // console.error("Error fetching users: ", error);
        setFallBackText('No such user exist');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Optional: Return a cleanup function to unsubscribe from Firestore updates if using onSnapshot
    return () => {
      // Cleanup code if needed
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({item}) => (
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
    <View>
      {users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', width:'100%', height:700}}>
          <Text style={{fontSize:30}}>{fallbackText}</Text>
        </View>
      )}
    </View>
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
