import React from 'react';
import * as Mui from '@mui/material';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import * as css from '../dashboardStyles.scss';

const Chart5 = (props) => {
  const { labels } = props;
  const { data } = props;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );

  const legend = {
    display: true,
    position: 'bottom',
    labels: {
      fontColor: '#323130',
      fontSize: 14,
    },
  };

  const options = {
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          callback: (value) => {
            const ranges = [
              { divider: 1e6, suffix: 'M' },
              { divider: 1e3, suffix: 'k' },
            ];
            function formatNumber(n) {
              let i;
              for (i = 0; i < ranges.length; i += 1) {
                if (Math.abs(n) >= ranges[i].divider) {
                  return (n / ranges[i].divider).toString() + ranges[i].suffix;
                }
              }
              return n === 0 ? 0 : n.toFixed(2);
            }
            return formatNumber(value);
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: (value) => {
            const ranges = [
              { divider: 1e6, suffix: 'M' },
              { divider: 1e3, suffix: 'k' },
            ];
            function formatNumber(n) {
              let i;
              for (i = 0; i < ranges.length; i += 1) {
                if (n >= ranges[i].divider) {
                  return (n / ranges[i].divider).toString() + ranges[i].suffix;
                }
              }
              return n === 0 ? 0 : n.toFixed(2);
            }
            return formatNumber(value);
          },
        },
      },
    },

    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
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
      tooltip:{
        callbacks: {
          label: (context) => {
              let label = context.label || '';

              if (label) {
                  label += ': ';
              }
              if (context.dataset.data) {
                  label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.raw);
              }
              return label;
          }
        }
      }
    },
  };

  const dataVal = {
    labels: (labels?.length > 0 && labels) || [],
    datasets: [
      {
        label: data && data.length > 0 && data[0].label,
        data: data && data.length > 0 && data[0].data,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgb(53, 162, 235)',
        yAxisID: 'y',
      },
      {
        label: data && data.length > 0 && data[1].label,
        data: data && data.length > 0 && data[1].data,
        borderColor: '#B9BDC5',
        backgroundColor: '#B9BDC5',
        yAxisID: 'y1',
      },
    ],
  };
  const device = localStorage.getItem('device_detect');

  return (
    <>
      {device === 'desktop' ? (
        <>
          {labels && (
            <div style={{ marginTop: '3rem' }}>
              <Line options={options} data={dataVal} height="120" />
            </div>
          )}
        </>
      ) : (
        <>
          {labels?.length > 0 && (
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
                  <Mui.Typography noWrap>Cashburn and Runway</Mui.Typography>
                  <div style={{ marginTop: '1rem' }} className={css.fifthchart}>
                    <Line
                      data={dataVal}
                      legend={legend}
                      options={options}
                      height="300"
                    />
                  </div>
                </Mui.Stack>
              </Mui.Card>
            </Mui.Stack>
          )}
        </>
      )}
    </>
  );
};

export default Chart5;
