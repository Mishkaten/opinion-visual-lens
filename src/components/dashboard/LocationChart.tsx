
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useReviewData } from '@/contexts/ReviewDataContext';

export const LocationChart = () => {
  const { reviews, isLoading } = useReviewData();
  
  // Process data for chart
  const locationCounts: Record<string, number> = {};
  
  reviews.forEach(review => {
    locationCounts[review.Location] = (locationCounts[review.Location] || 0) + 1;
  });
  
  const chartData = Object.entries(locationCounts).map(([location, count]) => ({
    name: location,
    value: count
  }));

  const COLORS = ['#4361EE', '#3A0CA3', '#7209B7', '#F72585', '#4CC9F0'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews by Location</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} reviews`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
