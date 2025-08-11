import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { fetchAnalytics } from '../services/api';
import type { Analytics as AnalyticsType } from '../types';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load analytics. Please try again.');
        console.error('Error loading analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No analytics data available.</p>
      </div>
    );
  }

  // Prepare data for weekly trends chart
  const weeklyData = {
    labels: analytics.daily.map(day => day.date),
    datasets: [
      {
        label: 'Tasks Completed',
        data: analytics.daily.map(day => day.completed),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Tasks Added',
        data: analytics.daily.map(day => day.added),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for status distribution chart
  const statusData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [analytics.status.completed, analytics.status.pending],
        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(234, 179, 8, 0.6)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(234, 179, 8)'],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for priority distribution chart
  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [analytics.priority.high, analytics.priority.medium, analytics.priority.low],
        backgroundColor: [
          'rgba(239, 68, 68, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(34, 197, 94, 0.6)',
        ],
        borderColor: ['rgb(239, 68, 68)', 'rgb(59, 130, 246)', 'rgb(34, 197, 94)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-64 h-64">
              <Doughnut 
                data={statusData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Priority</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-64 h-64">
              <Doughnut 
                data={priorityData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar 
            data={weeklyData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analytics.status.completed}
              </h3>
              <p className="text-sm text-muted-foreground">Completed Tasks</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {analytics.status.pending}
              </h3>
              <p className="text-sm text-muted-foreground">Pending Tasks</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                {analytics.priority.high}
              </h3>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analytics.status.completed + analytics.status.pending}
              </h3>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Analytics;