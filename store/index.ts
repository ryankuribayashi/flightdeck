import { create } from 'zustand';

type User = {
  callsign: string;
  displayName: string;
  homeAirport: string;
  avatar: string;
  rank: string;
  spotted: number;
  airports: number;
  nmLogged: number;
  airlines: number;
};

type Store = {
  user: User;
  activeTab: string;
  liveFlightCount: number;
  atcActive: boolean;
  atcAirport: string;
  widgetVisible: boolean;
  setActiveTab: (tab: string) => void;
  setAtcAirport: (airport: string) => void;
  toggleAtc: () => void;
  setWidgetVisible: (v: boolean) => void;
  setLiveFlightCount: (n: number) => void;
};

export const useStore = create<Store>((set) => ({
  user: {
    callsign: 'JA-SPOTTER',
    displayName: 'Ryan K.',
    homeAirport: 'RJTT',
    avatar: 'https://i.pravatar.cc/100?img=51',
    rank: 'SR. SPOTTER',
    spotted: 312,
    airports: 34,
    nmLogged: 284600,
    airlines: 81,
  },
  activeTab: 'feed',
  liveFlightCount: 12847,
  atcActive: false,
  atcAirport: 'RJTT',
  widgetVisible: true,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setAtcAirport: (airport) => set({ atcAirport: airport }),
  toggleAtc: () => set((s) => ({ atcActive: !s.atcActive })),
  setWidgetVisible: (v) => set({ widgetVisible: v }),
  setLiveFlightCount: (n) => set({ liveFlightCount: n }),
}));
