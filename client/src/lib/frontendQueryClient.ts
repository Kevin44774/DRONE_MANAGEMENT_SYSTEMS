import { QueryClient } from '@tanstack/react-query';
import { MockApiService } from './mockApiService';

// Frontend-only query functions that use mock data service
const frontendQueryFn = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const [url] = queryKey as [string];
  
  // Route API calls to mock service methods
  switch (url) {
    case '/api/drones':
      return MockApiService.getDrones();
    
    case '/api/missions':
      return MockApiService.getMissions();
    
    case '/api/organization/stats':
      return MockApiService.getOrganizationStats();
    
    default:
      // Handle specific drone/mission requests
      if (url.startsWith('/api/drones/')) {
        const droneId = url.split('/')[3];
        return MockApiService.getDrone(droneId);
      }
      
      if (url.startsWith('/api/missions/')) {
        const missionId = url.split('/')[3];
        return MockApiService.getMission(missionId);
      }
      
      throw new Error(`Unknown endpoint: ${url}`);
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: frontendQueryFn,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

// Frontend-only API request function
export async function apiRequest(url: string, options: RequestInit = {}) {
  const method = options.method || 'GET';
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (method === 'POST' && url === '/api/missions') {
    const body = options.body ? JSON.parse(options.body as string) : {};
    return MockApiService.createMission(body);
  }
  
  if (method === 'PATCH') {
    const body = options.body ? JSON.parse(options.body as string) : {};
    
    if (url.startsWith('/api/drones/')) {
      const droneId = url.split('/')[3];
      return MockApiService.updateDrone(droneId, body);
    }
    
    if (url.startsWith('/api/missions/')) {
      const missionId = url.split('/')[3];
      return MockApiService.updateMission(missionId, body);
    }
  }
  
  throw new Error(`Unsupported operation: ${method} ${url}`);
}