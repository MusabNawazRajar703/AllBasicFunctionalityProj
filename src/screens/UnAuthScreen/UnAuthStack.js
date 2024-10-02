import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Alert, Button} from 'react-native';
import ChatRoomScreen from './ChatScreen/ChatRoomScreen';
import UserListScreen from './UserListScreen/UserListScreen';
import FavoriteUserScreen from './FavoriteUserScreen/FavoriteUserScreen';
import ChatListScreen from './ChatRoomScreen/ChatListScreen';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {clearUser} from '../../store/slices/userSlice';

export default function UnAuthStack({navigation}) {
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await auth().signOut(); // Sign out the user
      console.log('User logged out');
      dispatch(clearUser());
      // Navigate to the login screen or other appropriate screen
      navigation.navigate('LoginScreen');
    } catch (error) {
      // Handle errors during logout
      Alert.alert('Error', 'Failed to log out. Please try again.');
      console.error(error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="UserListScreen"
          component={UserListScreen}
          options={{
            title: 'Users',
            headerRight: () => (
              <Button onPress={handleLogout} title="Logout" color="#000" />
            ),
          }}
        />
        <Stack.Screen
          name="ChatRoomScreen"
          component={ChatRoomScreen}
          options={{headerShown: false}} // Hides the default header
        />

        <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
        <Stack.Screen
          name="FavoriteUserScreen"
          component={FavoriteUserScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
