/* eslint-disable no-nested-ternary */
import axios from 'axios';

import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import { openSnackbar } from '../Store/Reducers/Errors/Errors';
import store from '../Store/store';

const baseURL =
  // 'http://localhost:3000/api/v1/';
  window.location.origin === 'https://app.goeffortless.co' ||
  window.location.origin === 'https://i.goeffortless.ai' ||
  window.location.origin === 'https://d11997a5ngzp0a.cloudfront.net'
    ? import.meta.APP_PROD_URL
    : window.location.origin === 'https://stagingapp.goeffortless.co' ||
      window.location.origin === 'https://d1kp9cvtayjlrg.cloudfront.net'
    ? import.meta.APP_STAG_URL
    : import.meta.APP_DEV_URL;

const headers = {
  'Content-type': 'application/json; charset=UTF-8',
};

const Message = [
  'No vendor bank details is present',
  'Sync started.',
  'OTP invalid!',
  'The given answer is incorrect',
  'Entity bank details is not present at the moment',
  // 'Bank user details is incorrect.',
];

export const BASE_URL = baseURL;

const axiosInst = axios.create({
  baseURL,
  headers,
});

axiosInst.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('session_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInst.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      const { data, status } = error.response;

      if (status === 401 || status === 429) {
        localStorage.removeItem('user_info');
        localStorage.removeItem('current_user_info');
        localStorage.removeItem('session_token');
        localStorage.removeItem('selected_organization');
        localStorage.removeItem('PageWithParams');
        window.history.pushState('', 'Effortless', '/');
        if (status === 429) window.errb('rateLimit');
      }

      store.dispatch(
        openSnackbar({
          message:
            data?.message ||
            Object.values(data?.errors)?.join(',') ||
            data ||
            'something went wrong!',
          type: MESSAGE_TYPE.ERROR,
        }),
      );

      if (Message.includes(data.message)) return Promise.reject(error);
    } else
      store.dispatch(
        openSnackbar({
          message: error?.message || 'something went wrong!',
          type: MESSAGE_TYPE.ERROR,
        }),
      );

    return null;
  },
);

export default axiosInst;
