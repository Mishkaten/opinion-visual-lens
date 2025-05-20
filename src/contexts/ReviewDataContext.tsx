
import React, { createContext, useContext, ReactNode } from 'react';

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
}

const initialReviews: Review[] = [
  {
    "Author": "Sameena Ijaz",
    "Body": "Do not support a pedophile brand!! They are disgusting and they have abused children! Please do not be silent on this subject this company is a pedophile company please leave reviews everywhere on their yelp and on their websites do not stop!!",
    "Date": "2022-11-29",
    "Heading": "Do not support a pedophile brand!",
    "Location": "US",
    "Rating": 1
  },
  {
    "Author": "Louise",
    "Body": "Love love love\nQuick delivery and lovely products \nA bit pricey but worth the money",
    "Date": "2021-12-03",
    "Heading": "Love love love",
    "Location": "GB",
    "Rating": 5
  },
  {
    "Author": "ELLEN Driesen",
    "Body": "I buy very often Balenciaga clothes since they are beautiful and unique. I am however very unsatisfied about the lack of response or service I receive now that my handbag strap broke after only 1,5 years, The local shop can not help and refers me to the customer service. Customer service just does not react on the 2 emails I have send. I would dare to say this is extremely poor for a brand that sells his products at such a high price. I will think twice next time I want to buy something. I am especially very disappointed on how they treat customers, next to the fact that the product just does not have the quality I thought it would have based on the price they ask.",
    "Date": "2018-01-20",
    "Heading": "I buy very often Balenciaga clothes …",
    "Location": "CH",
    "Rating": 1
  }
];

const ReviewDataContext = createContext<ReviewDataContextType | undefined>(undefined);

export function ReviewDataProvider({ children }: { children: ReactNode }) {
  const reviews = initialReviews;

  return (
    <ReviewDataContext.Provider value={{ reviews }}>
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
