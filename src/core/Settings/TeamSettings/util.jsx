import { makeStyles } from '@material-ui/core/styles';

// export const RolesMenuState = [
//   { name: 'Invoicing', value: true },
//   { name: 'Bill Booking', value: true },
//   { name: 'Payments', value: false },
//   { name: 'Receivables', value: true },
//   { name: 'Payables', value: true },
//   { name: 'People', value: false },
//   { name: 'Settings', value: true },
// ];

export const AccordionState = {
  Dashboard:true,
  Invoicing: true,
  Expense: true,
  Banking: true,
  Payments: true,
  Receivables: true,
  Payables: true,
  Settings: true,
  People: true,
  Reimbursement: true,
  Reports:true
};

export const useStyles = makeStyles({
  root: {
    width: '80px',
    height: '32px',
    padding: '0px',
    marginRight: '24px',
  },
  switchBase: {
    color: '#D9D9D9',
    padding: '4px',
    margin: '0 4px',
    '&$checked': {
      '& + $track': {
        background: '#F08B32',
        '&:before': {
          display: 'block',
        },
        '&:after': {
          display: 'none',
        },
      },
    },
  },
  thumb: {
    color: '#FFFFFF',
    width: '24px',
    height: '24px',
  },
  track: {
    background: '#D9D9D9',
    borderRadius: '50px',
    opacity: '1 !important',
    '&:after, &:before': {
      fontSize: '16px',
      position: 'absolute',
      top: '6px',
      fontFamily: 'Lexend',
      fontWeight: 500,
      lineHeight: '20px',
    },
    '&:before': {
      content: "'ON'",
      left: '8px',
      display: 'none',
      color: '#FFFFFF',
    },
    '&:after': {
      content: "'OFF'",
      right: '8px',
    },
  },
  checked: {
    transform: 'translateX(40px) !important',
  },
  align: {
    alignItems: 'center',
  },
  table: {
    '& .MuiTableCell-root': {
      borderTop: '1px solid #E5E5E5',
      borderBottom: 'none',

      '&:not(:first-child)': {
        borderLeft: '1px solid #E5E5E5',
      },
    },
  },
  accdetails: {
    '& .MuiAccordionSummary-root': {
      minHeight: '55px',
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      margin: '12px 0',
    },
    '& .MuiAccordionSummary-root.Mui-expanded': {
      height: '55px',
      minHeight: '55px',
    },
  },
  chckroot: {
    alignItems: 'center',
    '& .MuiCheckbox-root:not(.Mui-checked)': {
      color: '#FFFFFF !important',
      border: '1px solid #E5E5E5',
      borderRadius: '2px',
      width: '16px',
      height: '16px',
      margin: '3px',

      '&:hover': {
        background: '#FFFFFF',
      },

      '& .MuiSvgIcon-root': {
        display: 'none',
      },
    },
    '& .MuiCheckbox-colorSecondary.Mui-checked': {
      color: '#F08B32 !important',
    },
    '& .MuiCheckbox-root.Mui-disabled': {
      background: 'rgba(203, 213, 225, 0.5)',
      border: '1px solid rgba(203, 213, 225, 0.5)',
      cursor: 'not-allowed',
    },
  },
  selectFieldRoot: {
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    width: '275px',

    '& .MuiSelect-select': {
      padding: '9px 12px !important',
      fontFamily: "'Lexend',sans-serif",
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      color: '#F08B32',
    },
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
    // },
  },
});
