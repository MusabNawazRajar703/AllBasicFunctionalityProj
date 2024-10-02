import {configureStore} from '@reduxjs/toolkit';
// Purpose: Import function to configure the Redux store, which sets up the central store for managing application state.

import userReducer from '../store/slices/userSlice';
// Purpose: Import the reducer function for managing user-related state from the user slice of the Redux store.

import {persistStore, persistReducer} from 'redux-persist';
// Purpose: Import functions to add persistence capabilities to the Redux store, so state can be saved and restored between app restarts.

import AsyncStorage from '@react-native-async-storage/async-storage';
// Purpose: Import AsyncStorage to use as the storage engine where the persisted state will be stored locally on the device.

const persistConfig = {
  key: 'root',
  // Purpose: Define a key ('root') that identifies the persisted state in AsyncStorage.

  storage: AsyncStorage,
  // Purpose: Specify that AsyncStorage will be used to save the state data.

  blacklist: ['register'],
  // Purpose: Exclude non-serializable values or actions that you don’t want to persist. For example, "register" (if it contains non-serializable data like functions).
};

// Wrap the userReducer with persistReducer to add persistence capabilities
const persistedUserReducer = persistReducer(persistConfig, userReducer);
// Purpose: Enhance the userReducer with persistence capabilities using the configuration defined above. This allows user state to be saved and restored.

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    // Purpose: Configure the Redux store to use the persisted reducer for managing the user state.
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore actions related to redux-persist that can contain non-serializable values like functions.
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // You can also ignore specific state fields that may contain non-serializable data
        ignoredPaths: ['user.register'],
      },
    }),
  // Purpose: Set up middleware to handle serializability checks and ignore non-serializable values or actions.
});

// Create a persistor instance to handle state rehydration
export const persistor = persistStore(store);
// Purpose: Create a persistor that manages the process of restoring the saved state from AsyncStorage when the app starts.

export default store;
// Purpose: Export the configured Redux store for use throughout the app.
