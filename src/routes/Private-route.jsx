import * as React from 'react';
import * as Router from 'react-router-dom';
import AppContext from '@root/AppContext.jsx';

export function Private({ protect, children }) {
  const { organization } = React.useContext(AppContext);

  const activeToken =
    localStorage.getItem('session_token') !== null &&
    localStorage.getItem('session_token') !== 'null';

  if (protect && !organization?.orgId && activeToken) {
    return (
      <div style={{ width: '100%', height: '100%', background: '#ffff' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '55%',
            transform: 'translate(-50%, -50%)',
            color: '#000',
            fontSize: 30,
            textAlign: 'center',
          }}
        >
          LOADING...
        </div>
      </div>
    );
  }
  if (Boolean(activeToken) && !protect) {
    return <Router.Navigate to="/dashboard" />;
  }
  if (Boolean(!activeToken) && protect) {
    return <Router.Navigate to="/" />;
    // return <Router.Navigate to="/companydata" />;
  }
  if (
    (Boolean(activeToken) && protect) ||
    (Boolean(!activeToken) && !protect)
  ) {
    return <>{children}</>;
  }

  // return <Router.Navigate to="/" />;
}
