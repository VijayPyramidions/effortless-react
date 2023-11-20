import React from 'react';
import * as Mui from '@mui/material';
import { Line } from 'react-chartjs-2';
import * as css from '../dashboardStyles.scss';

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Cashburn',
      data: [33, 53, 85, 41, 44, 65],
      fill: true,
      lineTension: 0.5,
      backgroundColor: '#00A4D8',
      borderColor: '#00A4D8',
    },
    {
      label: 'Runway',
      data: [33, 25, 35, 51, 54, 76],
      fill: true,
      lineTension: 0.5,
      backgroundColor: '#00A4D8',

      borderColor: '#A3D8E9',
    },
  ],
};

const legend = {
  display: true,
  position: 'bottom',
  labels: {
    fontColor: '#323130',
    fontSize: 14,
  },
};

const options = {
  // scales: {
  //   yAxes: [
  //     {
  //       ticks: {
  //         suggestedMin: 0,
  //         suggestedMax: 100,
  //       },
  //     },
  //   ],
  // },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 10,
        usePointStyle: true,
        pointStyle: 'circle',
        textAlign: 'center',
        padding: 30,
      },
    },
    // title: {
    //   display: true,
    //   text: 'Chart.js Line Chart',
    // },
  },
};

const Chart6 = () => {
  return (
    <Mui.Stack className={css.chartStack}>
      <Mui.Card
        className={css.chartStackMain}
        style={{
          boxShadow: '6px 7px 10px #e6e6e6, -6px -3px 10px #e6e6e6',
          height: '324px',
          width: '279px',
        }}
      >
        <Mui.Stack style={{ textAlign: 'center', margin: '1rem' }}>
          <Mui.Typography noWrap>Cashburn and Runway</Mui.Typography>
          <div style={{ marginTop: '1rem' }}>
            <Line data={data} legend={legend} options={options} height="300" />
          </div>
        </Mui.Stack>
      </Mui.Card>
    </Mui.Stack>
  );
};

export default Chart6;
