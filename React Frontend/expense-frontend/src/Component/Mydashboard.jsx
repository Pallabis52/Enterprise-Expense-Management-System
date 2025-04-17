import React, { useEffect, useState } from "react";
import Deshboard from "./Deshboard";
import apiExpense from "../ApiHandling/AxiosExpenseConfig";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Mydashboard() {
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [],
  });
  const [monthlyData, setMonthlyData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    apiExpense.get("get").then((res) => {
      const data = res.data;
      const catSums = {};
      data.forEach(({ category, amount }) => {
        catSums[category] = (catSums[category] || 0) + amount;
      });
      const catLabels = Object.keys(catSums);
      const catValues = Object.values(catSums);
      setCategoryData({
        labels: catLabels,
        datasets: [
          {
            data: catValues,
            backgroundColor: catLabels.map(
              (_, i) => `hsl(${(i * 360) / catLabels.length}, 70%, 50%)`
            ),
          },
        ],
      });

      const monSums = {};
      data.forEach(({ date, amount }) => {
        const key = new Date(date).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        monSums[key] = (monSums[key] || 0) + amount;
      });
      const monLabels = Object.keys(monSums).sort(
        (a, b) => new Date(a) - new Date(b)
      );

      const monValues = monLabels.map((l) => monSums[l]);
      
      setMonthlyData({
        labels: monLabels,
        datasets: [{ label: "Expenses", data: monValues }],
      });
    });
  }, []);

  return (
    <div className="flex h-screen">
      <Deshboard />
      <div className="flex-grow p-6 overflow-y-auto bg-gray-200">
        <h1 className="text-3xl font-bold mb-6">Expense Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-semibold mb-4">By Category</h2>
            <Pie data={categoryData} />
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
            <Bar data={monthlyData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mydashboard;
