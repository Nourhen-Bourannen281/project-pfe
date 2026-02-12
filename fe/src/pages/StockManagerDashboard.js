import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BarCodeScanner } from "expo-barcode-scanner";
import QRCode from "react-native-qrcode-svg";

export default function StockManagerDashboard({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scannerActive, setScannerActive] = useState(true);

  // Charger tous les produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
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

  // Demander permission caméra
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Scan → récupérer produit
  const handleScan = async ({ data }) => {
    setScannerActive(false);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`http://192.168.1.114:5000/api/products/${data}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setScannedProduct(res.data.data);
      }
    } catch (err) {
      console.error("Erreur récupération produit", err);
    }
  };

  // Ajouter quantité
  const addQuantity = async (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;
    const newQuantity = product.quantity + 1;

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.put(
        `http://192.168.1.114:5000/api/products/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setProducts(products.map((p) => (p._id === productId ? { ...p, quantity: newQuantity } : p)));
        setScannedProduct({ ...scannedProduct, quantity: newQuantity });
      }
    } catch (err) {
      console.error("Erreur ajout quantité", err);
    }
  };

  // Retirer quantité
  const removeQuantity = async (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product || product.quantity <= 0) {
      Alert.alert("Stock déjà à zéro");
      return;
    }
    const newQuantity = product.quantity - 1;

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.put(
        `http://192.168.1.114:5000/api/products/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setProducts(products.map((p) => (p._id === productId ? { ...p, quantity: newQuantity } : p)));
        setScannedProduct({ ...scannedProduct, quantity: newQuantity });
      }
    } catch (err) {
      console.error("Erreur retrait quantité", err);
    }
  };

  // Déconnexion
  const logout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  if (loading) return <Text>Chargement...</Text>;
  if (hasPermission === null) return <Text>Demande de permission caméra...</Text>;
  if (hasPermission === false) return <Text>Permission caméra refusée</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Gestion des Stocks</Text>

      {scannerActive && (
        <BarCodeScanner
          onBarCodeScanned={handleScan}
          style={{ width: 300, height: 300 }}
        />
      )}
      <Button
        title={scannerActive ? "⏸️ Pause Scanner" : "▶️ Activer Scanner"}
        onPress={() => setScannerActive(!scannerActive)}
      />

      {scannedProduct && (
        <View style={styles.card}>
          <Text style={styles.productName}>{scannedProduct.name}</Text>
          <Text>Prix: {scannedProduct.price} €</Text>
          <Text>Stock actuel: {scannedProduct.quantity}</Text>
          <Button title="➕ Ajouter" onPress={() => addQuantity(scannedProduct._id)} />
          <Button title="➖ Retirer" onPress={() => removeQuantity(scannedProduct._id)} />
        </View>
      )}

      <Text style={styles.subtitle}>📋 Inventaire</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name} - {item.price} € - Stock: {item.quantity}</Text>
            <QRCode value={item._id} size={50} />
          </View>
        )}
      />

      <Button title="🚪 Déconnexion" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, marginTop: 20 },
  card: { padding: 15, borderWidth: 1, marginVertical: 10 },
  productName: { fontSize: 20, fontWeight: "bold" },
  listItem: { padding: 10, borderBottomWidth: 1 },
});
