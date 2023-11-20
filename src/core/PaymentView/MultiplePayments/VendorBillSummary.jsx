/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import AppContext from '@root/AppContext.jsx';
import { Button, makeStyles, Chip, Checkbox, SvgIcon } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import CloseIcon from '@material-ui/icons/Close';
import { toInr } from '@services/Utils.js';
import * as css from './MultiplePayments.scss';
import VerificationDialog from './VerificationDialog';

const mockChips = [
  'All',
  'ACME Inc.',
  'ISSE Corpss',
  'ISSE Corps',
  'ISSE Corpz',
  'ISSE Corp',
];

const mockBills = [
  {
    name: 'ACME INC',
    date: '23-November-2021',
    invoice: 'CMNO-12-222-123',
    total: '30000',
    pending: '15000',
  },
  {
    name: 'ICC Corp',
    date: '24-November-2021',
    invoice: 'DMNO-12-222-423',
    total: '20000',
    pending: '12000',
  },
  {
    name: 'AMAZON',
    date: '23-November-2021',
    invoice: 'FMNO-12-222-123',
    total: '10000',
    pending: '5000',
  },
  {
    name: 'ACME INC',
    date: '23-November-2021',
    invoice: 'GMNO-12-222-123',
    total: '30000',
    pending: '18000',
  },
  {
    name: 'ICC Corp',
    date: '23-November-2021',
    invoice: 'GMNO-12-222-123',
    total: '30000',
    pending: '18000',
  },
  {
    name: 'ACME INC',
    date: '23-November-2021',
    invoice: 'GMNO-12-222-123',
    total: '30000',
    pending: '18000',
  },
];

const useStyles = makeStyles(() => ({
  checkbox: {
    padding: 0,
    '& .MuiSvgIcon-root': {
      fontSize: '2.4rem',
      fill: 'transparent',
    },
  },
}));

export default function VendorBillSummary(props) {
  const {
    selectedBills,
    voucherItems,
    vendorSelected,
    paymentVoucher,
    onPageNext,
  } = props;
  const { organization, enableLoading, user, openSnackBar } =
    useContext(AppContext);
  const classes = useStyles();
  const [bankAccount, setBankAccount] = useState('');
  const [otpMobileNumber, setOtpMobileNumber] = useState('');
  const [bankAccountList, setBankAccountList] = useState([
    {
      id: 'hdfc',
      bank_account_name: 'HDFC',
      bank_account_number: 'XXXXXXXXXXXX0394',
    },
  ]);
  const [drawer, setDrawer] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [billSummary, setBillSummary] = useState([]);
  const [grandTotal, setGrandTotal] = useState([]);

  const showError = (message) => {
    openSnackBar({
      message: message || 'Unknown Error Occured',
      type: 'error',
    });
  };
  const showMsg = (message) => {
    openSnackBar({ message });
  };

  const handleBottomSheet = (data) => {
    setDrawer(false);
    if (data) setBankAccount(data);
  };

  const handleCloseDialog = (data) => {
    setDialog(false);
  };

  useEffect(() => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/bank_accounts`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error && res.data.length > 0) {
          setBankAccountList(res.data);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  }, []);

  const postOtp = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${paymentVoucher.id}/otp`,
      {
        method: METHOD.GET,
        payload: {},
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          if (res?.mobile_number) setOtpMobileNumber(res.mobile_number);
          if (!dialog) setDialog(true);
        } else {
          showError(res.message);
        }
      })
      .catch(() => {
        enableLoading(false);
        showError();
      });
  };

  const postOrgAccountDetails = () => {
    setDialog(false);
    RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${paymentVoucher.id}`,
      {
        method: METHOD.PATCH,
        payload: {
          account_id: bankAccount.id,
          paid: true,
        },
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          postOtp();
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const verifyOtp = (otp) => {
    RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${paymentVoucher.id}/otp`,
      {
        method: METHOD.POST,
        payload: { otp },
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          onPageNext();
        } else {
          showError(res.message);
        }
      })
      .catch(() => {
        showError();
        enableLoading(false);
      });
  };

  const onProceed = () => {
    if (!bankAccount)
      openSnackBar({ message: 'Choose bank account', type: 'error' });
    else {
      postOrgAccountDetails();
    }
  };

  useEffect(() => {
    const vendorSplit = {};
    let total = 0;
    voucherItems.forEach((vi) => {
      total += vi.amount;
      if (vendorSplit[vi.vendor_id]) {
        vendorSplit[vi.vendor_id] += vi.amount;
      } else {
        vendorSplit[vi.vendor_id] = vi.amount;
      }
    });
    const summary = Object.keys(vendorSplit).map((k) => {
      const label = vendorSelected.find((vs) => vs.id === k)?.name;
      const amount = vendorSplit[k];
      return { label, amount, id: k };
    });
    setBillSummary(summary);
    setGrandTotal(total);
  }, [voucherItems]);

  return (
    <div className={css.vendorBillSummary}>
      <div className={css.vendorSection}>
        <div className={css.label}>Vendors Being Paid</div>
        <div className={css.avatarSection}>
          {billSummary.map((v) => (
            <div key={v.id} className={css.avatarItem}>
              <div className={css.avatar}>{v.label?.substring(0, 2)}</div>
              <div className={css.name}>{v.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={css.info}>
        <div className={css.title}>Payable Total</div>
        {billSummary.map((b) => (
          <div key={b.id} className={css.row}>
            <div className={css.label}>{b.label}</div>
            <div className={css.value}>Rs. {toInr(b.amount)}</div>
          </div>
        ))}
        <div className={`${css.row} ${css.grandTotal}`}>
          <div className={css.label}>Grand Total</div>
          <div className={css.value}>Rs. {toInr(grandTotal)}</div>
        </div>
      </div>
      <div className={css.bankSection}>
        <div className={css.label}>Select Bank Account</div>
        <SelectBottomSheet
          name="bankAccount"
          // onBlur={reValidate}
          // error={validationErr.bankAccount}
          // helperText={
          //     validationErr.bankAccount ? VALIDATION?.bankAccount?.errMsg : ''
          // }
          label="Bank Account"
          open={drawer}
          value={`${
            bankAccount
              ? `${bankAccount.bank_account_name} - ${bankAccount.bank_account_number}`
              : ''
          }`}
          onTrigger={() => setDrawer(true)}
          onClose={() => handleBottomSheet()}
        >
          {bankAccountList.map((acc) => (
            <div
              key={acc.id}
              className={css.categoryOptions}
              onClick={() => handleBottomSheet(acc)}
              role="menuitem"
            >
              {acc.bank_account_name} - {acc.bank_account_number}
            </div>
          ))}
        </SelectBottomSheet>
      </div>
      <div className={css.actionContainer}>
        <Button size="medium" className={css.submitButton} onClick={onProceed}>
          Proceed to Pay
        </Button>
      </div>
      <VerificationDialog
        open={dialog}
        handleClose={handleCloseDialog}
        resendOtp={postOtp}
        {...{ verifyOtp, otpMobileNumber }}
      />
    </div>
  );
}
