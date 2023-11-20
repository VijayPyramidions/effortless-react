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
    name: 'ACME INC - Consulting',
    date: '23-November-2021',
    invoice: 'CMNO-12-222-123',
    total: '30000',
    pending: '15000',
  },
  {
    name: 'ACME INC - Consulting',
    date: '24-November-2021',
    invoice: 'DMNO-12-222-423',
    total: '20000',
    pending: '12000',
  },
  {
    name: 'ACME INC - Consulting',
    date: '23-November-2021',
    invoice: 'FMNO-12-222-123',
    total: '10000',
    pending: '5000',
  },
  {
    name: 'ACME INC - Consulting',
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

export default function VendorBillList(props) {
  const {
    selectedBills,
    setSelectedBills,
    paymentVoucher,
    voucherItems,
    setVoucherItems,
    deleteMode,
    moveToBillSelection,
  } = props;
  const { organization, enableLoading, user, openSnackBar } =
    useContext(AppContext);
  const [grandTotal, setGrandTotal] = useState(0);
  const classes = useStyles();

  const onDeleteItem = (bill) => {
    const vItem = voucherItems.find((vi) => vi.txn_line_id === bill.id);
    const vItemId = vItem?.id;
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${paymentVoucher?.id}/items/${vItemId}`,
      {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setVoucherItems((prevS) =>
            [...prevS].filter((l) => l.id !== vItemId),
          );
          setSelectedBills((prevS) =>
            [...prevS].filter((b) => b.id !== vItem.txn_line_id),
          );
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  useEffect(() => {
    let total = 0;
    if (voucherItems.length === 0) {
      moveToBillSelection();
      return;
    }
    voucherItems.forEach((vi) => {
      total += vi.amount;
    });
    setGrandTotal(total);
  }, [voucherItems]);

  return (
    <div className={css.vendorBillList}>
      <div className={css.grandTotal}>
        <div className={css.label}>Grand Total:</div>
        <div className={css.value}>Rs. {toInr(grandTotal)}</div>
      </div>
      <div className={css.billList}>
        {selectedBills.map((b, i) => (
          <label
            key={b.id}
            className={`${css.billItem} ${
              i % 2 === 0 ? css.alternateColor : ''
            }`}
            htmlFor={b.id}
          >
            <div className={css.info}>
              <div className={css.title}>{b.vendor_name}</div>
              <div className={css.row}>
                <div className={css.label}>Date of Payment</div>
                <div className={css.value}>{b.date}</div>
              </div>
              <div className={css.row}>
                <div className={css.label}>Invoice Number</div>
                <div className={css.value}>{b.document_number}</div>
              </div>
              <div className={css.row}>
                <div className={css.label}>Pending Amount</div>
                <div className={css.value}>Rs. {toInr(b.net_balance)}</div>
              </div>
              <div className={`${css.row} ${css.toPay}`}>
                <div className={css.label}>To pay Amount</div>
                <div className={css.value}>
                  Rs.{' '}
                  {toInr(
                    voucherItems.find((vi) => vi.txn_line_id === b.id)?.amount,
                  )}
                </div>
              </div>
              {deleteMode && (
                <div className={css.deleteIcon} onClick={() => onDeleteItem(b)}>
                  <CloseIcon />
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
