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
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {total > 0 && (
          <TouchableOpacity
            style={styles.processToggle}
            onPress={() => setShowAnalytics(!showAnalytics)}
          >
            <Text style={styles.processToggleText}>
              {showAnalytics ? "Hide Analytics" : "Show Analytics"}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.header}>Task Manager</Text>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Task Description"
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.statusContainer}>
          <View style={styles.statusButtons}>
            {["not started", "in progress", "completed"].map((statusOption) => (
              <TouchableOpacity
                key={statusOption}
                style={[
                  styles.statusButton,
                  status === statusOption && styles.activeStatusButton,
                ]}
                onPress={() => setStatus(statusOption as TaskStatus)}
              >
                <Text style={styles.statusButtonText}>{statusOption}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.dueDateContainer}>
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            Due Date {dueDate ? dueDate : "none"}
          </Text>

          <TouchableOpacity
            style={styles.dueDateButton}
            onPress={() => setSelectCalendarVisible(true)}
          >
            <Text style={styles.calendarButtonText}>Select due Date</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
          <Text style={styles.saveButtonText}>
            {editId ? "Update Task" : "add Task"}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.taskList}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text style={styles.cardStatus}>Status: {item.status}</Text>
              {item.dueDate && (
                <Text style={styles.cardDueDate}>
                  Due {item.dueDate ? item.dueDate : "no deadline"}
                </Text>
              )}
              <View style={styles.cardButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditTask(item)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTask(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {showAnalytics && total > 0 && (
          <View style={styles.analyticsContainer}>
            <Text style={styles.analyticsTitle}>Analytics</Text>
            <Text style={styles.analyticsText}>Total Tasks: {total}</Text>
            <Text style={styles.analyticsText}>
              Completed: {completed} ({completedPercentage}%)
            </Text>
            <Text style={styles.analyticsText}>
              In Progress: {inProgress} ({inProgressPercentage}%)
            </Text>
            <Text style={styles.analyticsText}>
              Not Started: {notStarted} ({notStartedPercentage}%)
            </Text>
            <Text
              style={[
                styles.productivity,
                {
                  color:
                    getProductivity() === "high"
                      ? "green"
                      : getProductivity() === "medium"
                      ? "orange"
                      : "red",
                  fontWeight: "bold",
                },
              ]}
            >
              Productivity Level: {getProductivity()}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.viewCalendarButton}
          onPress={() => setViewCalendarVisible(true)}
        >
          <Text style={styles.viewCalendarButtonText}>View Calendar</Text>
        </TouchableOpacity>
        
      </KeyboardAvoidingView>
    </>
  );
}




