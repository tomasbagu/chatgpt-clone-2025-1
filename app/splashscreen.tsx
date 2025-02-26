import { View, Text, Button, StyleSheet } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

export default function Page() {
    return (
        <View
            style={styles.buttonStyle}
        >
            <Text>splashscreen</Text>
        </View>
    )
}

export const styles = StyleSheet.create({
    buttonStyle: {
        width: 100,
        padding: 0,
        backgroundColor: "grey"
    }
})