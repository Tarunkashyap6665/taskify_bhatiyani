import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import Layout from './components/Layout';
import TaskList from './components/TaskList';
import Analytics from './components/Analytics';

function App() {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <AnimatePresence mode="wait">
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'tasks' ? <TaskList /> : <Analytics />}
      </Layout>
    </AnimatePresence>
  );
}

export default App;
