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
  const { userPermissions } = React.useContext(AppContext);
  const navigate = Router.useNavigate();

  const [menuSelected, setMenuSelected] = useState('');
  const [userRoles, setUserRoles] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Receivables || {})?.length > 0) {
      if (!userPermissions?.Receivables?.Receivables) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRoles({ ...userPermissions?.Receivables });
    }
  }, [userPermissions]);

  React.useEffect(() => {
    if (
      Object.keys(userRoles?.Dashboard || {})?.length > 0 &&
      menuSelected === 'dashboard'
    ) {
      if (!userRoles?.Dashboard?.view_receivables_dashboard) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
    } else if (
      Object.keys(userRoles?.['Customer Ageing'] || {})?.length > 0 &&
      menuSelected === 'ageing'
    ) {
      if (!userRoles?.['Customer Ageing']?.view_receivable_ageing) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/receivables');
            setHavePermission({ open: false });
          },
        });
      }
    }
  }, [userRoles?.Dashboard, userRoles?.['Customer Ageing'], menuSelected]);

  const pathName = window.location.pathname;

  React.useEffect(() => {
    if (pathName === '/receivables') {
      setMenuSelected('dashboard');
    } else if (pathName === '/receivables-ageing') {
      setMenuSelected('ageing');
    } else if (pathName === '/receivables-schedule') {
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
