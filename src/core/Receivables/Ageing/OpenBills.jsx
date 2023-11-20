/* eslint-disable no-unused-vars */

import React, { useContext } from 'react';
import * as Mui from '@mui/material';
import moment from 'moment';
// import // Button,
// Typography,
// Grid,
// Divider,
// // Avatar,
// Checkbox,
// '@material-ui/core';
// import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import JSBridge from '@nativeBridge/jsbridge';

// import InputAdornment from '@material-ui/core/InputAdornment';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import AppContext from '@root/AppContext.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import download from '@assets/WebAssets/download.svg';
import OpenContent from '../Components/OpenContent';
import * as css from './Ageing.scss';
// import * as cssTextField from '../Components/SearchTextfield';

export const CustomFooter = (props) => {
  const { funEnd, balance } = props;

  return (
    <div className={css.divFooterOpenBills}>
      <Mui.Button className={css.stmtButton}>
        CLOSING BALANCE[{FormattedAmount(balance)}]
      </Mui.Button>
    </div>
  );
};
export const CustomHeader = (props) => {
  const { funStart, balance } = props;

  return (
    <div className={css.divHeader}>
      <Mui.Button className={css.stmtButton}>
        OPENING BALANCE[{FormattedAmount(balance)}]
      </Mui.Button>
    </div>
  );
};

const OpenBills = ({
  id,
  statement,
  stmtData,
  date,
  wise,
  setStartDate,
  setEndDate,
  custName,
  tabState,
  opening,
  closing,
}) => {
  // const [searchValue, setSearchValue] = React.useState('');
  const { organization, user, enableLoading, loading, openSnackBar } =
    useContext(AppContext);
  const [billData, setBillData] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(tabState || 'total');
  const [dueList, setDueList] = React.useState([]);
  const [html, sethtml] = React.useState({
    pdf: false,
    value: null,
  });
  const [OutstandingColumn, setOutstandingColumn] = React.useState([]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  React.useEffect(() => {
    enableLoading(true);
    RestApi(
      `organizations/${
        organization.orgId
      }/receivables/open_bills?customer_id=${id}&${
        wise === '' ? 'age_bucket' : 'month_wise'
      }=${tabValue}&date=${moment(date).format(
        'YYYY-MM-DD'
      )}&report_view=${wise}`,
      // `organizations/${organization.orgId}/receivables/open_bills?customer_id=95cb1847-8ff0-4028-80ea-00aa1f0435f0`,
      {
        method: METHOD.GET,
        headers: {
          authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          setBillData(
            res?.data?.map((val, index) => ({ ...val, ids: index + 1 }))
          );
        } else if (res?.error) {
          openSnackBar({
            message: res?.message || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch(() => {
        openSnackBar({
          message: 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  }, [id, tabValue, date]);

  React.useEffect(() => {
    enableLoading(true);
    RestApi(
      `organizations/${
        organization.orgId
      }/receivables/ageing/${id}?date=${moment(date).format(
        'YYYY-MM-DD'
      )}&report_view=${wise}`,
      // `organizations/${organization.orgId}/receivables/open_bills?customer_id=95cb1847-8ff0-4028-80ea-00aa1f0435f0`,
      {
        method: METHOD.GET,
        headers: {
          authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          setDueList(res);
        } else if (res?.error) {
          openSnackBar({
            message: res?.message || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch(() => {
        openSnackBar({
          message: 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  }, [id, date]);

  const recurringPdfDownload = (r_id) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', user.activeToken);
    myHeaders.append(
      'Cookie',
      'ahoy_visit=81beb4a2-ae4e-4414-8e0c-6eddff401f95; ahoy_visitor=8aba61b6-caf3-4ef5-a0f8-4e9afc7d8d0f'
    );

    const requestOptions = {
      method: METHOD.GET,
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/organizations/${organization.orgId}/invoices/${r_id}.html`,
      // `https://staging.goeffortless.co/api/v1/organizations/6b1dbb37-a966-405f-90dc-3e49e2c30be4/invoices/d914dfb6-5ba4-4ee2-acaf-f69a68bb3910.html`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        sethtml({ value: result, pdf: true, id: r_id });
      })
      .catch((error) => console.log('error', error));
  };

  const tab = [
    {
      name: 'Total',
      amount:
        (dueList?.total_debits && FormattedAmount(dueList?.total_debits)) ||
        '-',
      id: 'total',
      order: 0,
    },
    {
      name: 'Advance',
      amount: (dueList?.advance && FormattedAmount(dueList?.advance)) || '-',
      id: 'advance_cr',
      order: wise === '' ? 8 : Object.keys(dueList?.months || {}).length + 1,
    },
    {
      name: 'Unsettled Credits',
      amount:
        (dueList?.unsettled_credits &&
          FormattedAmount(dueList?.unsettled_credits)) ||
        '-',
      id: 'unsettled_cr',
      order: wise === '' ? 9 : Object.keys(dueList?.months || {}).length + 2,
    },
  ];
  // eslint-disable-next-line no-lone-blocks
  if (wise === '') {
    [
      'not_due_dr',
      '1_to_30_dr',
      '31_to_60_dr',
      '61_to_120_dr',
      '121_to_180_dr',
      '181_to_360_dr',
      'above_360_dr',
    ].map((value, ids) =>
      tab.push({
        name:
          dueList?.by_buckets?.find((val) => val?.bucket_id === value)
            ?.age_bucket || '-',
        amount: dueList?.by_buckets?.find((val) => val?.bucket_id === value)
          ?.amount
          ? FormattedAmount(
              dueList?.by_buckets?.find((val) => val?.bucket_id === value)
                ?.amount
            )
          : '-',
        id: value,
        order: ids + 1,
      })
    );
  } else {
    Object.entries(dueList?.months || {}).map(([key, values], index) =>
      tab.push({
        name:
          key === 'earlier_than'
            ? `Earlier Than ${new Date(
                Object.keys(dueList?.months || {})
                  ?.slice()
                  ?.reverse()
                  ?.filter(
                    (text) =>
                      // text !== 'net_balance' &&
                      // text !== 'total_debits' &&
                      // text !== 'unsettled_credits' &&
                      text !== 'earlier_than'
                  )
                  .slice(-1)[0]
              )
                .toLocaleString('en-IN', {
                  month: 'short',
                  year: 'numeric',
                })
                .replace(' ', '-')}`
            : moment(key).format('MMM-YYYY'),
        amount: values,
        id:
          key === 'earlier_than'
            ? `earlier_than_${new Date(
                Object.keys(dueList?.months || {})
                  ?.slice()
                  ?.reverse()
                  ?.filter(
                    (text) =>
                      // text !== 'net_balance' &&
                      // text !== 'total_debits' &&
                      // text !== 'unsettled_credits' &&
                      text !== 'earlier_than'
                  )
                  .slice(-1)[0]
              )
                .toLocaleString('en-IN', {
                  month: 'short',
                  year: 'numeric',
                })
                .replace(' ', '_')
                ?.toLocaleLowerCase()}`
            : moment(key).format('MMM_YYYY')?.toLocaleLowerCase(),
        order:
          key === 'earlier_than'
            ? index + 1
            : Object.keys(dueList?.months || {}).length - (index + 1),
      })
    );
  }

  const columns = [
    {
      field: 'date',
      headerName: 'Invoice Date',
      renderCell: (params) => {
        return (
          <div>
            <p> {moment(params.row.date).format('DD-MM-YYYY')}</p>
          </div>
        );
      },
      maxWidth: 100,
    },
    {
      field: 'bill_number',
      headerName: 'Invoice No',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              if (params.row?.bill_id) {
                recurringPdfDownload(params.row?.bill_id);
              }
            }}
          >
            <p
              style={{
                color: params.row?.bill_id ? '#1F4FB9' : '#000',
                cursor: params.row?.bill_id && 'pointer',
              }}
            >
              {params.row?.bill_number}
            </p>
          </div>
        );
      },
      // maxWidth: 150,
      width: 120,
      sortable: false,
    },
    {
      field: 'narration',
      headerName: 'Description',
      // maxWidth: 500,
      width: 250,
      sortable: false,
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerClassName: 'left-align--header',
      maxWidth: 120,
      width: 90,
      type: 'number',
      renderCell: (params) => {
        return (
          <div>
            <p
              style={{
                color: Number(params.row.amount) >= 0 ? '#000' : '#950909',
              }}
            >
              {FormattedAmount(params.row.amount)}
            </p>
          </div>
        );
      },
      flex: 1,
    },
    {
      field: 'collection',
      headerName: 'Collection',
      headerClassName: 'left-align--header',
      maxWidth: 120,
      width: 90,
      type: 'number',
      renderCell: (params) => {
        return (
          <div>
            <p
              style={{
                color: Number(params.row.collection) >= 0 ? '#000' : '#950909',
              }}
            >
              {FormattedAmount(params.row.collection)}
            </p>
          </div>
        );
      },
      flex: 1,
    },
    {
      field: 'balance',
      headerName: 'Balance',
      headerClassName: 'left-align--header',
      maxWidth: 120,
      width: 90,
      type: 'number',
      renderCell: (params) => {
        return (
          <div>
            <p
              style={{
                color: Number(params.row.balance) >= 0 ? '#000' : '#950909',
              }}
            >
              {FormattedAmount(params.row.balance)}
            </p>
          </div>
        );
      },
      flex: 1,
    },
    {
      field: 'due_date',
      headerName: 'Due Date',
      maxWidth: 100,
      renderCell: (params) => {
        return (
          <div>
            <p>{moment(params.row.due_date).format('DD-MM-YYYY')}</p>
          </div>
        );
      },
    },
    {
      field: 'credit_period',
      headerName: 'Credit Period',
      headerClassName: 'left-align--header',
      maxWidth: 150,
      width: 120,
      align: 'center',
      type: 'number',
      renderCell: (params) => {
        return (
          <div>
            <p>{params.row.credit_period}</p>
          </div>
        );
      },
    },
    {
      field: 'over_due_age',
      headerName: 'Overdue Age',
      headerClassName: 'left-align--header',
      maxWidth: 150,
      width: 120,
      align: 'center',
      type: 'number',
      renderCell: (params) => {
        return (
          <div>
            <p
              style={{
                color:
                  Number(params?.row?.over_due_age) >= 0 ? '#000' : '#950909',
              }}
            >
              {params?.row?.over_due_age} Days
            </p>
          </div>
        );
      },
      flex: 1,
    },
  ];

  React.useEffect(() => {
    if (tabValue === 'advance_cr') {
      const temp = columns.filter(
        (val) =>
          val.field !== 'due_date' &&
          val.field !== 'credit_period' &&
          val.field !== 'over_due_age'
      );
      setOutstandingColumn(temp);
    } else if (
      OutstandingColumn?.length === 0 ||
      OutstandingColumn?.length === 6
    ) {
      setOutstandingColumn(columns);
    }
  }, [tabValue]);

  const columnsForStmt = [
    {
      field: 'date',
      headerName: 'Date',
      renderCell: (params) => {
        return (
          <div>
            <p> {moment(params.row.date).format('DD-MM-YYYY')}</p>
          </div>
        );
      },
      maxWidth: 100,
      sortable: false,
    },
    {
      field: 'document_number',
      headerName: 'Doc No',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              if (params.row?.invoice_id) {
                recurringPdfDownload(params.row?.invoice_id);
              }
            }}
          >
            <p
              style={{
                color: params.row?.invoice_id ? '#1F4FB9' : '#000',
                cursor: params.row?.invoice_id && 'pointer',
              }}
            >
              {params.row?.document_number}
            </p>
          </div>
        );
      },
      maxWidth: 220,
      width: 180,
      sortable: false,
    },
    {
      field: 'narration',
      headerName: 'Narration',
      renderCell: (params) => {
        return (
          <div>
            <p>{params.row?.narration}</p>
          </div>
        );
      },
      // maxWidth: 250,
      // width: 220,
      sortable: false,
      flex: 1,
    },
    {
      field: 'debit',
      headerName: 'Sales',
      type: 'number',
      headerClassName: 'left-align--header',
      renderCell: (params) => {
        return (
          <div>
            <p
              style={{
                color: Number(params.row.debit) >= 0 ? '#000' : '#950909',
              }}
            >
              {FormattedAmount(params.row.debit)}
            </p>
          </div>
        );
      },
      maxWidth: 140,
      width: 110,
      sortable: false,
    },
    {
      field: 'credit',
      headerName: 'Receipts',
      type: 'number',
      headerClassName: 'left-align--header',
      renderCell: (params) => {
        return (
          <div>
            <p
              style={{
                color: Number(params.row.credit) >= 0 ? '#000' : '#950909',
              }}
            >
              {FormattedAmount(params.row.credit)}
            </p>
          </div>
        );
      },
      maxWidth: 140,
      width: 110,
      sortable: false,
    },
    {
      field: 'balance',
      headerName: 'Balance',
      type: 'number',
      headerClassName: 'left-align--header',
      renderCell: (params) => {
        return (
          <div>
            <p
              style={{
                color: Number(params.row.balance) >= 0 ? '#000' : '#950909',
              }}
            >
              {FormattedAmount(params.row.balance)}
            </p>
          </div>
        );
      },
      maxWidth: 140,
      width: 110,
      sortable: false,
    },
  ];

  const device = localStorage.getItem('device_detect');

  const handleDownloadClick = async (res) => {
    if(device === 'desktop'){
      const image = await fetch(res.pdf);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);
  
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = 'receivable-invoice';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      JSBridge.downloadLink(res.pdf);
    }
    
  };

  const pdfGeneration = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/invoices/${html?.id}/url?type=pdf`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    ).then((res) => {
      if (res && !res.error) {
        enableLoading(false);
        // if (desktopView) {
        // window.open(res.pdf, '_blank', 'popup');
        handleDownloadClick(res);
        // } else {
        //   JSBridge.shareLink(res, type);
        // }
      } else {
        enableLoading(false);
        openSnackBar({
          message: Object.values(res.errors).join(', '),
          type: MESSAGE_TYPE.ERROR,
        });
      }
    });
    // }
  };
  // const classes = useStyles();
  // const [anchorElEndDate, setAnchorElEndDate] = React.useState(null);
  // const openCalendarEnd = Boolean(anchorElEndDate);
  // const [radio, SetRadio] = React.useState('');

  return (
    <>
      <div className={css.ageing}>
        <>
          {statement ? (
            <>
              <div>
                <Mui.Box
                  sx={{
                    background: '#fff',
                    // height: '5rem',
                    borderBottom: 1,
                    borderColor: 'divider',
                    marginBottom: '24px',
                  }}
                >
                  <Mui.Tabs
                    value={tabValue}
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    textColor="#000"
                    // indicatorColor="#d84315"
                    sx={{
                      '& .MuiTabs-indicator': {
                        width: '100%',
                        backgroundColor: '#F08B32',
                        // height: '5px',
                      },
                      '& .MuiTabs-scroller': {
                        overflowX: 'auto !important',
                        '&::-webkit-scrollbar': { width: '0px', height: 0 },
                      },
                      '& .MuiTabs-flexContainer': {
                        justifyContent: 'space-between',
                      },
                      '& .Mui-selected': {
                        color: '#F08B32 !important',
                      },
                    }}
                  >
                    {tab
                      ?.sort(function (a, b) {
                        return a.order - b.order;
                      })
                      ?.map((val) => (
                        <Mui.Tab
                          sx={{ margin: '0 5px' }}
                          label={
                            <Mui.ListItemText
                              primary={
                                <Mui.Typography
                                  sx={{
                                    fontSize: '13px',
                                    fontWeight: 400,
                                    color:
                                      tabValue === val?.id
                                        ? '#F08B32'
                                        : '#5B5B5B',
                                  }}
                                >
                                  {val.name}
                                </Mui.Typography>
                              }
                              secondary={
                                <Mui.Typography
                                  sx={{
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: val?.name === 'Advance' && '#9C3131',
                                  }}
                                >
                                  {val.amount}
                                </Mui.Typography>
                              }
                              sx={{ margin: 0 }}
                            />
                          }
                          value={val.id}
                        />
                      ))}
                  </Mui.Tabs>
                </Mui.Box>
              </div>
              {/* {billData?.length > 0 ? ( */}
              {/* {console.log({ billData })}
              {console.log({ columns })} */}
              {(device === 'desktop' && (
                <div
                  style={{
                    background: '#FFF',
                    borderRadius: '8px',
                    paddingTop: '5px',
                  }}
                >
                  <p className={css.openBillsCustName}>{custName}</p>
                  <Mui.Box
                    sx={{
                      height: 350,
                      width: '100%',
                      '& .left-align--header': {
                        '.MuiDataGrid-columnHeaderDraggableContainer': {
                          flexDirection: 'row !important',
                        },
                        '.MuiDataGrid-columnHeaderTitleContainer': {
                          flexDirection: 'row !important',
                        },
                        textAlign: 'left',
                      },
                    }}
                  >
                    <DataGridPro
                      rows={billData}
                      columns={OutstandingColumn}
                      // loading={stmtData}
                      rowHeight={48}
                      disableColumnReorder
                      hideFooter
                      // checkboxSelection
                      disableSelectionOnClick
                      disableColumnFilter
                      disableColumnMenu
                      getRowId={(row) => row?.ids}
                      components={{
                        NoRowsOverlay: () => (
                          <Mui.Stack
                            height="100%"
                            alignItems="center"
                            justifyContent="center"
                          >
                            No Data Found
                          </Mui.Stack>
                        ),
                      }}
                      sx={{
                        background: '#fff',
                        borderRadius: '0px',
                        border: 'none',
                        '& .MuiDataGrid-columnHeadersInner': {
                          background: '#F7F7F7',
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                          whiteSpace: 'break-spaces',
                          textAlign: 'center',
                          lineHeight: '20px',
                          fontFamily: 'Lexend !important',
                          fontWeight: '400 !important',
                          fontSize: '14px',
                        },
                        '& .MuiDataGrid-cell': {
                          fontFamily: 'Lexend !important',
                          fontWeight: '400 !important',
                          fontSize: '14px',
                        },
                        '& .MuiDataGrid-row': {
                          borderBottom: '1px solid #D6D6D6 !important',
                        },
                        '& .MuiDataGrid-root': {
                          border: 'none !important',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                          border: 'none',
                        },
                      }}
                    />
                  </Mui.Box>
                </div>
              )) || (
                <Mui.Stack padding="0 10px 10px 10px">
                  <Mui.Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Mui.Typography className={css.headTop} width="24%">
                      Inv. No
                    </Mui.Typography>
                    <Mui.Typography className={css.headTop} width="24%">
                      Inv. Date
                    </Mui.Typography>
                    <Mui.Typography className={css.headTop} width="24%">
                      Amount
                    </Mui.Typography>
                    <Mui.Typography className={css.headTop} width="28%" noWrap>
                      Overdue Age
                    </Mui.Typography>
                  </Mui.Stack>
                  <Mui.Divider />
                  {billData?.length > 0 ? (
                    billData.map((val, index) => (
                      <OpenContent
                        val={val}
                        i={index}
                        handleClick={(id_s) => recurringPdfDownload(id_s)}
                      />
                    ))
                  ) : (
                    <Mui.Typography align="center">
                      {loading ? 'Data is being fetched' : 'No Data Found'}
                    </Mui.Typography>
                  )}
                </Mui.Stack>
              )}
            </>
          ) : (
            <>
              {/* {stmtData?.length > 0 ? ( */}
              {/* {console.log({ stmtData })}
              {console.log({ columnsForStmt })} */}
              {
                (device === 'desktop' && (
                  <div
                    style={{
                      background: '#FFF',
                      borderRadius: '8px',
                      paddingTop: '5px',
                    }}
                  >
                    <p className={css.openBillsCustName}>{custName}</p>
                    <Mui.Box
                      sx={{
                        height: 350,
                        width: { md: '100%', xs: '95%' },
                        '& .left-align--header': {
                          '.MuiDataGrid-columnHeaderDraggableContainer': {
                            flexDirection: 'row !important',
                          },
                          '.MuiDataGrid-columnHeaderTitleContainer': {
                            flexDirection: 'row !important',
                          },
                          textAlign: 'left',
                        },
                      }}
                    >
                      <DataGridPro
                        rows={stmtData}
                        columns={columnsForStmt}
                        // loading={stmtData}
                        rowHeight={48}
                        disableColumnReorder
                        // hideFooter
                        // checkboxSelection
                        disableSelectionOnClick
                        disableColumnFilter
                        disableColumnMenu
                        getRowId={(row) => row?.ids}
                        components={{
                          Footer: CustomFooter,
                          Header: CustomHeader,
                          NoRowsOverlay: () => (
                            <Mui.Stack
                              height="100%"
                              alignItems="center"
                              justifyContent="center"
                            >
                              No Data Found
                            </Mui.Stack>
                          ),
                        }}
                        componentsProps={{
                          // row: {stmtData}
                          footer: { funEnd: setEndDate, balance: closing },
                          header: { funStart: setStartDate, balance: opening },
                        }}
                        sx={{
                          background: '#fff',
                          borderRadius: '0px',
                          border: 'none',
                          '& .MuiDataGrid-virtualScrollerContent': {
                            paddingBottom: '55px',
                          },
                          '& .MuiDataGrid-columnHeadersInner': {
                            background: '#F7F7F7',
                          },
                          '& .MuiDataGrid-virtualScroller': {
                            marginTop: '110px !important',
                          },
                          '& .MuiDataGrid-row': {
                            borderBottom: '1px solid #D6D6D6 !important',
                          },
                          '& .MuiDataGrid-columnHeaderTitle': {
                            whiteSpace: 'break-spaces',
                            textAlign: 'center',
                            lineHeight: '20px',
                            fontFamily: 'Lexend !important',
                            fontWeight: '400 !important',
                            fontSize: '14px',
                          },
                          '& .MuiDataGrid-cell': {
                            fontFamily: 'Lexend !important',
                            fontWeight: '400 !important',
                            fontSize: '14px',
                          },
                          '& div:has(> div[class="Ageing_divHeader"])': {
                            zIndex: 1,
                            position: 'absolute',
                            top: '3.7rem',
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                          },
                          '& .MuiDataGrid-root': {
                            border: 'none !important',
                          },
                          '& .MuiDataGrid-columnHeaders': {
                            border: 'none',
                          },

                          // '& .MuiDataGrid-main + div':{overflow: 'overlay'}
                        }}
                      />
                    </Mui.Box>
                  </div>
                )) || (
                  <>
                    {stmtData?.length > 0 &&
                      stmtData?.map((val) => (
                        <Mui.Box className={css.stmtBox}>
                          <Mui.Stack
                            direction="column"
                            onClick={() => {
                              if (val?.invoice_id) {
                                recurringPdfDownload(val?.invoice_id);
                              }
                            }}
                          >
                            <Mui.Stack>
                              <Mui.ListItemText
                                primary={
                                  <Mui.Typography
                                    className={css.blueText}
                                    sx={{
                                      color: val?.invoice_id
                                        ? '#1F4FB9'
                                        : '#000 !important',
                                    }}
                                  >
                                    {val?.document_number || '-'}
                                  </Mui.Typography>
                                }
                                secondary={
                                  <Mui.Typography className={css.grayText}>
                                    {val?.date
                                      ? moment(val?.date).format('DD MMM YYYY')
                                      : '-'}
                                  </Mui.Typography>
                                }
                              />
                            </Mui.Stack>
                            <Mui.Grid container>
                              <Mui.Grid item xs={4}>
                                <Mui.ListItemText
                                  primary={
                                    <Mui.Typography className={css.grayText}>
                                      Sales
                                    </Mui.Typography>
                                  }
                                  secondary={
                                    <Mui.Typography className={css.blackText}>
                                      {FormattedAmount(val?.debit)}
                                    </Mui.Typography>
                                  }
                                />
                              </Mui.Grid>
                              <Mui.Grid item xs={4}>
                                <Mui.ListItemText
                                  primary={
                                    <Mui.Typography className={css.grayText}>
                                      Receipts
                                    </Mui.Typography>
                                  }
                                  secondary={
                                    <Mui.Typography className={css.blackText}>
                                      {FormattedAmount(val?.credit)}
                                    </Mui.Typography>
                                  }
                                />
                              </Mui.Grid>
                              <Mui.Grid item xs={4}>
                                <Mui.ListItemText
                                  primary={
                                    <Mui.Typography className={css.grayText}>
                                      Balance
                                    </Mui.Typography>
                                  }
                                  secondary={
                                    <Mui.Typography className={css.blackText}>
                                      {FormattedAmount(val?.balance)}
                                    </Mui.Typography>
                                  }
                                />
                              </Mui.Grid>
                            </Mui.Grid>
                            <Mui.Stack>
                              <Mui.ListItemText
                                primary={
                                  <Mui.Typography className={css.grayText}>
                                    Description
                                  </Mui.Typography>
                                }
                                secondary={
                                  <Mui.Typography className={css.descText}>
                                    {val?.narration || '-'}
                                  </Mui.Typography>
                                }
                              />
                            </Mui.Stack>
                          </Mui.Stack>
                        </Mui.Box>
                      ))}
                    {stmtData?.length === 0 && (
                      <Mui.Typography align="center">
                        {loading ? 'Data is being fetched' : 'No Data Found'}
                      </Mui.Typography>
                    )}
                  </>
                )
              }
            </>
          )}
        </>
        {/* )} */}
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
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div onClick={() => pdfGeneration()}>
                <img src={download} alt="download" />
              </div>
            </div>
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
                  'div.nobreak{page-break-inside:avoid} ::-webkit-scrollbar {width:0px}'
                )}
                title="html"
                frameBorder="0"
                className={css.scrolling}
              />
            </Mui.Stack>
          </Mui.DialogContent>
        </Mui.Dialog>
      </div>
    </>
  );
};

export default OpenBills;
