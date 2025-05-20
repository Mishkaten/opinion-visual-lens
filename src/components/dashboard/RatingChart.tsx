import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useReviewData } from '@/contexts/ReviewDataContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';

const AnimatedCard = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Tilt
        tiltMaxAngleX={2}
        tiltMaxAngleY={2}
        perspective={1000}
        glareEnable={true}
        glareMaxOpacity={0.1}
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius="20px"
      >
        {children}
      </Tilt>
    </motion.div>
  );
};

const COLORS = ['#FF6B6B', '#FF9E7D', '#FFD166', '#06D6A0', '#118AB2'];

export const RatingChart = () => {
  const { reviews, isLoading } = useReviewData();
  const [activeIndex, setActiveIndex] = React.useState(null);
  
  // Process data for chart
  const ratingCounts = [0, 0, 0, 0, 0]; // For ratings 1-5
  
  reviews.forEach(review => {
    if (review.Rating >= 1 && review.Rating <= 5) {
      ratingCounts[review.Rating - 1]++;
    }
  });
  
  const chartData = [1, 2, 3, 4, 5].map((rating, index) => ({
    rating: `${rating} Star`,
    count: ratingCounts[index],
    percentage: ((ratingCounts[index] / reviews.length) * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-3 rounded-lg shadow-lg border border-gray-200"
        >
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-gray-600">{payload[0].value} reviews</p>
          <p className="text-sm text-gray-600">{payload[0].payload.percentage}% of total</p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <AnimatedCard>
      <Card className="col-span-1 md:col-span-2 transform transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <XAxis 
                  dataKey="rating" 
                  tick={{ fill: '#666' }}
                  axisLine={{ stroke: '#ddd' }}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fill: '#666' }}
                  axisLine={{ stroke: '#ddd' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                      opacity={activeIndex === index ? 1 : 0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
};
