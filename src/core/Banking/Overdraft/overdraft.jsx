import * as React from 'react';
import * as Mui from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import EffortlessBanking from '@assets/EffortlessBanking.svg';
import AppContext from '@root/AppContext.jsx';
import * as css from '../banking.scss';

const OverDraft = () => {
  const { changeSubView } = React.useContext(AppContext);

  // const [nextPage,setNextPage]=React.useState({
  //   AccountBalanceDetails: false,
  //   OverDraft:true
  // });
  const dummyData = [
    {
      bankName: 'HDFC Bank',
      accountNumber: '1234 5678 4541 5459',
      rupees: '3,00,000',
    },
    {
      bankName: 'ICICI Bank',
      accountNumber: '1234 5678 4541 5459',
      rupees: '2,00,000',
    },
  ];
  return (
    <Mui.Grid container spacing={3} className={css.mainContainer}>
      <Mui.Grid item xs={12} style={{ margin: '10px 0' }}>
        <Mui.Paper className={css.amountPaper}>
          <Mui.Grid container spacing={3} className={css.amountContainer}>
            <Mui.Grid item xs={12}>
              <Mui.Typography
                variant="h5"
                style={{ fontSize: '15px', fontWeight: '400' }}
                className={css.valueHeader}
              >
                Overdraft Limits
              </Mui.Typography>
            </Mui.Grid>

            {dummyData.map((val) => (
              <Mui.Grid
                item
                xs={12}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Mui.ListItemText
                  primary={val.bankName}
                  secondary={val.accountNumber}
                />
                <Mui.Typography
                  variant="h5"
                  align="center"
                  style={{
                    fontSize: '20px',
                    fontWeight: '400',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  noWrap
                >
                  Rs. {val.rupees}{' '}
                  <ArrowForwardIosIcon
                    style={{ color: '#F08B32' }}
                    // onClick={
                    //   ()=>{
                    //     setNextPage({
                    //       AccountBalanceDetails: true,
                    //       OverDraft:false});
                    //   }}
                    onClick={() => {
                      changeSubView('accountDetails');
                    }}
                  />
                </Mui.Typography>
              </Mui.Grid>
            ))}
          </Mui.Grid>
        </Mui.Paper>
      </Mui.Grid>

      <Mui.Grid item xs={12} style={{ margin: '10px 0' }}>
        <Mui.Card>
          <Mui.CardMedia component="img" image={EffortlessBanking} />
          <Mui.CardContent>
            <Mui.Grid container spacing={3} className={css.amountContainer}>
              <Mui.Grid item xs={12}>
                <Mui.Typography
                  variant="h6"
                  style={{
                    fontSize: '18px',
                    fontWeight: '400',
                    marginBottom: '10px',
                  }}
                >
                  Choose Effortless banking
                </Mui.Typography>
              </Mui.Grid>

              <Mui.Grid item xs={12}>
                <Mui.Typography
                  variant="h5"
                  align="center"
                  style={{ fontSize: '15px', fontWeight: '300' }}
                >
                  Effortless Banking is the Fastest Way to run your business
                  transactions. It is powered by your Effortless Virtual
                  Account.
                </Mui.Typography>
              </Mui.Grid>
              <Mui.Grid item xs={12}>
                <Mui.Typography
                  variant="h5"
                  align="left"
                  style={{ fontSize: '15px', fontWeight: '300' }}
                >
                  Registration and Setup are{' '}
                  <span style={{ fontSize: '18px', fontWeight: '400' }}>
                    FREE
                  </span>
                  .
                </Mui.Typography>
              </Mui.Grid>
              <Mui.Grid
                item
                xs={12}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mui.Button
                  variant="outlined"
                  style={{
                    border: '1px solid #F08B32',
                    borderRadius: '20px',
                    color: '#F08B32',
                  }}
                >
                  Create Free Account
                </Mui.Button>
              </Mui.Grid>
            </Mui.Grid>
          </Mui.CardContent>
        </Mui.Card>
      </Mui.Grid>
    </Mui.Grid>
  );
};

export default OverDraft;
