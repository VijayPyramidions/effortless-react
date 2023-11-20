import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { capitalizeFirstLetter } from '@components/utils';
import {
  GetInvoiceDashboardState,
  GetInvoiceDraftState,
  ClearStateInvoiceDraft,
  DeleteDraftInvoiceState,
  ClearStateActionInvoice,
} from '@action/Store/Reducers/Invoice/InvoiceState';
import {
  GetCustomerEntityState,
  ClearSateCustomerEntity,
} from '@action/Store/Reducers/General/GeneralState';
import moment from 'moment';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import * as Mui from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { makeStyles, Drawer, Chip, CircularProgress } from '@material-ui/core';
import Checkbox from '@components/Checkbox/Checkbox.jsx';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid-premium';
import downArrowBlack from '@assets/downArrowBlack.svg';
import InfiniteScroll from 'react-infinite-scroll-component';
import Paper from '@mui/material/Paper';
import { customCurrency } from '@components/formattedValue/FormattedValue';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as themes from '@root/theme.scss';
import AppContext from '@root/AppContext.jsx';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import * as Router from 'react-router-dom';
import ReceivablesPopOver from '../Receivables/Components/ReceivablesPopover';
import Calender from './Calander';
import {
  InvoiceLoadingSkeleton,
  MobileInvoiceLoadingSkeleton,
} from '../../components/SkeletonLoad/SkeletonLoader';

import * as css from './CreateInvoiceContainer.scss';

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiPaper-root': {
    minHeight: '25vh',
    maxHeight: '80vh',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
  },
}));

const useStyles = makeStyles(() => ({
  chips: {
    marginRight: '5px',
    '& .MuiChip-root': {
      background: 'white',
      border: '1px solid #f0f0f0',
      flexDirection: 'row-reverse !important',
    },
    '& .MuiChip-icon': {
      marginRight: '5px',
      marginLeft: '-10px',
    },
  },
  selectedchips: {
    minWidth: '190px',
    maxWidth: '45% !important',
    margin: '0 6px 0 0',
    background: '#fdf1e6',
    color: themes.colorPrimaryButton,
    border: `1px solid ${themes.colorPrimaryButton}`,
    borderRadius: '25px',
    marginBottom: '15px',
  },
  textStyle: {
    fontWeight: '400 !important',
    fontStyle: 'normal !important',
    fontSize: '15px !important',
    lineHeight: '19px !important',
    color: '#283049 !important',
  },
  formControl: {
    width: '100%',
  },
}));

const hiddenFields = ['__row_group_by_columns_group__', 'id'];

const getTogglableColumns = (columns) => {
  return columns
    .filter((column) => !hiddenFields.includes(column.field))
    .map((column) => column.field);
};

const DraftInvoiceContainer = () => {
  const {
    // organization,
    // user,
    setActiveInvoiceId,
    // openSnackBar,
    loading,
    userPermissions,
    estimateName,
  } = useContext(AppContext);
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const dispatch = useDispatch();
  const { invoiceDraftData, draftLoad, actionDraftInvoiceData } = useSelector(
    (value) => value.Invoice,
  );
  const { customerEntity } = useSelector((value) => value.General);

  const device = localStorage.getItem('device_detect');
  const classes = useStyles();
  const [activeItem, setActiveItem] = useState({});
  const [draftInvoice, setDraftInvoice] = useState([]);
  const [drawerSort, setDrawerSort] = React.useState(false);
  const [customerDrawer, setCustomerDrawer] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [customerList, setCustomerList] = React.useState([]);
  const [customerID, setCustomerID] = React.useState(undefined);
  const [orderOfValue, setOrderOfValue] = React.useState(false);
  const [orderBy, setOrderBy] = React.useState('');
  const [sortValue, setSortValue] = React.useState('');
  const [toDate, setToDate] = useState(undefined);
  const [fromDate, setFromDate] = useState(undefined);
  const [query, setQuery] = useState('');
  const [editSingle, setEditSingle] = useState('');
  const [bottomSheet, setBottomSheet] = useState({
    draftInvoiceDrawer: false,
    deletePopup: false,
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [valueOptionsFilter, setValueOptionsFilter] = React.useState([]);
  const [selectedCustomerList, setSelectedCustomerList] = React.useState([]);

  const [anchorElFor, setAnchorElFor] = React.useState({
    sort: null,
    date: null,
    customerList: null,
  });

  const [webValue, setWebValue] = React.useState({
    fromDate: null,
    toDate: null,
    customerID: [],
    orderBy: null,
  });

  const [drawer, setDrawer] = useState({
    startDate: false,
    endDate: false,
  });

  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();

  const [userRoles, setUserRoles] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    return () => {
      dispatch(ClearSateCustomerEntity());
      dispatch(ClearStateInvoiceDraft());
    };
  }, []);

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Invoicing || {})?.length > 0) {
      if (!userPermissions?.Invoicing?.Invoicing) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRoles({ ...userPermissions?.Invoicing });
    }
  }, [userPermissions]);

  React.useEffect(() => {
    if (invoiceDraftData?.data) {
      if (invoiceDraftData?.page === 1) {
        setDraftInvoice(invoiceDraftData?.data);
      } else {
        setDraftInvoice((prev) => [...prev, ...invoiceDraftData?.data]);
      }
      if (
        invoiceDraftData?.pages > 1 &&
        invoiceDraftData?.page < invoiceDraftData?.pages &&
        device === 'desktop'
      ) {
        dispatch(GetInvoiceDraftState({ numPage: invoiceDraftData?.page + 1 }));
      }
      if (device === 'mobile') {
        sethasMoreItems(invoiceDraftData?.page !== invoiceDraftData?.pages);
      }
    }
  }, [JSON.stringify(invoiceDraftData)]);

  React.useEffect(() => {
    if (customerEntity?.data) {
      if (state?.search_text) {
        setCustomerID(customerEntity?.data?.map((val) => val?.id));
        setSelectedCustomerList(customerEntity?.data);
      }
      if (customerEntity?.page === 1) {
        setCustomerList(customerEntity?.data);
      } else {
        setCustomerList((prev) => [...prev, ...customerEntity?.data]);
      }
    }
  }, [JSON.stringify(customerEntity || {}), state]);

  const InvoiceType = [
    { value: 'tax_invoice', label: 'Tax Invoice' },
    { value: 'test_invoice', label: 'Test Invoice' },
    { value: 'estimate', label: `${capitalizeFirstLetter(estimateName)}` },
    { value: 'credit_note', label: 'Credit Note' },
    { value: 'debit_note', label: 'Debit Note' },
  ];

  const onTriggerDrawerForCalander = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  const handleStartDate = (val) => {
    setFromDate(val);
    setDrawer((d) => ({ ...d, startDate: false }));
  };

  const handleEndDate = (val) => {
    setToDate(val);
    setDrawer((d) => ({ ...d, endDate: false }));
  };

  const onTriggerDrawer = (drawerName) => {
    setBottomSheet((d) => ({ ...d, [drawerName]: true }));
  };

  const handleBottomSheet = (drawerName) => {
    setBottomSheet((d) => ({ ...d, [drawerName]: false }));
  };

  const custListCall = (searchVal, entire) => {
    dispatch(
      GetCustomerEntityState({
        allParties: false,
        pageNum: 1,
        searchText: searchVal || '',
        location: false,
        entire,
      }),
    );
  };

  const fetchDraftInvoice = (page_num) => {
    let filter = '';
    if (customerID && customerID.length === 1) {
      filter += `customer_id=${customerID || ''}`;
    } else if (customerID && customerID.length > 1) {
      customerID.forEach((v) => {
        filter += `customer_ids[]=${v}&`;
      });
    }
    const param = {
      filterCustomer: filter,
      order: value,
      orderBy,
      fromDate: fromDate && toDate ? moment(fromDate).format('YYYY-MM-DD') : '',
      toDate: fromDate && toDate ? moment(toDate).format('YYYY-MM-DD') : '',
      numPage: page_num || 1,
    };
    dispatch(GetInvoiceDraftState(param));
  };

  const loadMore = () => {
    if (invoiceDraftData?.pages > 1) {
      fetchDraftInvoice(invoiceDraftData?.page + 1);
    }
  };

  const deleteInvoice = (id) => {
    let confirmTxt;
    if (activeItem?.document_type === 'credit_note') {
      confirmTxt = 'Credit note deleted Successfully';
    } else if (activeItem?.document_type === 'debit_note') {
      confirmTxt = 'Debit note deleted Successfully';
    } else if (activeItem?.document_type === 'tax_invoice') {
      confirmTxt = 'Invoice deleted Successfully';
    } else if (activeItem?.document_type === 'test_invoice') {
      confirmTxt = 'Test Invoice deleted Successfully';
    } else if (activeItem?.document_type === 'estimate') {
      confirmTxt = `${capitalizeFirstLetter(
        estimateName,
      )} deleted Successfully`;
    }
    dispatch(
      DeleteDraftInvoiceState({
        activeInvoiceSubject: 'invoices',
        invoiceId: id,
        documentType: confirmTxt,
      }),
    );

    handleBottomSheet('deletePopup');
  };

  React.useEffect(() => {
    if (Object.keys(actionDraftInvoiceData?.deleteAction || {})?.length > 0) {
      dispatch(GetInvoiceDraftState({ numPage: 1 }));
      dispatch(
        GetInvoiceDashboardState({
          durationDate: moment().format('YYYY-MM-DD'),
        }),
      );
      dispatch(ClearStateActionInvoice());
    }
  }, [actionDraftInvoiceData?.deleteAction]);

  const openInvoice = () => {
    if (
      !userRoles?.Estimate?.edit_estimate &&
      activeItem?.document_type === 'estimate'
    ) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    if (
      !userRoles?.['Tax Invoice']?.edit_invoices &&
      activeItem?.document_type === 'tax_invoice'
    ) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    setActiveInvoiceId({
      activeInvoiceId: activeItem?.id,
    });
    dispatch(
      GetInvoiceDashboardState({ durationDate: moment().format('YYYY-MM-DD') }),
    );
    navigate(`/invoice-draft-new`, { state: { type: 'draft' } });
  };

  const openInvoiceFromRow = (id, type) => {
    if (!userRoles?.Estimate?.edit_estimate && type === 'estimate') {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    if (!userRoles?.['Tax Invoice']?.edit_invoices && type === 'tax_invoice') {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    setActiveInvoiceId({
      activeInvoiceId: id,
    });
    dispatch(
      GetInvoiceDashboardState({ durationDate: moment().format('YYYY-MM-DD') }),
    );
    navigate(`/invoice-draft-new`, { state: { type: 'draft' } });
  };

  useEffect(() => {
    if (
      (state?.search_text && customerID?.length > 0) ||
      state?.search_text === undefined ||
      device === 'desktop'
    ) {
      fetchDraftInvoice();
    }
    return () => {};
  }, [value, customerID, orderBy, dispatch]);

  useEffect(() => {
    if (fromDate && toDate && device === 'mobile') {
      fetchDraftInvoice();
    } else if (fromDate === '' && toDate === '' && device === 'mobile') {
      fetchDraftInvoice();
    }
  }, [fromDate, toDate]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'rgba(237, 237, 237, 0.15)',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxSizing: 'border-box',
    borderRadius: '8px',
    fontSize: '12px',
    boxShadow: 'None',
  }));

  const onDateChangeFrom = (e) => {
    setWebValue((prev) => ({
      ...prev,
      fromDate: e.format('DD MMM yyyy'),
      toDate: webValue.toDate,
    }));
  };

  const onDateChangeto = (e) => {
    setWebValue((prev) => ({
      ...prev,
      fromDate: webValue.fromDate,
      toDate: e.format('DD MMM yyyy'),
    }));
  };

  useEffect(() => {
    if (device === 'desktop' && webValue.fromDate && webValue.toDate) {
      if (
        new Date(webValue.fromDate).setHours(0, 0, 0, 0) >
        new Date(webValue.toDate).setHours(0, 0, 0, 0)
      ) {
        setWebValue((prev) => ({
          ...prev,
          toDate: webValue.toDate,
          fromDate: null,
        }));
      }
    } else if (device === 'mobile' && fromDate && toDate) {
      if (
        new Date(fromDate).setHours(0, 0, 0, 0) >
        new Date(toDate).setHours(0, 0, 0, 0)
      ) {
        setFromDate('');
      }
    }
  }, [fromDate, webValue.fromDate]);

  useEffect(() => {
    if (device === 'desktop' && webValue.fromDate && webValue.toDate) {
      if (
        new Date(webValue.toDate).setHours(0, 0, 0, 0) <
        new Date(webValue.fromDate).setHours(0, 0, 0, 0)
      ) {
        setWebValue((prev) => ({
          ...prev,
          fromDate: webValue.fromDate,
          toDate: null,
        }));
      }
    } else if (device === 'mobile' && fromDate && toDate) {
      if (
        new Date(toDate).setHours(0, 0, 0, 0) <
        new Date(fromDate).setHours(0, 0, 0, 0)
      ) {
        setToDate('');
      }
    }
  }, [toDate, webValue.toDate]);

  const handleRowSelection = (val) => {
    setActiveItem(val);
    openInvoiceFromRow(val.id, val?.document_type);
  };
  const WebDelete = () => {
    if (
      !userRoles?.Estimate?.delete_estimate &&
      activeItem?.document_type === 'estimate'
    ) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    if (
      !userRoles?.['Tax Invoice']?.delete_invoices &&
      activeItem?.document_type === 'tax_invoice'
    ) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    onTriggerDrawer('deletePopup');
    setAnchorEl(null);
  };

  const MobileDelete = () => {
    if (
      !userRoles?.Estimate?.delete_estimate &&
      activeItem?.document_type === 'estimate'
    ) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    if (
      !userRoles?.['Tax Invoice']?.delete_invoices &&
      activeItem?.document_type === 'tax_invoice'
    ) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    onTriggerDrawer('deletePopup');
    handleBottomSheet('draftInvoiceDrawer');
  };

  React.useEffect(() => {
    if (device === 'desktop') {
      const temp = Array.from(
        new Set(draftInvoice?.map((invoice) => invoice?.customer_name)),
      )?.map((customerName) => ({ value: customerName, label: customerName }));
      setValueOptionsFilter(temp);
    }
  }, [device, draftInvoice]);

  const draftColumn = [
    {
      field: 'invoice_number',
      headerName: 'Invoice Number',
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              setEditSingle(params.row);
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'break-spaces' }}>
              {params.row?.invoice_number}
            </p>
          </div>
        );
      },
      maxWidth: 150,
      width: 130,
      sortable: false,
    },
    {
      field: 'customer_name',
      headerName: 'Customer',
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              setEditSingle(params.row);
              handleRowSelection(params.row);
            }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Mui.Avatar
              className={css.avatar}
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${params.row?.customer_name}&chars=1`}
            />{' '}
            <p style={{ whiteSpace: 'break-spaces' }}>
              {params.row?.customer_name}
            </p>
          </div>
        );
      },
      minWidth: 250,
      type: 'singleSelect',
      valueOptions: valueOptionsFilter,
    },
    {
      field: 'document_type',
      headerName: 'Document Type',
      flex: 1,
      valueFormatter: (params) =>
        InvoiceType.filter((c) => c.value === params?.value)[0]?.label,
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              setEditSingle(params.row);
              handleRowSelection(params.row);
            }}
          >
            <p
              style={{
                whiteSpace: 'break-spaces',
                textTransform: 'capitalize',
              }}
            >
              {InvoiceType.filter((c) => c.value === params?.value)[0]?.label ||
                ' '}
            </p>
          </div>
        );
      },
      maxWidth: 130,
      width: 120,
      sortable: false,
    },
    {
      field: 'invoice_value',
      headerName: 'Taxable Value',
      headerClassName: 'left-align--header',
      type: 'number',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              setEditSingle(params.row);
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'nowrap' }}>
              {customCurrency(
                params.row?.currency?.iso_code,
                params.row?.currency?.locale,
              ).format(params.row?.invoice_value)}
            </p>
          </div>
        );
      },
      maxWidth: 180,
      width: 100,
      align: 'right',
    },
    {
      field: 'created_at',
      headerName: 'Created On',
      type: 'date',
      flex: 1,
      valueGetter: (params) => moment(params.value).toDate(),
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              setEditSingle(params.row);
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'break-spaces' }}>
              {moment(params.row?.created_at).format('DD-MM-yyyy')}
            </p>
          </div>
        );
      },
      maxWidth: 150,
      width: 120,
    },
    {
      field: 'id',
      headerName: '',
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Mui.IconButton
              className={css.dots}
              onClick={(event) => {
                setEditSingle(params.row);
                setActiveItem(editSingle);
                setAnchorEl(event.currentTarget);
              }}
            >
              <MuiIcons.MoreVert sx={{ width: '15px' }} />
            </Mui.IconButton>
          </>
        );
      },
      maxWidth: 50,
      sortable: false,
      align: 'right',
      disableExport: true,
      disableColumnMenu: true,
      filterable: false,
    },
  ];

  useMemo(() => {
    if (editSingle) {
      setActiveItem(editSingle);
    }
  }, [editSingle]);

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
    {
      text: `${capitalizeFirstLetter(estimateName)}`,
      payload: 'estimate',
      color: '#99BFD3',
    },
    {
      text: 'Credit Note',
      payload: 'credit_note',
      color: '#A5D399',
    },
    {
      text: 'Debit Note',
      payload: 'debit_note',
      color: '#A5D399',
    },
  ];

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

  React.useEffect(() => {
    if (
      device === 'mobile' &&
      customerID !== undefined &&
      state?.search_text?.length > 0 &&
      customerID?.length === 0
    ) {
      setQuery('');
      custListCall();
      fetchDraftInvoice();
      navigate('/invoice-draft', { replace: true });
    }
  }, [device, customerID]);

  React.useEffect(() => {
    if (state?.search_text && device === 'mobile') {
      setQuery(state?.search_text);
      custListCall(state?.search_text, true);
    } else if (customerID === undefined && device === 'mobile') {
      custListCall();
    }
  }, [state?.search_text, device]);

  const handleValueChange = (v, checked, cust) => {
    if (checked) {
      if (customerID === undefined || customerID?.length === 0) {
        setCustomerID([v]);
        setSelectedCustomerList([cust]);
      } else {
        setCustomerID((prev) => [...prev, v]);
        setSelectedCustomerList((prev) => [...prev, cust]);
      }
    } else {
      const checkedList = customerID?.filter((item) => item !== v);
      setCustomerID(checkedList);
      const checkedCustomerList = selectedCustomerList?.filter(
        (item) => item?.id !== v,
      );
      setSelectedCustomerList(checkedCustomerList);
    }
  };

  return (
    <div className={css.draftInvoiceContainer}>
      <Mui.Grid
        container
        className={device === 'mobile' ? css.container : css.containerDesktop}
        sx={{
          // desktop to hide
          padding: device === 'desktop' && '0',
        }}
      >
        <Mui.Grid item xs={12} lg={12} md={12}>
          <Mui.Box sx={{ width: '100%', height: '100%' }}>
            <Mui.Stack spacing={1} style={{ height: '100%' }}>
              {device === 'mobile' && (
                <Mui.Stack
                  direction="row"
                  justifyContent="space-between"
                  className={css.stack1}
                >
                  <Mui.Stack direction="column" className={css.stack2}>
                    <Mui.Grid className={css.heading}>Draft Invoices</Mui.Grid>
                    <Mui.Divider
                      className={css.divider}
                      variant="fullWidth"
                    />{' '}
                  </Mui.Stack>
                </Mui.Stack>
              )}
              <Mui.Stack
                direction="row"
                style={{
                  justifyContent: 'space-between',
                  // desktop to hide
                  display: device === 'desktop' && 'none',
                }}
              >
                <div
                  className={css.mainButton}
                  style={{
                    justifyContent:
                      device === 'mobile' ? 'flex-start' : 'space-between',
                    padding:
                      device === 'mobile'
                        ? '5px 0px 5px 0px'
                        : '5px 40px 5px 20px',
                  }}
                >
                  <Mui.Stack direction="row" spacing={2}>
                    <SelectBottomSheet
                      open={orderOfValue}
                      onClose={() => setOrderOfValue(false)}
                      addNewSheet
                      triggerComponent={
                        <>
                          <div
                            className={
                              device === 'mobile'
                                ? css.monthSelection
                                : css.dropdnDesktop
                            }
                            style={{
                              display: 'flex',
                              justifyContent: 'space-around',
                              alignItems: 'center',
                            }}
                            onClick={(event) => {
                              if (device === 'mobile') {
                                setOrderOfValue(true);
                              } else {
                                setAnchorElFor({
                                  sort: null,
                                  date: event.currentTarget,
                                  customerList: null,
                                });
                              }
                            }}
                          >
                            <div className={css.text}>Date</div>
                            <img
                              src={downArrowBlack}
                              alt="arrow"
                              className={css.icon}
                            />
                          </div>

                          <Mui.Popover
                            id="basic-menu-list"
                            anchorEl={anchorElFor.date}
                            open={Boolean(anchorElFor.date)}
                            onClose={() =>
                              setAnchorElFor({ ...anchorElFor, date: null })
                            }
                            MenuListProps={{
                              'aria-labelledby': 'basic-button',
                            }}
                            PaperProps={{
                              elevation: 3,
                              style: {
                                maxHeight: 500,
                                width: '35ch',
                                padding: '5px',
                                borderRadius: 20,
                              },
                            }}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                          >
                            <div className={css.titleDateFilter}>
                              <span>
                                Select the start and end date to filter
                              </span>

                              <div className={css.DatesContainer}>
                                <div className={css.dateSelection}>
                                  <div
                                    style={{
                                      fontSize: '11px',
                                      fontStyle: 'light',
                                      color: '#283049',
                                    }}
                                  >
                                    Start Date
                                  </div>

                                  <div
                                    style={{
                                      marginLeft: '5px',
                                      marginTop: '5px',
                                      fontSize: '14px',
                                      fontStyle: 'bold',
                                      color: '#283049',
                                      display: 'flex',
                                      justifyContent: 'space-around',
                                      alignItems: 'center',
                                      margin: '5px',
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={
                                        webValue.fromDate === null
                                          ? 'dd-mm-yy'
                                          : webValue.fromDate
                                      }
                                      style={{
                                        width: '100%',
                                        border: 'none',
                                        padding: 5,
                                      }}
                                    />
                                    <OnlyDatePicker
                                      selectedDate={webValue.fromDate}
                                      onChange={onDateChangeFrom}
                                    />
                                  </div>
                                </div>

                                <div className={css.dateSelection}>
                                  <div
                                    style={{
                                      fontSize: '11px',
                                      fontStyle: 'light',
                                      color: '#283049',
                                    }}
                                  >
                                    End Date
                                  </div>

                                  <div
                                    style={{
                                      marginLeft: '5px',
                                      marginTop: '5px',
                                      fontSize: '14px',
                                      fontStyle: 'bold',
                                      color: '#283049',
                                      display: 'flex',
                                      justifyContent: 'space-around',
                                      alignItems: 'center',
                                      margin: '5px',
                                    }}
                                  >
                                    <input
                                      type="text"
                                      style={{
                                        width: '100%',
                                        border: 'none',
                                        padding: 5,
                                      }}
                                      value={
                                        webValue.toDate === null
                                          ? 'dd-mm-yy'
                                          : webValue.toDate
                                      }
                                    />
                                    <OnlyDatePicker
                                      selectedDate={webValue.toDate}
                                      onChange={onDateChangeto}
                                    />
                                  </div>
                                </div>
                              </div>
                              <Mui.Button
                                contained
                                className={css.ApplyFilterButton}
                                onClick={() => {
                                  setFromDate(webValue.fromDate);
                                  setToDate(webValue.toDate);
                                  setAnchorElFor({
                                    ...anchorElFor,
                                    date: null,
                                  });
                                }}
                              >
                                Apply Filters
                              </Mui.Button>
                            </div>
                          </Mui.Popover>
                        </>
                      }
                    >
                      <div className={css.effortlessOptions}>
                        <span className={css.title}>Order By</span>
                        <div className={css.DatesContainerMobile}>
                          <div
                            style={{
                              border: '1px solid #A0A4AF',
                              borderRadius: '10px',
                              width: '90%',
                              padding: '5px',
                              margin: '10px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '11px',
                                fontStyle: 'light',
                                color: '#283049',
                              }}
                            >
                              Start Date
                            </div>

                            <div
                              style={{
                                marginLeft: '5px',
                                marginTop: '5px',
                                fontSize: '14px',
                                fontStyle: 'bold',
                                color: '#283049',
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                margin: '5px',
                              }}
                            >
                              <input
                                type="text"
                                value={
                                  !fromDate
                                    ? 'dd-mm-yy'
                                    : moment(fromDate).format('DD-MM-YYYY')
                                }
                                style={{
                                  pointerEvents: 'none',
                                  width: '70%',
                                  border: 'none',
                                }}
                              />

                              <SelectBottomSheet
                                name="startDate"
                                addNewSheet
                                triggerComponent={
                                  <CalendarIcon
                                    style={{ width: 20, color: '#949494' }}
                                    onClick={() => {
                                      onTriggerDrawerForCalander('startDate');
                                    }}
                                  />
                                }
                                open={drawer.startDate}
                                onTrigger={onTriggerDrawerForCalander}
                                onClose={() => {
                                  setDrawer((d) => ({
                                    ...d,
                                    startDate: false,
                                  }));
                                }}
                              >
                                <Calender
                                  head="Select Start Date"
                                  button="Select"
                                  handleDate={handleStartDate}
                                />
                              </SelectBottomSheet>
                            </div>
                          </div>
                          <div
                            style={{
                              border: '1px solid #A0A4AF',
                              borderRadius: '10px',
                              width: '90%',
                              padding: '5px',
                              margin: '10px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '11px',
                                fontStyle: 'light',
                                color: '#283049',
                              }}
                            >
                              End Date
                            </div>
                            <div
                              style={{
                                marginLeft: '5px',
                                marginTop: '5px',
                                fontSize: '14px',
                                fontStyle: 'bold',
                                color: '#283049',
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                margin: '5px',
                              }}
                            >
                              <input
                                type="text"
                                style={{
                                  pointerEvents: 'none',
                                  width: '70%',
                                  border: 'none',
                                }}
                                value={
                                  !toDate
                                    ? 'dd-mm-yy'
                                    : moment(toDate).format('DD-MM-YYYY')
                                }
                              />
                              <SelectBottomSheet
                                name="endDate"
                                addNewSheet
                                triggerComponent={
                                  <CalendarIcon
                                    style={{ width: 20, color: '#949494' }}
                                    onClick={() => {
                                      onTriggerDrawerForCalander('endDate');
                                    }}
                                  />
                                }
                                open={drawer.endDate}
                                // value={taxValue}
                                onTrigger={onTriggerDrawerForCalander}
                                onClose={() => {
                                  setDrawer((d) => ({ ...d, endDate: false }));
                                }}
                                // maxHeight="45vh"
                              >
                                <Calender
                                  head="Select End Date"
                                  button="Select"
                                  handleDate={handleEndDate}
                                />
                              </SelectBottomSheet>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SelectBottomSheet>

                    <SelectBottomSheet
                      id="overFlowHidden"
                      open={customerDrawer}
                      onClose={() => {
                        setCustomerDrawer(false);
                        // setQuery('');
                      }}
                      addNewSheet
                      triggerComponent={
                        <>
                          <div
                            className={
                              device === 'mobile'
                                ? css.monthSelection
                                : css.dropdnDesktop
                            }
                            style={{
                              display: 'flex',
                              justifyContent: 'space-around',
                              alignItems: 'center',
                              width: 110,
                            }}
                            onClick={(event) => {
                              if (device === 'mobile') {
                                setCustomerDrawer(true);
                              } else {
                                setAnchorElFor({
                                  sort: null,
                                  date: null,
                                  customerList: event.currentTarget,
                                });
                              }
                            }}
                          >
                            <div className={css.text}>Customer</div>
                            <img
                              src={downArrowBlack}
                              alt="arrow"
                              className={css.icon}
                            />
                          </div>
                          <Mui.Popover
                            id="basic-menu-list"
                            anchorEl={anchorElFor.customerList}
                            open={Boolean(anchorElFor.customerList)}
                            onClose={() => {
                              setAnchorElFor({
                                ...anchorElFor,
                                customerList: null,
                              });
                              // setQuery('');
                            }}
                            MenuListProps={{
                              'aria-labelledby': 'basic-button',
                            }}
                            PaperProps={{
                              elevation: 3,
                              style: {
                                maxHeight: 500,
                                width: '35ch',
                                padding: '5px',
                                overflow: 'hidden',
                                borderRadius: 20,
                              },
                            }}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                          >
                            <div className={css.titleDateFilter}>
                              <span>Select Customer</span>
                              <hr className={css.DividerFilter} />

                              <div
                                className={
                                  device === 'mobile'
                                    ? css.searchFilterFull
                                    : css.searchFilterFullWeb
                                }
                                onClick={(event) =>
                                  setQuery(event.target.value)
                                }
                              >
                                <SearchIcon className={css.searchFilterIcon} />
                                <input
                                  placeholder="Search for Customer"
                                  onChange={(event) => {
                                    setQuery(event.target.value);
                                    if (event?.target?.value?.length > 2) {
                                      custListCall(event.target.value);
                                    }
                                    if (event?.target?.value?.length === 0) {
                                      custListCall();
                                    }
                                  }}
                                  value={query}
                                  className={css.searchFilterInput}
                                />
                              </div>

                              <ul
                                className={css.optionsWrapper}
                                style={{ maxHeight: '18rem', overflow: 'auto' }}
                              >
                                {customerList?.length > 0 &&
                                  customerList?.map((e) => (
                                    <li
                                      className={css.items}
                                      aria-hidden="true"
                                    >
                                      <FormControlLabel
                                        value={e?.id}
                                        style={{
                                          textTransform: 'capitalize',
                                        }}
                                        control={
                                          <Checkbox
                                            style={{
                                              color: '#F08B32',
                                              textTransform: 'capitalize',
                                            }}
                                            checked={webValue?.customerID?.includes(
                                              e?.id,
                                            )}
                                            onChange={(event) => {
                                              event?.persist();
                                              setWebValue((prev) => ({
                                                ...prev,
                                                customerID:
                                                  (webValue?.customerID?.includes(
                                                    event?.target?.value,
                                                  ) &&
                                                    webValue?.customerID?.filter(
                                                      (item) =>
                                                        item !==
                                                        event?.target?.value,
                                                    )) || [
                                                    ...webValue?.customerID,
                                                    event?.target?.value,
                                                  ],
                                              }));
                                            }}
                                          />
                                        }
                                        label={e?.short_name?.toLowerCase()}
                                      />
                                    </li>
                                  ))}
                                {customerList?.length === 0 && (
                                  <Mui.Typography align="center">
                                    {loading
                                      ? 'Data is being fetched'
                                      : 'No Data Found'}
                                  </Mui.Typography>
                                )}
                              </ul>
                              <Mui.Button
                                contained
                                className={css.ApplyFilterButton}
                                onClick={() => {
                                  setCustomerID(webValue.customerID);
                                  setAnchorElFor({
                                    ...anchorElFor,
                                    customerList: null,
                                  });
                                }}
                              >
                                Apply Filters
                              </Mui.Button>
                            </div>
                          </Mui.Popover>
                        </>
                      }
                    >
                      <div className={css.effortlessOptions}>
                        <span className={css.title}>Customer List</span>
                        <div className={css.searchFilterFull}>
                          <SearchIcon className={css.searchFilterIcon} />
                          <input
                            placeholder="Search for Customer"
                            onChange={(event) => {
                              setQuery(event.target.value);
                              if (event?.target?.value?.length > 2) {
                                custListCall(event.target.value);
                              }
                              if (event?.target?.value?.length === 0) {
                                custListCall();
                              }
                            }}
                            value={query}
                            className={css.searchFilterInputMobile}
                          />
                        </div>
                        <ul
                          className={css.optionsWrapper}
                          style={{ maxHeight: '60vh', overflow: 'auto' }}
                        >
                          {customerList?.length > 0 &&
                            customerList?.map((e) => (
                              <li className={css.items} aria-hidden="true">
                                <FormControlLabel
                                  value={e?.id}
                                  style={{ textTransform: 'capitalize' }}
                                  control={
                                    <Checkbox
                                      style={{
                                        color: '#F08B32',
                                        textTransform: 'capitalize',
                                      }}
                                      checked={customerID?.includes(e?.id)}
                                      onChange={(event) => {
                                        event.persist();
                                        handleValueChange(
                                          event?.target?.value,
                                          event?.target?.checked,
                                          e,
                                        );
                                      }}
                                    />
                                  }
                                  label={e?.short_name?.toLowerCase()}
                                />
                              </li>
                            ))}
                          {customerList?.length === 0 && (
                            <Mui.Typography align="center">
                              {loading
                                ? 'Data is being fetched'
                                : 'No Data Found'}
                            </Mui.Typography>
                          )}
                        </ul>
                      </div>
                    </SelectBottomSheet>
                  </Mui.Stack>
                  <SelectBottomSheet
                    open={drawerSort}
                    onClose={() => setDrawerSort(false)}
                    triggerComponent={
                      <>
                        <div
                          className={
                            device === 'mobile'
                              ? css.monthSelection
                              : css.dropdnDesktop
                          }
                          style={{
                            display: device === 'mobile' ? 'flex' : 'none',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                          }}
                          onClick={(event) => {
                            if (device === 'mobile') {
                              setDrawerSort(true);
                            } else {
                              setAnchorElFor({
                                sort: event.currentTarget,
                                date: null,
                                customerList: null,
                              });
                            }
                          }}
                        >
                          <div className={css.text}>Sort</div>
                          <img
                            src={downArrowBlack}
                            alt="arrow"
                            className={css.icon}
                          />
                        </div>
                        <Mui.Popover
                          id="basic-menu-sort"
                          anchorEl={anchorElFor.sort}
                          open={Boolean(anchorElFor.sort)}
                          onClose={() =>
                            setAnchorElFor({ ...anchorElFor, sort: null })
                          }
                          MenuListProps={{
                            'aria-labelledby': 'basic-button',
                          }}
                          PaperProps={{
                            elevation: 3,
                            style: {
                              maxHeight: '100%',
                              width: '35ch',
                              padding: '5px',
                              borderRadius: 20,
                            },
                          }}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                        >
                          <div className={css.effortlessOptions}>
                            <span>Sort by</span>
                            <hr className={css.forline} />
                            <ul className={css.optionsWrapper}>
                              {[
                                'Name Ascending',
                                'Name Descending',
                                'Amount Ascending',
                                'Amount Descending',
                                'Date Ascending',
                                'Date Descending',
                              ].map((e) => (
                                <li className={css.items} aria-hidden="true">
                                  <RadioGroup
                                    value={sortValue}
                                    onChange={(event) => {
                                      setSortValue(event.target.value);
                                    }}
                                  >
                                    <FormControlLabel
                                      value={e}
                                      control={
                                        <Radio style={{ color: '#F08B32' }} />
                                      }
                                      label={e}
                                    />
                                  </RadioGroup>
                                </li>
                              ))}
                            </ul>
                            <Mui.Button
                              contained
                              style={{
                                backgroundColor: '#F08B32',
                                color: '#fff',
                                margin: '20px 25%',
                                width: '50%',
                                borderRadius: 25,
                              }}
                              onClick={() => {
                                const temp = sortValue.split(' ');
                                setValue(
                                  temp[1] === 'Ascending' ? 'asc' : 'desc',
                                );
                                setOrderBy(temp[0].toLowerCase());
                                setAnchorElFor({ ...anchorElFor, sort: null });
                              }}
                            >
                              Apply Filters
                            </Mui.Button>
                          </div>
                        </Mui.Popover>
                      </>
                    }
                  >
                    <div className={css.effortlessOptions}>
                      <span className={css.title}>Sort by</span>
                      <ul className={css.optionsWrapper}>
                        {[
                          'Name Ascending',
                          'Name Descending',
                          'Amount Ascending',
                          'Amount Descending',
                          'Date Ascending',
                          'Date Descending',
                        ].map((e) => (
                          <li className={css.items} aria-hidden="true">
                            <RadioGroup
                              value={sortValue}
                              onChange={(event) => {
                                const temp = event.target.value.split(' ');
                                setSortValue(event.target.value);
                                setValue(
                                  temp[1] === 'Ascending' ? 'asc' : 'desc',
                                );
                                setOrderBy(temp[0].toLowerCase());
                              }}
                              onClick={() => setDrawerSort(false)}
                            >
                              <FormControlLabel
                                value={e}
                                control={<Radio style={{ color: '#F08B32' }} />}
                                label={e}
                              />
                            </RadioGroup>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </SelectBottomSheet>
                </div>
              </Mui.Stack>
              <div
                className={
                  device === 'desktop' ? css.rowFilter : css.rowFilterForMobile
                }
                style={{
                  display:
                    customerID?.length > 0 || (toDate && fromDate) || sortValue
                      ? // || typeValue
                        // desktop to hide
                        (device === 'desktop' && 'none') || ''
                      : 'none',
                }}
              >
                {customerID?.length > 0 &&
                  customerID?.map((val) => (
                    <div className={css.orangeList}>
                      <Chip
                        className={classes.selectedchips}
                        label={
                          selectedCustomerList?.find((item) => item.id === val)
                            ?.name
                        }
                        variant="outlined"
                        onDelete={() => {
                          setCustomerID(
                            customerID?.filter((item) => item !== val),
                          );
                          setSelectedCustomerList(
                            selectedCustomerList?.filter(
                              (item) => item?.id !== val,
                            ),
                          );
                          setWebValue((prev) => ({
                            ...prev,
                            customerID: webValue?.customerID?.filter(
                              (item) => item !== val,
                            ),
                          }));
                        }}
                      />
                    </div>
                  ))}
                {toDate && fromDate && (
                  <div className={css.orangeList}>
                    <Chip
                      className={classes.selectedchips}
                      label={`${moment(fromDate).format('MMM DD')} - ${moment(
                        toDate,
                      ).format('MMM DD, YYYY')}`}
                      variant="outlined"
                      onDelete={() => {
                        setToDate('');
                        setFromDate('');
                        setWebValue({
                          ...webValue,
                          fromDate: null,
                          toDate: null,
                        });
                      }}
                    />
                  </div>
                )}
                {sortValue && (
                  <div className={css.orangeList}>
                    <Chip
                      className={classes.selectedchips}
                      label={`${sortValue}`}
                      variant="outlined"
                      onDelete={() => {
                        setSortValue('');
                        setValue('');
                        setOrderBy('');
                      }}
                    />
                  </div>
                )}
              </div>
              {device === 'mobile' && (
                <>
                  {draftLoad === null && draftInvoice?.length === 0 && (
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
                  {draftLoad !== null && draftInvoice?.length > 0 && (
                    <div
                      style={{
                        overflow: 'auto',
                        height:
                          customerID?.length > 0 ||
                          (toDate && fromDate) ||
                          sortValue
                            ? 'calc(100vh - 320px)'
                            : 'calc(100vh - 250px)',
                      }}
                      id="draftContent"
                    >
                      <InfiniteScroll
                        dataLength={draftInvoice?.length}
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
                        {draftInvoice?.map((d) => (
                          <Mui.Stack
                            direction="row"
                            width="100%"
                            justifyContent="space-between"
                            style={{ padding: '5px 0', marginTop: 0 }}
                            className={css.box}
                            onClick={() => {
                              // openInvoice(d);
                              setActiveItem(d);
                              onTriggerDrawer('draftInvoiceDrawer');
                            }}
                          >
                            <Item
                              style={{
                                width: '100%',
                                padding: '10px 20px',
                                borderRadius: '0px',
                                // textAlignLast: 'center',
                              }}
                            >
                              <Mui.Stack
                                direction="row"
                                justifyContent="space-between"
                                className={css.contentSpace}
                              >
                                <Mui.Grid className={css.contentName}>
                                  {/* DT2022-102 */}
                                  {d?.customer_name?.toLowerCase()}
                                </Mui.Grid>
                                <Mui.Grid className={css.amount}>
                                  {customCurrency(
                                    d?.currency?.iso_code,
                                    d?.currency?.locale,
                                  ).format(d?.invoice_value)}
                                </Mui.Grid>
                              </Mui.Stack>

                              <Mui.Stack
                                direction="row"
                                justifyContent="space-between"
                                className={css.contentSpace}
                              >
                                <Mui.Grid className={css.date}>
                                  {moment(d?.created_at).format('DD-MM-YYYY')}
                                </Mui.Grid>
                                <Mui.Grid
                                  className={css.documentType}
                                  style={{
                                    background: INVOICE_TYPES.find(
                                      (val) => val.payload === d.document_type,
                                    )?.color,
                                  }}
                                >
                                  {
                                    INVOICE_TYPES.find(
                                      (val) => val.payload === d.document_type,
                                    )?.text
                                  }
                                </Mui.Grid>
                              </Mui.Stack>
                            </Item>
                          </Mui.Stack>
                        ))}
                      </InfiniteScroll>
                    </div>
                  )}
                  {draftLoad !== null &&
                    invoiceDraftData?.data?.length === 0 && (
                      <div className={css.draftInfo}>
                        <Mui.Typography align="center">
                          No Invoices found
                        </Mui.Typography>
                      </div>
                    )}
                </>
              )}
              {device === 'desktop' && draftInvoice && (
                <Mui.Box
                  sx={{
                    height: '85vh',
                    width: '100%',
                    marginTop: '0 !important',
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
                  <DataGridPremium
                    rows={draftInvoice}
                    columns={draftColumn?.map((col) => {
                      if (col.field !== 'customer_name') {
                        return col;
                      }
                      return {
                        ...col,
                        filterOperators: getGridSingleSelectOperators().filter(
                          (operator) => operator.value !== 'isAnyOf',
                        ),
                      };
                    })}
                    density="compact"
                    getRowHeight={() => 'auto'}
                    rowHeight={60}
                    disableColumnReorder
                    disableColumnPinning
                    disableRowGrouping
                    disableAggregation
                    // disableColumnSelector
                    hideFooter
                    initialState={{
                      filter: {
                        filterModel: {
                          items: [],
                          quickFilterValues: [state?.search_text],
                        },
                      },
                    }}
                    disableRowSelectionOnClick
                    components={{
                      Toolbar: CustomToolbar,
                      NoRowsOverlay: () => (
                        <Mui.Stack
                          height="100%"
                          alignItems="center"
                          justifyContent="center"
                        >
                          No Data Found
                        </Mui.Stack>
                      ),
                      LoadingOverlay: InvoiceLoadingSkeleton,
                    }}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                      },
                    }}
                    loading={draftLoad === null}
                    slotProps={{
                      columnsPanel: {
                        getTogglableColumns,
                      },
                    }}
                    sx={{
                      background: '#fff',
                      borderRadius: '16px',
                      '& .MuiDataGrid-columnHeaderTitle': {
                        whiteSpace: 'break-spaces',
                        textAlign: 'center',
                        lineHeight: '20px',
                        fontFamily: "'Lexend', sans-serif !important",
                        fontWeight: '400 !important',
                        fontSize: '13px',
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
                    }}
                  />
                </Mui.Box>
              )}
            </Mui.Stack>
          </Mui.Box>
        </Mui.Grid>
      </Mui.Grid>

      <Mui.Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          elevation: 3,
          style: {
            maxHeight: 48 * 4.5,
            width: '22ch',
            padding: '5px',
            borderRadius: 20,
          },
        }}
      >
        <Mui.MenuItem
          onClick={() => {
            setAnchorEl(null);
            openInvoice();
          }}
          classes={{ root: classes.textStyle }}
        >
          Edit this Draft
        </Mui.MenuItem>
        <hr />
        <Mui.MenuItem
          onClick={() => {
            WebDelete();
          }}
          classes={{ root: classes.textStyle }}
        >
          Delete this Draft
        </Mui.MenuItem>
      </Mui.Menu>
      <StyledDrawer
        anchor="bottom"
        variant="temporary"
        name="draftInvoiceDrawer"
        open={bottomSheet.draftInvoiceDrawer}
        onClose={() => handleBottomSheet('draftInvoiceDrawer')}
        className={css.draftInvoiceDrawer}
      >
        <div className={css.valueWrapper}>
          <span className={`${css.value}`} onClick={() => openInvoice()}>
            {(activeItem?.document_type === 'credit_note' ||
              activeItem.type === 'credit_note') &&
              'Edit this Draft Credit note'}
            {(activeItem?.document_type === 'debit_note' ||
              activeItem.type === 'debit_note') &&
              'Edit this Draft Debit note'}
            {(activeItem?.document_type === 'tax_invoice' ||
              activeItem.type === 'tax_invoice') &&
              'Edit this Draft Invoice'}
            {(activeItem?.document_type === 'test_invoice' ||
              activeItem.type === 'test_invoice') &&
              'Edit this Test Draft'}
            {(activeItem?.document_type === 'estimate' ||
              activeItem.type === 'estimate') &&
              `Edit this Draft ${capitalizeFirstLetter(estimateName)}`}
          </span>
          <hr />
          <span
            className={`${css.value} ${css.valueColor}`}
            onClick={() => {
              MobileDelete();
            }}
          >
            {(activeItem?.document_type === 'credit_note' ||
              activeItem.type === 'credit_note') &&
              'Delete this Draft Credit note'}
            {(activeItem?.document_type === 'debit_note' ||
              activeItem.type === 'debit_note') &&
              'Delete this Draft Debit note'}
            {(activeItem?.document_type === 'tax_invoice' ||
              activeItem.type === 'tax_invoice') &&
              'Delete this Draft Invoice'}
            {(activeItem?.document_type === 'test_invoice' ||
              activeItem.type === 'test_invoice') &&
              'Delete this Test Draft'}
            {(activeItem?.document_type === 'estimate' ||
              activeItem.type === 'estimate') &&
              `Delete this Draft ${capitalizeFirstLetter(estimateName)}`}
          </span>
          <hr />
        </div>
      </StyledDrawer>

      <ReceivablesPopOver
        open={bottomSheet.deletePopup}
        handleClose={() => handleBottomSheet('deletePopup')}
        position="center"
      >
        <div className={css.effortlessOptions}>
          {device === 'mobile' && (
            <>
              <h3>Delete</h3>
              <p>
                Are you sure you want to{' '}
                {(activeItem?.document_type === 'credit_note' ||
                  activeItem.type === 'credit_note') &&
                  'delete this Draft Credit note'}
                {(activeItem?.document_type === 'debit_note' ||
                  activeItem.type === 'debit_note') &&
                  'delete this Draft Debit note'}
                {(activeItem?.document_type === 'tax_invoice' ||
                  activeItem.type === 'tax_invoice') &&
                  'delete this Draft Invoice'}
                {(activeItem?.document_type === 'test_invoice' ||
                  activeItem.type === 'test_invoice') &&
                  'delete this Test Draft'}
                {(activeItem?.document_type === 'estimate' ||
                  activeItem.type === 'estimate') &&
                  `delete this Draft ${capitalizeFirstLetter(estimateName)}`}
                ?
              </p>
            </>
          )}

          {device === 'desktop' && (
            <>
              <h3>
                {(activeItem?.document_type === 'credit_note' ||
                  activeItem.type === 'credit_note') &&
                  'Delete this Draft Credit note'}
                {(activeItem?.document_type === 'debit_note' ||
                  activeItem.type === 'debit_note') &&
                  'Delete this Draft Debit note'}
                {(activeItem?.document_type === 'tax_invoice' ||
                  activeItem.type === 'tax_invoice') &&
                  'Delete this Draft Invoice'}
                {(activeItem?.document_type === 'test_invoice' ||
                  activeItem.type === 'test_invoice') &&
                  'Delete this Test Draft'}
                {(activeItem?.document_type === 'estimate' ||
                  activeItem.type === 'estimate') &&
                  `Delete this Draft ${capitalizeFirstLetter(
                    estimateName,
                  )}`}{' '}
                <hr className={css.forline} />
              </h3>
              <p>
                Are you sure you want to{' '}
                {(activeItem?.document_type === 'credit_note' ||
                  activeItem.type === 'credit_note') &&
                  'delete this Draft Credit note'}
                {(activeItem?.document_type === 'debit_note' ||
                  activeItem.type === 'debit_note') &&
                  'delete this Draft Debit note'}
                {(activeItem?.document_type === 'tax_invoice' ||
                  activeItem.type === 'tax_invoice') &&
                  'delete this Draft Invoice'}
                {(activeItem?.document_type === 'test_invoice' ||
                  activeItem.type === 'test_invoice') &&
                  'delete this Test Draft'}
                {(activeItem?.document_type === 'estimate' ||
                  activeItem.type === 'estimate') &&
                  `delete this Draft ${capitalizeFirstLetter(
                    estimateName,
                  )}`}{' '}
                <span style={{ textTransform: 'capitalize' }}>
                  {activeItem?.customer_name?.toLowerCase()}?
                </span>
              </p>
              <p>Note: Deleted from drafts cannot be retrieved back.</p>
            </>
          )}

          {/* </ul> */}
          <div
            className={css.addCustomerFooter}
            style={{ marginBottom: '10px' }}
          >
            <Button
              variant="contained"
              className={css.secondary}
              style={{
                padding: '15px 35px',
                textTransform: 'initial',
              }}
              onClick={() => {
                handleBottomSheet('deletePopup');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className={`${css.primary}`}
              style={{
                padding: '15px 35px',
                textTransform: 'initial',
              }}
              onClick={() => {
                deleteInvoice(activeItem?.id);
              }}
            >
              &nbsp; Delete &nbsp;
            </Button>
          </div>
        </div>
      </ReceivablesPopOver>

      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </div>
  );
};

export default DraftInvoiceContainer;
