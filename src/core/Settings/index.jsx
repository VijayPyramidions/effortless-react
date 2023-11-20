import React, { useContext } from 'react';
import AppContext from '@root/AppContext.jsx';
import PageTitle from '@core/DashboardView/PageTitle.jsx';
import SettingsMenu from './SettingsMenu.jsx';
import InvoiceSettings from './InvoiceSettings/InvoiceSettings';
import * as css from './SettingsMenu.scss';
import InvoiceDesigns from './InvoiceSettings/InvoiceDesigns.jsx';
import ContactDetailsOnInvoice from './InvoiceSettings/ContactDetailsOnInvoice.jsx';
import TermsAndConditions from './InvoiceSettings/TermsAndConditions.jsx';
import Signature from './InvoiceSettings/Signature.jsx';
import OtherPaymentOptions from './InvoiceSettings/OtherPaymentOptions.jsx';
import AdditionalSettings from './InvoiceSettings/AdditionalSettings.jsx';
import BusinessDetails from './UpdateDetails/BusinessDetails.jsx';
import AccountSettings from './AccountSettings/AccountSettings.jsx';
import ReminderSettings from './ReminderSettings/ReminderSettings.jsx';
import TeamSettings from './TeamSettings/TeamSettings.jsx';
import EmailSubjectBody from './InvoiceSettings/EmailSubjectBody.jsx';
import ShareInvoiceOption from './InvoiceSettings/ShareInvoiceOption.jsx';

function index() {
  const { changeSubView, subView } = useContext(AppContext);

  return (
    <>
      {subView === 'settings' && (
        <>
          <PageTitle title="Settings" onClick={() => changeSubView('')} />
          <div className={css.dashboardBodyContainer}>
            <SettingsMenu />
          </div>
        </>
      )}

      {subView === 'businessDetails' && (
        <>
          <PageTitle
            title="Business Details"
            onClick={() => changeSubView('settings')}
          />
          <div className={css.dashboardBodyContainer}>
            <BusinessDetails />
          </div>
        </>
      )}

      {subView === 'invoiceSettings' && (
        <>
          <PageTitle
            title="Invoice Settings"
            onClick={() => changeSubView('settings')}
          />
          <div className={css.dashboardBodyContainer}>
            <InvoiceSettings />
          </div>
        </>
      )}

      {subView === 'invoiceDesigns' && (
        <>
          <PageTitle
            title="Invoice Designs"
            onClick={() => changeSubView('invoiceSettings')}
          />
          <div className={css.dashboardBodyContainer}>
            <InvoiceDesigns />
          </div>
        </>
      )}

      {subView === 'contactDetailsOnInvoice' && (
        <>
          <PageTitle
            title="Custom Fields"
            onClick={() => changeSubView('invoiceSettings')}
          />
          <div className={css.dashboardBodyContainer}>
            <ContactDetailsOnInvoice />
          </div>
        </>
      )}

      {subView === 'termsAndConditions' && (
        <>
          <PageTitle
            title="Terms and Conditions"
            onClick={() => changeSubView('invoiceSettings')}
          />
          <div className={css.dashboardBodyContainer}>
            <TermsAndConditions />
          </div>
        </>
      )}

      {subView === 'signature' && (
        <>
          <PageTitle
            title="Signature"
            onClick={() => changeSubView('invoiceSettings')}
          />
          <div className={css.dashboardBodyContainer}>
            <Signature />
          </div>
        </>
      )}

      {subView === 'otherPaymentOptions' && (
        <>
          <PageTitle
            title="Other Payments"
            onClick={() => changeSubView('invoiceSettings')}
          />
          <div className={css.dashboardBodyContainer}>
            <OtherPaymentOptions />
          </div>
        </>
      )}

      {subView === 'additionalSettings' && (
        <>
          <PageTitle
            title="Additional Settings"
            onClick={() => changeSubView('invoiceSettings')}
          />
          <div className={css.dashboardBodyContainer}>
            <AdditionalSettings />
          </div>
        </>
      )}
      {subView === 'emailSubjectBody' && (
        <>
          <PageTitle
            title="Email Subject & Body"
            onClick={() => changeSubView('additionalSettings')}
          />
          <div className={css.dashboardBodyContainer}>
            <EmailSubjectBody />
          </div>
        </>
      )}
      {subView === 'shareInvoiceOptions' && (
        <>
          <PageTitle
            title="Share Invoice Option"
            onClick={() => changeSubView('additionalSettings')}
          />
          <div className={css.dashboardBodyContainer}>
            <ShareInvoiceOption />
          </div>
        </>
      )}
      {subView === 'accountSettings' && (
        <>
          <PageTitle
            title="Account Settings"
            onClick={() => changeSubView('settings')}
          />
          <div className={css.dashboardBodyContainer}>
            <AccountSettings />
          </div>
        </>
      )}
      {subView === 'reminderSettings' && (
        <>
          <PageTitle
            title="Reminder Settings"
            onClick={() => changeSubView('settings')}
          />
          <div className={css.dashboardBodyContainer}>
            <ReminderSettings />
          </div>
        </>
      )}
      {subView === 'teamSettings' && (
        <>
          <PageTitle
            title="Team Settings"
            onClick={() => changeSubView('settings')}
          />
          <div className={css.dashboardBodyContainer}>
            <TeamSettings />
          </div>
        </>
      )}
    </>
  );
}

export default index;
