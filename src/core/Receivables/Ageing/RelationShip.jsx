/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react'; // useEffect // useContext, // useState,
import * as Mui from '@mui/material';
import { Typography, Grid, Paper } from '@mui/material';
import moment from 'moment';
import AppContext from '@root/AppContext.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import RequestPayment from '@core/Receivables/Ageing/RequestPayment.jsx';
// import send from '@assets/send.png';
// import support from '@assets/support.png';
// import tag from '@assets/tagalt.png';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
// import Mail from '@mui/icons-material/MailOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { makeStyles } from '@material-ui/core';
import * as Router from 'react-router-dom';
import PopperComp from '../../../components/Popper/PopperComp';
import * as css from './Ageing.scss';
import ReceivablesPopOver from '../Components/ReceivablesPopover';

const useStyles = makeStyles(() => ({
  chips: {
    // marginBottom: '35px',
    '& .MuiChip-root': {
      background: 'white',
      border: '1px solid #f0f0f0',
      flexDirection: 'row-reverse !important',
      padding: '20px 5px',
    },
    '& .MuiChip-icon': {
      marginRight: '5px',
      marginLeft: '-10px',
    },
  },
  // chipsForMob: {
  //   margin: '15px 10px',
  //   '& .MuiChip-root': {
  //     background: '#f08b3233 !important',
  //     border: '0.870961px solid #E1E1E1 !important',
  //     borderRadius: '4.64512px !important',
  //     flexDirection: 'row-reverse !important',
  //     padding: '20px 5px',
  //     width: '65%',
  //   },
  //   '& .MuiChip-icon': {
  //     marginRight: '5px',
  //     marginLeft: '-10px',
  //   },
  // },
}));

const Relationship = ({ id }) => {
  const classes = useStyles();
  const {
    organization,
    user,
    // changeSubView,
    enableLoading,
    // setActiveInvoiceId,
    openSnackBar,
    loading,
  } = React.useContext(AppContext);
  const [drawer, setDrawer] = React.useState(false);
  const [value, setValue] = React.useState();
  const [requestPayment, setRequestPayment] = React.useState(false);
  // const [date, setDate] = React.useState('');
  // const [textHover, setTextHover] = React.useState({
  //   mail: false,
  //   support: false,
  //   send: false,
  //   tag: false,
  // });
  const [orderVal, setOrderVal] = React.useState();
  const [view, setView] = React.useState({
    dataSet: [],
    model: false,
    date: '',
  });
  const [anchorEl, setAnchorEl] = React.useState({
    value: false,
    opened: null,
  });

  const [html, sethtml] = React.useState({
    pdf: false,
    value: null,
  });

  const recurringPdfDownload = (r_id) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', user.activeToken);
    myHeaders.append(
      'Cookie',
      'ahoy_visit=81beb4a2-ae4e-4414-8e0c-6eddff401f95; ahoy_visitor=8aba61b6-caf3-4ef5-a0f8-4e9afc7d8d0f',
    );

    const requestOptions = {
      method: METHOD.GET,
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/organizations/${organization.orgId}/invoices/${r_id}.html`,
      // `https://staging.goeffortless.co/api/v1/organizations/6b1dbb37-a966-405f-90dc-3e49e2c30be4/invoices/d914dfb6-5ba4-4ee2-acaf-f69a68bb3910.html`,
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => {
        sethtml({ value: result, pdf: true });
      })
      .catch((error) => console.log('error', error));
  };

  React.useEffect(() => {
    const mergeObj = value?.reduce((val, index) => {
      const { date, ...otherData } = index;

      if (!(date in val)) {
        val[date] = [];
      }

      val[date].push(otherData);
      return val;
    }, {});

    if (anchorEl.value) {
      if (mergeObj) {
        setOrderVal(
          Object.assign(
            {},
            ...Object.entries(mergeObj)
              .filter(([key]) => {
                const temp = new Date(anchorEl.value);
                temp.setUTCHours(24, 59, 59, 999);
                // return new Date(key).getTime() <= temp.getTime();
                return new Date(key) <= temp;
                // return key.includes(moment(anchorEl.value).for/mat('YYYY-MM-'));
              })
              .map(([key, val]) => ({ [key]: val })),
          ),
        );
      }
    } else {
      setOrderVal(mergeObj);
    }
  }, [value, anchorEl.value]);
  const navigate = Router.useNavigate();
  // console.log('requestPayment', requestPayment);

  const FetchRelationship = () => { 
    enableLoading(true);
    RestApi(
      // `organizations/${organization.orgId}/accounts/${pageParams}/profiles`,
      `organizations/${organization.orgId}/entity_interactions?entity_id=${id}`,
      {
        method: METHOD.GET,
        headers: {
          authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          if (res.message === 'Entity Interactions not found') {
            openSnackBar({
              message: res?.message,
              type: MESSAGE_TYPE.ERROR,
            });
            setValue([]);
          } else {
            setValue(res?.data);
          }
        } else if (res.error) {
          enableLoading(false);
          openSnackBar({
            message: res?.message,
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        enableLoading(false);
      });
  };
  React.useEffect(() => {
    FetchRelationship();
  }, [id]);

  const device = localStorage.getItem('device_detect');

  const MESSAGE_OPTION = [
    {
      id: 'receipt',
      text: 'VIEW RECEIPT',
      payload: 'RECEIPT',
      color: '#00A676',
    },
    {
      id: 'invoice',
      text: 'VIEW INVOICE',
      payload: 'INVOICE',
      color: '#F08B32',
    },
    {
      id: 'invoice_cancel',
      text: 'VIEW INVOICE',
      payload: 'INVOICE CANCELLED',
      color: '#BA3B3B',
    },
    {
      id: 'payment_follow_up',
      text: '',
      payload: 'PAYMENT FOLLOW-UP',
      color: '#FFF',
    },
  ];

  const handleCloseDialog = () => {
    setView((prev) => ({ ...prev, model: false }));
    setTimeout(() => setView({ dataSet: [], model: false, date: '' }), 100);
  };

  const MessageCard = ({ messageData, date }) => {
    return (
      <Mui.Stack direction="column" m="0 15px 15px 15px">
        <div
          className={css.dateDiv}
          style={{
            margin:
              device === 'desktop' ? '5px 35% 15px 35%' : '5px 30% 15px 30%',
          }}
        >
          <p
            className={css.dateTag}
            style={{ fontSize: device === 'mobile' && '10px' }}
          >
            {moment(date).format('DD MMMM YYYY')}
          </p>
        </div>
        {messageData?.map((data) => (
          <div
            className={css.DetailsPaperOrange}
            style={{
              alignItems:
                data?.txn_type === 'receipt' ? 'flex-start' : 'flex-end',
            }}
          >
            <Paper
              className={css.WhitePaper}
              sx={{ width: { xs: '75%', md: '70%' } }}
            >
              <div style={{ display: 'flex' }}>
                <div
                  className={css.leftColor}
                  style={{
                    background: MESSAGE_OPTION?.find(
                      (val) => val?.id === data?.txn_type,
                    )?.color,
                    borderRadius:
                      data?.txn_type === 'receipt' ||
                      data?.txn_type === 'invoice_cancel'
                        ? '8px 0 0 8px'
                        : '8px 0 0',
                    height: 'auto',
                    display: data?.txn_type === 'payment_follow_up' && 'none',
                    minHeight: device === 'mobile' ? 60 : 90,
                  }}
                  onClick={() => {
                    if (data?.txn_type === 'receipt') {
                      setView({ dataSet: data, model: true, date });
                    } else if (
                      data?.txn_type === 'invoice' ||
                      data?.txn_type === 'invoice_cancel'
                    ) {
                      recurringPdfDownload(data?.parent_id);
                    }
                    // else if (data?.txn_type === 'invoice_cancel') {

                    //   }
                  }}
                >
                  {device === 'desktop' && (
                    <div className={css.leftMsgDiv}>
                      <p className={css.pTag}>
                        {
                          MESSAGE_OPTION?.find(
                            (val) => val?.id === data?.txn_type,
                          )?.text
                        }
                      </p>
                    </div>
                  )}
                  {device === 'mobile' && (
                    <div className={css.leftMsgDiv}>
                      <p className={css.pTagMob}>
                        {
                          MESSAGE_OPTION?.find(
                            (val) => val?.id === data?.txn_type,
                          )?.text
                        }
                      </p>
                    </div>
                  )}
                </div>

                <Grid
                  item
                  xs={12}
                  className={css.detailItem3}
                  sx={{
                    alignItems:
                      data?.txn_type === 'invoice_cancel'
                        ? 'center'
                        : 'flex-start',
                    padding:
                      data?.txn_type === 'invoice'
                        ? '15px 10px'
                        : (data?.txn_type === 'payment_follow_up' &&
                            '20px 40px') ||
                          '0 10px',
                  }}
                >
                  {data?.txn_type === 'invoice_cancel' ||
                  data?.txn_type === 'payment_follow_up' ? (
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: 500,
                        fontSize: device === 'mobile' ? '12px' : '20px',
                        color: '#283049',
                        width: '100%',
                        textAlign: 'center',
                        padding: 10,
                      }}
                    >
                      {
                        MESSAGE_OPTION?.find(
                          (val) => val?.id === data?.txn_type,
                        )?.payload
                      }
                    </Typography>
                  ) : (
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: 500,
                        fontSize: device === 'mobile' ? '12px' : '20px',
                        color:
                          (Number(data?.data?.amount) >= 0 && '#283049') ||
                          '#950909',
                      }}
                    >
                      {FormattedAmount(data?.data?.amount)}
                    </Typography>
                  )}
                  {data?.txn_type !== 'invoice_cancel' &&
                    data?.txn_type !== 'payment_follow_up' && (
                      <div style={{ width: '90%', overflow: 'hidden' }}>
                        {data?.data?.narration && (
                          <Typography
                            variant="h6"
                            className={
                              device === 'mobile'
                                ? css.cardDataStyleMob
                                : css.cardDataStyle
                            }
                          >
                            {data?.data?.narration}
                          </Typography>
                        )}
                        {data?.data?.invoice_number && (
                          <Typography
                            variant="h6"
                            className={
                              device === 'mobile'
                                ? css.cardDataStyleMob
                                : css.cardDataStyle
                            }
                          >
                            Invoice No : {data?.data?.invoice_number}
                          </Typography>
                        )}
                        {data?.active && (
                          <Typography
                            variant="h6"
                            className={
                              device === 'mobile'
                                ? css.cardDataStyleMob
                                : css.cardDataStyle
                            }
                          >
                            Active From: {data?.active}
                          </Typography>
                        )}
                        {data?.received_date && (
                          <Typography
                            variant="h6"
                            className={
                              device === 'mobile'
                                ? css.cardDataStyleMob
                                : css.cardDataStyle
                            }
                          >
                            Date Received: {data?.received_date}
                          </Typography>
                        )}
                        {data?.transaction_number && (
                          <Typography
                            variant="h6"
                            className={
                              device === 'mobile'
                                ? css.cardDataStyleMob
                                : css.cardDataStyle
                            }
                          >
                            Transaction No. : {data?.transaction_number}
                          </Typography>
                        )}
                      </div>
                    )}
                </Grid>
              </div>
              {data?.txn_type !== 'receipt' &&
                data?.txn_type !== 'invoice_cancel' && (
                  <div className={css.finalCard2}>
                    <div className={css.main1}>
                      <div className={css.text}>
                        <Mui.ListItemText
                          primary={
                            <Mui.Typography
                              align="center"
                              className={
                                device === 'mobile'
                                  ? css.dateHeadMob
                                  : css.dateHead
                              }
                            >
                              {data?.txn_type === 'payment_follow_up' ? 'Resend' : 'Sent'}
                            </Mui.Typography>
                          }
                          secondary={
                            <Mui.Typography
                              align="center"
                              noWrap
                              className={
                                device === 'mobile'
                                  ? css.timeDateMob
                                  : css.timeDate
                              }
                            >
                              {data?.sent_at === null
                                ? '-'
                                : moment(new Date(data.sent_at)).format(
                                    'DD/MM/YYYY, hh:mm A',
                                  )}
                            </Mui.Typography>
                          }
                        />
                      </div>
                    </div>
                    <div className={css.main2}>
                      <div className={css.text}>
                        <Mui.ListItemText
                          primary={
                            <Mui.Typography
                              align="center"
                              className={
                                device === 'mobile'
                                  ? css.dateHeadMob
                                  : css.dateHead
                              }
                            >
                              Read
                            </Mui.Typography>
                          }
                          secondary={
                            <Mui.Typography
                              align="center"
                              noWrap
                              className={
                                device === 'mobile'
                                  ? css.timeDateMob
                                  : css.timeDate
                              }
                            >
                              {data?.read_at === null
                                ? '-'
                                : moment(new Date(data?.read_at)).format(
                                    'DD/MM/YYYY, hh:mm A',
                                  )}
                            </Mui.Typography>
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
            </Paper>
            {data?.txn_type !== 'invoice_cancel' && (
              <Mui.Typography
                className={
                  device === 'mobile' ? css.bottomTextMob : css.bottomText
                }
                style={{
                  color:
                    (Number(data?.data?.outstanding_amount) >= 0 &&
                      '#283049') ||
                    '#950909',
                }}
              >
                O/S : {FormattedAmount(data?.data?.outstanding_amount)}
              </Mui.Typography>
            )}
          </div>
        ))}
        {/* <Mui.Avatar className={css.detailStackAvatar2}>
          <Mui.Typography className={css.detailStackAvatarText}>
            {avatar}
          </Mui.Typography>
        </Mui.Avatar> */}
      </Mui.Stack>
    );
  };
  return (
    (orderVal && value?.length > 0 && (
      <>
        {device === 'mobile' && (
          <div
            className={classes.chips}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '88%',
              margin: '16px 6%',
            }}
          >
            <Mui.Chip
              label={
                <Mui.Typography sx={{ fontWeight: 600 }}>
                  Sort By:{' '}
                  <span style={{ fontWeight: 400 }}>
                    {anchorEl.value
                      ? moment(anchorEl.value).format('DD MMM YYYY')
                      : 'Period'}
                  </span>
                </Mui.Typography>
              }
              icon={<KeyboardArrowDown style={{ Color: '#F08B32' }} />}
              className={css.chipLabel2}
              sx={{
                '& .MuiChip-label': {
                  paddingLeft: 0,
                },
              }}
              onClick={(event) =>
                setAnchorEl({
                  value: anchorEl.value,
                  opened: event.currentTarget,
                })
              }
            />
          </div>
        )}
        <Mui.Stack flexDirection={{ xs: 'column', md: 'row' }}>
          <Mui.Grid
            className={
              device === 'desktop'
                ? css.chatContainer
                : css.chatContainerForMobile
            }
            m={{
              xs: device === 'desktop' ? '20px' : '5px',
              md: '0px 0 5px 56px',
            }}
          >
            {/* <Mui.Grid>Chat</Mui.Grid> */}
            <Mui.Grid container style={{ padding: 0 }}>
              <Mui.Grid
                item
                xs={12}
                className={
                  device === 'desktop'
                    ? css.insideChats
                    : css.insideChatsForMobile
                }
              >
                <Grid
                  Container
                  xs={12}
                  className={css.messagePaperWeb}
                  style={{ height: device === 'desktop' ? '100vh' : '70vh' }}
                >
                  {Object?.keys(orderVal)?.length > 0 &&
                    Object.entries(orderVal)
                      ?.sort((a, b) => new Date(b[0]) - new Date(a[0]))
                      ?.map(([key, data]) => (
                        <MessageCard date={key} messageData={data} />
                      ))}
                  {Object?.keys(orderVal)?.length === 0 && <p style={{
                    textAlign: 'center',
                    margin: 20
                  }}>No Data Found</p>}
                </Grid>
              </Mui.Grid>
            </Mui.Grid>
          </Mui.Grid>
          <Mui.Stack
            m={{ xs: '5px', md: '0 20px' }}
            height={{ xs: device === 'desktop' ? '0' : 'auto', md: 'auto' }}
          >
            {(device === 'desktop' && (
              <>
                <div
                  className={classes.chips}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Mui.Chip
                    label={
                      <Mui.Typography sx={{ fontWeight: 600 }}>
                        Sort By:{' '}
                        <span style={{ fontWeight: 400, color: '#F08B32' }}>
                          {anchorEl.value
                            ? moment(anchorEl.value).format('DD MMM YYYY')
                            : 'Period'}
                        </span>
                      </Mui.Typography>
                    }
                    icon={<KeyboardArrowDown />}
                    className={css.chipLabel5}
                    onClick={(event) =>
                      setAnchorEl({
                        value: anchorEl.value,
                        opened: event.currentTarget,
                      })
                    }
                  />
                </div>
                <div className={css.newRelationDiv}>
                  <div className={css.innerDiv}>
                    {[
                      {
                        name: 'Send Statament',
                        color: '#8E569F',
                        click: () => {
                          setRequestPayment(true);
                        },
                      },
                      {
                        name: 'Request Payment',
                        color: '#EB9346',
                        click: () => {
                          setRequestPayment(true);
                        },
                      },
                      {
                        name: 'Schedule a Follow-Up',
                        color: '#2B65AB',
                        click: () => {
                          navigate('/receivables-schedule');
                        },
                      },
                      {
                        name: 'Discount with Financial Institutions',
                        color: '#A0A4AF',
                      },
                    ].map((val) => (
                      <div
                        style={{ background: val.color }}
                        className={css.innerDiv2}
                        onClick={() => val.click()}
                      >
                        <p className={css.innerP}>{val.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )) || (
              <div className={css.stickyBottomRece}>
                {[
                  {
                    name: 'Request Payment',
                    click: () => setRequestPayment(true),
                    color: '#F08B32',
                  },
                  {
                    name: 'Send Statement',
                    click: () => setRequestPayment(true),
                    color: '#9160AF',
                  },
                  {
                    name: 'Schedule a Follow-Up',
                    click: () => navigate('/receivables-schedule'),
                    color: '#2E6FBB',
                  },
                  { name: 'Sell Your Receipts', click: '', color: '#868686' },
                ]?.map((val) => (
                  <div onClick={() => val.click()}>
                    <p
                      style={{ background: val.color }}
                      className={css.bottomButtonNew}
                    >
                      {val.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Mui.Stack>
        </Mui.Stack>
        {/* )} */}
        <Mui.Dialog
          open={requestPayment}
          onClose={() => setRequestPayment(false)}
        >
          <RequestPayment
            customer_id={id}
            setRequestPayment={setRequestPayment}
            FetchFun={() => FetchRelationship()}
          />
        </Mui.Dialog>
        <ReceivablesPopOver
          open={drawer}
          handleClose={() => setDrawer(false)}
          position="center"
        >
          <Grid container style={{ padding: '20px' }}>
            <Typography
              variant="h6"
              align="left"
              style={{ width: '100%', padding: '10px 0' }}
            >
              Whoa!
            </Typography>
            <Typography variant="body1" align="left" style={{ width: '100%' }}>
              This feature is coming soon!
            </Typography>
          </Grid>
        </ReceivablesPopOver>
        <Mui.Dialog
          open={view.model}
          onClose={() => {
            handleCloseDialog();
          }}
          sx={{ padding: '10px 20px' }}
          fullWidth={device === 'mobile'}
        >
          <Mui.DialogContent
            sx={{ width: device === 'mobile' ? 'auto' : '50vh' }}
          >
            <Mui.Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb="20px"
              width="100%"
            >
              <Mui.Typography
                className={
                  device === 'mobile' ? css.modelTopMobile : css.modelTopDesktop
                }
              >
                {view.dataSet?.data?.narration || '-'}
              </Mui.Typography>
              {device !== 'mobile' && (
                <Mui.IconButton
                  onClick={() => {
                    handleCloseDialog();
                  }}
                  sx={{ width: '50px', height: '50px' }}
                >
                  <CancelIcon sx={{ width: '100%', height: '100%' }} />
                </Mui.IconButton>
              )}
            </Mui.Stack>
            <Mui.Stack
              direction="row"
              justifyContent="space-between"
              mb="15px"
              width={device === 'desktop' ? '75%' : '100%'}
            >
              <Mui.Typography
                className={
                  device === 'mobile'
                    ? css.rightDataMobile
                    : css.rightDataDesktop
                }
              >
                Date:
              </Mui.Typography>
              <Mui.Typography
                className={
                  device === 'mobile' ? css.leftDataMobile : css.leftDataDesktop
                }
                noWrap
              >
                {moment(new Date(view?.date)).format('DD MMM YYYY')}
              </Mui.Typography>
            </Mui.Stack>
            <Mui.Stack
              direction="row"
              justifyContent="space-between"
              mb="15px"
              width={device === 'desktop' ? '75%' : '100%'}
            >
              <Mui.Typography
                className={
                  device === 'mobile'
                    ? css.rightDataMobile
                    : css.rightDataDesktop
                }
              >
                Amount:
              </Mui.Typography>
              <Mui.Typography
                className={
                  device === 'mobile' ? css.leftDataMobile : css.leftDataDesktop
                }
                noWrap
                style={{
                  color:
                    (Number(view.dataSet?.data?.amount) >= 0 && '#283049') ||
                    '#950909',
                }}
              >
                {FormattedAmount(view.dataSet?.data?.amount)}
              </Mui.Typography>
            </Mui.Stack>
            <Mui.Stack
              direction="row"
              justifyContent="space-between"
              mb="15px"
              width={device === 'desktop' ? '75%' : '100%'}
            >
              <Mui.Typography
                className={
                  device === 'mobile'
                    ? css.rightDataMobile
                    : css.rightDataDesktop
                }
              >
                O/S:
              </Mui.Typography>
              <Mui.Typography
                className={
                  device === 'mobile' ? css.leftDataMobile : css.leftDataDesktop
                }
                noWrap
                style={{
                  color:
                    (Number(view.dataSet?.data?.amount) >= 0 && '#283049') ||
                    '#950909',
                }}
              >
                {FormattedAmount(view.dataSet?.data?.amount)}
              </Mui.Typography>
            </Mui.Stack>
          </Mui.DialogContent>
        </Mui.Dialog>

        <Mui.Dialog
          open={html.pdf}
          id="basic-menu-sort"
          onClose={() => sethtml({ value: null, pdf: false })}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          PaperProps={{
            elevation: 3,
            style: {
              minWidth: '75%',
              padding: '5px',
              borderRadius: 16,
            },
          }}
        >
          <Mui.DialogContent>
            {/* <Mui.Stack
            style={{ overflow: 'auto', margin: '1rem' }}
            dangerouslySetInnerHTML={{ __html: html }}
          /> */}
            <Mui.Stack
              style={{
                backgroundColor: 'white',
                height: '85vh',
                width: '100%',
              }}
            >
              <iframe
                srcDoc={html?.value?.replace(
                  'div.nobreak{page-break-inside:avoid}',
                  'div.nobreak{page-break-inside:avoid} ::-webkit-scrollbar {width:0px}',
                )}
                title="html"
                frameBorder="0"
                className={css.scrolling}
              />
            </Mui.Stack>
          </Mui.DialogContent>
        </Mui.Dialog>

        <PopperComp
          openProps={Boolean(anchorEl.opened)}
          anchorElProps={anchorEl.opened}
          onClose={() => {
            setAnchorEl((prev) => ({ ...prev, opened: null }));
          }}
          popperStyle={{
            width: device === 'mobile' ? '40vw' : '28.5vw',
            border: '0.5px solid #C7C7C7',
              boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              marginTop: '10px'
          }}
        >
          <div>
          {[-1, 0, 1, 2, 3, 4].map((i) => (
                <div className={css.DivTagPopover}
                onClick={() =>
                  setAnchorEl({
                    value:
                      i === -1
                        ? new Date()
                        : new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() - i,
                            0,
                          ),
                    opened: null,
                  })
                }
                >
                <p className={css.PTagPopover}>
                  {i === -1
                    ? moment().format('DD MMM YYYY')
                    : moment(
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() - i,
                          0,
                        ),
                      ).format('DD MMM YYYY')}
                  </p></div>
              ))}
          </div>
        </PopperComp>
      </>
    )) || (
      <Mui.Typography width="100%" align="center">
        {loading ? 'Data is being fetched' : 'No Data Found'}
      </Mui.Typography>
    )
  );
};

export default Relationship;
