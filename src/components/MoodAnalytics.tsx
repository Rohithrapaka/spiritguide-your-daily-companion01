import React from 'react';
import { useMood } from '@/contexts/MoodContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { TrendingUp, PieChart, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = [
  'hsl(0, 60%, 60%)',     // Anxious - red
  'hsl(210, 60%, 60%)',   // Calm - blue
  'hsl(0, 0%, 60%)',      // Tired - gray
  'hsl(45, 70%, 55%)',    // Energetic - yellow
  'hsl(280, 50%, 60%)',   // Motivated - purple
  'hsl(142, 50%, 50%)',   // Peaceful - green
  'hsl(30, 70%, 55%)',    // Stressed - orange
  'hsl(340, 60%, 60%)',   // Happy - pink
];

export const MoodAnalytics: React.FC = () => {
  const { moodHistory } = useMood();
  const { theme } = useTheme();

  // Process data for line chart (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const lineChartData = last7Days.map(date => {
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    const entry = moodHistory.find(m => 
      m.timestamp.toDateString() === date.toDateString()
    );
    return {
      name: dateStr,
      score: entry?.score || null
    };
  });

  // Process data for pie chart (mood tag distribution)
  const tagCounts: Record<string, number> = {};
  moodHistory.forEach(entry => {
    entry.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const pieChartData = Object.entries(tagCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const hasData = moodHistory.length > 0;

  return (
    <div className={cn(
      "rounded-3xl p-6 transition-all duration-500",
      theme === 'warm' ? "warm-card" : "glass-card"
    )}>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-serif text-xl font-semibold">Your Progress</h3>
      </div>

      {!hasData ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Start tracking your mood to see insights here
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Mood Over Time
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--border))" 
                    opacity={0.5}
                  />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      boxShadow: 'var(--shadow-soft)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ 
                      fill: 'hsl(var(--primary))', 
                      strokeWidth: 2,
                      r: 4
                    }}
                    activeDot={{ r: 6 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Mood Distribution
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {hasData && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {moodHistory.length}
            </p>
            <p className="text-xs text-muted-foreground">Check-ins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {(moodHistory.reduce((acc, m) => acc + m.score, 0) / moodHistory.length).toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Avg Mood</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {pieChartData[0]?.name || '-'}
            </p>
            <p className="text-xs text-muted-foreground">Top Feeling</p>
          </div>
        </div>
      )}
    </div>
  );
};
