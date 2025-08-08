import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { MapPin, Bone as Drone, BarChart3, PlusCircle, Settings, Zap } from 'lucide-react';

const Navigation = () => {
  const [location] = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Fleet Dashboard', icon: Drone },
    { path: '/monitoring', label: 'Live Monitoring', icon: MapPin },
    { path: '/planning', label: 'Mission Planning', icon: PlusCircle },
    { path: '/reporting', label: 'Reports & Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && (location === '/' || location === '/dashboard')) {
      return true;
    }
    return location === path;
  };

  return (
    <motion.nav 
      className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
            >
              <Link href="/" data-testid="link-home">
                <motion.h1 
                  className="text-xl font-bold flex items-center gap-3 text-gray-900"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >
                    <Drone className="h-7 w-7 text-purple-600" />
                    <motion.div 
                      className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  DroneFlow
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-2"
                  >
                    <Zap className="h-4 w-4 text-purple-500" />
                  </motion.div>
                </motion.h1>
              </Link>
            </motion.div>
          </div>
          <div className="flex">
            <div className="ml-10 flex items-baseline space-x-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.path}
                      data-testid={`link-${item.path.replace('/', '')}`}
                    >
                      <motion.div
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 relative overflow-hidden ${
                          active
                            ? 'text-white shadow-lg'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        style={{
                          background: active ? 'var(--gradient-primary)' : 'transparent'
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: active ? undefined : 'rgba(139, 92, 246, 0.05)'
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {active && (
                          <motion.div
                            className="absolute inset-0 bg-white opacity-20"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                        )}
                        <Icon className="h-4 w-4" />
                        {item.label}
                        {active && (
                          <motion.div
                            className="absolute -bottom-1 left-1/2 w-1 h-1 bg-white rounded-full"
                            layoutId="activeIndicator"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ x: '-50%' }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;