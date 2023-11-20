import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AppContext from '@root/AppContext.jsx';
import {
  GetInvoiceToBeGeneratedState,
  ClearStateInvoiceToBeGenerated,
} from '@action/Store/Reducers/Invoice/InvoiceEWayBillState';
import InfiniteScroll from 'react-infinite-scroll-component';

import axiosInst from '@action/ApiConfig/AxiosInst';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';

import {
  Box,
  Stack,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  Chip,
  MenuItem,
} from '@mui/material';
import { makeStyles, styled } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/HighlightOff';
import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  // GridColDef,
} from '@mui/x-data-grid-premium';

import { customCurrency } from '@components/formattedValue/FormattedValue';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import {
  EntityFilter,
  DateFilter,
} from '../../../components/MobileSheetFilters/SheetFilter';
import { InvoiceDialogView } from '../../../components/InvoiceBilDialog/InvoiceBillDialogView';
import {
  InvoiceLoadingSkeleton,
  MobileInvoiceLoadingSkeleton,
} from '../../../components/SkeletonLoad/SkeletonLoader';

import * as css from './EWayBillStyle.scss';

const INVOICE_TYPES = [
  {
    text: 'Tax Invoice',
    payload: 'tax_invoice',
    color: '#A5D399',
  },
  {
    text: 'Test Invoice',
    payload: 'test_invoice',
    color: '#A5D390',
  },
  // {
  //   text: 'Estimate',
  //   payload: 'estimate',
  //   color: '#99BFD3',
  // },
  // {
  //   text: 'Credit Note',
  //   payload: 'credit_note',
  //   color: '#A5D399',
  // },
  {
    text: 'Debit Note',
    payload: 'debit_note',
    color: '#A5D399',
  },
];

const useStyles = makeStyles({
  menutext: {
    color: '#283049 !important',
    fontFamily: 'Lexend, sans-serif !important',
    fontSize: '14px !important',
    fontStyle: 'normal !important',
    fontWeight: '300 !important',
    lineHeight: 'normal !important',
    borderBottom: '1px solid rgba(199, 199, 199, 0.50) !important',
    textTransform: 'capitalize !important',
  },
  selectedchips: {
    maxWidth: '190px !important',
    background: '#fdf1e6 !important',
    color: '#F08B32 !important',
    border: `1px solid #F08B32 !important`,
    borderRadius: '25px !important',
  },
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

const ToBeGenerated = () => {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { InvoiceToBeGeneratedState, ToBeGeneratedLoad } = useSelector(
    (value) => value.InvoiceEWayBill
  );
  const { organization } = useContext(AppContext);

  const [invoiceAction, setInvoiceAction] = useState({});
  const [valueOptionsFilter, setValueOptionsFilter] = useState([]);
  const [ToBeGeneratedData, setToBeGeneratedData] = useState([]);
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const [drawer, setDrawer] = useState({});
  const [SelectedCustomerList, setSelectedCustomerList] = useState([]);
  const [SelectedDate, setSelectedDate] = useState({
    startDate: null,
    endDate: null,
  });
  const [SelectedType, setSelectedType] = useState({});
  const [SelectedStatus, setSelectedStatus] = useState('');

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
        <GridToolbarQuickFilter sx={{ marginLeft: 'auto' }} />
      </GridToolbarContainer>
    );
  }

  const handleClick = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const ShowFilter = (check) => {
    if (
      SelectedCustomerList?.length > 0 &&
      (check === 'all' || check === 'customer')
    ) {
      return true;
    }
    if (
      SelectedDate?.startDate &&
      SelectedDate?.endDate &&
      (check === 'all' || check === 'date')
    ) {
      return true;
    }
    if (
      Object?.keys(SelectedType || {})?.length > 0 &&
      (check === 'all' || check === 'type')
    ) {
      return true;
    }
    if (SelectedStatus && (check === 'all' || check === 'status')) {
      return true;
    }
    return false;
  };

  const handleFilterClose = (name, id) => {
    if (name === 'customer') {
      setSelectedCustomerList(
        SelectedCustomerList?.filter((val) => val?.id !== id)
      );
    } else if (name === 'date') {
      setSelectedDate({
        startDate: null,
        endDate: null,
      });
    } else if (name === 'type') {
      setSelectedType({});
    } else if (name === 'status') {
      setSelectedStatus('');
    }
  };

  const FetchEWayBill = (page_num) => {
    let filter = '';
    if (SelectedCustomerList && SelectedCustomerList?.length === 1) {
      filter += `customer_id=${SelectedCustomerList[0]?.id || ''}`;
    } else if (SelectedCustomerList && SelectedCustomerList.length > 1) {
      SelectedCustomerList.forEach((v) => {
        filter += `customer_ids[]=${v?.id}&`;
      });
    }
    const param = {
      filterCustomer: filter,
      fromDate:
        SelectedDate?.startDate && SelectedDate?.endDate
          ? moment(SelectedDate?.startDate).format('YYYY-MM-DD')
          : '',
      toDate:
        SelectedDate?.startDate && SelectedDate?.endDate
          ? moment(SelectedDate?.endDate).format('YYYY-MM-DD')
          : '',
      typeFilter: SelectedType?.payload,
      statusFilter: SelectedStatus?.toLocaleLowerCase() || '',
    };
    dispatch(
      GetInvoiceToBeGeneratedState({
        from: 'e_way_bill',
        numPage: page_num || 1,
        without_e_way_bills: true,
        e_way_bill_excluded: false,
        ...param,
      })
    );
  };

  const ExcludeFunction = (id_s) => {
    dispatch(enableLoading(true));
    axiosInst
      .patch(
        `organizations/${organization?.orgId}/invoices/${id_s}/exclude_e_way_bill`
      )
      .then((res) => {
        if (res && !res.data.error) {
          // dispatch(ClearStateInvoiceToBeGenerated());
          dispatch(
            GetInvoiceToBeGeneratedState({
              from: 'e_way_bill',
              numPage: 1,
              without_e_way_bills: true,
              e_way_bill_excluded: false,
            })
          );
        }

        if (res.data.error) {
          dispatch(
            openSnackbar({
              message: res.data.message || 'Something went wrong',
              type: MESSAGE_TYPE.ERROR,
            })
          );
        }

        dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message || 'Error',
            type: MESSAGE_TYPE.ERROR,
          })
        );
        dispatch(enableLoading(false));
      });
  };

  const ToBeGeneratedColumn = [
    {
      field: 'invoice_number',
      headerName: 'Invoice Number',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              if (params?.row?.id) {
                setInvoiceAction({
                  open: true,
                  id: params?.row?.id,
                  name: params.row?.invoice_number,
                });
              }
            }}
          >
            <p
              style={{
                whiteSpace: 'nowrap',
                color: params.row?.id ? '#1F4FB9' : '#000',
                cursor: params.row?.id && 'pointer',
              }}
            >
              {params.row?.invoice_number}
            </p>
          </div>
        );
      },
      sortable: false,
    },
    {
      field: 'customer_name',
      headerName: 'Customer',
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center">
            <Avatar className={css.avatar}>
              {params.row?.customer_name[0]}
            </Avatar>
            <p style={{ whiteSpace: 'break-spaces' }}>
              {params.row?.customer_name}
            </p>
          </Stack>
        );
      },
      type: 'singleSelect',
      valueOptions: valueOptionsFilter,
    },
    {
      field: 'date',
      headerName: 'Invoice Date',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) => moment(params.row?.date).format('DD-MM-YYYY'),
      width: 105,
    },
    {
      field: 'invoice_value',
      headerName: 'Invoice Value',
      type: 'number',
      headerClassName: 'left-align--header',
      renderCell: (params) => {
        return (
          <div>
            <p style={{ whiteSpace: 'nowrap' }}>
              {customCurrency(
                params.row?.currency?.iso_code,
                params.row?.currency?.locale
              ).format(params.row?.invoice_value)}
            </p>
          </div>
        );
      },
      align: 'right',
      width: 110,
    },
    {
      field: 'generator_name',
      headerName: 'Created By',
      renderCell: (params) => {
        return (
          <p style={{ whiteSpace: 'nowrap' }}>{params.row?.generator_name}</p>
        );
      },
      sortable: false,
      width: 105,
    },
    {
      field: 'approved_date',
      headerName: 'Approved On',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
        moment(params.row?.approved_date).format('DD-MM-YYYY'),
      width: 105,
    },
    {
      field: 'id',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-around"
            width="100%"
          >
            <Button
              className={css.generatebtn}
              onClick={() =>
                navigate(`/invoice-e-waybill-new?id=${params?.row?.id}`)
              }
            >
              Generate E-Way Bill
            </Button>
            <Button
              className={css.excludebtn}
              onClick={() => ExcludeFunction(params?.row?.id)}
            >
              Exclude
            </Button>
          </Stack>
        );
      },
      headerAlign: 'center',
      sortable: false,
      disableExport: true,
      disableColumnMenu: true,
      filterable: false,
    },
  ];

  const loadMore = () => {
    if (InvoiceToBeGeneratedState?.pages > 1) {
      FetchEWayBill(InvoiceToBeGeneratedState?.page + 1);
    }
  };

  useEffect(() => {
    if (InvoiceToBeGeneratedState?.data) {
      if (InvoiceToBeGeneratedState?.page === 1) {
        setToBeGeneratedData(InvoiceToBeGeneratedState?.data);
      } else {
        setToBeGeneratedData((prev) => [
          ...prev,
          ...InvoiceToBeGeneratedState?.data,
        ]);
      }
      if (
        InvoiceToBeGeneratedState?.pages > 1 &&
        InvoiceToBeGeneratedState?.page < InvoiceToBeGeneratedState?.pages &&
        device === 'desktop'
      ) {
        dispatch(
          GetInvoiceToBeGeneratedState({
            from: 'e_way_bill',
            numPage: InvoiceToBeGeneratedState?.page + 1,
            without_e_way_bills: true,
            e_way_bill_excluded: false,
          })
        );
      }
      if (device === 'mobile') {
        sethasMoreItems(
          InvoiceToBeGeneratedState?.page !== InvoiceToBeGeneratedState?.pages
        );
      }
    }
  }, [JSON.stringify(InvoiceToBeGeneratedState)]);

  useEffect(() => {
    // dispatch(
    //   GetInvoiceToBeGeneratedState({
    //     from: 'e_way_bill',
    //     numPage: 1,
    //     without_e_way_bills: true,
    //     e_way_bill_excluded: false,
    //   })
    // );
    FetchEWayBill();
    return () => {
      dispatch(ClearStateInvoiceToBeGenerated());
    };
  }, [SelectedCustomerList, SelectedDate, SelectedStatus, SelectedType]);

  useEffect(() => {
    if (device === 'desktop') {
      const temp = Array.from(
        new Set(ToBeGeneratedData?.map((invoice) => invoice?.customer_name))
      )?.map((customerName) => ({ value: customerName, label: customerName }));
      setValueOptionsFilter(temp);
    }
  }, [device, ToBeGeneratedData]);

  return (
    <>
      {device === 'desktop' ? (
        <Box
          className={css.tobegenerateddesktop}
          sx={{
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
          <Typography component="p" className={css.toptext}>
            Invoice List
          </Typography>

          <DataGridPremium
            rows={ToBeGeneratedData}
            columns={ToBeGeneratedColumn}
            density="compact"
            getRowHeight={() => 'auto'}
            rowHeight={60}
            disableChildrenSorting
            disableColumnResize
            disableColumnReorder
            hideFooter
            disableRowSelectionOnClick
            disableColumnPinning
            disableRowGrouping
            disableAggregation
            components={{
              Toolbar: CustomToolbar,
              NoRowsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  No Data Found
                </Stack>
              ),
              LoadingOverlay: InvoiceLoadingSkeleton,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            loading={ToBeGeneratedLoad === null}
            sx={{
              background: '#fff',
              borderRadius: '0px',
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                background: '#F5F5F5',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'break-spaces',
                textAlign: 'center',
                lineHeight: '20px',
                fontFamily: "'Lexend', sans-serif !important",
                fontWeight: '400 !important',
                fontSize: '13px',
              },
              '& .MuiDataGrid-row': {
                // cursor: 'pointer !important',
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
        </Box>
      ) : (
        <>
          <Stack
            padding="16px 20px"
            direction="row"
            gap="12px"
            sx={{
              width: 'calc(100% - 40px)',
              overflow: 'auto',
              background: '#fff',
            }}
          >
            <Chip
              label="Customer"
              variant="outlined"
              deleteIcon={<KeyboardArrowDownIcon />}
              onClick={() => handleClick('customersheet', true)}
              onDelete={() => handleClick('customersheet', true)}
            />
            <Chip
              label="Date"
              variant="outlined"
              deleteIcon={<KeyboardArrowDownIcon />}
              onClick={() => handleClick('datesheet', true)}
              onDelete={() => handleClick('datesheet', true)}
            />
            <Chip
              label="Type"
              variant="outlined"
              deleteIcon={<KeyboardArrowDownIcon />}
              onClick={() => handleClick('typesheet', true)}
              onDelete={() => handleClick('typesheet', true)}
            />
            <Chip
              label="Status"
              variant="outlined"
              deleteIcon={<KeyboardArrowDownIcon />}
              onClick={() => handleClick('statussheet', true)}
              onDelete={() => handleClick('statussheet', true)}
            />
          </Stack>

          {ShowFilter('all') && (
            <Stack
              padding="0 16px 16px 20px"
              direction="row"
              gap="12px"
              sx={{
                width: 'calc(100% - 40px)',
                overflow: 'auto',
                background: '#fff',
              }}
            >
              {ShowFilter('customer') &&
                SelectedCustomerList?.map((val) => (
                  <Chip
                    label={val?.short_name}
                    variant="outlined"
                    deleteIcon={<CloseIcon />}
                    onDelete={() => handleFilterClose('customer', val?.id)}
                    className={classes.selectedchips}
                  />
                ))}
              {ShowFilter('date') && (
                <Chip
                  label={`${moment(SelectedDate?.startDate).format(
                    'MMM DD'
                  )} - ${moment(SelectedDate?.endDate).format('MMM DD, YYYY')}`}
                  variant="outlined"
                  deleteIcon={<CloseIcon />}
                  onDelete={() => handleFilterClose('date')}
                  className={classes.selectedchips}
                />
              )}
              {ShowFilter('type') && (
                <Chip
                  label={SelectedType?.text}
                  variant="outlined"
                  deleteIcon={<CloseIcon />}
                  onDelete={() => handleFilterClose('type')}
                  className={classes.selectedchips}
                />
              )}
              {ShowFilter('status') && (
                <Chip
                  label={SelectedStatus}
                  variant="outlined"
                  deleteIcon={<CloseIcon />}
                  onDelete={() => handleFilterClose('status')}
                  className={classes.selectedchips}
                />
              )}
            </Stack>
          )}
          {ToBeGeneratedLoad === null && (
            <div
              style={{
                overflowX: 'hidden',
                overflowY: 'auto',
                height: 'calc(100vh - 250px)',
              }}
            >
              <MobileInvoiceLoadingSkeleton />
            </div>
          )}

          {ToBeGeneratedLoad !== null && ToBeGeneratedData?.length === 0 && (
            <p style={{ textAlign: 'center' }}>No Data Found.</p>
          )}

          {ToBeGeneratedLoad !== null && ToBeGeneratedData?.length > 0 && (
            <div
              style={{
                overflow: 'auto',
                height: ShowFilter('all')
                  ? 'calc(100vh - 340px)'
                  : 'calc(100vh - 300px)',
              }}
              id="draftContent"
              className={css.tobegeneratedmobile}
            >
              <InfiniteScroll
                dataLength={ToBeGeneratedData?.length}
                next={() => loadMore()}
                scrollThreshold="20px"
                hasMore={hasMoreItems}
                loader={
                  <div style={{ display: 'flex' }}>
                    <CircularProgress
                      style={{ color: '#F08B32', margin: 'auto' }}
                    />
                  </div>
                }
                scrollableTarget="draftContent"
              >
                {/* <div className={css.tobegeneratedmobile}> */}
                {ToBeGeneratedData?.map((val) => (
                  <Box
                    className={css.tobegeneratedbox}
                    onClick={() =>
                      navigate(`/invoice-e-waybill-new?id=${val?.id}`)
                    }
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width="100%"
                      gap="4%"
                    >
                      <p className={css.customername}>{val?.customer_name}</p>
                      <p className={css.invoiceamt}>
                        {customCurrency(
                          val?.currency?.iso_code,
                          val?.currency?.locale
                        ).format(val?.invoice_value)}
                      </p>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width="100%"
                      gap="2%"
                    >
                      <p className={css.invoicedate}>
                        {moment(val?.created_at).format('DD-MM-YYYY, HH:MM')}
                      </p>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (val?.id) {
                            setInvoiceAction({
                              open: true,
                              id: val?.id,
                              name: val?.invoice_number,
                            });
                          }
                        }}
                        style={{ width: '30%' }}
                      >
                        <p
                          style={{
                            color: val?.id ? '#1F4FB9' : '#000',
                          }}
                          className={css.invoicenumber}
                        >
                          {val?.invoice_number}
                        </p>
                      </div>
                      <Box
                        sx={{
                          padding: '4px 8px',
                          background: '#99BFD3',
                          borderRadius: '8px',
                          width: '30%',
                        }}
                      >
                        <p className={css.invoicetype}>
                          {
                            INVOICE_TYPES?.find(
                              (data) => data.payload === val?.document_type
                            )?.text
                          }
                        </p>
                      </Box>
                    </Stack>
                  </Box>
                ))}
                {/* </div> */}
              </InfiniteScroll>
            </div>
          )}
        </>
      )}
      {invoiceAction?.open && (
        <InvoiceDialogView
          invoiceAction={invoiceAction}
          setInvoiceAction={setInvoiceAction}
        />
      )}
      <SelectBottomSheet
        open={drawer?.customersheet}
        onClose={() => handleClick('customersheet', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <EntityFilter
          EntityType="customer"
          listSelection={SelectedCustomerList}
          handleSelection={(val) => setSelectedCustomerList(val)}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        open={drawer?.datesheet}
        onClose={() => handleClick('datesheet', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <DateFilter
          Title="Select Start & End Date"
          listSelection={SelectedDate}
          handleSelection={(val) => setSelectedDate(val)}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        open={drawer?.typesheet}
        onClose={() => handleClick('typesheet', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        {device === 'mobile' && <Puller />}
        <Box padding="36px 20px 20px">
          <p className={css.headertext}>Select Type</p>
        </Box>
        {INVOICE_TYPES.map((data) => (
          <MenuItem
            key={data?.payload}
            value={data?.payload}
            onClick={() => {
              setSelectedType(data);
              handleClick('typesheet', false);
            }}
            className={classes.menutext}
            sx={{
              background:
                SelectedType?.payload === data?.payload && '#f08b3250',
            }}
          >
            {data?.text}
          </MenuItem>
        ))}
      </SelectBottomSheet>
      <SelectBottomSheet
        open={drawer?.statussheet}
        onClose={() => handleClick('statussheet', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        {device === 'mobile' && <Puller />}
        <Box padding="36px 20px 20px">
          <p className={css.headertext}>Select Status</p>
        </Box>
        {['Approved', 'Cancelled'].map((data) => (
          <MenuItem
            key={data}
            value={data}
            onClick={() => {
              setSelectedStatus(data);
              handleClick('statussheet', false);
            }}
            className={classes.menutext}
            sx={{
              background: SelectedStatus === data && '#f08b3250',
            }}
          >
            {data}
          </MenuItem>
        ))}
      </SelectBottomSheet>
    </>
  );
};

export default ToBeGenerated;
