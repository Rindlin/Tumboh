import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet,
  ActivityIndicator,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { data } from '../data/data';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return email.includes('@') && email.includes('.');
  };

  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email');
        return;
    }

    setLoading(true);

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = data.find(
            (user) => user.email === email && user.password === password
        );

        if (user) {
            await AsyncStorage.setItem('user', JSON.stringify(user));
            Alert.alert('Success', `Welcome ${user.name}`, [
                {
                    text: 'OK',
                    onPress: () => navigation.replace('Home', { email: user.email }) 
                }
            ]);
        } else {
            Alert.alert('Error', 'Invalid email or password');
        }
    } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Image Above Tumboh */}
        <Image
          source={require("../assets/logo_tumboh.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Welcome to Our Earthy</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.searchContainer}>
          <Icon
            name="mail"
            size={20}
            color="#7f8c8d"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Email"
            placeholderTextColor="#95a5a6"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.searchContainer}>
          <Icon
            name="lock-closed"
            size={20}
            color="#7f8c8d"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Password"
            placeholderTextColor="#95a5a6"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        {/* Tambahkan setelah button Login */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
    justifyContent: 'center',  // Center everything vertically
    alignItems: 'center',      // Center horizontally
  },
  headerContainer: {
    alignItems: 'center', 
    marginBottom: 30, // Add some space below the logo
  },
  logoImage: {
    width: 200,          // Adjust the width as needed
    height: undefined,         // Adjust the height as needed
    marginBottom: 5, // Space between the logo and text
    aspectRatio: 1    
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
  },
  form: {
    width: '80%',    // Form should not take up the entire width
    gap: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  searchBar: {
    flex: 1,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingLeft: 50,
    fontSize: 16,
    color: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    height: 50,
    backgroundColor: '#2ecc71',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  registerLink: {
    color: '#2ecc71',
    fontSize: 14,
    fontWeight: '600',
  },
});
