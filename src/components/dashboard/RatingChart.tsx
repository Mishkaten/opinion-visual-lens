
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useReviewData } from '@/contexts/ReviewDataContext';

export const RatingChart = () => {
  const { reviews, isLoading } = useReviewData();
  
  // Process data for chart
  const ratingCounts = [0, 0, 0, 0, 0]; // For ratings 1-5
  
  reviews.forEach(review => {
    if (review.Rating >= 1 && review.Rating <= 5) {
      ratingCounts[review.Rating - 1]++;
    }
  });
  
  const chartData = [1, 2, 3, 4, 5].map((rating, index) => ({
    rating: `${rating} Star`,
    count: ratingCounts[index]
  }));

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <XAxis dataKey="rating" />
              <YAxis allowDecimals={false} />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #ddd' }}
                formatter={(value) => [`${value} reviews`, 'Count']}
              />
              <Bar 
                dataKey="count" 
                fill="#4361EE" 
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
