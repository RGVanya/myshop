import React, { createContext, useContext, useEffect, useState } from 'react';
import { NetworkService } from '../services/NetworkService';
import type { NetworkStatus } from '../models/types';

interface NetworkContextValue {
  status: NetworkStatus;
  isOnline: boolean;
  checkNow: () => Promise<NetworkStatus>;
}

const NetworkContext = createContext<NetworkContextValue>({
  status: 'unknown',
  isOnline: true,
  checkNow: async () => 'unknown',
});

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<NetworkStatus>('unknown');

  useEffect(() => {
    NetworkService.checkNow().then(setStatus);
    const unsub = NetworkService.subscribe(setStatus);
    return unsub;
  }, []);

  const value: NetworkContextValue = {
    status,
    isOnline: status !== 'offline',
    checkNow: async () => {
      const s = await NetworkService.checkNow();
      setStatus(s);
      return s;
    },
  };

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
}

export const useNetwork = () => useContext(NetworkContext);
