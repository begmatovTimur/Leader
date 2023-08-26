import React, {useEffect, useState} from 'react';
import {FlatList, Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button, Input, SearchBar} from "@rneui/base";
import SelectDropdown from "react-native-select-dropdown";
import {FontAwesome} from '@expo/vector-icons';
import baseUrl from "../baseUrl/baseUrl";
import {blue600} from "react-native-paper/src/styles/themes/v2/colors";
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const Students = ({route, navigation}) => {
    const loginUserId = route.params
    const [text, setText] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [age, setAge] = useState("")
    const [courseName, setCourseName] = useState("")
    const [currentStudentId, setCurrentStudentId] = useState("")
    const [currentUserRole, setCurrentUserRole] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [courses, setCourses] = useState([])
    const [students, setStudents] = useState([])
    const [excelData, setExcelData] = useState([])

    useEffect(() => {
        getCoursesName()
        getStudents()
        getExcelData()
        checkUser()
    }, [])

    function checkUser() {
        fetch(baseUrl(`users/checkUser/${loginUserId}`))
            .then((resp) => resp.json())
            .then((json) => setCurrentUserRole(json))
            .catch((error) => console.error(error))
    }

    function getStudents() {
        fetch(baseUrl("student"))
            .then((resp) => resp.json())
            .then((json) => setStudents(json))
            .catch((error) => console.error(error))
    }

    function getExcelData() {
        fetch(baseUrl("student/convertExcel"))
            .then((resp) => resp.json())
            .then((json) => {
                const studentExcelData = []
                json.forEach(student => {
                    const {firstName, lastName, age, payments} = student;
                    const studentPayments = JSON.parse(payments);
                    const row = {'First Name': firstName, 'Last Name': lastName, 'Age': age};
                    studentPayments.forEach(payment => {
                        row[payment.month] = payment.amount;
                    });
                    studentExcelData.push(row);
                });

                setExcelData(studentExcelData)
            })
            .catch((error) => console.error(error))
    }

    function getCoursesName() {
        fetch(baseUrl("course/courses"))
            .then((resp) => resp.json())
            .then((json) => setCourses(json))
            .catch((error) => console.error(error))
    }

    function saveStudent() {
        const studentData = {
            firstName,
            lastName,
            age,
            courseName
        }
        setIsLoading(true)
        if (currentStudentId !== "") {
            if (firstName !== "" && lastName !== "" && age !== "") {
                fetch(baseUrl(`student/${currentStudentId}`), {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        "isAdmin": currentUserRole
                    },
                    body: JSON.stringify(studentData),
                })
                    .then((response) => response.json())
                    .then((responseData) => {
                        if (responseData === "success") {
                            setModalVisible(false)
                            reset()
                            setCurrentStudentId("")
                            getStudents()
                            getExcelData()
                            setIsLoading(false)
                            setIsEdit(false)
                        } else {
                            alert("siz studentni o'zgartira olmaysiz")
                        }
                    })
                    .catch((e) => {
                        navigation.navigate('Error');
                    });
            } else {
                alert("bo'sh joylarni to'ldiring")
            }
        } else {
            if (firstName !== "" && lastName !== "" && age !== "" && courseName !== "") {
                fetch(baseUrl("student"), {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "isAdmin": currentUserRole

                    },
                    body: JSON.stringify(studentData),
                })
                    .then((response) => response.json())
                    .then((responseData) => {
                        setModalVisible(false)
                        getStudents()
                        setCurrentStudentId("")
                        reset()
                        setIsLoading(false)

                    }).catch((e) => {
                    navigation.navigate("Error")
                })
                getExcelData()
            } else {
                alert("bo'sh joylarni to'ldiring")
            }
        }
    }

    const closeModal = () => {
        setModalVisible(false)
        setIsEdit(false)
        reset(undefined)
    }

    function reset(item) {
        setCourseName("")
        if (item !== undefined) {
            setModalVisible(true)
            setCurrentStudentId(item.id)
            setFirstName(item.firstName)
            setLastName(item.lastName)
            setAge(item.age)
        } else {
            setFirstName("")
            setLastName("")
            setAge("")
        }
    }

    function filterStudents(text) {
        setText(text)
        if (text !== "") {
            fetch(baseUrl("student/filter/" + text))
                .then((resp) => resp.json())
                .then((json) => setStudents(json))
                .catch((error) => console.error(error))
        } else {
            getStudents()
        }
    }

    const downloadExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const excelFileBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'base64'});

        const fileUri = `${FileSystem.cacheDirectory}studentlar ma'lumoti.xlsx`;

        await FileSystem.writeAsStringAsync(fileUri, excelFileBuffer, {
            encoding: FileSystem.EncodingType.Base64,
        });

        Sharing.shareAsync(fileUri, {mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        setExcelData([])
    };

    function deleteStudent(id) {
        setIsLoading(true)
        fetch(baseUrl("student/" + id), {
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
                    getStudents()
                    getExcelData()
                } else {
                    alert("siz studentni o'chira olmaysiz")
                }
                setIsLoading(false)
            })
    }

    function editStudent(item) {
        reset(item)
        setIsEdit(true)
    }

    const renderRow = ({item}) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("O'quvchi o'qiydigan kurs", {studentId: item.id, loginUserId})}>
            <View style={styles.row}>
                <Text style={styles.cell}>{item.firstName}</Text>
                <Text style={styles.cell}>{item.lastName}</Text>
                <Text style={styles.cell}>{item.age}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteStudent(item.id)}>
                    <FontAwesome name={"trash"} style={styles.buttonText}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={() => editStudent(item)}>
                    <FontAwesome name={"pencil"} style={styles.buttonText}/>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );


    function changeAge(text) {
        const numericValue = text.replace(/[^0-9]/g, '');
        setAge(numericValue);
    }

    return (
        <View style={styles.container}>
            <SearchBar
                onChangeText={(text) => filterStudents(text)}
                value={text}
                round={true}
                searchIcon={{size: 24}}
                placeholder={"ism/familiya bo'yicha qidirish..."}

            />

            <SafeAreaView>
                <Button title={"excel faylga o'girish"} color={"warning"} onPress={() => downloadExcel()}/>
            </SafeAreaView>
            <Button title={"O'quvchi qo'shish"} onPress={() => setModalVisible(true)}/>
            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>O'quvchi Ismi</Text>
                <Text style={styles.headerCell}>O'quvchi Familiyasi</Text>
                <Text style={styles.headerCell}>O'quvchi Yoshi</Text>
                <Text style={styles.headerCell}>Qurilmalar</Text>
            </View>
            <FlatList
                data={students}
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
                        <Input placeholder={"O'quvchi ismini kiriting"} keyboardType={"default"} value={firstName}
                               onChangeText={(text) => setFirstName(text)}/>
                        <Input placeholder={"O'quvchi familiyasini kiriting"} keyboardType={"default"}
                               value={lastName}
                               onChangeText={(text) => setLastName(text)}/>
                        <Input placeholder={"O'quvchi yoshini kiriting"} keyboardType={"default"} value={age}
                               onChangeText={(text) => changeAge(text)}/>
                        {
                            isEdit ? "" : <SelectDropdown
                                defaultButtonText={"O'quvchi qaysi kursda o'qishini tanlang"}
                                buttonStyle={{width: "100%"}}
                                data={courses}
                                onSelect={(selectedItem, index) => {
                                    setCourseName(selectedItem)
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item
                                }}
                            />
                        }

                        <View style={{flexDirection: "row", paddingTop: 10}}>
                            <View>
                                <TouchableOpacity onPress={closeModal} style={{paddingRight: 10}}>
                                    <Text style={styles.closeButton}>Yopish</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Button title={"Studentni saqlash"} onPress={() => saveStudent()}/>
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
        display: "flex",
        alignItems: "center",
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
        height: 350,
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
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    editButton: {
        backgroundColor: blue600,
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20
    },
});

export default Students;
