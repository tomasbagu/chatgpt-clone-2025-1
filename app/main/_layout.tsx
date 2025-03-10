import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import CustomDrawer from '@/components/CustomDrawer';

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={CustomDrawer}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        drawerLabel: 'New Chat',
                        title: 'ChatGPT',
                    }}
                />
                <Drawer.Screen
                    name={`chat/[id]`}
                    options={{
                        drawerLabel: `CurrentChat`,
                        title: 'ChatGPT',
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
