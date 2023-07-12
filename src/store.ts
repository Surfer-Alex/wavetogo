import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { UserInfo } from '@firebase/auth-types';
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
  name:string;
  rating:{
    key:string;
  }
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

export const userStore = create(
  devtools(
    persist(
      () => ({
        uid: '',
        photoURL:'',
      }),
      {
        name: 'user-auth', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      }
    )
  )
);



export const userPrivateStore = create<UserPrivateState>(() => ({
  userInfo: null,
}));

// setData:()=>{
//     set({
//         name:'josh',
//         price:456,
//         cartTotal:4567,
//     })
// }
