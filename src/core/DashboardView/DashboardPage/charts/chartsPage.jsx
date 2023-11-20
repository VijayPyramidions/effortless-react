import React from 'react';
import Chart from 'react-apexcharts';

const ChartsPage = () => {
  const series = [
    {
      name: 'Desktops',
      data: [60, 50, 55, 40, 30, 15, 10],
    },
  ];
  const options = {
    colors: ['#000000'],
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    fill: {
      colors: '#f3f3f3',
    },
    title: {
      text: 'Product Trends by Month',
      align: 'left',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    },
  };
  return (
    <div>
      <Chart options={options} series={series} type="line" width="300" />
    </div>
  );
};

export default ChartsPage;
