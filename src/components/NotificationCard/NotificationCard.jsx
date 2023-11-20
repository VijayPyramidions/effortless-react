import React from 'react';
import ActionIcon from '@assets/action-icon.svg';
import { Button, Divider, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as css from './NotificationCard.scss';

const useStyles = makeStyles(() => ({
  buttonRoot: {
    borderRadius: 50,
    color: '#F08B32',
    borderColor: '#F08B32',
    fontSize: '10px',
  },
}));
function NotificationCard({
  subject,
  body,
  showButton,
  setDrawer,
  allData,
  time,
  notificationImage,
}) {
  const classes = useStyles();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div className={css.notificationContainer}>
        <div className={css.imageContainer}>
          <img src={notificationImage.icon} alt={notificationImage.alt} />
        </div>
        <div
          className={css.messageContainer}
          style={{
            flex: 1,
            marginRight: '30px',
            marginLeft: '30px',
          }}
        >
          <div
            style={{
              flexDirection: 'column',
              display: 'flex',
              marginBottom: '20px',
            }}
          >
            <div style={{ marginBottom: '10px', fontSize: '20px' }}>
              {subject}
            </div>
            <div style={{ fontSize: '15px' }}>{body}</div>
          </div>
          {showButton && (
            <Button
              onClick={() => {
                setDrawer('message', allData);
              }}
              variant="outlined"
              classes={{
                root: classes.buttonRoot,
              }}
            >
              View Receipt
            </Button>
          )}
        </div>
        <div
          style={{
            flexDirection: 'column',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '12px' }}>{time}</div>
          <IconButton
            aria-label="action"
            onClick={() => {
              console.log('action');
              setDrawer('notificationMenu', allData);
            }}
          >
            <img src={ActionIcon} alt="ActionIcon" />
          </IconButton>
        </div>
      </div>
      <Divider />
    </div>
  );
}

export default NotificationCard;
