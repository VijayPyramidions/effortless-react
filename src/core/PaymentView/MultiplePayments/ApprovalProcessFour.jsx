import React, { useContext } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AppContext from '@root/AppContext.jsx';

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
  // root: { borderTopWidth: 1, borderColor: 'red', borderStyle: 'solid' },
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
      padding: '8px',
      fontWeight: '600',
      lineHeight: 1.5,
    },
  },
  tbody: {
    '& td': { padding: '12px', fontWeight: '300', fontSize: '10px' },
    '& tr:last-child td': { borderBottom: '0px' },
    '& tr td:first-child': { borderLeft: '0px' },
    '& tr td:last-child': { borderRight: '0px' },
  },
  cell: {
    border: '1px solid var(--colorDashboardTableBorder)',
  },

  //  root: {
  //     '&.MuiTable-root':{width:"500px",display:"inline"},
  //     display:"flowRoot" },
}));

const rows = [
  {
    Party: 'Acme',
    Income: '24',
    Amount: 'Rs.100012',
  },
  {
    Party: 'Bango',
    Income: '24',
    Amount: 'Rs.100012',
  },
  {
    Party: 'Mitashi',
    Income: '24',
    Amount: 'Rs.100012',
  },
  {
    Party: 'kanacha',
    Income: '24',
    Amount: 'Rs.100012',
  },
  {
    Party: 'ACM-01',
    Income: '24',
    Amount: 'Rs.100012',
  },
  {
    Party: 'ACM-01',
    Income: '24',
    Amount: 'Rs.100012',
  },
];

const ApprovedProcess4 = () => {
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
            <Grid
              style={{
                border: '1px solid #F08B32',
                width: '3%',
                marginLeft: '4%',
              }}
            />
          </Grid>
          <Grid item xs={12} style={{ width: '100vw' }}>
            <div className={css.tableWrapper}>
              <TableContainer
                className={`${classes.tableContainer}`}
                component={Paper}
              >
                <Table className={classes.root} aria-label="simple table">
                  <TableHead className={classes.thead}>
                    <TableRow>
                      <TableCell className={classes.cell} align="center">
                        PARTY
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        INCOME
                      </TableCell>
                      <TableCell className={classes.cell} align="center">
                        AMOUNT
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className={classes.tbody}>
                    {rows.map((row) => (
                      <TableRow key={row.Party}>
                        <TableCell
                          style={{ width: '30%' }}
                          className={classes.cell}
                          align="center"
                        >
                          {row.Party}
                        </TableCell>
                        <TableCell
                          className={classes.cell}
                          style={{ width: '30%' }}
                          align="center"
                        >
                          {row.Income}
                        </TableCell>
                        <TableCell
                          style={{ width: '30%' }}
                          className={classes.cell}
                          align="center"
                        >
                          {row.Amount}
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
                changeSubView('approvalProcess3');
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
export default ApprovedProcess4;
