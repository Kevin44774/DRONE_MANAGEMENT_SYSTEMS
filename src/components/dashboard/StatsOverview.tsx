import React from 'react';
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
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-comfortable">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="card-premium rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200">
            <Icon className={`h-10 w-10 ${stat.color} mx-auto mb-3`} />
            <h4 className="text-sm font-medium text-medium-contrast mb-2">{stat.title}</h4>
            <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;