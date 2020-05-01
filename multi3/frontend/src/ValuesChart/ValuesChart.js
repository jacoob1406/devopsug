import React from "react";
import { Bar } from "react-chartjs-2";
import { daysOfWeek } from "../costants";

const getDaysValues = (values) => ({
  labels: Object.values(daysOfWeek),
  legend: {
    display: false,
  },
  datasets: [
    {
      data: values,
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
});

function ValuesChart({ daysValues }) {
  return (
    <Bar
      data={getDaysValues(daysValues)}
      height={400}
      width={700}
      options={{
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      }}
    />
  );
}

export default ValuesChart;
