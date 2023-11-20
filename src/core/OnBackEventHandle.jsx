/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

import { useContext, useEffect } from 'react';
import AppContext from '@root/AppContext.jsx';
import JSBridge from '@nativeBridge/jsbridge';
import { useNavigate } from 'react-router-dom';

const OnBackEventHandle = () => {
  const { registerEventListeners, deRegisterEventListener, closeSidePanel } =
    useContext(AppContext);
  const navigate = useNavigate();

  const OnBackMethod = (e) => {
    e.preventDefault();
    console.log('onback', e);
    const pathName = window.location.pathname;
    const state = history?.state?.usr;
    closeSidePanel();
    if (pathName === '/dashboard' || pathName === '/') {
      JSBridge.exitApp();
      return;
    }
    if (pathName === '/receivables-ageing-view') {
      if (state?.from === 'people') {
        navigate('/people', { state: { choose: 'tab1' } });
      } else {
        navigate('/receivables');
      }
    } else if (pathName === '/receivables-ageing') {
      // if (state?.from === 'people') {
      // navigate('/people', { state: { choose: 'tab1' } });
      // } else {
      navigate('/receivables');
      // }
    } else if (pathName === '/people-invoice-new') {
      if (state?.from === 'people') {
        navigate('/people', { state: { choose: 'tab1' } });
      } else {
        navigate('/people');
      }
    } else if (pathName === '/bill-yourbills' || pathName === '/bill-upload') {
      if (state?.people) {
        navigate('/people', { state: { choose: state?.people?.from } });
      } else {
        navigate('/bill');
      }
    } else if (pathName === '/payables-ageing-view') {
      if (state?.fromVendorSelection) {
        navigate(state?.path, { state: state?.backState });
      } else {
        navigate('payables');
      }
    } else if (
      pathName === '/payment-makepayment' ||
      pathName === '/payment-advancepayments'
    ) {
      if (state?.fromVendorSelection) {
        navigate(state?.fromVendorSelection?.path, {
          state: state?.fromVendorSelection?.backState,
        });
      } else {
        navigate('/payment');
      }
    } else if (pathName?.includes('/invoice-upload')) {
      if (state?.from === 'people') {
        navigate('/people', { state: { choose: state?.choose } });
      } else {
        navigate('/invoice');
      }
    } else if (pathName?.includes('/invoice-new-pdf')) {
      navigate('/invoice-new', { state: { from: 'pdf' } });
    } else if (pathName?.includes('/invoice-new')) {
      navigate('/invoice');
    } else if (pathName?.includes('/invoice-estimate-pdf')) {
      navigate('/invoice-estimate', { state: { from: 'pdf' } });
    } else if (pathName?.includes('/invoice-estimate')) {
      navigate('/invoice');
    } else if (pathName?.includes('invoice-draft-pdf')) {
      navigate('/invoice-draft');
    } else if (pathName?.includes('/invoice-draft-new')) {
      navigate('/invoice-draft');
    } else if (pathName?.includes('/invoice-draft')) {
      navigate('/invoice');
    } else if (pathName?.includes('/invoice-unapproved-pdf')) {
      navigate('/invoice-unapproved', { state: { from: 'pdf' } });
    } else if (pathName?.includes('/invoice-approved-pdf')) {
      navigate('/invoice-approved', { state: { from: 'pdf' } });
    } else if (pathName?.includes('/invoice')) {
      navigate('/dashboard');
    } else if (pathName?.includes('/people')) {
      navigate('/dashboard');
    } else if (pathName?.includes('/receivables')) {
      navigate('/dashboard');
    } else if (pathName?.includes('/payables')) {
      navigate('/dashboard');
    } else if (pathName?.includes('/bill')) {
      navigate('/dashboard');
    } else if (pathName?.includes('/payment')) {
      navigate('/dashboard');
    } else if (pathName?.includes('/banking')) {
      navigate('/dashboard');
    } else if (pathName?.includes('/settings')) {
      navigate('/dashboard');
    } else if (pathName?.includes('/support')) {
      navigate('/dashboard');
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    registerEventListeners({ name: 'navigateBack', method: OnBackMethod });
    // registerEventListeners({ name: 'onBackButtonPressed', method: OnBackMethod });
    // registerEventListeners({ name: 'navigateBack', method: OnBackMethod });
    return () => {
      deRegisterEventListener({
        name: 'navigateBack',
        method: OnBackMethod,
      });
      //   // deRegisterEventListener({
      //   //   name: 'onBackButtonPressed',
      //   //   method: OnBackMethod,
      //   // });
      //   // deRegisterEventListener({
      //   //   name: 'navigateBack',
      //   //   method: OnBackMethod,
      //   // });
    };
  }, []);
  return null;
};
export default OnBackEventHandle;
