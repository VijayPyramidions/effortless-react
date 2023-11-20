/* @flow */

/**
 * @fileoverview App main entry point
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// import * as Sentry from '@sentry/react';
// import { BrowserTracing } from '@sentry/tracing';
import store from './StateManagement/Store/store';

import App from './App.jsx';

// Sentry.init({
//   dsn: 'https://1ac5ffa60d0b49828e0158b8f7d11edd@o1215257.ingest.sentry.io/6463195',
//   integrations: [new BrowserTracing()],

//   // We recommend adjusting this value in production, or using tracesSampler
//   // for finer control
//   tracesSampleRate: 1.0,
//   environment: import.meta.env.NODE_ENV,
// });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,

  document.getElementById('root'),
);
