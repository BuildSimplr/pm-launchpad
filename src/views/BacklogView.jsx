import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Calendar,
  AlertTriangle,
  Clock,
  ListTodo,
  Pencil,
  Trash2,
  X,
  GripVertical,
  Target
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { logActivity } from '../utils/activityLogger';
import {
  DragDropContext,
  Droppable,
  Draggable
} from 'react-beautiful-dnd';

const LOCAL_STORAGE_KEY = 'pmLite_backlog_tasks';
const OKR_STORAGE_KEY = 'pmLite_okrs';

const EFFORT_OPTIONS = ['XS', 'S', 'M', 'L', 'XL'];
const TAG_OPTIONS = ['Feature', 'Bug', 'Tech Debt', 'Research', 'Design', 'Documentation'];

const defaultTasks = [
  { id: 1, title: 'Set up CI pipeline', description: 'Configure GitHub Actions for automated testing and deployment', status: 'To Do', priority: 'High', due: '2025-02-15', effort: 'M', tags: ['Tech Debt'] },
  { id: 2, title: 'Fix login bug', description: 'Users unable to login with special characters in password', status: 'In Progress', priority: 'Medium', due: '2025-01-10', effort: 'S', tags: ['Bug'] },
  { id: 3, title: 'Write test cases', description: 'Add unit tests for authentication module', status: 'To Do', priority: 'Low', due: '2025-02-28', effort: 'L', tags: ['Tech Debt'] },
  { id: 4, title: 'Deploy to staging', description: 'Push latest build to staging environment', status: 'Done', priority: 'High', due: '2025-01-05', effort: 'XS', tags: ['Feature'] },
];

const BacklogBoard = () => {
  // Initialize state directly from localStorage to avoid race condition
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : defaultTasks;
      // Migrate old tasks to include new fields
      return parsed.map(task => ({
        ...task,
        description: task.description || '',
        effort: task.effort || 'M',
        tags: task.tags || [],
        okrId: task.okrId || null
      }));
    } catch {
      return defaultTasks;
    }
  });

  // Load OKRs for linking
  const [okrs, setOkrs] = useState(() => {
    try {
      const stored = localStorage.getItem(OKR_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    due: '',
    status: 'To Do',
    effort: 'M',
    tags: [],
    okrId: null
  });
  const [editId, setEditId] = useState(null);
  const columns = ['To Do', 'In Progress', 'Done'];

  // Refresh OKRs when modal opens (in case they changed)
  useEffect(() => {
    if (showModal) {
      try {
        const stored = localStorage.getItem(OKR_STORAGE_KEY);
        setOkrs(stored ? JSON.parse(stored) : []);
      } catch {
        setOkrs([]);
      }
    }
  }, [showModal]);

  // Helper to get OKR by ID
  const getOkrById = (id) => okrs.find(okr => okr.id === id);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'Done').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const todo = tasks.filter(t => t.status === 'To Do').length;
    const highPriority = tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length;
    const overdue = tasks.filter(t => {
      if (t.status === 'Done' || !t.due) return false;
      return new Date(t.due) < new Date();
    }).length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, todo, highPriority, overdue, completionRate };
  }, [tasks]);

  // Get due date status
  const getDueStatus = (due, status) => {
    if (status === 'Done' || !due) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(due);
    const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) return { label: 'Overdue', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle };
    if (daysUntil === 0) return { label: 'Due today', color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock };
    if (daysUntil <= 3) return { label: `${daysUntil}d left`, color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock };
    return null;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-emerald-500';
      default: return 'bg-gray-400';
    }
  };

  const getEffortColor = (effort) => {
    switch (effort) {
      case 'XS': return 'bg-emerald-100 text-emerald-700';
      case 'S': return 'bg-blue-100 text-blue-700';
      case 'M': return 'bg-amber-100 text-amber-700';
      case 'L': return 'bg-orange-100 text-orange-700';
      case 'XL': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTagColor = (tag) => {
    switch (tag) {
      case 'Feature': return 'bg-blue-100 text-blue-700';
      case 'Bug': return 'bg-red-100 text-red-700';
      case 'Tech Debt': return 'bg-purple-100 text-purple-700';
      case 'Research': return 'bg-cyan-100 text-cyan-700';
      case 'Design': return 'bg-pink-100 text-pink-700';
      case 'Documentation': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleTag = (tag) => {
    setNewTask(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleAddOrEditTask = () => {
    if (!newTask.title.trim()) return;
    if (editId) {
      setTasks(prev => prev.map(task => task.id === editId ? { ...newTask, id: editId } : task));
      logActivity(`Edited task: ${newTask.title}`);
    } else {
      const created = { ...newTask, id: Date.now() };
      setTasks(prev => [...prev, created]);
      logActivity(`Created task: ${newTask.title}`);
    }
    resetModal();
  };

  const handleEditClick = (task) => {
    setNewTask(task);
    setEditId(task.id);
    setShowModal(true);
  };

  const handleDeleteTask = (id) => {
    const deleted = tasks.find(task => task.id === id);
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== id));
      if (deleted) logActivity(`Deleted task: ${deleted.title}`);
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'Medium',
      due: '',
      status: 'To Do',
      effort: 'M',
      tags: [],
      okrId: null
    });
    setEditId(null);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    const taskList = [...tasks];
    const moved = taskList.filter(t => t.status === sourceColumn)[source.index];

    if (sourceColumn === destColumn) {
      const reordered = taskList
        .filter(t => t.status === sourceColumn)
        .filter((_, i) => i !== source.index);
      reordered.splice(destination.index, 0, moved);

      const updated = taskList
        .filter(t => t.status !== sourceColumn)
        .concat(reordered.map(t => ({ ...t, status: sourceColumn })));

      setTasks(updated);
    } else {
      const updated = taskList.map(task =>
        task.id === moved.id ? { ...task, status: destColumn } : task
      );
      logActivity(`Moved task '${moved.title}' from ${sourceColumn} to ${destColumn}`);
      setTasks(updated);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <ListTodo className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Backlog Board</h1>
        </div>
        <motion.button
          onClick={() => {
            setEditId(null);
            setNewTask({
              title: '',
              description: '',
              priority: 'Medium',
              due: '',
              status: 'To Do',
              effort: 'M',
              tags: [],
              okrId: null
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          Add Task
        </motion.button>
      </motion.div>

      {/* Stats Bar */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Tasks</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          <p className="text-xs text-gray-500">In Progress</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold text-emerald-600">{stats.done}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold text-emerald-600">{stats.completionRate}%</p>
          <p className="text-xs text-gray-500">Completion</p>
        </div>
        {stats.highPriority > 0 && (
          <div className="bg-red-50 rounded-xl p-4 border border-red-100 shadow-sm">
            <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
            <p className="text-xs text-red-600">High Priority</p>
          </div>
        )}
        {stats.overdue > 0 && (
          <div className="bg-red-50 rounded-xl p-4 border border-red-100 shadow-sm">
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            <p className="text-xs text-red-600">Overdue</p>
          </div>
        )}
      </motion.div>

      {tasks.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyState
            icon="📋"
            title="No Backlog Tasks"
            message="Click 'Add Task' above to create your first task and start building your backlog."
          />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(column => {
              const columnTasks = tasks.filter(task => task.status === column);
              const columnColor = column === 'Done' ? 'emerald' : column === 'In Progress' ? 'blue' : 'gray';
              return (
                <Droppable droppableId={column} key={column}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`p-4 rounded-2xl min-h-[400px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          {column}
                          <span className={`text-xs px-2 py-0.5 rounded-full bg-${columnColor}-100 text-${columnColor}-700`}>
                            {columnTasks.length}
                          </span>
                        </h2>
                      </div>
                      <div className="space-y-3">
                        {columnTasks.map((task, index) => {
                          const dueStatus = getDueStatus(task.due, task.status);
                          return (
                            <Draggable draggableId={String(task.id)} index={index} key={task.id}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`bg-white p-4 rounded-xl border transition-all ${
                                    snapshot.isDragging
                                      ? 'shadow-lg border-blue-300 rotate-2'
                                      : 'shadow-sm border-gray-100 hover:shadow-md hover:border-gray-200'
                                  }`}
                                >
                                  {/* Drag Handle & Priority */}
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-start gap-2 flex-1">
                                      <div {...provided.dragHandleProps} className="mt-1 text-gray-300 hover:text-gray-500 cursor-grab">
                                        <GripVertical size={14} />
                                      </div>
                                      <h3 className="text-sm font-semibold text-gray-800 leading-tight">{task.title}</h3>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full text-white flex-shrink-0 ${getPriorityColor(task.priority)}`}>
                                      {task.priority}
                                    </span>
                                  </div>

                                  {/* Description */}
                                  {task.description && (
                                    <p className="text-xs text-gray-500 mb-3 line-clamp-2 ml-6">{task.description}</p>
                                  )}

                                  {/* Tags & Effort */}
                                  <div className="flex flex-wrap gap-1.5 mb-3 ml-6">
                                    {task.effort && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getEffortColor(task.effort)}`}>
                                        {task.effort}
                                      </span>
                                    )}
                                    {task.tags?.map(tag => (
                                      <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag)}`}>
                                        {tag}
                                      </span>
                                    ))}
                                  </div>

                                  {/* Linked OKR */}
                                  {task.okrId && getOkrById(task.okrId) && (
                                    <div className="flex items-center gap-1.5 mb-3 ml-6">
                                      <Target size={12} className="text-emerald-500" />
                                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        {getOkrById(task.okrId).title}
                                      </span>
                                    </div>
                                  )}

                                  {/* Due Date & Actions */}
                                  <div className="flex items-center justify-between ml-6">
                                    <div className="flex items-center gap-2">
                                      {task.due && (
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                          <Calendar size={12} />
                                          {new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                      )}
                                      {dueStatus && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${dueStatus.bg} ${dueStatus.color}`}>
                                          <dueStatus.icon size={10} />
                                          {dueStatus.label}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => handleEditClick(task)}
                                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                      >
                                        <Pencil size={14} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
            </div>
          </DragDropContext>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModal}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editId ? 'Edit Task' : 'New Task'}
                  </h2>
                  <button
                    onClick={resetModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Implement user authentication"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Add more details about this task..."
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
                    />
                  </div>

                  {/* Priority & Effort Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Effort
                      </label>
                      <select
                        value={newTask.effort}
                        onChange={(e) => setNewTask({ ...newTask, effort: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      >
                        {EFFORT_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt} {opt === 'XS' ? '(Extra Small)' : opt === 'S' ? '(Small)' : opt === 'M' ? '(Medium)' : opt === 'L' ? '(Large)' : '(Extra Large)'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Due Date & Status Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={newTask.due}
                          onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
                          className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={newTask.status}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      >
                        {columns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TAG_OPTIONS.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`text-sm px-3 py-1.5 rounded-full border transition ${
                            newTask.tags.includes(tag)
                              ? `${getTagColor(tag)} border-transparent`
                              : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Link to OKR */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link to OKR <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={newTask.okrId || ''}
                        onChange={(e) => setNewTask({ ...newTask, okrId: e.target.value ? Number(e.target.value) : null })}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      >
                        <option value="">No linked OKR</option>
                        {okrs.map(okr => (
                          <option key={okr.id} value={okr.id}>{okr.title}</option>
                        ))}
                      </select>
                    </div>
                    {okrs.length === 0 && (
                      <p className="text-xs text-gray-400 mt-1">No OKRs available. Create one in the OKR page first.</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={resetModal}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrEditTask}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-medium shadow-lg transition"
                  >
                    {editId ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BacklogBoard;





