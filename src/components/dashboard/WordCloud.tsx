
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReviewData } from '@/contexts/ReviewDataContext';

export const WordCloud = () => {
  const { reviews, isLoading } = useReviewData();
  
  // Process review text to generate word frequency
  const wordFrequency = useMemo(() => {
    // Combine all review text
    const allText = reviews.map(review => 
      `${review.Heading} ${review.Body}`
    ).join(' ');
    
    // Clean text and split into words
    const words = allText.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/);
    
    // Count word frequency
    const stopWords = new Set(['and', 'the', 'to', 'a', 'of', 'in', 'is', 'it', 'you', 'that', 'was', 'for', 'on', 'are', 'with', 'as', 'i', 'his', 'they', 'be', 'at', 'have', 'this', 'or', 'had', 'by', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'use', 'an', 'each', 'which']);
    const frequency: Record<string, number> = {};
    
    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
    
    // Convert to array and sort by frequency
    return Object.entries(frequency)
      .filter(([_, count]) => count > 1) // Only include words that appear more than once
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30); // Take top 30 words
  }, [reviews]);

  // Calculate the maximum frequency for scaling
  const maxFrequency = wordFrequency.length > 0 
    ? wordFrequency[0][1] 
    : 1;

  // Calculate font sizes between 14 and 42px based on frequency
  const calculateFontSize = (frequency: number) => {
    const minSize = 14;
    const maxSize = 42;
    return minSize + ((frequency / maxFrequency) * (maxSize - minSize));
  };

  // Generate colors based on frequency
  const getWordColor = (frequency: number) => {
    const colors = [
      'text-dashboard-blue',
      'text-dashboard-purple',
      'text-dashboard-light-blue',
      'text-dashboard-pink',
      'text-dashboard-indigo'
    ];
    const index = Math.floor((frequency / maxFrequency) * (colors.length - 1));
    return colors[index];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word Cloud</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px] flex items-center justify-center p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            {wordFrequency.map(([word, count]) => (
              <span
                key={word}
                className={`${getWordColor(count)} font-medium px-1`}
                style={{ 
                  fontSize: `${calculateFontSize(count)}px`,
                  transform: `rotate(${Math.random() * 20 - 10}deg)`,
                  display: 'inline-block'
                }}
              >
                {word}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
