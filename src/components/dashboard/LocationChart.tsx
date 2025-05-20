import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useReviewData } from '@/contexts/ReviewDataContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';

// Color palette for top 5 + others
const COLORS = ['#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#7209B7', '#BDBDBD'];

// Country code to emoji flag (fallback to code if not found)
const countryFlag = (code) => {
  if (!code) return '';
  // Only works for 2-letter country codes
  if (code.length !== 2) return code;
  return code
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
};

const AnimatedCard = ({ children }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} perspective={1000} glareEnable={true} glareMaxOpacity={0.1} glareColor="#ffffff" glarePosition="all" glareBorderRadius="20px">
        {children}
      </Tilt>
    </motion.div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold flex items-center gap-2">
          <span>{countryFlag(payload[0].name)}</span> {payload[0].name}
        </p>
        <p className="text-sm text-gray-600">{payload[0].value} reviews</p>
        <p className="text-sm text-gray-600">{payload[0].payload.percent}% of total</p>
      </motion.div>
    );
  }
  return null;
};

export const LocationChart = () => {
  const { reviews, isLoading } = useReviewData();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Count reviews per location
  const locationCounts = {};
  reviews.forEach(review => {
    locationCounts[review.Location] = (locationCounts[review.Location] || 0) + 1;
  });
  const sortedLocations = Object.entries(locationCounts).sort(([, a], [, b]) => b - a);
  const top5 = sortedLocations.slice(0, 5);
  const others = sortedLocations.slice(5);
  const othersTotal = others.reduce((sum, [, count]) => sum + count, 0);
  const chartData = [
    ...top5.map(([name, value], i) => ({
      name,
      value,
      percent: ((value / reviews.length) * 100).toFixed(1),
      color: COLORS[i],
    })),
    ...(othersTotal > 0 ? [{
      name: 'Others',
      value: othersTotal,
      percent: ((othersTotal / reviews.length) * 100).toFixed(1),
      color: COLORS[5],
    }] : [])
  ];

  // Center label for PieChart
  const renderCenterLabel = () => (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="bold" fill="#333">
      {reviews.length}
      <tspan x="50%" y="58%" fontSize="12" fontWeight="normal" fill="#888">reviews</tspan>
    </text>
  );

  return (
    <AnimatedCard>
      <Card className="transform transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reviews by Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent)}%`}
                      onMouseEnter={(_, idx) => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {chartData.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={entry.color}
                          stroke="#fff"
                          strokeWidth={hoveredIndex === idx ? 4 : 2}
                          style={{ filter: hoveredIndex === idx ? 'brightness(1.1)' : 'none' }}
                        />
                      ))}
                    </Pie>
                    {renderCenterLabel()}
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold mb-4">Top Locations</h3>
                {chartData.map((loc, idx) => (
                  <motion.div
                    key={loc.name}
                    className={`flex items-center justify-between py-1 px-2 rounded transition-colors ${hoveredIndex === idx ? 'bg-blue-50' : ''}`}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: loc.color }} />
                      <span className="text-lg">{countryFlag(loc.name)}</span>
                      <span className="text-sm font-medium">{loc.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base tabular-nums">{loc.value}</span>
                      <span className="text-muted-foreground text-sm">({loc.percent}%)</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
};
