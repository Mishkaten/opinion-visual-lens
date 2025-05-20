import React, { createContext, useContext, ReactNode, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { reviews as initialReviews } from '@/data/reviews';

export interface Review {
  Author: string;
  Body: string;
  Date: string;
  Heading: string;
  Location: string;
  Rating: number;
}

interface ReviewDataContextType {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  isLoading: boolean;
}

const ReviewDataContext = createContext<ReviewDataContextType | undefined>(undefined);

export function ReviewDataProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSetReviews = (newReviews: Review[]) => {
    setIsLoading(true);
    try {
      setReviews(newReviews);
      toast({
        title: "Data loaded successfully",
        description: `${newReviews.length} reviews have been processed.`,
      });
    } catch (error) {
      console.error("Error setting reviews:", error);
      toast({
        title: "Error loading data",
        description: "An error occurred while processing the reviews.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReviewDataContext.Provider value={{ reviews, setReviews: handleSetReviews, isLoading }}>
      {children}
    </ReviewDataContext.Provider>
  );
}

export function useReviewData() {
  const context = useContext(ReviewDataContext);
  if (context === undefined) {
    throw new Error('useReviewData must be used within a ReviewDataProvider');
  }
  return context;
}
