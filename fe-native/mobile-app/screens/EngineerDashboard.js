import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function EngineerDashboard({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  // Charger les produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedRole = await AsyncStorage.getItem("role");
        setRole(storedRole);

        const res = await axios.get("http://192.168.1.114:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des produits", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Vérification du rôle
  if (role !== "ingénieur") {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Accès refusé 🚫</Text>
        <Button title="Retour" onPress={() => navigation.replace("Login")} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Ingénieur</Text>
      <Text style={styles.subtitle}>Liste des produits</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.description || "Pas de description"}</Text>
            <Text style={styles.price}>{item.price} €</Text>
          </View>
        )}
      />

      <Button
        title="🚪 Déconnexion"
        onPress={async () => {
          await AsyncStorage.clear();
          navigation.replace("Login");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 10 },
  card: { padding: 15, borderWidth: 1, borderRadius: 5, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 14, color: "green" },
  error: { fontSize: 18, color: "red", marginBottom: 10 },
});
