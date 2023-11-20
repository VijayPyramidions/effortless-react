import React, { useContext } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AppContext from '@root/AppContext.jsx';
import Checkbox from '@material-ui/core/Checkbox';
// import * as themes from '@root/theme.scss';
import * as css from '../../Receivables/Dashboard/Dashboard.scss';
// import TableComponent from '../../../components/Table/Table';

const useStyles = makeStyles(() => ({
  buttons: {
    backgroundColor: '#F08B32',
    color: 'white',
    fontFamily: 'Arial',
    borderRadius: '25px',
    opacity: '1',
    // fontSize: '3vw',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  tableContainer: {
    boxShadow: 'none',
    border: '1px solid var(--colorDashboardTableBorder)',
    borderRadius: '8px',
  },
  thead: {
    '& tr:first-child th': {
      borderTop: '0px',
      textTransform: 'uppercase',
      fontSize: '10px',
    },
    '& tr:first-child th:first-child': { borderLeft: '0px' },
    '& tr:first-child th:last-child': { borderRight: '0px' },
    '& th': {
      background: 'var(--colorDashboardTableHeaderBg)',
      paddingLeft: '7vw',
      paddingRight: '7vw',
      fontWeight: '500',
      lineHeight: 1.5,
    },
    '@media (max-width: 499.95px)': {
      '& th': {
        paddingLeft: '2vw',
        paddingRight: '1vw',
      },
    },
    '@media (min-width: 410px)': {
      '& th': {
        paddingLeft: '2vw',
        paddingRight: '3vw',
      },
    },
    '@media (min-width: 660px)': {
      '& th': {
        paddingLeft: '5vw',
        paddingRight: '5vw',
      },
    },
    '@media (min-width: 800px)': {
      '& th': {
        paddingLeft: '6vw',
        paddingRight: '6vw',
      },
    },
    '@media (min-width: 1480px)': {
      '& th': {
        paddingLeft: '7vw',
        paddingRight: '7vw',
      },
    },
  },
  tbody: {
    '& td': {
      padding: '0.1vw',
      fontWeight: '400',
      fontSize: '10px',

      borderBottom: 'hidden',
    },
    '& tr:last-child td': { borderBottom: '0px' },
    '& tr td:first-child': { borderLeft: '0px' },
    '& tr td:last-child': { borderRight: '0px' },
  },
  cell: {
    border: '1px solid var(--colorDashboardTableBorder)',
  },
  root: {
    '&.MuiTable-root': { width: '500px', display: 'inline' },
    display: 'flowRoot',
  },
}));

const rows = [
  {
    invoice: 'ACM-01',
    invoiceInfo: 'consulting',
    totalAmount: '12',
    pendingAmount: '500',
  },
  {
    invoice: 'ACM-01',
    invoiceInfo: 'consulting',
    totalAmount: '12',
    pendingAmount: '500',
  },
  {
    invoice: 'ACM-01',
    invoiceInfo: 'consulting',
    totalAmount: '12',
    pendingAmount: '500',
    toPay: '54500',
  },
  {
    invoice: 'ACM-01',
    invoiceInfo: 'consulting',
    totalAmount: '12',
    pendingAmount: '500',
    toPay: '5000',
  },
  {
    invoice: 'ACM-01',
    invoiceInfo: 'consulting',
    totalAmount: '12',
    pendingAmount: '50',
  },
  {
    invoice: 'ACM-01',
    invoiceInfo: 'consulting',
    totalAmount: '12',
    pendingAmount: '50',
  },
];
const WhiteBackgroundCheckbox = withStyles((theme) => ({
  // root: {
  //   color: "red",
  //   "& .MuiIconButton-label": {
  //     position: "relative",
  //     zIndex: 0
  //   },
  //   "& .MuiSvgIcon-root":{
  //     color :"#F08B32",
  //     width: "18px",

  //   },

  //   "&:not($checked) .MuiIconButton-label:after": {
  //     content: '""',
  //     left: 4,
  //     top: 4,
  //     height: 15,
  //     width: 15,
  //     position: "absolute",
  //     backgroundColor: "white",
  //     zIndex: -1,
  //     color:theme
  //   }
  // },
  // //
  // root: {
  //   color: "rgba(153, 158, 165, 0.4)",

  //       "&$checked": {
  //   color: "#F08B32",
  //       },
  //       "& .MuiSvgIcon-root":{
  //         width: "18px",

  //       },
  //     },

  root: {
    '& .MuiSvgIcon-root': {
      fill: 'white',
      '&:hover': {
        backgroundColor: 'rgba(153, 158, 165, 0.4)',
      },
    },
    '&$checked': {
      '& .MuiIconButton-label': {
        position: 'relative',
        zIndex: 0,
        border: '1px solid #F08B32',
        borderRadius: 3,
        width: '19px',
        height: '19px',
      },
      '& .MuiIconButton-label:after': {
        content: '""',
        left: 2,
        top: 2,
        height: 15,
        width: 15,
        position: 'absolute',
        backgroundColor: '#F08B32',
        zIndex: -1,
        borderColor: 'transparent',
      },
    },
    '&:not($checked) .MuiIconButton-label': {
      position: 'relative',
      zIndex: 0,
      border: '1px solid #bbbbbb',
      borderRadius: 3,
      width: '19px',
      height: '19px',
    },
    '&:not($checked) .MuiIconButton-label:after': {
      content: '""',
      left: 2,
      top: 2,
      height: 15,
      width: 15,
      position: 'absolute',
      backgroundColor: 'white',
      zIndex: -1,
      borderColor: 'transparent',
    },
  },
  color: theme,
  checked: {},
}))(Checkbox);

const ApprovedProcess3 = () => {
  const { changeSubView } = useContext(AppContext);

  const classes = useStyles();
  return (
    <>
      <Grid
        container
        style={{
          backgroundColor: 'white',
          height: 'calc(100% - 197px)',
          borderRadius: '25px 25px 0px 0px',
        }}
      >
        <div style={{ height: '100%', overflow: 'auto' }}>
          <Grid item xs={12}>
            <Typography
              style={{
                marginTop: '19px',
                //    fontSize: '3vw',
                paddingLeft: '4vw',
              }}
            >
              Multiple Payments
            </Typography>
          </Grid>
          <Grid
            style={{
              border: '1px solid #F08B32',
              width: '3%',
              marginLeft: '4%',
              marginTop: '1%',
            }}
          />
          <Grid item xs={12} style={{ width: '100vw' }}>
            <div className={css.tableWrapper}>
              <TableContainer
                className={`${classes.tableContainer}`}
                component={Paper}
              >
                <Table className={classes.root} aria-label="simple table">
                  <TableHead className={classes.thead}>
                    <TableRow>
                      <TableCell
                        className={classes.cell}
                        style={{ width: '100vw' }}
                        align="center"
                      >
                        <Grid sx={12}> </Grid>
                      </TableCell>

                      <TableCell className={classes.cell} align="center">
                        invoice
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        invoice Info
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        total Amount
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        Pending Amount
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        ToPay
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className={classes.tbody}>
                    {rows.map((row) => (
                      <TableRow key={row.invoice}>
                        <TableCell
                          style={{ width: '100%' }}
                          className={classes.cell}
                          align="center"
                        >
                          <WhiteBackgroundCheckbox />
                          <span />
                        </TableCell>
                        <TableCell
                          style={{ width: '100%' }}
                          className={classes.cell}
                          align="center"
                        >
                          {row.invoice}
                        </TableCell>
                        <TableCell className={classes.cell} align="center">
                          {row.invoiceInfo}
                        </TableCell>
                        <TableCell
                          style={{ width: '100%' }}
                          className={classes.cell}
                          align="center"
                        >
                          {row.totalAmount}
                        </TableCell>
                        <TableCell
                          style={{ width: '100%' }}
                          className={classes.cell}
                          align="center"
                        >
                          {row.pendingAmount}
                        </TableCell>
                        <TableCell
                          style={{ width: '100%' }}
                          className={classes.cell}
                          align="center"
                        >
                          {row.toPay}
                        </TableCell>

                        {/* <TableCell
                    className={`${classes.cell} ${css.color} ${
                      css[`level${i}`]
                    }`}
                    align="center"
                  >
                    {row.collectionEffPercent}
                  </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              paddingTop: '5%',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <Typography style={{ borderBottomStyle: 'groove' }}>
              Back to outstandings
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              paddingTop: '7%',
              paddingBottom: '5%',
              textAlign: 'center',
            }}
          >
            <Button
              style={{
                width: '48vw',
                backgroundColor: '#36E3C0',
                borderRadius: '2.5vw',
                // fontSize: '3vw',
                color: 'white',
              }}
              variant="outlined"
            >
              To Pay
              <br />
              Rs.48,000
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              paddingTop: '5%',
              paddingBottom: '5%',
              textAlign: 'center',
              marginBlockEnd: '58px',
            }}
          >
            <Button
              className={classes.buttons}
              onClick={() => {
                changeSubView('approvalProcess5');
              }}
              variant="outlined"
            >
              Proceed
            </Button>
          </Grid>
        </div>
      </Grid>
    </>
  );
};
export default ApprovedProcess3;
