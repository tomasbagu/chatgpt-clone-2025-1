import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logochat.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome to ChatGPT</Text>
      <Text style={styles.subtitle}>Ask anything, get your answer</Text>
      <View style={styles.examples}>
        <Text style={styles.exampleBox}>"Explain quantum computing in simple terms"</Text>
        <Text style={styles.exampleBox}>"Got any creative ideas for a 10 year old’s birthday?"</Text>
        <Text style={styles.exampleBox}>"How do I make an HTTP request in JavaScript?"</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/Chat")}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "#A0A0A0",
    marginTop: 5,
    marginBottom: 20,
  },
  examples: {
    width: "100%",
    alignItems: "center",
  },
  exampleBox: {
    backgroundColor: "#2E2E2E",
    color: "white",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

// export default WelcomeScreen; (removed duplicate export)