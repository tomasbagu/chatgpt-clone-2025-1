import { View, Text, TextInput, Button, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { APIResponse } from '@/interfaces/Responses';
import { Message } from '@/interfaces/AppInterfaces';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '@/utils/FirebaseConfig';
import { firebaseTimestampToDate } from '@/utils/FirebaseToDate';

export default function chat() {

    const [id, setId] = useState(undefined as string | undefined);
    const [messages, setMessages] = useState([] as Message[]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (isLoading || messages.length == 0) return;
        if (id) {
            updateChat();
        } else {
            createChat();
        }

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

    const updateChat = async () => {
        try {
            // @ts-ignore
            const chatRef = doc(db, "chats", id);
            await updateDoc(chatRef, {
                messages
            });
        } catch (error) {
            console.log({ error })
        }
    }

    const createChat = async () => {
        try {
            const textSplit = messages[0].text.split(" ");
            const response = await addDoc(collection(db, "chats"), {
                title: textSplit.slice(0, 3).join(" "),
                create_at: new Date(),
                messages
            });
            setId(response.id);
            console.log({ response })
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
                    {messages.map((msg: Message, index: number) => (
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
                    {isLoading &&
                        <View style={{
                            marginBottom: 10,
                            backgroundColor: "#e0e0e0", padding: 10, borderRadius: 5
                        }}>
                            <Text
                                style={{
                                    color: "black",
                                }}
                            >Thinking...</Text>
                        </View>
                    }
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