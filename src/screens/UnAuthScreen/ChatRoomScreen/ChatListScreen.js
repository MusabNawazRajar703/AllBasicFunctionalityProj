import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Dummy data for chat conversations
const dummyChats = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage:
      'Hey there! How are you doing today? I was thinking we could catch up later.',
    timestamp: '2m ago',
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage:
      'Looking forward to our meeting. Can you confirm the time and place?',
    timestamp: '5m ago',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    lastMessage:
      'Can you send me the files we discussed? I need them for the presentation.',
    timestamp: '10m ago',
  },
  {
    id: '4',
    name: 'Emily Davis',
    lastMessage:
      'Thanks for your help today. I really appreciate it and look forward to our next collaboration.',
    timestamp: '20m ago',
  },
];

const ChatListScreen = ({navigation}) => {
  const handleChatSelect = chat => {
    // Navigate to the chat room or detail screen
    console.log('Chat selected:', chat);
    // navigation.navigate('ChatRoomScreen', { chat }); // Example navigation
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => handleChatSelect(item)}
      style={styles.itemContainer}>
      <Icon
        name="person-circle"
        size={50}
        color="#4285F4"
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyChats}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    paddingTop: 10,
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
  lastMessage: {
    fontSize: 16,
    color: '#555',
    overflow: 'hidden', // Ensures text is hidden properly
  },
  timestamp: {
    fontSize: 14,
    color: '#888',
    marginLeft: 10,
  },
});

export default ChatListScreen;
