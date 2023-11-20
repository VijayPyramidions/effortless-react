import React from 'react';
import { Line } from 'react-chartjs-2';
import * as Mui from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
} from 'chart.js';
import * as css from '../dashboardStyles.scss';

const Chart2 = () => {
  // const [chartValue] = props;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    DoughnutController,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  );
  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'bottom',
  //     },
  //     title: {
  //       display: true,
  //       text: 'Chart.js Line Chart',
  //     },
  //   },
  // };
  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: false,
      },
    },
    // scales: {
    //   xAxes: [
    //     {
    //       gridLines: {
    //         display: false,
    //       },
    //     },
    //   ],
    //   yAxes: [
    //     {
    //       // stacked: true,
    //       gridLines: {
    //         display: false,
    //       },
    //       ticks: {
    //         beginAtZero: true,
    //       },
    //     },
    //   ],
    // },
    legend: {
      display: true,
    },
    tooltips: {
      enabled: false,
    },
    animations: {
      tension: {
        duration: 0,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true,
      },
    },
  };
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

  const data = {
    labels,

    datasets: [
      // {
      //   label: 'Dataset 1',
      //   data:[56,78,66,44],
      //   borderColor: 'rgb(255, 99, 132)',
      //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
      // },
      {
        label: '',
        data: [2500, 1500, 8200, 3000, 5200],
        fill: true,
        lineTension: 0.5,
        // backgroundColor: '5DD425',
        borderColor: '#5DD425',
      },
    ],
  };
  const device = localStorage.getItem('device_detect');

  return (
    <>
      {device === 'desktop' ? (
        <>
          <Mui.Stack style={{ textAlign: 'center', margin: '1rem' }}>
            <div style={{ marginTop: '1rem' }}>
              <Line data={data} options={options} height="130" />
            </div>
          </Mui.Stack>
        </>
      ) : (
        <>
          <Mui.Stack className={css.chartStack}>
            <Mui.Card
              className={css.chartStackMain}
              style={{
                boxShadow: '6px 7px 10px #e6e6e6, -6px -3px 10px #e6e6e6',
                // height: '324px',
                // width: '279px',
              }}
            >
              <Mui.Stack style={{ textAlign: 'center', margin: '1rem' }}>
                <Mui.Typography noWrap>Sales and Performance</Mui.Typography>
                <div style={{ marginTop: '1rem' }}>
                  <Line data={data} options={options} height="250" />
                </div>
              </Mui.Stack>
            </Mui.Card>
          </Mui.Stack>
        </>
      )}
    </>
  );
};

export default Chart2;
