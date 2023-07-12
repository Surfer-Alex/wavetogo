'use client';
import React, { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import 'luxon';
import 'chartjs-adapter-luxon';

type WaveData = {
  timestamp: number;
  surf: {
    max: number;
  };
};

type WindData = {
  timestamp: number;
  speed: number;
};

type TideData = {
  timestamp: number;
  height: number;
};

type WaveInfo = {
  waveData: number[];
  waveTimeData: number[];
} | null;

type WindInfo = {
  windData: number[];
  windTimeData: number[];
} | null;

type TideInfo = {
  tideData: number[];
  tideTimeData: number[];
} | null;

interface ChartProps {
  id: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  TimeScale,
  Filler
);

//過濾預測資料fn()
//   function filterByIndex<T>(arr: T[], divisor: number): { timestamp: number, speed: number}[]{
//     return arr.filter((_, index) => index % divisor === 0);
//   }

const getForecastData = async (
  setWaveInfo: React.Dispatch<React.SetStateAction<WaveInfo>>,
  setWindInfo: React.Dispatch<React.SetStateAction<WindInfo>>,
  setTideInfo: React.Dispatch<React.SetStateAction<TideInfo>>,
  id: string
) => {
  try {
    const forecastRes = await fetch(`/api/wave/?id=${id}`);

    const parsedForecast = await forecastRes.json();

    const waveTimeData = parsedForecast.waveData.data.wave
      .filter((_: number, index: number) => index % 3 === 0)
      .map((i: WaveData) => i.timestamp);

    const waveData = parsedForecast.waveData.data.wave
      .filter((_: number, index: number) => index % 3 === 0)
      .map((i: WaveData) => i.surf.max);
    setWaveInfo({ waveData, waveTimeData });

    const windTimeData = parsedForecast.windData.data.wind
      .filter((_: number, index: number) => index % 3 === 0)
      .map((i: WindData) => i.timestamp);
    const windData = parsedForecast.windData.data.wind
      .filter((_: number, index: number) => index % 3 === 0)
      .map((i: WindData) => i.speed);
    setWindInfo({ windData, windTimeData });

    const tideTimeData = parsedForecast.tideData.data.tides.map(
      (i: TideData) => i.timestamp
    );
    const tideData = parsedForecast.tideData.data.tides.map(
      (i: TideData) => i.height
    );
    setTideInfo({ tideData, tideTimeData });
  } catch (error) {
    console.error(error);
  }
};

export default function Chart({ id }: ChartProps) {
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const chart2Ref = useRef<ChartJS<'bar'>>(null);

  const [waveInfo, setWaveInfo] = useState<WaveInfo>(null);
  const [windInfo, setWindInfo] = useState<WindInfo>(null);
  const [tideInfo, setTideInfo] = useState<TideInfo>(null);

  useEffect(() => {
    getForecastData(setWaveInfo, setWindInfo, setTideInfo, id);
  }, []);

  const hover1 = (move: React.MouseEvent) => {
    const chart = chartRef.current;
    const chart2 = chart2Ref.current;
    if (chart && chart2) {
      const points = chart.getElementsAtEventForMode(
        move.nativeEvent,
        'nearest',
        { intersect: true },
        true
      );
      if (points[0]) {
        const dataset = points[0].datasetIndex;
        const datapoint = points[0].index;
        chart2.tooltip?.setActiveElements(
          [{ datasetIndex: dataset, index: datapoint }],
          { x: 0, y: 0 }
        );
        chart2.setActiveElements([{ datasetIndex: dataset, index: datapoint }]);
        chart2.update();
      } else {
        chart2.tooltip?.setActiveElements([], { x: 0, y: 0 });
        chart2.setActiveElements([]);
      }
    }
  };
  const hover2 = (move: React.MouseEvent) => {
    const chart = chartRef.current;
    const chart2 = chart2Ref.current;
    if (chart && chart2) {
      const points = chart2.getElementsAtEventForMode(
        move.nativeEvent,
        'nearest',
        { intersect: true },
        true
      );

      if (points[0]) {
        const dataset = points[0].datasetIndex;
        const datapoint = points[0].index;
        chart.tooltip?.setActiveElements(
          [{ datasetIndex: dataset, index: datapoint }],
          { x: 0, y: 0 }
        );
        chart.setActiveElements([{ datasetIndex: dataset, index: datapoint }]);
        chart.update();
      } else {
        chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
        chart.setActiveElements([]);
      }
    }
  };

  const waveChartData: ChartData<'bar'>= {
    labels: waveInfo?.waveTimeData.map((i) => new Date(i * 1000)),
    datasets: [
      { 
        label: '最大浪高',
        data: waveInfo?.waveData||[],
        backgroundColor: 'rgba(0, 108, 250, 0.5)',
      },
    ],
  };
  const windChartData: ChartData<'bar'> = {
    labels: windInfo?.windTimeData.map((i) => new Date(i * 1000)),
    datasets: [
      {
        
        label: '風速',
        data: windInfo?.windData||[],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  const up = (ctx: any, value: string) =>
    ctx.p0.parsed.y < ctx.p1.parsed.y ? value : undefined;
  const down = (ctx: any, value: string) =>
    ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;

  const tidesData: ChartData<'line'> = {
    labels: tideInfo?.tideTimeData.map((i) => new Date(i * 1000)),
    datasets: [
      {
        label: '潮汐高度',
        data: tideInfo?.tideData ?? [],
        backgroundColor: '#000000',
        fill: true,
        segment: {
          // borderColor: (ctx) => up(ctx, '#a1cfff') || down(ctx, '#863031'),
          borderColor:'transparent',
          backgroundColor: (ctx) => up(ctx, '#00ff155e') || down(ctx, '#135914'),
        },
      },
    ],
  };
  const options: ChartOptions<'bar'> = {
    maintainAspectRatio:false,
    
    scales: {
      
      x: {
        type: 'time',
        time: {
          unit: 'hour',
        },
        grid: {
          display: false,
          tickLength: 0,
        },
        border: {
          display: false,
        },
        ticks: {
          
          stepSize: 3,
          callback: (value) => {
            const date = new Date(value);
            const hour = date.getHours();
            
            return hour;
          }
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          
          tickLength: 0,
        },suggestedMax: 2,
      },
      x2: {
        position: 'top',
        type: 'time',
        time: {
          unit: 'day',
          round: 'day',
        },
        grid: {
          tickColor: 'black',
          // color: 'black',
          tickLength: 0,
        },
        ticks: {
          source: 'labels',
        },
      },
    },
    responsive: true,

    plugins: {
      
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Waves Forecast"
      },
      tooltip: {
        callbacks: {
          footer: (tooltipItems: { dataIndex: number }[]) => {
            const index = tooltipItems[0].dataIndex;
            let timeString;
            if (waveInfo && waveInfo.waveTimeData) {
              timeString = new Date(
                waveInfo.waveTimeData[index] * 1000
              ).toTimeString();
            }
            return timeString;
          },
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: new Date().toISOString(),
            xMax: new Date().toISOString(),
            label: {
              display: true,
              content: (ctx) =>
                `NOW:${new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} 浪高:${closestValue(ctx)}m `,
              position: 'start',
            },
          },
        },
      },
    },
  };
  const windOptions: ChartOptions<'bar'> = {
    maintainAspectRatio:false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
        },
        ticks: {
          stepSize: 3,
          callback: (value) => {
            const date = new Date(value);
            const hour = date.getHours();
            return hour;
          }
        },
        grid: {
          display: false,
          tickLength: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          
          tickLength: 0,
        },
      },
      x2: {
        position: 'top',
        type: 'time',
        time: {
          unit: 'day',
          round: 'day',
        },
        grid: {
          tickColor: 'black',
          // color: 'black',
          tickLength: 0,
        },
        ticks: {
          display:false,
          // source: 'labels',
        },
      },
    },
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Winds Forecast"
      },
      tooltip: {
        callbacks: {
          footer: (tooltipItems: { dataIndex: number }[]) => {
            const index = tooltipItems[0].dataIndex;
            let timeString;
            if (windInfo && windInfo.windTimeData) {
              timeString = new Date(
                windInfo.windTimeData[index] * 1000
              ).toTimeString();
            }
            return timeString;
          },
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: new Date().toISOString(),
            xMax: new Date().toISOString(),
            label: {
              display: true,
              content: (ctx) =>
                `NOW:${new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} 風速:${closestValue(ctx)?.toFixed(2)} kph`,
              position: 'start',
            },
          },
        },
      },
    },
  };
  //fix this types
  function closestValue(ctx: any) {
    const dataset = ctx.chart.data.datasets[0];
    const labels = ctx.chart.data.labels;
    const currentTime = new Date();
    const closestIndex = labels?.reduce(
      (acc: number, curr: number, index: number) => {
        const currTime = new Date(curr);
        const currDiff = Math.abs(currentTime.getTime() - currTime.getTime());
        const accDiff = Math.abs(
          currentTime.getTime() - new Date(labels[acc]).getTime()
        );
        return currDiff < accDiff ? index : acc;
      },
      0
    );
    return dataset.data[closestIndex];
  }
  const tideOptions: ChartOptions<'line'> = {
    maintainAspectRatio:false,
    
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
        },
        grid: {
          display: false,
          tickLength: 0,
        },ticks: {
          stepSize: 3,
          callback: (value) => {
            const date = new Date(value);
            const hour = date.getHours();
            return hour;
          }
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          
          tickLength: 0,
        },
      },
      x2: {
        position: 'top',
        type: 'time',
        time: {
          unit: 'day',
        },
        grid: {
          tickColor: 'black',

          // color: 'black',
        },
      },
    },
    responsive: true,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
    },
      legend: {
        display:false
        // position: 'top' as const,
      },
      title: {
        display:true,
        text: 'Tides Forecast',
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: new Date().toISOString(),
            xMax: new Date().toISOString(),
            label: {
              display: true,
              content: (ctx) =>
                `NOW:${new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} 潮高:${closestValue(ctx)}m`,
              position: 'start',
            },
          },
        },
      },
    },
  };

  return (
    <div className='max-w-[1280px] w-full'>
      <div className="h-[300px] w-full px-5 flex justify-center">
        <Bar
          options={options}
          data={waveChartData}
          ref={chartRef}
          onMouseMove={hover1}
        />
      </div>
      <div className="h-[300px] w-full px-5 flex justify-center">
        <Bar
          options={windOptions}
          data={windChartData}
          ref={chart2Ref}
          onMouseMove={hover2}
        />
      </div>
      <div className="h-[300px] w-full px-5 flex justify-center">
        <Line options={tideOptions} data={tidesData} />
      </div>
    </div>
  );
}
