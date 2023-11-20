/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import AppContext from '@root/AppContext.jsx';
import { Button, makeStyles, Chip, Checkbox, SvgIcon } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import { useDebouncedCallback } from '@services/CustomHooks.jsx';
import { toInr } from '@services/Utils.js';
import * as css from './MultiplePayments.scss';

const mockBills = [
  {
    name: 'ACME INC - Consulting',
    date: '23-Nov-2021',
    invoice: 'CMNO-12-222-123',
    total: '30000',
    pending: '15000',
  },
  {
    name: 'ACME INC - Consulting',
    date: '24-Nov-2021',
    invoice: 'DMNO-12-222-423',
    total: '20000',
    pending: '12000',
  },
  {
    name: 'ACME INC - Consulting',
    date: '23-Nov-2021',
    invoice: 'FMNO-12-222-123',
    total: '10000',
    pending: '5000',
  },
  {
    name: 'ACME INC - Consulting',
    date: '23-Nov-2021',
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

export default function VendorBillEdit(props) {
  const classes = useStyles();
  const {
    selectedBills,
    paymentVoucher,
    setPaymentVoucher,
    voucherItems,
    setVoucherItems,
  } = props;
  const { organization, enableLoading, user, openSnackBar } =
    useContext(AppContext);

  const [toPay, setToPay] = useState();
  const [debounceTimeout, setDebounceTimeout] = useState(0);

  const createBillItems = (paymentVoucherId) => {
    const billList = selectedBills.map((sb) => {
      return {
        vendor_id: sb.vendor_id,
        amount: sb.net_balance,
        toPay: sb.net_balance,
        document_reference: sb.document_number,
        txn_line_id: sb.id,
      };
    });
    const payload = { data: billList };
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${paymentVoucherId}/items`,
      {
        method: METHOD.POST,
        payload,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setVoucherItems(res.data);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const getExistingPaymentVoucher = (paymentVoucherId) => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${paymentVoucherId}/items`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          // setVoucherItems(res.data);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const getVendorBills = () => {
    // Get existing PaymentVoucher
    if (paymentVoucher?.id) {
      getExistingPaymentVoucher(paymentVoucher?.id);
      return;
    }

    // Create PaymentVoucher & VoucherItems for each bills
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/payment_vouchers`, {
      method: METHOD.POST,
      payload: {},
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setPaymentVoucher(res);
          createBillItems(res.id);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const patchVoucherItem = (amount, voucherItemId) => {
    // enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${paymentVoucher?.id}/items/${voucherItemId}`,
      {
        method: METHOD.PATCH,
        payload: { amount },
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          // createBillItems(res.id);
          setVoucherItems((prevS) => {
            const vItemList = [...prevS];
            const patchIndex = vItemList.findIndex((l) => l.id === res.id);
            vItemList[patchIndex] = res;
            return vItemList;
          });
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const onChangeToPay = useDebouncedCallback((e, billId) => {
    const { value } = e.target;
    const vItem = voucherItems.find((vi) => vi.txn_line_id === billId);
    patchVoucherItem(value, vItem.id);
  }, 1000);

  useEffect(() => {
    getVendorBills();
  }, []);
  return (
    <div className={css.vendorBillEdit}>
      <div className={css.billList}>
        {selectedBills.map((b, i) => (
          <div key={b.id} className={`${css.billCard}`}>
            <div className={css.topSection}>
              <div className={css.titleRow}>
                <div className={css.title}>{b.vendor_name}</div>
                <div className={css.date}>{b.date}</div>
              </div>
              <div className={css.description}>{b.document_number}</div>
            </div>
            <div className={css.amountSection}>
              <div className={css.toPay}>
                <div className={css.label}>To Pay</div>
                <div className={css.toPayInput}>
                  <span className={css.prefix}>Rs. </span>
                  <input
                    className={css.input}
                    type="tel"
                    defaultValue={
                      voucherItems.find((vi) => vi.txn_line_id === b.id)?.amount
                    }
                    onChange={(e) => {
                      e.persist();
                      onChangeToPay(e, b.id);
                    }}
                  />
                </div>
              </div>
              <div className={css.pendingAmount}>
                <div className={css.label}>Pending Amount</div>
                <div className={css.amount}>Rs. {toInr(b.net_balance)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={css.pagination}>
        <div className={css.prevPage}>p</div>
        <div className={css.pageNo}>1</div>
        <div className={css.nextPage}>n</div>
      </div>
    </div>
  );
}
