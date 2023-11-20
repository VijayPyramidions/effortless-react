import React, { useContext, useState } from 'react';
import AppHeader from '@components/AppHeader/AppHeader.jsx';
import PageTitle from '@core/DashboardView/PageTitle.jsx';
import AppContext from '@root/AppContext.jsx';
import SuccessView from '@core/BillBookView/shared/SuccessView.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { Button, makeStyles } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';

import * as css from './SuccessPage.scss';

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
  icon: {
    '& .MuiSvgIcon-root': {
      fontSize: '36px',
    },
  },
}));
const SuccessPage = () => {
  const { changeView, changeSubView } = useContext(AppContext);
  const classes = useStyles();

  const [drawer, setDrawer] = useState({
    transactionDetail: false,
    reimbursement: false,
    thankyou: false,
  });
  // const navigate = Router.useNavigate();

  const handleBottomSheet = (name) => {
    setDrawer((d) => ({ ...d, [name]: false }));
  };

  const returnToDashboard = () => {
    changeView('dashboard');
    changeSubView('');
  };

  const onTriggerDrawer = (name) => {
    const newState = Object.entries(drawer).reduce((item, [currKey]) => {
      const newItem = item;
      if (currKey === name) {
        newItem[currKey] = true;
      } else {
        newItem[currKey] = false;
      }
      return newItem;
    }, {});
    setDrawer(newState);
  };
  return (
    <>
      <div className={css.successContainer}>
        <AppHeader />
        <PageTitle
          title="Effortless Pay"
          onClick={() => changeSubView('paymentView')}
        />
        <div
          className={css.success}
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <SuccessView
            title="Payment Success"
            description=""
            btnTitle="Visit Transaction"
            onClick={() => onTriggerDrawer('transactionDetail')}
          />
        </div>
        <SelectBottomSheet
          name="transactionDetail"
          triggerComponent
          label="Transaction Detail"
          open={drawer.transactionDetail}
          onClose={handleBottomSheet}
        >
          <div className={css.transaction}>
            <div className={css.headerContainer}>
              <div className={css.headerLabel}>TranID0011144534</div>
              <span className={css.underline} />
            </div>
            <ShareIcon />
          </div>
          <div className={css.content}>
            <div className={css.item}>
              <div className={css.title}>Vendor</div>
              <div className={css.value}>Kinitous LLP</div>
            </div>
            <div className={css.item}>
              <div className={css.title}>Amount</div>
              <div className={css.value}>Rs. 99,999</div>
            </div>
            <div className={css.item}>
              <div className={css.title}>Bank Account</div>
              <div className={css.value}>HDFC - XXXXXXXXXXXX0929</div>
            </div>
            <div className={css.item}>
              <div className={css.title}>Receiver’s GSTIN</div>
              <div className={css.value}>03AACAHF2230M1Z3</div>
            </div>
          </div>
          <div className={css.button}>
            <Button
              variant="outlined"
              className={classes.submitButton}
              onClick={() => onTriggerDrawer('reimbursement')}
              size="medium"
            >
              Apply Reimbursement
            </Button>
          </div>
          <div
            className={css.linkDashboard}
            onClick={returnToDashboard}
            role="link"
          >
            Return to Dashboard
          </div>
        </SelectBottomSheet>
        <SelectBottomSheet
          name="reimbursement"
          triggerComponent
          label="Apply for Reimbursement"
          open={drawer.reimbursement}
          onClose={handleBottomSheet}
        >
          <div className={css.reimbursement}>
            <div className={css.mainHeader}>Keep in Mind !</div>
            <div className={css.details}>
              Your Transaction <span>TranID0011144534</span> via Effortless Pay
              was successful.
            </div>
            <div className={css.details}>
              Your payment was made via <span>HDFC - XXXXXXXXXXXX0929</span>{' '}
            </div>

            <div className={css.details}>
              The Amount Paid has been deducted from your Effortless Card
              Balance.
            </div>
            <div className={css.details}>
              If you’d like to apply for a Reimbursement, please click the
              button below and visit the Reimbursement section for details.
            </div>
          </div>
          <div className={css.button}>
            <Button
              variant="outlined"
              className={classes.submitButton}
              onClick={() => onTriggerDrawer('thankyou')}
              size="medium"
            >
              Apply Reimbursement
            </Button>
          </div>
        </SelectBottomSheet>
        <SelectBottomSheet
          name="thankyou"
          triggerComponent
          label="Thank You!"
          open={drawer.thankyou}
          onClose={handleBottomSheet}
        >
          <div className={css.reimbursement}>
            <div className={css.mainHeader}>Thank You!</div>
            <div className={css.details}>
              Your Reimbursement Request has been processed.
            </div>
            <div className={css.details}>
              Please visit the Reimbursement section for more details.
            </div>
          </div>
          <div className={css.button}>
            <Button
              variant="outlined"
              className={classes.submitButton}
              onClick={() => handleBottomSheet('thankyou', null)}
              size="medium"
            >
              Return to Payments
            </Button>
          </div>
        </SelectBottomSheet>
      </div>
    </>
  );
};

export default SuccessPage;
