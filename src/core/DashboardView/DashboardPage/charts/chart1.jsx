import React from 'react';
import AppContext from '@root/AppContext.jsx';
import { Doughnut } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core';
import * as Mui from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

const Chart1 = (props) => {
  const { bank, ageing, payables } = props;
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
  const navigate = useNavigate();
  const { userPermissions } = React.useContext(AppContext);
  const [tabVal, setTabVal] = React.useState(0);
  const [cashProportionChartData, setCashProportionChartData] = React.useState(
    bank?.datasets.data,
  );
  const [cashProportionChartLabel, setCashProportionChartLabel] =
    React.useState(bank?.datasets.label);
  const [receivablesChartData, setReceivablesChartData] = React.useState();
  const [receivablesChartLabel, setReceivablesChartLabel] = React.useState();
  const [payablesChartData, setPayablesChartData] = React.useState();
  const [payablesChartLabel, setPayablesChartLabel] = React.useState();
  const [userRolesReceviables, setUserRolesReceviables] = React.useState({});
  const [userRolesPayables, setUserRolesPayables] = React.useState({});
  const [userRolesBanking, setUserRolesBanking] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Receivables || {})?.length > 0) {
      setUserRolesReceviables({ ...userPermissions?.Receivables });
    }
    if (Object.keys(userPermissions?.Payables || {})?.length > 0) {
      setUserRolesPayables({ ...userPermissions?.Payables });
    }
    if (Object.keys(userPermissions?.Banking || {})?.length > 0) {
      setUserRolesBanking({ ...userPermissions?.Banking });
    }
  }, [userPermissions]);

  const handleTabChange = (event, newValue) => {
    setTabVal(newValue);
    if (newValue === 0) {
      setCashProportionChartData(bank?.datasets.data);
      setCashProportionChartLabel(bank?.datasets.label);
    } else if (newValue === 1) {
      const tempData = ageing?.datasets.data;
      const tempLabel = ageing?.datasets.label;

      const index_1 = tempLabel.indexOf('121 to 180');
      if (index_1 > -1) {
        tempLabel.splice(index_1, 1);
        tempData.splice(index_1, 1);
      }
      const index_2 = tempLabel.indexOf('181 to 360');
      if (index_2 > -1) {
        tempLabel.splice(index_2, 1);
        tempData.splice(index_2, 1);
      }
      setReceivablesChartData(tempData);
      setReceivablesChartLabel(tempLabel);
    } else if (newValue === 2) {
      setPayablesChartData(payables?.datasets.data);
      setPayablesChartLabel(payables?.datasets.label);
    }
  };

  const device = localStorage.getItem('device_detect');
  const optionsReceviables = {
    onClick: () => {
      if (!userRolesReceviables['Customer Ageing']?.view_receivable_ageing) {
        setHavePermission({ open: true, back: () => {
          setHavePermission({ open: false });
        }, });
        return;
      }
      navigate('/receivables-ageing');
  },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          textAlign: 'center',
          padding: 20,
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

  const optionsPayables = {
    onClick: () => {
      if (!userRolesPayables['Vendor Ageing']?.view_payable_ageing) {
        setHavePermission({ open: true, back: () => {
          setHavePermission({ open: false });
        }, });
        return;
      }
      navigate('/payables-ageing');
  },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          textAlign: 'center',
          padding: 20,
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

  const optionsCashProposition = {
    onClick: () => {
      if (!userRolesBanking?.Banking) {
        setHavePermission({ open: true, back: () => {
          setHavePermission({ open: false });
        }, });
        return;
      }
      navigate('/banking');
  },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          textAlign: 'center',
          padding: 20,
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

  const CashProportionLabels =
    (cashProportionChartLabel?.length > 0 && cashProportionChartLabel) || [];
  const ReceviablesLabels =
    (receivablesChartLabel?.length > 0 && receivablesChartLabel) || [];
  const PayablesLabels =
    (payablesChartLabel?.length > 0 && payablesChartLabel) || [];

  const CashProportionData = {
    datasets: [
      {
        label: 'Dataset 2',
        data: cashProportionChartData?.length > 0 && cashProportionChartData,
        backgroundColor: ['#B2D9A0', '#94D1E5', '#E5A7A7', '#EDEFFE'],
      },
    ],
    labels: CashProportionLabels,
  };

  const PayablesData = {
    datasets: [
      {
        label: payablesChartLabel,
        data: payablesChartData?.length > 0 && payablesChartData,
        backgroundColor: ['#B2D9A0', '#94D1E5', '#E5A7A7', '#EDEFFE'],
      },
    ],
    labels: PayablesLabels,
  };

  const receviablesData = {
    datasets: [
      {
        label: 'Receviables Dataset',
        data: receivablesChartData?.length > 0 && receivablesChartData,
        backgroundColor: [
          '#7CC8FF',
          '#DF81FF',
          '#7E7CFF',
          '#FFC7A7',
          '#FF8989',
          '#FFE589',
        ],
      },
    ],
    labels: ReceviablesLabels,
  };

  const CssTab = withStyles({
    root: {
      '& .MuiButtonBase-root': {
        fontSize: device === 'desktop' ? '13px' : '11px',
        minWidth: device === 'desktop' ? '' : '80px',
        maxWidth: device === 'desktop' ? '' : '85px',
        overflowWrap: 'break-word',
        padding: device === 'desktop' ? '' : '5px',
        margin: device === 'desktop' ? '' : '3px',
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
          {CashProportionLabels?.length > 0 && (
            <Mui.Stack style={{ textAlign: 'center', margin: '1rem' }}>
              <CssTab
                value={tabVal}
                variant="fullWidth"
                onChange={handleTabChange}
                TabIndicatorProps={{
                  style: {
                    background: '#F08B32',
                    textColor: '#F08B32',
                    // width: '110px',
                  },
                }}
              >
                <Mui.Tab
                  label="Cash Proportion"
                  sx={{
                    fontFamily: "'Lexend', sans-serif",
                    fontWeight: '300',
                    textTransform: 'capitalize',
                  }}
                />
                <Mui.Tab
                  label="Receivables"
                  sx={{
                    fontFamily: "'Lexend', sans-serif",
                    fontWeight: '300',
                    textTransform: 'capitalize',
                  }}
                />
                <Mui.Tab
                  label="Payables"
                  sx={{
                    fontFamily: "'Lexend', sans-serif",
                    fontWeight: '300',
                    textTransform: 'capitalize',
                  }}
                />
              </CssTab>
              <div style={{ marginTop: '3rem' }}>
                {tabVal === 1 && (
                  <Doughnut
                    data={receviablesData}
                    width={250}
                    height={200}
                    options={optionsReceviables}
                  />
                )}

                {tabVal === 0 && (
                  <Doughnut
                    data={CashProportionData}
                    width={250}
                    height={200}
                    options={optionsCashProposition}
                  />
                )}

                {tabVal === 2 && (
                  <Doughnut
                    data={PayablesData}
                    width={250}
                    height={200}
                    options={optionsPayables}
                  />
                )}
              </div>
            </Mui.Stack>
          )}
        </>
      ) : (
        <>
          {CashProportionLabels?.length > 0 && (
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
                  <Mui.Typography noWrap>Liquidity Position</Mui.Typography>
                  <CssTab
                    value={tabVal}
                    onChange={handleTabChange}
                    TabIndicatorProps={{
                      style: {
                        background: '#F08B32',
                        textColor: '#F08B32',
                        // width: '110px',
                      },
                    }}
                  >
                    <Mui.Tab
                      label="Cash Proportion"
                      sx={{
                        fontFamily: "'Lexend', sans-serif",
                        fontWeight: '300',
                      }}
                    />
                    <Mui.Tab
                      label="Receivables"
                      sx={{
                        fontFamily: "'Lexend', sans-serif",
                        fontWeight: '300',
                      }}
                    />
                    <Mui.Tab
                      label="Payables"
                      sx={{
                        fontFamily: "'Lexend', sans-serif",
                        fontWeight: '300',
                      }}
                    />
                  </CssTab>
                  <div
                    style={{ marginTop: '.5rem' }}
                    className={css.secondchart}
                  >
                    {tabVal === 1 && (
                      <Doughnut
                        data={receviablesData}
                        width={250}
                        height={200}
                        options={optionsReceviables}
                      />
                    )}

                    {tabVal === 0 && (
                      <Doughnut
                        data={CashProportionData}
                        width={250}
                        height={200}
                        options={optionsCashProposition}
                      />
                    )}

                    {tabVal === 2 && (
                      <Doughnut
                        data={PayablesData}
                        width={250}
                        height={200}
                        options={optionsPayables}
                      />
                    )}
                  </div>
                </Mui.Stack>
              </Mui.Card>
            </Mui.Stack>
          )}
        </>
      )}
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default Chart1;
