import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  Trash2,
  Target,
  Plus,
  Calendar,
  User,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  X,
  Check,
  HelpCircle
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { logActivity } from '../utils/activityLogger';

const LOCAL_STORAGE_KEY = 'pmLite_okrs';
const TITLE_STORAGE_KEY = 'pmLite_okr_title';

const OKRView = () => {
  const [objectives, setObjectives] = useState(() => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = data ? JSON.parse(data) : [];
      // Migrate old progress-based KRs to done-based
      return parsed.map(obj => ({
        ...obj,
        keyResults: obj.keyResults.map(kr => ({
          text: kr.text,
          done: kr.done !== undefined ? kr.done : (kr.progress >= 100)
        }))
      }));
    } catch {
      return [];
    }
  });

  const [expandedOkrs, setExpandedOkrs] = useState({});
  const [showStatusLegend, setShowStatusLegend] = useState(false);
  const [pageTitle, setPageTitle] = useState('Q2 2025 OKRs');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [newKeyResults, setNewKeyResults] = useState([{ text: '', done: false }]);

  useEffect(() => {
    const savedTitle = localStorage.getItem(TITLE_STORAGE_KEY);
    if (savedTitle) setPageTitle(savedTitle);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(objectives));
  }, [objectives]);

  // Calculate overall progress from completed KRs
  const calculateProgress = (krs) => {
    if (!krs || krs.length === 0) return 0;
    const completed = krs.filter(kr => kr.done).length;
    return Math.round((completed / krs.length) * 100);
  };

  // Toggle expand/collapse for an OKR's key results
  const toggleExpand = (objId) => {
    setExpandedOkrs(prev => ({
      ...prev,
      [objId]: !prev[objId]
    }));
  };

  // Get status based on progress and due date
  const getStatus = (progress, dueDate) => {
    if (progress >= 100) return { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle2 };

    // Calculate days until due
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    // Past due and not complete
    if (daysUntilDue < 0) {
      return { label: 'Overdue', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle };
    }

    // Due within 7 days
    if (daysUntilDue <= 7) {
      if (progress >= 80) return { label: 'On Track', color: 'text-blue-600', bg: 'bg-blue-100', icon: TrendingUp };
      if (progress >= 50) return { label: 'At Risk', color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock };
      return { label: 'At Risk', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle };
    }

    // Due within 14 days
    if (daysUntilDue <= 14) {
      if (progress >= 60) return { label: 'On Track', color: 'text-blue-600', bg: 'bg-blue-100', icon: TrendingUp };
      if (progress >= 30) return { label: 'In Progress', color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock };
      return { label: 'At Risk', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle };
    }

    // More than 14 days - standard progress-based status
    if (progress >= 70) return { label: 'On Track', color: 'text-blue-600', bg: 'bg-blue-100', icon: TrendingUp };
    if (progress >= 40) return { label: 'In Progress', color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock };
    return { label: 'Not Started', color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock };
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return original if invalid
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get days remaining text
  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    if (isNaN(due.getTime())) return '';
    const days = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  const handleAddOrEditObjective = () => {
    if (!newTitle.trim()) return;

    const formattedKRs = newKeyResults
      .filter(kr => kr.text.trim())
      .map(kr => ({ text: kr.text, done: false }));

    if (editId) {
      setObjectives(prev =>
        prev.map(obj =>
          obj.id === editId
            ? { ...obj, title: newTitle, due: newDueDate || obj.due, keyResults: formattedKRs }
            : obj
        )
      );
      logActivity(`Edited objective: ${newTitle}`);
    } else {
      const newObj = {
        id: Date.now(),
        title: newTitle,
        owner: 'You',
        due: newDueDate || 'End of Quarter',
        keyResults: formattedKRs,
      };
      setObjectives(prev => [...prev, newObj]);
      logActivity(`Created new objective: ${newTitle}`);
    }

    resetModal();
  };

  const resetModal = () => {
    setNewTitle('');
    setNewDueDate('');
    setNewKeyResults([{ text: '', done: false }]);
    setEditId(null);
    setShowModal(false);
  };

  const handleEditClick = (obj) => {
    setEditId(obj.id);
    setNewTitle(obj.title);
    setNewDueDate(obj.due);
    setNewKeyResults(obj.keyResults.map(kr => ({ text: kr.text, done: kr.done || false })));
    setShowModal(true);
  };

  const handleDeleteObjective = (id) => {
    const deleted = objectives.find(obj => obj.id === id);
    if (window.confirm('Are you sure you want to delete this objective?')) {
      setObjectives(prev => prev.filter(obj => obj.id !== id));
      if (deleted) logActivity(`Deleted objective: ${deleted.title}`);
    }
  };

  const handleKRChange = (index, field, value) => {
    const updated = [...newKeyResults];
    updated[index] = { ...updated[index], [field]: value };
    setNewKeyResults(updated);
  };

  const addKeyResultField = () => {
    setNewKeyResults([...newKeyResults, { text: '', done: false }]);
  };

  const removeKeyResultField = (index) => {
    if (newKeyResults.length > 1) {
      setNewKeyResults(newKeyResults.filter((_, i) => i !== index));
    }
  };

  // Toggle a KR's completion status
  const toggleKRDone = (objId, krIndex) => {
    setObjectives(prev =>
      prev.map(obj => {
        if (obj.id === objId) {
          const updatedKRs = obj.keyResults.map((kr, i) =>
            i === krIndex ? { ...kr, done: !kr.done } : kr
          );
          return { ...obj, keyResults: updatedKRs };
        }
        return obj;
      })
    );
  };

  const handleTitleSave = () => {
    const clean = titleInput.trim();
    if (clean) {
      setPageTitle(clean);
      localStorage.setItem(TITLE_STORAGE_KEY, clean);
    }
    setEditingTitle(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="p-6 max-w-5xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={cardVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                className="text-2xl font-bold border-2 border-emerald-500 px-3 py-1 rounded-lg focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleTitleSave}
                className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-gray-900 cursor-pointer hover:text-emerald-700 transition flex items-center gap-2"
                onClick={() => {
                  setTitleInput(pageTitle);
                  setEditingTitle(true);
                }}
              >
                {pageTitle}
                <Pencil size={16} className="text-gray-400" />
              </h1>
            </div>
          )}
        </div>

        <motion.button
          onClick={() => {
            setEditId(null);
            setNewTitle('');
            setNewDueDate('');
            setNewKeyResults([{ text: '', done: false }]);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          Add Objective
        </motion.button>
      </motion.div>

      {/* Status Legend */}
      <motion.div variants={cardVariants} className="mb-6">
        <button
          onClick={() => setShowStatusLegend(!showStatusLegend)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          <HelpCircle size={16} />
          <span>How status is calculated</span>
          <motion.div
            animate={{ rotate: showStatusLegend ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </button>

        <AnimatePresence>
          {showStatusLegend && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 mb-3">Status is based on your progress relative to the due date:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-700"><strong>Completed</strong> - All KRs done</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-gray-700"><strong>On Track</strong> - Good progress for time remaining</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-gray-700"><strong>In Progress</strong> - Moderate progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-gray-700"><strong>At Risk</strong> - Behind schedule or overdue</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">The closer to the due date, the more progress is expected to stay "On Track".</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Objectives List */}
      {objectives.length === 0 ? (
        <motion.div variants={cardVariants}>
          <EmptyState
            icon="🎯"
            title="No Objectives Yet"
            message="Click 'Add Objective' above to create your first OKR and start tracking progress."
          />
        </motion.div>
      ) : (
        <div className="space-y-5">
          {objectives.map((obj) => {
            const progress = calculateProgress(obj.keyResults);
            const status = getStatus(progress, obj.due);
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={obj.id}
                variants={cardVariants}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                whileHover={{ y: -2 }}
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900">{obj.title}</h2>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(obj.due)}
                        </span>
                        {getDaysRemaining(obj.due) && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            getDaysRemaining(obj.due).includes('overdue') ? 'bg-red-100 text-red-600' :
                            getDaysRemaining(obj.due).includes('today') ? 'bg-amber-100 text-amber-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {getDaysRemaining(obj.due)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {obj.owner}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(obj)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteObjective(obj.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                      <span className="text-lg font-bold text-emerald-600">{progress}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          progress >= 100 ? 'bg-emerald-500' :
                          progress >= 70 ? 'bg-blue-500' :
                          progress >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Key Results - Collapsible */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => toggleExpand(obj.id)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Key Results</span>
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                        {obj.keyResults.filter(kr => kr.done).length}/{obj.keyResults.length} completed
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedOkrs[obj.id] ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={18} className="text-gray-400 group-hover:text-gray-600" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedOkrs[obj.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 mt-3">
                          {obj.keyResults.map((kr, index) => (
                            <motion.button
                              key={index}
                              onClick={() => toggleKRDone(obj.id, index)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left ${
                                kr.done
                                  ? 'bg-emerald-50 hover:bg-emerald-100'
                                  : 'bg-gray-50 hover:bg-gray-100'
                              }`}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                                kr.done
                                  ? 'bg-emerald-500 border-emerald-500'
                                  : 'border-gray-300 hover:border-emerald-400'
                              }`}>
                                {kr.done && <Check size={12} className="text-white" />}
                              </div>
                              <span className={`text-sm flex-1 ${
                                kr.done ? 'text-gray-400 line-through' : 'text-gray-700'
                              }`}>
                                {kr.text}
                              </span>
                              {kr.done && (
                                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
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
                    {editId ? 'Edit Objective' : 'New Objective'}
                  </h2>
                  <button
                    onClick={resetModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objective Title
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g., Increase customer satisfaction"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Results
                    </label>
                    <div className="space-y-3">
                      {newKeyResults.map((kr, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={kr.text}
                            onChange={(e) => handleKRChange(idx, 'text', e.target.value)}
                            placeholder={`Key Result ${idx + 1}`}
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                          />
                          {newKeyResults.length > 1 && (
                            <button
                              onClick={() => removeKeyResultField(idx)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addKeyResultField}
                      className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Add Key Result
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={resetModal}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrEditObjective}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-medium shadow-lg transition"
                  >
                    {editId ? 'Save Changes' : 'Create Objective'}
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

export default OKRView;
