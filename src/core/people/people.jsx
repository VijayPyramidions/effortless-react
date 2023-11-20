/* eslint-disable no-nested-ternary */

import React from 'react';
import * as Mui from '@mui/material';
import SearchIcon from '@material-ui/icons/Search';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import JSBridge from '@nativeBridge/jsbridge';
import RequestPayment from '@core/Receivables/Ageing/RequestPayment.jsx';
import RequestPaymentVendor from '@core/Payables/Ageing/RequestPayment.jsx';
import * as Router from 'react-router-dom';
import phoneOut from '@assets/PeopleCallOut.png';
import emailOut from '@assets/PeopleEmailOut.png';
import { InvoiceCustomer } from '@components/Invoice/EditForm.jsx';
import editIcon from '@assets/editYourBills.png';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import {
  DataGridPro,
  // GridFilterPanel,
  GridColumnMenuContainer,
  SortGridMenuItems,
  // HideGridColMenuItem,
  // GridColumnsMenuItem,
  // GridFilterMenuItem,
} from '@mui/x-data-grid-pro';
import PageTitle from '@core/DashboardView/PageTitle';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import downArrow from '@assets/downArrow.svg';
import TeamBottomSheet from '../../components/CreateNew/TeamNew/TeamBottomSheet';
import ReceivablesPopOver from '../Receivables/Components/ReceivablesPopover';
import { PeopleUser } from './Components/PeopleUser.jsx';
import VendorAvailable from './Components/VendorAvailablePeople';
import AdminUser from '../../assets/AdminUser.png';
import * as css from './people.scss';
import CreateCustomerDialogNew from '../../components/CreateNew/CustomerNew/CreateCustomerDialogNew';
import AddVendorManual from '../../components/CreateNew/VendorNew/AddVendorManual';

export function CustomColumnMenu(props) {
  const { hideMenu, currentColumn, color, ...other } = props;

  return (
    <GridColumnMenuContainer
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      {...other}
    >
      <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
      {/* <GridFilterMenuItem onClick={hideMenu} column={currentColumn} /> */}
      {/* <HideGridColMenuItem onClick={hideMenu} column={currentColumn} /> */}
      {/* <GridColumnsMenuItem onClick={hideMenu} column={currentColumn} /> */}
    </GridColumnMenuContainer>
  );
}

const Puller = Mui.styled(Mui.Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const People = () => {
  const {
    organization,
    user,
    enableLoading,
    openSnackBar,
    loading,
    userPermissions,
  } = React.useContext(AppContext);

  const [customerData, setCustomerData] = React.useState(null);
  const [vendorData, setVendorData] = React.useState(null);
  const [teamData, setTeamData] = React.useState(null);
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredUserState, setFilteredUserState] = React.useState({
    filterCustomerData: [],
    filterVendorData: [],
    filterTeamData: [],
  });
  const [click, setClick] = React.useState('');
  const deviceDetect = localStorage.getItem('device_detect');
  const [drawer, setDrawer] = React.useState({
    customerDrawer: false,
    vendorDrawer: false,
    teamDrawer: false,
    // sortBy: null,
    tablePopover: null,
    // subSortBy: null,
    onBoarding: false,
    requestPayment: false,
    requestPaymentVendor: false,
    // requestPaymentTeam: false,
  });
  const [tableDetails, setTableDetails] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobilePopover, setMobilePopover] = React.useState({
    open: false,
    value: {},
  });
  const [userConfirm, setUserConfirm] = React.useState({
    show: null,
    open: false,
  });
  const [sortMethod, setSortMethod] = React.useState({});
  const [editForm, setEditForm] = React.useState(false);

  const [showVendorAvail, setShowVendorAvail] = React.useState({
    vendor: false,
    id: '',
    customer: false,
  });
  const [anchorElPay, setAnchorElPay] = React.useState(null);
  const [payList, setPayList] = React.useState([]);
  const [deactivatePop, setDeactivatePop] = React.useState(false);
  const [activatePop, setActivatePop] = React.useState(false);
  const [editValue, setEditValue] = React.useState({
    value: {},
    type: '',
    show: 'new',
  });
  const [customerPagination, setCustomerPagination] = React.useState({
    currentPage: 1,
    totalPage: 1,
  });
  const [vendorPagination, setVendorPagination] = React.useState({
    currentPage: 1,
    totalPage: 1,
  });

  const [employeePagination, setEmployeePagination] = React.useState({
    currentPage: 1,
    totalPage: 1,
  });

  const openPay = Boolean(anchorElPay);

  const sortBy = [
    {
      name: 'Party Name (A-Z)',
      value: 'name',
      type: 'order_by',
      sort: 'asc',
      id: 1,
    },
    {
      name: 'Party Name (Z-A)',
      value: 'name',
      type: 'order_by',
      sort: 'desc',
      id: 2,
    },
    {
      name:
        click === 'tab1'
          ? 'Overdue Receivable (High to Low)'
          : (click === 'tab2' && 'Overdue Payable (High to Low)') ||
            'Total Due (High to Low)',
      value: 'amount_overdue',
      type: 'order_by',
      sort: 'desc',
      id: 3,
    },
    {
      name:
        click === 'tab1'
          ? 'Overdue Receivable (Low to High)'
          : (click === 'tab2' && 'Overdue Payable (Low to High)') ||
            'Total Due (Low to High)',
      value: 'amount_overdue',
      type: 'order_by',
      sort: 'asc',
      id: 4,
    },
  ];
  const [userRolesPeople, setUserRolesPeople] = React.useState({});
  const [userRolesReceviables, setUserRolesReceviables] = React.useState({});
  const [userRolesInvoicing, setUserRolesInvoicing] = React.useState({});
  const [userRolesExpense, setUserRolesExpense] = React.useState({});
  const [userRolesPayments, setUserRolesPayments] = React.useState({});
  const [userRolesPayables, setUserRolesPayables] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.People || {})?.length > 0) {
      if (!userPermissions?.People?.People) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRolesPeople({ ...userPermissions?.People });
      setUserRolesReceviables({ ...userPermissions?.Receivables });
      setUserRolesInvoicing({ ...userPermissions?.Invoicing });
      setUserRolesExpense({ ...userPermissions?.Expense });
      setUserRolesPayments({ ...userPermissions?.Payments });
      setUserRolesPayables({ ...userPermissions?.Payables });
    }
  }, [userPermissions]);

  React.useEffect(() => {
    if (state?.choose) {
      setClick(state?.choose);
    }
  }, [state]);

  const handleBottomSheetCloseDrawer = (name) => {
    setDrawer((prev) => ({ ...prev, [name]: false }));
    if (state?.selectedId) {
      navigate('/people', { state: { choose: click } });
    }
  };

  const fetchCustomerApi = (searchVal, pagenum) => {
    enableLoading(!!(searchVal || !pagenum || pagenum === 1));
    RestApi(
      sortMethod?.order_by && sortMethod?.order
        ? `organizations/${
            organization.orgId
          }/entities?type[]=customer&search=${searchVal || ''}&order_by=${
            sortMethod?.order_by
          }&order=${sortMethod?.order}&page=${pagenum || 1}`
        : `organizations/${
            organization.orgId
          }/entities?type[]=customer&search=${searchVal || ''}&page=${
            pagenum || 1
          }`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          setCustomerPagination({
            currentPage: res?.page,
            totalPage: res?.pages,
          });
          if (pagenum > 1) {
            setCustomerData((prev) => [...prev, ...res?.data]);
          } else {
            setCustomerData(res.data);
          }
        } else {
          openSnackBar({
            message: Object.values('Error in fetching Customers'),
            type: MESSAGE_TYPE.INFO,
          });
        }
        enableLoading(false);
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    if (customerPagination.totalPage > 1 && click === 'tab1') {
      if (customerPagination?.currentPage < customerPagination?.totalPage) {
        setTimeout(() => {
          fetchCustomerApi('', customerPagination?.currentPage + 1);
        }, 1000);
      }
    }
  }, [customerPagination.totalPage, customerPagination.currentPage, click]);

  const fetchVendor = (searchVal, pagenum) => {
    enableLoading(!!(searchVal || !pagenum || pagenum === 1));
    RestApi(
      sortMethod?.order_by && sortMethod?.order
        ? `organizations/${organization.orgId}/entities?type[]=vendor&search=${
            searchVal || ''
          }&order_by=${sortMethod?.order_by}&order=${sortMethod?.order}&page=${
            pagenum || 1
          }`
        : `organizations/${organization.orgId}/entities?type[]=vendor&search=${
            searchVal || ''
          }&page=${pagenum || 1}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(!!(searchVal || !pagenum || pagenum === 1));
        if (res && !res.error) {
          setVendorPagination({
            currentPage: res?.page,
            totalPage: res?.pages,
          });
          if (pagenum > 1) {
            setVendorData((prev) => [...prev, ...res?.data]);
          } else {
            setVendorData(res.data);
          }
        } else {
          openSnackBar({
            message: Object.values('Error in fetching Vendors'),
            type: MESSAGE_TYPE.WARNING,
          });
        }
        enableLoading(false);
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    if (vendorPagination.totalPage > 1 && click === 'tab2') {
      if (vendorPagination?.currentPage < vendorPagination?.totalPage) {
        setTimeout(() => {
          fetchVendor('', vendorPagination?.currentPage + 1);
        }, 1000);
      }
    }
  }, [vendorPagination.totalPage, vendorPagination.currentPage, click]);

  const fetchTeamApi = (searchVal, pagenum) => {
    enableLoading(!!(searchVal || !pagenum || pagenum === 1));
    RestApi(
      sortMethod?.order_by && sortMethod?.order
        ? `organizations/${organization.orgId}/members?search=${
            searchVal || ''
          }&order_by=${sortMethod?.order_by}&order=${sortMethod?.order}&page=${
            pagenum || 1
          }`
        : `organizations/${organization.orgId}/members?search=${
            searchVal || ''
          }&page=${pagenum || 1}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(!!(searchVal || !pagenum || pagenum === 1));
        if (res && !res.error) {
          setEmployeePagination({
            currentPage: res?.page,
            totalPage: res?.pages,
          });
          const activeEmployee = res?.data?.filter(
            (ele) => ele.active === true,
          );
          const deactiveEmployee = res?.data?.filter(
            (ele) => ele.active === false,
          );

          if (pagenum > 1) {
            setTeamData((prev) => [
              ...prev,
              ...activeEmployee,
              ...deactiveEmployee,
            ]);
          } else {
            setTeamData([...activeEmployee, ...deactiveEmployee]);
          }
        }
        enableLoading(false);
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    if (employeePagination.totalPage > 1 && click === 'tab3') {
      if (employeePagination?.currentPage < employeePagination?.totalPage) {
        setTimeout(() => {
          fetchTeamApi('', employeePagination?.currentPage + 1);
        }, 1000);
      }
    }
  }, [employeePagination.totalPage, employeePagination.currentPage, click]);

  React.useEffect(() => {
    // const filteredUser = [];
    if (click === 'tab1') {
      setFilteredUserState({
        filterCustomerData: customerData,
        filterVendorData: [],
        filterTeamData: [],
      });
    } else if (click === 'tab2') {
      setFilteredUserState({
        filterCustomerData: [],
        filterVendorData: vendorData,
        filterTeamData: [],
      });
    } else if (click === 'tab3') {
      setFilteredUserState({
        filterCustomerData: [],
        filterVendorData: [],
        filterTeamData: teamData,
      });
    }
  }, [searchQuery, customerData, vendorData, teamData, click]);

  const userView = (val, followUp) => {
    if (click === 'tab1') {
      if (followUp) {
        setMobilePopover({ open: false, value: val });
        setDrawer((prev) => ({ ...prev, requestPayment: true }));
      } else {
        setEditValue({ value: val, type: 'customer', show: 'view' });
        setDrawer((prev) => ({ ...prev, customerDrawer: true }));
      }
    }
    if (click === 'tab2') {
      if (followUp) {
        setMobilePopover({ open: false, value: val });
        setDrawer((prev) => ({ ...prev, requestPayment: true }));
      } else {
        setEditValue({ value: val, type: 'vendor', show: 'view' });
        setDrawer((prev) => ({ ...prev, vendorDrawer: true }));
      }
    }
    if (click === 'tab3') {
      setEditValue({ value: val, type: 'team', show: 'view' });
      setDrawer((prev) => ({ ...prev, teamDrawer: true }));
    }
  };

  const teamView = (val) => {
    setEditValue({ value: val, type: 'team', show: 'view' });
    setDrawer((prev) => ({ ...prev, teamDrawer: true }));
  };

  const confirmUser = (val, states) => {
    setUserConfirm({ show: val, open: states });
  };

  const handleClick = (event, params) => {
    if (deviceDetect !== 'mobile')
      setDrawer((prev) => ({ ...prev, tablePopover: event?.currentTarget }));

    if (click === 'tab1') {
      setTableDetails([
        {
          name: 'View Invoices',
          device: 'mobile',
          click: (val) => {
            if (
              !userRolesReceviables['Customer Ageing']?.view_receivable_ageing
            ) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/receivables-ageing-view', {
              state: {
                tableId: val?.id,
                selectedDate: new Date(),
                wise: '',
                from: 'people',
                open: 'openbills',
              },
            });
          },
          active:
            deviceDetect === 'mobile' ? !params?.active : !params?.row?.active,
        },
        {
          name: 'View Relationship',
          click: (val) => {
            if (
              !userRolesReceviables['Customer Ageing']?.view_receivable_ageing
            ) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/receivables-ageing-view', {
              state: {
                tableId: val?.id,
                selectedDate: new Date(),
                wise: '',
                from: 'people',
                open: 'relationship',
              },
            });
          },
          active:
            deviceDetect === 'mobile' ? !params?.active : !params?.row?.active,
        },
        {
          name: 'Raise an Invoice',
          click: (val) => {
            if (!userRolesInvoicing.Invoicing) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/people-invoice-new', {
              state: {
                people: {
                  id: val?.id,
                },
              },
            });
          },
          active:
            deviceDetect === 'mobile' ? !params?.active : !params?.row?.active,
        },
        {
          name: 'View Customer Details',
          device: 'mobile',
          color: deviceDetect === 'mobile' ? '#F08B32' : '#000',
          click: (val) => userView(val),
          active:
            deviceDetect === 'mobile' ? !params?.active : !params?.row?.active,
        },
        {
          name:
            params?.row?.active || params?.active
              ? 'Deactivate Customer'
              : 'Activate Customer',
          color: params?.row?.active || params?.active ? '#DE2F2F' : 'green',
          click: () => {
            if (!userRolesPeople?.Customers?.delete_customers) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            if (params?.row?.active || params?.active) {
              setDeactivatePop(true);
            } else {
              setActivatePop(true);
            }
          },
        },
      ]);
    } else if (click === 'tab2') {
      setTableDetails([
        {
          name: 'View Bills',
          device: 'mobile',
          click: (val) => {
            if (!userRolesExpense['Bill Booking']?.view_bills) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/bill-yourbills', {
              state: {
                people: {
                  id: val?.id,
                  name: val?.name,
                  from: 'tab2',
                },
              },
            });
          },
          active:
            deviceDetect === 'mobile' ? !params?.active : !params?.row?.active,
        },
        {
          name: 'View Relationship',
          click: (val) => {
            if (!userRolesPayables['Vendor Ageing']?.view_payable_ageing) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/payables-ageing-view', {
              state: {
                tableId: val.id,
                selectedDate: new Date(),
                wise: '',
                from: 'people',
                open: 'relationship',
                fromVendorSelection: true,
                path: '/people',
                backState: { choose: 'tab2' },
              },
            });
          },
          active:
            deviceDetect === 'mobile' ? !params?.active : !params?.row?.active,
        },
        {
          name: 'Bill Booking',
          click: (val) => {
            if (!userRolesExpense['Bill Booking']?.create_bills) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/bill-upload', {
              state: {
                people: {
                  id: val?.id,
                  name: val?.name,
                  from: 'tab2',
                },
              },
            });
          },
          active:
            deviceDetect === 'mobile' ? !params?.active : !params?.row?.active,
        },
        {
          name: 'View Vendor Details',
          device: 'mobile',
          color: deviceDetect === 'mobile' ? '#F08B32' : '#000',
          click: (val) => userView(val),
          active:
            deviceDetect === 'mobile' ? !params?.active : !params?.row?.active,
        },
        {
          name:
            params?.row?.active || params?.active
              ? 'Deactivate Vendor'
              : 'Activate Vendor',
          color: params?.row?.active || params?.active ? '#DE2F2F' : 'green',
          click: () => {
            if (!userRolesPeople?.Vendors?.delete_vendors) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            if (params?.row?.active || params?.active) {
              setDeactivatePop(true);
            } else {
              setActivatePop(true);
            }
          },
        },
      ]);
      setPayList([
        {
          name: 'Pay Open Bills',
          click: (val) =>
            navigate('/payment-makepayment', {
              state: {
                fromVendorSelection: {
                  id: val?.id,
                  path: '/people',
                  backState: { choose: 'tab2' },
                },
              },
            }),
        },
        {
          name: 'Pay an Advance',
          click: (val) =>
            navigate('/payment-advancepayments', {
              state: {
                fromVendorSelection: {
                  id: val,
                  path: '/people',
                  backState: { choose: 'tab2' },
                },
              },
            }),
        },
      ]);
    } else if (click === 'tab3') {
      setTableDetails([
        // {
        //   name: 'Pay Advance',
        //   color: deviceDetect === 'mobile' ? '#F08B32' : '#000',
        //   // click: (val) => teamView(val),
        // },
        // {
        //   name: 'Pay Existing Claims',
        //   color: deviceDetect === 'mobile' ? '#F08B32' : '#000',
        //   // click: (val) => teamView(val),
        // },
        {
          name: 'View Bills',
          device: 'mobile',
          click: (val) => {
            if (!userRolesExpense['Bill Booking']?.view_bills) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/bill-yourbills', {
              state: {
                people: {
                  id: val?.id,
                  name: val?.name,
                  from: 'tab3',
                },
              },
            });
          },
          active:
            deviceDetect === 'mobile' ? !params?.active : !params?.row?.active,
        },
        // { name: 'Upload Bill for Reimbursement' },
        {
          name: 'View Member Details',
          device: 'mobile',
          color: deviceDetect === 'mobile' ? '#F08B32' : '#000',
          click: (val) => teamView(val),
          active:
            deviceDetect === 'mobile' ? !params?.active : !params?.row?.active,
        },
        // {
        //   name: 'Deactivate Member Account',
        //   color: '#9C3131',
        //   click: () => confirmUser('delete', true),
        // },

        {
          name:
            params?.row?.active || params?.active
              ? 'Deactivate Member Account'
              : 'Activate Member Account',
          color: params?.row?.active || params?.active ? '#DE2F2F' : 'green',
          click: () => {
            if (!userRolesPeople?.Employees?.delete_employees) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            if (params?.row?.active || params?.active) {
              confirmUser('delete', true);
            } else {
              confirmUser('activate', true);
            }
          },
        },
      ]);
      setPayList([
        {
          name: 'Pay Advance',
        },
        {
          name: 'Pay Existing Claims',
        },
      ]);
    }
  };

  const addVendorComplete = (status) => {
    if (status === 'success') {
      fetchVendor();
      handleBottomSheetCloseDrawer('vendorDrawer');
      setEditValue({ value: {}, type: '', show: 'new' });
      setSearchQuery('');
    }
  };

  const deactivate = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/members/${mobilePopover?.value?.user_id}`,
      {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res) {
          confirmUser(null, false);
          handleBottomSheetCloseDrawer('teamDrawer');
          setEditForm(false);
          fetchTeamApi();
        } else {
          openSnackBar({
            message: res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const activateMember = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/members/${mobilePopover?.value?.user_id}?active=true`,
      {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res) {
          confirmUser(null, false);
          handleBottomSheetCloseDrawer('teamDrawer');
          setEditForm(false);
          fetchTeamApi();
        } else {
          openSnackBar({
            message: res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const deactivateCuSVen = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/entities/${
        click === 'tab3'
          ? mobilePopover?.value?.entity_id
          : mobilePopover?.value?.id
      }?type=${
        click === 'tab1' ? 'customer' : click === 'tab2' ? 'vendor' : 'employee'
      }`,
      {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (!res?.error) {
          setDeactivatePop(false);
          if (click === 'tab1') {
            fetchCustomerApi();
          } else if (click === 'tab2') {
            fetchVendor();
          } else if (click === 'tab3') {
            fetchTeamApi();
          }
          setTimeout(() => {
            openSnackBar({
              message: 'Deactivated Successfully',
              type: MESSAGE_TYPE.INFO,
            });
          }, 1000);
          setSearchQuery('');
        } else {
          openSnackBar({
            message: res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const activateCuSVen = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/entities/${
        click === 'tab3'
          ? mobilePopover?.value?.entity_id
          : mobilePopover?.value?.id
      }?type=${
        click === 'tab1' ? 'customer' : click === 'tab2' ? 'vendor' : 'employee'
      }&active=true`,
      {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (!res?.error) {
          setActivatePop(false);
          if (click === 'tab1') {
            fetchCustomerApi();
          } else if (click === 'tab2') {
            fetchVendor();
          } else if (click === 'tab3') {
            fetchTeamApi();
          }
          setTimeout(() => {
            openSnackBar({
              message: 'Activated Successfully',
              type: MESSAGE_TYPE.INFO,
            });
          }, 1000);
          setSearchQuery('');
        } else {
          openSnackBar({
            message: res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const requestBank = (v_ids, contactId) => {
    if (!userRolesPeople?.Employees?.create_employees && click === 'tab3') {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    if (contactId) {
      RestApi(
        `organizations/${organization.orgId}/bank_approvals/send_mail/${v_ids}?contact_id=${contactId}`,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
        },
      )
        .then((res) => {
          if (res && res.error) {
            setTimeout(() => {
              openSnackBar({
                message: res?.message || 'Unknown Error Occured',
                type: MESSAGE_TYPE.ERROR,
              });
            }, 1000);
          } else if (res && !res.error) {
            setTimeout(() => {
              openSnackBar({
                message: res?.message,
                type: MESSAGE_TYPE.INFO,
              });
            }, 1000);
          } else {
            setTimeout(() => {
              openSnackBar({
                message: res?.message || 'Unknown Error Occured',
                type: MESSAGE_TYPE.ERROR,
              });
            }, 1000);
          }
        })
        .catch((res) => {
          setTimeout(() => {
            openSnackBar({
              message: res?.message || 'Unknown Error Occured',
              type: MESSAGE_TYPE.ERROR,
            });
          }, 1000);
        });
    } else {
      openSnackBar({
        message: 'Contact Id  is not avaialble',
        type: MESSAGE_TYPE.ERROR,
      });
    }
  };

  const fetchAllContacts = (v_ids) => {
    if (!userRolesPeople?.Vendors?.create_vendors && click === 'tab2') {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/vendors/${v_ids}/contacts?show=all`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      // eslint-disable-next-line consistent-return
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          const tempCont = res?.data?.filter((val) => val?.active);
          requestBank(v_ids, tempCont?.[0]?.id || '');
        }
        if (res && res.error) {
          openSnackBar({
            message: res?.message || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const PropsView = (params, viewType, followUp) => {
    if (
      !userRolesPeople?.[`${viewType?.type}s`]?.[viewType?.view] &&
      Object.keys(userRolesPeople?.[`${viewType?.type}s`] || {})?.length > 0
    ) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    if (params && params?.active) {
      userView(params, followUp);
    } else if (params && !params?.active) {
      openSnackBar({
        message: `${viewType?.type} is disabled`,
        type: MESSAGE_TYPE.WARNING,
      });
    }
  };

  React.useEffect(() => {
    if (state?.selectedId) {
      let params;
      let viewType;
      if (state?.choose === 'tab1') {
        viewType = { type: 'Customer', view: 'view_customers' };
        params = filteredUserState?.filterCustomerData?.find(
          (val) => val?.id === state?.selectedId,
        );
      }
      if (state?.choose === 'tab2') {
        viewType = { type: 'Vendor', view: 'view_vendors' };
        params = filteredUserState?.filterVendorData?.find(
          (val) => val?.id === state?.selectedId,
        );
      }
      if (state?.choose === 'tab3') {
        viewType = { type: 'Employees', view: 'view_employees' };
        params = filteredUserState?.filterTeamData?.find(
          (val) => val?.entity_id === state?.selectedId,
        );
      }
      PropsView(params, viewType, state?.followUp);
    }
  }, [
    state?.selectedId,
    filteredUserState?.filterCustomerData,
    filteredUserState?.filterVendorData,
    filteredUserState?.filterTeamData,
    state?.choose,
  ]);

  const teamColumns = [
    {
      field: 'name',
      headerName: 'Employee Name',
      renderCell: (params) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 0',
              cursor: params?.row?.active && 'pointer',
            }}
          >
            <Mui.Avatar className={css.avatar} sx={{ bgcolor: '#00A676' }}>
              {params?.row?.name?.split('')[0]?.toLocaleUpperCase()}
            </Mui.Avatar>{' '}
            <div
              className={css.peopleCusVen}
              style={{ padding: '0 9px 0 7px' }}
            >
              <p className={css.nameContact}>{params.row?.name}</p>{' '}
              {!params?.row?.active && (
                <span className={css.deactivated}>(Deactivated)</span>
              )}
            </div>
            {params?.row?.role === 'Admin' && (
              <img
                src={AdminUser}
                alt="admin"
                style={{ width: 20, height: 20 }}
              />
            )}
          </div>
        );
      },
      width: 380,
      maxWidth: 450,
      flex: 1,
    },
    {
      field: 'total_dues',
      headerName: 'Total Due',
      headerClassName: 'left-align--header',
      renderCell: (params) => {
        return (
          <Mui.Typography
            className={
              Number(params?.row?.total_dues) >= 0
                ? css.content
                : css.contentColor
            }
          >
            {FormattedAmount(params?.row?.total_dues)}
          </Mui.Typography>
        );
      },
      width: 150,
      maxWidth: 200,
      type: 'number',
      flex: 1,
    },
    {
      field1: 'id',
      headerName: 'Action',
      renderCell: (params) => {
        return (
          <>
            <div
              style={{ display: 'flex', gap: 20 }}
              onClick={() => {
                setMobilePopover({ open: false, value: params?.row });
              }}
            >
              <Mui.Button
                onClick={() => {
                  if (!userRolesExpense['Bill Booking']?.view_bills) {
                    setHavePermission({
                      open: true,
                      back: () => {
                        setHavePermission({ open: false });
                      },
                    });
                    return;
                  }
                  navigate('/bill-yourbills', {
                    state: {
                      people: {
                        id: params?.row?.id,
                        name: params?.row?.name,
                        from: 'tab3',
                      },
                    },
                  });
                }}
                className={css.peopleActionView}
                disabled={!params?.row?.active}
                style={{
                  padding: '.4vw 1.6vw',
                  opacity: !params?.row?.active ? 0.7 : 1,
                }}
              >
                View Bills
              </Mui.Button>

              {params?.row?.bank_detail ? (
                <Mui.Button
                  onClick={(event) => {
                    if (!userRolesPayments?.Payment?.create_payment) {
                      setHavePermission({
                        open: true,
                        back: () => {
                          setHavePermission({ open: false });
                        },
                      });
                      return;
                    }
                    setAnchorElPay(event?.currentTarget);
                  }}
                  className={css.peopleActionPay}
                  disabled={!params?.row?.active}
                  style={{
                    opacity: !params?.row?.active ? 0.7 : 1,
                    padding: '.4vw 3.2vw',
                  }}
                >
                  Pay Now
                </Mui.Button>
              ) : (
                <Mui.Button
                  onClick={() =>
                    requestBank(params?.row?.entity_id, params?.row?.contact_id)
                  }
                  className={css.peopleActionFollow}
                  disabled={!params?.row?.active}
                  style={{ opacity: !params?.row?.active ? 0.7 : 1 }}
                >
                  Request Bank Details
                </Mui.Button>
              )}
              <Mui.IconButton onClick={(e) => handleClick(e, params)}>
                <MoreVertOutlinedIcon />
              </Mui.IconButton>
            </div>
          </>
        );
      },
      width: 320,
      align: 'center',
      sortable: false,
      type: 'boolean',
      flex: 1,
    },
  ];

  const columns = [
    {
      field: 'short_name',
      headerName: click === 'tab1' ? 'Customer Name' : 'Company Name',
      renderCell: (params) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 0',
              cursor: params?.row?.active && 'pointer',
            }}
          >
            <Mui.Avatar className={css.avatar} sx={{ bgcolor: '#00A676' }}>
              {params?.row?.short_name?.split('')[0]?.toLocaleUpperCase()}
            </Mui.Avatar>{' '}
            <div className={css.peopleCusVen}>
              <p className={css.nameContact}>{params.row?.short_name}</p>
              {!params?.row?.active && (
                <span className={css.deactivated}>(Deactivated)</span>
              )}
              <p className={`${css.nameContact} ${css.nameContactSub}`}>
                <span className={css.tableContactName}>Contact Name: </span>
                {params?.row?.contact_name?.toLowerCase() || '-'}
              </p>
            </div>
          </div>
        );
      },
      // width: 380,
      maxWidth: 330,
      flex: 1,
    },
    {
      field: 'overdue_balance',
      headerName: click === 'tab1' ? 'Overdue Receivables' : 'Overdue',
      headerClassName: 'left-align--header',
      renderCell: (params) => {
        return (
          <Mui.Typography
            className={
              Number(params?.row?.overdue_balance) >= 0
                ? css.content
                : css.contentColor
            }
          >
            {FormattedAmount(params?.row?.overdue_balance)}
          </Mui.Typography>
        );
      },
      width: 150,
      maxWidth: 200,
      type: 'number',
      flex: 1,
    },
    {
      field: 'closing_balance',
      headerName: click === 'tab1' ? 'Total Receivables' : 'Total Due',
      headerClassName: 'left-align--header',
      renderCell: (params) => {
        return (
          <Mui.Typography
            className={
              Number(params?.row?.closing_balance) >= 0
                ? css.content
                : css.contentColor
            }
          >
            {FormattedAmount(params?.row?.closing_balance)}
          </Mui.Typography>
        );
      },
      width: 150,
      maxWidth: 200,
      type: 'number',
      flex: 1,
    },
    {
      field1: 'id',
      headerName: 'Action',
      renderCell: (params) => {
        return (
          <>
            {click === 'tab1' ? (
              <div
                style={{ display: 'flex', gap: 20 }}
                onClick={() => {
                  setMobilePopover({ open: false, value: params?.row });
                }}
              >
                <Mui.Button
                  onClick={() => {
                    if (
                      !userRolesReceviables['Customer Ageing']
                        ?.view_receivable_ageing
                    ) {
                      setHavePermission({
                        open: true,
                        back: () => {
                          setHavePermission({ open: false });
                        },
                      });
                      return;
                    }
                    navigate('/receivables-ageing-view', {
                      state: {
                        tableId: params?.row?.id,
                        selectedDate: new Date(),
                        wise: '',
                        from: 'people',
                        open: 'openbills',
                      },
                    });
                  }}
                  className={css.peopleActionView}
                  disabled={!params?.row?.active}
                  style={{ opacity: !params?.row?.active ? 0.7 : 1 }}
                >
                  View Invoices
                </Mui.Button>
                <Mui.Button
                  onClick={() =>
                    setDrawer((prev) => ({ ...prev, requestPayment: true }))
                  }
                  className={css.peopleActionFollow}
                  disabled={!params?.row?.active}
                  style={{ opacity: !params?.row?.active ? 0.7 : 1 }}
                >
                  Follow-Up
                </Mui.Button>
                <Mui.IconButton onClick={(e) => handleClick(e, params)}>
                  <MoreVertOutlinedIcon />
                </Mui.IconButton>
              </div>
            ) : (
              <div
                style={{ display: 'flex', gap: 20 }}
                onClick={() => {
                  setMobilePopover({ open: false, value: params?.row });
                }}
              >
                <Mui.Button
                  onClick={() => {
                    if (!userRolesExpense['Bill Booking']?.view_bills) {
                      setHavePermission({
                        open: true,
                        back: () => {
                          setHavePermission({ open: false });
                        },
                      });
                      return;
                    }
                    navigate('/bill-yourbills', {
                      state: {
                        people: {
                          id: params?.row?.id,
                          name: params?.row?.name,
                          from: 'tab2',
                        },
                      },
                    });
                  }}
                  className={css.peopleActionView}
                  disabled={!params?.row?.active}
                  style={{
                    padding: '.4vw 1.6vw',
                    opacity: !params?.row?.active ? 0.7 : 1,
                  }}
                >
                  View Bills
                </Mui.Button>
                {params?.row?.bank_detail ? (
                  <Mui.Button
                    onClick={(event) => {
                      if (!userRolesPayments?.Payment?.create_payment) {
                        setHavePermission({
                          open: true,
                          back: () => {
                            setHavePermission({ open: false });
                          },
                        });
                        return;
                      }
                      setAnchorElPay(event?.currentTarget);
                    }}
                    className={css.peopleActionPay}
                    disabled={!params?.row?.active}
                    style={{
                      opacity: !params?.row?.active ? 0.7 : 1,
                      padding: '.4vw 3.2vw',
                    }}
                  >
                    Pay Now
                  </Mui.Button>
                ) : (
                  <Mui.Button
                    onClick={() => fetchAllContacts(params?.row?.id)}
                    className={css.peopleActionFollow}
                    disabled={!params?.row?.active}
                    style={{
                      opacity: !params?.row?.active ? 0.7 : 1,
                      padding: '.4vw',
                    }}
                  >
                    Request Bank Details
                  </Mui.Button>
                )}
                <Mui.IconButton onClick={(e) => handleClick(e, params)}>
                  <MoreVertOutlinedIcon />
                </Mui.IconButton>
              </div>
            )}
          </>
        );
      },
      width: 320,
      align: 'center',
      sortable: false,
      type: 'boolean',
      flex: 1,
    },
  ];

  const handleClickMainPop = (event) => {
    setAnchorEl(event.currentTarget);
  };

  React.useEffect(() => {
    if (click === 'tab1') {
      if (searchQuery?.length > 2) {
        fetchCustomerApi(searchQuery);
      } else if (searchQuery?.length === 0) {
        fetchCustomerApi();
      }
      setTableDetails([
        {
          name: 'View Invoices',
          device: 'mobile',
          click: (val) => {
            if (
              !userRolesReceviables['Customer Ageing']?.view_receivable_ageing
            ) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/receivables-ageing-view', {
              state: {
                tableId: val?.id,
                selectedDate: new Date(),
                wise: '',
                from: 'people',
                open: 'openbills',
              },
            });
          },
        },
        {
          name: 'View Relationship',
          click: (val) => {
            if (
              !userRolesReceviables['Customer Ageing']?.view_receivable_ageing
            ) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/receivables-ageing-view', {
              state: {
                tableId: val?.id,
                selectedDate: new Date(),
                wise: '',
                from: 'people',
                open: 'relationship',
              },
            });
          },
        },
        {
          name: 'Raise an Invoice',
          click: (val) => {
            if (!userRolesInvoicing.Invoicing) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/people-invoice-new', {
              state: {
                people: {
                  id: val?.id,
                },
              },
            });
          },
        },
        {
          name: 'View Customer Details',
          device: 'mobile',
          color: deviceDetect === 'mobile' ? '#F08B32' : '#000',
          click: (val) => userView(val),
        },
        {
          name: 'Deactivate Customer',
          color: '#DE2F2F',
          click: () => {
            if (!userRolesPeople?.Customers?.delete_customers) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            setDeactivatePop(true);
          },
        },
      ]);
    } else if (click === 'tab2') {
      if (searchQuery?.length > 2) {
        fetchVendor(searchQuery);
      } else if (searchQuery?.length === 0) {
        fetchVendor();
      }
      setTableDetails([
        {
          name: 'View Bills',
          device: 'mobile',
          click: (val) => {
            if (!userRolesExpense['Bill Booking']?.view_bills) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/bill-yourbills', {
              state: {
                people: {
                  id: val?.id,
                  name: val?.name,
                  from: 'tab2',
                },
              },
            });
          },
        },
        {
          name: 'View Relationship',
          click: (val) => {
            if (!userRolesPayables['Vendor Ageing']?.view_payable_ageing) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/payables-ageing-view', {
              state: {
                tableId: val.id,
                selectedDate: new Date(),
                wise: '',
                from: 'people',
                open: 'relationship',
                fromVendorSelection: true,
                path: '/people',
                backState: { choose: 'tab2' },
              },
            });
          },
        },
        {
          name: 'View Vendor Details',
          device: 'mobile',
          color: deviceDetect === 'mobile' ? '#F08B32' : '#000',
          click: (val) => userView(val),
        },
        {
          name: 'Deactivate Vendor',
          color: '#DE2F2F',
          click: () => {
            if (!userRolesPeople?.Vendors?.delete_vendors) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            setDeactivatePop(true);
          },
        },
      ]);
      setPayList([
        {
          name: 'Pay Open Bills',
          click: (val) =>
            navigate('/payment-makepayment', {
              state: {
                fromVendorSelection: {
                  id: val?.id,
                  path: '/people',
                  backState: { choose: 'tab2' },
                },
              },
            }),
        },
        {
          name: 'Pay an Advance',
          click: (val) =>
            navigate('/payment-advancepayments', {
              state: {
                fromVendorSelection: {
                  id: val,
                  path: '/people',
                  backState: { choose: 'tab2' },
                },
              },
            }),
        },
      ]);
    } else if (click === 'tab3') {
      if (searchQuery?.length > 2) {
        fetchTeamApi(searchQuery);
      } else if (searchQuery?.length === 0) {
        fetchTeamApi();
      }
      setTableDetails([
        {
          name: 'View Bills',
          device: 'mobile',
          click: (val) => {
            if (!userRolesExpense['Bill Booking']?.view_bills) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            navigate('/bill-yourbills', {
              state: {
                people: {
                  id: val?.id,
                  name: val?.name,
                  from: 'tab3',
                },
              },
            });
          },
        },
        {
          name: 'View Member Details',
          device: 'mobile',
          color: deviceDetect === 'mobile' ? '#F08B32' : '#000',
          click: (val) => teamView(val),
        },
        {
          name: 'Deactivate Member Account',
          color: '#9C3131',
          click: () => {
            if (!userRolesPeople?.Employees?.delete_employees) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            confirmUser('delete', true);
          },
        },
      ]);
      setPayList([
        {
          name: 'Pay Advance',
        },
        {
          name: 'Pay Existing Claims',
        },
      ]);
    }
  }, [click, searchQuery]);

  React.useEffect(() => {
    if (click === 'tab1') {
      fetchCustomerApi();
    }
    if (click === 'tab2') {
      fetchVendor();
    }
    if (click === 'tab3') {
      fetchTeamApi();
    }
  }, [sortMethod]);

  const handleSortClick = (val) => {
    const tempSort = sortBy?.find((data) => data?.id === Number(val));
    setSortMethod({
      id: tempSort?.id,
      order: tempSort?.sort,
      order_by: tempSort?.value,
    });
    setAnchorEl(null);
  };

  const EditCustomerVendor = (drawerName) => {
    if (drawerName === 'customerDrawer') {
      if (!userRolesPeople?.Customers?.edit_customers) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
        return;
      }
    }
    if (drawerName === 'vendorDrawer') {
      if (!userRolesPeople?.Vendors?.edit_vendors) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
        return;
      }
    }

    if (deviceDetect === 'mobile') {
      setEditForm(true);
      setDrawer((prev) => ({ ...prev, [drawerName]: false }));
    } else {
      setEditValue((prev) => ({ ...prev, show: 'edit' }));
    }
  };

  const TabChange = (val) => {
    if (val === 'tab1' && !userRolesPeople?.Customers?.view_customers) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    if (val === 'tab2' && !userRolesPeople?.Vendors?.view_vendors) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    if (val === 'tab3' && !userRolesPeople?.Employees?.view_employees) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    setClick(val);
    setSortMethod({});
    setSearchQuery('');
  };

  React.useEffect(() => {
    if (!state?.choose) {
      if (userRolesPeople?.Customers?.view_customers) {
        setClick('tab1');
        return;
      }
      if (userRolesPeople?.Vendors?.view_vendors) {
        setClick('tab2');
        return;
      }
      if (userRolesPeople?.Employees?.view_employees) {
        setClick('tab3');
      }
    }
  }, [
    userRolesPeople?.Customers,
    userRolesPeople?.Vendors,
    userRolesPeople?.Employees,
    state?.choose,
  ]);

  React.useEffect(() => {
    if (state?.selectedName) {
      setSearchQuery(state?.selectedName);
    }
  }, [state?.selectedName]);

  return (
    <>
      <PageTitle
        title="People"
        onClick={() => {
          if (deviceDetect === 'mobile' && editForm) {
            setEditForm(false);
          } else if (deviceDetect === 'mobile' && !editForm) {
            navigate('/dashboard');
          } else {
            navigate('/dashboard');
          }
        }}
      />
      <div
        className={
          deviceDetect === 'mobile'
            ? css.dashboardBodyContainerhideNavBar
            : css.dashboardBodyContainerDesktop
        }
      >
        <Router.Outlet />
        {deviceDetect === 'mobile' &&
          ((!editForm && (
            <>
              <Mui.Stack className={css.stack1} width="100%">
                <Mui.Stack className={css.align}>
                  <Mui.Stack direction="row" className={css.stack2}>
                    {[
                      { show: 'customer', id: 'tab1' },
                      { show: 'vendor', id: 'tab2' },
                      { show: 'Employees', id: 'tab3' },
                    ]?.map((val) => (
                      <Mui.Button
                        variant="contained"
                        className={
                          click === val.id
                            ? css.sectionBtnHover
                            : css.sectionBtn
                        }
                        onClick={() => {
                          TabChange(val?.id);
                        }}
                      >
                        <Mui.Typography className={css.sectionBtnText}>
                          {val.show}
                        </Mui.Typography>
                      </Mui.Button>
                    ))}
                  </Mui.Stack>

                  <div className={css.searchFilter}>
                    <SearchIcon />{' '}
                    <input
                      placeholder="Search"
                      className={css.input}
                      style={{ width: '60%' }}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                    />
                    <Mui.Stack
                      onClick={handleClickMainPop}
                      className={css.sortBy}
                      direction="row"
                    >
                      <p className={css.sortByNew}>Sort by</p>
                      <img
                        src={downArrow}
                        className={css.imageDrp}
                        width="14px"
                        alt="downArrow"
                      />
                    </Mui.Stack>
                  </div>
                </Mui.Stack>

                {(filteredUserState?.filterCustomerData?.length > 0 ||
                  filteredUserState?.filterVendorData?.length > 0 ||
                  filteredUserState?.filterTeamData?.length > 0) && (
                  <div
                    style={{
                      maxHeight: '75%',
                      height: 'auto',
                      overflow: 'auto',
                      paddingBottom: '20%',
                      width: '96%',
                      padding: '2% 2% 80px',
                    }}
                  >
                    {click === 'tab1' && (
                      <>
                        {filteredUserState?.filterCustomerData?.map((val) => {
                          return (
                            <div className={css.customerPeople}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '10px 10px 0',
                                }}
                                onClick={(e) => {
                                  handleClick(e, val);
                                  setTimeout(() => {
                                    setMobilePopover({
                                      open: true,
                                      value: val,
                                    });
                                  }, 300);
                                }}
                              >
                                <Mui.Avatar
                                  className={css.avatarForMobile}
                                  sx={{ bgcolor: '#F08B32' }}
                                >
                                  {val?.short_name
                                    ?.split('')[0]
                                    ?.toLocaleUpperCase()}
                                </Mui.Avatar>
                                <p className={css.namePtag}>
                                  {val?.short_name}{' '}
                                  {!val?.active && (
                                    <span className={css.deactivated}>
                                      (Deactivated)
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div
                                onClick={(e) => {
                                  handleClick(e, val);
                                  setTimeout(() => {
                                    setMobilePopover({
                                      open: true,
                                      value: val,
                                    });
                                  }, 300);
                                }}
                                className={css.middleTab}
                              >
                                <p className={css.contactPtag}>
                                  Contact Name:{' '}
                                  <span className={css.contactSpantag}>
                                    {val?.contact_name || '-'}
                                  </span>
                                </p>
                                <p className={css.overduePtag}>
                                  Overdue Receivable:{' '}
                                  <span className={css.contactSpantag}>
                                    {FormattedAmount(val?.closing_balance)}
                                  </span>
                                </p>
                              </div>
                              <div
                                onClick={() => {
                                  setMobilePopover({
                                    open: false,
                                    value: val,
                                  });
                                }}
                                className={css.lastTab}
                              >
                                <div
                                  style={{
                                    width: '49%',
                                    borderRight: '1px solid rgb(229, 229, 229)',
                                    opacity: !val?.active ? 0.5 : 1,
                                  }}
                                  disabled={!val?.active}
                                  onClick={() => {
                                    if (val?.active) {
                                      JSBridge.callPhoneNumber(
                                        `${val?.mobile_number}`,
                                      );
                                    }
                                  }}
                                >
                                  <Mui.IconButton
                                    className={css.iconCallFollow}
                                    disabled={!val?.active}
                                  >
                                    <img
                                      src={phoneOut}
                                      alt="phone"
                                      style={{ width: 15 }}
                                    />
                                    <p className={css.callFollow}>Call</p>
                                  </Mui.IconButton>
                                </div>
                                <div
                                  style={{
                                    width: '50%',
                                    opacity: !val?.active ? 0.5 : 1,
                                  }}
                                >
                                  <Mui.IconButton
                                    onClick={() =>
                                      setDrawer((prev) => ({
                                        ...prev,
                                        requestPayment: true,
                                      }))
                                    }
                                    className={css.iconCallFollow}
                                    disabled={!val?.active}
                                  >
                                    <img
                                      src={emailOut}
                                      alt="phone"
                                      style={{ width: 15 }}
                                    />
                                    <p className={css.callFollow}>
                                      Follow - Up
                                    </p>
                                  </Mui.IconButton>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}

                    {/* {vendor} */}
                    {click === 'tab2' && (
                      <>
                        {filteredUserState?.filterVendorData?.map((val) => {
                          return (
                            <div className={css.customerPeople}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '10px 10px 0',
                                }}
                                onClick={(e) => {
                                  handleClick(e, val);
                                  setTimeout(() => {
                                    setMobilePopover({
                                      open: true,
                                      value: val,
                                    });
                                  }, 300);
                                }}
                              >
                                <Mui.Avatar
                                  className={css.avatarForMobile}
                                  sx={{ bgcolor: '#F08B32' }}
                                >
                                  {val?.short_name
                                    ?.split('')[0]
                                    ?.toLocaleUpperCase()}
                                </Mui.Avatar>
                                <p className={css.namePtag}>
                                  {val?.short_name}{' '}
                                  {!val?.active && (
                                    <span className={css.deactivated}>
                                      (Deactivated)
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div
                                onClick={(e) => {
                                  handleClick(e, val);
                                  setTimeout(() => {
                                    setMobilePopover({
                                      open: true,
                                      value: val,
                                    });
                                  }, 300);
                                }}
                                className={css.middleTab}
                              >
                                <p className={css.contactPtag}>
                                  Contact Name:{' '}
                                  <span className={css.contactSpantag}>
                                    {val?.contact_name || '-'}
                                  </span>
                                </p>
                                <p className={css.overduePtag}>
                                  Overdue Payables:{' '}
                                  <span className={css.contactSpantag}>
                                    {FormattedAmount(val?.closing_balance)}
                                  </span>
                                </p>
                              </div>
                              <div
                                onClick={() => {
                                  setMobilePopover({
                                    open: false,
                                    value: val,
                                  });
                                }}
                                className={css.lastTab}
                              >
                                <div
                                  style={{
                                    width: '49%',
                                    borderRight: '1px solid rgb(229, 229, 229)',
                                    opacity: !val?.active ? 0.5 : 1,
                                  }}
                                  disabled={!val?.active}
                                  onClick={() => {
                                    if (val?.active) {
                                      JSBridge.callPhoneNumber(
                                        `${val?.mobile_number}`,
                                      );
                                    }
                                  }}
                                >
                                  <Mui.IconButton
                                    // href={`tel:${val?.mobile_number}`}
                                    className={css.iconCallFollow}
                                    disabled={!val?.active}
                                  >
                                    <img
                                      src={phoneOut}
                                      alt="phone"
                                      style={{ width: 15 }}
                                    />
                                    <p className={css.callFollow}>Call</p>
                                  </Mui.IconButton>
                                </div>
                                <div
                                  style={{
                                    width: '50%',
                                    opacity: !val?.active ? 0.5 : 1,
                                  }}
                                >
                                  {val?.bank_detail ? (
                                    <Mui.IconButton
                                      onClick={(event) => {
                                        if (
                                          !userRolesPayments?.Payment
                                            ?.create_payment
                                        ) {
                                          setHavePermission({
                                            open: true,
                                            back: () => {
                                              setHavePermission({
                                                open: false,
                                              });
                                            },
                                          });
                                          return;
                                        }

                                        setAnchorElPay(event?.currentTarget);
                                      }}
                                      className={css.iconCallFollow}
                                      disabled={!val?.active}
                                    >
                                      <p
                                        className={css.callFollow}
                                        style={{ color: '#00A676' }}
                                      >
                                        Pay Now
                                      </p>
                                    </Mui.IconButton>
                                  ) : (
                                    <Mui.IconButton
                                      onClick={() => fetchAllContacts(val?.id)}
                                      className={css.iconCallFollow}
                                      disabled={!val?.active}
                                    >
                                      <p className={css.callFollow}>
                                        Request Bank Details
                                      </p>
                                    </Mui.IconButton>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}

                    {click === 'tab3' && (
                      <>
                        {filteredUserState?.filterTeamData?.map((val) => {
                          return (
                            <div className={css.customerPeople}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '10px 10px 0',
                                }}
                                onClick={(e) => {
                                  handleClick(e, val);
                                  setTimeout(() => {
                                    setMobilePopover({
                                      open: true,
                                      value: val,
                                    });
                                  }, 300);
                                }}
                              >
                                <Mui.Avatar
                                  className={css.avatarForMobile}
                                  sx={{ bgcolor: '#F08B32' }}
                                >
                                  {val?.name?.split('')[0]?.toLocaleUpperCase()}
                                </Mui.Avatar>
                                <p className={css.namePtag}>
                                  {val?.name}{' '}
                                  {!val?.active && (
                                    <span className={css.deactivated}>
                                      (Deactivated)
                                    </span>
                                  )}
                                </p>{' '}
                                {val?.role === 'Admin' && (
                                  <img
                                    src={AdminUser}
                                    alt="admin"
                                    style={{
                                      width: 20,
                                      height: 20,
                                      paddingLeft: '13px',
                                    }}
                                  />
                                )}
                              </div>
                              <div
                                onClick={(e) => {
                                  handleClick(e, val);
                                  setTimeout(() => {
                                    setMobilePopover({
                                      open: true,
                                      value: val,
                                    });
                                  }, 300);
                                }}
                                className={css.middleTab}
                              >
                                <p
                                  className={css.overduePtag}
                                  style={{ margin: 0 }}
                                >
                                  Total due:{' '}
                                  <span className={css.contactSpantag}>
                                    {FormattedAmount(val?.closing_balance)}
                                  </span>
                                </p>
                              </div>
                              <div
                                onClick={() => {
                                  setMobilePopover({
                                    open: false,
                                    value: val,
                                  });
                                }}
                                className={css.lastTab}
                              >
                                <div
                                  style={{
                                    width: '33%',
                                    opacity: !val?.active ? 0.5 : 1,
                                  }}
                                  disabled={!val?.active}
                                  onClick={() => {
                                    if (val?.active) {
                                      JSBridge.callPhoneNumber(
                                        `${val?.mobile_number}`,
                                      );
                                    }
                                  }}
                                >
                                  <Mui.IconButton
                                    // href={`tel:${val?.mobile_number}`}
                                    className={css.iconCallFollow}
                                    disabled={!val?.active}
                                  >
                                    <img
                                      src={phoneOut}
                                      alt="phone"
                                      style={{ width: 15 }}
                                    />
                                    <p className={css.callFollow}>Call</p>
                                  </Mui.IconButton>
                                </div>
                                <div
                                  style={{
                                    width: '33%',
                                    borderRight: '1px solid rgb(229, 229, 229)',
                                    borderLeft: '1px solid rgb(229, 229, 229)',
                                    opacity: !val?.active ? 0.5 : 1,
                                  }}
                                >
                                  <Mui.IconButton
                                    href={`mailto:${val?.email}`}
                                    className={css.iconCallFollow}
                                    disabled={!val?.active}
                                  >
                                    <img
                                      src={emailOut}
                                      alt="phone"
                                      style={{ width: 15 }}
                                    />
                                    <p className={css.callFollow}>Mail</p>
                                  </Mui.IconButton>
                                </div>
                                <div
                                  style={{
                                    width: '33%',
                                    opacity: !val?.active ? 0.5 : 1,
                                  }}
                                >
                                  {val?.bank_detail ? (
                                    <Mui.IconButton
                                      onClick={(event) => {
                                        if (
                                          !userRolesPayments?.Payment
                                            ?.create_payment
                                        ) {
                                          setHavePermission({
                                            open: true,
                                            back: () => {
                                              setHavePermission({
                                                open: false,
                                              });
                                            },
                                          });
                                          return;
                                        }
                                        setAnchorElPay(event?.currentTarget);
                                      }}
                                      className={css.iconCallFollow}
                                      disabled={!val?.active}
                                    >
                                      <p
                                        className={css.callFollow}
                                        style={{ color: '#00A676' }}
                                      >
                                        Pay Now
                                      </p>
                                    </Mui.IconButton>
                                  ) : (
                                    <Mui.IconButton
                                      onClick={() =>
                                        requestBank(
                                          val?.entity_id,
                                          val?.contact_id,
                                        )
                                      }
                                      className={css.iconCallFollow}
                                      disabled={!val?.active}
                                    >
                                      <p className={css.callFollow}>
                                        Request Bank Details
                                      </p>
                                    </Mui.IconButton>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}
                {((click === 'tab1' &&
                  filteredUserState?.filterCustomerData?.length === 0) ||
                  (click === 'tab2' &&
                    filteredUserState?.filterVendorData?.length === 0) ||
                  (click === 'tab3' &&
                    filteredUserState?.filterTeamData?.length === 0)) && (
                  <Mui.Typography align="center">
                    {loading ? 'Data is being fetched' : 'No Data Found'}
                  </Mui.Typography>
                )}
                {click === 'tab1' && (
                  <Mui.Button
                    variant="contained"
                    className={css.button}
                    onClick={() => {
                      if (!userRolesPeople?.Customers?.create_customers) {
                        setHavePermission({
                          open: true,
                          back: () => {
                            setHavePermission({ open: false });
                          },
                        });
                        return;
                      }
                      setEditValue({ value: {}, type: '', show: 'new' });
                      setDrawer((prev) => ({
                        ...prev,
                        customerDrawer: true,
                      }));
                    }}
                  >
                    <Mui.Typography className={css.buttonTxt}>
                      add a new customer
                    </Mui.Typography>
                  </Mui.Button>
                )}
                {click === 'tab2' && (
                  <Mui.Button
                    variant="contained"
                    className={css.button}
                    onClick={() => {
                      if (!userRolesPeople?.Vendors?.create_vendors) {
                        setHavePermission({
                          open: true,
                          back: () => {
                            setHavePermission({ open: false });
                          },
                        });
                        return;
                      }
                      setDrawer((prev) => ({
                        ...prev,
                        vendorDrawer: true,
                      }));
                      setEditValue({
                        value: {},
                        type: 'vendor',
                        show: 'new',
                      });
                    }}
                  >
                    <Mui.Typography className={css.buttonTxt}>
                      add a new vendor
                    </Mui.Typography>
                  </Mui.Button>
                )}
                {click === 'tab3' && (
                  <Mui.Button
                    variant="contained"
                    className={css.button}
                    onClick={() => {
                      if (!userRolesPeople?.Employees?.create_employees) {
                        setHavePermission({
                          open: true,
                          back: () => {
                            setHavePermission({ open: false });
                          },
                        });
                        return;
                      }
                      setEditValue({ value: {}, type: '', show: 'new' });
                      setDrawer((prev) => ({
                        ...prev,
                        teamDrawer: true,
                      }));
                    }}
                  >
                    <Mui.Typography className={css.buttonTxt}>
                      add a new Employee
                    </Mui.Typography>
                  </Mui.Button>
                )}
              </Mui.Stack>
            </>
          )) || (
            <div style={{ width: '100%' }}>
              {' '}
              <div
                style={{ padding: '5px 0', margin: '1rem' }}
                className={css.headerContainer}
              >
                <p className={css.headerLabelForEdit}>
                  {editValue?.value?.name}
                </p>
              </div>
              {(click === 'tab1' || click === 'tab2') && (
                <InvoiceCustomer
                  showValue={editValue?.value}
                  handleBottomSheet={() => {
                    setEditForm(false);
                    setEditValue({ value: {}, type: '', show: 'new' });
                    setSearchQuery('');
                    if (click === 'tab1') {
                      fetchCustomerApi();
                    }
                    if (click === 'tab2') {
                      fetchVendor();
                    }
                  }}
                  type={click === 'tab1' ? 'customers' : 'vendors'}
                />
              )}
              {click === 'tab3' && (
                <TeamBottomSheet
                  sheetType={editValue.show}
                  showData={editValue?.value}
                  handleBottomSheetClose={() => setEditForm(false)}
                  deactivate={() => confirmUser('delete', true)}
                  listCall={() => fetchTeamApi()}
                />
              )}
            </div>
          ))}

        {deviceDetect === 'desktop' && (
          <>
            <div style={{ padding: '0', height: '100%' }}>
              <Mui.Stack spacing={2} className={css.ptContainer}>
                <Mui.Stack
                  direction="row"
                  mb="-5px"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Mui.Stack direction="row">
                    <Mui.Box
                      sx={{
                        width: '16vw',
                        background:
                          click === 'tab1'
                            ? '#FFF'
                            : 'linear-gradient(0deg, #f08b3233, #f08b3233), #FFFFFF',
                        height: '61px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '15px 0px 0 0',
                        cursor: 'pointer',
                        margin: '0 5px 0 0px',
                      }}
                      onClick={() => {
                        TabChange('tab1');
                      }}
                    >
                      <Mui.Typography className={css.headText}>
                        Customers
                      </Mui.Typography>
                    </Mui.Box>
                    <Mui.Box
                      sx={{
                        width: '16vw',
                        background:
                          click === 'tab2'
                            ? '#FFF'
                            : 'linear-gradient(0deg, #f08b3233, #f08b3233), #FFFFFF',
                        height: '61px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '5px 5px 0 0',
                        cursor: 'pointer',
                        margin: '0 5px',
                      }}
                      onClick={() => {
                        TabChange('tab2');
                      }}
                    >
                      <Mui.Typography className={css.headText}>
                        Vendors
                      </Mui.Typography>
                    </Mui.Box>
                    <Mui.Box
                      sx={{
                        width: '16vw',
                        background:
                          click === 'tab3'
                            ? '#FFF'
                            : 'linear-gradient(0deg, #f08b3233, #f08b3233), #FFFFFF',
                        height: '61px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '5px 5px 0 0',
                        cursor: 'pointer',
                        margin: '0 5px',
                      }}
                      onClick={() => {
                        TabChange('tab3');
                      }}
                    >
                      <Mui.Typography className={css.headText}>
                        Employees
                      </Mui.Typography>
                    </Mui.Box>
                  </Mui.Stack>
                  <Mui.Button
                    variant="contained"
                    className={css.uploadButton}
                    disableTouchRipple
                    disableFocusRipple
                    onClick={() => {
                      if (click === 'tab1') {
                        if (!userRolesPeople?.Customers?.create_customers) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        navigate(`/invoice-upload`, {
                          state: {
                            from: 'people',
                            choose: click,
                            thisFor: 'customers',
                          },
                        });
                      }
                      if (click === 'tab2') {
                        if (!userRolesPeople?.Vendors?.create_vendors) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        navigate(`/invoice-upload`, {
                          state: {
                            from: 'people',
                            choose: click,
                            thisFor: 'vendors',
                          },
                        });
                      }
                      if (click === 'tab3') {
                        if (!userRolesPeople?.Employees?.create_employees) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        navigate(`/invoice-upload`, {
                          state: {
                            from: 'people',
                            choose: click,
                            thisFor: 'team',
                          },
                        });
                      }
                    }}
                  >
                    {click === 'tab1' && 'Upload Customer Details'}
                    {click === 'tab2' && 'Upload Vendor Details'}
                    {click === 'tab3' && 'Upload List'}
                  </Mui.Button>
                </Mui.Stack>
                <Mui.Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  className={css.mtSearchSort}
                >
                  <div style={{ display: 'flex', width: '75%' }}>
                    <div
                      className={css.searchFilter}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0px 0px 40px rgba(48, 73, 191, 0.05)',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        height: 'auto',
                        width: '40%',
                        padding: '8px',
                        border: '0.8px solid #D0D0D0',
                      }}
                    >
                      <SearchIcon style={{ color: '#af9d9d' }} />{' '}
                      <input
                        placeholder="Search"
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                        value={searchQuery}
                        className={css.textFieldFocus}
                        style={{
                          border: 'none',
                          overflow: 'auto',
                          fontSize: '15px',
                          width: '100%',
                        }}
                      />
                    </div>
                  </div>
                  <Mui.Button
                    variant="contained"
                    component="label"
                    className={css.orangeConatined}
                    disableElevation
                    disableTouchRipple
                    onClick={() => {
                      if (click === 'tab1') {
                        if (!userRolesPeople?.Customers?.create_customers) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        setDrawer((prev) => ({
                          ...prev,
                          customerDrawer: true,
                        }));
                        setEditValue({ value: {}, type: '', show: 'new' });
                      }
                      if (click === 'tab2') {
                        if (!userRolesPeople?.Vendors?.create_vendors) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        setDrawer((prev) => ({ ...prev, vendorDrawer: true }));
                        setEditValue({ value: {}, type: '', show: 'new' });
                      }
                      if (click === 'tab3') {
                        if (!userRolesPeople?.Employees?.create_employees) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        setEditValue({ value: {}, type: '', show: 'new' });
                        setDrawer((prev) => ({ ...prev, teamDrawer: true }));
                      }
                    }}
                  >
                    Add a new{' '}
                    {click === 'tab1'
                      ? 'Customer'
                      : (click === 'tab2' && 'Vendor') || 'Employee'}
                  </Mui.Button>
                </Mui.Stack>
                {click === 'tab1' ? (
                  <Mui.Box
                    sx={{
                      height: '100%',
                      width: '100%',
                      marginTop: '8px !important',
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
                      rows={
                        filteredUserState?.filterCustomerData
                          ? filteredUserState?.filterCustomerData
                          : []
                      }
                      columns={columns}
                      density="compact"
                      getRowHeight={() => 'auto'}
                      rowHeight={60}
                      disableColumnReorder
                      hideFooter
                      disableSelectionOnClick
                      disableColumnResize
                      disableColumnMenu
                      onCellClick={(params) => {
                        if (!userRolesPeople?.Customers?.view_customers) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        if (params?.field === 'short_name') {
                          if (params?.row?.active) {
                            userView(params?.row);
                          } else if (!params?.row?.active) {
                            openSnackBar({
                              message: `Customer is disabled`,
                              type: MESSAGE_TYPE.WARNING,
                            });
                          }
                        }
                      }}
                      components={{
                        ColumnMenu: CustomColumnMenu,
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
                        border: 'none',
                        '& .MuiDataGrid-columnHeaderTitle': {
                          whiteSpace: 'break-spaces',
                          textAlign: 'center',
                          lineHeight: '20px',
                          fontFamily: 'Lexend !important',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#989898',
                        },
                        '& .MuiDataGrid-row': {
                          borderTop: '4px solid #f2f2f2',
                          borderBottom: '4px solid #f2f2f2',
                        },
                      }}
                    />
                  </Mui.Box>
                ) : (
                  ''
                )}

                {click === 'tab2' ? (
                  <Mui.Box
                    sx={{
                      height: '100%',
                      width: '100%',
                      marginTop: '8px !important',
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
                      rows={
                        filteredUserState?.filterVendorData
                          ? filteredUserState?.filterVendorData
                          : []
                      }
                      columns={columns}
                      density="compact"
                      getRowHeight={() => 'auto'}
                      rowHeight={60}
                      disableColumnReorder
                      hideFooter
                      disableSelectionOnClick
                      disableColumnFilter
                      disableColumnResize
                      disableColumnMenu
                      onCellClick={(params) => {
                        if (!userRolesPeople?.Vendors?.view_vendors) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        if (params?.field === 'short_name') {
                          if (params?.row?.active) {
                            userView(params?.row);
                          } else if (!params?.row?.active) {
                            openSnackBar({
                              message: `Vendor is disabled`,
                              type: MESSAGE_TYPE.WARNING,
                            });
                          }
                        }
                      }}
                      components={{
                        ColumnMenu: CustomColumnMenu,
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
                        border: 'none',
                        '& .MuiDataGrid-columnHeaderTitle': {
                          whiteSpace: 'break-spaces',
                          textAlign: 'center',
                          lineHeight: '20px',
                          fontFamily: 'Lexend !important',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#989898',
                        },
                        '& .MuiDataGrid-row': {
                          borderTop: '4px solid #f2f2f2',
                          borderBottom: '4px solid #f2f2f2',
                        },
                      }}
                    />
                  </Mui.Box>
                ) : (
                  ''
                )}

                {click === 'tab3' ? (
                  <Mui.Box
                    sx={{
                      height: '100%',
                      width: '100%',
                      marginTop: '8px !important',
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
                      rows={
                        filteredUserState?.filterTeamData
                          ? filteredUserState?.filterTeamData
                          : []
                      }
                      columns={teamColumns}
                      density="compact"
                      getRowHeight={() => 'auto'}
                      rowHeight={60}
                      disableColumnReorder
                      hideFooter
                      disableSelectionOnClick
                      disableColumnFilter
                      disableColumnResize
                      disableColumnMenu
                      onCellClick={(params) => {
                        if (!userRolesPeople?.Employees?.view_employees) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        if (params?.field === 'name') {
                          if (params?.row?.active) {
                            teamView(params?.row);
                          } else if (!params?.row?.active) {
                            openSnackBar({
                              message: 'Member is disabled',
                              type: MESSAGE_TYPE.WARNING,
                            });
                          }
                        }
                      }}
                      components={{
                        ColumnMenu: CustomColumnMenu,
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
                        border: 'none',
                        '& .MuiDataGrid-columnHeaderTitle': {
                          whiteSpace: 'break-spaces',
                          textAlign: 'center',
                          lineHeight: '20px',
                          fontFamily: 'Lexend !important',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#989898',
                        },
                        '& .MuiDataGrid-row': {
                          borderTop: '4px solid #f2f2f2',
                          borderBottom: '4px solid #f2f2f2',
                        },
                      }}
                    />
                  </Mui.Box>
                ) : (
                  ''
                )}
              </Mui.Stack>
            </div>
          </>
        )}
        <SelectBottomSheet
          name="customer"
          triggerComponent={<></>}
          open={drawer?.customerDrawer}
          onTrigger={() => {
            setDrawer((prev) => ({ ...prev, customerDrawer: true }));
          }}
          onClose={() => {
            handleBottomSheetCloseDrawer('customerDrawer');
            setEditValue({ value: {}, type: '', show: 'new' });
          }}
          addNewSheet
        >
          {editValue?.show === 'new' && (
            <CreateCustomerDialogNew
              addCusomerComplete={() => {
                fetchCustomerApi();
                handleBottomSheetCloseDrawer('customerDrawer');
                setEditValue({ value: {}, type: '', show: 'new' });
                setSearchQuery('');
              }}
              handleBottomSheet={() => {
                handleBottomSheetCloseDrawer('customerDrawer');
                setEditValue({ value: {}, type: '', show: 'new' });
                setSearchQuery('');
              }}
              showCustomerAvail={(customerAvail) =>
                setShowVendorAvail({
                  customer: customerAvail || false,
                  id: customerAvail?.customer_id || '',
                  name: customerAvail?.customer_name || '',
                  vendor: false,
                })
              }
            />
          )}
          {editValue?.show === 'new' && showVendorAvail?.customer && (
            <div className={css.vendorAvail}>
              {tableDetails?.map((val) => (
                <VendorAvailable
                  handleClick={(fetchValue) => {
                    setMobilePopover({
                      open: false,
                      value: fetchValue,
                    });
                    val?.click(fetchValue);
                  }}
                  id={showVendorAvail?.id}
                  name={val.name}
                  type="customer"
                />
              ))}
            </div>
          )}
          {editValue?.show === 'view' && (
            <div>
              {' '}
              <div
                style={{
                  padding: '5px 0',
                  margin: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                className={css.headerContainer}
              >
                <>
                  <p className={css.headerLabelForEdit}>
                    {editValue?.value?.name}
                  </p>
                </>

                <Mui.IconButton
                  onClick={() => {
                    EditCustomerVendor('customerDrawer');
                  }}
                >
                  <img
                    src={editIcon}
                    style={{ width: 25 }}
                    alt="editYourBills"
                  />
                </Mui.IconButton>
              </div>
              <PeopleUser
                showValue={editValue?.value}
                handleBottomSheet={() => {
                  handleBottomSheetCloseDrawer('customerDrawer');
                  setEditValue({ value: {}, type: '', show: 'new' });
                }}
                type="customer"
                editClick={() => {
                  EditCustomerVendor('customerDrawer');
                }}
              />
            </div>
          )}
          {editValue?.show === 'edit' && (
            <div>
              {' '}
              <div
                style={{ padding: '5px 0', margin: '1rem' }}
                className={css.headerContainer}
              >
                <p className={css.headerLabelForEdit}>
                  {editValue?.value?.name}
                </p>
              </div>
              <InvoiceCustomer
                showValue={editValue?.value}
                handleBottomSheet={() => {
                  handleBottomSheetCloseDrawer('customerDrawer');
                  setEditValue({ value: {}, type: '', show: 'new' });
                  fetchCustomerApi();
                  setSearchQuery('');
                }}
                type="customers"
              />
            </div>
          )}

          {/* // <CustomerDrawers /> */}
        </SelectBottomSheet>
        <SelectBottomSheet
          name="vendor"
          triggerComponent={<></>}
          open={drawer?.vendorDrawer}
          onTrigger={() => {
            setDrawer((prev) => ({ ...prev, vendorDrawer: true }));
          }}
          onClose={() => {
            handleBottomSheetCloseDrawer('vendorDrawer');
            setEditValue({ value: {}, type: '', show: 'new' });
          }}
          addNewSheet
        >
          {deviceDetect === 'mobile' && <Puller />}
          {editValue?.show === 'new' && (
            <AddVendorManual
              addVendorComplete={addVendorComplete}
              onCancel={() => {
                handleBottomSheetCloseDrawer('vendorDrawer');
                setEditValue({ value: {}, type: '', show: 'new' });
                setSearchQuery('');
              }}
              panEnable
              showVendorAvail={(vendorAvailable) =>
                setShowVendorAvail({
                  customer: false,
                  id: vendorAvailable?.vendor_id || '',
                  name: vendorAvailable?.vendor_name || '',
                  vendor: vendorAvailable || false,
                })
              }
            />
          )}
          {editValue?.show === 'new' && showVendorAvail?.vendor && (
            <div className={css.vendorAvail}>
              <p className={css.vendorHead}>
                {showVendorAvail.name} is already a part of your list
              </p>
              {tableDetails?.map((val) => (
                <VendorAvailable
                  handleClick={(fetchValue) => {
                    setMobilePopover({
                      open: false,
                      value: fetchValue,
                    });
                    val?.click(fetchValue);
                  }}
                  id={showVendorAvail?.id}
                  name={val.name}
                  type="vendor"
                />
              ))}
            </div>
          )}
          {editValue?.show === 'view' && (
            <div>
              {' '}
              <div
                style={{
                  padding: '5px 0',
                  margin: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                className={css.headerContainer}
              >
                <>
                  <p className={css.headerLabelForEdit}>
                    {editValue?.value?.name}
                  </p>
                </>
                <Mui.IconButton
                  onClick={() => {
                    EditCustomerVendor('vendorDrawer');
                  }}
                >
                  <img
                    src={editIcon}
                    style={{ width: 25 }}
                    alt="editYourBills"
                  />
                </Mui.IconButton>
              </div>
              <PeopleUser
                showValue={editValue?.value}
                handleBottomSheet={() => {
                  handleBottomSheetCloseDrawer('vendorDrawer');
                  setEditValue({ value: {}, type: '', show: 'new' });
                }}
                type="vendor"
                editClick={() => {
                  EditCustomerVendor('vendorDrawer');
                }}
              />
            </div>
          )}
          {editValue?.show === 'edit' && (
            <div>
              {' '}
              <div
                style={{ padding: '5px 0', margin: '1rem' }}
                className={css.headerContainer}
              >
                <p className={css.headerLabelForEdit}>
                  {editValue?.value?.name}
                </p>
              </div>
              <InvoiceCustomer
                showValue={editValue?.value}
                handleBottomSheet={() => {
                  handleBottomSheetCloseDrawer('vendorDrawer');
                  setEditValue({ value: {}, type: '', show: 'new' });
                  fetchVendor();
                  setSearchQuery('');
                }}
                type="vendors"
              />
            </div>
          )}
        </SelectBottomSheet>
        <SelectBottomSheet
          name="team"
          triggerComponent={<></>}
          open={drawer?.teamDrawer}
          onTrigger={() => {
            setDrawer((prev) => ({ ...prev, teamDrawer: true }));
          }}
          onClose={() => {
            handleBottomSheetCloseDrawer('teamDrawer');
          }}
          addNewSheet
        >
          {deviceDetect === 'mobile' && <Puller />}
          <TeamBottomSheet
            sheetType={editValue.show}
            showData={editValue?.value}
            handleBottomSheetClose={() =>
              handleBottomSheetCloseDrawer('teamDrawer')
            }
            deactivate={() => confirmUser('delete', true)}
            listCall={() => fetchTeamApi()}
            editClick={() => {
              if (deviceDetect === 'mobile') {
                setEditForm(true);
                handleBottomSheetCloseDrawer('teamDrawer');
                setEditValue((prev) => ({ ...prev, show: 'edit' }));
              }
            }}
          />
        </SelectBottomSheet>

        <SelectBottomSheet
          name="sort"
          triggerComponent={<></>}
          open={anchorEl}
          onTrigger={() => {
            setAnchorEl(true);
          }}
          onClose={() => {
            setAnchorEl(false);
          }}
          addNewSheet
        >
          <Puller />
          <div style={{ padding: 20 }}>
            <Mui.FormControl sx={{ width: '100%' }}>
              <div
                style={{ padding: '5px 0', margin: 0 }}
                className={`${css.headerContainer} ${css.sortByCss}`}
              >
                <div>
                  <p className={css.headerLabel}>Sort By</p>
                  <span className={css.headerUnderline} />
                </div>
                <div
                  onClick={() => {
                    setSortMethod({});
                    setAnchorEl(null);
                    // setTimeout(() => {
                    //   if (click === 'tab1') {
                    //     fetchCustomerApi();
                    //   } else if (click === 'tab2') {
                    //     fetchVendor();
                    //   } else if (click === 'tab3') {
                    //     fetchTeamApi();
                    //   }
                    // }, 1000);
                  }}
                >
                  <p style={{ color: '#F08B32', margin: 0 }}>Clear</p>
                </div>
              </div>
              <Mui.RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={(e) => {
                  handleSortClick(e?.target?.value);
                }}
              >
                {sortBy?.map((val) => (
                  <Mui.FormControlLabel
                    value={val.id}
                    control={
                      <Mui.Radio
                        size="small"
                        checked={sortMethod?.id === val?.id}
                        style={{ color: '#f08b32' }}
                      />
                    }
                    label={<p className={css.sortFont}>{val.name}</p>}
                  />
                ))}
              </Mui.RadioGroup>
            </Mui.FormControl>
          </div>
        </SelectBottomSheet>

        <Mui.Popover
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorElPay}
          open={openPay && deviceDetect === 'desktop'}
          onClose={() => setAnchorElPay(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {payList?.map((val) => (
            <Mui.MenuItem
              sx={{ fontSize: 16, cursor: 'pointer', p: 2 }}
              onClick={() => val?.click(mobilePopover?.value)}
            >
              {val.name}
            </Mui.MenuItem>
          ))}
        </Mui.Popover>

        <Mui.Popover
          id="simple-popover"
          open={Boolean(drawer?.tablePopover)}
          anchorEl={drawer?.tablePopover}
          onClose={() => setDrawer((prev) => ({ ...prev, tablePopover: null }))}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {tableDetails
            ?.filter((val) => !val.device && !val?.active)
            .map((val) => (
              <Mui.Typography
                sx={{
                  p: 2,
                  color: val?.color || '#000',
                  cursor: 'pointer',
                  fontSize: 16,
                }}
                onClick={() => {
                  setDrawer((prev) => ({ ...prev, tablePopover: null }));
                  if (val?.click) {
                    val?.click(mobilePopover?.value);
                  }
                }}
              >
                {val?.name}
              </Mui.Typography>
            ))}
        </Mui.Popover>
        <SelectBottomSheet
          name="payList"
          triggerComponent={<></>}
          open={openPay && deviceDetect === 'mobile'}
          onTrigger={() => {
            setAnchorElPay(true);
          }}
          onClose={() => {
            setAnchorElPay(false);
          }}
          addNewSheet
        >
          {deviceDetect === 'mobile' && <Puller />}
          {payList?.map((val) => (
            <Mui.Typography
              sx={{
                p: 2,
                color: val?.color || '#000',
                cursor: 'pointer',
                fontSize: 16,
              }}
              onClick={() => val?.click(mobilePopover?.value)}
            >
              {val.name}
            </Mui.Typography>
          ))}
        </SelectBottomSheet>

        <SelectBottomSheet
          name="mobileSheet"
          triggerComponent={<></>}
          open={mobilePopover?.open}
          onTrigger={() => {
            setMobilePopover((p) => ({ ...p, open: true }));
          }}
          onClose={() => {
            setMobilePopover({ open: false, value: {} });
          }}
          addNewSheet
        >
          {deviceDetect === 'mobile' && <Puller />}
          {tableDetails
            ?.filter((field) => !field?.active)
            ?.map((val) => (
              <Mui.Typography
                sx={{
                  p: 2,
                  color: val?.color || '#000',
                  cursor: 'pointer',
                  fontSize: 16,
                }}
                onClick={() => {
                  setMobilePopover((p) => ({ ...p, open: false }));
                  if (val?.click) {
                    val?.click(mobilePopover?.value);
                  }
                }}
              >
                {val?.name}
              </Mui.Typography>
            ))}
        </SelectBottomSheet>

        <SelectBottomSheet
          name="request"
          triggerComponent={<></>}
          open={deviceDetect === 'mobile' && userConfirm?.open}
          onTrigger={() => {
            setUserConfirm((p) => ({ ...p, open: true }));
          }}
          onClose={() => confirmUser(null, false)}
          addNewSheet
        >
          <Puller />
          <div style={{ margin: '25px 20px' }}>
            {userConfirm?.show === 'delete' && (
              <DeleteRequest
                confirmUser={confirmUser}
                deactivate={deactivate}
              />
            )}
            {userConfirm?.show === 'activate' && (
              <ActivateRequest
                confirmUser={confirmUser}
                activate={activateMember}
              />
            )}
            {userConfirm?.show === 'edit' && (
              <EditRequest
                user={click === 'tab2' ? 'vendor' : 'customer'}
                confirmUser={confirmUser}
              />
            )}
            {userConfirm?.show === 'done' && (
              <DoneRequest confirmUser={confirmUser} />
            )}
          </div>
        </SelectBottomSheet>

        <Mui.Dialog
          PaperProps={{
            elevation: 3,
            style: {
              width:
                (userConfirm?.show === 'delete' && '35%') ||
                (userConfirm?.show === 'done' ? '25%' : '30%'),
              overflow: 'visible',
              borderRadius: 16,
              cursor: 'pointer',
            },
          }}
          open={deviceDetect === 'desktop' && userConfirm?.open}
          onClose={() => confirmUser(null, false)}
        >
          <Mui.DialogContent
            className={css.effortlessOptions2}
            style={{ position: 'relative' }}
          >
            {userConfirm?.show === 'delete' && (
              <DeleteRequest
                confirmUser={confirmUser}
                deactivate={deactivate}
              />
            )}
            {userConfirm?.show === 'activate' && (
              <ActivateRequest
                confirmUser={confirmUser}
                activate={activateMember}
              />
            )}
            {userConfirm?.show === 'edit' && (
              <EditRequest user="customer" confirmUser={confirmUser} />
            )}
            {userConfirm?.show === 'done' && (
              <DoneRequest confirmUser={confirmUser} />
            )}
          </Mui.DialogContent>
        </Mui.Dialog>
        <Mui.Dialog
          open={drawer?.requestPayment}
          onClose={() => handleBottomSheetCloseDrawer('requestPayment')}
        >
          <RequestPayment
            customer_id={mobilePopover?.value?.id}
            setRequestPayment={() =>
              setDrawer((prev) => ({ ...prev, requestPayment: false }))
            }
          />
        </Mui.Dialog>
        <Mui.Dialog
          open={drawer?.requestPaymentVendor}
          onClose={() =>
            setDrawer((prev) => ({ ...prev, requestPaymentVendor: false }))
          }
        >
          <RequestPaymentVendor
            customer_id={mobilePopover?.value?.id}
            setRequestPayment={() =>
              setDrawer((prev) => ({ ...prev, requestPaymentVendor: false }))
            }
          />
        </Mui.Dialog>
        <ReceivablesPopOver
          open={deactivatePop}
          handleClose={() => setDeactivatePop(false)}
          position="center"
        >
          <div style={{ padding: 20 }}>
            <div
              style={{ padding: '5px 0', margin: 0 }}
              className={css.headerContainer}
            >
              <p className={css.headerLabel}>
                {click === 'tab1'
                  ? 'Deactivate Customer'
                  : click === 'tab2'
                  ? 'Deactivate Vendor'
                  : 'Deactivate Member'}
              </p>
              <span className={css.headerUnderline} />
            </div>
            <p>
              Are you sure you want to Deactivate this{' '}
              {mobilePopover?.value?.name}
            </p>
            <div
              style={{
                marginBottom: '10px',
                display: 'flex',
                gap: 20,
                justifyContent: 'flex-end',
              }}
            >
              <Mui.Button
                className={css.peopleActionFollow}
                onClick={() => {
                  setDeactivatePop(false);
                }}
                sx={{
                  borderRadius: '20px !important',
                  padding: '5px 20px',
                }}
              >
                Cancel
              </Mui.Button>
              <Mui.Button
                className={css.peopleActionPay}
                sx={{
                  borderRadius: '20px !important',
                  padding: '5px 20px',
                }}
                onClick={() => {
                  deactivateCuSVen();
                }}
              >
                &nbsp; Yes&nbsp;
              </Mui.Button>
            </div>
          </div>
        </ReceivablesPopOver>

        <ReceivablesPopOver
          open={activatePop}
          handleClose={() => setActivatePop(false)}
          position="center"
        >
          <div style={{ padding: 20 }}>
            <div
              style={{ padding: '5px 0', margin: 0 }}
              className={css.headerContainer}
            >
              <p className={css.headerLabel}>
                {click === 'tab1'
                  ? 'Activate Customer'
                  : click === 'tab2'
                  ? 'Activate Vendor'
                  : 'Activate Member'}
              </p>
              <span className={css.headerUnderline} />
            </div>
            <p>
              Are you sure you want to Activate this{' '}
              {mobilePopover?.value?.name}
            </p>
            <div
              style={{
                marginBottom: '10px',
                display: 'flex',
                gap: 20,
                justifyContent: 'flex-end',
              }}
            >
              <Mui.Button
                className={css.peopleActionFollow}
                onClick={() => {
                  setActivatePop(false);
                }}
                sx={{
                  borderRadius: '20px !important',
                  padding: '5px 20px',
                }}
              >
                Cancel
              </Mui.Button>
              <Mui.Button
                className={css.peopleActionPay}
                sx={{
                  borderRadius: '20px !important',
                  padding: '5px 20px',
                }}
                onClick={() => {
                  activateCuSVen();
                }}
              >
                &nbsp; Yes&nbsp;
              </Mui.Button>
            </div>
          </div>
        </ReceivablesPopOver>
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default People;

const EditRequest = ({ user }) => {
  return (
    <>
      <div className={css.effortlessOptions2}>
        <div
          style={{ padding: '5px 0', margin: 0 }}
          className={css.headerContainer}
        >
          <p className={css.headerLabel}>
            {user === 'customer'
              ? 'Update Customer Details'
              : 'Update Vendor Details'}
          </p>
          <span className={css.headerUnderline} />
        </div>
        <Mui.Stack className={css.optionsWrapper} mt={20}>
          <Mui.Typography
            sx={{ fontWeight: '300' }}
            className={css.deactivateDesc}
          >
            Are you sure that you want to update details related to{' '}
            {valueOf?.name} ?
          </Mui.Typography>
        </Mui.Stack>
        <Mui.Stack
          direction="row"
          justifyContent="space-around"
          className={css.mtmb}
        >
          <Mui.Button
            variant="outLined"
            className={css.outlinedButton}
            onClick={() => {}}
          >
            No
          </Mui.Button>
          <Mui.Button
            variant="contained"
            className={css.containedButton}
            onClick={() => {}}
          >
            Yes
          </Mui.Button>
        </Mui.Stack>
      </div>
    </>
  );
};

const DeleteRequest = ({ confirmUser, deactivate }) => {
  return (
    <>
      <div className={css.effortlessOptions2}>
        <div
          style={{ padding: '5px 0', margin: 0 }}
          className={css.headerContainer}
        >
          <p className={css.headerLabel}>Deactivate this Member</p>
          <span className={css.headerUnderline} />
        </div>
        <Mui.Stack className={css.optionsWrapper}>
          <Mui.Typography
            sx={{ fontWeight: '500' }}
            className={css.deactivateDesc1}
          >
            ARE YOU SURE YOU WANT TO DEACTIVATE THIS MEMBER?{' '}
          </Mui.Typography>
          <Mui.Typography
            sx={{ fontWeight: '300' }}
            className={css.deactivateDesc}
          >
            {' '}
            Please note that terminating this Member will result in the loss of
            data and their expulsion from your Effortless Team.
          </Mui.Typography>
        </Mui.Stack>
        <Mui.Stack
          direction="row"
          justifyContent="space-around"
          className={css.mtmb}
        >
          <Mui.Button
            className={css.buttonCancel}
            onClick={() => confirmUser(null, false)}
          >
            Cancel
          </Mui.Button>
          <Mui.Button
            className={css.buttondeactivate}
            onClick={() => deactivate()}
          >
            Deactivate
          </Mui.Button>
        </Mui.Stack>
      </div>
    </>
  );
};

const ActivateRequest = ({ confirmUser, activate }) => {
  return (
    <>
      <div className={css.effortlessOptions2}>
        <div
          style={{ padding: '5px 0', margin: 0 }}
          className={css.headerContainer}
        >
          <p className={css.headerLabel}>Activate this Member</p>
          <span className={css.headerUnderline} />
        </div>
        <Mui.Stack className={css.optionsWrapper}>
          <Mui.Typography
            sx={{ fontWeight: '500' }}
            className={css.deactivateDesc1}
          >
            ARE YOU SURE YOU WANT TO ACTIVATE THIS MEMBER?{' '}
          </Mui.Typography>
          <Mui.Typography
            sx={{ fontWeight: '300' }}
            className={css.deactivateDesc}
          >
            {' '}
            Please note that terminating this Member will result in the loss of
            data and their expulsion from your Effortless Team.
          </Mui.Typography>
        </Mui.Stack>
        <Mui.Stack
          direction="row"
          justifyContent="space-around"
          className={css.mtmb}
        >
          <Mui.Button
            className={css.buttonCancel}
            onClick={() => confirmUser(null, false)}
          >
            Cancel
          </Mui.Button>
          <Mui.Button
            className={css.buttondeactivate}
            onClick={() => activate()}
          >
            Activate
          </Mui.Button>
        </Mui.Stack>
      </div>
    </>
  );
};

const DoneRequest = ({ confirmUser }) => {
  return (
    <>
      <div className={css.effortlessOptions2}>
        <div
          style={{ padding: '5px 0', margin: 0 }}
          className={css.headerContainer}
        >
          <p className={css.headerLabel}>Pending Approval</p>
          <span className={css.headerUnderline} />
        </div>
        <Mui.Stack className={css.optionsWrapper} mt={10}>
          <Mui.Typography
            sx={{ fontWeight: '300' }}
            className={css.deactivateDesc}
          >
            The Admin has been notified of the changes
            <br />
            implemented and will approve accordingly.
          </Mui.Typography>
        </Mui.Stack>
        <Mui.Stack
          direction="row"
          justifyContent="space-around"
          className={css.mtmb}
        >
          <Mui.Button
            variant="outLined"
            className={css.outlinedButton}
            onClick={() => confirmUser(null, false)}
          >
            Cancel
          </Mui.Button>
          <Mui.Button
            variant="contained"
            className={css.containedButton}
            onClick={() => confirmUser(null, false)}
          >
            Done
          </Mui.Button>
        </Mui.Stack>
      </div>
    </>
  );
};
