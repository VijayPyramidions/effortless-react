import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  GetBillBoxBillsState,
  GetVendorBillsCountState,
  GetVendorBillDetailsState,
  DeleteVendorBillState,
  ResetVendorBillAction,
  ClearStateGetVendorBillDetails,
  // ClearStateGetVendorBillsCount,
} from '@action/Store/Reducers/Bills/BillBoxState';

import { Dialog, DialogContent } from '@material-ui/core';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Popover,
  Button,
  CircularProgress,
  // Dialog,
  // DialogContent,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@material-ui/core/styles';
import { DataGridPremium } from '@mui/x-data-grid-premium';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';

import InfiniteScroll from 'react-infinite-scroll-component';
import { Document, Page } from 'react-pdf'

import {
  BillBoxLoadingSkeleton,
  MobileCardLoadingSkeleton,
  InvoiceLoadingSkeleton,
} from '@components/SkeletonLoad/SkeletonLoader';
import BillViewDialog from '../components/BillViewDialog';
// import { IndianCurrency } from '@components/utils';

import * as css from './billBox.scss';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const ScannedBills = ({
  show,
  employeeFilter,
  debounceSearchQuery,
  height,
}) => {
  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const {
    BillBoxDataState,
    VendorBillDetails,
    BillBoxDataLoad,
    BillBoxAction,
  } = useSelector((value) => value.BillBox);

  const [drawer, setDrawer] = useState({});
  const [billBoxData, setBillBoxData] = useState([]);
  const [billId, setBillId] = useState('');
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const [billState, setBillState] = useState({});
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = (numPages) => {
    setPageNumber(numPages?.numPages);
  };

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const scannedBillColumn = [
    {
      field: 'file_url',
      headerName: 'Bill',
      renderCell: (param) => {
        return (
          <Box
            border="1px solid rgba(0, 0, 0, 0.20)"
            borderRadius="4px"
            sx={{ overflow: 'auto', height: '48px', position: 'relative' }}
          >
            {param?.row?.file_url?.includes('.jpeg') ||
            param?.row?.file_url?.includes('.png') ||
            param?.row?.file_url?.includes('.pdf') === false ? (
              <img
                src={param?.row?.file_url}
                alt="upload"
                style={{
                  width: '48px',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Document
                file={param?.row?.file_url}
                className={css.pdfstyle_billbox}
                loading=''
                onLoadSuccess={() => {}}
              >
                <Page pageNumber={1} className={css.page} />
              </Document>
            )}
            {param?.row?.is_duplicated && (
              <Box className={css.duplicate_bill} sx={{ height: '100%' }} />
            )}
            {param?.row?.ocr_processing && (
              <Box className={css.ocr_processing} sx={{ height: '100%' }} />
            )}
          </Box>
        );
      },
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
    },
    {
      field: 'name',
      headerName: 'Vendor',
      valueGetter: (params) =>
        params.row?.vendor?.name || params.row?.new_vendor?.name || '-',
      flex: 1,
    },
    {
      field: 'document_number',
      headerName: 'Bill Number',
      sortable: false,
      flex: 1,
      width: 240,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      renderCell: (params) => {
        return (
          <Typography className="MuiDataGrid-columnHeaderTitle">
            {params?.value < 0
              ? `(${currencyFormatter.format(Math.abs(params?.value))})`
              : currencyFormatter.format(params?.value || 0)}
          </Typography>
        );
      },
      width: 160,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
    },
    {
      field: 'action',
      headerName: 'Action',
      renderCell: (param) => {
        return (
          <Button
            className={css.scannedbillmoreactionbtn}
            onClick={(event) => {
              handleDrawer('moreaction', event?.currentTarget);
              setBillId(param?.row?.id);
              setBillState(param?.row);
            }}
          >
            <MoreHorizIcon sx={{ color: '#000' }} />
          </Button>
        );
      },
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 120,
      disableColumnMenu: true,
      filterable: false,
    },
  ];

  const handleClickRow = (params) => {
    if (params?.field === 'action' || params?.row?.is_duplicated || params?.row?.ocr_processing) {
      return;
    }
    const { row } = params;
    dispatch(GetVendorBillDetailsState({ bill_id: row?.id }));
  };

  const BillBoxListCall = (searchVal, page) => {
    dispatch(
      GetBillBoxBillsState({
        pageNum: page || 1,
        scanned: true,
        searchText: searchVal || '',
        userId: employeeFilter?.user_id || '',
      })
    );
  };

  const loadMore = () => {
    if (BillBoxDataState?.pages > 1) {
      BillBoxListCall('', BillBoxDataState?.page + 1);
    }
  };

  useEffect(() => {
    if (BillBoxDataState?.data) {
      if (BillBoxDataState?.page === 1) {
        setBillBoxData(BillBoxDataState?.data);
      } else {
        setBillBoxData((prev) => [...prev, ...BillBoxDataState?.data]);
      }
      if (
        BillBoxDataState?.pages > 1 &&
        BillBoxDataState?.page < BillBoxDataState?.pages &&
        desktopView &&
        show === 'list'
      ) {
        BillBoxListCall('', BillBoxDataState?.page + 1);
      }
      if (!desktopView || show === 'grid') {
        sethasMoreItems(BillBoxDataState?.page !== BillBoxDataState?.pages);
      }
    }
  }, [JSON.stringify(BillBoxDataState), show]);

  useEffect(() => {
    BillBoxListCall();
    return () => {
      dispatch(ClearStateGetVendorBillDetails());
      // dispatch(ClearStateGetVendorBillsCount());
    };
  }, []);

  useEffect(() => {
    if (employeeFilter !== null) {
      BillBoxListCall();
    }
  }, [employeeFilter]);

  useEffect(() => {
    if (debounceSearchQuery !== null) {
      BillBoxListCall(debounceSearchQuery);
    }
  }, [debounceSearchQuery]);

  useEffect(() => {
    if (Object.keys(VendorBillDetails || {})?.length > 0) {
      navigate('/bill-upload', {
        state: {
          selected: VendorBillDetails,
          billBox: true,
          stateForBack: {
            showButton: 'Scanned Bills',
          },
        },
      });
    }
  }, [JSON.stringify(VendorBillDetails)]);

  useEffect(() => {
    if (BillBoxAction === 'vendorBillDeleted') {
      dispatch(
        GetBillBoxBillsState({
          pageNum: 1,
          scanned: true,
          searchText: '',
          userId: employeeFilter?.user_id || '',
        })
      );

      if (drawer?.billViewDialog) {
        handleDrawer('billViewDialog', false);
        setPageNumber(1);
      }

      dispatch(GetVendorBillsCountState());
      dispatch(ResetVendorBillAction());
    }
  }, [BillBoxAction]);

  return (
    <>
      {show === 'grid' && (
        <>
          {!BillBoxDataLoad && (
            <BillBoxLoadingSkeleton desktopView={desktopView} />
          )}
          {BillBoxDataState?.data?.length === 0 &&
            BillBoxDataLoad === 'dataLoad' && (
              <Typography align="center" my="16px">
                No Bill Found.
              </Typography>
            )}
          {BillBoxDataState?.data?.length > 0 &&
            BillBoxDataLoad === 'dataLoad' && (
              <InfiniteScroll
                dataLength={billBoxData?.length}
                next={() => loadMore()}
                scrollThreshold="20px"
                hasMore={hasMoreItems}
                loader={
                  <div style={{ display: 'flex' }}>
                    <CircularProgress
                      style={{ color: '#F08B32', margin: '40%' }}
                    />
                  </div>
                }
                height={height}
              >
                <Box className={css.scanned_bills}>
                  {billBoxData?.map((val) => (
                    <Box
                      className={css.upload_bill_pic}
                      key={val?.id}
                      onClick={() => {
                        if (desktopView && !val?.is_duplicated && !val?.ocr_processing) {
                          dispatch(
                            GetVendorBillDetailsState({ bill_id: val?.id })
                          );
                        } else if (!desktopView) {
                          handleDrawer('billViewDialog', true);
                          setBillId(val?.id);
                          setBillState(val);
                        }
                      }}
                      sx={{
                        cursor:
                          val?.is_duplicated || val?.ocr_processing
                            ? 'unset !important'
                            : 'pointer',
                      }}
                    >
                      {val?.ocr_processing && <div className={css.ocrprocessing}><CircularProgress sx={{color: '#9f9f9f',}} /></div>}
                      {val?.file_url?.includes('.jpeg') ||
                      val?.file_url?.includes('.png') ||
                      val?.file_url?.includes('.pdf') === false ? (
                        <img
                          src={val?.file_url}
                          alt="upload"
                          style={{ width: '100%', height: '100%' }}
                        />
                      ) : (
                        <Document
                          file={val?.file_url}
                          loading={
                            val?.ocr_processing ? '' : <Stack>
                              <CircularProgress
                                sx={{
                                  color: '#F08B32',
                                }}
                              />
                            </Stack>
                          }
                          onLoadSuccess={() => {}}
                          className={css.pdfshow_billbox}
                        >
                          <Page pageNumber={1} className={css.page} />
                        </Document>
                      )}
                      {/* <iframe
                        src={val?.file_url}
                        title="bill"
                        frameBorder="0"
                        style={{
                          width: '100%',
                          height: '100%',
                          pointerEvents: 'none',
                        }}
                      /> */}
                      {val?.is_duplicated && (
                        <Box
                          className={css.duplicate_bill}
                          sx={{ fontSize: desktopView ? '14px' : '12px' }}
                        >
                          Duplicate
                        </Box>
                      )}
                      {val?.ocr_processing && (
                        <Box
                          className={css.ocr_processing}
                          sx={{ height: '100%' }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </InfiniteScroll>
            )}{' '}
        </>
      )}
      {show === 'list' && !desktopView && (
        <>
          {!BillBoxDataLoad && <MobileCardLoadingSkeleton NumCard={6} />}
          {BillBoxDataState?.data?.length === 0 &&
            BillBoxDataLoad === 'dataLoad' && (
              <Typography align="center" my="16px">
                No Bill Found.
              </Typography>
            )}
          {BillBoxDataState?.data?.length > 0 &&
            BillBoxDataLoad === 'dataLoad' && (
              <InfiniteScroll
                dataLength={billBoxData?.length}
                next={() => loadMore()}
                scrollThreshold="20px"
                hasMore={hasMoreItems}
                loader={
                  <div style={{ display: 'flex' }}>
                    <CircularProgress
                      style={{ color: '#F08B32', margin: '40%' }}
                    />
                  </div>
                }
                height={height}
              >
                <Box className={css.scanned_bills_list}>
                  {billBoxData?.map((val) => (
                    <Box
                      component={Stack}
                      gap="8px"
                      direction="row"
                      alignItems="center"
                      borderBottom="1px solid rgba(0, 0, 0, 0.1)"
                    >
                      <Stack
                        className={css.scanned_bills_list_mobile}
                        key={val?.id}
                        onClick={() => {
                          handleDrawer('billViewDialog', true);
                          setBillId(val?.id);
                          setBillState(val);
                        }}
                      >
                        {val?.file_url?.includes('.jpeg') ||
                        val?.file_url?.includes('.png') ||
                        val?.file_url?.includes('.pdf') === false ? (
                          <img
                            src={val?.file_url}
                            alt="upload"
                            style={{ width: '100%', height: '100%' }}
                          />
                        ) : (
                          <Document
                            file={val?.file_url}
                            loading=''
                            onLoadSuccess={() => {}}
                            className={css.pdfshow_billbox}
                          >
                            <Page pageNumber={1} className={css.page} />
                          </Document>
                        )}
                        {/* <iframe
                          src={val?.file_url}
                          title="bill"
                          frameBorder="0"
                          style={{
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                          }}
                        /> */}
                        {val?.is_duplicated && (
                          <Box
                            className={css.duplicate_bill}
                            sx={{ fontSize: desktopView ? '14px' : '12px' }}
                          >
                            Duplicate
                          </Box>
                        )}
                        {val?.ocr_processing && (
                          <Box
                            className={css.ocr_processing}
                            sx={{ height: '100%' }}
                          />
                        )}
                      </Stack>
                      <Box
                        component={Stack}
                        gap="8px"
                        onClick={() => {
                          if (!val?.is_duplicated && !val?.ocr_processing) {
                            dispatch(
                              GetVendorBillDetailsState({ bill_id: val?.id })
                            );
                          }
                        }}
                      >
                        <Typography className={css.vendorname}>
                          {val?.vendor?.name || val?.new_vendor?.name || '-'}
                        </Typography>
                        <Stack gap="12px" direction="row" alignItems="center">
                          <Typography className={css.billlabel}>
                            Bill Number
                          </Typography>
                          <Typography className={css.billvalue}>
                            {val?.document_number}
                          </Typography>
                        </Stack>
                        <Stack gap="12px" direction="row" alignItems="center">
                          <Typography className={css.billlabel}>
                            Amount
                          </Typography>
                          <Typography className={css.billvalue}>
                            {currencyFormatter.format(
                              Math.abs(val?.amount || 0)
                            )}
                          </Typography>
                        </Stack>
                      </Box>
                      <IconButton
                        sx={{ marginLeft: 'auto' }}
                        onClick={(e) => {
                          setBillId(val?.id);
                          setBillState(val);
                          handleDrawer('moreaction', e?.currentTarget);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </InfiniteScroll>
            )}
        </>
      )}
      {show === 'list' && desktopView && (
        <DataGridPremium
          rows={BillBoxDataLoad === null ? [] : billBoxData}
          columns={scannedBillColumn}
          density="compact"
          rowHeight={80}
          columnHeaderHeight={80}
          disableChildrenSorting
          disableColumnResize
          disableColumnReorder
          disableColumnPinning
          disableAggregation
          disableRowGrouping
          disableColumnSelector
          hideFooter
          disableRowSelectionOnClick
          onCellClick={handleClickRow}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Bill Found.
              </Stack>
            ),
            LoadingOverlay: InvoiceLoadingSkeleton,
          }}
          loading={BillBoxDataLoad === null}
          className={css.scanned_bills_list}
          sx={{
            background: '#fff',
            borderRadius: '0px',
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              background: '#F5F5F5',
              border: 'none',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              whiteSpace: 'break-spaces',
              textAlign: 'center',
              lineHeight: '20px',
              fontFamily: "'Lexend', sans-serif !important",
              fontWeight: '500 !important',
              fontSize: '14px',
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer !important',
              padding: '4px 0',
            },
            '& .MuiDataGrid-cell': {
              fontFamily: "'Lexend', sans-serif !important",
              fontWeight: '300 !important',
              fontSize: '13px',
            },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
          }}
        />
      )}

      <Popover
        open={Boolean(drawer?.moreaction)}
        anchorEl={drawer?.moreaction}
        onClose={() => handleDrawer('moreaction', null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          elevation: 3,
          style: {
            borderRadius: '8px',
            border: '0.5px solid #C7C7C7',
            background: '#FFF',
            width: '206px',
            padding: '4px 0',
          },
        }}
      >
        {[
          {
            name: 'More details',
            click: () => {
              handleDrawer('moreaction', null);
              handleDrawer('billDetails', true);
            },
          },
          {
            name: 'Delete Bill',
            click: () => {
              handleDrawer('moreaction', null);
              handleDrawer('deleteBill', true);
            },
          },
        ]?.map((val) => (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="start"
            className={css.moreactionbtn}
            component={Button}
            onClick={() => val?.click(billId)}
          >
            {val?.name}
          </Stack>
        ))}
      </Popover>

      <SelectBottomSheet
        open={drawer?.deleteBill && !desktopView}
        triggerComponent
        onClose={() => handleDrawer('deleteBill', null)}
        name="deleteBill"
        styleDrawerMinHeight="auto"
      >
        <DeleteContent
          handleNo={() => handleDrawer('deleteBill', null)}
          handleYes={() => {
            handleDrawer('deleteBill', null);
            dispatch(
              DeleteVendorBillState({ bill_id: billId, from: 'billBox' })
            );
          }}
        />
      </SelectBottomSheet>
      <Dialog
        open={drawer?.deleteBill && desktopView}
        onClose={() => handleDrawer('deleteBill', null)}
        PaperProps={{ style: { width: 400, borderRadius: 12 } }}
      >
        <DeleteContent
          handleNo={() => handleDrawer('deleteBill', null)}
          handleYes={() => {
            handleDrawer('deleteBill', null);
            dispatch(
              DeleteVendorBillState({ bill_id: billId, from: 'billBox' })
            );
          }}
        />
      </Dialog>
      <Dialog
        fullScreen
        open={drawer?.billViewDialog}
        PaperProps={{
          elevation: 0,
          style: {
            width: '100%',
            overflow: 'visible',
            background: '#fff',
          },
        }}
      >
        <DialogContent className={css.gallery_view}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={css.topcont}
          >
            <IconButton
              sx={{ color: '#f08b32' }}
              onClick={() => {
                handleDrawer('billViewDialog', false);
                setPageNumber(1);
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <Stack
              direction="column"
              gap="4px"
              alignItems="center"
              className={css.titlecont}
            >
              <Typography className={css.date}>
                {moment(billState?.created_at).format('DD MMM')}
              </Typography>
              <Typography className={css.time}>
                {moment(billState?.created_at).format('h:mm a')}
              </Typography>
            </Stack>
            <Typography
              className={css.moredetails}
              component={Button}
              onClick={() => handleDrawer('billDetails', true)}
            >
              More Details
            </Typography>
          </Stack>
          <Grid className={css.iframeViewDocument}>
            {billState?.file_url?.includes('.jpeg') ||
            billState?.file_url?.includes('.png') ||
            billState?.file_url?.includes('.pdf') === false ? (
              <img
                src={billState?.file_url}
                alt="upload"
                style={{
                  width: '100%',
                  height: '100%',
                  margin: 'auto',
                  objectFit: 'inherit',
                }}
              />
            ) : (
              Array.from({ length: pageNumber }, (_, i) => i + 1).map((i) => (
                <Document
                  file={billState?.file_url}
                  className={css.pdfStyle}
                  loading={
                    <Stack sx={{height: '76vh', justifyContent: 'center'}}>
                      <CircularProgress
                        sx={{
                          color: '#F08B32',
                        }}
                      />
                    </Stack>
                  }
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={i} className={css.page} />
                </Document>
              ))
            )}
          </Grid>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            height="8vh"
            gap="30px"
            padding="16px 20px 20px"
          >
            <Button
              className={css.secondarybutton}
              onClick={() => handleDrawer('deleteBill', true)}
            >
              Delete
            </Button>
            {!billState?.is_duplicated && (
              <Button
                className={css.primaryButton}
                onClick={() =>
                  dispatch(
                    GetVendorBillDetailsState({ bill_id: billState?.id })
                  )
                }
                disabled={billState?.ocr_processing}
              >
                Record
              </Button>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
      <SelectBottomSheet
        open={drawer?.billDetails}
        triggerComponent
        onClose={() => {
          handleDrawer('billDetails', false);
        }}
        styleDrawerMinHeight="auto"
      >
        {!desktopView && <Puller />}
        <Box className={css.scannedbilldetailscard}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className={css.headertext}>Bill Details</Typography>
            {/* <Box component={Stack} direction="row" gap="4px">
                  <IconButton
                    onClick={() => {
                      handleDrawer('billDetails', false);
                      dispatch(GetVendorBillDetailsState({ bill_id: billState?.id }));
                    }}
                  >
                    <img src={new_bill_edit} alt="edit" />
                  </IconButton>
                </Box> */}
            {billState?.file_url && desktopView && (
              <Box
                onClick={() => {
                  handleDrawer('viewBill', true);
                }}
                component={Button}
                className={css.viewuploadbill}
              >
                View Bill
              </Box>
            )}
          </Stack>
          <Box
            component={Stack}
            direction="column"
            gap="20px"
            margin="16px 0"
            height={desktopView ? 'auto' : '44vh'}
            sx={{ overflow: 'auto' }}
          >
            {[
              {
                label: 'Bill Number',
                value: billState?.document_number || '',
              },
              {
                label: 'Document Date',
                value:
                  (billState?.document_date &&
                    moment(billState?.document_date).format('DD-MM-YYYY')) ||
                  '-',
              },
              {
                label: 'Vendor',
                value:
                  billState?.vendor?.name || billState?.new_vendor?.name || '-',
              },
              {
                label: 'Amount',
                value: currencyFormatter.format(
                  Math.abs(billState?.amount || 0)
                ),
              },
              {
                label: 'TDS',
                value: currencyFormatter.format(
                  Math.abs(billState?.tds_amount || 0)
                ),
              },
              {
                label: 'Expense Category',
                value: billState?.expense_account?.name || '-',
              },
              { label: 'Payment Mode', value: billState?.payment_mode || '-' },
              {
                label: 'Description',
                value: billState?.description || '-',
              },
            ]?.map((val) => (
              <Stack direction="column" gap="4px">
                <Typography className={css.label}>{val?.label}</Typography>
                <Typography className={css.value}>{val?.value}</Typography>
              </Stack>
            ))}
          </Box>
        </Box>
      </SelectBottomSheet>
      {drawer?.viewBill && (
        <BillViewDialog
          file_url={billState?.file_url}
          onClose={() => handleDrawer('viewBill', null)}
        />
      )}
    </>
  );
};

export default ScannedBills;

export const DeleteContent = ({ handleNo, handleYes }) => {
  return (
    <div className={css.deleteddialog}>
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Typography className={css.deletehead}>Confirm</Typography>
        {/* {!desktopView && (
          <IconButton onClick={() => handleNo()}>
            <CloseIcon />
          </IconButton>
        )} */}
      </Stack>

      <Typography className={css.descriptiontext}>
        Are you sure you want to delete this Bill?
      </Typography>

      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Button className={css.secondarybutton} onClick={() => handleNo()}>
          No
        </Button>
        <Button className={css.primaryButton} onClick={() => handleYes()}>
          Yes
        </Button>
      </Stack>
    </div>
  );
};
