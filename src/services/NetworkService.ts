import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import type { NetworkStatus } from '../models/types';

type NetworkListener = (status: NetworkStatus) => void;

let currentStatus: NetworkStatus = 'unknown';
const listeners: Set<NetworkListener> = new Set();

function mapState(state: NetInfoState): NetworkStatus {
  if (state.isConnected === null) return 'unknown';
  return state.isConnected && state.isInternetReachable !== false ? 'online' : 'offline';
}

const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
  const newStatus = mapState(state);
  if (newStatus !== currentStatus) {
    currentStatus = newStatus;
    listeners.forEach((fn) => fn(newStatus));
  }
});

export const NetworkService = {
  getStatus(): NetworkStatus {
    return currentStatus;
  },

  async checkNow(): Promise<NetworkStatus> {
    const state = await NetInfo.fetch();
    currentStatus = mapState(state);
    return currentStatus;
  },

  subscribe(listener: NetworkListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  cleanup() {
    unsubscribeNetInfo();
    listeners.clear();
  },
};
