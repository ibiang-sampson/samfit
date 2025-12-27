import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

interface StatItemProps {
  value: string;
  label: string;
  index: number;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  
  const match = value.match(/^([\d\.]+)(.*)$/);
  const numericValue = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const isNumber = match !== null;

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView && isNumber) {
      const controls = animate(count, numericValue, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, numericValue, isNumber, count]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-4"
    >
      <div className="text-4xl md:text-6xl font-bold font-display mb-2 flex justify-center items-baseline">
        {isNumber ? (
            <>
                <motion.span>{rounded}</motion.span>
                <span>{suffix}</span>
            </>
        ) : (
            <span>{value}</span>
        )}
      </div>
      <div className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-90">{label}</div>
    </motion.div>
  );
};

const Stats: React.FC = () => {
  return (
    <section className="bg-brand text-white py-16 relative z-20 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
          {[
            { value: "2K+", label: "Elite Members" },
            { value: "15+", label: "Years Experience" },
            { value: "50+", label: "Staff Coaches" },
            { value: "24/7", label: "Gym Access" }
          ].map((stat, index) => (
            <StatItem key={index} value={stat.value} label={stat.label} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;