import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Calendar,
  Tag,
  X,
  Edit3,
  Trash2,
  Filter,
  Users,
  Lightbulb,
  CheckSquare,
  Clock,
  Search
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { logActivity } from '../utils/activityLogger';

const LOCAL_STORAGE_KEY = 'pmLiteNotes';

const NOTE_TYPES = [
  { value: 'meeting', label: 'Meeting Notes', icon: Users, color: 'bg-blue-100 text-blue-700' },
  { value: 'decision', label: 'Decision Log', icon: Lightbulb, color: 'bg-amber-100 text-amber-700' },
  { value: 'action', label: 'Action Items', icon: CheckSquare, color: 'bg-emerald-100 text-emerald-700' },
  { value: 'general', label: 'General', icon: FileText, color: 'bg-gray-100 text-gray-700' }
];

const MeetingNotesView = () => {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.map(note => ({
        ...note,
        tags: Array.isArray(note.tags) ? note.tags : [],
        type: note.type || 'meeting'
      }));
    } catch {
      return [];
    }
  });

  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '', date: '', type: 'meeting' });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterTag, setFilterTag] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = notes.length;
    const meetings = notes.filter(n => n.type === 'meeting').length;
    const decisions = notes.filter(n => n.type === 'decision').length;
    const actions = notes.filter(n => n.type === 'action').length;
    const thisWeek = notes.filter(n => {
      if (!n.date) return false;
      const noteDate = new Date(n.date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return noteDate >= weekAgo && noteDate <= today;
    }).length;
    return { total, meetings, decisions, actions, thisWeek };
  }, [notes]);

  const allTags = notes.flatMap(note => note.tags);
  const tagSuggestions = Array.from(new Set(allTags))
    .reduce((acc, tag) => {
      const count = allTags.filter(t => t === tag).length;
      acc.push({ tag, count });
      return acc;
    }, [])
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map(t => t.tag);

  const handleAddOrEditNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const formattedNote = {
      ...newNote,
      id: editId || Date.now(),
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (editId) {
      setNotes(prev => prev.map(note => note.id === editId ? formattedNote : note));
      logActivity(`Edited note: ${formattedNote.title}`);
    } else {
      setNotes(prev => [formattedNote, ...prev]);
      logActivity(`Created note: ${formattedNote.title}`);
    }

    setNewNote({ title: '', content: '', tags: '', date: '', type: 'meeting' });
    setEditId(null);
    setShowModal(false);
  };

  const handleEdit = (note) => {
    setNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
      date: note.date,
      type: note.type || 'meeting'
    });
    setEditId(note.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const deleted = notes.find(note => note.id === id);
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== id));
      if (deleted) logActivity(`Deleted note: ${deleted.title}`);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesTag = filterTag ? note.tags.includes(filterTag) : true;
    const matchesType = filterType ? note.type === filterType : true;
    const matchesSearch = searchQuery
      ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesTag && matchesType && matchesSearch;
  });

  const getNoteTypeInfo = (type) => {
    return NOTE_TYPES.find(t => t.value === type) || NOTE_TYPES[3];
  };

  const clearFilters = () => {
    setFilterTag('');
    setFilterType('');
    setSearchQuery('');
  };

  const hasActiveFilters = filterTag || filterType || searchQuery;

  return (
    <motion.div
      className="p-6 space-y-6 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            Notes
          </h1>
          <p className="text-gray-500 mt-1">Capture meetings, decisions, and action items</p>
        </div>
        <motion.button
          onClick={() => { setShowModal(true); setEditId(null); setNewNote({ title: '', content: '', tags: '', date: '', type: 'meeting' }); }}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-200 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          New Note
        </motion.button>
      </motion.div>

      {/* Stats Bar */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <FileText size={14} />
            Total
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
            <Users size={14} />
            Meetings
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.meetings}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 text-sm mb-1">
            <Lightbulb size={14} />
            Decisions
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.decisions}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 text-sm mb-1">
            <CheckSquare size={14} />
            Actions
          </div>
          <p className="text-2xl font-bold text-emerald-600">{stats.actions}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-purple-600 text-sm mb-1">
            <Clock size={14} />
            This Week
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.thisWeek}</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition appearance-none bg-white"
            >
              <option value="">All Types</option>
              {NOTE_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by tag"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value.trim())}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Notes Grid */}
      <motion.div variants={itemVariants}>
        {filteredNotes.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No Notes Yet"
            message={hasActiveFilters ? "No notes match your filters" : "Capture your first meeting note or decision"}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note, idx) => {
              const typeInfo = getNoteTypeInfo(note.type);
              const TypeIcon = typeInfo.icon;
              return (
                <motion.div
                  key={note.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  {/* Type Badge & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${typeInfo.color}`}>
                      <TypeIcon size={12} />
                      {typeInfo.label}
                    </span>
                    {note.date && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(note.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Title & Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{note.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{note.content}</p>

                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full cursor-pointer hover:bg-emerald-100 hover:text-emerald-700 transition"
                          onClick={() => setFilterTag(tag)}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(note)}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowModal(false);
              setNewNote({ title: '', content: '', tags: '', date: '', type: 'meeting' });
              setEditId(null);
            }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editId ? 'Edit Note' : 'New Note'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setNewNote({ title: '', content: '', tags: '', date: '', type: 'meeting' });
                      setEditId(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Note Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {NOTE_TYPES.map(type => {
                        const TypeIcon = type.icon;
                        const isSelected = newNote.type === type.value;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setNewNote({ ...newNote, type: type.value })}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 transition ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <TypeIcon size={18} className={isSelected ? 'text-emerald-600' : 'text-gray-400'} />
                            <span className={`text-sm font-medium ${isSelected ? 'text-emerald-700' : 'text-gray-600'}`}>
                              {type.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="Note title"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      placeholder="Write your note here..."
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={newNote.date}
                        onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Comma separated tags"
                        value={newNote.tags}
                        onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                    </div>
                    {tagSuggestions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1.5">Suggested:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {tagSuggestions.map((tag, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                const currentTags = newNote.tags.split(',').map(t => t.trim()).filter(Boolean);
                                if (!currentTags.includes(tag)) {
                                  setNewNote({ ...newNote, tags: [...currentTags, tag].join(', ') });
                                }
                              }}
                              className="text-xs bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-700 px-2 py-1 rounded-full transition"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setNewNote({ title: '', content: '', tags: '', date: '', type: 'meeting' });
                      setEditId(null);
                    }}
                    className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleAddOrEditNote}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-200 transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editId ? 'Save Changes' : 'Add Note'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MeetingNotesView;
