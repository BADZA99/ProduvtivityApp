import { View,Text,TextInput,TouchableOpacity,FlatList,KeyboardAvoidingView,Platform,Modal } from 'react-native';
import { useState } from 'react';
import { Calendar } from 'react-native-calendars';

type TaskStatus = 'not started' |'in progress' | 'completed';

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
};

// ! npx expo start --port 19001
export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  // state pour chaque attribit de la tâche
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('not started');
  const [dueDate, setDueDate] = useState < string | undefined>(undefined);
  const [editId, setEditId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Task>({
    id: '',
    title: '',
    description: '',
    status: 'not started',
    dueDate: '',
  });
  const [selectCalendarVisible, setSelectCalendarVisible] = useState(false);  
  const [viewCalendarVisible, setViewCalendarVisible] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

// * Function to save a task
  const handleSaveTask = () => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status,
      dueDate,
    };
// ? If editId is set, we update the existing task
    const updatedTask= 
      editId ? tasks.map(task => task.id === editId ? newTask : task) :
      [...tasks,
      newTask] 
// ? clear the input fields after saving
    setTasks(updatedTask);
    setTitle('');
    setDescription('');
    setStatus('not started');
    setDueDate(undefined);

  };
  // ? Function to delete a task
  const handleEditTask = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setDueDate(task.dueDate);
    setEditId(task.id);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    if (editId === taskId) {
      setTitle('');
      setDescription('');
      setStatus('not started');
      setDueDate(undefined);
      setEditId(null);
    }
  };

  const total = tasks.length;
  const completed = tasks.filter(task => task.status === 'completed').length;
  const inProgress = tasks.filter(task => task.status === 'in progress').length;
  const notStarted = tasks.filter(task => task.status === 'not started').length;

const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPercentage = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const notStartedPercentage = total > 0 ? Math.round((notStarted / total) * 100) : 0;

  const getProductivity = () => {
    const totalTasks = tasks.length;
    if (totalTasks === 0) return 0;
   if (completedPercentage >=70) return 'high';
    if (completedPercentage >= 40) return 'medium';
    return 'low';
  }
  const markedDeadlines= tasks.reduce((acc, task) => {
    if (task.dueDate) {
      acc[task.dueDate] = { marked: true, dotColor: 'red',activeOpacity: 0.5, };
    }
    return acc;
  }, {} as Record<string, { marked: boolean; dotColor: string; activeOpacity: number }>);
  return (
    <View>
      
    </View>
  )
}
