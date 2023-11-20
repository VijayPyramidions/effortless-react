import React from 'react';
import { Doughnut } from 'react-chartjs-2';
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

const AgeingChart = (props) => {
  const { labels, data, heightProps, setChartRef, title } = props;
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
  const device = localStorage.getItem('device_detect');

  const options = {
    maintainAspectRatio: false,
    cutout: 75,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          textAlign: 'center',
          padding: 20,
          display: 'grid',
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
        display: !!title,
        text: title || '',
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
  };

  const chartData = {
    datasets: [
      {
        label: 'Receviables Dataset',
        data: data?.length > 0 ? data : [],
        backgroundColor: [
          '#7CC8FF',
          '#DF81FF',
          '#7E7CFF',
          '#FFC7A7',
          '#FF8989',
          '#FFE589',
        ],
        borderRadius: 5,
      },
    ],
    labels: labels?.length > 0 ? labels : [],
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: device === 'mobile' ? '2vh 2vw' : '20px',
      }}
    >
      <Doughnut
        data={chartData}
        width={220}
        height={heightProps}
        options={options}
        ref={chartRef}
      />
      {/* <Chart
        options={chartData?.options}
        series={chartData?.series}
        type="donut"
        // width="100%"
        // height="370px"
        width={300}
        height={heightProps || 300}
      /> */}
    </div>
  );
};

export default AgeingChart;
