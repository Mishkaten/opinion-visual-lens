import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useReviewData } from '@/contexts/ReviewDataContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';
import { useSpring, animated } from 'react-spring';

const AnimatedCard = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <Tilt
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        perspective={1000}
        glareEnable={true}
        glareMaxOpacity={0.3}
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius="20px"
      >
        {children}
      </Tilt>
    </motion.div>
  );
};

const AnimatedNumber = ({ value, suffix = '' }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return (
    <animated.span>
      {number.to((n) => `${n.toFixed(suffix === '%' ? 0 : 1)}${suffix}`)}
    </animated.span>
  );
};

export const DashboardHeader = () => {
  const { reviews } = useReviewData();
  
  // Calculate metrics
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.Rating, 0) / totalReviews;
  const positiveReviews = reviews.filter(review => review.Rating >= 4).length;
  const positivePercentage = (positiveReviews / totalReviews) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <AnimatedCard delay={0}>
        <Card className="bg-gradient-to-br from-dashboard-blue to-dashboard-light-blue text-white transform transition-all duration-300 hover:scale-105">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h3 className="text-xl font-medium opacity-90">Total Reviews</h3>
            <p className="text-4xl font-bold mt-2">
              <AnimatedNumber value={totalReviews} />
            </p>
          </CardContent>
        </Card>
      </AnimatedCard>
      
      <AnimatedCard delay={0.2}>
        <Card className="bg-gradient-to-br from-dashboard-purple to-dashboard-indigo text-white transform transition-all duration-300 hover:scale-105">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h3 className="text-xl font-medium opacity-90">Average Rating</h3>
            <p className="text-4xl font-bold mt-2">
              <AnimatedNumber value={averageRating} />
            </p>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                  key={star}
                  className="text-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + star * 0.1 }}
                >
                  {star <= Math.round(averageRating) ? "★" : "☆"}
                </motion.span>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
      
      <AnimatedCard delay={0.4}>
        <Card className="bg-gradient-to-br from-dashboard-pink to-dashboard-purple text-white transform transition-all duration-300 hover:scale-105">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h3 className="text-xl font-medium opacity-90">Positive Reviews</h3>
            <p className="text-4xl font-bold mt-2">
              <AnimatedNumber value={positivePercentage} suffix="%" />
            </p>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  );
};
