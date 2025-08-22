import { View,Text,TextInput,TouchableOpacity,FlatList,KeyboardAvoidingView,Platform,Modal } from 'react-native';
import { useState } from 'react';
import { Calendar } from 'react-native-calendars';

type TaskStatus = 'not started' |'in progress' | 'completed';

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
};



export default function TaskManager() {
  return (
    <View>
      
    </View>
  )
}
