/* @flow */
/**
 * @fileoverview  Create Edit Invoice Container
 */

import React, { useState, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';

import AppContext from '@root/AppContext.jsx';

import * as css from './CreateInvoiceContainer.scss';

const DeclinedInvoiceContainer = () => {
  const { organization, user } = useContext(AppContext);

  const [openSummary, setOpenSummary] = useState(false);
  const [draftInvoice, setDraftInvoice] = useState([]);

  const onOpenSummary = () => {
    setOpenSummary(true);
  };

  const onCloseSummary = () => {
    setOpenSummary(false);
  };

  const fetchDraftInvoice = () => {
    RestApi(`organizations/${organization.orgId}/invoices/undispatched`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        setDraftInvoice(res.data.map((c) => c));
      }
    });
  };

  useEffect(() => {
    fetchDraftInvoice();
  }, []);

  const summaryContent = () => {
    return (
      <div className={css.summaryContainer}>
        <div className={css.summaryInfo}>
          <span className={css.label}>Date Created</span>
          <span className={css.value}>13th September 2021</span>
        </div>
        <div className={css.summaryInfo}>
          <span className={css.label}>Last Updated</span>
          <span className={css.value}>20th September 2021</span>
        </div>
        <div className={css.summaryInfo}>
          <span className={css.label}>ALL FIELDS COMPLETED</span>
          <span className={css.value}>No</span>
        </div>
        <div className={css.summaryInfo}>
          <span className={css.label}>Approved ?</span>
          <span className={css.value}>No</span>
        </div>
        <div className={css.summaryInfo}>
          <span className={css.label}>Delivered?</span>
          <span className={css.value}>No</span>
        </div>
      </div>
    );
  };

  return (
    <div className={css.draftInvoiceContainer}>
      {draftInvoice.map((d) => (
        <Grid
          container
          spacing={3}
          alignItems="center"
          className={css.draftItem}
        >
          <Grid item xs={10} className={css.draftInfo}>
            <span className={css.invoiceTitle}>{d.invoice_number}</span>
            <ArrowRightIcon className={css.arrowIcon} onClick={onOpenSummary} />
          </Grid>
          <Grid item xs={2}>
            <DeleteOutlineOutlinedIcon className={css.deleteIcon} />
          </Grid>
        </Grid>
      ))}

      <DialogContainer
        title="Invoice Summary"
        body={summaryContent()}
        open={openSummary}
        onCancel={onCloseSummary}
        onSubmit={() => {}}
        maxWidth="lg"
        submitText="Open Invoice"
      />
    </div>
  );
};

export default DeclinedInvoiceContainer;
