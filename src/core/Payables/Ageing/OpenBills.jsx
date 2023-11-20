/* eslint-disable no-unused-vars */

import React, { useContext } from 'react';
import JSBridge from '@nativeBridge/jsbridge';
import * as Mui from '@mui/material';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
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
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import { Document, Page } from 'react-pdf'
import download from '@assets/WebAssets/download.svg';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import OpenContent from '../Components/OpenContent';
import * as css from './Ageing.scss';

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
  const { organization, user, enableLoading, openSnackBar, loading } =
    useContext(AppContext);
  const [billData, setBillData] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(tabState || 'total');
  const [dueList, setDueList] = React.useState([]);
  const [billPdf, setBillPdf] = React.useState({
    open: false,
    file: null,
  });
  const [OutstandingColumn, setOutstandingColumn] = React.useState([]);
  const device = localStorage.getItem('device_detect');
  const [pageNumber, setPageNumber] = React.useState(1);

  const onDocumentLoadSuccess = (numPages) => {
    setPageNumber(numPages?.numPages);
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const PayablesDetailsCall = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/payables/ageing/${id}?date=${moment(
        date
      ).format('YYYY-MM-DD')}&report_view=${wise}`,
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
          if (res.message === 'Vendor not found') {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.ERROR,
            });
          } else {
            setDueList(res);
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

  React.useEffect(() => {
    enableLoading(true);
    RestApi(
      `organizations/${
        organization.orgId
      }/payables/open_bills?vendor_id=${id}&${
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
          PayablesDetailsCall();
        } else if (res.error) {
          enableLoading(false);
          openSnackBar({
            message: res?.errors,
            type: MESSAGE_TYPE.ERROR,
          });
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
  }, [id, tabValue, date]);

  const billPdfDownload = (r_id) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/vendor_bills/${r_id}`, {
      method: METHOD.GET,
      headers: {
        authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (!res?.error) {
          if (res?.message) {
            openSnackBar({
              message: res.message || `Sorry we will look into it`,
              type: MESSAGE_TYPE.WARNING,
            });
          } else if (res?.file_url) {
            setBillPdf({ file: res?.file_url, open: true });
          } else if (!res?.file_url) {
            openSnackBar({
              message: 'There is no bill here',
              type: MESSAGE_TYPE.ERROR,
            });
          }
        } else if (res?.error) {
          openSnackBar({
            message: res.error || res.message || `Sorry we will look into it`,
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((error) => {
        enableLoading(false);
        console.log('error', error);
      });
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
      id: 'advance_dr',
      order: wise === '' ? 8 : Object.keys(dueList?.months || {}).length + 1,
    },
    {
      name: 'Unsettled Debits',
      amount:
        (dueList?.unsettled_credits &&
          FormattedAmount(dueList?.unsettled_credits)) ||
        '-',
      id: 'unsettled_dr',
      order: wise === '' ? 9 : Object.keys(dueList?.months || {}).length + 2,
    },
  ];
  // eslint-disable-next-line no-lone-blocks
  if (wise === '') {
    [
      'not_due_cr',
      '1_to_30_cr',
      '31_to_60_cr',
      '61_to_120_cr',
      '121_to_180_cr',
      '181_to_360_cr',
      'above_360_cr',
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
                  ?.filter((text) => text !== 'earlier_than')
                  .slice(-1)[0]
              )
                .toLocaleString('en-US', {
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
                  ?.filter((text) => text !== 'earlier_than')
                  .slice(-1)[0]
              )
                .toLocaleString('en-US', {
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
      headerName: 'Bill Date',
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
      headerName: 'Bill No',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              if (params.row?.bill_id) {
                billPdfDownload(params.row?.bill_id);
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
      headerName: 'Payments',
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
            <p
              style={{
                color:
                  Number(params.row.credit_period) >= 0 ? '#000' : '#950909',
              }}
            >
              {params.row.credit_period}
            </p>
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
      headerName: 'DOC No',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              if (params.row?.vendor_bill_id) {
                billPdfDownload(params.row?.vendor_bill_id);
              }
            }}
          >
            <p
              style={{
                color: params.row?.vendor_bill_id ? '#1F4FB9' : '#000',
                cursor: params.row?.vendor_bill_id && 'pointer',
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
      headerName: 'Payments',
      headerClassName: 'left-align--header',
      type: 'number',
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
      headerName: 'Purchases',
      headerClassName: 'left-align--header',
      type: 'number',
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
      headerClassName: 'left-align--header',
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
      maxWidth: 140,
      width: 110,
      sortable: false,
    },
  ];

  const handleDownloadClick = async () => {
    if(device === 'desktop'){
      const image = await fetch(billPdf?.file);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);
  
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = 'payable-bill';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      JSBridge.downloadLink(billPdf?.file);
    }
  };

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
                  {billData.map((val, index) => (
                    <OpenContent
                      val={val}
                      vendorId={id}
                      i={index}
                      key={val.ids}
                      callFunction={billPdfDownload}
                    />
                    // console.log(val,index)
                  ))}
                </Mui.Stack>
              )}
            </>
          ) : (
            <>
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
                          paddingBottom: '55px'
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
                        // '& .MuiDataGrid-main + div':{overflow: 'overlay'}
                      }}
                      p
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
                            if (val?.vendor_bill_id) {
                              billPdfDownload(val?.vendor_bill_id);
                            }
                          }}
                        >
                          <Mui.Stack>
                            <Mui.ListItemText
                              primary={
                                <Mui.Typography
                                  className={css.blueText}
                                  sx={{
                                    color: val?.vendor_bill_id
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
                                    Payment
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
                                    Purchases
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
              )}
            </>
          )}
        </>
        <Mui.Dialog
          PaperProps={{
            elevation: 3,
            style: {
              width: '86%',
              height: billPdf?.file?.includes('.pdf') ? '100%' : '',
              // position: 'absolute',

              overflow: 'visible',
              borderRadius: 16,
              cursor: 'pointer',
            },
          }}
          open={billPdf?.open}
          onClose={() => setBillPdf({})}
        >
          {/* <Mui.Stack direction="row" justifyContent="flex-end" p={1}>
            <a href={file} target="_blank" rel="noreferrer" download>
              <img src={download} alt="download" />
            </a>
          </Mui.Stack> */}
          <Mui.DialogContent style={{ position: 'relative' }}>
            <div
              style={{ display: 'flex', justifyContent: 'flex-end' }}
              onClick={() => handleDownloadClick()}
            >
              {/* <a href={billPdf?.file} target="_blank" rel="noreferrer" download> */}
              <img src={download} alt="download" />
              {/* </a> */}
            </div>
            <Mui.Grid className={css.iframeViewDocument}>
              {billPdf?.file?.includes('.jpeg') ||
              billPdf?.file?.includes('.png') ||
              billPdf?.file?.includes('.pdf') === false ? (
                <img
                  src={billPdf?.file}
                  alt="upload"
                  style={{ width: '100%' }}
                />
              ) : (
                Array.from({ length: pageNumber }, (_, i) => i + 1).map((i) => (
                  <Document
                    file={billPdf?.file}
                    className={css.pdfStyle}
                    loading="  "
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={i} className={css.page} />
                  </Document>
                ))
              )}
            </Mui.Grid>
          </Mui.DialogContent>
        </Mui.Dialog>
      </div>
    </>
  );
};

export default OpenBills;
