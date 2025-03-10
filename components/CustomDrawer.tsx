import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { View, Text, TouchableOpacity } from 'react-native'
import { ThemedView } from './ThemedView'
import { ThemedText } from './ThemedText'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { collection, getDocs } from 'firebase/firestore/lite'
import { db } from '@/utils/FirebaseConfig'
import { useRouter } from 'expo-router'

export default function CustomDrawer(props: any) {

    const [chats, setChats] = useState([] as any[]);
    const router = useRouter();

    useEffect(() => {
        getChats();
    }, []);

    useEffect(() => {
        console.log({ chats })
    }, [chats])

    const getChats = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "chats"));
            const newChats = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setChats(newChats);
        } catch (error) {
            console.log({ error })
        }
    }

    return (
        <SafeAreaView
            style={{
                flex: 1
            }}
        >
            <ThemedView style={{ flex: 1 }}>
                <DrawerContentScrollView {...props}>
                    <DrawerItem
                        label={"New Chat"}
                        onPress={() => router.navigate('/main')}
                    />
                    {
                        chats.map((item, i) => <DrawerItem
                            key={i}
                            label={item.title}
                            onPress={() => router.navigate(`/main/chat/${item.id}`)}
                        />)
                    }
                </DrawerContentScrollView>
            </ThemedView>
            <TouchableOpacity>
                <ThemedView
                    style={{
                        padding: 20,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignContent: 'center'
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <View
                            style={{
                                borderRadius: 25,
                                width: 50,
                                height: 50,
                                backgroundColor: 'red',
                                justifyContent: "center",
                                alignItems: "center",
                                alignContent: "center"
                            }}
                        >
                            <ThemedText>HC</ThemedText>
                        </View>
                        <Text style={{ color: 'white' }}>Hans Camilo Correa</Text>
                    </View>
                    <SimpleLineIcons name="options-vertical" size={24} color="white" />
                </ThemedView>
            </TouchableOpacity>
        </SafeAreaView>
    )
}