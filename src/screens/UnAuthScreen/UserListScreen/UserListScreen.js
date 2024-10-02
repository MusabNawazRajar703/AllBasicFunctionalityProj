import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';

const UserListScreen = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const user = useSelector(state => state.user);
  const currentUserUid = user.uid;

  useEffect(() => {
    const unsubscribe = getOtherUserFromFireStore();
    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  // const getOtherUserFromFireStore = () => {
  //   const usersCollection = firestore()
  //     .collection('users')
  //     .where('uid', '!=', currentUserUid);

  //   // Return the unsubscribe function from onSnapshot
  //   return usersCollection.onSnapshot(
  //     snapshot => {
  //       const usersList = snapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       setUsers(usersList);
  //     },
  //     error => {
  //       console.error('Error fetching users:', error);
  //       // Handle the error as needed (e.g., show an alert)
  //     },
  //   );
  // };

  const getOtherUserFromFireStore = () => {
    const usersCollection = firestore().collection('users');

    // Return the unsubscribe function from onSnapshot
    return usersCollection.onSnapshot(
      snapshot => {
        const usersList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          // Filter out the current user
          .filter(user => user.uid !== currentUserUid);

        setUsers(usersList);
      },
      error => {
        console.error('Error fetching users:', error);
        // Handle the error as needed (e.g., show an alert)
      },
    );
  };

  const handlePress = user => {
    navigation.navigate('ChatRoomScreen', {otherUser: user});
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={styles.itemContainer}>
      <Icon
        name="person-circle"
        size={30}
        color="#4285F4"
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.uid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
});

export default UserListScreen;
