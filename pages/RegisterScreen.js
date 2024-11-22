import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { data } from "../data/data";
import Icon from "react-native-vector-icons/Ionicons";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateUsername = (username) =>
    /^[a-zA-Z0-9_]{3,20}$/.test(username);

  const handleRegister = async () => {
    if (!name || !email || !username || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }

    if (!validateUsername(username)) {
      Alert.alert(
        "Error",
        "Username must be 3-20 characters long and can only contain letters, numbers, and underscores"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const existingUser = data.find(
        (user) => user.email === email || user.username === username
      );

      if (existingUser) {
        Alert.alert("Error", "Email or username already exists");
      } else {
        const newUser = {
          id: data.length + 1,
          name,
          email,
          username,
          password,
          image: `https://randomuser.me/api/portraits/men/${
            data.length + 1
          }.jpg`,
        };

        data.push(newUser);

        await AsyncStorage.setItem("user", JSON.stringify(newUser));

        Alert.alert(
          "Success",
          "Account created successfully! Please login to continue.",
          [
            {
              text: "OK",
              onPress: () => navigation.replace("Login"),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../assets/logo_tumboh.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Create Your Account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.searchContainer}>
          <Icon
            name="person"
            size={20}
            color="#7f8c8d"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Full Name"
            placeholderTextColor="#95a5a6"
            value={name}
            onChangeText={setName}
          />
        </View>

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
          />
        </View>

        <View style={styles.searchContainer}>
          <Icon name="at" size={20} color="#7f8c8d" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Username"
            placeholderTextColor="#95a5a6"
            value={username}
            onChangeText={setUsername}
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
          />
        </View>

        <View style={styles.searchContainer}>
          <Icon
            name="shield-checkmark"
            size={20}
            color="#7f8c8d"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Confirm Password"
            placeholderTextColor="#95a5a6"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoImage: {
    width: 150,
    height: undefined,
    aspectRatio: 1,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
  },
  form: {
    width: "100%",
    gap: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 10,
  },
  searchBar: {
    flex: 1,
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    paddingLeft: 50,
    fontSize: 16,
    color: "#2c3e50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    height: 50,
    backgroundColor: "#2ecc71",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#7f8c8d",
    fontSize: 14,
  },
  loginLink: {
    color: "#2ecc71",
    fontSize: 14,
    fontWeight: "600",
  },
});
