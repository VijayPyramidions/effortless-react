/* @flow */
/**
 * @fileoverview  Invoice Template Container
 */

import React, { useState, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import { EditIcon, DeleteIcon } from '@components/SvgIcons/SvgIcons.jsx';

import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';

import AppContext from '@root/AppContext.jsx';

import * as css from './CreateInvoiceContainer.scss';

const InvoiceTemplateContainer = () => {
  const {
    organization,
    user,
    changeSubView,
    setActiveInvoiceId,
    enableLoading,
    openSnackBar,
  } = useContext(AppContext);

  const [openSummary, setOpenSummary] = useState(false);
  const [activeItem, setActiveItem] = useState({});
  const [draftInvoice, setDraftInvoice] = useState([]);

  const onOpenSummary = (item) => {
    setActiveItem(item);
    setOpenSummary(true);
  };

  const onCloseSummary = () => {
    setOpenSummary(false);
  };

  const fetchDraftInvoice = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/templates`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        setDraftInvoice(res.data.map((c) => c));
      }
      enableLoading(false);
    });
  };

  const deleteInvoice = (id: string) => {
    RestApi(`organizations/${organization.orgId}/templates/${id}`, {
      method: METHOD.DELETE,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      fetchDraftInvoice();
      if (res && !res.error) {
        openSnackBar({
          message: 'Template Deleted Successfully',
          type: MESSAGE_TYPE.INFO,
        });
      }
    });
  };

  const openInvoice = () => {
    RestApi(`organizations/${organization.orgId}/invoices`, {
      method: METHOD.POST,
      payload: {
        invoice_template_id: activeItem.id,
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res) {
        setActiveInvoiceId({
          activeInvoiceId: res.id,
        });
        changeSubView('invoiceCreateView');
      }
    });
  };

  const editInvoice = (id: string) => {
    changeSubView('invoiceCreateView');
    setActiveInvoiceId({
      activeInvoiceId: id,
      activeInvoiceSubject: 'templates',
    });
  };

  useEffect(() => {
    fetchDraftInvoice();
  }, []);

  const summaryContent = () => {
    return (
      <div className={css.summaryContainer}>
        <div className={css.summaryInfo}>
          <span className={css.label}>Template Name</span>
          <span className={css.value}>{activeItem.template_name}</span>
        </div>
        <div className={css.summaryInfo}>
          <span className={css.label}>Amount</span>
          <span className={css.value}>{activeItem.template_amount}</span>
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
          <Grid
            item
            xs={8}
            className={css.draftInfo}
            onClick={() => {
              onOpenSummary(d);
            }}
          >
            <span className={css.invoiceTitle}>{d.template_name}</span>
            <ArrowRightIcon className={css.arrowIcon} />
          </Grid>
          <Grid item xs={4}>
            <EditIcon
              className={css.editIcon}
              onClick={() => {
                editInvoice(d.id);
              }}
            />
            <DeleteIcon
              className={css.deleteIcon}
              onClick={() => {
                deleteInvoice(d.id);
              }}
            />
          </Grid>
        </Grid>
      ))}

      {draftInvoice.length <= 0 && (
        <Grid
          container
          spacing={3}
          alignItems="center"
          className={css.draftItem}
        >
          <Grid item xs={10} className={css.draftInfo}>
            <span>No Templates found</span>
          </Grid>
        </Grid>
      )}

      <DialogContainer
        title="Invoice Summary"
        body={summaryContent()}
        open={openSummary}
        onCancel={onCloseSummary}
        onSubmit={openInvoice}
        maxWidth="lg"
        submitText="Open Invoice"
      />
    </div>
  );
};

export default InvoiceTemplateContainer;
