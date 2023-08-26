import {StyleSheet, Text, TextInput, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import baseUrl from "../baseUrl/baseUrl";
import {Button} from "@rneui/base";

export default function StudentSubjects({route, navigation}) {
    const {studentId, loginUserId} = route.params
    const [courses, setCourses] = useState([])

    useEffect(()=>{
        fetch(baseUrl("student/course/"+studentId))
            .then((resp) => resp.json())
            .then((json) => setCourses(json))
            .catch((error) => console.error(error))
    },[])

    return (
        <View style={styles.container}>
            {
                courses.map(item=><Button onPress={()=>navigation.navigate("O'quvchining to'liqroq ma'lumoti", {studentId, courseId:item.id, loginUserId})}>{item.name}</Button>)
            }
        </View>
    )
}

const styles = StyleSheet.create({
   container: {

   }
});