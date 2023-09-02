import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Image} from 'react-native';
import {Button, Input, SearchBar} from "@rneui/base";
import SelectDropdown from "react-native-select-dropdown"
import baseUrl from "../baseUrl/baseUrl";
import {FontAwesome} from "@expo/vector-icons";
import {blue600} from "react-native-paper/src/styles/themes/v2/colors";


const Staff = ({navigation, route}) => {
    const loginUserId = route.params
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [currentRole, setCurrentRole] = useState("")
    const [currentUserRole, setCurrentUserRole] = useState("")
    const [currentUserId, setCurrentUserId] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [roles, setRoles] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        getRoles();
        getUsers();
        checkUser();
    }, [])

    function getRoles() {
        fetch(baseUrl("role"))
            .then((resp) => resp.json())
            .then((json) => setRoles(json))
            .catch((error) => console.error(error))
    }

    function checkUser() {
        fetch(baseUrl(`users/checkUser/${loginUserId}`))
            .then((resp) => resp.json())
            .then((json) => setCurrentUserRole(json))
            .catch((error) => console.error(error))
    }

    function getUsers() {
        fetch(baseUrl("users"))
            .then((resp) => resp.json())
            .then((json) => setUsers(json))
            .catch((error) => console.error(error))
    }

    const closeModal = () => {
        setModalVisible(false)
        setCurrentUserId("")
        reset()
    }

    function saveStaff() {
            setIsLoading(true)
            if (currentUserId !== "") {
                if (username !== "" && password !== "") {
                    const staffData = {
                        username,
                        password
                    }
                    fetch(baseUrl(`users/change-data/${currentUserId}`), {
                        method: 'PATCH',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            "isAdmin": currentUserRole
                        },
                        body: JSON.stringify(staffData),
                    })
                        .then((response) => response.json())
                        .then((responseData) => {
                            if (responseData === "success") {
                                setCurrentUserId("")
                                reset()
                                getUsers()
                            } else {
                                alert("siz xodimni o'zgartira olmaysiz")
                            }
                                setModalVisible(false)
                                setIsLoading(false)
                        })
                        .catch((e) => {
                            navigation.navigate('Error');
                        });
                } else {
                    alert("bo'sh joylarni to'ldiring")
                }
            } else {
                if (username !== "" && password !== "" && phone !== "" && currentRole !== "") {
                    fetch(baseUrl("users/register"), {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username,
                            phone,
                            password,
                            roleName: currentRole
                        }),
                    })
                        .then((response) => response.json())
                        .then((responseData) => {
                            if (responseData) {
                                setModalVisible(false)
                                getUsers()
                                reset()
                            } else {
                                alert("xodim qo'shishda xatolik")
                            }
                            setIsLoading(false)
                        }).catch((e) => {
                        navigation.navigate("Error")
                    })
                } else {
                    alert("bo'sh joylarni to'ldiring")
                }
            }
    }

    function deleteStaff(id) {
        setIsLoading(true)
        fetch(baseUrl("users/" + id), {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "isAdmin": currentUserRole
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData === "success") {
                    getUsers()
                    setIsLoading(false)
                    return;
                } else if (responseData === "owner-delete-error") {
                    alert("Super adminni o'chirish mumkin emas")
                    setIsLoading(false)
                    return;
                }
                alert("mentorni o'chirish mumkin emas, chunki u boshqa kursga bog'langan")
                setIsLoading(false)
            }).catch((e) => {
            alert("error!")
            setIsLoading(false)
        })
    }


    function reset() {
        setUsername("")
        setPhone("")
        setCurrentRole("")
        setPassword("")
    }

    function editStaff(item) {
        setCurrentUserId(item.id)
        setUsername(item.username)
        setPassword(item.password)
        setModalVisible(true)
    }

    const renderRow = ({item}) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.username}</Text>
            <Text style={styles.cell}>{item.phone}</Text>
            <Text style={styles.cell}>{item.roleName}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => editStaff(item)}>
                <FontAwesome name={"pencil"} style={styles.buttonText}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteStaff(item.id)}>
                <FontAwesome name={"trash"} style={styles.buttonText}/>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>

            <Button title={"Xodim qo'shish"} onPress={() => setModalVisible(true)}/>
            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>To'liq Ismi</Text>
                <Text style={styles.headerCell}>Telefon Raqami</Text>
                <Text style={styles.headerCell}>Roli</Text>
                <Text style={styles.headerCell}></Text>
            </View>
            <FlatList
                data={users}
                renderItem={renderRow}
                keyExtractor={(item) => item.id}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Input placeholder={"Xodimning ismini kiriting"} keyboardType={"default"}

                               value={username} onChangeText={(text) => setUsername(text)}/>
                        <Input placeholder={"Xodimning parolini kiriting"} keyboardType={"password"} value={password}
                               onChangeText={(text) => setPassword(text)}/>
                        {
                            currentUserId ? "" : <>
                                <Input placeholder={"Xodimning telefon raqamini kiriting"} keyboardType={"phone-pad"}
                                       value={phone}
                                       onChangeText={(text) => setPhone(text)}/>

                                <SelectDropdown
                                    buttonStyle={{width: "100%"}}
                                    defaultButtonText={"Xodim uchun rol tanlang"}
                                    data={roles}
                                    onSelect={(selectedItem, index) => {
                                        setCurrentRole(selectedItem)
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedItem
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item
                                    }}
                                />
                            </>
                        }
                        <View style={{flexDirection: "row", paddingTop: 10}}>
                            <View>
                                <TouchableOpacity onPress={closeModal} style={{paddingRight: 10}}>
                                    <Text style={styles.closeButton}>Yopish</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Button title={"Hodimni saqlash"} onPress={() => saveStaff()}/>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={isLoading}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <Image source={require("../Image/loading-gif.gif")} style={{width: "100%", height: "30%"}}/>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff',
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#cccccc',
        paddingVertical: 5,
        backgroundColor: '#abaaaa'
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#cccccc',
        paddingVertical: 5,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize:12
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: "100%",
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    editButton: {
        backgroundColor: blue600,
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15
    },
    closeButton: {
        fontSize: 16,
        padding: 8.8,
        color: 'white',
        backgroundColor: 'red'
    },
});

export default Staff;
