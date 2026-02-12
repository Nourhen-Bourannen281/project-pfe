import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://192.168.1.114:5000/api/auth/login", {
        email,
        password,
      });

      // 🔎 Debug pour voir la réponse
      console.log("Réponse backend:", res.data);

      // Bien récupérer les champs
      const success = res.data.success;
      const token = res.data.token;
      const user = res.data.user;

      if (success && token && user) {
        console.log("Token reçu:", token);
        console.log("Rôle reçu:", user.role);

        // Stocker token et rôle
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("role", user.role);

        // Redirection selon rôle
        if (user.role === "ingénieur") {
          navigation.replace("EngineerDashboard");
        } else if (user.role === "responsable_stock") {
          navigation.replace("StockDashboard");
        } else {
          Alert.alert("Accès refusé", "Rôle non autorisé");
        }
      } else {
        Alert.alert("Erreur", res.data.message || "Échec de la connexion");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      Alert.alert("Erreur serveur");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Se connecter" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
