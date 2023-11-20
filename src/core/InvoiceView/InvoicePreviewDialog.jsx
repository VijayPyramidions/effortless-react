/* @flow */
/**
 * @fileoverview  Create Product Dialog Container
 */

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';

import * as css from '@core/InvoiceView/CreateInvoiceContainer.scss';

const InvoicePreviewDialog = ({
  open,
  invoiceId,
  orgId,
  activeToken,
  onCancel,
  onSubmit,
  submitText,
  invoiceTypes,
}: {
  open: boolean,
  invoiceId: string,
  orgId: string,
  activeToken: string,
  onCancel: () => {},
  onSubmit: () => {},
  submitText: string,
  invoiceTypes: Array<{ text: string, payload: string }>,
}) => {
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [customerDetails, setCustomerDetails] = useState({});

  const fetchInvoice = () => {
    RestApi(`organizations/${orgId}/invoices/${invoiceId}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${activeToken}`,
      },
    }).then((res) => {
      setInvoiceDetails(res);
    });
  };

  const fetchCustomer = () => {
    RestApi(`organizations/${orgId}/customers/${invoiceDetails.customer_id}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${activeToken}`,
      },
    }).then((res) => {
      setCustomerDetails(res);
    });
  };

  useEffect(() => {
    if (open) {
      fetchInvoice();
    }
  }, [open]);

  useEffect(() => {
    if (invoiceDetails.customer_id) {
      fetchCustomer();
    }
  }, [invoiceDetails]);

  const activeInvoiceType = invoiceTypes.find(
    (i) => i.payload === invoiceDetails.document_type,
  );
  const bodyContent = () => {
    const deliveryAddr = invoiceDetails.delivery_party_location_json || {};
    const total =
      invoiceDetails.invoice_items && invoiceDetails.invoice_items.length > 0
        ? FormattedAmount(
            invoiceDetails.invoice_items.reduce(
              (acc, val) => acc + parseInt(val.total, 10),
              0,
            ),
          )
        : '-';
    return (
      <div className={css.summaryContainer}>
        <div className={css.summaryInfo}>
          <span className={css.label}>Date Created</span>
          <span className={css.value}>
            {moment(invoiceDetails.data).format('Do MMMM, YYYY')}
          </span>
        </div>
        <div className={css.summaryInfo}>
          <span className={css.label}>Invoice Type</span>
          <span className={css.value}>
            {(activeInvoiceType && activeInvoiceType.text) || 'Tax'}
          </span>
        </div>
        <div className={css.summaryInfo}>
          <span className={css.label}>Customer Name</span>
          <span className={css.value}>{customerDetails.name}</span>
        </div>
        <div className={css.summaryInfo}>
          <span className={css.label}>Grand Total</span>
          <span className={css.value}>{total}</span>
        </div>
        <div className={css.summaryInfo}>
          <span className={css.label}>Delivery Location</span>
          <span
            className={css.value}
          >{`${deliveryAddr.address_line1}, ${deliveryAddr.address_line2}, ${deliveryAddr.city}`}</span>
        </div>
      </div>
    );
  };

  return (
    <DialogContainer
      title="Invoice Preview"
      body={bodyContent()}
      open={open}
      onCancel={onCancel}
      onSubmit={onSubmit}
      maxWidth="lg"
      submitText={submitText}
    />
  );
};

export default InvoicePreviewDialog;
