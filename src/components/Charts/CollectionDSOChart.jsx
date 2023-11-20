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
  BarController,
  LineController,
  Filler,
} from 'chart.js';

const CollectionDSOChart = (props) => {
  const { dataLine, heightProps, setChartRef, view, title } = props;
  const chartRef = React.useRef();
  const device = localStorage.getItem('device_detect');

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
    Title,
    Tooltip,
    Legend,
    BarController,
    LineController,
    Filler,
  );

  const HoverView = (context) => {
    let label = context.label || '';
    if (label) {
      label += ': ';
    }
    if (context.dataset.data && view === 'rupees') {
      label += new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(context.raw);
    } else if (context.dataset.data && view !== '') {
      label += `${context.raw} Days`;
    } else if (context.dataset.data && view === '') {
      label += `${context.raw}`;
    }
    return label;
  };

  const optionsLine = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => HoverView(context),
        },
      },
      title: {
        display: true,
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
    scales: {
      y: {
        display: false,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: device === 'mobile' ? 10 : 15,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    elements: { line: { fill: true } },
  };

  return (
    <div style={{ margin: '0 2vw 2vh' }}>
      <Line
        data={dataLine}
        options={optionsLine}
        height={heightProps || '150px'}
        ref={chartRef}
      />
    </div>
  );
};

export default CollectionDSOChart;
