import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Avatar, Box, Grid, Stack, Typography } from '@mui/material';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext';

import Expenses from '../../assets/NotificationIcons/Expenses.svg';
import invoice from '../../assets/NotificationIcons/invoice.svg';
import Banking from '../../assets/NotificationIcons/Banking.svg';
// import Funding from '../../assets/NotificationIcons/Funding.svg';
// import payable from '../../assets/NotificationIcons/payable.svg';
// import Payment from '../../assets/NotificationIcons/Payment.svg';
// import PayRoll from '../../assets/NotificationIcons/PayRoll.svg';
// import People from '../../assets/NotificationIcons/People.svg';
// import Receivables from '../../assets/NotificationIcons/Receivables.svg';
// import Report from '../../assets/NotificationIcons/Report.svg';
// import Settings from '../../assets/NotificationIcons/Settings.svg';

import * as css from './notificationtabs.scss';

const NotificationCard = ({ dataitem, onClose }) => {
  const navigate = useNavigate();
  const { addOrganization, openSnackBar, setLogo, user, getCurrentUser } =
    useContext(AppContext);
  const { data } = JSON.parse(localStorage.getItem('user_info'));

  const notifyDuration = (date) => {
    const notificationDate = moment
      .duration(moment().diff(moment(date)))
      .humanize();
    // console.log(
    //   'dateVal',
    //   moment.duration(moment().diff(moment(date))).humanize()
    // );
    if (notificationDate === 'a few seconds') {
      return `1s`;
    }
    if (notificationDate === 'a day') {
      return `1d`;
    }
    if (notificationDate === 'a month') {
      return `1m`;
    }
    if (notificationDate === 'a year') {
      return `1y`;
    }
    const splitDate = notificationDate.split(' ');
    // console.log(`date data`, `${splitDate[0]}${splitDate[1]?.charAt(0)}`);

    return `${splitDate[0]}${splitDate[1]?.charAt(0)}`;
  };

  const CallLogo = (orgId) => {
    RestApi(`organizations/${orgId}/logos`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        setLogo(res?.data[0]?.image_url);
      })
      .catch(() => {
        console.log('Logo Error');
      });
  };

  const notificationRoute = async () => {
    const orgDetail = data.filter(
      (item) => item.id === dataitem.organization_id,
    );

    if (orgDetail.length === 1) {
      const orgId = orgDetail[0]?.id ? orgDetail[0]?.id : '';
      const orgName = orgDetail[0]?.name ? orgDetail[0]?.name : '';
      const shortName = orgDetail[0]?.short_name;
      localStorage.setItem(
        'selected_organization',
        JSON.stringify({
          orgId,
          orgName,
          shortName,
        }),
      );
      addOrganization({ orgId, orgName, shortName });
      await getCurrentUser(orgId);
      await CallLogo(orgId);
    } else {
      openSnackBar({
        message: 'Organization not found.',
        type: 'error',
      });
      return;
    }

    if (dataitem.notification_type === 'assign_bill_to_super_accountant')
      navigate(`/bill-queue?id=${dataitem.parent_id}`);
    else if (dataitem.notification_type === 'agreement_created')
      navigate(`/invoice-recurring-view?id=${dataitem.parent_id}`);
    else if (dataitem.notification_type === 'categorize_alert')
      navigate(`/banking`);
    if (onClose) onClose();
  };

  const setRouteIcons = () => {
    let icon;
    switch (dataitem.notification_type) {
      case 'assign_bill_to_super_accountant':
        icon = Expenses;
        break;
      case 'agreement_created':
        icon = invoice;
        break;
      case 'categorize_alert':
        icon = Banking;
        break;
      default:
    }
    return icon;
  };
  return (
    <Box
      className={css.notificationcard}
      key={dataitem.id}
      onClick={notificationRoute}
    >
      {Object.keys(dataitem).length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={1.5} md={1.5}>
            <Stack>
              <Avatar src={setRouteIcons()} alt="route icon" />
            </Stack>
          </Grid>
          <Grid item xs={9} md={9.5}>
            <Stack>
              <Typography variant="h3" className={css.notifytitle}>
                {dataitem.subject}
              </Typography>
              <Typography className={css.notifydesc}>
                {dataitem.body}
              </Typography>
              <Stack className={css.notifylinks}>
                {dataitem.category !== 'notification' && (
                  <Typography className={css.actionbtn}>View More</Typography>
                )}
                <Typography className={css.organization}>
                  {dataitem.organization_name}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={1.5} md={1}>
            <Stack>
              <Typography className={css.notifytime}>
                {notifyDuration(dataitem.created_at)}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>No data found.</Typography>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default NotificationCard;
