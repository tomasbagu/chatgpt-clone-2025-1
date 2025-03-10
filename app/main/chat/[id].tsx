import { View, Text, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Platform, SafeAreaView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { db } from '@/utils/FirebaseConfig';
import { APIResponse } from '@/interfaces/Responses';
import { firebaseTimestampToDate } from '@/utils/FirebaseToDate';
import Markdown from 'react-native-markdown-display';
import { DataContext } from '@/context/dataContext/DataContext';

export default function chat() {

    const { id } = useLocalSearchParams();
    const [messages, setMessages] = useState([] as any[]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const { updateChat } = useContext(DataContext)

    useEffect(() => {
        getChat();
    }, []);

    useEffect(() => {
        if (isLoading || messages.length == 0) return;
        updateChat(id, messages);
    }, [isLoading]);

    const sendMessage = async () => {
        try {
            setMessages(prev => [...prev, { text: input, sender_by: "Me", date: new Date(), state: "received" }]);
            setInput("");
            setIsLoading(true);
            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD6k0pj66yV18n74uzl92byX3gHcRIFMk8", {
                method: "POST",
                body: JSON.stringify({
                    "contents": [{
                        "parts": [{ "text": `${input}` }]
                    }]
                })
            });
            const data: APIResponse = await response.json();
            setMessages(prev => [...prev, { text: data?.candidates[0]?.content?.parts[0]?.text, sender_by: "Bot", date: new Date(), state: "received" }]);
        } catch (error) {
            console.log("Error:", { error })
        } finally {
            setIsLoading(false);
        }
    }

    const getChat = async () => {
        try {
            // @ts-ignore
            const chatRef = doc(db, "chats", id);
            const docSnap = await getDoc(chatRef);
            setMessages(docSnap.data()?.messages)
        } catch (error) {
            console.log("Error: ", { error })
        }
    }

    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
                style={{ flex: 1 }}
            >
                <ScrollView style={{ flex: 1, padding: 10 }}>
                    {messages.map((msg: any, index: number) => (
                        <View key={index} style={{
                            marginBottom: 10,
                            backgroundColor: msg.sender_by == "Me" && "#e0e0e0", padding: 10, borderRadius: 5
                        }}>
                            <Markdown
                                style={{
                                    text: {
                                        color: msg.sender_by != "Me" && "white",
                                    },
                                }}
                            >{msg?.text}</Markdown>
                            <Text
                                style={{
                                    color: msg.sender_by != "Me" && "white",
                                }}
                            >{firebaseTimestampToDate(msg?.date).toLocaleString()}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    borderTopEndRadius: 25,
                    borderTopStartRadius: 25,
                    backgroundColor: '#e0e0e0'
                }}>
                    <TextInput
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: "#151718",
                            borderRadius: 20,
                            paddingHorizontal: 10,
                            height: 40,
                        }}
                        placeholderTextColor={"#151718"}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Escribe un mensaje..."
                    />
                    <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10 }}>
                        <Ionicons name="send" size={24} color="#151718" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}