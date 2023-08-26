import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, Modal} from 'react-native';
import call from 'react-native-phone-call';
import {Button, Input} from "@rneui/base";
import SelectDropdown from "react-native-select-dropdown";
import baseUrl from "../baseUrl/baseUrl";


export default function MyPage({route, navigation}) {
    const {loginUserId} = route.params
    const [changeDataModalVisible, setChangeDataModalVisible] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [currentUserRole, setCurrentUserRole] = useState("")

    useEffect(() => {
        checkUser()
    }, [])

    function checkUser() {
        fetch(baseUrl(`users/checkUser/${loginUserId}`))
            .then((resp) => resp.json())
            .then((json) => setCurrentUserRole(json))
            .catch((error) => console.error(error))
    }


    function closeModal() {
        setChangeDataModalVisible(false)
        reset()
    }

    function reset() {
        setUsername("")
        setPassword("")
    }

    function openModal() {
        setChangeDataModalVisible(true)
    }

    function saveData() {
        const newData = {
            username,
            password
        }

        fetch(baseUrl("users/change-data/"+loginUserId), {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "isAdmin": currentUserRole

            },
            body: JSON.stringify(newData),
        })
            .then((response) => response.json())
            .then((responseData) => {
                setChangeDataModalVisible(false)
                reset()
                alert("Login va parol muvaffaqiyatli o'zgartirildi!")
            }).catch((e) => {
            navigation.navigate("Error")
        })
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.navbarContainer}>
                <Image
                    source={require('../Image/liderLogo.jpg')}
                    style={styles.logo}
                    resizeMode="cover"
                />
                <Button onPress={() => openModal()}>Parolni o'zgartirish</Button>
            </View>

            <View style={styles.containerCenter}>
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => navigation.navigate("Kurslar", loginUserId)}
                                          style={styles.cardButton}>
                            <Image
                                source={require('../Image/coursesLogo.png')}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <Text style={styles.title}>Kurslar bo'limi</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => navigation.navigate("O'quvchilar", loginUserId)}
                                          style={styles.cardButton}>
                            <Image
                                source={require('../Image/studentsLogo.png')}
                                style={styles.image}
                                resizeMode="cover"

                            />
                            <Text style={styles.title} onPress={() => alert("salom")}>Studentlar bo'limi</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => navigation.navigate("Xodimlar", loginUserId)}
                                          style={styles.cardButton}>
                            <Image
                                source={require('../Image/teacher.jpg')}
                                style={styles.image}
                                resizeMode="cover"

                            />
                            <Text style={styles.title} onPress={() => alert("salom")}>Xodimlar Bo'limi</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>

            <Modal
                visible={changeDataModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Input placeholder={"Yangi login"} keyboardType={"default"} value={username}
                               onChangeText={(text) => setUsername(text)}/>
                        <Input placeholder={"Yangi parol"} keyboardType={"default"} value={password}
                               onChangeText={(text) => setPassword(text)}/>

                        <View style={{flexDirection: "row", paddingTop: 10}}>
                            <View>
                                <TouchableOpacity onPress={closeModal} style={{paddingRight: 10}}>
                                    <Text style={styles.closeButton}>Yopish</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Button title={"Ma'lumotni saqlash"} onPress={() => saveData()}/>
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f0f0',
    },
    navbarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    logo: {
        width: 100,
        height: 80,
    },
    containerCenter: {
        flex: 1,
        justifyContent: 'center', // Align cards in the center vertically
        paddingBottom: 16, // Add padding to separate navbar and cards
    },
    cardContainer: {
        flexDirection: 'column',
        justifyContent: 'center', // Align cards in the center horizontally
        // flexWrap: 'wrap',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 4,
        margin: 8,
        padding: 16,
    },
    cardButton: {
        alignItems: 'center',
    },
    image: {
        width: 180,
        height: 180,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    phoneButton: {
        backgroundColor: '#007bff', // Blue color, you can customize this
        padding: 12,
        borderRadius: 10,
        elevation: 4, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: 'center', // Center text horizontally
        justifyContent: 'center', // Center text vertically
    },
    phoneText: {
        color: '#fff', // White color for text, you can customize this
        fontSize: 18,
        fontWeight: 'bold',
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 400,
        height: 250,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    closeButton: {
        fontSize: 16,
        padding: 8.8,
        color: 'white',
        backgroundColor: 'red'
    },
});
