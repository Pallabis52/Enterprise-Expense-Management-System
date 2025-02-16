import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const Analytics = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/analytics`).then((response) => {
      setChartData({
        labels: response.data.categories,
        datasets: [
          {
            label: "Expenses by Category",
            data: response.data.amounts,
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
          },
        ],
      });
    });
  }, []);

  return (
    <Container>
      <Typography variant="h4">Expense Analytics</Typography>
      <Bar data={chartData} />
    </Container>
  );
};

export default Analytics;
