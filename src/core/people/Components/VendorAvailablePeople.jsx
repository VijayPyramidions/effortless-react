import React from 'react';
import Typography from '@mui/material/Typography';
import AppContext from '@root/AppContext.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import * as css from '../people.scss';

const VendorAvailable = ({ name, handleClick, id, type }) => {
  const { organization, user, enableLoading, openSnackBar } =
    React.useContext(AppContext);

  const fetchCustomerApi = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/entities/${id}?type=${type}&location=all`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          handleClick(res);
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

  return (
    <Typography className={css.text} onClick={() => fetchCustomerApi()}>
      {name}
    </Typography>
  );
};
export default VendorAvailable;
