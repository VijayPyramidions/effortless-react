import React, { useState } from 'react';
import * as Router from 'react-router-dom';
// import * as css from './Receivables.scss';
import AppContext from '@root/AppContext.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import Dashboard from './Dashboard/Dashboard.jsx';
import Ageing from './Ageing/Ageing.jsx';
import Schedule from './Schedule/Schedule.jsx';

function Receivables() {
  const device = localStorage.getItem('device_detect');

  const [menuSelected, setMenuSelected] = useState('dashboard');
  const { userPermissions } = React.useContext(AppContext);
  const navigate = Router.useNavigate();
  const [userRoles, setUserRoles] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Payables || {})?.length > 0) {
      if (!userPermissions?.Payables?.Payables) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRoles({ ...userPermissions?.Payables });
    }
  }, [userPermissions]);

  React.useEffect(() => {
    if (
      Object.keys(userRoles?.Dashboard || {})?.length > 0 &&
      menuSelected === 'dashboard'
    ) {
      if (!userRoles?.Dashboard?.view_payable_dashboard) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
    } else if (
      Object.keys(userRoles?.['Vendor Ageing'] || {})?.length > 0 &&
      menuSelected === 'ageing'
    ) {
      if (!userRoles?.['Vendor Ageing']?.view_payable_ageing) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/payables');
            setHavePermission({ open: false });
          },
        });
      }
    }
  }, [userRoles?.Dashboard, userRoles?.['Vendor Ageing'], menuSelected]);

  const pathName = window.location.pathname;

  React.useEffect(() => {
    if (pathName === '/payables') {
      setMenuSelected('dashboard');
    } else if (pathName === '/payables-ageing') {
      setMenuSelected('ageing');
    } else if (pathName === '/payables-schedule') {
      setMenuSelected('schedule');
    }
  }, [pathName, device]);

  return (
    <>
      {menuSelected === 'dashboard' && <Dashboard userRoles={userRoles} />}
      {menuSelected === 'ageing' && <Ageing userRoles={userRoles} />}
      {menuSelected === 'schedule' && <Schedule />}
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
}

export default Receivables;
