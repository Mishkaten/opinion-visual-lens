import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReviewData } from '@/contexts/ReviewDataContext';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const AnimatedReview = ({ review, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="animate-fade-in"
    >
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
            <motion.span
              key={star}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + star * 0.1 }}
              className={star <= review.Rating ? "text-yellow-500" : "text-gray-300"}
            >
              ★
            </motion.span>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm text-foreground/90 line-clamp-2">
        {review.Body}
      </p>
    </motion.div>
  );
};

export const RecentReviews = () => {
  const { reviews, isLoading } = useReviewData();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sort reviews by date (most recent first)
  const sortedReviews = [...reviews].sort((a, b) => 
    new Date(b.Date).getTime() - new Date(a.Date).getTime()
  );

  // Calculate pagination
  const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReviews = sortedReviews.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Recent Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-36">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {currentReviews.length > 0 ? (
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {currentReviews.map((review, index) => (
                    <React.Fragment key={startIndex + index}>
                      <AnimatedReview review={review} index={index} />
                      {index < currentReviews.length - 1 && <Separator className="mt-4" />}
                    </React.Fragment>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No reviews available. Please upload review data.
                </div>
              )}
            </AnimatePresence>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
