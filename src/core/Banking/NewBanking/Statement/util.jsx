import React from 'react';
import { Typography, Menu, styled, alpha, ListItem } from '@mui/material';

import { withStyles } from '@material-ui/core/styles';

import * as css from '../bankingnew.scss';

export const StatusComponent = {
  categorized: (
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <div className={css.active}>
        <div className={css.activeinline} />
      </div>
      <Typography className={css.actstatus}>Categorized</Typography>
    </div>
  ),
  uncategorized: (
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <div className={css.disable}>
        <div className={css.disableinline} />
      </div>
      <Typography className={css.diablestatus}>Uncategorized</Typography>
    </div>
  ),
  suberaccount: (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className={css.fetching}>
        <div className={css.fetchinginline} />
      </div>
      <Typography className={css.fetchingstatus}>
        Pending with SuperAccountant
      </Typography>
    </div>
  ),
};

export const AccountType = {
  CURRENT: (
    <>
      <Typography className={css.current}>CA</Typography>
    </>
  ),
  SAVINGS: (
    <>
      <Typography className={css.savings}>SA</Typography>
    </>
  ),
  CC: (
    <>
      <Typography className={css.corporate}>CC</Typography>
    </>
  ),
  FD: (
    <>
      <Typography className={css.corporate}>FD</Typography>
    </>
  ),
  CASH: (
    <>
      <Typography className={css.cashAccount}>PT</Typography>
    </>
  ),
};

export const AccountTypeMobile = {
  SAVINGS: (
    <>
      <Typography className={css.savingsdropdown}>SA</Typography>
    </>
  ),
  CURRENT: (
    <>
      <Typography className={css.currentdropdown}>CA</Typography>
    </>
  ),
  CC: (
    <>
      <Typography className={css.corporatedropdown}>CC</Typography>
    </>
  ),
  FD: (
    <>
      <Typography className={css.corporatedropdown}>FD</Typography>
    </>
  ),
  CASH: (
    <>
      <Typography className={css.cashaccountdropdown}>PT</Typography>
    </>
  ),
};

export const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme, listwidth }) => ({
  '& .MuiPaper-root': {
    borderRadius: 8,
    marginTop: theme.spacing(1),
    width: listwidth,
    minWidth: 170,
    background: '#FFFFFF',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.2)',
    padding: '6px 0',

    '& .MuiMenu-list': {
      padding: '0',
    },

    '& .MuiMenuItem-root': {
      padding: '8px 12px',
      borderBottom: '0.5px solid #c7c7c7',
      marginBottom: 6,
      fontFamily: "'Lexend', sans-serif !important",
      fontWeight: 300,
      fontSize: '14px',
      lineHeight: '16px',
      color: '#414141',

      '&:last-child': {
        borderBottom: 'none',
        marginBottom: '0px !important',
      },

      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },

    '& .MuiMenuItem-root.Mui-selected': {
      color: '#f08b32 !important',
      background: 'none !important',
    },
  },
}));

export const ListsItem = withStyles({
  root: {
    padding: '0 !important',

    '& .Mui-selected': {
      background: 'none !important',

      '& .MuiListItemText-primary': {
        color: '#F08B32 !important',
      },

      '& .MuiTypography-body1': {
        color: '#F08B32 !important',
      },

      '& .MuiSvgIcon-root': {
        color: '#F08B32 !important',
      },
    },
  },
})(ListItem);

export const DateListItem = [
  'Today',
  'Yesterday',
  'This Week',
  'This Month',
  'This Year',
  'This Quarter',
];

export const TranStatus = (st) => {
  let Status;
  if (st === 'uncategorized') Status = StatusComponent.uncategorized;
  else if (st === 'categorized') Status = StatusComponent.categorized;
  else Status = StatusComponent.suberaccount;
  return Status;
};
