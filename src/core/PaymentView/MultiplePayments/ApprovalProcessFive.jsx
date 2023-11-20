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
import logo from '@assets/xlogo.svg';
import arrow from '@assets/arrow.svg';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

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
  imgGrid: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: '4%',
  },
  imgText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '10%',
    fontSize: '20px',
  },

  //  root: {
  //     '&.MuiTable-root':{width:"500px",display:"inline"},
  //     display:"flowRoot" },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(237, 237, 237, 0.15)',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  boxSizing: 'border-box',
  borderRadius: '8px',
  fontSize: '12px',
  boxShadow: 'None',
  border: ' 0.7px solid rgba(153, 158, 165, 0.39)',
}));

const rows = [
  {
    PayableAmount: 'Acme',
    Amount: 'Rs.100012',
  },
  {
    PayableAmount: 'Bango',
    Amount: 'Rs.100012',
  },
  {
    PayableAmount: 'Mitashi',
    Amount: 'Rs.100012',
  },
  {
    PayableAmount: 'kanacha',
    Amount: 'Rs.100012',
  },
  {
    PayableAmount: 'ACM-01',
    Amount: 'Rs.100012',
  },
  {
    PayableAmount: 'ACM-01',
    Amount: 'Rs.100012',
  },
];

const ApprovedProcess5 = () => {
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
          <Grid item xs={12} lg={12} md={12} sm={12}>
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
                marginTop: '1%',
              }}
            />
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <Typography
              style={{
                margin: 'revert',
                //    fontSize: '3vw',
                paddingLeft: '4vw',
              }}
            >
              Payment Details
            </Typography>
          </Grid>

          <Grid
            container
            rowSpacing={1}
            style={{
              paddingBottom: '9%',
              paddingTop: '4%',
              paddingLeft: '10%',
            }}
            // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6} className={classes.imgGrid}>
              <img src={logo} style={{ width: '38px' }} alt="Well Done" />{' '}
              <Typography className={classes.imgText}>xxxxx</Typography>
            </Grid>
            <Grid item xs={6} className={classes.imgGrid}>
              <img src={logo} style={{ width: '38px' }} alt="Well Done" />
              <Typography className={classes.imgText}>xxxxx</Typography>
            </Grid>
            <Grid item xs={6} className={classes.imgGrid}>
              <img src={logo} style={{ width: '38px' }} alt="Well Done" />
              <Typography className={classes.imgText}>xxxxx</Typography>
            </Grid>
            <Grid item xs={6} className={classes.imgGrid}>
              <img src={logo} style={{ width: '38px' }} alt="Well Done" />
              <Typography className={classes.imgText}>xxxxx</Typography>
            </Grid>
          </Grid>

          {/* <Box sx={{ flexGrow: 1, }}> */}
          {/* <Grid item xs={12} lg={12} md={12} sm={12}
           style={{ padding: '4%', paddingBottom: '2%' }}
           >
            <Grid
              item
              xs={12}
              style={{
                paddingLeft: '6%',
                paddingTop: '5%',
                paddingBottom: '5%',
                border: 'solid #EDEDED',
              }}
            >
              <Grid item xs={12} lg={12} md={12} sm={12}>
                <div style={{ fontSize: '11px' }}>Select Account</div>
              </Grid>
              <Grid
                item
                xs={12} lg={12} md={12} sm={12}
                className={classes.imgGrid}
                style={{ paddingTop: '7%' }}
              >
                <Grid style={{ fontSize: '16px', paddingRight: '14%' }}>
                  HDFC XXXX-XXXX-XXXX-2013
                </Grid>
                <Grid>
                  {' '}
                  <img src={arrow} style={{ width: '130%' }} alt="Well Done" />
                </Grid>
              </Grid>
            </Grid>
          </Grid> */}

          <Stack
            direction="column"
            style={{ marginLeft: '5%', marginRight: '5%' }}
          >
            <Item>
              <Grid
                style={{
                  fontSize: '11px',
                  textAlignLast: 'left',
                  paddingLeft: '3%',
                }}
              >
                Select Account
              </Grid>
              <Stack
                direction="row"
                style={{ justifyContent: 'space-between', padding: '4%' }}
              >
                <Grid style={{ fontSize: '16px', paddingRight: '14%' }}>
                  HDFC XXXX-XXXX-XXXX-2013
                </Grid>
                <Grid>
                  {' '}
                  <img src={arrow} style={{ width: '130%' }} alt="Well Done" />
                </Grid>
              </Stack>
            </Item>
          </Stack>
          {/* </Box> */}
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ width: '100vw' }}>
            <div className={css.tableWrapper}>
              <TableContainer
                className={`${classes.tableContainer}`}
                component={Paper}
              >
                <Table className={classes.root} aria-label="simple table">
                  <TableHead className={classes.thead}>
                    <TableRow>
                      <TableCell className={classes.cell} align="center">
                        PAYABLE AMOUNT
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
                          {row.PayableAmount}
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
            lg={12}
            md={12}
            sm={12}
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
            lg={12}
            md={12}
            sm={12}
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
                changeSubView('paymentProcessing');
              }}
              variant="outlined"
            >
              Pay Now
            </Button>
          </Grid>
        </div>
      </Grid>
    </>
  );
};
export default ApprovedProcess5;
