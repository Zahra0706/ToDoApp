import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/tasks");
      setTasks(res.data);
      setError("");
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    
    try {
      const res = await axios.post("http://localhost:8080/api/tasks", { 
        title, 
        completed: false 
      });
      setTasks([...tasks, res.data]);
      setTitle("");
      setError("");
    } catch (err) {
      setError("Erreur lors de l'ajout de la tâche");
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      setError("");
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error(err);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === id);
      const res = await axios.put(`http://localhost:8080/api/tasks/${id}`, { 
        title: taskToUpdate.title, 
        completed: !completed 
      });
      setTasks(tasks.map(t => t.id === id ? res.data : t));
      setError("");
    } catch (err) {
      setError("Erreur lors de la mise à jour");
      console.error(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>My To-Do List</h1>
          <p>Organisez votre journée avec style</p>
        </header>

        <div className="input-section">
          <div className="input-container">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Que souhaitez-vous accomplir ?" 
              className="task-input"
            />
            <button onClick={addTask} className="add-btn">
              <span>Ajouter</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" fill="currentColor"></path>
              </svg>
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="tasks-container">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64">
                  <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" fill="currentColor"></path>
                </svg>
                <h3>Aucune tâche pour le moment</h3>
                <p>Ajoutez votre première tâche pour commencer</p>
              </div>
            ) : (
              <ul className="tasks-list">
                {tasks.map(task => (
                  <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                    <div 
                      className="task-checkbox"
                      onClick={() => toggleTask(task.id, task.completed)}
                    >
                      {task.completed && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                          <path d="M10.0007 15.1709L19.1931 5.97852L20.6073 7.39273L10.0007 17.9993L3.63672 11.6354L5.05093 10.2212L10.0007 15.1709Z" fill="currentColor"></path>
                        </svg>
                      )}
                    </div>
                    <span 
                      className="task-text"
                      onClick={() => toggleTask(task.id, task.completed)}
                    >
                      {task.title}
                    </span>
                    <button 
                      onClick={() => deleteTask(task.id)} 
                      className="delete-btn"
                      aria-label="Supprimer la tâche"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z" fill="currentColor"></path>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tasks.length > 0 && (
          <div className="tasks-footer">
            <p>{tasks.filter(t => t.completed).length} sur {tasks.length} tâches complétées</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
