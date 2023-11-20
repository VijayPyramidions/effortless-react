/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-lonely-if */

import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isMobile, isDesktop } from 'react-device-detect';
import { googleLogout } from '@react-oauth/google';
import OnBackEventHandle from '@core/OnBackEventHandle';
import { useDispatch, useSelector } from 'react-redux';
import { resetMakepaymentState } from '@action/Store/Reducers/Payments/MakePaymentState';
import { capitalizeFirstLetter } from '@components/utils';

import {
  Stack,
  Avatar,
  Box,
  Popper,
  Fade,
  Typography,
  Dialog,
  useMediaQuery,
  useTheme,
  Divider,
  Grid,
} from '@mui/material';
import { withStyles, Drawer } from '@material-ui/core';
import { makeStyles, styled } from '@material-ui/core/styles';

import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import RestApi, { METHOD } from '@services/RestApi';

import { GetEWayBillState } from '@action/Store/Reducers/Settings/EWayBillSettingsState';

import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import AppContext from '@root/AppContext';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import AddNewCompany from '@core/LoginContainer/AddNewCompany';
import JSBridge from '@nativeBridge/jsbridge';

import Dashboard from '@assets/AppSideBar/dashboard.svg';
import DashboardActive from '@assets/AppSideBar/dashboardActive.svg';

import Invoice from '@assets/AppSideBar/invoice.svg';
import InvoiceActive from '@assets/AppSideBar/invoiceActive.svg';

import Receivables from '@assets/AppSideBar/receivables.svg';
import ReceivablesActive from '@assets/AppSideBar/receivablesActive.svg';

import Payable from '@assets/AppSideBar/payables.svg';
import PayableActive from '@assets/AppSideBar/payablesActive.svg';

import Expenses from '@assets/AppSideBar/expense.svg';
import ExpensesActive from '@assets/AppSideBar/expenseActive.svg';

import Payment from '@assets/AppSideBar/payments.svg';
import PaymentActive from '@assets/AppSideBar/paymentsActive.svg';

import Banking from '@assets/AppSideBar/banking.svg';
import BankingActive from '@assets/AppSideBar/bankingActive.svg';

import Funding from '@assets/AppSideBar/funding.svg';
import FundingActive from '@assets/AppSideBar/fundingActive.svg';

import PayRoll from '@assets/AppSideBar/payroll.svg';
import PayRollActive from '@assets/AppSideBar/payrollActive.svg';

import Compliance from '@assets/AppSideBar/compliance.svg';
import ComplianceActive from '@assets/AppSideBar/complianceActive.svg';

import Profile from '@assets/AppSideBar/profile.svg';
import ProfileActive from '@assets/AppSideBar/profileActive.svg';

import Report from '@assets/AppSideBar/report.svg';
import ReportActive from '@assets/AppSideBar/reportActive.svg';

import Settings from '@assets/AppSideBar/settings.svg';
import SettingsActive from '@assets/AppSideBar/settingsActive.svg';

import Logout from '@assets/AppSideBar/Logout.svg';

import effortlessLogo from '@assets/lnefflogo.png';
import closeLogo from '@assets/closeLogo.png';

import NavButton from './NavButton';
import SubMenu from './SubMenu';
import SubNavButton from './SubNavButton';

import * as css from './AppSidePanel.scss';

const StyledDialog = withStyles({
  root: {
    '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
      borderRadius: '16px',
    },
  },
})(Dialog);

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const drawerStyles2 = makeStyles(() => ({
  paper: {
    borderTopRightRadius: 20,
    width: '%',
  },
}));

const AppSidePanel = () => {
  const {
    invoiceCounts,
    currentUserInfo,
    openSidePanel,
    toggleSidePanel,
    setUserPermission,
    setSessionToken,
    setUserInfo,
    user,
    validateSession,
    getCurrentUser,
    organization,
    logo,
    addOrganization,
    addOrgId,
    changeSubView,
    changeView,
    openSnackBar,
    enableLoading,
    setOpenPanelContext,
    setActiveInvoiceId,
    NotificationOrganization,
    setCurrentUserInfo,
    estimateName,
    userPermissions,
  } = useContext(AppContext);

  const { EWayBillStateAppSidePanel } = useSelector(
    (value) => value.EWayBillSettings,
  );

  const { pathname } = useLocation();
  const classes2 = drawerStyles2();

  const themes = useTheme();
  const panelResposive = useMediaQuery(themes.breakpoints.up('md'));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [panelOpen, setPanelOpen] = useState(false);

  const [activeMenu, setActiveMenu] = useState('');
  const [activeSubMenu, setActiveSubMenu] = useState('');
  const [openSubMenu, setOpenSubMenu] = useState('');

  const [subItems, setSubItems] = useState({});

  const [anchorEl, setAnchorEl] = useState(null);
  const [subAnchorEl, setSubAnchorEl] = useState(null);

  const [anchorElForOrganization, setAnchorElForOrganization] = useState(null);
  const [anchorElForNewOrganization, setAnchorElForNewOrganization] =
    useState(null);
  const [openProgress, setOpenProgress] = useState(false);

  const [roleAccess, setRoleAccess] = useState({});
  const [havePermission, setHavePermission] = useState({ open: false });

  const [NavItemPermissions, setNavItemPermissions] = useState([]);

  const handleMousePrevious = () => setAnchorEl(subAnchorEl);
  const hanldOpen = () => setPanelOpen((prev) => !prev);

  const navItem = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      path: '/dashboard',
      activeIcon: DashboardActive,
      icon: Dashboard,
    },
    {
      id: 'invoice',
      name: 'Invoice',
      path: '/invoice',
      activeIcon: InvoiceActive,
      icon: Invoice,
      access: 'Invoicing',
      subFolders: [
        {
          id: 'invoice-new',
          name: 'Create Invoice',
          path: '/invoice-new',
          parent: 'invoice',
          access: 'Invoicing',
        },
        {
          id: 'invoice-estimate',
          name: `Create ${capitalizeFirstLetter(estimateName)}`,
          path: 'invoice-estimate',
          parent: 'invoice',
          access: 'Invoicing',
        },

        {
          id: 'invoice-draft',
          name: `Drafts (${invoiceCounts?.draft_count || 0})`,
          path: '/invoice-draft',
          parent: 'invoice',
          access: 'Invoicing',
        },
        {
          id: 'invoice-unapproved',
          name: `Unapproved (${invoiceCounts?.unapproved_count || 0})`,
          path: '/invoice-unapproved',
          parent: 'invoice',
          access: 'Invoicing',
        },
        {
          id: 'invoice-approved',
          name: `Approved (${invoiceCounts?.approved_count || 0})`,
          path: '/invoice-approved',
          parent: 'invoice',
          access: 'Invoicing',
        },

        {
          id: 'invoice-recurring',
          name: `Contracts (${invoiceCounts?.recurring_invoices_count || 0})`,
          path: 'invoice-recurring',
          parent: 'invoice',
          access: 'Invoicing',
        },
        {
          id: 'invoice-upload',
          name: 'Bulk Upload',
          path: '/invoice-upload',
          parent: 'invoice',
          access: 'Invoicing',
          mobile: false,
        },
        {
          id: 'invoice-e-waybill',
          name: 'E-Way Bills',
          path: '/invoice-e-waybill',
          parent: 'invoice',
          access: 'Invoicing',
          hideWithCondition: !EWayBillStateAppSidePanel?.enable_e_way_billing,
        },
      ],
    },
    {
      id: 'receivables',
      name: 'Receivables',
      path: '/receivables',
      activeIcon: ReceivablesActive,
      icon: Receivables,
      access: 'Receivables',
      subFolders: [
        {
          id: 'receivables-ageing',
          name: 'Ageing ',
          path: '/receivables-ageing',
          parent: 'receivables',
          access: 'Receivables',
        },
        {
          id: 'receivables-schedule',
          name: 'Schedule',
          path: '/receivables-schedule',
          parent: 'receivables',
          access: 'Receivables',
        },
      ],
    },
    {
      id: 'payables',
      name: 'Payables',
      path: '/payables',
      activeIcon: PayableActive,
      icon: Payable,
      access: 'Payables',
      subFolders: [
        {
          id: 'payables-ageing',
          name: 'Ageing',
          path: '/payables-ageing',
          parent: 'payables',
          access: 'Payables',
        },
      ],
    },
    {
      id: 'bill',
      name: 'Expenses',
      path: '/bill',
      activeIcon: ExpensesActive,
      icon: Expenses,
      access: 'Expense',
      subFolders: [
        {
          id: 'bill-upload',
          name: 'Record an Expense',
          path: '/bill-upload',
          parent: 'bill',
          access: 'Expense',
        },
        // {
        //   id: 'bill-yourbills',
        //   name: 'Your bills',
        //   path: '/bill-yourbills',
        //   parent: 'bill',
        //   access: 'Expense',
        // },
        {
          id: 'bill-utility',
          name: 'Setup utility bills',
          path: '/bill-utility',
          parent: 'bill',
          access: 'Expense',
        },
        {
          id: 'bill-box',
          name: 'Bill Box',
          path: '/bill-box',
          parent: 'bill',
          access: 'Expense',
        },
        {
          id: 'bill-journal',
          name: 'Other Journal',
          path: '/bill-journal',
          parent: 'bill',
          access: 'Expense',
          mobile: false,
        },
        {
          id: 'bill-salary',
          name: 'Salary Cost',
          path: '/bill-salary',
          parent: 'bill',
          access: 'Expense',
          mobile: false,
        },
        // {
        //   id: 'bill-queue',
        //   name: 'Bills In Queue',
        //   path: '/bill-queue',
        //   parent: 'bill',
        //   access: 'Expense',
        // },
      ],
    },
    {
      id: 'reimbursement',
      name: 'Reimbursement',
      path: '/reimbursement',
      activeIcon: PaymentActive,
      icon: Payment,
      // access: 'Payments',
    },
    {
      id: 'payment',
      name: 'Payments',
      path: '/payment',
      activeIcon: PaymentActive,
      icon: Payment,
      access: 'Payments',
    },
    {
      id: 'banking',
      name: 'Banking',
      path: '/banking',
      activeIcon: BankingActive,
      icon: Banking,
      access: 'Banking',
    },
    {
      id: 'people',
      name: 'People',
      path: '/people',
      activeIcon: ProfileActive,
      icon: Profile,
      access: 'People',
    },
    {
      id: 'report',
      name: 'Report',
      path: '/report',
      activeIcon: ReportActive,
      icon: Report,
      mobile: false,
    },
    {
      id: 'integration',
      name: 'Integration',
      path: '/integration-tally',
      activeIcon: ReportActive,
      icon: Report,
      mobile: false,
      // active: true,
      subFolders: [
        {
          id: 'integration-tally',
          name: 'Tally',
          path: '/integration-tally',
          parent: 'integration',
          // access: 'integration',
          // active: true,
        },
        {
          id: 'Zoho',
          name: 'Zoho Book',
          // path: '/integration-zoho',
          path: '',
          parent: 'integration',
          feature: true,
          // access: 'integration',
          // active: true,
        },
      ],
    },
    {
      id: 'funding',
      name: 'Funding',
      path: '',
      feature: true,
      activeIcon: FundingActive,
      icon: Funding,
    },
    {
      id: 'payroll',
      name: 'Pay Roll',
      path: '',
      feature: true,
      activeIcon: PayRollActive,
      icon: PayRoll,
    },
    {
      id: 'compliance',
      name: 'Compliance',
      path: '',
      feature: true,
      activeIcon: ComplianceActive,
      icon: Compliance,
    },
    {
      id: 'profile',
      name: 'Profile',
      path: '',
      feature: true,
      activeIcon: ProfileActive,
      icon: Profile,
    },
    {
      id: 'settings',
      name: 'Settings',
      path: '/settings',
      activeIcon: SettingsActive,
      icon: Settings,
      access: 'Settings',
      subFolders:
        currentUserInfo?.role === 'Founder'
          ? [
              {
                id: 'settings-companydata',
                name: 'Set Up Company Data',
                path: '/settings-companydata',
                parent: 'settings',
                access: 'Settings',
                state: { from: 'from-settings-menu' },
                mobile: false,
              },
              {
                id: 'settings-invoiceSettings',
                name: 'Invoice Settings',
                path: '/settings-invoiceSettings',
                parent: 'settings',
                access: 'Settings',
              },
              {
                id: 'settings-ExpenseSettings',
                name: 'Expense Settings',
                path: '/settings-ExpenseSettings',
                parent: 'settings',
                access: 'Settings',
              },
              {
                id: 'settings-AccountSettings',
                name: 'Account Settings',
                path: '/settings-AccountSettings',
                parent: 'settings',
                access: 'Settings',
              },
              {
                id: 'settings-reminderSettings',
                name: 'Reminder Settings',
                path: '/settings-reminderSettings',
                parent: 'settings',
                access: 'Settings',
              },
              {
                id: 'settings-receivables',
                name: 'Receivables Settings',
                path: '/settings-receivables',
                parent: 'settings',
                access: 'Settings',
              },
              {
                id: 'settings-reimbursement-policy',
                name: 'Reimbursement Settings',
                path: '/settings-reimbursement-policy',
                parent: 'settings',
                access: 'Settings',
              },
              {
                id: 'settings-teamSettings',
                name: 'Team Settings',
                path: '/settings-teamSettings',
                parent: 'settings',
                access: 'Settings',
                mobile: false,
              },
              {
                id: 'settings-activity',
                name: 'Activity Log',
                path: '/settings-activity',
                parent: 'settings',
                access: 'Settings',
                mobile: false,
              },
            ]
          : [
              {
                id: 'settings-companydata',
                name: 'Set Up Company Data',
                path: '/settings-companydata',
                parent: 'settings',
                access: 'Settings',
                state: { from: 'from-settings-menu' },
                mobile: false,
              },
              {
                id: 'settings-invoiceSettings',
                name: 'Invoice Settings',
                path: '/settings-invoiceSettings',
                parent: 'settings',
                access: 'Settings',
              },
              {
                id: 'settings-ExpenseSettings',
                name: 'Expense Settings',
                path: '/settings-ExpenseSettings',
                parent: 'settings',
                access: 'Settings',
              },
              {
                id: 'settings-AccountSettings',
                name: 'Account Settings',
                path: '/settings-AccountSettings',
                parent: 'settings',
                access: 'Settings',
              },
              {
                id: 'settings-reminderSettings',
                name: 'Reminder Settings',
                path: '/settings-reminderSettings',
                parent: 'settings',
                access: 'Settings',
              },
              {
                id: 'settings-receivables',
                name: 'Receivables Settings',
                path: '/settings-receivables',
                parent: 'settings',
                access: 'Settings',
              },
              // {
              //   id: 'settings-reimbursement-policy',
              //   name: 'Reimbursement Settings',
              //   path: '/settings-reimbursement-policy',
              //   parent: 'settings',
              //   access: 'Settings',
              // },
              {
                id: 'settings-teamSettings',
                name: 'Team Settings',
                path: '/settings-teamSettings',
                parent: 'settings',
                access: 'Settings',
                mobile: false,
              },
              {
                id: 'settings-activity',
                name: 'Activity Log',
                path: '/settings-activity',
                parent: 'settings',
                access: 'Settings',
                mobile: false,
              },
            ],
    },
    {
      id: 'support',
      name: 'Support',
      path: '/support',
      activeIcon: SettingsActive,
      icon: Settings,
    },
    {
      id: 'logout',
      name: 'Logout',
      path: 'logout',
      activeIcon: SettingsActive,
      icon: Logout,
      mobile: true,
    },
  ];

  const handleMouseOver = (data) => (event) => {
    setSubItems(data);
    setSubAnchorEl(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  const handleMouseOut = () => setAnchorEl(null);

  const LogoutFunction = async () => {
    await RestApi(`sessions/logout`, {
      method: METHOD.DELETE,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setNavItemPermissions([]);
          setUserInfo({ userInfo: null });
          setSessionToken({ activeToken: null });
          setCurrentUserInfo({ currentUserInfo: {} });
        } else if (res.error) {
          openSnackBar({
            message: res?.error || res?.message || 'Something Went Wrong',
            type: MESSAGE_TYPE.INFO,
          });
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const handleClick = async (e, item) => {
    if (item?.feature) {
      e.preventDefault();
      setOpenProgress(true);
      return;
    }

    if (item.path === 'logout') {
      e.preventDefault();

      addOrgId({ orgId: null });
      JSBridge.logoutNative();
      googleLogout();
      toggleSidePanel();
      localStorage.removeItem('user_info');
      localStorage.removeItem('current_user_info');
      localStorage.removeItem('session_token');
      localStorage.removeItem('selected_organization');
      localStorage.removeItem('PageWithParams');
      changeView('signIn');
      changeSubView('');
      await LogoutFunction();
      navigate('/');

      return;
    }

    const tempAccess =
      item.access === '' || item.access === undefined
        ? false
        : !roleAccess[item.access];

    if (tempAccess) {
      e.preventDefault();

      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }

    setActiveMenu(item.id);
    setOpenSubMenu(item.id !== openSubMenu ? item.id : '');
    setActiveSubMenu('');

    if (isMobile) toggleSidePanel();
  };

  const handleSubMenuClick = (e, item) => {
    if (item?.feature) {
      e.preventDefault();
      setOpenProgress(true);
      return;
    }
    const tempAccess =
      item.access === '' || item.access === undefined
        ? false
        : !roleAccess[item.access];
    if (
      tempAccess ||
      (item?.name === 'Reimbursement Settings' &&
        !userPermissions?.[item.access]?.['Reimbursement Policy']
          ?.view_reimbursement_policy)
    ) {
      e.preventDefault();

      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      if (panelOpen) {
        setAnchorEl(null);
        setSubAnchorEl(null);
      }
      return;
    }

    setActiveSubMenu(item.id);
    setActiveMenu(item.parent);

    if (item?.id === 'invoice-new' || item?.id === 'invoice-estimate') {
      setActiveInvoiceId({
        activeInvoiceId: '',
      });
    }

    if (item.id === 'settings-companydata') {
      e.preventDefault();
      navigate(item.path, { state: { from: 'from-settings-menu' } });
    }

    if (panelOpen) {
      setAnchorEl(null);
      setSubAnchorEl(null);
      setOpenSubMenu(item.parent);
    }
    if (isMobile) toggleSidePanel();
  };

  useEffect(() => {
    const paths = pathname?.slice(1)?.split('-');

    if (paths[0] !== activeMenu) {
      setActiveMenu(paths[0]);
      setOpenSubMenu(paths[0]);
      setActiveSubMenu(pathname.slice(1));
    } else if (pathname?.slice(1) !== activeSubMenu) {
      setActiveMenu(paths[0]);
      setOpenSubMenu(paths[0]);
      setActiveSubMenu(pathname.slice(1));
    }
    if (NavItemPermissions?.length > 0) {
      const navPath = NavItemPermissions?.filter(
        (ele) => ele?.path === pathname,
      )[0];
      if (Object.keys(navPath || {})?.length > 0) {
        if (navPath?.path === pathname && navPath?.active) {
          navigate(pathname);
        } else {
          navigate(NavItemPermissions?.find((ele) => ele.active)?.path);
        }
      }
    }
  }, [pathname, panelOpen, NavItemPermissions]);

  useEffect(() => {
    const accessToken = localStorage.getItem('session_token');
    const userInfo = JSON.parse(localStorage.getItem('user_info')) || user;
    const organizationProps = JSON.parse(
      localStorage.getItem('selected_organization'),
    );
    if (organizationProps) {
      validateSession(accessToken, organizationProps);
    } else {
      if (accessToken && accessToken !== 'null') validateSession(accessToken);
    }
    if (accessToken && accessToken !== 'null')
      setSessionToken({ activeToken: accessToken });
    if (userInfo) setUserInfo({ userInfo });
    return () => {
      setNavItemPermissions([]);
    };
  }, []);

  useEffect(() => {
    if (isDesktop) localStorage.setItem('device_detect', 'desktop');
    else localStorage.setItem('device_detect', 'mobile');
  }, [isDesktop]);

  useEffect(() => {
    if (currentUserInfo?.permissions?.length > 0) {
      const temp = currentUserInfo?.permissions?.reduce((obj, item) => {
        obj[item.name] = item.active;
        return obj;
      }, {});
      setRoleAccess(temp);
      const tempModule = [
        {
          name: 'Dashboard',
          type: ['Insights'],
        },
        {
          name: 'Invoicing',
          type: [
            'Tax Invoice',
            'Contract',
            'Estimate',
            'Custom Fields',
            'Signatures',
            'Email Subject & Body',
          ],
        },
        {
          name: 'Receivables',
          type: [
            'Dashboard',
            'Customer Ageing',
            'Customer Relationships',
            'Customer Analytics',
          ],
        },
        {
          name: 'Banking',
          type: [
            'Connecting a Bank',
            'Effortless Virtual Account',
            'Categorizing Transactions',
            'ICICI Connected Banking',
          ],
        },
        {
          name: 'Payables',
          type: [
            'Dashboard',
            'Vendor Ageing',
            'Vendor Relationships',
            'Vendor Analytics',
          ],
        },
        {
          name: 'Expense',
          type: ['Bill Booking', 'Connect via Gmail'],
        },
        {
          name: 'Reimbursement',
          type: ['Policy', 'Reimbursement Claims', 'Payment Request'],
        },
        {
          name: 'Payments',
          type: ['Payment', 'Transaction Password', 'Payments History'],
        },
        {
          name: 'People',
          type: ['Customers', 'Vendors', 'Employees'],
        },
        {
          name: 'Reports',
          type: ['Financials'],
        },
        {
          name: 'Settings',
          type: [
            'Company Details',
            'Razorpay Setup',
            'Manage Account Settings',
            'Team Settings',
            'Reimbursement Policy',
          ],
        },
      ];

      tempModule?.map((value) => {
        const tempName = value.name;
        const tempMain = value.type;
        const tempRoles = currentUserInfo?.permissions?.find(
          (val) => val?.name === tempName,
        );

        let mainState = [];
        mainState = tempMain.map((ele) =>
          tempRoles?.groups?.find((filter) => filter?.name === ele),
        );
        setUserPermission((prev) => ({
          ...prev,
          [tempName]: {
            ...prev?.[tempName],
            [tempRoles?.name]: tempRoles?.active,
          },
        }));
        mainState?.map((ele) =>
          ele?.permissions?.map((role) =>
            setUserPermission((prev) => ({
              ...prev,
              [tempName]: {
                ...prev?.[tempName],
                [ele?.name]: {
                  ...prev?.[tempName]?.[ele?.name],
                  [role?.name]: role?.active,
                },
              },
            })),
          ),
        );
        return value;
      });
    }
    document.cookie = `eff_user_id=${currentUserInfo?.id};domain=.goeffortless.co; secure; sameSite=none`;
    if (isMobile && currentUserInfo?.id) JSBridge.currentUserData();
  }, [currentUserInfo?.permissions]);

  useEffect(() => {
    if (organization?.orgId) {
      getCurrentUser(organization.orgId);
    }
    dispatch(GetEWayBillState());
  }, [organization?.orgId]);

  useEffect(() => {
    if (!panelResposive && isDesktop) setPanelOpen(true);
    else setPanelOpen(false);
  }, [panelResposive]);

  useEffect(() => {
    setOpenPanelContext(panelOpen);
  }, [panelOpen]);

  useEffect(() => {
    if (
      currentUserInfo?.modules?.length > 0 ||
      Object.keys(invoiceCounts || {})?.length > 0 ||
      estimateName
    ) {
      const updatedNavitems = navItem;
      updatedNavitems.forEach((item) => {
        currentUserInfo?.modules?.forEach((val) => {
          if (item.id === val?.module_id) {
            item.active = val?.active;
          }
        });
      });
      setNavItemPermissions(updatedNavitems);
      // navigate(updatedNavitems?.find(ele => ele.active)?.path);
    }
  }, [currentUserInfo?.modules, invoiceCounts, estimateName]);

  return (
    <>
      <Drawer
        open={openSidePanel}
        onClose={toggleSidePanel}
        className={
          isDesktop && !panelOpen
            ? `${css.sideBarContainer}`
            : `${css.sideBarContainer} ${isDesktop && css.panelClose} ${
                isMobile && css.mobile
              }`
        }
        classes={isDesktop ? '' : classes2}
        variant={isDesktop ? 'permanent' : 'temporary'}
        PaperProps={{
          className: isDesktop && css.paperRoot,
        }}
      >
        {isDesktop ? (
          <>
            <Stack className={css.panelOpenClose} onClick={hanldOpen}>
              <KeyboardArrowLeftRoundedIcon
                sx={{ margin: 'auto', transition: 'all 0.4s' }}
                className={panelOpen && css.arrowOpen}
              />
            </Stack>
            <Stack
              className={css.efflogoContainer}
              onClick={() => navigate('/dashboard')}
            >
              {!panelOpen ? (
                <Avatar
                  src={effortlessLogo}
                  alt="efflogo"
                  sx={{
                    width: '131px',
                    height: '24px',
                    borderRadius: 'initial',
                    margin: 'auto',
                    '& img': {
                      objectFit: 'scale-down',
                    },
                  }}
                />
              ) : (
                <Avatar
                  src={closeLogo}
                  alt="efflogo"
                  sx={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'initial',
                    margin: 'auto',
                  }}
                />
              )}
            </Stack>
          </>
        ) : (
          <>
            <Stack
              direction="column"
              className={css.stack}
              onClick={() => {
                navigate('/dashboard');
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                onClick={() => setAnchorElForOrganization(true)}
              >
                <Stack
                  style={{
                    width: '60px',
                    height: '60px',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar
                    sx={{
                      borderRadius: '50%',
                      width: '40px',
                      border: logo && '1px solid #DADADA',
                      padding: logo && '1px',

                      '& .MuiAvatar-img': {
                        width: '100%',
                        borderRadius: logo && '50%',
                      },
                    }}
                    src={
                      logo ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${organization?.name}&chars=2`
                    }
                  />
                </Stack>
                {isDesktop ? (
                  <Typography className={css.effortlessName}>
                    {organization?.name}
                  </Typography>
                ) : (
                  <>
                    <Stack className={css.widthName}>
                      <Typography className={css.effortlessNameMobile}>
                        {organization?.name}
                      </Typography>
                      <Typography className={css.effortlessNameMobile}>
                        {user?.userName}
                      </Typography>
                    </Stack>
                    <Stack className={css.switchCompany}>
                      <KeyboardArrowUpIcon
                        style={{ color: 'white' }}
                        className={isMobile ? css.imgcss3Mobile : css.imgcss3}
                      />
                      <KeyboardArrowDownIcon
                        style={{ color: 'white' }}
                        className={isMobile ? css.imgcss3Mobile : css.imgcss3}
                      />
                    </Stack>
                  </>
                )}
              </Stack>
            </Stack>
            <Divider sx={{ marginBottom: '16px' }} />
          </>
        )}

        <nav
          className={!panelOpen ? css.navbar : `${css.navbar} ${css.collapse}`}
        >
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            className={css.poperContent}
            transition
            placement="right-start"
            onMouseOver={handleMousePrevious}
            onMouseLeave={handleMouseOut}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Box
                  className={`${css.poperContentWrapper} ${
                    subItems.name === 'Settings' && css.arrowbottom
                  }`}
                >
                  <Typography className={css.popmenuname}>
                    {subItems.name}
                  </Typography>
                  {subItems?.subFolders.map((subItem) => (
                    <SubNavButton
                      item={subItem}
                      activeSubMenu={activeSubMenu}
                      handleClick={handleSubMenuClick}
                    />
                  ))}
                </Box>
              </Fade>
            )}
          </Popper>

          {NavItemPermissions?.map((item) => (
            <>
              {isMobile ? (
                <>
                  {!item.subFolders &&
                    (item.mobile === undefined || item.mobile === true) &&
                    item?.active && (
                      <NavButton
                        item={item}
                        panelOpen={panelOpen}
                        activeMenu={activeMenu}
                        handleClick={handleClick}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      />
                    )}
                </>
              ) : (
                <>
                  {!item.subFolders && item.mobile !== true && item?.active && (
                    <NavButton
                      item={item}
                      panelOpen={panelOpen}
                      activeMenu={activeMenu}
                      handleClick={handleClick}
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    />
                  )}
                </>
              )}
              {isMobile ? (
                <>
                  {item.subFolders &&
                    (item.mobile === undefined || item.mobile === true) &&
                    item?.active && (
                      <>
                        <NavButton
                          item={item}
                          panelOpen={panelOpen}
                          activeMenu={activeMenu}
                          openSubMenu={openSubMenu}
                          handleClick={handleClick}
                          hanldeArrowClick={(rowId) =>
                            setOpenSubMenu(rowId !== openSubMenu ? rowId : '')
                          }
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        />
                        <SubMenu
                          item={item}
                          panelOpen={panelOpen}
                          openSubMenu={openSubMenu}
                          activeSubMenu={activeSubMenu}
                          handleClick={handleSubMenuClick}
                          isMobile={isMobile}
                        />
                      </>
                    )}
                </>
              ) : (
                <>
                  {item.subFolders && item?.active && (
                    <>
                      <NavButton
                        item={item}
                        panelOpen={panelOpen}
                        activeMenu={activeMenu}
                        openSubMenu={openSubMenu}
                        handleClick={handleClick}
                        hanldeArrowClick={(rowId) =>
                          setOpenSubMenu(rowId !== openSubMenu ? rowId : '')
                        }
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      />
                      <SubMenu
                        item={item}
                        panelOpen={panelOpen}
                        openSubMenu={openSubMenu}
                        activeSubMenu={activeSubMenu}
                        handleClick={handleSubMenuClick}
                        isMobile={isMobile}
                      />
                    </>
                  )}
                </>
              )}
            </>
          ))}
        </nav>

        <StyledDialog
          open={Boolean(openProgress)}
          onClose={() => setOpenProgress(false)}
          sx={{ borderRadius: '40px !important' }}
        >
          <Stack style={{ padding: '1rem' }}>
            <Typography variant="h6">Whoa!</Typography>
            <Typography>This feature is coming soon!</Typography>
          </Stack>
        </StyledDialog>
      </Drawer>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}

      <SelectBottomSheet
        open={anchorElForOrganization && isMobile}
        onClose={() => setAnchorElForOrganization(null)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <div className={css.effortlessOptions}>
          <Puller />
          <p className={css.heading}>Switch Company</p>
          <ul
            className={css.optionsWrapper}
            style={{
              overflow: 'auto',
              minHeight: 'auto',
              maxHeight: '20rem',
            }}
          >
            {user &&
              user?.userInfo?.data?.map((val) => (
                <div key={`index${val.id}`}>
                  <li aria-hidden="true">
                    <Stack
                      direction="row"
                      onClick={() => {
                        const orgId = val?.id ? val.id : '';
                        const orgName = val?.name ? val.name : '';
                        const shortName = val?.short_name ? val.short_name : '';
                        localStorage.setItem(
                          'selected_organization',
                          JSON.stringify({ orgId, orgName, shortName }),
                        );
                        addOrganization({ orgId, orgName, shortName });
                        NotificationOrganization(val);
                        setAnchorElForOrganization(null);
                        toggleSidePanel();
                        navigate('/');
                        dispatch(resetMakepaymentState());
                      }}
                      className={css.appBarAccountSymbol}
                      p={0}
                      alignItems="center"
                      width="100%"
                    >
                      <Avatar
                        className={
                          organization?.orgId === val?.id
                            ? css.avatarForPopoverSelect
                            : css.avatarForPopover
                        }
                      >
                        <Typography variant="h5">
                          {val?.name?.slice(0, 1)?.toUpperCase()}
                        </Typography>
                      </Avatar>

                      <Grid
                        className={css.items}
                        style={{ fontWeight: 300, color: '#283049' }}
                      >
                        {val?.name}
                      </Grid>
                    </Stack>
                  </li>
                  <hr style={{ border: '1px solid #EDEDED' }} />
                </div>
              ))}
          </ul>
          <Stack
            direction="row"
            onClick={() => {
              setAnchorElForOrganization(null);
              setAnchorElForNewOrganization(true);
            }}
            className={css.appBarAccountSymbolForBottom}
            alignItems="center"
            width="100%"
          >
            <Grid className={css.itemsForBottom}>+Add New Company</Grid>
          </Stack>
        </div>
      </SelectBottomSheet>

      <SelectBottomSheet
        open={anchorElForNewOrganization}
        onClose={() => setAnchorElForNewOrganization(null)}
        triggerComponent={<div style={{ display: 'none' }} />}
        // addNewSheet
      >
        <AddNewCompany
          handleClose={() => {
            setAnchorElForNewOrganization(null);
            toggleSidePanel();
          }}
        />
      </SelectBottomSheet>
      {OnBackEventHandle()}
    </>
  );
};

export default AppSidePanel;
