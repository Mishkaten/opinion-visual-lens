
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useReviewData } from '@/contexts/ReviewDataContext';

export const DashboardHeader = () => {
  const { reviews } = useReviewData();
  
  // Calculate metrics
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.Rating, 0) / totalReviews;
  const positiveReviews = reviews.filter(review => review.Rating >= 4).length;
  const positivePercentage = (positiveReviews / totalReviews) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-gradient-to-br from-dashboard-blue to-dashboard-light-blue text-white">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <h3 className="text-xl font-medium opacity-90">Total Reviews</h3>
          <p className="text-4xl font-bold mt-2">{totalReviews}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-dashboard-purple to-dashboard-indigo text-white">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <h3 className="text-xl font-medium opacity-90">Average Rating</h3>
          <p className="text-4xl font-bold mt-2">{averageRating.toFixed(1)}</p>
          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-xl">
                {star <= Math.round(averageRating) ? "★" : "☆"}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-dashboard-pink to-dashboard-purple text-white">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <h3 className="text-xl font-medium opacity-90">Positive Reviews</h3>
          <p className="text-4xl font-bold mt-2">{positivePercentage.toFixed(0)}%</p>
        </CardContent>
      </Card>
    </div>
  );
};
