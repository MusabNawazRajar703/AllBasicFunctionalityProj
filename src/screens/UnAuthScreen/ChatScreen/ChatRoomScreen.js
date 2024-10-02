import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';

export default function ChatRoomScreen({route}) {
  const {otherUser} = route.params;
  const currentUser = useSelector(state => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigation = useNavigation();

  // Fetch messages from Firebase
  useEffect(() => {
    const messageRef = database().ref(
      `ChatRoom/${currentUser.uid}_${otherUser.uid}`,
    );

    const onValueChange = messageRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const formattedMessages = Object.values(data).filter(
          message =>
            (message.sender === currentUser.uid &&
              message.receiver === otherUser.uid) ||
            (message.sender === otherUser.uid &&
              message.receiver === currentUser.uid),
        );
        formattedMessages.sort((a, b) => a.time - b.time);
        setMessages(formattedMessages);
      }
    });

    return () => messageRef.off('value', onValueChange);
  }, [currentUser.uid, otherUser.uid]);

  // Send new message
  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageId = database().ref().child('ChatRoom').push().key;

      const messageData = {
        id: messageId,
        text: newMessage,
        sender: currentUser.uid,
        receiver: otherUser.uid,
        time: database.ServerValue.TIMESTAMP,
      };

      database()
        .ref(`ChatRoom/${currentUser.uid}_${otherUser.uid}/${messageId}`)
        .set(messageData);
      database()
        .ref(`ChatRoom/${otherUser.uid}_${currentUser.uid}/${messageId}`)
        .set(messageData);

      setNewMessage('');
    }
  };

  // Render each message
  const renderItem = ({item}) => {
    const isUser = item.sender === currentUser.uid;
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.supportMessage,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timeText}>
          {new Date(item.time).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Image
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjSISYBWZM7bIEF_jqWJem9p-mLjij9h_IWQ&s',
          }}
          style={styles.userImage}
        />
        <Text style={styles.userName}>
          {otherUser.firstName} {otherUser.lastName}
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          style={styles.input}
          multiline={true}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContainer: {
    maxWidth: '75%',
    minWidth: '25%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  userMessage: {
    backgroundColor: '#1A1A1A',
    alignSelf: 'flex-end',
  },
  supportMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 25,
    marginLeft: 10,
  },
});
