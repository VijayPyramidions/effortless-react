import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setVendorBills,
  setSelectedBillIds,
  createVoucherItem,
  updateVoucherItem,
  deleteVoucherItem,
} from '@action/Store/Reducers/Payments/MakePaymentState';

import { enableLoading } from '@action/Store/Reducers/Errors/Errors';

import { Button, Typography } from '@material-ui/core';
import BillItem from '@core/PaymentView/shared/Bill';

import * as css from '../MakePayment.scss';

const VendorBill = (props) => {
  const { vendor_id, done } = props;
  const device = localStorage.getItem('device_detect');

  const dispatch = useDispatch();

  const { vendorBills, selectedbillids, paymentVoucharId } = useSelector(
    (state) => state.MakePayment
  );

  const createVoucherItems = async (data) => {
    const body = {
      vendor_id,
      amount: data.amount,
      document_reference: '',
      description: data.narration,
      txn_line_id: data.txn_line_id,
    };

    dispatch(enableLoading(true));
    dispatch(createVoucherItem({ VoucherId: paymentVoucharId, body }));
  };

  const updateVoucherItems = async (id, amount) => {
    dispatch(enableLoading(true));
    dispatch(
      updateVoucherItem({ VoucherId: paymentVoucharId, id, body: { amount } })
    );
  };

  const handleSelect = async (checked, id) => {
    if (checked) {
      const newItems = await vendorBills.map((item) => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            selected: checked,
            paidAmount: Number(item.net_balance),
          };
          return updatedItem;
        }

        return { ...item };
      });
      const bill = newItems.find((a) => a.id === id);

      const body = {
        amount: bill.net_balance,
        document_reference: '',
        description: bill.narration,
        txn_line_id: bill.id,
      };

      dispatch(setSelectedBillIds([...selectedbillids, id]));
      await createVoucherItems(body);
    } else {
      const bill = vendorBills?.find((a) => a.id === id);

      await dispatch(
        deleteVoucherItem({ VoucherId: paymentVoucharId, id: bill.voucher_id })
      );

      const updatedUuids = selectedbillids.filter((uuid) => uuid !== bill.id);
      dispatch(setSelectedBillIds(updatedUuids));

      const newItems = vendorBills.map((item) => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            selected: checked,
            voucher_id: null,
            paidAmount: 0,
          };
          return updatedItem;
        }

        return { ...item };
      });

      dispatch(setVendorBills(newItems));
    }
  };

  const handleAmountChange = (amount, id) => {
    const newItems = vendorBills.map((item) => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          paidAmount: amount,
        };
        return updatedItem;
      }
      return { ...item };
    });
    dispatch(setVendorBills(newItems));
  };

  return (
    <div
      style={
        {
          // overflow: 'scroll',
          // height: device === 'mobile' ? '75vh' : '700px',
        }
      }
    >
      <div className={`${css.headerContainer} ${css.drawer}`}>
        <div className={css.headerLabel}>Make a Payment</div>
        <span className={css.headerUnderline} />
      </div>
      <div
        className={css.list}
        // style={{ height: device === 'mobile' ? '60vh' : '585px' }}
      >
        {vendorBills &&
          vendorBills.length > 0 &&
          vendorBills.map((v, i) => (
            <div
              className={css.categoryOptions}
              style={{
                marginBottom:
                  i + 1 === vendorBills.length && device === 'mobile'
                    ? '40px'
                    : 0,
              }}
              key={v.id}
              role="menuitem"
            >
              <BillItem
                checked={v.selected}
                name={v.vendor_name}
                tabValue={0}
                totalAmount={v.net_balance}
                // day={v.credit_period}
                day={v.age_description}
                descriptionColor={v.age_description_color}
                handleChange={(e) => handleSelect(e.target.checked, v.id)}
                handleAmountChange={(e) => {
                  handleAmountChange(e?.target?.value, v?.id);
                }}
                updateAmount={() =>
                  updateVoucherItems(v.voucher_id, v.paidAmount)
                }
                paidAmount={v.paidAmount}
                id={v.id}
                date={v.date}
              />
            </div>
          ))}
        {vendorBills && vendorBills.length === 0 && (
          <Typography align="center">
            There is No Bill for this Vendor!
          </Typography>
        )}
      </div>
      <div className={device === 'desktop' ? css.actionDesktop : css.action}>
        <Button
          onClick={() => {
            const billCount = vendorBills.filter((a) => a.selected).length;
            const totalAmount = vendorBills
              .filter((a) => a.selected)
              .map((a) => Number(a.paidAmount))
              .reduce((a, b) => a + b, 0);
            done(totalAmount, billCount, vendorBills);
          }}
          size="large"
          disabled={vendorBills.filter((a) => a.selected).length === 0}
          className={
            device === 'desktop'
              ? `${css.submitButtonDesktop} ${
                  vendorBills.filter((a) => a.selected).length === 0
                    ? css.disabled
                    : css.active
                }`
              : `${css.submitButton} ${
                  vendorBills.filter((a) => a.selected).length === 0
                    ? css.disabled
                    : css.active
                }`
          }
        >
          DONE
        </Button>
      </div>
    </div>
  );
};

export default VendorBill;
