import React from "react";
import { Card } from "flowbite-react";
import { Chart as ChartJS } from "chart.js/auto";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Bubble,
  Scatter,
} from "react-chartjs-2";

const Box = () => {
  return (
    <>
      <div className="h-screen p-4 flex items-center justify-center">
        <div className="w-full max-w-6xl h-full bg-gray-200 p-4 rounded-lg flex gap-4">
          {/* Left large content box */}
          <div className="flex-1 bg-white rounded-lg shadow-md">
            <div className="flex-1 rounded-2xl h-full">
              <Line
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                  ],
                  datasets: [
                    {
                      label: "My First dataset",
                      backgroundColor: "rgba(144, 224, 239,0.2)",
                      borderColor: "rgba(0, 119, 182,1)",
                      borderWidth: 1,
                      hoverBackgroundColor: "rgba(255, 214, 255,0.4)",
                      hoverBorderColor: "rgba(0, 119, 182,1)",
                      data: [65, 59, 80, 81, 56, 55, 40],
                    },
                  ],
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>

          {/* Right sidebar with stacked divs */}
          <div className="w-1/3 flex flex-col gap-4">
            <div className="h-1/4 bg-white rounded-lg shadow-md flex-1">
              <Card href="#" className="max-w-sm">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Noteworthy technology acquisitions 2021
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Here are the biggest enterprise technology acquisitions of
                  2021 so far, in reverse chronological order.
                </p>
              </Card>
            </div>
            <div className="h-1/4 bg-white rounded-lg flex-1">
              <Card href="#" className="max-w-sm">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Noteworthy technology acquisitions 2021
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Here are the biggest enterprise technology acquisitions of
                  2021 so far, in reverse chronological order.
                </p>
              </Card>
            </div>
            <div className="h-1/4 bg-white rounded-lg flex-1">
              <Card href="#" className="max-w-sm">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Noteworthy technology acquisitions 2021
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Here are the biggest enterprise technology acquisitions of
                  2021 so far, in reverse chronological order.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Box;
