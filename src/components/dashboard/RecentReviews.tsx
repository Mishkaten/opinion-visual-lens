
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReviewData } from '@/contexts/ReviewDataContext';
import { Separator } from '@/components/ui/separator';

export const RecentReviews = () => {
  const { reviews, isLoading } = useReviewData();
  
  // Sort reviews by date (most recent first)
  const sortedReviews = [...reviews].sort((a, b) => 
    new Date(b.Date).getTime() - new Date(a.Date).getTime()
  );

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-36">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedReviews.length > 0 ? (
              sortedReviews.map((review, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{review.Heading}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{review.Author}</span>
                        <span>•</span>
                        <span>{review.Location}</span>
                        <span>•</span>
                        <span>{new Date(review.Date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= review.Rating ? "text-yellow-500" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-foreground/90 line-clamp-2">
                    {review.Body}
                  </p>
                  {index < sortedReviews.length - 1 && <Separator className="mt-4" />}
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No reviews available. Please upload review data.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
