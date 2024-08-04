import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import FireStoreForm from './components/Firestore/FireStoreForm';
import ReadFirestore from './components/Firestore/ReadFirestore';


const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ReadFirestore />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
