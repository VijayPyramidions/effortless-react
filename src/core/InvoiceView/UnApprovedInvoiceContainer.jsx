/* eslint-disable no-lonely-if */
import React, { useState, useEffect, useContext, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { capitalizeFirstLetter } from '@components/utils';
import {
  GetInvoiceDashboardState,
  GetInvoiceUnapprovedState,
  ClearStateInvoiceUnapproved,
  PostDeclineUnApprovedInvoiceState,
  PostApproveUnApprovedInvoiceState,
  ClearStateActionInvoice,
} from '@action/Store/Reducers/Invoice/InvoiceState';
import {
  GetCustomerEntityState,
  ClearSateCustomerEntity,
} from '@action/Store/Reducers/General/GeneralState';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import moment from 'moment';
import * as Router from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import { makeStyles, Chip, CircularProgress } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import DropdownIcon from '@assets/downArrowBlack.svg';
import Checkbox from '@components/Checkbox/Checkbox.jsx';
import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid-premium';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import AppContext from '@root/AppContext.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import * as Mui from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { customCurrency } from '@components/formattedValue/FormattedValue';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import ReceivablesPopOver from '../Receivables/Components/ReceivablesPopover';
import Calender from './Calander';
import {
  InvoiceLoadingSkeleton,
  MobileInvoiceLoadingSkeleton,
} from '../../components/SkeletonLoad/SkeletonLoader';

import * as css from './CreateInvoiceContainer.scss';

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
    margin: '0 6px 0 0',
    background: '#fdf1e6',
    maxWidth: '45% !important',
    color: themes.colorPrimaryButton,
    border: `1px solid ${themes.colorPrimaryButton}`,
    borderRadius: '25px',
    marginBottom: '15px',
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

const UnApprovedInvoiceContainer = () => {
  const {
    // organization,
    user,
    setActiveInvoiceId,
    // enableLoading,
    // openSnackBar,
    loading,
    userPermissions,
    estimateName,
  } = useContext(AppContext);
  const device = localStorage.getItem('device_detect');
  const classes = useStyles();
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const dispatch = useDispatch();
  const { invoiceUnapprovedData, actionUnApprovedInvoiceData, unApprovedLoad } =
    useSelector((value) => value.Invoice);
  const { customerEntity } = useSelector((value) => value.General);

  const [activeItem, setActiveItem] = useState({});
  const [unapprovedInvoice, setUnapprovedInvoice] = useState([]);
  const [drawerSort, setDrawerSort] = React.useState(false);
  const [customerDrawer, setCustomerDrawer] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [customerList, setCustomerList] = React.useState([]);
  const [customerID, setCustomerID] = React.useState(undefined);
  const [orderOfValue, setOrderOfValue] = React.useState(false);
  const [orderBy, setOrderBy] = React.useState('');
  const [selectedCustomer, setSelectedCustomer] = React.useState([]);
  const [selectedCustomerType, setSelectedCustomerType] = React.useState([]);
  const [sortValue, setSortValue] = React.useState('');
  const [toDate, setToDate] = useState(undefined);
  const [query, setQuery] = useState('');
  const [openBottomList, setOpenBottomList] = useState(false);
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();
  const [userCustomerId, setUserCustomerId] = useState([]);
  const [fromDate, setFromDate] = useState(undefined);
  const [drawer, setDrawer] = useState({
    startDate: false,
    endDate: false,
    deletePopup: false,
  });

  const [anchorElFor, setAnchorElFor] = React.useState({
    sort: null,
    date: null,
    customerList: null,
  });
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [webValue, setWebValue] = React.useState({
    fromDate: null,
    toDate: null,
    customerID: [],
    orderBy: null,
  });
  const [valueOptionsFilter, setValueOptionsFilter] = React.useState([]);
  const [selectedCustomerList, setSelectedCustomerList] = React.useState([]);

  const InvoiceType = [
    { value: 'tax_invoice', label: 'Tax Invoice' },
    { value: 'test_invoice', label: 'Test Invoice' },
    { value: 'estimate', label: `${capitalizeFirstLetter(estimateName)}` },
    { value: 'credit_note', label: 'Credit Note' },
    { value: 'debit_note', label: 'Debit Note' },
  ];

  const [userRoles, setUserRoles] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

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
    return () => {
      dispatch(ClearStateActionInvoice());
      dispatch(ClearSateCustomerEntity());
      dispatch(ClearStateInvoiceUnapproved());
    };
  }, []);

  React.useEffect(() => {
    if (invoiceUnapprovedData?.data) {
      if (invoiceUnapprovedData?.page === 1) {
        setUnapprovedInvoice(invoiceUnapprovedData?.data);
      } else {
        setUnapprovedInvoice((prev) => [
          ...prev,
          ...invoiceUnapprovedData?.data,
        ]);
      }
      if (
        invoiceUnapprovedData?.pages > 1 &&
        invoiceUnapprovedData?.page < invoiceUnapprovedData?.pages &&
        device === 'desktop'
      ) {
        dispatch(
          GetInvoiceUnapprovedState({
            numPage: invoiceUnapprovedData?.page + 1,
          }),
        );
      }
      if (device === 'mobile') {
        sethasMoreItems(
          invoiceUnapprovedData?.page !== invoiceUnapprovedData?.pages,
        );
      }
    }
  }, [JSON.stringify(invoiceUnapprovedData)]);

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

  const handleRowSelection = (val) => {
    if (
      !userRoles?.Estimate?.view_estimate &&
      val?.document_type === 'estimate'
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
      !userRoles?.['Tax Invoice']?.view_invoices &&
      val?.document_type === 'tax_invoice'
    ) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    user.customerId = val?.customer_id;
    setActiveInvoiceId({
      activeInvoiceId: val?.id,
    });
    if (val?.id) {
      navigate(`/invoice-unapproved-pdf?id=${val?.id}`, {
        state: {
          id: val?.customer_id,
          type: 'unApproved',
          params: 5,
          documentType: val?.document_type,
          approvedAccess: userRoles,
        },
      });
    }
  };

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

  const keyPass = 5;
  const toPdf = () => {
    setActiveInvoiceId({
      activeInvoiceId: selectedCustomer,
    });
    navigate(`/invoice-unapproved-pdf?id=${selectedCustomer}`, {
      state: {
        type: 'unApproved',
        params: keyPass,
        documentType: selectedCustomerType?.[0]?.document_type,
        approvedAccess: userRoles,
      },
    });
  };

  const selectedCust = (data) => {
    if (selectedCustomer.indexOf(data.id) < 0) {
      setSelectedCustomer((previous) => [...previous, data.id]);
      setSelectedCustomerType((previous) => [...previous, data]);
    } else {
      setSelectedCustomer((previous) => [
        ...previous.filter((val) => val !== data.id),
      ]);
      const filterType = selectedCustomerType?.filter(
        (val) => val?.id !== data?.id,
      );
      setSelectedCustomerType(filterType);
    }

    if (userCustomerId.indexOf(data.id) < 0) {
      setUserCustomerId((previous) => [...previous, data.customer_id]);
    } else {
      setUserCustomerId((previous) => [
        ...previous.filter((val) => val !== data.customer_id),
      ]);
    }
  };

  const approvePdf = () => {
    const typeOfInvoice = selectedCustomerType?.map(
      (val) => val?.document_type,
    );
    if (selectedCustomer.length === 1) {
      if (
        !userRoles?.Estimate?.view_estimate &&
        typeOfInvoice?.includes('estimate')
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
        !userRoles?.['Tax Invoice']?.view_invoices &&
        typeOfInvoice?.includes('tax_invoice')
      ) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
        return;
      }
      const [id] = userCustomerId;
      user.customerId = id;
      toPdf();
    }
    if (selectedCustomer.length > 1) {
      if (
        !userRoles?.Estimate?.approve_estimate &&
        typeOfInvoice?.includes('estimate')
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
        !userRoles?.['Tax Invoice']?.approve_invoices &&
        typeOfInvoice?.includes('tax_invoice')
      ) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
        return;
      }
      dispatch(PostApproveUnApprovedInvoiceState({ selectedCustomer }));
    }
  };
  const fetchUnapprovedInvoices = (page_num) => {
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
    dispatch(GetInvoiceUnapprovedState(param));
  };

  const loadMore = () => {
    if (invoiceUnapprovedData?.pages > 1) {
      fetchUnapprovedInvoices(invoiceUnapprovedData?.page + 1);
    }
  };

  const declineInvoice = (id, reason) => {
    dispatch(PostDeclineUnApprovedInvoiceState({ invoiceId: id, reason }));
  };

  React.useEffect(() => {
    if (
      Object.keys(actionUnApprovedInvoiceData?.declineAction || {})?.length > 0
    ) {
      if (
        actionUnApprovedInvoiceData?.declineAction?.declineReason === 'edit'
      ) {
        setOpenBottomList(false);
        setTimeout(() => {
          dispatch(
            GetInvoiceDashboardState({
              durationDate: moment().format('YYYY-MM-DD'),
            }),
          );
          navigate(`/invoice-draft-new`, { state: { type: 'draft' } });
        }, 500);
      } else {
        setDrawer((prev) => ({ ...prev, deletePopup: false }));
        setOpenBottomList(false);
        setTimeout(() => {
          dispatch(GetInvoiceUnapprovedState({ numPage: 1 }));
          dispatch(
            GetInvoiceDashboardState({
              durationDate: moment().format('YYYY-MM-DD'),
            }),
          );
          dispatch(ClearStateActionInvoice());
        }, 500);
      }
    }
    if (
      Object.keys(actionUnApprovedInvoiceData?.approveAction || {})?.length > 0
    ) {
      setTimeout(() => {
        dispatch(
          GetInvoiceDashboardState({
            durationDate: moment().format('YYYY-MM-DD'),
          }),
        );
        navigate('/invoice-unapproved-success', {
          state: { type: 'unApprovedSuccess' },
        });
      }, 500);
    }
  }, [actionUnApprovedInvoiceData]);

  useEffect(() => {
    if (
      (state?.search_text && customerID?.length > 0) ||
      state?.search_text === undefined ||
      device === 'desktop'
    ) {
      fetchUnapprovedInvoices();
    }
  }, [value, customerID, orderBy, dispatch]);

  useEffect(() => {
    if (fromDate && toDate && device === 'mobile') {
      fetchUnapprovedInvoices();
    } else if (
      fromDate !== undefined &&
      toDate !== undefined &&
      device === 'mobile'
    ) {
      fetchUnapprovedInvoices();
    }
  }, [fromDate, toDate]);

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

  React.useEffect(() => {
    if (device === 'desktop') {
      const temp = Array.from(
        new Set(unapprovedInvoice?.map((invoice) => invoice?.customer_name)),
      )?.map((customerName) => ({ value: customerName, label: customerName }));
      setValueOptionsFilter(temp);
    }
  }, [device, unapprovedInvoice]);

  const unApprovedColumn = [
    {
      field: 'invoice_number',
      headerName: 'Invoice Number',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
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
              handleRowSelection(params.row);
            }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Mui.Avatar
              className={css.avatar}
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${params?.row?.customer_name}&chars=1`}
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
      valueFormatter: (params) =>
        InvoiceType.filter((c) => c.value === params?.value)[0]?.label,
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
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
      maxWidth: 120,
      sortable: false,
    },
    {
      field: 'invoice_value',
      headerName: 'Taxable Value',
      type: 'number',
      headerClassName: 'left-align--header',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
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
      maxWidth: 150,
      width: 120,
      align: 'right',
    },
    {
      field: 'created_at',
      headerName: 'Created On',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'break-spaces' }}>
              {moment(params.row?.created_at).format('DD-MM-yyyy')}
            </p>
          </div>
        );
      },
      maxWidth: 120,
    },
    {
      field: 'id',
      headerName: '',
      renderCell: (params) => {
        return (
          <>
            <Mui.IconButton
              className={css.dots}
              onClick={(event) => {
                setActiveItem(params.row);
                setAnchorEl(event.currentTarget);
              }}
            >
              <MuiIcons.MoreVert sx={{ width: '15px' }} />
            </Mui.IconButton>
          </>
        );
      },
      maxWidth: 40,
      sortable: false,
      align: 'right',
      disableExport: true,
      disableColumnMenu: true,
      filterable: false,
    },
  ];

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

  const EditInvoice = () => {
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
    setAnchorEl(null);
    setActiveInvoiceId({
      activeInvoiceId: activeItem?.id,
    });
    declineInvoice(activeItem?.id, 'edit');
  };

  const ApproveInvoice = () => {
    if (
      !userRoles?.Estimate?.view_estimate &&
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
      !userRoles?.['Tax Invoice']?.view_invoices &&
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
    setAnchorEl(null);
    setActiveInvoiceId({
      activeInvoiceId: activeItem?.id,
    });
    navigate(`/invoice-unapproved-pdf?id=${activeItem?.id}`, {
      state: {
        id: activeItem?.customer_id,
        type: 'unApproved',
        params: 5,
        documentType: activeItem?.document_type,
        approvedAccess: userRoles,
      },
    });
  };

  const CancelInvoice = () => {
    if (
      !userRoles?.Estimate?.cancel_estimate &&
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
      !userRoles?.['Tax Invoice']?.cancel_invoices &&
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
    setAnchorEl(null);
    setActiveInvoiceId({
      activeInvoiceId: activeItem?.id,
    });
    setDrawer((prev) => ({
      ...prev,
      deletePopup: true,
    }));
  };

  React.useEffect(() => {
    if (
      device === 'mobile' &&
      customerID !== undefined &&
      state?.search_text?.length > 0 &&
      customerID?.length === 0
    ) {
      setQuery('');
      custListCall();
      fetchUnapprovedInvoices();
      navigate('/invoice-unapproved', { replace: true });
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
    <div
      className={
        device === 'mobile' ? css.draftInvoiceContainer : css.unApprovedDesktop
      }
    >
      <>
        {device === 'mobile' && (
          <div className={css.unapprovedTitle}>
            <Mui.Typography
              variant="h5"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                lineHeight: '15px',
                color: '#283049',
              }}
              className={css.valueHeader}
              align="left"
            >
              Unapproved Invoices
            </Mui.Typography>
          </div>
        )}

        <Mui.Stack
          direction="row"
          style={{
            justifyContent: 'space-between',
            width: '100%',
            // desktop to hide
            display: device === 'mobile' ? '' : 'none',
          }}
        >
          <div
            className={css.mainButton}
            style={{
              paddingTop: '0.8rem',
              justifyContent:
                device === 'mobile' ? 'flex-start' : 'space-between',
              padding:
                device === 'mobile' ? '5px 0px 5px 0px' : '5px 40px 5px 20px',
            }}
          >
            <Mui.Stack direction="row" spacing={2}>
              <SelectBottomSheet
                open={orderOfValue}
                addNewSheet
                onClose={() => setOrderOfValue(false)}
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
                        src={DropdownIcon}
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
                        <span>Select the start and end date to filter</span>
                        <hr className={css.DividerFilter} />

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
                            setAnchorElFor({ ...anchorElFor, date: null });
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
                            setDrawer((d) => ({ ...d, startDate: false }));
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
                          onTrigger={onTriggerDrawerForCalander}
                          onClose={() => {
                            setDrawer((d) => ({ ...d, endDate: false }));
                          }}
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
                        src={DropdownIcon}
                        alt="arrow"
                        className={css.icon}
                      />
                    </div>
                    <Mui.Popover
                      id="basic-menu-list"
                      anchorEl={anchorElFor.customerList}
                      open={Boolean(anchorElFor.customerList)}
                      onClose={() =>
                        setAnchorElFor({
                          ...anchorElFor,
                          customerList: null,
                        })
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
                        >
                          <SearchIcon className={css.searchFilterIcon} />{' '}
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
                              <li className={css.items} aria-hidden="true">
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
                                                  item !== event?.target?.value,
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
                    <SearchIcon className={css.searchFilterIcon} />{' '}
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
                                  event?.persist();
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
                        {loading ? 'Data is being fetched' : 'No Data Found'}
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
                    <img src={DropdownIcon} alt="arrow" className={css.icon} />
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
                      <ul
                        className={css.optionsWrapper}
                        style={{ height: '20rem', overflow: 'auto' }}
                      >
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
                                control={<Radio style={{ color: '#F08B32' }} />}
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
                          setValue(temp[1] === 'Ascending' ? 'asc' : 'desc');
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
                          setValue(temp[1] === 'Ascending' ? 'asc' : 'desc');
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
          className={`${css.rowFilter} ${css.rowFilterUnApprove}`}
          style={{
            display:
              customerID?.length > 0 || (toDate && fromDate) || sortValue
                ? // desktop to hide
                  (device === 'desktop' && 'none') || ''
                : 'none',
            width: '98%',
          }}
        >
          {customerID?.length > 0 &&
            customerID?.map((val) => (
              <div className={css.orangeList}>
                <Chip
                  className={classes.selectedchips}
                  label={
                    selectedCustomerList?.find((item) => item.id === val)?.name
                  }
                  variant="outlined"
                  onDelete={() => {
                    setCustomerID(customerID?.filter((item) => item !== val));
                    setSelectedCustomerList(
                      selectedCustomerList?.filter((item) => item?.id !== val),
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
            {unApprovedLoad === null && (
              <div
                style={{
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  height: 'calc(100vh - 250px)',
                  width: '100%',
                }}
              >
                <MobileInvoiceLoadingSkeleton />
              </div>
            )}

            {unApprovedLoad !== null && unapprovedInvoice?.length > 0 && (
              <div
                style={{
                  overflow: 'auto',
                  height:
                    customerID?.length > 0 || (toDate && fromDate) || sortValue
                      ? 'calc(100vh - 320px)'
                      : 'calc(100vh - 250px)',
                  width: '100%',
                  paddingBottom: 50,
                }}
                id="draftContent"
              >
                <InfiniteScroll
                  dataLength={unapprovedInvoice?.length}
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
                  {unapprovedInvoice?.map((val, index) => (
                    <Mui.Grid
                      item
                      xs={12}
                      style={{
                        width: '100%',
                        background: index % 2 === 0 ? '#ffffff' : 'transparent',
                        padding: '10px 20px',
                      }}
                      key={val.id}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '60px',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '15%' }}>
                          <Mui.Checkbox
                            onClick={() => selectedCust(val)}
                            style={{ color: '#F08B32' }}
                          />
                        </div>
                        <div
                          className={css.mainSection}
                          onClick={() => {
                            setActiveItem(val);
                            setOpenBottomList(true);
                          }}
                        >
                          <div className={css.section1}>
                            <Mui.Typography
                              variant="body1"
                              style={{
                                margin: '0 0 10px 0',
                                fontSize: '14px',
                                fontWeight: 700,
                                textTransform: 'capitalize',
                                width: '60vw',
                              }}
                              noWrap
                            >
                              {val?.customer_name?.toLowerCase()}
                            </Mui.Typography>
                            <Mui.Typography
                              variant="body1"
                              style={{
                                margin: '0 0 10px 0',
                                fontSize: '14px',
                                fontWeight: 700,
                                display: 'flex',
                                justifyContent: 'flex-end',
                              }}
                              noWrap
                            >
                              {customCurrency(
                                val?.currency?.iso_code,
                                val?.currency?.locale,
                              ).format(val?.invoice_value)}
                            </Mui.Typography>
                          </div>
                          <div className={css.section2}>
                            <Mui.Typography
                              variant="body2"
                              style={{
                                fontSize: '12px',
                                fontWeight: 400,
                              }}
                              noWrap
                            >
                              {new Date(val?.invoice_date).toLocaleDateString()}
                            </Mui.Typography>
                            <Mui.Typography
                              variant="body2"
                              style={{
                                fontSize: '12px',
                                fontWeight: 400,
                              }}
                              noWrap
                            >
                              {val?.invoice_number}
                            </Mui.Typography>
                            <Mui.Typography
                              className={css.documentType}
                              style={{
                                background: INVOICE_TYPES.find(
                                  (typeVal) =>
                                    typeVal.payload === val.document_type,
                                )?.color,
                              }}
                            >
                              {
                                INVOICE_TYPES.find(
                                  (typeVal) =>
                                    typeVal.payload === val.document_type,
                                )?.text
                              }
                            </Mui.Typography>
                          </div>
                        </div>
                      </div>
                    </Mui.Grid>
                  ))}
                </InfiniteScroll>
              </div>
            )}
            {unApprovedLoad !== null &&
              invoiceUnapprovedData?.data?.length === 0 && (
                <div className={css.draftInfo}>
                  <Mui.Typography align="center">
                    No Invoices Found
                  </Mui.Typography>
                </div>
              )}
          </>
        )}
        {device === 'desktop' && unapprovedInvoice && (
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
              rows={unapprovedInvoice}
              columns={unApprovedColumn?.map((col) => {
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
              hideFooter
              checkboxSelection
              onRowSelectionModelChange={(ids) => {
                const selectedRowsData = ids?.map((id) =>
                  unapprovedInvoice?.find((row) => row.id === id),
                );
                setSelectedCustomer(ids);
                setSelectedCustomerType(selectedRowsData);
              }}
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
                NoResultsOverlay: () => (
                  <Mui.Stack
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                  >
                    Local filter returns no result
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
              loading={unApprovedLoad === null}
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
                  // padding: '4px 0',
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
        {unapprovedInvoice?.length > 0 && (
          <Mui.Stack
            className={
              device === 'mobile'
                ? css.approveBtnStack
                : css.approveBtnStackDesktop
            }
            mt={3}
          >
            <Mui.Button
              variant="contained"
              className={css.approveBtn}
              onClick={() => {
                if (selectedCustomer.length > 0) {
                  approvePdf();
                }
              }}
              // disabled={selectedCustomer.length === 0}
            >
              {/* <ConfirmMessageDialog open={open} /> */}
              <Mui.Typography className={css.approveBtnText}>
                {' '}
                {/* {(activeItem?.document_type === 'credit_note' ||
                activeItem.type === 'credit_note') &&
                'Approve these Credit note'}
              {(activeItem?.document_type === 'debit_note' ||
                activeItem.type === 'debit_note') &&
                'Approve these Debit note'}
              {(activeItem?.document_type === 'tax_invoice' ||
                activeItem.type === 'tax_invoice') &&
                'Approve these Invoice'}
              {(activeItem?.document_type === 'estimate' ||
                activeItem.type === 'estimate') &&
                'Approve these Estimate'} */}
                Approve
              </Mui.Typography>
            </Mui.Button>
          </Mui.Stack>
        )}
      </>

      <SelectBottomSheet
        open={device === 'mobile' && openBottomList}
        addNewSheet
        onClose={() => setOpenBottomList(false)}
        triggerComponent={<></>}
      >
        <Mui.MenuItem
          onClick={() => {
            EditInvoice();
          }}
        >
          {(activeItem?.document_type === 'credit_note' ||
            activeItem.type === 'credit_note') &&
            'Edit this Credit note'}
          {(activeItem?.document_type === 'debit_note' ||
            activeItem.type === 'debit_note') &&
            'Edit this Debit note'}
          {(activeItem?.document_type === 'tax_invoice' ||
            activeItem.type === 'tax_invoice') &&
            'Edit this Invoice'}
          {(activeItem?.document_type === 'test_invoice' ||
            activeItem.type === 'test_invoice') &&
            'Edit this Test Invoice'}
          {(activeItem?.document_type === 'estimate' ||
            activeItem.type === 'estimate') &&
            `Edit this ${capitalizeFirstLetter(estimateName)}`}
        </Mui.MenuItem>
        <hr />
        <Mui.MenuItem
          onClick={() => {
            CancelInvoice();
          }}
        >
          {(activeItem?.document_type === 'credit_note' ||
            activeItem.type === 'credit_note') &&
            'Cancel this Credit note'}
          {(activeItem?.document_type === 'debit_note' ||
            activeItem.type === 'debit_note') &&
            'Cancel this Debit note'}
          {(activeItem?.document_type === 'tax_invoice' ||
            activeItem.type === 'tax_invoice') &&
            'Cancel this Invoice'}
          {(activeItem?.document_type === 'test_invoice' ||
            activeItem.type === 'test_invoice') &&
            'Cancel this Test Invoice'}
          {(activeItem?.document_type === 'estimate' ||
            activeItem.type === 'estimate') &&
            `Cancel this ${capitalizeFirstLetter(estimateName)}`}
        </Mui.MenuItem>
      </SelectBottomSheet>

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
            ApproveInvoice();
          }}
        >
          {(activeItem?.document_type === 'credit_note' ||
            activeItem.type === 'credit_note') &&
            'Approve this Credit note'}
          {(activeItem?.document_type === 'debit_note' ||
            activeItem.type === 'debit_note') &&
            'Approve this Debit note'}
          {(activeItem?.document_type === 'tax_invoice' ||
            activeItem.type === 'tax_invoice') &&
            'Approve this Invoice'}
          {(activeItem?.document_type === 'test_invoice' ||
            activeItem.type === 'test_invoice') &&
            'Approve this Test Invoice'}
          {(activeItem?.document_type === 'estimate' ||
            activeItem.type === 'estimate') &&
            `Approve this ${capitalizeFirstLetter(estimateName)}`}
        </Mui.MenuItem>
        <Mui.MenuItem
          onClick={() => {
            EditInvoice();
          }}
        >
          {(activeItem?.document_type === 'credit_note' ||
            activeItem.type === 'credit_note') &&
            'Edit this Credit note'}
          {(activeItem?.document_type === 'debit_note' ||
            activeItem.type === 'debit_note') &&
            'Edit this Debit note'}
          {(activeItem?.document_type === 'tax_invoice' ||
            activeItem.type === 'tax_invoice') &&
            'Edit this Invoice'}
          {(activeItem?.document_type === 'test_invoice' ||
            activeItem.type === 'test_invoice') &&
            'Edit this Test Invoice'}
          {(activeItem?.document_type === 'estimate' ||
            activeItem.type === 'estimate') &&
            `Edit this ${capitalizeFirstLetter(estimateName)}`}
        </Mui.MenuItem>
        <hr />
        <Mui.MenuItem
          onClick={() => {
            CancelInvoice();
          }}
        >
          {(activeItem?.document_type === 'credit_note' ||
            activeItem.type === 'credit_note') &&
            'Cancel this Credit note'}
          {(activeItem?.document_type === 'debit_note' ||
            activeItem.type === 'debit_note') &&
            'Cancel this Debit note'}
          {(activeItem?.document_type === 'tax_invoice' ||
            activeItem.type === 'tax_invoice') &&
            'Cancel this Invoice'}
          {(activeItem?.document_type === 'test_invoice' ||
            activeItem.type === 'test_invoice') &&
            'Cancel this Test Invoice'}
          {(activeItem?.document_type === 'estimate' ||
            activeItem.type === 'estimate') &&
            `Cancel this ${capitalizeFirstLetter(estimateName)}`}
        </Mui.MenuItem>
      </Mui.Menu>

      <ReceivablesPopOver
        open={drawer.deletePopup}
        handleClose={() =>
          setDrawer((prev) => ({ ...prev, deletePopup: false }))
        }
        position="center"
      >
        <div className={css.effortlessOptions}>
          <h3>
            {(activeItem?.document_type === 'credit_note' ||
              activeItem.type === 'credit_note') &&
              'Cancel this Credit note'}
            {(activeItem?.document_type === 'debit_note' ||
              activeItem.type === 'debit_note') &&
              'Cancel this Debit note'}
            {(activeItem?.document_type === 'tax_invoice' ||
              activeItem.type === 'tax_invoice') &&
              'Cancel this Invoice'}
            {(activeItem?.document_type === 'test_invoice' ||
              activeItem.type === 'test_invoice') &&
              'Cancel this Test Invoice'}
            {(activeItem?.document_type === 'estimate' ||
              activeItem.type === 'estimate') &&
              `Cancel this ${capitalizeFirstLetter(estimateName)}`}
          </h3>
          <p>
            Are you sure you want to{' '}
            {(activeItem?.document_type === 'credit_note' ||
              activeItem.type === 'credit_note') &&
              'Cancel this Credit note'}
            {(activeItem?.document_type === 'debit_note' ||
              activeItem.type === 'debit_note') &&
              'Cancel this Debit note'}
            {(activeItem?.document_type === 'tax_invoice' ||
              activeItem.type === 'tax_invoice') &&
              'Cancel this Invoice'}
            {(activeItem?.document_type === 'test_invoice' ||
              activeItem.type === 'test_invoice') &&
              'Cancel this Test Invoice'}
            {(activeItem?.document_type === 'estimate' ||
              activeItem.type === 'estimate') &&
              `Cancel this ${capitalizeFirstLetter(estimateName)}`}
            ?
          </p>
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
              onClick={() =>
                setDrawer((prev) => ({ ...prev, deletePopup: false }))
              }
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className={`${css.primary}`}
              style={{
                padding: '15px 35px',
                textTransform: 'initial',
                width: 'auto',
              }}
              onClick={() => {
                declineInvoice(activeItem?.id);
              }}
            >
              &nbsp; OK &nbsp;
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

export default memo(UnApprovedInvoiceContainer);
