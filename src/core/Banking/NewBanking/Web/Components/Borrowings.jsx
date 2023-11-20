import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Typography,
  Stack,
  Button,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import {
  setActiveList,
  setBanks,
  openBorrowing,
} from '@action/Store/Reducers/Banking/BankingState';

import { IndianCurrency } from '@components/utils';

import bank_icon from '@assets/bankicon.svg';

import { ListsItem } from '../../Statement/util';

import * as css from '../../bankingnew.scss';

const Borrowings = () => {
  const dispatch = useDispatch();

  const { borrowingAccounts, activeList, active } = useSelector(
    (state) => state.Banking
  );

  const formatLoanString = (str) => {
    let formattedStr = str.replace(/_/g, ' ');
    const words = formattedStr.split(' ');
    words[0] = words[0][0].toUpperCase() + words[0].slice(1);
    if (words.length >= 3) {
      words[2] = words[2][0].toUpperCase() + words[2].slice(1);
    }
    formattedStr = words.join(' ');
    return formattedStr;
  };

  return (
    <Stack
      className={
        activeList.Borrow
          ? `${css.acclistcontainer} ${css.activecontainer}`
          : css.acclistcontainer
      }
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setActiveList('Borrow'));
      }}
    >
      <Stack className={css.acctypeheader}>
        <Typography variant="h4" className={css.acctypetext}>
          Borrowings
        </Typography>
        {borrowingAccounts !== undefined &&
          Object.values(borrowingAccounts).some((value) => value > 0) && (
            <Button
              className={css.accconnectbtn}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(openBorrowing());
              }}
            >
              Add Borrowings
            </Button>
          )}
      </Stack>
      {borrowingAccounts === undefined ||
      !Object.values(borrowingAccounts).some((value) => value > 0) ? (
        <Stack className={css.nodatawrp}>
          <img
            src={bank_icon}
            alt="Bank Icon"
            className={css.nodataicon}
            loading="lazy"
          />
          <Typography className={css.nodatatext}>
            No Borrowings Account Found.
          </Typography>
          <Button
            className={css.addaccbtn}
            onClick={() => dispatch(openBorrowing())}
          >
            Add Borrowings
          </Button>
        </Stack>
      ) : (
        <List>
          {Object?.keys(borrowingAccounts)?.map((val, ind) => (
            <>
              {Number(borrowingAccounts[val]) > 0 && (
                <ListsItem
                  disablePadding
                  key={val}
                  onClick={() =>
                    dispatch(
                      setBanks({
                        tab: 'Borrow',
                        BorrowType: formatLoanString(val),
                        ind,
                      })
                    )
                  }
                >
                  <ListItemButton
                    selected={active.Borrow === ind}
                    className={css.listitemwrp}
                  >
                    <ListItemText
                      primary={formatLoanString(val)}
                      className={css.listitemtext}
                    />
                    <Stack className={css.amountwrp}>
                      <Typography className={css.listaccamt}>
                        {IndianCurrency.format(borrowingAccounts[val] || 0)}
                      </Typography>
                      <KeyboardArrowRightRoundedIcon
                        className={css.arrowicon}
                      />
                    </Stack>
                  </ListItemButton>
                </ListsItem>
              )}
            </>
          ))}
        </List>
      )}
    </Stack>
  );
};

export default memo(Borrowings);
