import React from 'react';
import * as Mui from '@mui/material';
import * as Router from 'react-router-dom';
import FreeAccount from '../../assets/WebAssets/free_account.svg';
import * as css from './banking.scss';

export const CreateFreeBankAccount = ({ changeSubView }) => {
  const navigate = Router.useNavigate();
  return (
    <Mui.Grid container>
      <Mui.Grid item xs={6}>
        <Mui.Box className={css.leftSideStack}>
          <Mui.CardMedia
            className={css.img}
            component="img"
            src={FreeAccount}
          />
        </Mui.Box>
      </Mui.Grid>
      <Mui.Grid item xs={6}>
        <Mui.Stack className={css.rightSideStack}>
          <Mui.Typography className={css.head}>
            Banking that’s Designed for Business
          </Mui.Typography>
          <Mui.Typography className={css.subHead1}>
            Effortless Banking is the fastest way to execute and implement your
            Business Transactions.
          </Mui.Typography>
          <Mui.Typography className={css.subHead2}>
            Run all your Payment-related activites using your very own{' '}
            <span>Effortless Virtual Account.</span>
          </Mui.Typography>
          <Mui.Typography className={css.subHead3}>
            Registration and Setup are <span>FREE.</span>
          </Mui.Typography>
          <Mui.Box className={css.btnHead}>
            <Mui.Button
              className={css.btn}
              sx={{ '&:hover': { backgroundColor: '#f08b32' } }}
              onClick={() => {
                changeSubView('BankingForms', 'fromBottom');
                navigate('/banking-virtualAccountOnBoarding');
              }}
            >
              Create Free Account
            </Mui.Button>
          </Mui.Box>
        </Mui.Stack>
      </Mui.Grid>
    </Mui.Grid>
  );
};
