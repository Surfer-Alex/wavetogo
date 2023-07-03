import { create } from 'zustand';
// import {devtools} from 'zustand/middleware'

interface Spot {
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
  lat:number;
  lon:number;
}

interface State {
  spotData: {
    data: {
      spots: Spot[];
    };
  };
  fetch: (_pond: string) => void;
}

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

// setData:()=>{
//     set({
//         name:'josh',
//         price:456,
//         cartTotal:4567,
//     })
// }
