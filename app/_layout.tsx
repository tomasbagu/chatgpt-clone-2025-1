import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "../context/DataContext"; // Importa el DataProvider

export default function RootLayout() {
  return (
    <AuthProvider>
      <DataProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="Chat" />
          <Stack.Screen name="Login" />
          <Stack.Screen name="Register" />
        </Stack>
      </DataProvider>
    </AuthProvider>
  );
}
