import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Demande de permission caméra...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Permission refusée 🚫</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned ? (
        <BarCodeScanner
          onBarCodeScanned={({ data }) => {
            setScanned(true);
            setData(data);
          }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={styles.card}>
          <Text>Produit scanné: {data}</Text>
          <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />
          <Button title="⬅️ Retour" onPress={() => navigation.goBack()} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { padding: 20, borderWidth: 1, margin: 20, borderRadius: 5 },
});
