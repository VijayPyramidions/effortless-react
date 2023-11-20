import React, { useContext, useState } from 'react';
import { InputBase, makeStyles, Button } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import VerificationView from '@core/PaymentView/EffortlessPay/VerificationView.jsx';
import AppHeader from '@components/AppHeader/AppHeader.jsx';
import {
  CheckSvg,
  CurrencySvg,
} from '@core/PaymentView/EffortlessPay/Icons.jsx';
import PageTitle from '@core/DashboardView/PageTitle.jsx';
import AppContext from '@root/AppContext.jsx';
import * as css from './EffortlessPay.scss';
import SuccessPage from './SuccessPage.jsx';

const useStyles = makeStyles(() => ({
  submitButton: {
    borderRadius: '18px',
    backgroundColor: 'var(--colorPrimaryButton)',
    margin: '15px 0',
    color: 'var(--colorWhite)',
    minWidth: '90px',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: 'var(--colorPrimaryButton)',
    },
  },
  searchAmount: {
    '& .MuiInputBase-root': {
      color: '#ffffff',
      fontSize: 30,
      lineHeight: 37.5,
      fontWeight: 400,
    },
  },
  searchReason: {
    color: '#ffffff',
    maxWidth: '100%',
    '& .MuiInputBase-root': {
      maxWidth: '100%',
      color: '#ffffff',
      fontSize: 12,
      lineHeight: 15,
      fontWeight: 400,
    },
  },
  checkIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 21px 0 0',
    '& .MuiSvgIcon-root': {
      width: '18px',
      height: '18px',
    },
  },
  currency: {
    margin: '0 9px 9px 0',
    '& .MuiSvgIcon-root': {
      width: '8px',
      height: '11.5px',
    },
  },
}));

const bankAccount = [
  { id: '1', label: 'HDFC - XXXXXXXXXXXX0394' },
  { id: '2', label: 'ICICI - XXXXXXXXXXXX8945' },
  { id: '3', label: 'SBI - XXXXXXXXXXXX8945' },
];

const initialState = {
  bankAccount: '',
  reason: '',
  amount: '',
};

const EffortlessPay = () => {
  const { changeSubView } = useContext(AppContext);

  const [state, setState] = useState(initialState);
  const classes = useStyles(state?.reason);
  const [isBankSelected, setIsBankSelected] = useState(false);
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState({
    bankAccount: false,
  });

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  const handleBottomSheet = (name, data) => {
    setDrawer((d) => ({ ...d, [name]: false }));
    if (!state[name] && data) {
      setState((s) => ({ ...s, [name]: data }));
    }
    setIsBankSelected(!isBankSelected);
  };

  const onBankSelect = (name, data) => {
    setState((s) => ({ ...s, [name]: data }));
    setIsBankSelected(!isBankSelected);
  };

  const successfullyPayment = () => {
    setPage(3);
  };

  const onInputChange = (e, key) => {
    const { value } = e.target;
    setState((s) => ({ ...s, [key]: value }));
  };
  return (
    <>
      {page === 1 && (
        <div className={css.effortlessPayContainer}>
          <AppHeader hideSearchIcon hideNotificationIcon />
          <PageTitle
            title="Effortless Pay"
            onClick={() => changeSubView('paymentView')}
          />
          <div className={css.paymentContainer}>
            <div className={css.shortName}>WW</div>
            <div className={css.payingName}>Paying MN Groups</div>
            <div className={css.amount}>
              <div className={classes.currency}>
                <CurrencySvg />
              </div>
              <div className={classes.searchAmount}>
                <InputBase
                  placeholder="Amount"
                  style={{
                    width: `${
                      state.amount !== ''
                        ? `${state.amount.length * 20}px`
                        : '125px'
                    }`,
                  }}
                  inputProps={{ 'aria-label': 'Payment Amount' }}
                  onChange={(e) => onInputChange(e, 'amount')}
                />
              </div>
            </div>
            <div className={css.reason}>
              <div className={classes.searchReason}>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="What is this for?"
                  style={{
                    width: `${
                      state.reason !== ''
                        ? `${state.reason.length * 8}px`
                        : '100px'
                    }`,
                  }}
                  inputProps={{ 'aria-label': 'Reason' }}
                  onChange={(e) => onInputChange(e, 'reason')}
                />
              </div>
            </div>
            <div className={css.nextContainer}>
              <div
                className={css.next}
                onClick={() => onTriggerDrawer('bankAccount')}
              >
                <ArrowForwardIosIcon htmlColor="black" />
              </div>
            </div>
            <SelectBottomSheet
              name="bankAccount"
              triggerComponent
              label="Bank Account"
              open={drawer.bankAccount}
              //   value={state.bankAccount?.label}
              //   onTrigger={onTriggerDrawer}
              onClose={handleBottomSheet}
            >
              {isBankSelected && (
                <>
                  <div
                    className={css.changeButton}
                    onClick={() => setIsBankSelected(!isBankSelected)}
                  >
                    <div className={css.line}>Change</div>
                  </div>
                  <div className={css.selectedBank} role="menuitem">
                    <div className={css.bankDetail}>
                      {state.bankAccount.label}
                      <div className={classes.checkIcon}>
                        <CheckSvg />
                      </div>
                    </div>
                    <p>Savings Account</p>
                    <div className={css.button}>
                      <Button
                        variant="outlined"
                        className={classes.submitButton}
                        onClick={() => setPage(2)}
                        size="medium"
                      >
                        Proceed to Pay
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {!isBankSelected &&
                bankAccount.map((ps) => (
                  <div
                    key={ps.id}
                    className={css.categoryOptions}
                    onClick={() => onBankSelect('bankAccount', ps)}
                    role="menuitem"
                  >
                    {ps.label}
                  </div>
                ))}
            </SelectBottomSheet>
          </div>
        </div>
      )}
      {page === 2 && (
        <VerificationView successfullyPayment={() => successfullyPayment()} />
      )}
      {page === 3 && <SuccessPage />}
    </>
  );
};

export default EffortlessPay;
