/* @flow */
/**
 * @fileoverview App launch component
 */

import React, { useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';

import actionCable from 'actioncable';
// import {
//   useMediaQuery,
//   useTheme,
// } from '@mui/material';
import { closeSnackbar } from '@action/Store/Reducers/Errors/Errors';
import { GetGeneralState } from '@action/Store/Reducers/General/GeneralState';
import CircularProgress from '@material-ui/core/CircularProgress';
import { BASE_URL } from '@services/RestApi.jsx';
// import NavigationSetup from '@root/NavigationSetup.jsx';
import AppContext from '@root/AppContext.jsx';
import AppReducer from '@root/AppReducer.jsx';
import AppActions from '@root/AppActions.jsx';
import SnackBarContainer from '@components/SnackBarContainer/SnackBarContainer.jsx';
import AppSidePanel from '@components/AppSidePanel/AppSidePanel.jsx';
import * as Router from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import * as css from '@root/App.scss';
import { LicenseInfo } from '@mui/x-license-pro';
import IdleTimer from './IdleTimer';
import CommonRoute from './routes/Route';

const INITIAL_STATE = {
  user: null,
  viewType: 'signIn',
  organization: null,
  loading: false,
  snackBar: {},
  registeredListeners: {},
  editRole: {},
  selectedOrg: 'all',
  cable: actionCable.createConsumer(
    `wss://${BASE_URL.split('//')[1].split('/')[0]}/cable`,
  ),
};

Sentry.init({
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
      ),
    }),
  ],
  tracesSampleRate: 1.0,
});

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(CommonRoute);

// LicenseInfo.setLicenseKey(
//   'e8185c84beb4956b5b6eb26765b7b0a1Tz01NDk0NixFPTE3MDA5MDAyNzQwNDQsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=',
// );
LicenseInfo.setLicenseKey(
  '02577d4c7cbe17bb16fcfa5c63aef42bTz02NjA3NyxFPTE3MTUyNjc1NjE4MTYsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y',
);

const App = () => {
  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);
  const [amt, setAmt] = React.useState({});
  const [categorize, setCategorize] = React.useState({});
  const [indexHeading, setIndexHeading] = React.useState({});
  const [dates, setDates] = React.useState({ status: false });
  const [logo, setLogo] = React.useState('');
  const [transactionType, setTransactionType] = React.useState('IMPS');
  const [transactionTypeList, setTransactionTypeList] = React.useState([]);
  const [connect, setConnect] = React.useState(false);
  const [invoiceCounts, setInvoiceCounts] = React.useState({});
  const [estimateName, setEstimateName] = React.useState();
  const [userPermissions, setUserPermission] = React.useState({});
  const [globalSearch, setGlobalSearch] = React.useState('');
  const [openPanelContext, setOpenPanelContext] = React.useState(undefined);

  // TODO - Move to AppActions.jsx

  const currentValue = {
    ...state,
    user: state.user,
    ...AppActions(dispatch),
    setAmt,
    amt,
    categorize,
    setCategorize,
    indexHeading,
    setIndexHeading,
    dates,
    setDates,
    logo,
    setLogo,
    transactionType,
    setTransactionType,
    connect,
    setConnect,
    transactionTypeList,
    setTransactionTypeList,
    invoiceCounts,
    setInvoiceCounts,
    userPermissions,
    setUserPermission,
    globalSearch,
    setGlobalSearch,
    openPanelContext,
    setOpenPanelContext,
    setEstimateName,
    estimateName,
  };

  const { snackBar, closeSnackBar } = currentValue;
  const callIdleTimer = () => IdleTimer({ timeout: 900 });

  const { open, message, type, loading } = useSelector((value) => value.Errors);
  const { invoiceDashboardState } = useSelector((value) => value.Invoice);
  const { GetEstimateNameState } = useSelector(
    (value) => value.AdditionalInvoiceSettings,
  );

  React.useEffect(() => {
    if (Object.keys(invoiceDashboardState || {})?.length > 0) {
      setInvoiceCounts(invoiceDashboardState?.invoice_action);
    }
  }, [invoiceDashboardState]);

  React.useEffect(() => {
    if (Object.keys(GetEstimateNameState || {})?.length > 0) {
      setEstimateName(GetEstimateNameState?.estimate_name);
    }
  }, [GetEstimateNameState]);

  const dispatch_ = useDispatch();

  const AccessToken = localStorage.getItem('session_token');
  React.useEffect(() => {
    if (AccessToken !== null && AccessToken !== 'null') {
      dispatch_(GetGeneralState());
    }
  }, [dispatch_, AccessToken]);
  return (
    // Todo
    // Transfer it to react Route module
    <Router.BrowserRouter>
      <AppContext.Provider value={currentValue}>
        {state.loading && (
          <div className={css.loadingContainer}>
            <CircularProgress className={css.loader} />
            <span>{state?.loadingText}</span>
          </div>
        )}
        {loading.open && (
          <div className={css.loadingContainer}>
            <CircularProgress className={css.loader} />
            <span>{loading?.loadingText}</span>
          </div>
        )}
        {/* {NavigationSetup.map((n) => {
        const Component = n.view;

        if (n.id === state.viewType) {
          return <Component key={`${n.id}`} />;
        }
        return <></>;
      })} */}
        {localStorage.getItem('session_token') !== null &&
          localStorage.getItem('session_token') !== 'null' && <AppSidePanel />}

        <Helmet>
          <script
            type="application/javascript"
            src="https://polyfill.io/v3/polyfill.min.js?features=ResizeObserver"
          />
          <script
            src="https://www.paynimo.com/paynimocheckout/client/lib/jquery.min.js"
            type="text/javascript"
          />
          <script
            type="text/javascript"
            src="https://www.paynimo.com/paynimocheckout/server/lib/checkout.js"
          />

          <script
            type="text/javascript"
            src="https://cdn.yodlee.com/fastlink/v4/initialize.js"
          />
          <script
            src="https://checkout.razorpay.com/v1/checkout.js"
            type="text/javascript"
          />
        </Helmet>

        <GoogleOAuthProvider clientId="948981309308-7fgus5h35p1ftajdfmbmk74o3nnod6oe.apps.googleusercontent.com">
          <SentryRoutes>
            <CommonRoute />
          </SentryRoutes>
        </GoogleOAuthProvider>

        {open && (
          <SnackBarContainer
            open={open}
            message={message}
            type={type}
            handleClose={() => dispatch_(closeSnackbar())}
          />
        )}
        {snackBar.open && (
          <SnackBarContainer
            open={snackBar.open}
            message={snackBar.message}
            type={snackBar.type}
            handleClose={() => closeSnackBar()}
          />
        )}

        {/* {!desktopView && callIdleTimer()} */}
        {callIdleTimer()}
      </AppContext.Provider>
    </Router.BrowserRouter>
  );
};

export default App;
