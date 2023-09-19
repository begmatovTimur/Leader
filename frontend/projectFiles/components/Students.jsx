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
    const [permissionForExcel, setPermissionForExcel] = useState(false)
    const [courses, setCourses] = useState([])
    const [coursesForFilter, setCoursesForFilter] = useState([])
    const [monthsForFilter, setMonthsForFilter] = useState([])
    const [students, setStudents] = useState([])
    const [selectedMonth, setSelectedMonth] = useState({id:null})
    const [selectedGroup, setSelectedGroup] = useState({id:null})
    const [excelData, setExcelData] = useState([])

    useEffect(() => {
        getCoursesName()
        getStudents()
        getExcelData()
        checkUser()
        getCoursesForFilter()
        getMonthsForFilter()
    }, [])

    function checkUser() {
        fetch(baseUrl(`users/checkUser/${loginUserId}`))
            .then((resp) => resp.json())
            .then((json) => setCurrentUserRole(json))
            .catch((error) => console.error(error))
    }

    function getStudents() {
        setSelectedMonth({name:"Oy Tanlash", id:0})
        setSelectedGroup({name:"Gurux Tanlash", id: ""})
        fetch(baseUrl("student"))
            .then((resp) => resp.json())
            .then((json) => {
                setStudents(json)
                getExcelData()
            })
            .catch((error) => console.error(error))
    }

    function getCoursesForFilter() {
        fetch(baseUrl("course/filter"))
            .then((resp) => resp.json())
            .then((json) => setCoursesForFilter(json))
            .catch((error) => console.error(error))
    }

    function getMonthsForFilter() {
        fetch(baseUrl("month"))
            .then((resp) => resp.json())
            .then((json) => setMonthsForFilter(json))
            .catch((error) => console.error(error))
    }

    function getExcelData(monthId) {
        fetch(baseUrl(`student/convertExcel?courseId=${selectedGroup.id}&monthId=${monthId}&requestRole=${currentUserRole}`))
            .then((resp) => resp.json())
            .then((json) => {
                console.log(json)
                if (json===null){
                    setPermissionForExcel(false)
                } else {
                    setPermissionForExcel(true)
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
                }
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
                            setIsLoading(false)
                            // setIsEdit(false)
                            setCurrentStudentId("")
                            reset()
                            getStudents()
                            getExcelData()
                        } else {
                            alert("siz studentni o'zgartira olmaysiz")
                            setIsLoading(false)
                        }
                    })
                    .catch((e) => {
                        navigation.navigate('Error');
                    });
            } else {
                alert("bo'sh joylarni to'ldiring")
                setIsLoading(false)
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
                        setIsLoading(false)
                        setModalVisible(false)
                        setCurrentStudentId("")
                        reset()
                        getStudents()
                        getExcelData()

                    }).catch((e) => {
                    navigation.navigate("Error")
                })
            } else {
                alert("bo'sh joylarni to'ldiring")
                setIsLoading(false)
            }
        }
    }

    const closeModal = () => {
        setModalVisible(false)
        setIsEdit(false)
        reset(undefined)
    }

    function reset(item) {
        if (item !== undefined) {
            setModalVisible(true)
            setCurrentStudentId(item.id)
            setFirstName(item.firstName)
            setLastName(item.lastName)
            setAge(item.age)
            setCourseName(item.courseName)
        } else {
            setFirstName("")
            setLastName("")
            setAge("")
            setCourseName("")
        }
    }

    function filterStudents(text) {
        setText(text)
        if (text !== "") {
            fetch(baseUrl("student/filter/" + text))
                .then((resp) => resp.json())
                .then((json) => {
                    setStudents(json)
                    getExcelData()
                })
                .catch((error) => console.error(error))
        } else {
            getStudents()
        }
    }

    const downloadExcel = async () => {
        if (permissionForExcel){
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            // Calculate and set column widths based on content width.
            const columnWidths = {};
            XLSX.utils.sheet_to_json(ws, { header: 1 }).forEach((row) => {
                row.forEach((value, columnIndex) => {
                    const cellWidth = value ? value.toString().length + 2 : 10; // Adjust the default width as needed.
                    if (!columnWidths[columnIndex] || cellWidth > columnWidths[columnIndex]) {
                        columnWidths[columnIndex] = cellWidth;
                    }
                });
            });

            // Convert column widths to XLSX format.
            const cols = Object.keys(columnWidths).map((key) => ({
                wch: columnWidths[key],
            }));

            ws['!cols'] = cols;
            const excelFileBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'base64'});

            const fileUri = `${FileSystem.cacheDirectory}studentlar ma'lumoti.xlsx`;

            await FileSystem.writeAsStringAsync(fileUri, excelFileBuffer, {
                encoding: FileSystem.EncodingType.Base64,
            });

            Sharing.shareAsync(fileUri, {mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            setExcelData([])
        } else {
            alert("siz ma'lumotlarni excel faylga o'tkazolmaysiz")
        }

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

    function changeAge(text) {
        const numericValue = text.replace(/[^0-9]/g, '');
        setAge(numericValue);
    }

    function filterStudentByAll(monthId, courseId){
        fetch(baseUrl(`student/all?courseId=${courseId}&monthId=${monthId}`))
            .then((resp) => resp.json())
            .then((json) => {
                setStudents(json)
                getExcelData(monthId)
            })
            .catch((error) => console.error(error))
    }

    const renderRow = ({item}) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("O'quvchi o'qiydigan kurs", {
                studentId: item.id,
                loginUserId,
                studentName: item.firstName + " " + item.lastName,
                registerDate:item.registerDate
            })}>
            <View style={styles.row}>
                <Text style={styles.cell}>{item.lastName}</Text>
                <Text style={styles.cell}>{item.firstName}</Text>
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
            <Button title={"Filterlarni Bekor qilish"} onPress={() => {
                getStudents()

            }}
                    buttonStyle={{backgroundColor: 'rgb(196,63,63)'}}
            />
            <View style={styles.selectFlex}>
                <SelectDropdown
                    defaultButtonText={"Gurux Tanlash"}
                    buttonStyle={{width: "50%", backgroundColor: 'rgb(89,220,23)'}}
                    data={coursesForFilter}
                    onSelect={(selectedItem, index) => {
                        setSelectedGroup(selectedItem)
                        filterStudentByAll(selectedMonth.id,selectedItem.id)

                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedGroup.name
                    }}
                    rowTextForSelection={(item, index) => {
                        return item.name
                    }}
                />
                <SelectDropdown
                    defaultButtonText={"Oy Tanlash"}
                    buttonStyle={{width: "50%", backgroundColor: 'rgb(220,193,23)'}}
                    data={monthsForFilter}
                    onSelect={(selectedItem, index) => {
                        setSelectedMonth(selectedItem)
                        filterStudentByAll(selectedItem.id, selectedGroup.id)

                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedMonth.name
                    }}
                    rowTextForSelection={(item, index) => {
                        return item.name
                    }}
                />
            </View>
            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>O'quvchi Familiyasi</Text>
                <Text style={styles.headerCell}>O'quvchi Ismi</Text>
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
                           /* isEdit ? "" :*/ <SelectDropdown
                                defaultButtonText={courseName!==""?courseName:"O'quvchi qaysi kursda o'qishini tanlang"}
                                buttonStyle={{width: "100%"}}
                                data={courses}
                                onSelect={(selectedItem, index) => {
                                    setCourseName(selectedItem)
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return courseName
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
        color: 'rgb(220,193,23)',
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
    selectFlex: {
        flexDirection: 'row'
    }
});

export default Students;
