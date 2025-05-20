
import React from 'react';
import { ReviewDataProvider } from '@/contexts/ReviewDataContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { RatingChart } from '@/components/dashboard/RatingChart';
import { LocationChart } from '@/components/dashboard/LocationChart';
import { TimelineChart } from '@/components/dashboard/TimelineChart';
import { WordCloud } from '@/components/dashboard/WordCloud';
import { RecentReviews } from '@/components/dashboard/RecentReviews';

const Index = () => {
  return (
    <ReviewDataProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Review Analytics Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <DashboardHeader />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RatingChart />
                <LocationChart />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TimelineChart />
                <WordCloud />
              </div>
              
              <RecentReviews />
            </div>
          </div>
        </main>
      </div>
    </ReviewDataProvider>
  );
};

export default Index;
