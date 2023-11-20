import React from 'react';
import AppContext from '@root/AppContext.jsx';
import * as Mui from '@mui/material';
import { withStyles } from '@material-ui/core';
import { Bar, Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
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
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import * as css from '../dashboardStyles.scss';

const Chart4 = (props) => {
  // const chartValue = props.chartValue;
  const { userPermissions } = React.useContext(AppContext);
  const { ftm } = props;
  const { ytd } = props;
  const { monthly } = props;
  const [chartData, setChartData] = React.useState(ftm?.datasets.data);
  const [chartLabel, setChartLabel] = React.useState(ftm?.datasets.labels);
  const [chartDataMonthly, setChartDataMonthly] = React.useState(
    ftm?.datasets.data,
  );
  const [chartLabelMonthly, setChartLabelMonthly] = React.useState(
    ftm?.datasets.labels,
  );
  const navigate = useNavigate();
  const device = localStorage.getItem('device_detect');
  const [tabVal, setTabVal] = React.useState(0);

  const [userRolesInvoicing, setUserRolesInvoicing] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Invoicing || {})?.length > 0) {
      setUserRolesInvoicing({ ...userPermissions?.Invoicing });
    }
  }, [userPermissions]);

  const handleTabChange = (event, newValue) => {
    setTabVal(newValue);
    if (newValue === 0) {
      setChartData(ftm?.datasets?.data);
      setChartLabel(ftm?.datasets?.labels);
    } else if (newValue === 1) {
      setChartData(ytd?.datasets?.map((a) => a?.data));
      setChartLabel(ytd?.datasets?.map((a) => a?.label));
    } else if (newValue === 2) {
      setChartDataMonthly(monthly?.datasets);
      setChartLabelMonthly(monthly?.labels);
    }
  };

  React.useMemo(() => {
    if (ftm?.datasets?.data) {
      setChartData(ftm?.datasets?.data);
      setChartLabel(ftm?.datasets?.labels);
    }
  }, [ftm?.datasets?.data, ftm?.datasets?.labels]);

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

  const data = {
    labels: chartLabel?.length > 0 && chartLabel,
    datasets: [
      {
        // label: "Population (millions)",
        width: 3,
        backgroundColor: ['#50B720', '#00A4D8', '#E17D7D'],
        // barPercentage: 50,
        // barThickness: 6,

        maxBarThickness: 35,
        // minBarLength: 20,
        data: chartData?.length > 0 && chartData,
        borderRadius: 5,
      },
    ],
  };
  const options_1 = {
    onClick: () => {
      if (!userRolesInvoicing?.Invoicing) {
        setHavePermission({ open: true, back: () => {
          setHavePermission({ open: false });
        }, });
        return;
      }
      navigate('/invoice-approved',{state:{ from:'dashboard', fromDate:moment().startOf('month').format('YYYY-MM-DD'),endDate: moment().endOf('month').format('YYYY-MM-DD')}});
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: false,
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
    scales: {
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
                if (n >= ranges[i].divider) {
                  return (n / ranges[i].divider).toString() + ranges[i].suffix;
                }
              }
              return n;
            }
            return formatNumber(Math.floor(value));
          },
        },
      },
    },
  };

  const options_2 = {
    onClick: () => {
      if (!userRolesInvoicing?.Invoicing) {
        setHavePermission({ open: true, back: () => {
          setHavePermission({ open: false });
        }, });
        return;
      }
      navigate('/invoice-approved',{state:{ from:'dashboard', fromDate:moment().startOf('year').format('YYYY-MM-DD'),endDate: moment().endOf('year').format('YYYY-MM-DD')}});
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: false,
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
    scales: {
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
                if (n >= ranges[i].divider) {
                  return (n / ranges[i].divider).toString() + ranges[i].suffix;
                }
              }
              return n;
            }
            return formatNumber(Math.floor(value));
          },
        },
      },
    },
  };

  const dataLine = {
    labels: chartLabelMonthly,
    datasets: [
      {
        label: chartDataMonthly && chartDataMonthly[0].label,
        data: chartDataMonthly && chartDataMonthly[0].data,
        fill: false,
        lineTension: 0.5,
        backgroundColor: '#4182EB',
        borderColor: '#4182EB',
        
      },
      {
        label: chartDataMonthly && chartDataMonthly[1].label,
        data: chartDataMonthly && chartDataMonthly[1].data,
        fill: false,
        lineTension: 0.5,
        backgroundColor: '#334399',
        borderColor: '#334399',
      },
      {
        label: chartDataMonthly && chartDataMonthly[2].label,
        data: chartDataMonthly && chartDataMonthly[2].data,
        fill: false,
        lineTension: 0.5,
        backgroundColor: '#FACE70',
        borderColor: '#FACE70',
      },
    ],
  };

  const legend = {
    display: true,
    position: 'bottom',
    labels: {
      fontColor: 'red',
      fontSize: 14,
    },
  };

  const optionsLine = {
    onClick: () => {
      if (!userRolesInvoicing?.Invoicing) {
        setHavePermission({ open: true, back: () => {
          setHavePermission({ open: false });
        }, });
        return;
      }
      navigate('/invoice-approved',{state:{ from:'dashboard', fromDate:moment().startOf('month').format('YYYY-MM-DD'),endDate: moment().endOf('month').format('YYYY-MM-DD')}});
    },
    scales: {
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
                if (n >= ranges[i].divider) {
                  return (n / ranges[i].divider).toString() + ranges[i].suffix;
                }
              }
              return n;
            }
            return formatNumber(Math.floor(value));
          },
        },
      },
    },
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
      // title: {
      //   display: true,
      //   text: 'Chart.js Line Chart',
      // },
    },
  };

  const CssTab = withStyles({
    root: {
      '& .css-1h9z7r5-MuiButtonBase-root-MuiTab-root ': {
        fontSize: '12px',
        minWidth: device === 'desktop' ? '' : '75px',
      },
      '& .css-heg063-MuiTabs-flexContainer': {
        justifyContent: 'center',
        borderBottom: '1px solid grey',
      },
      '& .css-1ujykiq-MuiButtonBase-root-MuiTab-root.Mui-selected': {
        color: '#F08B32',
      },
      '& .css-1h9z7r5-MuiButtonBase-root-MuiTab-root.Mui-selected': {
        color: '#F08B32',
      },
    },
  })(Mui.Tabs);
  return (
    <>
      {device === 'desktop' ? (
        <>
          <Mui.Stack style={{ textAlign: 'center', margin: '1rem' }}>
            <CssTab
              value={tabVal}
              onChange={handleTabChange}
              variant="fullWidth"
              TabIndicatorProps={{
                style: {
                  background: '#F08B32',
                  textColor: '#F08B32',
                  // width: '90px',
                },
              }}
            >
              <Mui.Tab label="FTM" />
              <Mui.Tab label="YTD" />
              <Mui.Tab label="Monthly" />
            </CssTab>
            <div style={{ marginTop: '3rem' }}>
              {tabVal === 2 ? (
                <Line
                  data={dataLine}
                  legend={legend}
                  options={optionsLine}
                  height="100"
                />
              ) : (
                <Bar options={tabVal === 1 ? options_2 : options_1} data={data} height="100" />
              )}
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
                <Mui.Typography noWrap>Sales Performance</Mui.Typography>
                <CssTab
                  value={tabVal}
                  onChange={handleTabChange}
                  TabIndicatorProps={{
                    style: {
                      background: '#F08B32',
                      textColor: '#F08B32',
                      width: '90px',
                    },
                  }}
                >
                  <Mui.Tab label="FTM" />
                  <Mui.Tab label="YTD" />
                  <Mui.Tab label="Monthly" />
                </CssTab>
                <div style={{ marginTop: '1rem' }} className={css.fourthchart}>
                  {tabVal === 2 ? (
                    <Line
                      data={dataLine}
                      legend={legend}
                      options={optionsLine}
                      height="240"
                    />
                  ) : (
                    <Bar options={tabVal === 1 ? options_2 : options_1} data={data} height="240" />
                  )}
                </div>
              </Mui.Stack>
            </Mui.Card>
          </Mui.Stack>
        </>
      )}
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default Chart4;
