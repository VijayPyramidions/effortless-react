import React, { useState, useEffect, useContext, memo } from 'react';
import moment from 'moment';
import { capitalizeFirstLetter } from '@components/utils';
import { useSelector, useDispatch } from 'react-redux';
import {
  GetInvoiceDashboardState,
  GetInvoiceApprovedState,
  ClearStateInvoiceApproved,
  GetInvoiceSalesPersonState,
  PostCancelApprovedInvoiceState,
  ClearStateActionInvoice,
  SetStateInvoiceSettings,
} from '@action/Store/Reducers/Invoice/InvoiceState';
import {
  GetCustomerEntityState,
  ClearSateCustomerEntity,
} from '@action/Store/Reducers/General/GeneralState';
import axiosInst, { BASE_URL } from '@action/ApiConfig/AxiosInst';
import PageTitle from '@core/DashboardView/PageTitle';
import * as cssDash from '@core/DashboardView/DashboardViewContainer.scss';
import Checkbox from '@components/Checkbox/Checkbox.jsx';
import SearchIcon from '@material-ui/icons/Search';
import * as Mui from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import { makeStyles, Chip, CircularProgress } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import { styled } from '@mui/material/styles';
import downArrowBlack from '@assets/downArrowBlack.svg';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid-premium';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';
import Paper from '@mui/material/Paper';
import Button from '@material-ui/core/Button';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { customCurrency } from '@components/formattedValue/FormattedValue';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AppContext from '@root/AppContext.jsx';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import * as Router from 'react-router-dom';
import SalesPersonList from './Components/SalesPersonList';
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
    maxWidth: '190px',
    margin: '0 6px 0 0',
    background: '#fdf1e6',
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

const UndispatchedInvoiceContainer = () => {
  const device = localStorage.getItem('device_detect');
  const {
    organization,
    user,
    setActiveInvoiceId,
    loading,
    userPermissions,
    estimateName,
  } = useContext(AppContext);
  const classes = useStyles();
  const Puller = styled(Mui.Box)(() => ({
    width: '50px',
    height: 6,
    backgroundColor: '#C4C4C4',
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
  }));
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const dispatch = useDispatch();
  const {
    createInvoiceState,
    invoiceApprovedData,
    approvedLoad,
    actionApprovedInvoiceData,
    invoiceSettingsData,
  } = useSelector((value) => value.Invoice);
  const { customerEntity } = useSelector((value) => value.General);

  const [draftInvoice, setDraftInvoice] = useState([]);

  const [activeItem, setActiveItem] = useState({});
  const [drawerSort, setDrawerSort] = React.useState(false);
  const [customerDrawer, setCustomerDrawer] = React.useState(false);
  const [typeDrawer, setTypeDrawer] = React.useState(false);
  const [statusDrawer, setStatusDrawer] = React.useState(false);
  const [salesPersonDrawer, setSalesPersonDarwer] = React.useState(false);
  const [salesPersonList, setSalesPersonList] = React.useState([]);
  const [SalesPerson, setSalesPerson] = React.useState({
    id: '',
    selected: {},
  });

  const [value, setValue] = React.useState('');
  const [customerList, setCustomerList] = React.useState([]);
  const [customerID, setCustomerID] = React.useState(undefined);
  const [orderOfValue, setOrderOfValue] = React.useState(false);
  const [orderBy, setOrderBy] = React.useState('');
  const [sortValue, setSortValue] = React.useState('');
  const [statusValue, setStatusValue] = React.useState('');
  const [typeValue, setTypeValue] = React.useState('');
  const [toDate, setToDate] = useState(undefined);
  const [query, setQuery] = useState('');
  const [fromDate, setFromDate] = useState(undefined);
  const [drawer, setDrawer] = useState({
    startDate: false,
    endDate: false,
    deletePopup: false,
  });
  const [anchorElFor, setAnchorElFor] = React.useState({
    sort: null,
    date: null,
    status: null,
    type: null,
    customerList: null,
    downlaod: null,
  });

  const INVOICE_TYPES = [
    {
      text: 'Tax Invoice',
      payload: 'tax_invoice',
      color: '#A5D399',
    },
    {
      text: 'Test Invoice',
      payload: 'test_invoice',
      color: '#A5D399',
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

  const [webValue, setWebValue] = React.useState({
    fromDate: null,
    toDate: null,
    customerID: [],
    orderBy: null,
  });
  const { state } = Router.useLocation();
  const navigate = Router.useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };
  const [downlaodPDF, setDownloadPDF] = React.useState({
    month: new Date(),
    year: new Date(),
  });
  const [valueOptionsFilter, setValueOptionsFilter] = React.useState([]);
  const [valueOptionsSalesPerson, setValueOptionsSalesPerson] = React.useState(
    [],
  );
  const [selectedCustomerList, setSelectedCustomerList] = React.useState([]);

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
      dispatch(ClearSateCustomerEntity());
      dispatch(ClearStateInvoiceApproved());
    };
  }, []);

  React.useEffect(() => {
    if (invoiceApprovedData?.data) {
      if (invoiceApprovedData?.page === 1) {
        setDraftInvoice(invoiceApprovedData?.data);
      } else {
        setDraftInvoice((prev) => [...prev, ...invoiceApprovedData?.data]);
      }
      if (
        invoiceApprovedData?.pages > 1 &&
        invoiceApprovedData?.page < invoiceApprovedData?.pages &&
        device === 'desktop'
      ) {
        dispatch(
          GetInvoiceApprovedState({ numPage: invoiceApprovedData?.page + 1 }),
        );
      }
      if (device === 'mobile') {
        sethasMoreItems(
          invoiceApprovedData?.page !== invoiceApprovedData?.pages,
        );
      }
    }
  }, [JSON.stringify(invoiceApprovedData)]);

  React.useEffect(() => {
    setSalesPersonList(createInvoiceState?.salesPersonList?.data);
    setValueOptionsSalesPerson(
      createInvoiceState?.salesPersonList?.data?.map((val) => ({
        value: val?.name,
        label: val?.name,
      })),
    );
  }, [createInvoiceState?.salesPersonList]);

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

  const fetchInvoice = (page_num, id_s_1, id_s_2) => {
    let filter = '';
    if (customerID && customerID.length === 1) {
      filter += `customer_id=${customerID || ''}`;
    }
    if (customerID && customerID.length > 1) {
      customerID.forEach((v) => {
        filter += `customer_ids[]=${v}&`;
      });
    }
    if (id_s_1 && !id_s_2) {
      filter += `customer_id=${id_s_1 || ''}`;
    }
    if (SalesPerson?.id) {
      filter += `&sales_person_id=${SalesPerson?.id}`;
    }

    const param = {
      filterCustomer: filter,
      order: value,
      orderBy,
      fromDate: fromDate && toDate ? moment(fromDate).format('YYYY-MM-DD') : '',
      toDate: fromDate && toDate ? moment(toDate).format('YYYY-MM-DD') : '',
      typeFilter: typeValue,
      statusFilter: statusValue?.value || '',
      numPage: page_num || 1,
    };
    if (id_s_1 && id_s_2) {
      param.fromDate = id_s_1;
      param.toDate = id_s_2;
    }
    dispatch(GetInvoiceApprovedState(param));
  };

  const loadMore = () => {
    if (invoiceApprovedData?.pages > 1) {
      fetchInvoice(invoiceApprovedData?.page + 1);
    }
  };

  const cancelInvoice = (id) => {
    let confirmTxt;
    if (activeItem?.document_type === 'credit_note') {
      confirmTxt = 'Credit note Cancelled Successfully';
    } else if (activeItem?.document_type === 'debit_note') {
      confirmTxt = 'Debit note Cancelled Successfully';
    } else if (activeItem?.document_type === 'tax_invoice') {
      confirmTxt = 'Invoice Cancelled Successfully';
    } else if (activeItem?.document_type === 'test_invoice') {
      confirmTxt = 'Test Invoice Cancelled Successfully';
    } else if (activeItem?.document_type === 'estimate') {
      confirmTxt = `${capitalizeFirstLetter(
        estimateName,
      )} Cancelled Successfully`;
    }
    setDrawer((prev) => ({ ...prev, deletePopup: false }));
    dispatch(
      PostCancelApprovedInvoiceState({
        invoiceId: id,
        documentType: confirmTxt,
      }),
    );

    setDrawer((prev) => ({ ...prev, deletePopup: false }));
  };

  React.useEffect(() => {
    if (
      Object.keys(actionApprovedInvoiceData?.cancelAction || {})?.length > 0
    ) {
      dispatch(GetInvoiceApprovedState({ numPage: 1 }));
      dispatch(
        GetInvoiceDashboardState({
          durationDate: moment().format('YYYY-MM-DD'),
        }),
      );
      dispatch(ClearStateActionInvoice());
    }
  }, [actionApprovedInvoiceData?.cancelAction]);

  const onDownloadPdf = () => {
    dispatch(enableLoading(true));
    fetch(
      `${BASE_URL}/organizations/${
        organization.orgId
      }/gstr1_reports?month=${downlaodPDF.month.toLocaleString('default', {
        month: 'short',
      })}&year=${moment(downlaodPDF.year).format('yyyy')}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((response) => {
      if (response.status === 200) {
        response.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'GSTR';
          document.body.appendChild(a);
          a.click();
          a.remove();
          dispatch(enableLoading(false));
        });
      } else {
        response.json().then((data) => {
          dispatch(
            openSnackbar({
              message: data?.message || 'Sorry Something went wrong',
              type: MESSAGE_TYPE.ERROR,
            }),
          );
          dispatch(enableLoading(false));
        });
      }
    });
  };

  useEffect(() => {
    if (state?.people?.id) {
      fetchInvoice(1, state?.people?.id);
    } else if (state?.from === 'dashboard') {
      fetchInvoice(1, state?.fromDate, state?.endDate);
    } else if (
      (state?.search_text && customerID?.length > 0) ||
      state?.search_text === undefined ||
      device === 'desktop'
    ) {
      fetchInvoice();
    }
  }, [
    value,
    orderBy,
    customerID,
    statusValue?.value,
    typeValue,
    state,
    SalesPerson?.id,
  ]);

  useEffect(() => {
    if (fromDate && toDate && device === 'mobile') {
      fetchInvoice();
    } else if (
      fromDate !== undefined &&
      toDate !== undefined &&
      device === 'mobile'
    ) {
      fetchInvoice();
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
      fromDate: e,
      toDate: webValue.toDate,
    }));
  };

  const onDateChangeto = (e) => {
    setWebValue((prev) => ({
      ...prev,
      fromDate: webValue.fromDate,
      toDate: e,
    }));
  };

  const onMonthChange = (e) => {
    setDownloadPDF({ month: e.toDate(), year: e.toDate() });
  };

  const onYearChange = (e) => {
    setDownloadPDF({
      month: downlaodPDF.month,
      year: e.format('yyyy'),
    });
  };

  const getInvoiceSettingsAccess = () => {
    // dispatch(enableLoading(true));
    axiosInst
      .get(`organizations/${organization?.orgId}/settings`)
      .then((res) => {
        if (res && !res.data.error) {
          dispatch(SetStateInvoiceSettings(res?.data));
        }

        if (res.data.error)
          dispatch(
            openSnackbar({
              message: res.data.message || 'Something went wrong',
              type: MESSAGE_TYPE.ERROR,
            }),
          );

        // dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message || 'Error',
            type: MESSAGE_TYPE.ERROR,
          }),
        );
        // dispatch(enableLoading(false));
      });
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
  const InvoiceType = [
    { value: 'tax_invoice', label: 'Tax Invoice' },
    { value: 'test_invoice', label: 'Test Invoice' },
    { value: 'estimate', label: `${capitalizeFirstLetter(estimateName)}` },
    { value: 'credit_note', label: 'Credit Note' },
    { value: 'debit_note', label: 'Debit Note' },
  ];

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
      navigate(`/invoice-approved-pdf?id=${val?.id}`, {
        state: {
          id: val?.customer_id,
          type: 'approved',
          name: val?.customer_name,
          documentType: val?.document_type,
          startDateDef: val?.date,
          approvedAccess: userRoles,
        },
      });
    }
  };

  const WebCancel = () => {
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
    if (device === 'desktop') {
      const temp = Array.from(
        new Set(draftInvoice?.map((invoice) => invoice?.customer_name)),
      )?.map((customerName) => ({ value: customerName, label: customerName }));
      setValueOptionsFilter(temp);
    }
  }, [device, draftInvoice]);

  const approvedColumn = [
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
      maxWidth: 110,
      width: 100,
      sortable: false,
    },
    {
      field: 'customer_name',
      headerName: 'Customer',
      // filterable: false,
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
      // maxWidth: 360,
      minWidth: 200,
      // width: 340,
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
              // setEditSingle(params.row);
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
      minWidth: 150,
      sortable: false,
    },
    {
      field: 'date',
      headerName: 'Invoice Date',
      type: 'date',
      valueGetter: (params) => moment(params.value).toDate(),
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'break-spaces' }}>
              {moment(params.row?.date).format('DD-MM-YYYY')}
            </p>
          </div>
        );
      },
      maxWidth: 100,
    },
    {
      field: 'e_invoice_status',
      headerName: 'IRN Status',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'break-spaces' }}>
              {params.row?.e_invoice_status}
            </p>
          </div>
        );
      },
    },
    {
      field: 'invoice_value',
      headerName: 'Taxable Value',
      type: 'number',
      headerClassName: 'left-align--header',
      // valueFormatter: (params) => Number(params.row?.invoice_value)?.('en-IN'),
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
      maxWidth: 120,
      width: 100,
      align: 'right',
    },
    {
      field: 'generator_name',
      headerName: 'Created By',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'break-spaces' }}>
              {params.row?.generator_name}
            </p>
          </div>
        );
      },
      maxWidth: 120,
      width: 100,
      sortable: false,
    },
    {
      field: 'sales_person_id',
      headerName: 'Sales Person',
      // filterable: false,
      valueGetter: (params) =>
        salesPersonList?.filter((c) => c.id === params.value)[0]?.name,
      valueFormatter: (params) =>
        salesPersonList?.filter((c) => c.id === params.value)[0]?.name,
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'break-spaces' }}>
              {/* {params.row?.sales_person_id &&
                salesPersonList?.filter((c) => c.id === params.value)[0]?.name} */}
              {params.value}
            </p>
          </div>
        );
      },
      maxWidth: 120,
      width: 100,
      type: 'singleSelect',
      sortable: false,
      valueOptions: valueOptionsSalesPerson,
    },
    {
      field: 'approved_date',
      headerName: 'Approved On',
      type: 'date',
      valueGetter: (params) => moment(params.value).toDate(),
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'break-spaces' }}>
              {moment(params.row?.approved_date).format('DD-MM-yyyy')}
            </p>
          </div>
        );
      },
      maxWidth: 100,
    },
    {
      field: 'approver_name',
      headerName: 'Approved By',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'break-spaces' }}>
              {params.row?.approver_name}
            </p>
          </div>
        );
      },
      maxWidth: 120,
      width: 100,
      sortable: false,
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
                // onTriggerDrawer('draftInvoiceDrawer');
              }}
            >
              <MuiIcons.MoreVert sx={{ width: '15px' }} />
            </Mui.IconButton>
          </>
        );
      },
      maxWidth: 20,
      sortable: false,
      align: 'right',
      disableExport: true,
      disableColumnMenu: true,
      filterable: false,
    },
  ];

  const datagridColumn = () => {
    if (
      !invoiceSettingsData?.sales_person_invoicing &&
      invoiceApprovedData?.e_invoice_enabled
    ) {
      return approvedColumn?.filter((val) => val?.field !== 'sales_person_id');
    }
    if (
      invoiceSettingsData?.sales_person_invoicing &&
      !invoiceApprovedData?.e_invoice_enabled
    ) {
      return approvedColumn?.filter((val) => val?.field !== 'e_invoice_status');
    }
    if (
      !invoiceSettingsData?.sales_person_invoicing &&
      !invoiceApprovedData?.e_invoice_enabled
    ) {
      return approvedColumn?.filter(
        (val) =>
          val?.field !== 'e_invoice_status' && val?.field !== 'sales_person_id',
      );
    }
    return approvedColumn;
  };

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
    getInvoiceSettingsAccess();
    dispatch(GetInvoiceSalesPersonState({}));
  }, []);

  React.useEffect(() => {
    if (
      device === 'mobile' &&
      customerID !== undefined &&
      state?.search_text?.length > 0 &&
      customerID?.length === 0
    ) {
      setQuery('');
      custListCall();
      fetchInvoice();
      navigate('/invoice-approved', { replace: true });
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

  const updateSalesPersonSort = (id_s) => {
    const temp = salesPersonList?.find(
      (val) => val?.id === id_s?.sales_person_id,
    );
    setSalesPerson({ selected: temp, id: id_s?.sales_person_id });
  };

  return (
    <>
      <PageTitle
        title="Approved"
        onClick={() => {
          if (state?.people) {
            navigate('/people', { state: { choose: 'tab1' } });
          } else {
            navigate(-1);
          }
        }}
      />
      <div
        className={
          device === 'mobile'
            ? cssDash.dashboardBodyContainerhideNavBar
            : cssDash.dashboardBodyContainerDesktop
        }
      >
        <div className={css.draftInvoiceContainer} style={{ height: '100%' }}>
          <Mui.Grid
            container
            className={
              device === 'mobile' ? css.container : css.containerDesktop
            }
          >
            <Mui.Grid item xs={12} lg={12} md={12}>
              <Mui.Box sx={{ width: '100%', height: '100%' }}>
                <Mui.Stack
                  spacing={1}
                  style={{
                    height: '100%',
                    background: 'unset',
                  }}
                >
                  {device === 'mobile' && (
                    <Mui.Stack
                      direction="row"
                      justifyContent="space-between"
                      className={css.stackRaised1}
                    >
                      <Mui.Stack direction="column" className={css.stack2}>
                        <p className={css.headingRaised}>Approved</p>
                      </Mui.Stack>
                    </Mui.Stack>
                  )}

                  <Mui.Stack
                    direction="row"
                    style={{ justifyContent: 'space-between', marginTop: 0 }}
                  >
                    <div
                      className={css.mainButton}
                      style={{
                        justifyContent:
                          device === 'mobile' ? 'flex-start' : 'end',
                        padding:
                          device === 'mobile' ? '16px 0' : '5px 40px 5px 20px',
                      }}
                    >
                      <Mui.Stack
                        direction="row"
                        spacing={2}
                        style={{
                          width: '100%',
                          overflow: 'overlay',
                          padding: '0 8px',
                          // desktop to hide
                          display: device === 'mobile' ? '' : 'none',
                        }}
                      >
                        <SelectBottomSheet
                          open={orderOfValue}
                          addNewSheet
                          onClose={() => setOrderOfValue(false)}
                          triggerComponent={
                            <>
                              <div
                                className={
                                  device === 'mobile'
                                    ? css.monthSelectionRaised
                                    : css.dropdnDesktop
                                }
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
                                <div className={css.textRaised}>Date</div>
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
                                              : moment(
                                                  webValue.fromDate,
                                                ).format('DD MMM YYYY')
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
                                              : moment(webValue.toDate).format(
                                                  'DD MMM YYYY',
                                                )
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
                                        ? 'dd-mm-yyyy'
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
                                          onTriggerDrawer('startDate');
                                        }}
                                      />
                                    }
                                    open={drawer.startDate}
                                    onTrigger={onTriggerDrawer}
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
                                        ? 'dd-mm-yyyy'
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
                                          onTriggerDrawer('endDate');
                                        }}
                                      />
                                    }
                                    open={drawer.endDate}
                                    onTrigger={onTriggerDrawer}
                                    onClose={() => {
                                      setDrawer((d) => ({
                                        ...d,
                                        endDate: false,
                                      }));
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
                                    ? css.monthSelectionRaised
                                    : css.dropdnDesktop
                                }
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
                                <div className={css.textRaised}>Customer</div>
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
                                  >
                                    <SearchIcon
                                      className={css.searchFilterIcon}
                                    />{' '}
                                    <input
                                      placeholder="Search for Customer"
                                      onChange={(event) => {
                                        setQuery(event.target.value);
                                        if (event?.target?.value?.length > 2) {
                                          custListCall(event.target.value);
                                        }
                                        if (
                                          event?.target?.value?.length === 0
                                        ) {
                                          custListCall();
                                        }
                                      }}
                                      value={query}
                                      className={css.searchFilterInput}
                                    />
                                  </div>

                                  <ul
                                    className={css.optionsWrapper}
                                    style={{
                                      maxHeight: '18rem',
                                      overflow: 'auto',
                                    }}
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
                                                  event.persist();
                                                  setWebValue((prev) => ({
                                                    ...prev,
                                                    customerID:
                                                      (webValue?.customerID?.includes(
                                                        event?.target?.value,
                                                      ) &&
                                                        webValue?.customerID?.filter(
                                                          (item) =>
                                                            item !==
                                                            event?.target
                                                              ?.value,
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
                                      style={{ textTransform: 'capitalize' }}
                                      value={e?.id}
                                      control={
                                        <Checkbox
                                          style={{ color: '#F08B32' }}
                                          checked={customerID?.includes(e?.id)}
                                          onChange={(event) => {
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
                        <>
                          <div
                            className={
                              device === 'mobile'
                                ? css.monthSelectionRaised
                                : css.dropdnDesktopIR
                            }
                            onClick={(event) => {
                              if (device === 'mobile') {
                                setTypeDrawer(true);
                              } else {
                                setAnchorElFor({
                                  sort: null,
                                  date: null,
                                  type: event.currentTarget,
                                });
                              }
                            }}
                          >
                            <div className={css.textRaised}>Type</div>
                            <img
                              src={downArrowBlack}
                              alt="arrow"
                              className={css.icon}
                            />
                          </div>
                          <Mui.Popover
                            id="basic-menu-list"
                            anchorEl={anchorElFor.type}
                            open={Boolean(anchorElFor.type)}
                            onClose={() =>
                              setAnchorElFor({ ...anchorElFor, type: null })
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
                            <Mui.Stack className={css.drawer}>
                              <p className={css.heading}>Document Type</p>
                              {InvoiceType.map((c) => {
                                return (
                                  <>
                                    <Mui.Typography
                                      className={css.text}
                                      onClick={() => {
                                        setTypeDrawer(false);
                                        setTypeValue(c?.value);
                                        setAnchorElFor({
                                          ...anchorElFor,
                                          type: null,
                                        });
                                      }}
                                    >
                                      {c?.label}
                                    </Mui.Typography>
                                    <Mui.Divider />
                                  </>
                                );
                              })}
                            </Mui.Stack>
                          </Mui.Popover>
                        </>

                        <SelectBottomSheet
                          open={typeDrawer}
                          addNewSheet
                          onClose={() => {
                            setTypeDrawer(false);
                          }}
                          triggerComponent={<div style={{ display: 'none' }} />}
                        >
                          <Mui.Stack className={css.drawer}>
                            <Puller />
                            <p className={css.heading}>Document Type</p>
                            {InvoiceType.map((c) => {
                              return (
                                <>
                                  <Mui.Typography
                                    className={css.text}
                                    onClick={() => {
                                      setTypeDrawer(false);
                                      setTypeValue(c?.value);
                                    }}
                                  >
                                    {c?.label}
                                  </Mui.Typography>
                                  <Mui.Divider />
                                </>
                              );
                            })}
                          </Mui.Stack>
                        </SelectBottomSheet>

                        <>
                          <div
                            className={
                              device === 'mobile'
                                ? css.monthSelectionRaised
                                : css.dropdnDesktopIR
                            }
                            onClick={(event) => {
                              if (device === 'mobile') {
                                setStatusDrawer(true);
                              } else {
                                setAnchorElFor({
                                  sort: null,
                                  date: null,
                                  type: null,
                                  status: event?.target,
                                });
                              }
                            }}
                          >
                            <div className={css.textRaised}>Status</div>
                            <img
                              src={downArrowBlack}
                              alt="arrow"
                              className={css.icon}
                            />
                          </div>
                          <Mui.Popover
                            id="basic-menu-list"
                            anchorEl={anchorElFor.status}
                            open={Boolean(anchorElFor.status)}
                            onClose={() =>
                              setAnchorElFor({ ...anchorElFor, status: null })
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
                            <Mui.Stack className={css.drawer}>
                              <p className={css.heading}>Invoice Status</p>
                              {[
                                { label: 'Approved', value: 'approved' },
                                { label: 'Cancelled', value: 'cancelled' },
                              ].map((c) => {
                                return (
                                  <>
                                    <Mui.Typography
                                      className={css.text}
                                      onClick={() => {
                                        setStatusDrawer(false);
                                        setStatusValue(c);
                                        setAnchorElFor({
                                          ...anchorElFor,
                                          status: null,
                                        });
                                      }}
                                    >
                                      {c?.label}
                                    </Mui.Typography>
                                    <Mui.Divider />
                                  </>
                                );
                              })}
                            </Mui.Stack>
                          </Mui.Popover>
                        </>

                        {invoiceSettingsData?.sales_person_invoicing && (
                          <>
                            <div
                              className={
                                device === 'mobile'
                                  ? css.monthSelectionRaised
                                  : css.dropdnDesktopIR
                              }
                              onClick={() => {
                                if (device === 'mobile') {
                                  setSalesPersonDarwer(true);
                                }
                              }}
                            >
                              <div className={css.textRaised}>Salesperson</div>
                              <img
                                src={downArrowBlack}
                                alt="arrow"
                                className={css.icon}
                              />
                            </div>
                          </>
                        )}

                        <SelectBottomSheet
                          open={salesPersonDrawer}
                          addNewSheet
                          onClose={() => {
                            setSalesPersonDarwer(false);
                          }}
                          triggerComponent={<></>}
                        >
                          <>
                            <Puller />
                            <SalesPersonList
                              ParamSalesPersonList={salesPersonList}
                              listFunction={(val) =>
                                dispatch(
                                  GetInvoiceSalesPersonState({
                                    searchText: val,
                                  }),
                                )
                              }
                              onclose={() => setSalesPersonDarwer(false)}
                              callFunction={updateSalesPersonSort}
                              ParamSelectedSalesPerson={SalesPerson?.id}
                              title="Filter By Salesperson"
                            />
                          </>
                        </SelectBottomSheet>

                        <SelectBottomSheet
                          open={statusDrawer}
                          addNewSheet
                          onClose={() => {
                            setStatusDrawer(false);
                          }}
                          triggerComponent={<div style={{ display: 'none' }} />}
                        >
                          <Mui.Stack className={css.drawer}>
                            <Puller />
                            <p className={css.heading}>Invoice Status</p>
                            {[
                              { label: 'Approved', value: 'approved' },
                              { label: 'Cancelled', value: 'cancelled' },
                            ].map((c) => {
                              return (
                                <>
                                  <Mui.Typography
                                    className={css.text}
                                    onClick={() => {
                                      setStatusDrawer(false);
                                      setStatusValue(c);
                                    }}
                                  >
                                    {c?.label}
                                  </Mui.Typography>
                                  <Mui.Divider />
                                </>
                              );
                            })}
                          </Mui.Stack>
                        </SelectBottomSheet>
                      </Mui.Stack>
                      <Mui.Stack
                        className={css.ForWebDownload}
                        style={{
                          width: device === 'desktop' ? 'auto' : '91px',
                        }}
                      >
                        {device === 'desktop' && (
                          <>
                            <Mui.Button
                              className={css.viewSampleBtn}
                              onClick={(event) => {
                                setAnchorElFor({
                                  sort: null,
                                  download: event.currentTarget,
                                  date: null,
                                  customerList: null,
                                });
                              }}
                              disableElevation
                              disableTouchRipple
                              disableFocusRipple
                            >
                              Download GSTR1 Report
                            </Mui.Button>
                            <Mui.Popover
                              id="basic-menu-list"
                              anchorEl={anchorElFor.download}
                              open={Boolean(anchorElFor.download)}
                              onClose={() =>
                                setAnchorElFor({
                                  ...anchorElFor,
                                  download: null,
                                })
                              }
                              MenuListProps={{
                                'aria-labelledby': 'basic-button',
                              }}
                              PaperProps={{
                                elevation: 3,
                                style: {
                                  maxHeight: 500,
                                  width: '280px',
                                  marginTop: '8px',
                                  borderRadius: '12px',
                                },
                              }}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                              }}
                            >
                              <div className={css.effortlessOptions}>
                                <span className={css.titleUnderLine}>
                                  Download GSTR1 Reports
                                </span>
                                {/* <hr className={css.forline} /> */}

                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-around',
                                    marginBottom: '20px',
                                  }}
                                >
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
                                      Select Month
                                    </div>

                                    <div
                                      style={{
                                        fontSize: '14px',
                                        fontStyle: 'bold',
                                        color: '#283049',
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        height: '30px',
                                      }}
                                    >
                                      <input
                                        type="text"
                                        value={downlaodPDF.month.toLocaleString(
                                          'default',
                                          { month: 'short' },
                                        )}
                                        style={{
                                          width: '100%',
                                          border: 'none',
                                          padding: 5,
                                          pointerEvents: 'none',
                                        }}
                                      />
                                      <OnlyDatePicker
                                        selectedDate={
                                          new Date(
                                            moment(downlaodPDF.year).format(
                                              'YYYY',
                                            ),
                                            new Date(
                                              downlaodPDF.month,
                                            ).getMonth(),
                                            new Date().getDate(),
                                          )
                                        }
                                        onChange={onMonthChange}
                                        id="month"
                                      />
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      border: '1px solid #A0A4AF',
                                      borderRadius: '10px',
                                      width: '90%',
                                      padding: '5px',
                                      margin: '0 10px',
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: '11px',
                                        fontStyle: 'light',
                                        color: '#283049',
                                      }}
                                    >
                                      Select Year
                                    </div>

                                    <div
                                      style={{
                                        fontSize: '14px',
                                        fontStyle: 'bold',
                                        color: '#283049',
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        height: '30px',
                                      }}
                                    >
                                      <input
                                        type="text"
                                        style={{
                                          width: '100%',
                                          border: 'none',
                                          padding: 5,
                                          pointerEvents: 'none',
                                        }}
                                        value={moment(downlaodPDF.year).format(
                                          'YYYY',
                                        )}
                                      />
                                      <OnlyDatePicker
                                        selectedDate={downlaodPDF.year}
                                        onChange={onYearChange}
                                        id="year"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <Mui.Button
                                  contained
                                  style={{
                                    backgroundColor: '#F08B32',
                                    color: '#fff',
                                    margin: '0px 25% 10px',
                                    width: '50%',
                                    borderRadius: 25,
                                  }}
                                  disableElevation
                                  disableTouchRipple
                                  disableFocusRipple
                                  onClick={() => {
                                    onDownloadPdf();
                                    setAnchorElFor({
                                      ...anchorElFor,
                                      download: null,
                                    });
                                  }}
                                >
                                  Download
                                </Mui.Button>
                              </div>
                            </Mui.Popover>
                          </>
                        )}
                        <SelectBottomSheet
                          open={drawerSort}
                          onClose={() => setDrawerSort(false)}
                          triggerComponent={
                            <>
                              <div
                                className={
                                  device === 'mobile'
                                    ? css.monthSelectionRaised
                                    : css.dropdnDesktop
                                }
                                style={{
                                  display:
                                    device === 'mobile' ? 'flex' : 'none',
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
                                <div className={css.textRaised}>Sort</div>
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
                                  <ul
                                    className={css.optionsWrapper}
                                    style={{
                                      height: '20rem',
                                      overflow: 'auto',
                                    }}
                                  >
                                    {[
                                      'Name Ascending',
                                      'Name Descending',
                                      'Amount Ascending',
                                      'Amount Descending',
                                      'Date Ascending',
                                      'Date Descending',
                                    ].map((e) => (
                                      <li
                                        className={css.items}
                                        aria-hidden="true"
                                      >
                                        <RadioGroup
                                          value={sortValue}
                                          onChange={(event) => {
                                            setSortValue(event.target.value);
                                          }}
                                        >
                                          <FormControlLabel
                                            value={e}
                                            control={
                                              <Radio
                                                style={{ color: '#F08B32' }}
                                              />
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
                                        temp[1] === 'Ascending'
                                          ? 'asc'
                                          : 'desc',
                                      );
                                      setOrderBy(temp[0].toLowerCase());
                                      setAnchorElFor({
                                        ...anchorElFor,
                                        sort: null,
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
                                      const temp =
                                        event.target.value.split(' ');
                                      setSortValue(event.target.value);
                                      setValue(
                                        temp[1] === 'Ascending'
                                          ? 'asc'
                                          : 'desc',
                                      );
                                      setOrderBy(temp[0].toLowerCase());
                                    }}
                                    onClick={() => setDrawerSort(false)}
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
                          </div>
                        </SelectBottomSheet>
                      </Mui.Stack>
                    </div>
                  </Mui.Stack>
                  <div
                    className={css.rowFilter}
                    style={{
                      display:
                        customerID?.length > 0 ||
                        (toDate && fromDate) ||
                        typeValue ||
                        sortValue ||
                        SalesPerson?.id ||
                        statusValue
                          ? // desktop to hide
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
                              selectedCustomerList?.find(
                                (item) => item.id === val,
                              )?.name
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
                          label={`${moment(fromDate, 'YYYY-MM-DD').format(
                            'MMM DD',
                          )} - ${moment(toDate, 'YYYY-MM-DD').format(
                            'MMM DD, YYYY',
                          )}`}
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

                    {typeValue && (
                      <div className={css.orangeList}>
                        <Chip
                          className={classes.selectedchips}
                          label={`${
                            InvoiceType.find((val) => val.value === typeValue)
                              .label
                          }`}
                          variant="outlined"
                          onDelete={() => {
                            setTypeValue('');
                          }}
                        />
                      </div>
                    )}

                    {statusValue && (
                      <div className={css.orangeList}>
                        <Chip
                          className={classes.selectedchips}
                          label={`${statusValue?.label}`}
                          variant="outlined"
                          onDelete={() => {
                            setStatusValue('');
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

                    {SalesPerson?.id && (
                      <div className={css.orangeList}>
                        <Chip
                          className={classes.selectedchips}
                          label={`${SalesPerson?.selected?.name}`}
                          variant="outlined"
                          onDelete={() => {
                            setSalesPerson({ id: '', selected: {} });
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {device === 'mobile' && (
                    <>
                      {approvedLoad === null && (
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

                      {approvedLoad !== null && draftInvoice?.length > 0 && (
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
                                style={{ marginTop: '0px' }}
                                className={css.box}
                                onClick={() => {
                                  handleRowSelection(d);
                                }}
                              >
                                <Item className={css.raisedMobileCard}>
                                  <Mui.Stack
                                    direction="row"
                                    justifyContent="space-between"
                                  >
                                    <p className={css.contentName}>
                                      {d?.customer_name?.toLowerCase()}
                                    </p>
                                    <p className={css.amount}>
                                      {customCurrency(
                                        d?.currency?.iso_code,
                                        d?.currency?.locale,
                                      ).format(d?.invoice_value)}
                                    </p>
                                  </Mui.Stack>

                                  <Mui.Stack
                                    direction="row"
                                    alignItems="center"
                                    gap="4px"
                                    padding="9px 0 12px 0"
                                  >
                                    {invoiceSettingsData?.sales_person_invoicing && (
                                      <>
                                        <p className={css.salesPerson}>
                                          {d.sales_person_id
                                            ? 'Salesperson:'
                                            : ''}
                                        </p>
                                        {d.sales_person_id && (
                                          <Mui.Avatar
                                            sx={{
                                              width: 16,
                                              height: 16,
                                              fontSize: 10,
                                              background: '#A8AEBE',
                                              textTransform: 'capitalize',
                                            }}
                                          >
                                            {d.sales_person_id
                                              ? salesPersonList
                                                  ?.filter(
                                                    (c) =>
                                                      c.id ===
                                                      d.sales_person_id,
                                                  )[0]
                                                  ?.name?.split('')?.[0]
                                              : ''}
                                          </Mui.Avatar>
                                        )}
                                        <p>
                                          {
                                            salesPersonList?.filter(
                                              (c) => c.id === d.sales_person_id,
                                            )[0]?.name
                                          }
                                        </p>
                                      </>
                                    )}
                                  </Mui.Stack>

                                  {invoiceApprovedData?.e_invoice_enabled && (
                                    <Mui.Stack
                                      direction="row"
                                      alignItems="center"
                                      gap="4px"
                                      padding="0px 0 12px 0"
                                    >
                                      <>
                                        <p className={css.salesPerson}>
                                          IRN Status:
                                        </p>
                                        <p>{d?.e_invoice_status}</p>
                                      </>
                                    </Mui.Stack>
                                  )}

                                  <Mui.Stack
                                    direction="row"
                                    justifyContent="space-between"
                                  >
                                    <p className={css.date}>
                                      {moment(d?.created_at).format(
                                        'DD-MM-YYYY, HH:MM',
                                      )}
                                    </p>
                                    <p className={css.date}>
                                      {d?.invoice_number}
                                    </p>
                                    <Mui.Grid
                                      className={css.documentType}
                                      style={{
                                        background: INVOICE_TYPES.find(
                                          (val) =>
                                            val.payload === d.document_type,
                                        )?.color,
                                      }}
                                    >
                                      {
                                        INVOICE_TYPES.find(
                                          (val) =>
                                            val.payload === d.document_type,
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
                      {approvedLoad !== null &&
                        invoiceApprovedData?.data?.length === 0 && (
                          <div className={css.draftInfo}>
                            <Mui.Typography align="center">
                              No Invoices Found
                            </Mui.Typography>
                          </div>
                        )}
                    </>
                  )}

                  {device === 'desktop' && draftInvoice && (
                    <Mui.Box
                      sx={{
                        height: '78vh',
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
                        columns={datagridColumn()?.map((col) => {
                          if (col.field !== 'customer_name') {
                            return col;
                          }
                          return {
                            ...col,
                            filterOperators:
                              getGridSingleSelectOperators().filter(
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
                        loading={approvedLoad === null}
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
                WebCancel();
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
                    // setTimeout(() => {
                    cancelInvoice(activeItem?.id);
                    // }, 1000);
                  }}
                >
                  &nbsp; OK &nbsp;
                </Button>
              </div>
            </div>
          </ReceivablesPopOver>
        </div>
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default memo(UndispatchedInvoiceContainer);
