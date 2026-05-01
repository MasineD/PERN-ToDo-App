import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdModeEditOutline } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import './index.css';

const App = () => {
  // States for the form data
  const [description, setDescription] = useState('');
  const [editTodo, setEditTodo] = useState(null);   //Actual task which is being edited
  const [editedText, setEditedText] = useState('');   //Text for the task which is being edited
  const [todos, setTodos] = useState([]);   //All the tasks will be stored in this state

  // Function to create a new task
  const handleSubmit = async (e) => {
    e.preventDefault();   //Preventing the default form submission behavior
    try {
      await axios.post('http://localhost:5000/todos', {   //Creating a new task in the database
        description, completed: false 
      });
      setDescription('');  // Clear the input field after successful submission
      fetchTodos();  // Fetch the updated list of tasks after adding a new task
    } catch (error) {
      console.error('Error creating todo:', error.message);
    }
  };

  // Function to fetch all tasks from the database
  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/todos');    //Get all tasks
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error.message);
    }
  };
  
  // Making use of the useEffect hook to fetch all tasks when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);   //Running the effect only once when the component mounts

  // Function to update a task
  const handleUpdate = async (id) => {
    try {
      const currentTodo = todos.find((t) => t.id === id);  //Finding the task to be updated
      const trimmedText = editedText.trim();  // Trimming the edited text to remove leading and trailing whitespace
      if (currentTodo === trimmedText) {
        window.alert('Task description cannot be empty. Please enter a valid description.');  // Alerting the user if the edited text is empty after trimming
        setEditTodo(null);  // Exiting the edit mode if the edited text is empty
        setEditedText('');  // Clearing the edited text state
        return;  // Exit the function without making an API call if the edited text is empty
      }
      await axios.put(`http://localhost:5000/todos/${id}`, { description: editedText });  //Updating the task in the database
      setEditTodo(null);   //Exiting the edit mode after successful update
      setEditedText('');   //Clearing the edited text state
      fetchTodos();  // Fetch the updated list of tasks after updating a task
    } catch (error) {
      console.error('Error updating todo:', error.message);
    }
  };
  
  // Function to delete a task
  const handleDelete = async (id) => {
    try {
      let confirmation = window.confirm('Are you sure you want to delete this task?');  //Confirmation before deleting a task
      if (!confirmation) return;  //If the user cancels the deletion, exit the function
      await axios.delete(`http://localhost:5000/todos/${id}`);  //Deleting the task from the database
      fetchTodos();  // Fetch the updated list of tasks after deleting a task
    } catch (error) {
      console.error('Error deleting todo:', error.message);
    }
  };

  // Function to mark a task as completed
  const handleToggleComplete = async (id) => {
    try {
      const todo = todos.find((t) => t.id === id);  //Finding the task to be toggled
      await axios.put(`http://localhost:5000/todos/${id}`, { 
        description: todo.description,
        completed: !todo.completed 
      });  //Toggling the completed status of the task in the database
      fetchTodos();  // Fetch the updated list of tasks after toggling the completed status of a task
    } catch (error) {
      console.error('Error toggling todo completion:', error.message);
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-center">
          <h1 className="text-white font-bold text-3xl mb-1">PERN TODO APP</h1>
          <p className="text-indigo-100 text-sm">Manage your tasks with deep focus.</p>
        </div>
        
        {/* Add Task Form */}
        <div className="px-6 pt-6 pb-2">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter task description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
            <button 
              type="submit" 
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium shadow-sm hover:shadow-md"
            >
              ADD TASK
            </button>
          </form>
        </div>
        
        {/* Tasks List */}
        <div className="px-6 pb-6 pt-4">
          {todos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No tasks available. Add one above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div key={todo.id} className="bg-gray-50 rounded-xl p-3 hover:shadow-md transition-shadow border border-gray-100">
                  {editTodo === todo.id ? (
                    // Edit Mode
                    <div>
                      <input 
                        type="text" 
                        value={editedText} 
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-2"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdate(todo.id)} 
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition duration-200"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditTodo(null)} 
                          className="bg-gray-400 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-500 transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Checkbox Circle */}
                        <button 
                          onClick={() => handleToggleComplete(todo.id)} 
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            todo.completed 
                              ? 'bg-indigo-600 border-indigo-600' 
                              : 'border-gray-400 hover:border-indigo-500'
                          }`}
                        >
                          {todo.completed && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        {/* Task Description */}
                        <span className={`text-gray-700 break-words ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                          {todo.description}
                        </span>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 ml-2">
                        <button 
                          className="text-indigo-600 hover:text-indigo-800 p-1 transition-colors"
                          onClick={() => {
                            setEditTodo(todo.id);
                            setEditedText(todo.description);
                          }}
                        >
                          <MdModeEditOutline size={18} />
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700 p-1 transition-colors" 
                          onClick={() => handleDelete(todo.id)}
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;