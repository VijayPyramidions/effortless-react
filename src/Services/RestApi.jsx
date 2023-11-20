/* @flow */
/**
 * @fileoverview Rest Api method
 */
let PLATFORM_DOMAIN;
if (
  window.location.origin === 'https://app.goeffortless.co' ||
  window.location.origin === 'https://i.goeffortless.ai' ||
  window.location.origin === 'https://d11997a5ngzp0a.cloudfront.net'
) {
  PLATFORM_DOMAIN = 'https://api.goeffortless.co/';
} else if (
  window.location.origin === 'https://stagingapp.goeffortless.co' ||
  window.location.origin === 'https://d1kp9cvtayjlrg.cloudfront.net'
) {
  PLATFORM_DOMAIN = 'https://staging.goeffortless.co/';
} else {
  PLATFORM_DOMAIN = 'https://dev.goeffortless.in/';
}

// const PLATFORM_DOMAIN = 'https://api.goeffortless.co/';

// 'https://kirthi.actionboard.xyz/'  'https://staging.goeffortless.co/'; 'https://meili.actionboard.xyz/' 'https://dev.goeffortless.in/';
export const BASE_URL = `${PLATFORM_DOMAIN}api/v1`;
export const METHOD = {
  POST: 'POST',
  GET: 'GET',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

async function RestApi(url, { method, headers, payload = {} }) {
  const defaultHeader = { 'Content-type': 'application/json; charset=UTF-8' };

  let params = {
    method,
    headers: {
      ...defaultHeader,
      ...headers,
    },
  };

  if (method === METHOD.POST || method === METHOD.PATCH) {
    params = {
      ...params,
      body: JSON.stringify(payload),
    };
  }

  const finalUrl = `${BASE_URL}/${url}`;

  return fetch(finalUrl, params).then((res) => {
    if (res?.status === 429) {
      try {
        localStorage.removeItem('user_info');
        localStorage.removeItem('current_user_info');
        localStorage.removeItem('session_token');
        localStorage.removeItem('selected_organization');
        localStorage.removeItem('PageWithParams');
        window.history.pushState('', 'Effortless', '/');
        window.errb('rateLimit');
        return {};
      } catch {
        return {};
      }
    } else if (res?.status !== 401) {
      try {
        return res && res.json ? res.json() : {};
      } catch {
        return {};
      }
    } else if (res?.status === 401) {
      localStorage.removeItem('user_info');
      localStorage.removeItem('current_user_info');
      localStorage.removeItem('session_token');
      localStorage.removeItem('selected_organization');
      localStorage.removeItem('PageWithParams');
      window.history.pushState('', 'Effortless', '/');
      // window.location.reload();
      return {};
    } else {
      return {};
    }
  });
}

export default RestApi;
