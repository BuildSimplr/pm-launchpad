import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Target,
  ListTodo,
  FileText,
  LayoutDashboard,
  CheckCircle,
  ArrowRight,
  Zap,
  Clock,
  Link2,
  TrendingUp,
  Users,
  Lightbulb,
  Github,
  ExternalLink,
  Quote,
  AlertCircle,
  Frown,
  Smile,
  Coffee,
  Briefcase,
  Calendar,
  MessageSquare
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Target,
      title: 'Smart OKR Tracking',
      description: 'Set objectives with key results that auto-calculate progress. Intelligent status indicators (On Track, At Risk, Behind) based on progress and due dates.',
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50'
    },
    {
      icon: ListTodo,
      title: 'Kanban Backlog',
      description: 'Drag-and-drop task management with priority levels, effort estimation (XS-XL), tags, due date urgency indicators, and optional OKR linkage.',
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50'
    },
    {
      icon: FileText,
      title: 'Organized Notes',
      description: 'Categorize notes as Meeting, Decision, or Action Items. Tag, search, and filter instantly. Click any tag to filter your notes.',
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50'
    },
    {
      icon: LayoutDashboard,
      title: 'PM Dashboard',
      description: 'Personalized overview with stats cards, task completion metrics, quick actions, and activity timeline. See everything at a glance.',
      color: 'from-purple-500 to-pink-600',
      bgLight: 'bg-purple-50'
    }
  ];

  const highlights = [
    { icon: CheckCircle, text: 'Key Results with checkbox completion' },
    { icon: TrendingUp, text: 'Auto-calculated progress tracking' },
    { icon: Clock, text: 'Due date urgency indicators' },
    { icon: Link2, text: 'Link tasks to OKRs' },
    { icon: Zap, text: 'Quick actions from dashboard' },
    { icon: Users, text: 'Meeting, Decision & Action note types' }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">PM Lite</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://buildsimplr.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1 transition"
            >
              <ExternalLink size={14} />
              Portfolio
            </a>
            <a
              href="https://github.com/BuildSimplr/pm-launchpad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1 transition"
            >
              <Github size={14} />
              GitHub
            </a>
            <Link
              to="/app"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap size={14} />
            Built for PMs who ship
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Your Lightweight
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"> Product Management </span>
            Toolkit
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            OKRs, backlog, and notes in one clean interface. Stay focused, aligned, and shipping fast.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <a
              href="#story"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 transition-all"
            >
              See How It Helps
            </a>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          className="max-w-5xl mx-auto mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-4 text-sm text-gray-500">PM Lite Dashboard</span>
            </div>
            <img
              src={process.env.PUBLIC_URL + "/assets/dashboard-preview.png"}
              alt="PM Lite dashboard preview"
              className="w-full"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
              Dashboard Preview
            </div>
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything a PM Needs
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Built from real PM workflows. No bloat, no complexity—just the tools you actually use.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-lg group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Story Section */}
      <section id="story" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Users size={14} />
              User Story
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Sarah, Solo PM at a Growing Startup
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Sound familiar? Here's how PM Lite transformed her workflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* The Problem - Before */}
            <motion.div
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-xl">
                  <Frown className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Before PM Lite</h3>
                  <p className="text-sm text-gray-500">The daily struggle</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">OKRs in a spreadsheet</p>
                    <p className="text-sm text-gray-600">Updated quarterly, forgotten weekly. No one knew if we were on track.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Tasks scattered everywhere</p>
                    <p className="text-sm text-gray-600">Jira for eng, Asana for design, sticky notes for "quick wins." Nothing connected.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Meeting notes lost in Slack</p>
                    <p className="text-sm text-gray-600">"What did we decide last week?" became the most asked question.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">No single source of truth</p>
                    <p className="text-sm text-gray-600">Spent more time context-switching than actually shipping.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                <p className="text-gray-600 italic text-sm">
                  "I was managing a product, but I couldn't tell you our progress on any given day without checking 5 different tools."
                </p>
              </div>
            </motion.div>

            {/* The Solution - After */}
            <motion.div
              className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Smile className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">After PM Lite</h3>
                  <p className="text-sm text-gray-500">Clarity in one place</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">OKRs with real-time progress</p>
                    <p className="text-sm text-gray-600">Check off key results, watch progress update. Status shows On Track, At Risk, or Behind.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Tasks linked to objectives</p>
                    <p className="text-sm text-gray-600">Every task connects to an OKR. Work finally has visible purpose.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Decisions captured, searchable</p>
                    <p className="text-sm text-gray-600">Meeting notes tagged by type. One click to find that decision from last month.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Dashboard tells the whole story</p>
                    <p className="text-sm text-gray-600">One glance: OKR count, task progress, completion rate. No more tool hopping.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-emerald-100 rounded-xl border border-emerald-200">
                <p className="text-emerald-800 italic text-sm">
                  "Now I start each day with the dashboard. In 30 seconds, I know exactly where we stand and what needs attention."
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sarah's Results */}
          <motion.div
            className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4 mb-6">
              <Quote className="w-10 h-10 text-purple-200 flex-shrink-0" />
              <div>
                <p className="text-lg leading-relaxed mb-4">
                  "PM Lite isn't trying to be everything. It's trying to be the one place I actually go to every day. And it works. My weekly status updates used to take an hour of gathering info. Now it's a screenshot of my dashboard."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Chen</p>
                    <p className="text-purple-200 text-sm">Product Manager, Series A Startup</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20">
              <div className="text-center">
                <p className="text-3xl font-bold">5 → 1</p>
                <p className="text-purple-200 text-sm">Tools consolidated</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">2hrs</p>
                <p className="text-purple-200 text-sm">Saved weekly</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">100%</p>
                <p className="text-purple-200 text-sm">OKR visibility</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">30sec</p>
                <p className="text-purple-200 text-sm">Daily check-in</p>
              </div>
            </div>
          </motion.div>

          {/* Who is this for */}
          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Solo PMs</h4>
              <p className="text-gray-600 text-sm">Wearing all the hats? Keep everything in one lightweight tool.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Startup Teams</h4>
              <p className="text-gray-600 text-sm">Moving fast? Stay aligned without enterprise complexity.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Aspiring PMs</h4>
              <p className="text-gray-600 text-sm">Learning the craft? Practice real PM workflows.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Real PM Work
            </h2>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Features designed around how product managers actually work
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <item.icon className="text-emerald-200 flex-shrink-0" size={20} />
                <span className="text-white font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to streamline your product work?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            No sign-up required. Your data stays in your browser.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
          >
            Launch PM Lite
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">PM Lite</span>
            </div>

            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <a
                href="https://buildsimplr.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition flex items-center gap-1"
              >
                <ExternalLink size={14} />
                BuildSimplr Portfolio
              </a>
              <a
                href="https://github.com/BuildSimplr/pm-launchpad"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition flex items-center gap-1"
              >
                <Github size={14} />
                GitHub
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} PM Lite. A BuildSimplr project.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
