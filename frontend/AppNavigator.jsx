import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './projectFiles/components/Home';
import StudentDetails from './projectFiles/components/StudentDetails';
import Login from "./projectFiles/components/Login";
import Error from "./projectFiles/components/Error";
import Courses from "./projectFiles/components/Courses";
import Students from "./projectFiles/components/Students";
import Staff from "./projectFiles/components/Staff";
import StudentSubjects from "./projectFiles/components/StudentSubjects";
const Stack = createStackNavigator();

function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Tizimga kirish" component={Login}/>
            <Stack.Screen name="Leader o'quv markazi" component={Home}/>
            <Stack.Screen name="Kurslar" component={Courses}/>
            <Stack.Screen name="O'quvchilar" component={Students}/>
            <Stack.Screen name="Xodimlar" component={Staff}/>
            <Stack.Screen name="O'quvchi o'qiydigan kurs" component={StudentSubjects}/>
            <Stack.Screen name="O'quvchining to'liqroq ma'lumoti" component={StudentDetails}/>
            <Stack.Screen name="Error" component={Error}/>
        </Stack.Navigator>
    );
}

export default AppNavigator;
