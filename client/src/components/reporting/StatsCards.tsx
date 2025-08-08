import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Stat {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  change: string;
}

interface StatsCardsProps {
  stats: Stat[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="card-premium rounded-xl p-6 text-center">
            <Icon className={`h-10 w-10 ${stat.color} mx-auto mb-3`} />
            <h4 className="text-sm font-medium text-medium-contrast mb-2">{stat.title}</h4>
            <span className="text-3xl font-bold text-high-contrast">{stat.value}</span>
            <p className="text-xs text-green-400 mt-2">{stat.change}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;