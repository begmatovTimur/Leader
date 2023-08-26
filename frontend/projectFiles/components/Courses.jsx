import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Image} from 'react-native';
import {Button, Input} from "@rneui/base";
import SelectDropdown from "react-native-select-dropdown";
import baseUrl from "../baseUrl/baseUrl";
import {FontAwesome} from "@expo/vector-icons";
import {blue600} from "react-native-paper/src/styles/themes/v2/colors";


const Courses = ({navigation, route}) => {
    const loginUserId = route.params
    const [currentMentorName, setCurrentMentorName] = useState("")
    const [courseName, setCourseName] = useState("")
    const [coursePrice, setCoursePrice] = useState("")
    const [currentUserRole, setCurrentUserRole] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [mentors, setMentors] = useState([])
    const [courses, setCourses] = useState([])

    useEffect(() => {
        getMentors()
        getCourses()
        checkUser()
    }, [])

    function checkUser() {
        fetch(baseUrl(`users/checkUser/${loginUserId}`))
            .then((resp) => resp.json())
            .then((json) => setCurrentUserRole(json))
            .catch((error) => console.error(error))
    }

    function getMentors() {
        fetch(baseUrl("users/mentors"))
            .then((resp) => resp.json())
            .then((json) => setMentors(json))
            .catch((error) => console.error(error))
    }

    function getCourses() {
        fetch(baseUrl("course"))
            .then((resp) => resp.json())
            .then((json) => setCourses(json))
            .catch((error) => console.error(error))
    }

    function saveCourse() {
        if (currentMentorName !== "" && courseName !== "" && coursePrice !== "") {
            setIsLoading(true)
            fetch(baseUrl("course"), {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: courseName,
                    price: coursePrice,
                    teacherName: currentMentorName
                }),
            })
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData) {
                        setModalVisible(false)
                        getCourses()
                        reset()
                    } else {
                        alert("kurs qo'shishda xatolik yuz berdi")
                    }
                    setIsLoading(false)
                }).catch((e) => {
                navigation.navigate("Error")
            })
        } else {
            alert("bo'sh joylarni to'ldiring!")
        }
    }

    const closeModal = () => {
        setModalVisible(false)
        reset()
    }

    function reset() {
        setCourseName("")
        setCoursePrice("")
        setCurrentMentorName("")
    }

    function deleteCourse(id) {
        setIsLoading(true)
        fetch(baseUrl("course/" + id), {
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
                    getCourses()
                } else {
                    alert("siz kursni o'chira olmaysiz, chunki bu kurs boshqa studentga bog'liq yoki sizga qo'shishdan tashqari hamma narsa uchun ruxsat o'chirilgan!")
                }
                setIsLoading(false)
            }).catch((e) => {
            alert("siz kursni o'chira olmaysiz, chunki bu kurs boshqa studentga bog'liq yoki sizga qo'shishdan tashqari hamma narsa uchun ruxsat o'chirilgan!")
            setIsLoading(false)
        })
    }

    const renderRow = ({item}) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.price}</Text>
            <Text style={styles.cell}>{item.teacherName}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCourse(item.id)}>
                <FontAwesome name={"trash"} style={styles.buttonText}/>
            </TouchableOpacity>
        </View>
    );


    function changeCoursePrice(text) {
        const numericValue = text.replace(/[^0-9]/g, '');
        setCoursePrice(numericValue)
    }

    return (
        <View style={styles.container}>
            <Button title={"Kurs qo'shish"} onPress={() => setModalVisible(true)}/>
            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Kurs Nomi</Text>
                <Text style={styles.headerCell}>Kurs Narxi</Text>
                <Text style={styles.headerCell}>Mentor</Text>
                <Text style={styles.headerCell}>Tools</Text>
            </View>
            <FlatList
                data={courses}
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
                        <Input placeholder={"Kurs nomini kiriting"} keyboardType={"default"} value={courseName}
                               onChangeText={(text) => setCourseName(text)}/>
                        <Input placeholder={"Kurs narxini kiriting"} keyboardType={"default"} value={coursePrice}
                               onChangeText={(text) => changeCoursePrice(text)}/>
                        <SelectDropdown
                            defaultButtonText={"Kurs mentorini tanlang tanlang"}
                            data={mentors}
                            onSelect={(selectedItem, index) => {
                                setCurrentMentorName(selectedItem)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem
                            }}
                            rowTextForSelection={(item, index) => {
                                return item
                            }}
                            buttonStyle={{width: "100%"}}
                        />
                        <View style={{flexDirection: "row", paddingTop: 10}}>
                            <View>
                                <TouchableOpacity onPress={closeModal} style={{paddingRight: 10}}>
                                    <Text style={styles.closeButton}>Yopish</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Button title={"Kursni saqlash"} onPress={() => saveCourse()}/>
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
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20
    },
    closeButton: {
        fontSize: 16,
        padding: 8.8,
        color: 'white',
        backgroundColor: 'red'
    },
});

export default Courses;
