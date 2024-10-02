import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../../store/slices/userSlice';

// Define a validation schema with Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = () => {
  const navigation = useNavigation(); // Hook to navigate between screens
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user); // Access only the user slice
  console.log('userData===>>', userData);

  const handleLogin = async values => {
    const {email, password} = values;

    try {
      const response = await auth().signInWithEmailAndPassword(email, password);

      // console.log('response', JSON.stringify(response));
      const uid = response.user.uid;
      console.log('uid=======> ', uid);
      await getUserOtherDetail(uid);
    } catch (error) {
      console.error('error=========>>', error);
    }
  };

  const getUserOtherDetail = async uid => {
    try {
      const usersCollection = await firestore().collection('users');
      const userDoc = await usersCollection.doc(uid).get();

      if (userDoc.exists) {
        const userData = await userDoc.data();
        console.log('data of user is ===>>', userData);
        const finalUserData = {
          uid: uid,
          email: userData.email, // Access data from userData object
          firstName: userData.firstName,
          lastName: userData.lastName,
        };

        dispatch(setUser(finalUserData)); // Dispatch the user data to the store
      } else {
        console.log('user doc not exisit');
      }
    } catch (error) {
      console.error('error is ========>>', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      {/* Formik form wrapper */}
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
              autoCapitalize="none"
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.forgotPassword}>Forgot Password?</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('SignUpScreen')}>
              <Text style={styles.signUpPrompt}>
                Don't have an account?{' '}
                <Text style={styles.signUpText}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  forgotPassword: {
    textAlign: 'center',
    color: '#4285F4',
    fontSize: 16,
    marginTop: 20,
  },
  signUpPrompt: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#555',
  },
  signUpText: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default LoginScreen;
