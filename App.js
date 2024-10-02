import React from 'react';

import AuthStack from './src/screens/AuthScreens/AuthStack';
import UnAuthStack from './src/screens/UnAuthScreen/UnAuthStack';
import {Provider, useSelector} from 'react-redux';
import store, {persistor} from './src/store/store';
import {PersistGate} from 'redux-persist/integration/react';

function App() {
  const user = useSelector(state => state.user);
  console.log('user=========>>>', user);
  return user.email !== null ? <UnAuthStack /> : <AuthStack />;
}

export default function RootApp() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
}
