import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

type TaskStatus = "not started" | "in progress" | "completed";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("not started");
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [editId, setEditId] = useState<string | null>(null);
  // Removed unused state
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
    const updatedTask = editId
      ? tasks.map((task) => (task.id === editId ? newTask : task))
      : [...tasks, newTask];
    // ? clear the input fields after saving
    setTasks(updatedTask);
    setTitle("");
    setDescription("");
    setStatus("not started");
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
    setTasks(tasks.filter((task) => task.id !== taskId));
    if (editId === taskId) {
      setTitle("");
      setDescription("");
      setStatus("not started");
      setDueDate(undefined);
      setEditId(null);
    }
  };

  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const inProgress = tasks.filter(
    (task) => task.status === "in progress"
  ).length;
  const notStarted = tasks.filter(
    (task) => task.status === "not started"
  ).length;

  const completedPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPercentage =
    total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const notStartedPercentage =
    total > 0 ? Math.round((notStarted / total) * 100) : 0;

  const getProductivity = () => {
    const totalTasks = tasks.length;
    if (totalTasks === 0) return 0;
    if (completedPercentage >= 70) return "high";
    if (completedPercentage >= 40) return "medium";
    return "low";
  };
  const markedDeadlines = tasks.reduce((acc, task) => {
    if (task.dueDate) {
      acc[task.dueDate] = { marked: true, dotColor: "red", activeOpacity: 0.5 };
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
      <Modal visible={selectCalendarVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day) => {
                setDueDate(day.dateString);
                setSelectCalendarVisible(false);
              }}
              markedDates={
                dueDate
                  ? { [dueDate]: { selected: true, selectedColor: "#007bff" } }
                  : {}
              }
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectCalendarVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/*  */}
      <Modal visible={viewCalendarVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.calendarContainer}>
            <Calendar markedDates={markedDeadlines} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setViewCalendarVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusButtons: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
  },
  statusButton: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#007bff",
    marginRight: 8,
    backgroundColor: "#f0f8ff",
  },
  activeStatusButton: {
    backgroundColor: "#00ff2a",
  },
  statusButtonText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  statusSelected: {
    backgroundColor: "#d0f0c0",
  },
  statusText: {
    fontSize: 12,
    color:'white'
  },
  dueDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  calendarButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  calendarButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 60,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    // fontSize:16,
  },
  list: {
    marginTop: 16,
  },
  taskList: {
    marginTop: 16,
  },
  taskCard: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    minWidth: "30%",
    maxWidth: "30%",
  },
  editButton: {
    padding: 5,
    backgroundColor: "#ffa500",
    borderRadius: 4,
    marginRight: 5,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: "#ff0000",
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  cardTitle: {
    // fontSize:16,
    fontWeight: "bold",
    // marginBottom:4,
  },
  cardDescription: {
    fontSize: 12,
    color: "#555",
    // marginBottom:4,
  },
  cardStatus: {
    fontSize: 12,
    color: "#007bff",
    marginVertical: 4,
  },
  cardDueDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop:8,
  },
  edit: {
    color: "orange",
  },
  delete: {
    color: "red",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    width: "90%",
    maxHeight: "70%",
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  viewCalendarButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#0007bff",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  viewCalendarButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  analyticsContainer: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "#e9ecef",
    borderRadius: 12,
    padding: 12,
    minWidth: 140,
    borderWidth: 1,
    borderColor: "#adb5bd",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 10,
  },
  analyticsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  analyticsText: {
    fontSize: 12,
    marginBottom: 2,
    textAlign: "center",
  },
  productivity: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
    fontWeight: "bold",
  },
  processToggle: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#6c757d",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    elevation: 4,

    zIndex: 11,
  },
  processToggleText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  dueDateButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginLeft: 10,
  },
});
