import {Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React, {createContext, useEffect, useState} from 'react'
import {Button, Card, CheckBox, Input} from "@rneui/base";
import baseUrl from "../baseUrl/baseUrl";


export default function StudentDetailsPage({route, navigation}) {
    const {studentId, registerDate, courseId, loginUserId, studentName} = route.params
    const [studentCourse, setStudentCourse] = useState([])
    const [currentMonthId, setCurrentMonthId] = useState("")
    const [currentUserRole, setCurrentUserRole] = useState("")
    const [payAmount, setPayAmount] = useState(0)
    const [payIndex, setPayIndex] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        getStudentCourse()
        checkUser()
    }, [])

    function checkUser() {
        fetch(baseUrl(`users/checkUser/${loginUserId}`))
            .then((resp) => resp.json())
            .then((json) => setCurrentUserRole(json))
            .catch((error) => console.error(error))
    }

    function getStudentCourse() {
        fetch(baseUrl(`student/timeTable/${courseId}/${studentId}`))
            .then((resp) => resp.json())
            .then((json) => setStudentCourse(json))
            .catch((error) => console.error(error))
    }

    function viewModal(id) {
        setCurrentMonthId(id)
        setModalVisible(true)
    }

    function closeModal() {
        setModalVisible(false)
        reset()
    }

    function payForCourse() {
        fetch(baseUrl(`course/coursePayment/${currentMonthId}`), {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "isAdmin": currentUserRole
            },
            body: JSON.stringify(
                {
                    payAmount,
                    payIndex,
                    adminId: loginUserId
                }
            ),
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData === "success") {
                    setModalVisible(false)
                    getStudentCourse()
                    reset()
                } else if (responseData === "error") {
                    alert("to'lovda xatolik");
                    setPayIndex(null)
                }
            })
            .catch((e) => {
                navigation.navigate('Error');
            });
    }

    function changeActiveStudent(studentActive, monthId) {
        const active = !studentActive
        fetch(baseUrl(`student/active/${monthId}`), {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                active
            ),
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData) {
                    setModalVisible(false)
                    getStudentCourse()
                    reset()
                } else {
                    alert("student holatini o'zgartirishda xatolik");
                }
            })
            .catch((e) => {
                navigation.navigate('Error');
            });
    }

    function reset() {
        setPayAmount(0)
    }

    function changePaymentAmount(text) {
        const numericValue = text.replace(/[^0-9]/g, '');
        setPayAmount(numericValue)
    }

    function changePaymentIndex(text) {
        const numericValue = text.replace(/[^0-9]/g, '');
        setPayIndex(numericValue)
    }

    return (
        <ScrollView>
            <View style={{overflowY: "auto"}}>
                <Text style={styles.title}>{studentName}</Text>
                <Text style={styles.description}>{registerDate}</Text>
                {
                    studentCourse.map(item => <Card containerStyle={styles.cardContainer}>
                        <Card.Title style={styles.monthName}>{item.monthName}</Card.Title>
                        <Card.Divider/>
                        <Text style={styles.activeText}>O'quvchining holati</Text>
                        <View
                            style={{
                                position: "relative",
                                alignItems: "center"
                            }}
                        >
                            <CheckBox
                                checked={item.paymentAmount > 0 || item.active}
                                onPress={() => changeActiveStudent(item.active, item.id)}
                            />

                            <Text style={styles.payAmount}>To'lov Qiymati: {item.paymentAmount}</Text>
                            <Text style={styles.payDate}>To'lov Sanasi: {item.payedAt}</Text>
                            <Button onPress={() => viewModal(item.id)} buttonStyle={styles.payButton}>
                                Oy uchun to'lov qilish
                            </Button>
                        </View>
                    </Card>)
                }

                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Input placeholder={"To'lov miqdorini kiriting"} keyboardType={"default"}
                                   value={payAmount}
                                   onChangeText={(text) => changePaymentAmount(text)}/>
                            <Input placeholder={"To'lov indeksini kiriting"} keyboardType={"default"}
                                   value={payIndex}
                                   onChangeText={(text) => changePaymentIndex(text)}/>

                            <View style={{flexDirection: "row", paddingTop: 10}}>
                                <View>
                                    <TouchableOpacity onPress={closeModal} style={{paddingRight: 10}}>
                                        <Text style={styles.closeButton}>Yopish</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Button title={"Kurs uchun to'lov qilish"} onPress={() => payForCourse()}
                                    />
                                </View>
                            </View>

                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    monthName: {
        fontSize: 20
    },
    cardContainer: {
        paddingBottom: 100,
        borderRadius: 30
    },
    title: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        color: "red"
    },
    description: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: "blue"
    },
    activeText: {
        fontSize: 20,
        textAlign: "center"
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
    payAmount: {
        fontSize: 30,
        fontWeight: "bold",
        color: "red"
    },
    payDate: {
        fontSize: 20,
        fontWeight: "bold",
        color: "blue",
        marginBottom: 20
    },
    payButton: {
        width: 200,
        height: 50,
        borderRadius: 30,
        textAlign: "center"
    }
})