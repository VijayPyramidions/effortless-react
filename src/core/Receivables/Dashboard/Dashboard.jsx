import React, { useContext } from 'react';
import moment from 'moment';
import AppContext from '@root/AppContext.jsx';
import * as Mui from '@mui/material';
import * as Router from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
// import * as themes from '@root/theme.scss';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AgeingChart from '@components/Charts/AgeingChart';
import RevenueChart from '@components/Charts/RevenueChart';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import CollectionDSOChart from '@components/Charts/CollectionDSOChart';
import * as css from './Dashboard.scss';
// import './carousel.css';

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
    color: '#FC3400 !important',
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
    collection: false,
    dso: false,
  });
  const device = localStorage.getItem('device_detect');

  React.useEffect(() => {
    enableLoading(true);
    RestApi(
      `organizations/${
        organization.orgId
      }/receivables/dashboard?date=${new Date().getDate()}/${new Date().toLocaleDateString(
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
        enableLoading(false);
        if (res && !res.error) {
          setValue(res);
        } else if (res?.error) {
          openSnackBar({
            message: res?.message || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch(() => {
        openSnackBar({
          message: 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  }, []);

  const ageingLables = [
    'Not due',
    '1 to 30',
    '31 to 60',
    '61 to 120',
    'Above 360',
    'Advance',
  ];

  const barValue = {
    // labels: value?.total_receivables?.map((val) => val?.age_bucket) || [],
    // data: value?.total_receivables?.map((val) => val?.outstanding),
    labels: ageingLables,
    data:
      ageingLables.map(
        (data) =>
          value?.total_receivables?.find((val) => val?.age_bucket === data)
            ?.outstanding || 0,
      ) || [],
  };

  const collectionLine = {
    labels: value?.collection_effectiveness?.labels
      ? value?.collection_effectiveness?.labels?.map((n) =>
          moment(n).format('MMM YY'),
        )
      : [],
    datasets: [
      {
        // label: 'Cashburn',
        data: value?.collection_effectiveness?.achievement || [],
        fill: true,
        // lineTension: 1,
        backgroundColor: 'rgb(133 92 248 / 27%)',
        borderColor: 'rgb(133 92 248)',
      },
    ],
  };

  const DSOLine = {
    labels: (value?.dso_trend && Object?.keys(value?.dso_trend)) || [],
    datasets: [
      {
        // label: "First dataset",
        data: (value?.dso_trend && Object?.values(value?.dso_trend)) || [],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        lineTension: 0.5,
      },
    ],
  };

  // const DsoValueGet = (val, type) => {
  //   const tempDate = new Date().setMonth(val);
  //   const date = moment(tempDate).format('MMM YY');
  //   if (type === 'key') {
  //     return date;
  //   }
  //   return value?.dso_trend?.[date] || 0;
  // };

  const TopTable = ({ top }) => {
    return device === 'desktop' ? (
      <Mui.TableContainer className={`${classes.tableContainer}`}>
        <Mui.Table className={classes.table} aria-label="customized table">
          <Mui.TableHead className={classes.thead}>
            {['Party', 'Target', 'Collection', 'Performance'].map((i) => (
              <Mui.TableCell
                className={classes.cell}
                align={
                  i === 'Party'
                    ? 'left'
                    : (i === 'Performance' && 'center') || 'right'
                }
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
                    navigate('/receivables-ageing-view', {
                      state: {
                        tableId: val.id,
                        selectedDate: new Date(),
                        wise: '',
                      },
                    });
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
                    {val?.name}
                  </p>
                </Mui.TableCell>
                <Mui.TableCell
                  align="right"
                  className={`${
                    Number(val?.target) >= 0
                      ? classes.tcell
                      : classes.tcellError
                  }`}
                >
                  {FormattedAmount(val?.target)}
                </Mui.TableCell>
                <Mui.TableCell
                  align="right"
                  className={`${
                    Number(val?.collection) >= 0
                      ? classes.tcell
                      : classes.tcellError
                  }`}
                >
                  {FormattedAmount(val?.collection)}
                </Mui.TableCell>

                <Mui.TableCell
                  // sx={{ display: 'flex' }}
                  className={classes.tcell}
                >
                  <div
                    style={{
                      width: '7vw',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    {/* <div style={{ width: '60%' }}>
                       <div
                        style={{
                          background: '#5A78FF',
                          width: `${val?.performance}%`,
                          height: '4px',
                          borderRadius: '10px',
                        }}
                      /> 
                    </div> */}
                    <p style={{ margin: '0 5px' }}>{val?.performance}%</p>
                  </div>
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
                      {val?.name}
                    </Mui.Typography>
                  }
                  onClick={() => {
                    navigate('/receivables-ageing-view', {
                      state: {
                        tableId: val.id,
                        selectedDate: new Date(),
                        wise: '',
                      },
                    });
                  }}
                />
              </div>
              <div style={{ width: '100%' }}>
                <Mui.ListItemText
                  primary={
                    <Mui.Typography className={css.boxTitle}>
                      Target
                    </Mui.Typography>
                  }
                  secondary={
                    <Mui.Typography className={css.topAmount}>
                      {FormattedAmount(val?.target)}
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
                      Performance
                    </Mui.Typography>
                  }
                  secondary={
                    <Mui.Typography className={css.topPerformance}>
                      {val?.performance}%
                    </Mui.Typography>
                  }
                />
              </div>
              <div style={{ width: '100%' }}>
                <Mui.ListItemText
                  primary={
                    <Mui.Typography className={css.boxTitle} align="right">
                      Collection
                    </Mui.Typography>
                  }
                  secondary={
                    <Mui.Typography
                      className={
                        topVal === 'hits' ? css.topHits : css.topMisses
                      }
                    >
                      {FormattedAmount(val?.collection)}
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
      <div className={css.mainRece}>
        <div className={css.firstRow}>
          <div className={css.card1}>
            <RevenueChart
              labels={value?.revenue_vs_collection?.labels || []}
              data={value?.revenue_vs_collection?.datasets || []}
              heightProps="380"
            />
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
              <div onClick={() => navigate('/receivables-ageing')}>
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
        <div className={css.secondRow}>
          <div className={css.card3}>
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
                <p className={css.graphTitle}>Collection Effectiveness</p>
                <div
                  onClick={() =>
                    setFlip((prev) => ({
                      ...prev,
                      collection: !flip.collection,
                    }))
                  }
                >
                  <p className={`${css.viewDetails}`}>
                    {flip.collection ? 'View Chart' : 'View Details'}
                  </p>
                </div>
              </div>
              {!flip.collection && (
                <p className={css.chartSubHead}>
                  {
                    value?.collection_effectiveness?.achievement?.[
                      value?.collection_effectiveness?.achievement?.length - 1
                    ]
                  }
                  %
                </p>
              )}
            </div>
            {flip.collection ? (
              <div className={css.withOutChart}>
                <p className={css.chartSubHeadInner}>
                  {
                    value?.collection_effectiveness?.achievement?.[
                      value?.collection_effectiveness?.achievement?.length - 1
                    ]
                  }
                  %
                </p>
                {[1, 2, 3, 4, 5, 6].map((val, i) => (
                  <div className={css.innerCollectionDiv}>
                    <p className={css.pRightTag}>
                      {moment(
                        value?.collection_effectiveness?.labels?.[i],
                      ).format('MMM YY')}
                    </p>
                    <div className={css.spanBar}>
                      <span
                        style={{
                          width:
                            Number(
                              value?.collection_effectiveness?.achievement?.[i],
                            ) <= 100
                              ? `${value?.collection_effectiveness?.achievement?.[i]}%`
                              : '100%',
                          background: '#5A78FF',
                          borderRadius: 10,
                        }}
                      />
                    </div>
                    <p className={css.pLeftTag}>
                      {value?.collection_effectiveness?.achievement?.[i]}%
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <CollectionDSOChart
                dataLine={collectionLine}
                heightProps="300px"
                view=""
              />
            )}
          </div>
          <div className={css.card4}>
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
                <p className={css.graphTitle}>DSO Trend</p>
                <div
                  onClick={() =>
                    setFlip((prev) => ({ ...prev, dso: !flip.dso }))
                  }
                >
                  <p className={`${css.viewDetails}`}>
                    {flip.dso ? 'View Chart' : 'View Details'}
                  </p>
                </div>
              </div>
              {!flip.dso && (
                <p className={css.chartSubHead}>
                  {value?.dso_trend[Object.keys(value?.dso_trend || {})[Object.keys(value?.dso_trend || {}).length-1]] || 0} Days
                </p>
              )}
            </div>
            {flip.dso ? (
              <div className={css.withOutChart}>
                <p className={css.chartSubHeadInner}>
                  {value?.dso_trend[moment().format('MMM YY')] || 0} Days
                </p>
                {[0, 1, 2, 3, 4, 5].map((val) => (
                  <div className={css.innerDSODiv}>
                    <p className={css.pRightTag}>
                      {
                        (value?.dso_trend && Object?.keys(value?.dso_trend))?.[
                          val
                        ]
                      }
                    </p>
                    <span className={css.spanBar} />
                    <p className={css.pLeftTag}>
                      {
                        (value?.dso_trend &&
                          Object?.values(value?.dso_trend))?.[val]
                      }{' '}
                      Days
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <CollectionDSOChart dataLine={DSOLine} heightProps="300px" />
            )}
          </div>
        </div>
        <div className={css.thirdRow}>
          <div className={css.card5}>
            <p className={css.topHead}>Top Hits</p>
            {!loading && value?.top_hits?.length > 0 ? (
              <TopTable top={value?.top_hits} />
            ) : (
              <p style={{ margin: '10px 30px' }}>
                {loading ? 'Data is being fetched' : 'No Data Found'}
              </p>
            )}
          </div>
          <div className={css.card6}>
            <p className={css.topHead}>Top Misses</p>
            {!loading && value?.top_misses?.length > 0 ? (
              <TopTable top={value?.top_misses} />
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
        {/* <div className={css.firstCont}>
          <p className={css.titleHead}>Overview</p>

          <div
            className={css.viewAgeing}
            onClick={() => navigate('/receivables-ageing')}
          >
            <p style={{ color: '#FF5722' }}>View Ageing</p>
            <Mui.IconButton>
              <ArrowForwardIcon sx={{ color: '#FF5722' }} />
            </Mui.IconButton>
          </div>
        </div> */}
        <div className={css.SecondContNewChart}>
          <div className={css.firstRow}>
            <div className={css.card2}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '0 1rem',
                  marginTop: '1rem',
                }}
              >
                <p className={css.graphTitle}>Ageing</p>
                <div onClick={() => navigate('/receivables-ageing')}>
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

          {/* <div className={css.secondRow}>
            <div className={css.card1}>
              <RevenueChart
                labels={
                  (value?.revenue_vs_collection?.labels?.length > 0 &&
                    value?.revenue_vs_collection?.labels?.map((n) =>
                      moment(n).format('MMM YY')
                    )) ||
                  []
                }
                data={value?.revenue_vs_collection?.datasets || []}
                heightProps="90"
              />
            </div>
            <div className={css.card3}>
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
                  <p className={css.graphTitle}>Collection Effectiveness</p>
                  <div
                    onClick={() =>
                      setFlip((prev) => ({
                        ...prev,
                        collection: !flip.collection,
                      }))
                    }
                  >
                    <p className={`${css.viewDetails}`}>
                      {flip.collection ? 'View Chart' : 'View Details'}
                    </p>
                  </div>
                </div>
                {!flip.collection && (
                  <p className={css.chartSubHead}>
                    {
                      value?.collection_effectiveness?.achievement?.[
                        value?.collection_effectiveness?.achievement?.length - 1
                      ]
                    }
                    %
                  </p>
                )}
              </div>
              {flip.collection ? (
                <div className={css.withOutChart}>
                  <p className={css.chartSubHeadInner}>
                    {
                      value?.collection_effectiveness?.achievement?.[
                        value?.collection_effectiveness?.achievement?.length - 1
                      ]
                    }
                    %
                  </p>
                  {[1, 2, 3, 4, 5, 6].map((val, i) => (
                    <div className={css.innerCollectionDiv}>
                      <p className={css.pRightTag}>
                        {moment(
                          value?.collection_effectiveness?.labels?.[i]
                        ).format('MMM YY')}
                      </p>
                      <div className={css.spanBar}>
                        <span
                          style={{
                            width:
                              Number(
                                value?.collection_effectiveness?.achievement?.[
                                  i
                                ]
                              ) <= 100
                                ? `${value?.collection_effectiveness?.achievement?.[i]}%`
                                : '100%',
                            background: '#5A78FF',
                            borderRadius: 10,
                          }}
                        />
                      </div>
                      <p className={css.pLeftTag}>
                        {value?.collection_effectiveness?.achievement?.[i]}%
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <CollectionDSOChart
                  dataLine={collectionLine}
                  heightProps="225px"
                />
              )}
            </div>
            <div className={css.card4}>
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
                  <p className={css.graphTitle}>DSO Trend</p>
                  <div
                    onClick={() =>
                      setFlip((prev) => ({ ...prev, dso: !flip.dso }))
                    }
                  >
                    <p className={`${css.viewDetails}`}>
                      {flip.dso ? 'View Chart' : 'View Details'}
                    </p>
                  </div>
                </div>
                {!flip.dso && (
                  <p className={css.chartSubHead}>
                    {value?.dso_trend?.[moment().format('MMM YY')] || 0} Days
                  </p>
                )}
              </div>
              {flip.dso ? (
                <div className={css.withOutChart}>
                  <p className={css.chartSubHeadInner}>
                    {value?.dso_trend?.[moment().format('MMM YY')] || 0} Days
                  </p>
                  {[0, 1, 2, 3, 4, 5].map((val) => (
                    <div className={css.innerDSODiv}>
                      <p className={css.pRightTag}>
                        {
                          (value?.dso_trend &&
                            Object?.keys(value?.dso_trend))?.[val]
                        }
                      </p>
                      <span className={css.spanBar} />
                      <p className={css.pLeftTag}>
                        {
                          (value?.dso_trend &&
                            Object?.values(value?.dso_trend))?.[val]
                        }{' '}
                        Days
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <CollectionDSOChart dataLine={DSOLine} heightProps="225px" />
              )}
            </div>
          </div> */}

          <Carousel className="carousel" style={{ height: '85vw' }}>
            <div className={css.card1}>
              <RevenueChart
                labels={
                  (value?.revenue_vs_collection?.labels?.length > 0 &&
                    value?.revenue_vs_collection?.labels) ||
                  []
                }
                data={value?.revenue_vs_collection?.datasets || []}
                heightProps="240"
              />
            </div>
            <div className={css.card3}>
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
                    padding: '1rem 0 0 0',
                  }}
                >
                  <p className={css.graphTitle}>Collection Effectiveness</p>
                  <div
                    onClick={() =>
                      setFlip((prev) => ({
                        ...prev,
                        collection: !flip.collection,
                      }))
                    }
                  >
                    <p className={`${css.viewDetails}`}>
                      {flip.collection ? 'View Chart' : 'View Details'}
                    </p>
                  </div>
                </div>
                {!flip.collection && (
                  <p className={css.chartSubHead}>
                    {
                      value?.collection_effectiveness?.achievement?.[
                        value?.collection_effectiveness?.achievement?.length - 1
                      ]
                    }
                    %
                  </p>
                )}
              </div>
              {flip.collection ? (
                <div className={css.withOutChart}>
                  <p className={css.chartSubHeadInner}>
                    {
                      value?.collection_effectiveness?.achievement?.[
                        value?.collection_effectiveness?.achievement?.length - 1
                      ]
                    }
                    %
                  </p>
                  {[1, 2, 3, 4, 5, 6].map((val, i) => (
                    <div className={css.innerCollectionDiv}>
                      <p className={css.pRightTag}>
                        {moment(
                          value?.collection_effectiveness?.labels?.[i],
                        ).format('MMM YY')}
                      </p>
                      <div className={css.spanBar}>
                        <span
                          style={{
                            width:
                              Number(
                                value?.collection_effectiveness?.achievement?.[
                                  i
                                ],
                              ) <= 100
                                ? `${value?.collection_effectiveness?.achievement?.[i]}%`
                                : '100%',
                            background: '#5A78FF',
                            borderRadius: 10,
                          }}
                        />
                      </div>
                      <p className={css.pLeftTag}>
                        {value?.collection_effectiveness?.achievement?.[i]}%
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <CollectionDSOChart
                  dataLine={collectionLine}
                  heightProps="200px"
                  view=""
                />
              )}
            </div>
            <div className={css.card4}>
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
                    padding: '1rem 0 0 0',
                  }}
                >
                  <p className={css.graphTitle}>DSO Trend</p>
                  <div
                    onClick={() =>
                      setFlip((prev) => ({ ...prev, dso: !flip.dso }))
                    }
                  >
                    <p className={`${css.viewDetails}`}>
                      {flip.dso ? 'View Chart' : 'View Details'}
                    </p>
                  </div>
                </div>
                {!flip.dso && (
                  <p className={css.chartSubHead}>
                    {value?.dso_trend[Object.keys(value?.dso_trend || {})[Object.keys(value?.dso_trend || {}).length-1]] || 0} Days
                  </p>
                )}
              </div>
              {flip.dso ? (
                <div className={css.withOutChart}>
                  <p className={css.chartSubHeadInner}>
                    {value?.dso_trend[moment().format('MMM YY')] || 0} Days
                  </p>
                  {[1, 2, 3, 4, 5, 6].map((val, i) => (
                    <div className={css.innerDSODiv}>
                      <p className={css.pRightTag}>
                        {
                          (value?.dso_trend &&
                            Object?.keys(value?.dso_trend))?.[i]
                        }
                      </p>
                      <span className={css.spanBar} />
                      <p className={css.pLeftTag}>
                        {
                          (value?.dso_trend &&
                            Object?.values(value?.dso_trend))?.[i]
                        }
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <CollectionDSOChart dataLine={DSOLine} heightProps="200px" />
              )}
            </div>
          </Carousel>
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
                Top Hits
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
                Top Misses
              </p>
            </div>
          </div>

          {topVal === 'hits' &&
            (!loading && value?.top_hits?.length > 0 ? (
              <TopTable top={value?.top_hits} color="#ff0000" />
            ) : (
              <Mui.Typography align="center">
                {loading ? 'Data is being fetched' : 'No Data Found'}
              </Mui.Typography>
            ))}

          {topVal === 'misses' &&
            (!loading && value?.top_misses?.length > 0 ? (
              <TopTable top={value?.top_misses} color="#ff0000" />
            ) : (
              <Mui.Typography align="center">
                {loading ? 'Data is being fetched' : 'No Data Found'}
              </Mui.Typography>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
