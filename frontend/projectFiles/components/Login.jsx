import React, {createContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView, Modal} from 'react-native';
import {Button} from '@rneui/base';
import baseUrl from '../baseUrl/baseUrl';
import {FontAwesome} from '@expo/vector-icons';

const Login = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(true)

    useEffect(()=>{
        setModalVisible(true)
    },[])

    function loginUser() {
        let data = {
            username,
            password,
        };
        setIsLoading(true)
        fetch(baseUrl('users/login'), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData)
                if (responseData === "topilmadi") {
                    alert("login yoki parol xato")
                } else {
                    navigation.navigate("Leader o'quv markazi", {loginUserId: responseData});
                }
                setIsLoading(false)
                setModalVisible(false)
            }).catch((e)=>{
                navigation.navigate("Error")
                setIsLoading(false)
        })
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.container}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.loginTitle}>Tizimga kirish</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="foydalanuvchi nomini yozing"
                                value={username}
                                onChangeText={(text) => setUsername(text)}
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={styles.passwordInput}

                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity style={styles.eyeIconContainer} onPress={toggleShowPassword}>
                                <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#333"/>
                            </TouchableOpacity>
                        </View>
                        {
                            isLoading ?
                                <TouchableOpacity style={styles.loginButton}>
                                    <Image source={require('../Image/loading-gif-for-button.gif')} style={{width: 20, height: 20}}/>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={styles.loginButton} onPress={() => loginUser()}>
                                    <Text style={styles.buttonText}>Login</Text>
                                </TouchableOpacity>
                        }

                    </View>
                </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: '40%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 400,
        height: 300,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    loginTitle: {
        fontSize: 40,
        textAlign: 'center',
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        marginTop:10,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    passwordInputContainer: {
        width:'80%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    passwordInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#333',
    },
    eyeIconContainer: {
        padding: 10,
    },
});

export default Login;
