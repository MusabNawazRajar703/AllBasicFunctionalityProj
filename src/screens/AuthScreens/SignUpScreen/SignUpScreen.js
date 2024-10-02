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
import {useDispatch} from 'react-redux';
import {setUser} from '../../../store/slices/userSlice';

// Define a validation schema using Yup
const SignUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First Name is required')
    .min(2, 'First Name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last Name is required')
    .min(2, 'Last Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const SignUpScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation(); // Hook to navigate between screens

  const handleSignUp = async values => {
    const {email, password, firstName, lastName} = values;
    // Handle sign-up logic here
    // console.log('Sign-Up Details:', values);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      const user = userCredential.user;

      const uid = user.uid;

      const userObj = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      sendFirestore(uid, userObj);

      dispatch(setUser(...uid, userObj));

      alert('account created succesfully!');

      console.log('User account created and data saved in Firestore');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert(
          'This email address is already in use. Please use a different email.',
        );
      }
      console.error('Error signing up or saving data to Firestore:', error);
    }
  };

  const sendFirestore = async (uid, value) => {
    try {
      const res = await firestore()
        .collection('users')
        .doc(uid)
        .set({uid, ...value});

      console.log('response=======>>', res);
      dispatch(
        setUser({
          uid: uid,
          email: value.email,
          firstName: value.firstName,
          lastName: value.lastName,
        }),
      );
    } catch (error) {
      console.error('error=======>', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <Formik
        initialValues={{firstName: '', lastName: '', email: '', password: ''}}
        validationSchema={SignUpSchema}
        onSubmit={handleSignUp}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={values.firstName}
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              autoCapitalize="words"
            />
            {touched.firstName && errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={values.lastName}
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              autoCapitalize="words"
            />
            {touched.lastName && errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
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
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.loginPrompt}>
                Already have an account?{' '}
                <Text style={styles.loginText}>Login</Text>
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
  loginPrompt: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#555',
  },
  loginText: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default SignUpScreen;
