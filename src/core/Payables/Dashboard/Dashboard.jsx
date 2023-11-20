import React, { useContext } from 'react';
import moment from 'moment';
import AppContext from '@root/AppContext.jsx';
import * as Mui from '@mui/material';
import * as Router from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
// import * as themes from '@root/theme.scss';
import AgeingChart from '@components/Charts/AgeingChart';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import CollectionDSOChart from '@components/Charts/CollectionDSOChart';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import * as css from './Dashboard.scss';

const useStyles = makeStyles({
  tableContainer: {
    height: 'auto',
    // border: '1px solid #999ea580',
    borderRadius: '0px',
    marginTop: '10px',
  },
  table: {},
  thead: {
    textTransform: 'uppercase',
    background: '#F5F5F5',
  },
  tbody: {
    background: '#fff',
  },
  cell: {
    fontSize: '16px !important',
    fontWeight: '400 !important',
    fontFamily: 'Lexend !important',
    textTransform: 'capitalize !important',
  },
  tcell: {
    fontSize: '14px !important',
    fontWeight: '300 !important',
    fontFamily: 'Lexend !important',
    whiteSpace: 'nowrap !important',
  },
  tcellError: {
    fontSize: '14px !important',
    fontWeight: '300 !important',
    fontFamily: 'Lexend !important',
    whiteSpace: 'nowrap !important',
  },
});

function Dashboard() {
  const classes = useStyles();
  const [value, setValue] = React.useState();
  const {
    organization,
    enableLoading,
    user,
    // setActiveInvoiceId,
    // changeSubView,
    // changeView,
    openSnackBar,
    loading,
  } = useContext(AppContext);
  const navigate = Router.useNavigate();
  const [topVal, setTop] = React.useState('hits');
  const [flip, setFlip] = React.useState({
    dpo: false,
  });

  React.useEffect(() => {
    enableLoading(true);
    RestApi(
      `organizations/${
        organization.orgId
      }/payables/dashboard?date=${new Date().getDate()}/${new Date().toLocaleDateString(
        'en-US',
        { month: 'numeric', year: 'numeric' },
      )}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          setValue(res);
        }
        enableLoading(false);
      })
      .catch(() => {
        enableLoading(false);
        openSnackBar({
          message: `Sorry we will look into in`,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  }, []);

  const VendorValidationCall = (id) => {
    RestApi(
      `organizations/${organization.orgId}/payables/ageing/${id}`,
      // `organizations/${organization.orgId}/receivables/open_bills?customer_id=95cb1847-8ff0-4028-80ea-00aa1f0435f0`,
      {
        method: METHOD.GET,
        headers: {
          authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          if (res.message === 'Vendor not found') {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.ERROR,
            });
          } else {
            navigate('/payables-ageing-view', {
              state: {
                tableId: id,
                selectedDate: new Date(),
                wise: '',
              },
            });
          }
        }
        enableLoading(false);
      })
      .catch(() => {
        enableLoading(false);
        openSnackBar({
          message: `Sorry we will look into it`,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const ageingLables = [
    'Not due',
    '1 to 30',
    '31 to 60',
    '61 to 120',
    'Above 360',
    'Advance',
  ];

  const barValue = {
    // labels: value?.total_payables?.map((val) => val?.age_bucket) || [],
    // data: value?.total_payables?.map((val) => val?.payable),
    labels: ageingLables,
    data:
      ageingLables.map(
        (data) =>
          value?.total_payables?.find((val) => val?.age_bucket === data)
            ?.payable || 0,
      ) || [],
  };
  const DPOLine = {
    labels: (value?.dpo_trend && Object?.keys(value?.dpo_trend)) || [],
    datasets: [
      {
        // label: "First dataset",
        data: (value?.dpo_trend && Object?.values(value?.dpo_trend)) || [],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        lineTension: 0.5,
      },
    ],
  };

  // const DpoValueGet = (val, type) => {
  //   const tempDate = new Date().setMonth(val);
  //   const date = moment(tempDate).format('MMM YY');
  //   if (type === 'key') {
  //     return date;
  //   }
  //   return value?.dso_trend?.[date] || 0;
  // };

  const device = localStorage.getItem('device_detect');

  const TopTable = ({ top }) => {
    return device === 'desktop' ? (
      <Mui.TableContainer className={`${classes.tableContainer}`}>
        <Mui.Table className={classes.table} aria-label="customized table">
          <Mui.TableHead className={classes.thead}>
            {['Party', 'Payables', 'Bill'].map((i) => (
              <Mui.TableCell
                className={classes.cell}
                align={i === 'Payables' ? 'right' : 'left'}
              >
                {i}
              </Mui.TableCell>
            ))}
          </Mui.TableHead>
          <Mui.TableBody className={classes.tbody}>
            {top?.map((val) => (
              <Mui.TableRow>
                <Mui.TableCell
                  sx={{ cursor: 'pointer' }}
                  className={classes.tcell}
                  onClick={() => {
                    VendorValidationCall(val.vendor_id);
                  }}
                >
                  <p
                    style={{
                      width: '10vw',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: 0,
                      color: '#283049',
                    }}
                  >
                    {val?.vendor_name}
                  </p>
                </Mui.TableCell>
                <Mui.TableCell
                  align="right"
                  className={`${
                    Number(val?.target) > 0 ? classes.tcell : classes.tcellError
                  }`}
                >
                  {FormattedAmount(val?.payable)}
                </Mui.TableCell>
                <Mui.TableCell align="center" className={classes.tcell}>
                  {val?.bill_count}
                </Mui.TableCell>
              </Mui.TableRow>
            ))}
          </Mui.TableBody>
        </Mui.Table>
      </Mui.TableContainer>
    ) : (
      <Mui.Stack>
        {top?.map((val) => (
          <Mui.Box
            sx={{
              background: '#FFF',
              height: 'fit-content',
              display: 'flex',
              padding: '5px 15px',
              borderBottom: '2px solid #F2F2F0',
            }}
          >
            <Mui.Stack
              sx={{ width: '65%' }}
              direction="column"
              justifyContent="space-around"
            >
              <div style={{ width: '100%' }}>
                <Mui.ListItemText
                  primary={
                    <Mui.Typography className={css.boxTitle}>
                      Party
                    </Mui.Typography>
                  }
                  secondary={
                    <Mui.Typography className={css.topName}>
                      {val?.vendor_name}
                    </Mui.Typography>
                  }
                  onClick={() => {
                    VendorValidationCall(val.vendor_id);
                  }}
                />
              </div>
              <div style={{ width: '100%' }}>
                <Mui.ListItemText
                  primary={
                    <Mui.Typography className={css.boxTitle}>
                      Payable
                    </Mui.Typography>
                  }
                  secondary={
                    <Mui.Typography className={css.topAmount}>
                      {FormattedAmount(val?.payable)}
                    </Mui.Typography>
                  }
                />
              </div>
            </Mui.Stack>
            <Mui.Stack
              sx={{ width: '35%' }}
              direction="column"
              justifyContent="space-around"
            >
              <div style={{ width: '100%' }}>
                <Mui.ListItemText
                  primary={
                    <Mui.Typography className={css.boxTitle} align="right">
                      Bill
                    </Mui.Typography>
                  }
                  secondary={
                    <Mui.Typography
                      className={
                        topVal === 'hits' ? css.topHits : css.topMisses
                      }
                    >
                      {val?.bill_count}
                    </Mui.Typography>
                  }
                />
              </div>
            </Mui.Stack>
          </Mui.Box>
        ))}
      </Mui.Stack>
    );
  };

  return device === 'desktop' ? (
    <div style={{ width: '100%', marginBottom: 5 }}>
      <div className={css.mainPaya}>
        <div className={css.firstRow}>
          <div className={css.card1}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '0 1rem',
                gap: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <p className={css.graphTitle}>DPO Trend</p>
                <div
                  onClick={() =>
                    setFlip((prev) => ({ ...prev, dpo: !flip.dpo }))
                  }
                >
                  <p className={`${css.viewDetails}`}>
                    {flip.dpo ? 'View Chart' : 'View Details'}
                  </p>
                </div>
              </div>
              {!flip.dpo && (
                <p className={css.chartSubHead}>
                  {value?.dpo_trend?.[moment().format('MMM YY')] || 0} Days
                </p>
              )}
            </div>
            {flip.dpo ? (
              <div className={css.withOutChart}>
                <p className={css.chartSubHeadInner}>
                  {value?.dpo_trend?.[moment().format('MMM YY')] || 0} Days
                </p>
                {[0, 1, 2, 3, 4, 5].map((val) => (
                  <div className={css.innerDSODiv}>
                    <p className={css.pRightTag}>
                      {
                        (value?.dpo_trend && Object?.keys(value?.dpo_trend))?.[
                          val
                        ]
                      }
                    </p>
                    <span className={css.spanBar} />
                    <p className={css.pLeftTag}>
                      {
                        (value?.dpo_trend &&
                          Object?.values(value?.dpo_trend))?.[val]
                      }{' '}
                      Days
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <CollectionDSOChart dataLine={DPOLine} heightProps="300px" />
            )}
          </div>

          <div className={css.card2}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '0 1rem',
              }}
            >
              <p className={css.graphTitle}>Ageing</p>
              <div onClick={() => navigate('/payables-ageing')}>
                <p className={`${css.viewDetails}`}>View Ageing</p>
              </div>
            </div>
            <AgeingChart
              labels={barValue?.labels}
              data={barValue?.data}
              heightProps={345}
            />
          </div>
        </div>

        <div className={css.thirdRow}>
          <div className={css.card5}>
            <p className={css.topHead}>Highest Dues</p>
            {!loading && value?.top_dues?.length > 0 ? (
              <TopTable top={value?.top_dues} />
            ) : (
              <p style={{ margin: '10px 30px' }}>
                {loading ? 'Data is being fetched' : 'No Data Found'}
              </p>
            )}
          </div>
          <div className={css.card6}>
            <p className={css.topHead}>Top Payments</p>
            {!loading && value?.lower_dues?.length > 0 ? (
              <TopTable top={value?.lower_dues} />
            ) : (
              <p style={{ margin: '10px 30px' }}>
                {loading ? 'Data is being fetched' : 'No Data Found'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div style={{ width: '100%' }}>
      <div className={css.mainReceMob}>
        <div className={css.SecondContNewChartPaya}>
          <div className={css.firstRow}>
            <div className={css.card1} style={{ marginTop: '15px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  margin: '0 1rem',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <p className={css.graphTitle}>DPO Trend</p>
                  <div
                    onClick={() =>
                      setFlip((prev) => ({ ...prev, dpo: !flip.dpo }))
                    }
                  >
                    <p className={`${css.viewDetails}`}>
                      {flip.dpo ? 'View Chart' : 'View Details'}
                    </p>
                  </div>
                </div>
                {!flip.dpo && (
                  <p className={css.chartSubHead}>
                    {value?.dpo_trend?.[moment().format('MMM YY')] || 0} Days
                  </p>
                )}
              </div>
              {flip.dpo ? (
                <div className={css.withOutChart}>
                  <p className={css.chartSubHeadInner}>
                    {value?.dpo_trend?.[moment().format('MMM YY')] || 0} Days
                  </p>
                  {[0, 1, 2, 3, 4, 5].map((val) => (
                    <div className={css.innerDSODiv}>
                      <p className={css.pRightTag}>
                        {
                          (value?.dpo_trend &&
                            Object?.keys(value?.dpo_trend))?.[val]
                        }
                      </p>
                      <span className={css.spanBar} />
                      <p className={css.pLeftTag}>
                        {
                          (value?.dpo_trend &&
                            Object?.values(value?.dpo_trend))?.[val]
                        }{' '}
                        Days
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <CollectionDSOChart dataLine={DPOLine} heightProps="200px" />
              )}
            </div>

            <div className={css.card2}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '0 1rem',
                }}
              >
                <p className={css.graphTitle}>Ageing</p>
                <div onClick={() => navigate('/payables-ageing')}>
                  <p className={`${css.viewDetails}`}>View Ageing</p>
                </div>
              </div>
              <AgeingChart
                labels={barValue?.labels}
                data={barValue?.data}
                heightProps={275}
              />
            </div>
          </div>
        </div>

        <div className={css.thirdCont}>
          <div className={css.titleButton}>
            <div
              style={{
                background: topVal === 'hits' ? '#F08B32' : '#FFF',
                borderRadius: '20px 0 0 20px',
              }}
              className={css.buttonDiv}
              onClick={() => setTop('hits')}
            >
              <p
                style={{
                  color: topVal === 'hits' ? '#FFF' : '#000',
                  margin: '10px',
                }}
              >
                Highest Dues
              </p>
            </div>
            <div
              className={css.buttonDiv}
              style={{
                background: topVal === 'misses' ? '#F08B32' : '#FFF',
                borderRadius: '0 20px 20px 0',
              }}
              onClick={() => setTop('misses')}
            >
              <p
                style={{
                  color: topVal === 'misses' ? '#FFF' : '#000',
                  margin: '10px',
                }}
              >
                Top Payments
              </p>
            </div>
          </div>

          {topVal === 'hits' &&
            (!loading && value?.top_dues?.length > 0 ? (
              <TopTable top={value?.top_dues} color="#ff0000" />
            ) : (
              <Mui.Typography align="center">
                {loading ? 'Data is being fetched' : 'No data Found '}
              </Mui.Typography>
            ))}
          {topVal === 'misses' &&
            (!loading && value?.lower_dues?.length > 0 ? (
              <TopTable top={value?.lower_dues} color="#ff0000" />
            ) : (
              <Mui.Typography align="center">
                {loading ? 'Data is being fetched' : 'No data Found '}
              </Mui.Typography>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
