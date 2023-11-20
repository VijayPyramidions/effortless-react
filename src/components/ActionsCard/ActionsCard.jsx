import React from 'react';
import ActionIcon from '@assets/action-icon.svg';
import { Button, Divider, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as css from './ActionsCard.scss';

const useStyles = makeStyles(() => ({
  buttonRoot: {
    borderRadius: 50,
    color: '#F08B32',
    borderColor: '#F08B32',
    fontSize: '10px',
  },
}));
function ActionsCard({
  subject,
  body,
  setDrawer,
  allData,
  time,
  initial,
  buttonText,
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
          <h4 className={css.avatar}>{initial}</h4>
        </div>
        <div className={css.messageContainer}>
          <div className={css.subjectBodyWrapper}>
            <div className={css.subject}>{subject}</div>
            <div className={css.body}>{body}</div>
          </div>
          <Button
            onClick={() => {
              setDrawer('invoice', allData);
            }}
            variant="outlined"
            classes={{
              root: classes.buttonRoot,
            }}
          >
            {buttonText}
          </Button>
        </div>
        <div className={css.timeActionWrapper}>
          <div className={css.time}>{time}</div>
          <IconButton
            aria-label="action"
            onClick={() => {
              console.log('action');
              setDrawer('actionMenu', allData);
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

export default ActionsCard;
