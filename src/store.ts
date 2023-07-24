import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UserInfo } from '../types/userTypes';
export interface Spot {
  _id: string;
  weather: {
    condition: string;
    temperature: number;
  };
  waveHeight: {
    humanRelation: string;
    min: number;
    max: number;
  };
  conditions: {
    value: string;
  };
  wind: {
    gust: number;
    direction: number;
    directionType: string;
    speed: number;
  };
  tide: {
    current: {
      height: number;
    };
    next: {
      height: number;
      type: string;
      timestamp: number;
    };
  };
  waterTemp: {
    min: number;
    max: number;
  };
  lat: number;
  lon: number;
  name: string;
  rating: {
    key: string;
  };
}

interface State {
  spotData: {
    data: {
      spots: Spot[];
    };
  };
  fetch: (pond: string) => void;
}
type UserPrivateState = {
  userInfo: UserInfo | null;
};
export const useStore = create<State>((set) => ({
  spotData: {
    data: {
      spots: [],
    },
  },
  fetch: async (pond) => {
    const response = await fetch(pond);
    const data = await response.json();
    set({
      spotData: {
        data: {
          spots: data.data.spots,
        },
      },
    });
  },
}));

export const userPrivateStore = create<UserPrivateState>(() => ({
  userInfo: null,
}));
