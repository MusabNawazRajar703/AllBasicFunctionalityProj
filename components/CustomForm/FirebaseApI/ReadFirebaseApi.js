import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const ReadFirebaseApi = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewPersonsButton, setShowNewPersonsButton] = useState(false);
  const [prevData, setPrevData] = useState([]);
  const flatListRef = useRef(null);
  const [isAtTop, setIsAtTop] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://practiceproject-a949d-default-rtdb.firebaseio.com/users.json',
      );
      const fetchedUsers = response.data
        ? Object.entries(response.data).map(([id, user]) => ({id, ...user}))
        : [];
      // console.log(Object.entries(response.data));
      console.log('fetchedUsers=> ', fetchedUsers);

      // Check if the fetched data is different from previous data
      const isNewData =
        fetchedUsers.length !== prevData.length ||
        fetchedUsers.some(
          (user, index) =>
            !prevData.find(
              prevUser =>
                prevUser.id === user.id &&
                JSON.stringify(prevUser) === JSON.stringify(user),
            ),
        );

      if (isNewData) {
        // Set users with new data at the top (reversing the array to show the newest data first)
        setUsers(fetchedUsers.reverse());

        // Update previous data with new fetched data
        setPrevData(fetchedUsers);

        // Show the button only if the user is not at the top
        if (!isAtTop) {
          setShowNewPersonsButton(true);
        }
      } else {
        // No new data, hide the button
        setShowNewPersonsButton(false);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Error fetching data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load with 5000ms delay
    const initialLoad = setTimeout(() => {
      fetchData();
    }, 5000);

    // Periodically check for new data every 5 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    // Clear timeouts and intervals when component unmounts
    return () => {
      clearTimeout(initialLoad);
      clearInterval(intervalId);
    };
  }, [isAtTop]);

  const handlePress = user => {
    console.log('User touched:', user);
  };

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({offset: 0, animated: true});
    setShowNewPersonsButton(false); // Hide the button when the user views new data
  };

  const handleScroll = event => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    setIsAtTop(currentOffset === 0); // Check if at the top
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={styles.userContainer}>
      <Text style={styles.label}>Name: {item.name}</Text>
      <Text style={styles.label}>Gender: {item.gender}</Text>
      <Text style={styles.label}>Age: {item.age}</Text>
      <Text style={styles.label}>Phone: {item.phoneNumber}</Text>
      <Text style={styles.label}>City: {item.city}</Text>
      <Text style={styles.label}>ID Card: {item.idCard}</Text>
      <Text style={styles.label}>Salary: {item.salary}</Text>
      <Text style={styles.label}>
        Created At: {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {showNewPersonsButton && (
        <TouchableOpacity style={styles.newPersonsButton} onPress={scrollToTop}>
          <Text style={styles.newPersonsButtonText}>See New Persons</Text>
        </TouchableOpacity>
      )}
      <FlatList
        ref={flatListRef}
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        onScroll={handleScroll}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 20,
  },
  userContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  newPersonsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  newPersonsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ReadFirebaseApi;
