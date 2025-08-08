import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface Stat {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface StatsOverviewProps {
  stats: Stat[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div 
            key={stat.title} 
            className="card-premium hover-lift relative overflow-hidden group"
            variants={cardVariants}
            whileHover={{ y: -4 }}
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                 style={{ background: 'var(--gradient-primary)' }} />
            
            <div className="relative z-10 text-center">
              {/* Icon */}
              <Icon className={`h-10 w-10 ${stat.color} mx-auto mb-3`} />
              
              {/* Title */}
              <h4 className="text-sm font-medium text-medium-contrast mb-2">{stat.title}</h4>
              
              {/* Value */}
              <motion.p 
                className="text-3xl font-bold text-high-contrast"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20, 
                  delay: index * 0.1 + 0.5 
                }}
              >
                {stat.value}
              </motion.p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsOverview;