import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSeedling, FaCalendarAlt, FaStickyNote, FaChevronLeft, FaChevronRight, FaSave } from 'react-icons/fa';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [noteValue, setNoteValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('todos'); // 'todos', 'calendar', 'notes'

  // Load todos and notes from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('wulan-todos');
    const savedNotes = localStorage.getItem('wulan-notes');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save todos and notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wulan-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('wulan-notes', JSON.stringify(notes));
  }, [notes]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: selectedDate.toISOString(),
        scheduled: true
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const addNote = () => {
    if (noteValue.trim()) {
      const newNote = {
        id: Date.now(),
        text: noteValue.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes([...notes, newNote]);
      setNoteValue('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (item, type) => {
    setEditingId({ id: item.id, type });
    setEditValue(type === 'todo' ? item.text : item.text);
  };

  const saveEdit = () => {
    if (editValue.trim()) {
      if (editingId.type === 'todo') {
        setTodos(todos.map(todo =>
          todo.id === editingId.id ? { ...todo, text: editValue.trim() } : todo
        ));
      } else {
        setNotes(notes.map(note =>
          note.id === editingId.id ? { ...note, text: editValue.trim(), updatedAt: new Date().toISOString() } : note
        ));
      }
      setEditingId(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (activeTab === 'todos') {
        addTodo();
      } else if (activeTab === 'notes') {
        addNote();
      }
    }
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Calendar functions
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getTodosForDate = (date) => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      return isSameDay(parseISO(todo.dueDate), date);
    });
  };

  const formatDate = (date) => {
    return format(date, 'yyyy-MM-dd');
  };

  const calendarDays = getDaysInMonth();

  return (
    <div className="app">
      {/* Floating Flowers Background */}
      <div className="floating-flowers">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-flower"
            initial={{ y: -100, x: Math.random() * window.innerWidth }}
            animate={{
              y: window.innerHeight + 100,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <FaSeedling />
          </motion.div>
        ))}
      </div>

      <div className="container">
        <motion.div
          className="header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="title-section">
            <motion.div
              className="flower-icon"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <FaSeedling />
            </motion.div>
            <h1>To-do list nya dedek wulan yeyy</h1>
            <motion.div
              className="flower-icon"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <FaSeedling />
            </motion.div>
          </div>
          <p className="subtitle">✨ Atur tugas dedek, jadwal & catatan dedek di sini yeyy❤❤</p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="nav-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <button
            className={`nav-tab ${activeTab === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveTab('todos')}
          >
            <FaCheck /> Tugas adek yey
          </button>
          <button
            className={`nav-tab ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <FaCalendarAlt /> Kalender yeyy
          </button>
          <button
            className={`nav-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <FaStickyNote /> Catatan yeyyy
          </button>
        </motion.div>

        {/* Todos Tab */}
        {activeTab === 'todos' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="input-section">
              <div className="input-container">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tambah tugas baru yh yeyy..."
                  className="todo-input"
                />
                <input
                  type="date"
                  value={formatDate(selectedDate)}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="date-input"
                />
                <motion.button
                  onClick={addTodo}
                  className="add-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlus />
                </motion.button>
              </div>
            </div>

            <div className="todos-section">
              <AnimatePresence>
                {todos.length === 0 ? (
                  <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <FaSeedling className="empty-icon" />
                    <p>Belum ada tugas yh! Tambah tugas dulu yh yeyy❤❤❤❤</p>
                  </motion.div>
                ) : (
                  <div className="todos-list">
                    {todos.map((todo, index) => (
                      <motion.div
                        key={todo.id}
                        className={`todo-item ${todo.completed ? 'completed' : ''}`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        layout
                      >
                        {editingId?.id === todo.id && editingId?.type === 'todo' ? (
                          <div className="edit-mode">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyPress={handleEditKeyPress}
                              className="edit-input"
                              autoFocus
                            />
                            <div className="edit-buttons">
                              <motion.button
                                onClick={saveEdit}
                                className="save-button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaCheck />
                              </motion.button>
                              <motion.button
                                onClick={cancelEdit}
                                className="cancel-button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaTimes />
                              </motion.button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <motion.button
                              onClick={() => toggleTodo(todo.id)}
                              className={`checkbox ${todo.completed ? 'checked' : ''}`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {todo.completed && <FaCheck />}
                            </motion.button>
                            <div className="todo-content">
                              <span className="todo-text">{todo.text}</span>
                              {todo.dueDate && (
                                <span className="todo-date">
                                  {format(parseISO(todo.dueDate), 'dd MMM yyyy')}
                                </span>
                              )}
                            </div>
                            <div className="todo-actions">
                              <motion.button
                                onClick={() => startEdit(todo, 'todo')}
                                className="edit-button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaEdit />
                              </motion.button>
                              <motion.button
                                onClick={() => deleteTodo(todo.id)}
                                className="delete-button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaTrash />
                              </motion.button>
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="calendar-container">
              <div className="calendar-header">
                <motion.button
                  onClick={prevMonth}
                  className="calendar-nav-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronLeft />
                </motion.button>
                <h2 className="calendar-title">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <motion.button
                  onClick={nextMonth}
                  className="calendar-nav-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronRight />
                </motion.button>
              </div>

              <div className="calendar-grid">
                <div className="calendar-weekdays">
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                    <div key={day} className="weekday">{day}</div>
                  ))}
                </div>
                <div className="calendar-days">
                  {calendarDays.map((day, index) => {
                    const dayTodos = getTodosForDate(day);
                    const isCurrentDay = isToday(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    
                    return (
                      <motion.div
                        key={index}
                        className={`calendar-day ${isCurrentDay ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
                        onClick={() => setSelectedDate(day)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="day-number">{format(day, 'd')}</span>
                        {dayTodos.length > 0 && (
                          <div className="day-todos">
                            {dayTodos.slice(0, 2).map(todo => (
                              <div
                                key={todo.id}
                                className={`day-todo ${todo.completed ? 'completed' : ''}`}
                                title={todo.text}
                              >
                                {todo.text.substring(0, 10)}...
                              </div>
                            ))}
                            {dayTodos.length > 2 && (
                              <div className="more-todos">+{dayTodos.length - 2}</div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="selected-date-info">
                <h3>Tugas untuk {format(selectedDate, 'dd MMMM yyyy')}</h3>
                <div className="date-todos">
                  {getTodosForDate(selectedDate).map(todo => (
                    <div key={todo.id} className={`date-todo ${todo.completed ? 'completed' : ''}`}>
                      <span>{todo.text}</span>
                      <button onClick={() => toggleTodo(todo.id)} className="toggle-btn">
                        {todo.completed ? '✓' : '○'}
                      </button>
                    </div>
                  ))}
                  {getTodosForDate(selectedDate).length === 0 && (
                    <p className="no-tasks">Belum ada tugas yh untuk tanggal ini noooo hiks</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="input-section">
              <div className="input-container">
                <textarea
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tulis catatan adek di sini yeyy..."
                  className="note-input"
                  rows="3"
                />
                <motion.button
                  onClick={addNote}
                  className="add-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave />
                </motion.button>
              </div>
            </div>

            <div className="notes-section">
              <AnimatePresence>
                {notes.length === 0 ? (
                  <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <FaStickyNote className="empty-icon" />
                    <p>Belum ada catatan nih yh! Tulis catatan dulu yh yeyy📝</p>
                  </motion.div>
                ) : (
                  <div className="notes-list">
                    {notes.map((note, index) => (
                      <motion.div
                        key={note.id}
                        className="note-item"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        layout
                      >
                        {editingId?.id === note.id && editingId?.type === 'note' ? (
                          <div className="edit-mode">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyPress={handleEditKeyPress}
                              className="edit-textarea"
                              autoFocus
                              rows="3"
                            />
                            <div className="edit-buttons">
                              <motion.button
                                onClick={saveEdit}
                                className="save-button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaCheck />
                              </motion.button>
                              <motion.button
                                onClick={cancelEdit}
                                className="cancel-button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaTimes />
                              </motion.button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="note-content">
                              <p className="note-text">{note.text}</p>
                              <span className="note-date">
                                {format(parseISO(note.createdAt), 'dd MMM yyyy HH:mm')}
                              </span>
                            </div>
                            <div className="note-actions">
                              <motion.button
                                onClick={() => startEdit(note, 'note')}
                                className="edit-button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaEdit />
                              </motion.button>
                              <motion.button
                                onClick={() => deleteNote(note.id)}
                                className="delete-button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaTrash />
                              </motion.button>
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        {(todos.length > 0 || notes.length > 0) && (
          <motion.div
            className="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>
              {todos.filter(t => t.completed).length} dari {todos.length} tugas selesai yeyyy • {notes.length} catatan yeyyy
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
