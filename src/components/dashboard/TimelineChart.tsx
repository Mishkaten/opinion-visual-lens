
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useReviewData } from '@/contexts/ReviewDataContext';

export const TimelineChart = () => {
  const { reviews } = useReviewData();
  
  // Process data for chart
  // First, parse dates and group by year-month
  const reviewsByDate = new Map<string, { date: string, avgRating: number, count: number }>();
  
  reviews.forEach(review => {
    const date = new Date(review.Date);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!reviewsByDate.has(yearMonth)) {
      reviewsByDate.set(yearMonth, { date: yearMonth, avgRating: 0, count: 0 });
    }
    
    const current = reviewsByDate.get(yearMonth)!;
    current.avgRating = (current.avgRating * current.count + review.Rating) / (current.count + 1);
    current.count += 1;
  });
  
  // Convert to array and sort by date
  const chartData = Array.from(reviewsByDate.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(item => ({
      ...item,
      avgRating: parseFloat(item.avgRating.toFixed(1))
    }));

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Rating Trend Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 5]} />
            <Tooltip 
              contentStyle={{ background: '#fff', border: '1px solid #ddd' }}
              formatter={(value) => [`${value}`, 'Avg. Rating']}
            />
            <Line 
              type="monotone" 
              dataKey="avgRating" 
              stroke="#7209B7" 
              strokeWidth={2} 
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
