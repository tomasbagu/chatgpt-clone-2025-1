import React, { useContext, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { DataContext } from "../context/DataContext";

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const slideAnim = useRef(new Animated.Value(-250)).current;
  const router = useRouter();
  const { chats, createChat, setSelectedChat } = useContext(DataContext);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  // Handler para cerrar el sidebar con animación de salida
  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleNewChat = async () => {
    await createChat("Chat sin título", []);
    onClose();
  };

  const handleSelectChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setSelectedChat(chat);
      onClose();
    }
  };

  return (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
      {/* Botón para cerrar Sidebar */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>

      {/* Botón para crear nuevo chat */}
      <TouchableOpacity style={styles.menuItem} onPress={handleNewChat}>
        <Ionicons name="chatbubbles-outline" size={24} color="white" />
        <Text style={styles.menuText}>New Chat</Text>
      </TouchableOpacity>

      {/* Lista de chats guardados */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => handleSelectChat(item.id)}>
            <Text style={styles.chatText}>{item.title || "Chat sin título"}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón de Logout */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.replace("/Login")}>
          <Ionicons name="log-out-outline" size={24} color="red" />
          <Text style={[styles.menuText, { color: "red" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#2E2E2E",
    paddingTop: 50,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 1000, // Asegura que el Sidebar esté por encima de otros elementos
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  chatItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  chatText: {
    color: "white",
    fontSize: 14,
  },
  logoutContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
});
