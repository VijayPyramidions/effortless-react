import React from 'react';
import { Line } from 'react-chartjs-2';
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
// import { FormattedAmount } from '@components/formattedValue/FormattedValue';

const RevenueChart = (props) => {
  const { labels, widthProps, heightProps, data, setChartRef } = props;
  const chartRef = React.useRef();

  React.useEffect(() => {
    if (setChartRef) {
      setChartRef(chartRef);
    }
  }, [chartRef]);

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

  const legend = {
    display: true,
    position: 'bottom',
    labels: {
      fontColor: '#323130',
      fontSize: 14,
    },
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: {
        grid: {
          display: false,
        },
      },
      yAxes: {
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
              return n;
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
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.label || '';

            if (label) {
              label += ': ';
            }
            if (context.dataset.data) {
              label += new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(context.raw);
            }
            return label;
          },
        },
      },
      title: {
        display: true,
        text: 'Sales v. Collection',
        align: 'start',
        color: '#000',
        font: {
          weight: 900,
          size: 15,
          family: 'Helvetica, Arial, sans-serif',
        },
        padding: {
          bottom: 30,
        },
      },
    },
    elements: { line: { fill: false } },
  };

  const dataVal = {
    labels,
    datasets: [
      {
        label: data && data.length > 0 && data[0].label,
        data: data && data.length > 0 && data[0].data,
        // fill: true,
        borderColor: '#FF0000',
        backgroundColor: '#FF0000',
        pointRadius: 0,
      },
      {
        label: data && data.length > 0 && data[1].label,
        data: data && data.length > 0 && data[1].data,
        // fill: true,
        borderColor: '#00A676',
        backgroundColor: '#00A676',
        pointRadius: 0,
      },
    ],
  };
  return (
    <div style={{ margin: '20px' }}>
      {/* <Chart
        options={dataVal?.options}
        series={dataVal?.series}
        type="line"
        width={widthProps || '100%'}
        height={heightProps || '350px'}
      /> */}
      <Line
        data={dataVal}
        legend={legend}
        options={options}
        width={widthProps || '100%'}
        height={heightProps || '60'}
        ref={chartRef}
      />
    </div>
  );
};

export default RevenueChart;
