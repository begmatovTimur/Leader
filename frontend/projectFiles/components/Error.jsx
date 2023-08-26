import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Error = () => {
    return (
        <View style={styles.errorContainer}>
            <Image source={require('./../Image/error.gif')} style={styles.errorImage} />
            <Text style={styles.errorText}>Xatolik!</Text>
            <Text>Xatolikni tuzatish uchun internetga ulanganligizni tekshiring tekshiring </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    errorImage: {
        width: "110%",
        height: "50%",
    },
    errorText: {
        fontSize: 24,
        marginBottom: 10,
    },
});

export default Error;
