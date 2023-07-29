import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartData,
  Plugin,
} from "chart.js";
import { Line } from "react-chartjs-2";

interface SpotChartProps {
  randomSpots: { _id: string; name: string }[];
}
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,

  Title,
  Tooltip,
  Filler,
  Legend,
);
interface WaveData {
  timestamp: number;
  surf: {
    min: number;
    max: number;
  };
}
interface InfoData {
  data: {
    wave: WaveData[];
  };
}
interface Conditions {
  am: {
    minHeight: number;
    maxHeight: number;
  };
  pm: {
    minHeight: number;
    maxHeight: number;
  };
}
interface WaveHeight {
  data: {
    conditions: Conditions[];
  };
}

const conditionLabel = (waveHeight: WaveHeight): Plugin => {
  const dailyWaveHeights = waveHeight?.data.conditions.map((day) => {
    const dailyMinHeight = Math.min(day.am.minHeight, day.pm.minHeight);
    const dailyMaxHeight = Math.max(day.am.maxHeight, day.pm.maxHeight);
    return { min: dailyMinHeight, max: dailyMaxHeight };
  });

  return {
    id: "conditionLabel",

    afterDatasetsDraw(chart, args, plugins) {
      const {
        ctx,
        data,
        chartArea: { top, bottom, left, right, width, height },
        scales: { x, y },
      } = chart;
      ctx.save();

      data.labels?.forEach((_, index) => {
        if (index === 0 || index % 8 === 0) {
          const dayIndex = Math.floor(index / 8);
          const text =
            dailyWaveHeights[dayIndex].max === 0
              ? "FLAT"
              : `${dailyWaveHeights[dayIndex].min}-${dailyWaveHeights[dayIndex].max}m`;
          ctx.font = "bold 20px sans-serif";

          ctx.beginPath();
          ctx.fillStyle = "rgba(0,0,0,0.8)";
          ctx.roundRect(
            x.getPixelForValue(index + 3.5) - 50,
            top + height / 2 - 27,
            100,
            30,
            20,
          );
          ctx.fill();
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.fillText(text, x.getPixelForValue(index + 3.5), 40);
        }
      });
    },
  };
};

const options = {
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
        tickLength: 0,
      },
      ticks: {
        display: false,
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
        tickLength: 0,
      },
      ticks: {
        display: false,
      },
      border: {
        display: false,
      },
      suggestedMax: 2,
    },
  },
  responsive: true,
  plugins: {
    tooltip: {
      enabled: false,
    },
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
};

const data = (data: InfoData): ChartData<"line"> => {
  const labels = data?.data.wave
    .filter((_, index) => index % 3 === 0)
    .map((i) => i.timestamp);
  const waveHeight = data?.data.wave
    .filter((_, index) => index % 3 === 0)
    .map((i) => i.surf.max);
  return {
    labels: labels?.map((i) => new Date(i * 1000)),
    datasets: [
      {
        fill: true,
        label: "",
        data: waveHeight,
        borderColor: "rgba(53, 162, 235, 0.5)",
        backgroundColor: (context) => {
          if (!context.chart.chartArea) {
            return;
          }
          const {
            ctx,
            chartArea: { top, bottom },
          } = context.chart;
          const gradient = ctx.createLinearGradient(0, top, 0, bottom);
          gradient.addColorStop(0, "#0a9ddc");
          gradient.addColorStop(1, "rgb(241 245 249)");
          return gradient;
        },
        pointRadius: 0,
        borderWidth: 0,
        tension: 0.4,
      },
    ],
  };
};

function SpotChart({ randomSpots }: SpotChartProps) {
  const [chartData, setChartData] = useState<InfoData[]>([]);
  const [conditionsData, setConditionsData] = useState<WaveHeight[]>([]);

  useEffect(() => {
    fetchData();
  }, [randomSpots]);

  // console.log(chartData[0]);

  const fetchData = async () => {
    const promises = randomSpots.map((spot) =>
      fetch(`/api/wave/?id=${spot._id}&type=wave`),
    );
    const responses = await Promise.all(promises);
    const data = await Promise.all(
      responses.map((response) => response.json()),
    );

    setChartData(data);
    const conditionsPromises = randomSpots.map((spot) =>
      fetch(`/api/wave/?id=${spot._id}&type=conditions`),
    );
    const conditionsResponses = await Promise.all(conditionsPromises);
    const conditionsData = await Promise.all(
      conditionsResponses.map((response) => response.json()),
    );
    setConditionsData(conditionsData);
  };

  const labels = chartData[0]?.data.wave
    .filter((_, index) => index % 24 === 0)
    .map((i) => i.timestamp);
  // console.log(conditionsData);

  if (chartData.length === 0 || conditionsData.length === 0) {
    return (
      <div className="flex h-[550px] items-center justify-center">
        <div
          className="inline-block h-14 w-14 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex justify-center">
      <div className=" flex  w-full">
        <div className="flex w-4/5 flex-col lg:w-1/5 ">
          <div className=" flex h-[50px] w-full items-center justify-center text-2xl font-bold"></div>
          {randomSpots.map((i, idx) => (
            <div
              key={idx}
              className="text-medium mt-4 flex h-[100px]  items-center break-words rounded-l-2xl bg-slate-100 px-6 font-bold text-black sm:text-xl"
            >
              {i.name}
            </div>
          ))}
        </div>
        <div className="flex w-4/5 flex-col overflow-x-auto">
          <div className=" flex h-[50px] w-[639px] lg:w-full">
            {labels.map((timestamp, idx) => {
              const date = new Date(timestamp * 1000);
              const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
              const daysOfWeek = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ];
              const dayOfWeek = daysOfWeek[date.getDay()];
              return (
                <div
                  key={idx}
                  className="flex w-1/5 flex-col justify-center text-center font-bold"
                >
                  <div className=" text-lg">{formattedDate}</div>
                  <div className="text-slate-400">{dayOfWeek}</div>
                </div>
              );
            })}
          </div>
          {chartData.map((_, idx) => {
            return (
              <div
                key={idx}
                className=" mt-4 h-[100px]  w-[639px] bg-slate-100 lg:w-full"
              >
                <Line
                  plugins={[conditionLabel(conditionsData[idx])]}
                  options={options}
                  data={data(chartData[idx])}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SpotChart;
