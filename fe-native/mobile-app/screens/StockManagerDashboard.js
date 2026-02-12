import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function StockDashboard({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

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
        console.error("Erreur chargement produits", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (role !== "responsable_stock") {
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

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Dashboard Responsable Stock</Text>
      <Text style={styles.subtitle}>Inventaire des produits</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.description || "Pas de description"}</Text>
            <Text style={styles.price}>{item.price} €</Text>
            <Text>Stock: {item.quantity}</Text>
          </View>
        )}
      />

      <Button
        title="📷 Scanner un produit"
        onPress={() => navigation.navigate("CameraScreen")}
      />
      <Button title="🚪 Déconnexion" onPress={logout} />
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
