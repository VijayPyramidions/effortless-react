import * as React from 'react';
import * as Mui from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import * as css from '../banking.scss';

const ListBank = () => {
  const dummyData = [
    {
      bankName: 'HDFC Bank',
      accountNumber: '1234 5678 4541 5459',
      rupees: '3,00,000',
      type: 'Buisness Account',
    },
    {
      bankName: 'ICICI Bank',
      accountNumber: '1234 5678 4541 5459',
      rupees: '2,00,000',
      type: 'Personal Account',
    },
  ];

  return (
    <div>
      <Mui.Grid container spacing={3} className={css.mainContainer2}>
        <Mui.Grid item xs={12} className={css.amountPaper}>
          {/* <Mui.Paper className={css.amountPaper}> */}
          <Mui.Grid container spacing={3} className={css.amountContainer}>
            <Mui.Grid item xs={12}>
              <Mui.Typography
                variant="h5"
                style={{ fontSize: '15px', fontWeight: '400' }}
                className={css.valueHeader}
              >
                List Of Banks
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
                  backgroundColor: '#f5f5f3cc',
                  borderRadius: '15px',
                  margin: '10px',
                }}
              >
                <Mui.ListItemText
                  primary={
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Mui.Typography
                        style={{ fontSize: '13px', fontWeight: '500' }}
                      >
                        {val.bankName}
                      </Mui.Typography>
                      <Mui.Typography
                        style={{ fontSize: '12px', fontWeight: '300' }}
                      >
                        .{val.type}
                      </Mui.Typography>
                    </div>
                  }
                  secondary={val.accountNumber}
                />
                <Mui.Typography
                  variant="h5"
                  align="center"
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#F08B32',
                  }}
                  noWrap
                >
                  Rs. {val.rupees}{' '}
                </Mui.Typography>
              </Mui.Grid>
            ))}
          </Mui.Grid>
          {/* </Mui.Paper> */}
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
                margin: '25px 0 0 0',
              }}
            >
              Connect a Bank
            </Mui.Button>
          </Mui.Grid>
        </Mui.Grid>

        <Mui.Grid item xs={12} className={css.amountPaper}>
          {/* <Mui.Paper className={css.amountPaper}> */}
          <Mui.Grid container spacing={3} className={css.amountContainer}>
            <Mui.Grid item xs={12}>
              <Mui.Typography
                variant="h5"
                style={{ fontSize: '15px', fontWeight: '400' }}
                className={css.valueHeader}
              >
                Effortless Bank Account
              </Mui.Typography>
            </Mui.Grid>

            <Mui.Grid
              item
              xs={12}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '15px',
                margin: '10px',
                border: '1px solid #aeaeae',
              }}
            >
              <Mui.ListItemText
                primary={
                  <Mui.Typography
                    style={{ fontSize: '14px', fontWeight: '400' }}
                  >
                    Total Balance
                  </Mui.Typography>
                }
                secondary="Rs. 25,000"
              />
              <AddCircleIcon
                style={{ width: '40px', height: '40px', color: '#F08B32' }}
              />
            </Mui.Grid>
          </Mui.Grid>
          {/* </Mui.Paper> */}
        </Mui.Grid>
      </Mui.Grid>
    </div>
  );
};

export default ListBank;
