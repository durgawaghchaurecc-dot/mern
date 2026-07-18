import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Trash2, 
  Edit3, 
  X, 
  Check 
} from 'lucide-react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.log('Error fetching todos', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post('/api/todos', { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.log('Error adding todo', error);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, { text: editedText });
      setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (error) {
      console.log('Error updating todo', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.log('Error deleting todo', error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todoToToggle = todos.find(todo => todo._id === id);
      const response = await axios.patch(`/api/todos/${id}`, { 
        completed: !todoToToggle.completed 
      });
      setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.log('Error toggling todo', error);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">Task Manager</h1>
        
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            required
            className="todo-input"
          />
          <button type="submit" className="btn-add">
            Add Task
          </button>
        </form>

        <div className="todo-list">
          {!Array.isArray(todos) || todos.length === 0 ? (
            <div className="empty-state">No tasks yet. Add one above!</div>
          ) : (
            todos.map((todo) => (
              <div key={todo._id} className="todo-item-wrapper">
                {editingTodo === todo._id ? (
                  <div className="edit-mode-container">
                    <input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="edit-input"
                    />
                    <div className="action-buttons">
                      <button onClick={() => saveEdit(todo._id)} className="btn-save">
                        <Check size={20} />
                      </button>
                      <button onClick={() => setEditingTodo(null)} className="btn-cancel">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="todo-item">
                    <div className="todo-content">
                      <button
                        onClick={() => toggleTodo(todo._id)}
                        className={`checkbox-circle ${todo.completed ? 'completed' : ''}`}
                      >
                        {todo.completed && <Check size={14} />}
                      </button>
                      
                      <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                        {todo.text}
                      </span>
                    </div>

                    <div className="item-actions">
                      <button onClick={() => startEditing(todo)} className="btn-edit">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => deleteTodo(todo._id)} className="btn-delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;