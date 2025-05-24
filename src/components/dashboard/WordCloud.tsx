import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReviewData } from '@/contexts/ReviewDataContext';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

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
      .slice(0, 25) // fewer words for clarity
      .map(([text, value]) => ({ text, value }));
  }, [reviews]);

  // Reference-like color palette (greens, browns)
  const colors = [
    '#4e8c2b', '#7bb661', '#b7d7a8', '#d9ead3', '#b6a16b', '#a67c52', '#6b4226', '#8d5524', '#c68642', '#e0ac69', '#f1c232', '#6aa84f', '#38761d', '#274e13', '#b45f06', '#783f04', '#a61c00', '#990000', '#cc0000', '#e69138', '#f6b26b', '#ffd966', '#fff2cc', '#b7b7b7', '#666666'
  ];

  // Improved wordcloud options
  const options = {
    rotations: 6,
    rotationAngles: [0, 90, 45, -45, 30, -30],
    fontSizes: [24, 72],
    fontFamily: 'Impact, Arial Black, sans-serif',
    colors,
    enableTooltip: true,
    deterministic: true,
    scale: 'sqrt',
    spiral: 'archimedean',
    transitionDuration: 800,
    padding: 8, // more padding
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word Cloud</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[600px] flex items-center justify-center p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="w-full h-[560px]">
            <ReactWordcloud
              words={wordFrequency}
              options={options}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
