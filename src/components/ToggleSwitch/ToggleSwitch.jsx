import { styled, Switch } from '@material-ui/core';
import React from 'react';

const ToggleSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,

  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-disabled': {
      '& .MuiSwitch-thumb': {
        cursor: 'not-allowed',
        boxSizing: 'border-box',
        color: '#bdbdbd',

        // color: 'rgb(240, 139, 50)',
        width: 21,
        height: 21,
      },

      '& + .MuiSwitch-track': {
        border: '1px solid #bdbdbd !important',

        backgroundColor: 'white',
        opacity: 1,
        // border: 'none',
      },
    },
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        color: '#FFFFFF',
        width: 21,
        height: 21,
      },
      '& + .MuiSwitch-track': {
        backgroundColor: '#F08B32',
        opacity: 1,
        border: 'none',
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      border: '76px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: '#33cf4d',
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    color: '#F08B32',
    width: 21,
    height: 21,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#F2F2F0',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    border: '1px solid #F08B32 !important',
    width: 42,
    height: 24,
  },
}));

export default ToggleSwitch;

export const Toggle = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 28,
  height: 18,
  padding: 0,

  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: '2.5px 2px 2px 2px',
    transitionDuration: '300ms',

    '&.Mui-disabled': {
      '& .MuiSwitch-thumb': {
        cursor: 'not-allowed',
        boxSizing: 'border-box',
        color: '#F08B32',
        width: 12,
        height: 12,
        opacity: 0.5,
      },

      '& + .MuiSwitch-track': {
        border: '1px solid #F08B32 !important',
        backgroundColor: 'white',
        opacity: 0.5,
        // border: 'none',
      },
    },

    '&.Mui-checked': {
      transform: 'translateX(11px)',

      '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        color: '#FFFFFF',
        width: 12,
        height: 12,
      },

      '& + .MuiSwitch-track': {
        backgroundColor: '#F08B32',
        opacity: 1,
        border: 'none',
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },

    '&.Mui-focusVisible .MuiSwitch-thumb': {
      border: '76px solid #fff',
    },

    '&.Mui-disabled .MuiSwitch-thumb': {
      color: '#33cf4d',
    },

    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.3,
    },
  },

  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    color: '#F08B32',
    width: 12,
    height: 12,
  },

  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#FFF',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    border: '1px solid #F08B32 !important',
    width: 28,
    height: 16,
  },
}));
