import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ActivityIndicator,
  Modal,
  Text,
  Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Sidebar from "./SideBar";
import { DataContext } from "../context/DataContext";

const GEMINI_API_KEY = "AIzaSyCu0xqYtjJUTyErQFKrDhEiXHTnt3NLZpk";

type Message = {
  text: string;
  sender: "user" | "ai";
};

const ChatScreen = () => {
  const { selectedChat, setSelectedChat, updateChat, createChat } = useContext(DataContext);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showSidebar ? 250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showSidebar, slideAnim]);

  const fetchAIResponse = async () => {
    if (!inputText.trim()) return;

    let currentChat = selectedChat;
    const userMessage: Message = { text: inputText, sender: "user" };

    // Si no hay chat seleccionado, creamos uno nuevo con "Chat sin título" en Sidebar
    // (o podrías crear uno directamente desde aquí con la primera frase).
    if (!currentChat) {
      const newChatId = await createChat("Nuevo Chat", []); // Este "Nuevo Chat" no se verá si la lógica del DataContext se ajusta
      currentChat = selectedChat;
      if (!currentChat) return;
    }

    // Agregamos el mensaje del usuario
    const updatedMessages = [...currentChat.messages, userMessage];
    const newChat = { ...currentChat, messages: updatedMessages };

    setSelectedChat(newChat);
    updateChat(currentChat.id, updatedMessages);

    setInputText("");
    setLoading(true);
    Keyboard.dismiss();

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: userMessage.text }] }] }),
        }
      );

      const data = await response.json();
      console.log("Response from AI:", data);

      const aiMessage: Message = {
        text:
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response from AI.",
        sender: "ai",
      };

      const updatedMessages2 = [...newChat.messages, aiMessage];
      const newChat2 = { ...currentChat, messages: updatedMessages2 };

      setSelectedChat(newChat2);
      updateChat(currentChat.id, updatedMessages2);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMsg: Message = { text: "Error fetching response.", sender: "ai" };
      const updatedMessages2 = [...newChat.messages, errorMsg];
      const newChat2 = { ...currentChat, messages: updatedMessages2 };
      setSelectedChat(newChat2);
      updateChat(currentChat.id, updatedMessages2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {showSidebar && <Sidebar onClose={() => setShowSidebar(false)} />}

      <TouchableOpacity style={styles.backButton} onPress={() => setShowSidebar(true)}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.headerText}>Chat</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.chatContainer, { transform: [{ translateX: slideAnim }] }]}>
        <FlatList
          data={selectedChat?.messages || []}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender === "user" ? styles.userMessage : styles.aiMessage,
              ]}
            >
              {item.sender === "ai" ? (
                <Markdown style={{ text: { color: "white", fontSize: 16 } }}>
                  {item.text}
                </Markdown>
              ) : (
                <Text style={styles.messageText}>{item.text}</Text>
              )}
            </View>
          )}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
        />

        {loading && (
          <Modal transparent animationType="fade">
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00C47E" />
            </View>
          </Modal>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#aaa"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={fetchAIResponse}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={fetchAIResponse}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  chatContainer: {
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  messageContainer: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 18,
    maxWidth: "75%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#00C47E",
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#444",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#00C47E",
    padding: 10,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
});
