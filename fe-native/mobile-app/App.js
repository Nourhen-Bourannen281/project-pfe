import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import de tes écrans
import LoginScreen from "./screens/LoginScreen";
import EngineerDashboard from "./screens/EngineerDashboard";
import StockDashboard from "./screens/StockManagerDashboard";   // ⚠️ Vérifie que ce fichier existe bien
import CameraScreen from "./screens/CameraScreen";       // ⚠️ Vérifie que ce fichier existe bien

// Création du Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Connexion" }}
        />
        <Stack.Screen
          name="EngineerDashboard"
          component={EngineerDashboard}
          options={{ title: "Dashboard Ingénieur" }}
        />
        <Stack.Screen
          name="StockDashboard"
          component={StockDashboard}
          options={{ title: "Dashboard Stock" }}
        />
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{ title: "Scanner un produit" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
