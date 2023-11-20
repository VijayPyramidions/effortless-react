import React from 'react';
import * as Router from 'react-router-dom';
import AppContext from '@root/AppContext.jsx';
import { capitalizeFirstLetter } from '@components/utils';
import SignInContainer from '@core/LoginContainer/SignInContainer.jsx';
import SignUpContainer from '@core/LoginContainer/SignUpContainer.jsx';
import VerificationCodeContainer from '@core/LoginContainer/VerificationCodeContainer.jsx';
import FillOrgDetailsContainer from '@core/LoginContainer/FillOrgDetailsContainer.jsx';
import ForgetPasswordContainer from '@core/LoginContainer/ForgotPasswordContainer.jsx';
import DashboardViewContainer from '@core/DashboardView/DashboardViewContainer.jsx';
import DashboardIndex from '@core/DashboardView/DashboardPage/DashboardIndex';
import PageTitle from '@core/DashboardView/PageTitle';
import '@core/DashboardView/DashboardViewContainer.scss';
import DraftInvoiceContainer from '@core/InvoiceView/DraftInvoiceContainer';
import InvoiceView from '@core/InvoiceView/InvoiceViewContainer';
import RecurringInvoiceContainer from '@core/InvoiceView/RecurringInvoiceContainer';
import ApprovedInvoiceContainer from '@core/InvoiceView/UndispatchedInvoiceContainer';
import UnApprovedInvoiceContainer from '@core/InvoiceView/UnApprovedInvoiceContainer';
import CreateInvoiceContainerBeta from '@core/InvoiceView/CreateInvoiceContainerBeta';
import GenerateInvoicePDF from '@core/InvoiceView/GenerateInvoicePdf';
import EWayBillInvoice from '@core/InvoiceView/EWayBillContainer/EWayBillInvoice';
import CreateEWayBill from '@core/InvoiceView/EWayBillContainer/CreateEWayBill';
import GenerateEWayBillPdf from '@core/InvoiceView/EWayBillContainer/GenerateEWayBillPdf';
// import Banking from '@core/Banking/banking';
// import BankList from '@core/Banking/BankList';
// Added by VNS
import BankCategoryDetails from '@core/Banking/Categorization/Bankingcategorizationdetails';
import Categorization from '@core/Banking/Categorization/BankingCategorization.jsx';
import CategorizeTxn from '@core/Banking/Categorization/CategorizeTxn.jsx';
import Support from '@core/Support/Support';

import BankAccontDetails from '@core/Banking/AccountBalance/BankAccontDetails';
// import CategorizeTransactions from '@core/Banking/AccountBalance/CategorizeTransactions';
import Done from '@core/Banking/AccountBalance/Done';
import People from '@core/people/people';
import SuccessPage from '@core/InvoiceView/SuccessPage';
import DeliverInvoiceToCustomer from '@core/InvoiceView/DeliverInvoiceToCustomer';
import RecurringInvoiceHistory from '@core/InvoiceView/RecurringInvoiceHistory';
import BillBookViewContainer from '@core/BillBookView/BillBookViewContainer.jsx';
import UploadYourBillContainer from '@core/BillBookView/UploadYourBillContainer.jsx';
// import RecordAnExpense from '@core/BillBookView/RecordAnExpense.jsx';
import BillsInQueue from '@core/BillBookView/BillsInQueue.jsx';
// import YourBills from '@core/BillBookView/YourBills.jsx';
import DraftBill from '@core/BillBookView/BillsInDraft.jsx';
import SalaryCost from '@core/BillBookView/SalaryCost/SalaryCost.jsx';
import Payments from '@core/PaymentView/Payments.jsx';
import AdvancePayment from '@core/PaymentView/AdvancePayment.jsx';
import MakePayment from '@core/PaymentView/MakePayment.jsx';
import PaymentHistory from '@core/PaymentView/PaymentHistory';
import AccountBalance from '@core/Banking/AccountBalance/AccoutBalance.jsx';
import BankingForms from '@core/Banking/bankingForms.jsx';
import SettingsMenu from '@core/Settings/SettingsMenu.jsx';
import Receivables from '@core/Receivables/Receivables.jsx';
// import Schedule from '@core/Receivables/Schedule/Schedule.jsx';
import SelectedAging from '@core/Receivables/Ageing/SelectedAgeing.jsx';
import RequestPayment from '@core/Receivables/Ageing/RequestPayment.jsx';
import CapturePayment from '@core/Banking/capturePayment';

import Payables from '@core/Payables/Receivables.jsx';
// import Schedule from '@core/Payables/Schedule/Schedule.jsx';
import PaySelectedAging from '@core/Payables/Ageing/SelectedAgeing.jsx';
import PayRequestPayment from '@core/Payables/Ageing/RequestPayment.jsx';

import MultiplePayment from '@core/PaymentView/MultiplePayments/MultiplePayment.jsx';
import DeliverComments from '@core/PaymentView/MultiplePayments/DeliverComments.jsx';
import ApprovalProcessTwo from '@core/PaymentView/MultiplePayments/ApprovalProcessTwo.jsx';
import ApprovedProcessThree from '@core/PaymentView/MultiplePayments/ApprovedProcessThree.jsx';
import ApprovalProcessFour from '@core/PaymentView/MultiplePayments/ApprovalProcessFour.jsx';
import ApprovalProcessFive from '@core/PaymentView/MultiplePayments/ApprovalProcessFive.jsx';
import PaymentsApprovalTwo from '@core/PaymentView/MultiplePayments/PaymentsApprovalTwo.jsx';

// Utility Bills //
import UtilityBills from '@core/BillBookView/UtilityBillsViewContainer';
import Phone from '@core/BillBookView/UtilityBills/Mobile/Phone';
import Electricity from '@core/BillBookView/UtilityBills/Mobile/Electricity';
import Internet from '@core/BillBookView/UtilityBills/Mobile/Internet';
// Utility Bills //

// import TeamSettings from '../core/Settings/TeamSettings/TeamSettings';
import TeamSettingRoles from '../core/Settings/TeamSettings/TeamSettingRoles';
import TeamsRoles from '../core/Settings/TeamSettings/TeamsRoles';
import ReminderSettings from '../core/Settings/ReminderSettings/ReminderSettings';
import ActivityLogs from '../core/Settings/ActivitySettings/ActivityLogs';
import AccountSettings from '../core/Settings/AccountSettings/AccountSettings';
import ExpenseSettings from '../core/Settings/ExpenseSettings/ExpenseSettings';
import InvoiceSettings from '../core/Settings/InvoiceSettings/InvoiceSettings';
import ShareInvoiceOption from '../core/Settings/InvoiceSettings/ShareInvoiceOption';
import EmailSubjectBody from '../core/Settings/InvoiceSettings/EmailSubjectBody';
import OtherPaymentOptions from '../core/Settings/InvoiceSettings/OtherPaymentOptions';
import OtpVerificationCommon from '../core/OtpVerificationCommon';
import Signature from '../core/Settings/InvoiceSettings/Signature';
import TermsAndConditions from '../core/Settings/InvoiceSettings/TermsAndConditions';
import ContactDetailsOnInvoice from '../core/Settings/InvoiceSettings/ContactDetailsOnInvoice';
import InvoiceDesigns from '../core/Settings/InvoiceSettings/InvoiceDesigns';
import AdditionalSettings from '../core/Settings/InvoiceSettings/AdditionalSettings';
import ReceivablesSettings from '../core/Settings/ReceivablesSettings/ReceivablesSettingsMain';
import ReimbursementSettings from '../core/Settings/ReimbursementSettings/ReimbursementSettings';
import RemaindersActionSheet from '../core/Settings/ReceivablesSettings/Components/RemaindersActionSheet';
import EInvoiceSettings from '../core/Settings/InvoiceSettings/E_Invoice_Settings/E_Invoice_Settings';
// import EffortlessPay from '@core/PaymentView/EffortlessPay/EffortlessPay.jsx';
// import Processing from '../PaymentView/MultiplePayments/Processing';
import BulkUpload from '../core/InvoiceView/bulkUpload';
import * as Route from './Private-route';
import AddAndManage from '../core/BillBookView/AddAndManage';
import BusinessDetails from '../core/Settings/UpdateDetails/BusinessDetails';
import MultiplePayments from '../core/PaymentView/MultiplePayments/MultiplePayments';
import MakeAPayment from '../core/PaymentView/PaymentsApproval/MakeAPayment';
import Processing from '../core/PaymentView/PaymentsApproval/Processing';
import AddAndManageEmailList from '../core/BillBookView/AddAndManageEmailList';
import AddAndManageStatement from '../core/BillBookView/AddAndManageStatement';
import RazorPayMerchant from '../core/Settings/InvoiceSettings/RazorPayMerchant';
import CompanyData from '../core/LoginContainer/CompanyData';
import AddNewCompany from '../core/LoginContainer/AddNewCompany';
import { ConnectBanking } from '../core/Banking/ConnectBanking/ConnectBanking';
import GenericQueryForm from '../components/GenericQueryForm/GenericQueryForm';
import MemberReq from '../components/MemberRequest/MemberReq';
import VerifyMember from '../components/VerifyMember/VerifyMember';
import Ippopay from '../core/Banking/Ippopay';
import Report from '../core/ReportView/Report';
// import CategorizeDashboard from '@core/Banking/Categorization/categorizeDashboard.jsx';
import BankingNew from '../core/Banking/NewBanking/Banknew';
import BankStatement from '../core/Banking/NewBanking/Statement/BankStatement';
import LoadMoney from '../core/Banking/NewBanking/Mobile/LoadMoneyMobile';
import WithdrawMoney from '../core/Banking/NewBanking/Mobile/WithdrawMoneyMobile';
import { Service } from './Service.jsx';
import Notification from '../core/Notification/Notification';
import SearchContainer from '../components/AppHeader/SearchContainer.jsx';
import OnBackEventHandle from '../core/OnBackEventHandle';
import LoanFromBanks from '../core/Banking/NewBanking/Mobile/Components/LoanFromBanks';
import LoanDetails from '../core/Banking/NewBanking/Mobile/Components/LoanDetails';
import LoanFromPromoter from '../core/Banking/NewBanking/Mobile/Components/LoanFromPromoter';
import LoanFromOthers from '../core/Banking/NewBanking/Mobile/Components/LoanFromOthers';

import ExpenseRequirementForm from '../core/Reimbursement/Components/ExpenseRequirementForm';
import MilageRequirementForm from '../core/Reimbursement/Components/MileageRequirementForm';
// import TripRequirementForm from '../core/Reimbursement/Components/TripRequirementForm';
// import Reimbursement from '../core/Reimbursement/ReimbursementMain';

//  Reimbursement //
import Reimbursement from '../core/Reimbursement/Reimbursement';
import ReimbursementApproval from '../core/Reimbursement/ReimbursementApproval';
import ReimbursementClaimReview from '../core/Reimbursement/ReimbursementClaimReview';

// new categorization
import CategorizeMain from '../core/Banking/CategorizationNew/CategorizationMain';
import MergeAccountMobile from '../core/Banking/NewBanking/Mobile/Components/MergeAccountMobile';
import TripDetailsView from '../core/Reimbursement/Components/TripDetailsView';
import TripRequirementForm from '../core/Reimbursement/Components/TripRequirementForm';
import {
  PayTripAdvanceForm,
  RequestTripAdvanceForm,
} from '../core/Reimbursement/Components/TripAdvanceForm';
import ReimbursementTripClaimReview from '../core/Reimbursement/ReimbursementTripClaimReview';
import Journal from '../core/BillBookView/Journal/Journal';
// import Agening from '../core/Receivables/Ageing/Ageing';

// Bill Box
import BillBox from '../core/BillBookView/BillBox/BillBoxContainer';
import AccountedBill from '../core/BillBookView/Accounted/AccountedBill';
import MobileAccountedBillCategoryDetails from '../core/BillBookView/Accounted/MobileAccountedBillCategoryDetails';
import EmailBillBox from '../core/BillBookView/BillBox/EmailBillBox';
import TallyReverseSync from '../core/Integration/Tally/TallyReverseSync';
import SyncHistotyDetail from '../core/Integration/Tally/SyncHistotyDetail.jsx';

export default function CommonRoute() {
  const navigate = Router.useNavigate();
  // const reg = /^[a-zA-Z0-9]*$/;
  const redirectUrl = new URLSearchParams(window.location.search);
  const paramsObj = Array.from(redirectUrl.entries()).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {},
  );
  if (paramsObj.redirect_to) {
    window.location.replace(
      paramsObj.redirect_to
        .match(/.{1,2}/g)
        .map((byte) => String.fromCharCode(parseInt(byte, 16)))
        .join(''),
    );
  }
  const url = window.location.pathname;
  const paramsString = window.location.search;
  Service(paramsString, url);
  // const { state } = Router.useLocation();

  const { connect, setConnect, estimateName } = React.useContext(AppContext);

  const device = localStorage?.getItem('device_detect');
  // const pathName = window.location.pathname;

  return Router.useRoutes([
    // page Not Found

    {
      path: '*',
      element: (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ffff',
            fontSize: 50,
            textAlign: 'center',
          }}
        >
          PAGE NOT FOUND!!!
        </div>
      ),
    },

    // Account

    {
      path: '/',
      element: (
        <Route.Private>
          <SignInContainer />
        </Route.Private>
      ),
    },
    {
      path: '/signup',
      element: (
        <Route.Private>
          <SignUpContainer />
        </Route.Private>
      ),
    },
    // {
    //   path: '/companydata',
    //   element: (
    //     <Route.Private>
    //       <CompanyData />
    //     </Route.Private>
    //   ),
    // },
    {
      path: '/forgot-password',
      element: (
        <Route.Private>
          <ForgetPasswordContainer />
        </Route.Private>
      ),
    },
    {
      path: '/verification',
      element: (
        <Route.Private>
          <VerificationCodeContainer />
        </Route.Private>
      ),
    },
    {
      path: '/fill-org-details',
      element: (
        <Route.Private>
          <FillOrgDetailsContainer />
        </Route.Private>
      ),
    },

    {
      path: '/generic-query-form',
      element: (
        <Route.Private>
          <GenericQueryForm />
        </Route.Private>
      ),
    },

    {
      path: '/member-request',
      element: (
        <Route.Private>
          <MemberReq />
        </Route.Private>
      ),
    },

    {
      path: '/verify-member',
      element: (
        <Route.Private>
          <VerifyMember />
        </Route.Private>
      ),
    },

    // Main-Layout
    {
      path: '/*',
      element: (
        <Route.Private protect>
          <DashboardViewContainer />
        </Route.Private>
      ),
      children: [
        // company

        {
          path: 'companydata',
          element: <CompanyData />,
        },

        // dashboard

        {
          path: 'dashboard',
          element: (
            <>
              <PageTitle title="Dashboard" />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainer'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <DashboardIndex />
              </div>
            </>
          ),
        },

        // dashboard

        {
          path: 'onBack',
          element: (
            <>
              <PageTitle title="onBack" />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainer'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <OnBackEventHandle />
              </div>
            </>
          ),
        },

        // Search

        {
          path: 'search',
          element: (
            <>
              <PageTitle title="Search" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <SearchContainer />
              </div>
            </>
          ),
        },

        // invoice

        {
          path: 'invoice',
          element: (
            <>
              <PageTitle
                title="Invoice"
                onClick={() => navigate('/dashboard')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <InvoiceView />
              </div>
            </>
          ),
        },

        // new- invoice

        {
          path: 'invoice-new',
          element: (
            <>
              {/* <PageTitle
                title="New Invoice"
                onClick={() => navigate('/invoice')}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              > */}
              <CreateInvoiceContainerBeta />
              {/* </div> */}
            </>
          ),
        },

        {
          path: 'invoice-new-pdf',
          element: (
            <>
              <PageTitle
                title="New Invoice"
                onClick={() => {
                  navigate('invoice-new', { state: { from: 'pdf' } });
                  // navigate(-1, { state: { from: 'pdf' } });
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <GenerateInvoicePDF />
              </div>
            </>
          ),
        },

        {
          path: 'invoice-new-deliver',
          element: (
            <>
              <PageTitle title="New Invoice" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <DeliverInvoiceToCustomer />
              </div>
            </>
          ),
        },

        // draft invoice

        {
          path: 'invoice-draft',
          element: (
            <>
              <PageTitle
                title="Draft Invoice"
                onClick={() => navigate('/invoice')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <DraftInvoiceContainer />
              </div>
            </>
          ),
        },

        {
          path: 'invoice-draft-new',
          element: (
            <>
              {/* <PageTitle
                title="Draft Invoice"
                onClick={() => navigate('/invoice-draft')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              > */}
              <CreateInvoiceContainerBeta />
              {/* </div> */}
            </>
          ),
        },
        {
          path: 'invoice-draft-pdf',
          element: (
            <>
              <PageTitle
                title="Draft "
                onClick={() => navigate('/invoice-draft')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <GenerateInvoicePDF />
              </div>
            </>
          ),
        },
        // unapproved invoice

        {
          path: 'invoice-unapproved',
          element: (
            <>
              <PageTitle
                title="Unapproved Invoice"
                onClick={() => navigate('/invoice')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <UnApprovedInvoiceContainer />
              </div>
            </>
          ),
        },

        {
          path: 'invoice-unapproved-pdf',
          element: (
            <>
              <PageTitle
                title="Unapproved Invoice"
                onClick={() => navigate('invoice-unapproved')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <GenerateInvoicePDF />
              </div>
            </>
          ),
        },

        {
          path: 'invoice-unapproved-success',
          element: (
            <>
              <PageTitle
                title="Unapproved Invoice"
                onClick={() => navigate('/invoice-unapproved')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <SuccessPage />
              </div>
            </>
          ),
        },

        // approved invoice

        {
          path: 'invoice-approved',
          element: (
            <>
              {/* <PageTitle
                title="Invoices Raised"
                onClick={() => navigate('/invoice')}
              /> */}
              {/* <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              > */}
              <ApprovedInvoiceContainer />
              {/* </div> */}
            </>
          ),
        },

        {
          path: 'ippopay',
          element: (
            <>
              <PageTitle
                title="Invoices Raised"
                onClick={() => {
                  navigate(-1);
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <Ippopay />
              </div>
            </>
          ),
        },

        {
          path: 'invoice-approved-pdf',
          element: (
            <>
              <PageTitle
                title="Approved"
                onClick={() => {
                  // navigate('invoice-approved');
                  navigate(-1);
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <GenerateInvoicePDF />
              </div>
            </>
          ),
        },

        {
          path: 'invoice-approved-deliver',
          element: (
            <>
              <PageTitle title="Invoices Raised" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <DeliverInvoiceToCustomer />
              </div>
            </>
          ),
        },

        // recurring invoice

        {
          path: 'invoice-recurring',
          element: (
            <>
              <PageTitle
                title="Contracts"
                onClick={() => navigate('/invoice')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <RecurringInvoiceContainer />
              </div>
            </>
          ),
        },

        {
          path: 'invoice-recurring-view',
          element: (
            <>
              <PageTitle
                title="Contracts"
                onClick={() => navigate('/invoice-recurring')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <RecurringInvoiceHistory />
              </div>
            </>
          ),
        },
        {
          path: 'invoice-recurring-edit',
          element: (
            <>
              {/* <PageTitle
                title="Recurring Invoice"
                onClick={() => navigate('invoice-recurring')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              > */}
              <CreateInvoiceContainerBeta />
              {/* </div> */}
            </>
          ),
        },

        // estimate

        {
          path: 'invoice-estimate',
          element: (
            <>
              {/* <PageTitle
                title="Estimate"
                onClick={() => navigate('/invoice')}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              > */}
              <CreateInvoiceContainerBeta />
              {/* </div> */}
            </>
          ),
        },

        {
          path: 'invoice-estimate-pdf',
          element: (
            <>
              <PageTitle
                title={capitalizeFirstLetter(estimateName)}
                onClick={() =>
                  navigate('invoice-estimate', { state: { from: 'pdf' } })
                }
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <GenerateInvoicePDF />
              </div>
            </>
          ),
        },

        {
          path: 'invoice-estimate-deliver',
          element: (
            <>
              <PageTitle
                title={capitalizeFirstLetter(estimateName)}
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <DeliverInvoiceToCustomer />
              </div>
            </>
          ),
        },

        {
          path: 'invoice-upload',
          element: (
            <>
              {/* <PageTitle
                title="Upload Invoice"
                onClick={() => navigate('/invoice')}
              /> */}
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <BulkUpload />
              </div>
            </>
          ),
        },
        // {
        //   path: 'invoice-upload/:type',
        //   element: (
        //     <>
        //       <div
        //         className={
        //           device === 'mobile'
        //             ? // ? 'dashboardBodyContainer'
        //               'dashboardBodyContainerhideNavBar'
        //             : 'dashboardBodyContainerDesktop'
        //         }
        //       >
        //         <BulkUpload />
        //       </div>
        //     </>
        //   ),
        // },
        {
          path: 'invoice-e-waybill',
          element: (
            <>
              <PageTitle
                title="E-Way Bills"
                onClick={() => navigate('/invoice')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <EWayBillInvoice />
              </div>
            </>
          ),
        },
        {
          path: 'invoice-e-waybill-new',
          element: (
            <>
              <PageTitle
                title="E-Way Bills"
                onClick={() => navigate('/invoice-e-waybill')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <CreateEWayBill />
              </div>
            </>
          ),
        },
        {
          path: 'invoice-e-waybill-edit',
          element: (
            <>
              <PageTitle
                title="E-Way Bills"
                onClick={() => navigate('/invoice-e-waybill')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <CreateEWayBill />
              </div>
            </>
          ),
        },
        {
          path: 'invoice-e-waybill-pdf',
          element: (
            <>
              <GenerateEWayBillPdf />
            </>
          ),
        },
        // Banking

        {
          path: 'banking',
          element: (
            <>
              <PageTitle
                title="Banking"
                onClick={() => {
                  if (connect) {
                    setConnect(false);
                  } else {
                    navigate('/dashboard');
                  }
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                {/* <Banking />{' '} */}
                <BankingNew />{' '}
              </div>
            </>
          ),
        },
        {
          path: 'banking-statement',
          element: (
            <>
              <PageTitle
                title="Banking Statement"
                onClick={() => {
                  if (connect) {
                    setConnect(false);
                  } else {
                    navigate('/banking');
                  }
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <BankStatement />
              </div>
            </>
          ),
        },
        {
          path: 'banking-load-money',
          element: (
            <>
              <PageTitle
                title="Load Money"
                onClick={() => {
                  if (connect) {
                    setConnect(false);
                  } else {
                    navigate(-1);
                  }
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <LoadMoney />
              </div>
            </>
          ),
        },
        {
          path: 'banking-withdraw-money',
          element: (
            <>
              <PageTitle
                title="Withdraw Money"
                onClick={() => {
                  if (connect) {
                    setConnect(false);
                  } else {
                    navigate(-1);
                  }
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <WithdrawMoney />
              </div>
            </>
          ),
        },
        {
          path: 'banking-merge-account',
          element: (
            <>
              <PageTitle
                title="Merging your Bank Accounts"
                onClick={() => {
                  if (connect) {
                    setConnect(false);
                  } else {
                    navigate(-1);
                  }
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <MergeAccountMobile />
              </div>
            </>
          ),
        },
        {
          path: 'banking-loan-from-banks',
          element: (
            <>
              <PageTitle
                title="Loans from Banks"
                onClick={() => {
                  if (connect) {
                    setConnect(false);
                  } else {
                    navigate(-1);
                  }
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <LoanFromBanks />
              </div>
            </>
          ),
        },
        {
          path: 'banking-loan-from-promoter',
          element: (
            <>
              <PageTitle
                title="Loans from Promoter"
                onClick={() => {
                  if (connect) {
                    setConnect(false);
                  } else {
                    navigate(-1);
                  }
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <LoanFromPromoter />
              </div>
            </>
          ),
        },
        {
          path: 'banking-loan-from-others',
          element: (
            <>
              <PageTitle
                title="Loans from Others"
                onClick={() => {
                  if (connect) {
                    setConnect(false);
                  } else {
                    navigate(-1);
                  }
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <LoanFromOthers />
              </div>
            </>
          ),
        },
        {
          path: 'banking-loan-detail',
          element: (
            <>
              <PageTitle
                title="Loan Details"
                onClick={() => {
                  if (connect) {
                    setConnect(false);
                  } else {
                    navigate(-1);
                  }
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <LoanDetails />
              </div>
            </>
          ),
        },
        {
          path: 'connect-banking',
          element: (
            <>
              {device === 'mobile' ? (
                <Router.Navigate to="/banking" />
              ) : (
                <>
                  <PageTitle
                    title="Connected Banking"
                    onClick={() => navigate('/banking')}
                  />
                  <div
                    className={
                      device === 'mobile'
                        ? // ? 'dashboardBodyContainer'
                          'dashboardBodyContainerhideNavBar'
                        : 'dashboardBodyContainerDesktop'
                    }
                  >
                    {' '}
                    <ConnectBanking />{' '}
                  </div>
                </>
              )}
            </>
          ),
        },
        {
          path: 'banking-virtualAccountOnBoarding',
          element: (
            <>
              <PageTitle
                title="Set Up - Basic Details"
                onClick={() => navigate('/banking')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <BankingForms />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'banking-banklist',
          element: (
            <>
              <PageTitle title="Banking" onClick={() => navigate('/banking')} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'BankList
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <BankingNew />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'banking-banklist-account',
          element: (
            <>
              <PageTitle title="Banking" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <AccountBalance />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'banking-founders-account',
          element: (
            <>
              <PageTitle title="Banking" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <BankAccontDetails />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'banking-categorize-done',
          element: (
            <>
              <PageTitle title="Banking" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <Done />{' '}
              </div>
            </>
          ),
        },

        // {
        //   path: 'banking-categorization',
        //   element: (
        //     <>
        //       <PageTitle title="Banking" onClick={() => navigate(-1)} />
        //       <div
        //         className={
        //           device === 'mobile'
        //             ? // ? 'dashboardBodyContainer'
        //               'dashboardBodyContainerhideNavBar'
        //             : 'dashboardBodyContainerDesktop'
        //         }
        //       >
        //         {' '}
        //         <CategorizeDashboard />{' '}
        //       </div>
        //     </>
        //   ),
        // },

        // People

        {
          path: 'people/*',
          element: (
            <>
              {/* <PageTitle
                title="People"
                onClick={() => navigate('/dashboard')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '} */}
              <People /> {/* </div> */}
            </>
          ),
          children: [
            {
              path: 'generic-query-form',
              element: (
                <>
                  <GenericQueryForm />
                </>
              ),
            },
          ],
        },

        {
          path: 'people-invoice-new',
          element: (
            <>
              {/* <PageTitle
                title="New Invoice"
                onClick={() => navigate('/invoice')}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              > */}
              <CreateInvoiceContainerBeta />
              {/* </div> */}
            </>
          ),
        },

        {
          path: 'people-invoice-new-pdf',
          element: (
            <>
              <PageTitle
                title="New Invoice"
                onClick={() => {
                  navigate('people-invoice-new', { state: { from: 'pdf' } });
                  // navigate(-1, { state: { from: 'pdf' } });
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <GenerateInvoicePDF />
              </div>
            </>
          ),
        },
        {
          path: 'people-invoice-new-deliver',
          element: (
            <>
              <PageTitle title="New Invoice" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <DeliverInvoiceToCustomer />
              </div>
            </>
          ),
        },

        // Bills

        {
          path: 'bill',
          element: (
            <>
              <PageTitle
                title="Expenses"
                onClick={() => navigate('/dashboard')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <BillBookViewContainer />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'bill-upload',
          element: (
            <>
              {/* <PageTitle
                title="Bill Booking"
                onClick={() => navigate('/bill')}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainer'
                    : 'dashboardBodyContainerDesktop'
                }
              > */}{' '}
              <UploadYourBillContainer /> {/* </div> */}
            </>
          ),
        },

        {
          path: 'bill-upload-done',
          element: (
            <>
              <PageTitle
                title="Bill Booking"
                onClick={() => navigate('/bill')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <UploadYourBillContainer />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'bill-utility',
          element: (
            <>
              <PageTitle title="Bill Booking" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <UtilityBills />
              </div>
            </>
          ),
        },

        {
          path: 'bill-utility-phone',
          element: (
            <>
              <PageTitle
                title="Pay Mobile PostPaid"
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <Phone />
              </div>
            </>
          ),
        },

        {
          path: 'bill-utility-electricity',
          element: (
            <>
              <PageTitle title="Electricity" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <Electricity />
              </div>
            </>
          ),
        },

        {
          path: 'bill-utility-internet',
          element: (
            <>
              <PageTitle
                title="Pay Broadband/Landline Bill"
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <Internet />
              </div>
            </>
          ),
        },
        {
          path: 'bill-queue',
          element: (
            <>
              <PageTitle title="Bill Booking" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <BillsInQueue />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'bill-draft',
          element: (
            <>
              <PageTitle title="Bill Booking" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <DraftBill />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'bill-salary',
          element: (
            <>
              <PageTitle title="Bill Booking" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <SalaryCost />{' '}
              </div>
            </>
          ),
        },
        {
          path: 'bill-journal',
          element: (
            <>
              <PageTitle title="Other Journal" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <Journal />
              </div>
            </>
          ),
        },

        // {
        //   path: 'bill-yourbills',
        //   element: (
        // <>
        //   <PageTitle title="Bill Booking" onClick={() => navigate(-1)} />
        //   <div
        //     className={
        //       device === 'mobile'
        //         ? // ? 'dashboardBodyContainer'
        //           'dashboardBodyContainerhideNavBar'
        //         : 'dashboardBodyContainerDesktop'
        //     }
        //   >
        // <YourBills />
        //   {/* </div>
        // </> */}
        //   ),
        // },

        {
          path: 'bill-Add-And-Manage',
          element: (
            <>
              <PageTitle title="Add and Manage" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <AddAndManage />{' '}
              </div>
            </>
          ),
        },
        {
          path: 'bill-Add-And-Manage-EmailList',
          element: (
            <>
              <PageTitle title="Add and Manage" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <AddAndManageEmailList />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'bill-Add-And-Manage-Statement',
          element: (
            <>
              <PageTitle title="Add and Manage" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <AddAndManageStatement />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'bill-box',
          element: (
            <>
              <PageTitle title="BillBox" onClick={() => navigate('/bill')} />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <BillBox />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'bill-box-email',
          element: (
            <>
              {/* <PageTitle
                title="BillBox"
                onClick={() => {
                  navigate('/bill-box');
                }}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              > */}{' '}
              <EmailBillBox /> {/* </div> */}
            </>
          ),
        },

        {
          path: 'bill-accounted',
          element: (
            <>
              <PageTitle title="Accounted Bills" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <AccountedBill />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'bill-accounted-category',
          element: <MobileAccountedBillCategoryDetails />,
        },

        // payments

        {
          path: 'payment',
          element: (
            <>
              <PageTitle
                title="Payments"
                onClick={() => navigate('/dashboard')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <Payments />{' '}
              </div>
            </>
          ),
        },

        {
          path: 'payment-makepayment',
          element: (
            <>
              {/* <PageTitle title="Payments" onClick={() => navigate(-1)} />
              <div className={css.makePaymentContainer}> */}{' '}
              <MakePayment /> {/* </div> */}
            </>
          ),
        },

        {
          path: 'payment-advancepayments',
          element: (
            <>
              {/* <PageTitle title="Payments" onClick={() => navigate(-1)} /> */}
              {/* <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              > */}{' '}
              <AdvancePayment /> {/* </div> */}
            </>
          ),
        },

        {
          path: 'payment-history',
          element: (
            <>
              <PageTitle title="Payments" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <PaymentHistory />{' '}
              </div>
            </>
          ),
        },
        // settings
        {
          path: 'settings',
          element: (
            <>
              <PageTitle
                title="Settings"
                onClick={() => navigate('/dashboard')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <SettingsMenu />
              </div>
            </>
          ),
        },

        {
          path: 'settings-companyData',
          element: (
            <>
              <PageTitle
                title="Setup Company Data"
                onClick={() => navigate('/settings')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <CompanyData />
              </div>
            </>
          ),
        },
        // Notification
        {
          path: 'notification',
          element: (
            <>
              <PageTitle
                title="Notification"
                onClick={() => navigate('/dashboard')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBarandTopBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <Notification />
              </div>
            </>
          ),
        },

        // Receivables

        {
          path: 'receivables',

          element: (
            <>
              <PageTitle
                title="Receivables"
                onClick={() => navigate('/dashboard')}
              />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <Receivables />
              </div>
            </>
          ),
        },

        // {
        //   path: 'Receivables',

        //   element: (
        //     <>
        //       <PageTitle title="Receivables" onClick={() => navigate(-1)} />

        //       <div
        //         className={
        //           device === 'mobile'
        //             ? 'dashboardBodyContainer'
        //             : 'dashboardBodyContainerDesktop'
        //         }
        //       >
        //         {' '}
        //         <Receivables />
        //       </div>
        //     </>
        //   ),
        // },

        // {
        //   path: 'Receivables',

        //   element: (
        //     <>
        //       <PageTitle title="Receivables" onClick={() => navigate(-1)} />

        //       <div
        //         className={
        //           device === 'mobile'
        //             ? 'dashboardBodyContainer'
        //             : 'dashboardBodyContainerDesktop'
        //         }
        //       >
        //         {' '}
        //         <Receivables />
        //       </div>
        //     </>
        //   ),
        // },

        {
          path: 'receivables-ageing',

          element: (
            <>
              <PageTitle
                title="Receivables"
                onClick={() => navigate('/receivables')}
              />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                {/* <Agening /> */}
                <Receivables />
              </div>
            </>
          ),
        },

        {
          path: 'receivables-ageing-view',

          element: (
            <>
              {/* <PageTitle title="Receivables" onClick={() => navigate(-1)} /> */}
              {/* <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
                style={{
                  margin:
                    device === 'desktop' &&
                    pathName === '/receivables-ageing-view'
                      ? 0
                      : '',
                }}
              > */}{' '}
              <SelectedAging />
              {/* </div> */}
            </>
          ),
        },

        {
          path: 'RequestPayment',

          element: (
            <>
              <PageTitle title="Receivables" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainer'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <RequestPayment />
              </div>
            </>
          ),
        },

        {
          path: 'receivables-schedule',

          element: (
            <>
              <PageTitle title="Receivables" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <Receivables />
              </div>
            </>
          ),
        },

        // Payables

        {
          path: 'payables',

          element: (
            <>
              <PageTitle
                title="Payables"
                onClick={() => navigate('/dashboard')}
              />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <Payables />
              </div>
            </>
          ),
        },

        {
          path: 'payables-ageing',

          element: (
            <>
              <PageTitle
                title="Payables"
                onClick={() => navigate('/payables')}
              />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                {/* <Agening /> */}
                <Payables />
              </div>
            </>
          ),
        },

        {
          path: 'payables-ageing-view',

          element: (
            <>
              {/* <PageTitle title="Payables" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
                style={{
                  margin:
                    device === 'desktop' && pathName === '/payables-ageing-view'
                      ? 0
                      : '',
                }}
              > */}{' '}
              <PaySelectedAging />
              {/* </div> */}
            </>
          ),
        },

        {
          path: 'RequestPayment',

          element: (
            <>
              <PageTitle title="Payables" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainer'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <PayRequestPayment />
              </div>
            </>
          ),
        },

        // {
        //   path: 'payables-schedule',

        //   element: (
        //     <>
        //       <PageTitle title="Payables" onClick={() => navigate(-1)} />

        //       <div
        //         className={
        //           device === 'mobile'
        //             ? // ? 'dashboardBodyContainer'
        //               'dashboardBodyContainerhideNavBar'
        //             : 'dashboardBodyContainerDesktop'
        //         }
        //       >
        //         {' '}
        //         <Payables />
        //       </div>
        //     </>
        //   ),
        // },

        {
          path: 'settings-invoiceSettings',
          element: (
            <>
              <PageTitle
                title="Invoice Settings"
                onClick={() => navigate('/settings')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <InvoiceSettings />
              </div>
            </>
          ),
        },
        {
          path: 'settings-AccountSettings',
          element: (
            <>
              <PageTitle
                title="Account Settings"
                onClick={() => navigate('/settings')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <AccountSettings />
              </div>
            </>
          ),
        },

        {
          path: 'settings-ExpenseSettings',
          element: (
            <>
              <PageTitle
                title="Expenses Settings"
                onClick={() => navigate('/settings')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <ExpenseSettings />
              </div>
            </>
          ),
        },

        {
          path: 'settings-reminderSettings',
          element: (
            <>
              <PageTitle
                title="Reminder Settings"
                onClick={() => navigate('/settings')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <ReminderSettings />
              </div>
            </>
          ),
        },
        {
          path: 'settings-teamSettings',
          element: (
            <>
              <PageTitle
                title="Team Settings"
                onClick={() => navigate('/settings')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <TeamSettingRoles />
              </div>
            </>
          ),
        },
        {
          path: 'settings-teamSettings-Role',
          element: (
            <>
              <PageTitle
                title="Team Settings"
                onClick={() => navigate('/settings')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <TeamsRoles />
              </div>
            </>
          ),
        },
        {
          path: 'settings-activity',
          element: (
            <>
              <PageTitle
                title="Activity Logs"
                onClick={() => navigate('/settings')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <ActivityLogs />
              </div>
            </>
          ),
        },
        {
          path: 'settings-invoice-shareInvoiceOptions',
          element: (
            <>
              <PageTitle title="Share Invoice" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <ShareInvoiceOption />
              </div>
            </>
          ),
        },
        {
          path: 'settings-invoice-contactDetails',
          element: (
            <>
              <PageTitle title="Custom Fields" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <ContactDetailsOnInvoice />
              </div>
            </>
          ),
        },
        {
          path: 'settings-invoice-EmailSubjectBody',
          element: (
            <>
              <PageTitle
                title="Email Subject & Body"
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <EmailSubjectBody />
              </div>
            </>
          ),
        },
        {
          path: 'settings-invoice-termsAndConditions',
          element: (
            <>
              <PageTitle
                title="Terms And Conditions"
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <TermsAndConditions />
              </div>
            </>
          ),
        },
        {
          path: 'settings-invoice-signature',
          element: (
            <>
              <PageTitle title="Signature" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <Signature />
              </div>
            </>
          ),
        },
        {
          path: 'settings-razorpay-newCustomer',
          element: (
            <>
              <PageTitle
                title="Razorpay Sub-Merchant"
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <RazorPayMerchant />
              </div>
            </>
          ),
        },
        {
          path: 'settings-razorpay-existingCustomer',
          element: (
            <>
              <PageTitle
                title="Razorpay Sub-Merchant"
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <RazorPayMerchant />
              </div>
            </>
          ),
        },

        {
          path: 'settings-invoiceDesigns',
          element: (
            <>
              <PageTitle title="Invoice Designs" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <InvoiceDesigns />
              </div>
            </>
          ),
        },
        {
          path: 'settings-invoice-additionalSettings',
          element: (
            <>
              <PageTitle
                title="Additional Settings"
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <AdditionalSettings />
              </div>
            </>
          ),
        },
        {
          path: 'settings-e-invoice',
          element: (
            <>
              <PageTitle
                title="E-Invoice Settings"
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <EInvoiceSettings />
              </div>
            </>
          ),
        },
        {
          path: 'settings-BusinessDetails',
          element: (
            <>
              {/* <PageTitle
                title="Business Details"
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '} */}
              <BusinessDetails />
              {/* </div> */}
            </>
          ),
        },

        {
          path: 'support',
          element: (
            <>
              <PageTitle
                title="Help & Support"
                onClick={() => navigate('/dashboard')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <Support />
              </div>
            </>
          ),
        },

        {
          path: 'settings-OtherPaymentOptions',
          element: (
            <>
              <PageTitle title="Other Payments" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <OtherPaymentOptions />
              </div>
            </>
          ),
        },
        {
          path: 'settings-receivables',
          element: (
            <>
              <PageTitle
                title="Receivables Settings"
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <ReceivablesSettings />
              </div>
            </>
          ),
        },
        {
          path: 'settings-reimbursement-policy',
          element: (
            <>
              <PageTitle title="Reimbursement" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <ReimbursementSettings />
              </div>
            </>
          ),
        },
        {
          path: 'settings-receivables-action',
          element: (
            <>
              <PageTitle title="Reminder" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <RemaindersActionSheet />
              </div>
            </>
          ),
        },
        // Others

        {
          path: 'capture-payment',

          element: (
            <>
              {/* <PageTitle title="Receivables" onClick={() => navigate(-1)} /> */}

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <CapturePayment />
              </div>
            </>
          ),
        },

        {
          path: 'otp-verification',

          element: (
            <>
              {/* <PageTitle title="Receivables" onClick={() => navigate(-1)} /> */}

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <OtpVerificationCommon />
              </div>
            </>
          ),
        },

        // multiplePayments

        {
          path: 'multiple-payments',

          element: (
            <>
              <PageTitle title="Receivables" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <MultiplePayments />
              </div>
            </>
          ),
        },

        {
          path: 'multiple-payment',

          element: (
            <>
              <PageTitle title="Receivables" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <MultiplePayment />
              </div>
            </>
          ),
        },
        {
          path: 'deliver-comments',

          element: (
            <>
              <PageTitle title="Receivables" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <DeliverComments />
              </div>
            </>
          ),
        },
        {
          path: 'approval-process2',

          element: (
            <>
              <PageTitle title="Receivables" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <ApprovalProcessTwo />
              </div>
            </>
          ),
        },
        {
          path: 'approved-process-3',

          element: (
            <>
              <PageTitle title="Receivables" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <ApprovedProcessThree />
              </div>
            </>
          ),
        },

        {
          path: 'approval-process-4',

          element: (
            <>
              <PageTitle title="Receivables" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <ApprovalProcessFour />
              </div>
            </>
          ),
        },

        {
          path: 'approval-process-5',

          element: (
            <>
              <PageTitle title="Receivables" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <ApprovalProcessFive />
              </div>
            </>
          ),
        },

        {
          path: 'payments-approval-2',

          element: (
            <>
              <PageTitle title="Receivables" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <PaymentsApprovalTwo />
              </div>
            </>
          ),
        },

        // new payments approval flow
        {
          path: 'make-a-payment',

          element: (
            <>
              <PageTitle title="Make A Payment" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <MakeAPayment />
              </div>
            </>
          ),
        },
        {
          path: 'payment-processing',

          element: (
            <>
              <PageTitle title="Make A Payment" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <Processing />
              </div>
            </>
          ),
        },

        // AddNewCompany

        {
          path: 'add-new-organization',

          element: (
            <>
              <PageTitle title="Add New Company" onClick={() => navigate(-1)} />

              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <AddNewCompany />
              </div>
            </>
          ),
        },
        {
          // Added by VNS
          path: 'bankingcategorizeddetails',
          element: (
            <>
              <PageTitle
                title="Banking Categorization"
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'BankList
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <BankCategoryDetails />{' '}
              </div>
            </>
          ),
        },
        {
          path: 'bankingcategorization',
          element: (
            <>
              {/* <PageTitle
                title="Categorization"
                onClick={() => navigate('/banking')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'BankList
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '} */}
              <Categorization />
              {/* </div> */}
            </>
          ), // Added by VNS
        },
        {
          path: 'banking-categorization',
          element: (
            <>
              <CategorizeMain />
            </>
          ),
        },

        {
          path: 'categorize-txn',
          element: (
            <>
              <PageTitle
                title="Categorization"
                onClick={() => navigate('/banking')}
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'BankList
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <CategorizeTxn />{' '}
              </div>
            </>
          ), // Added by VNS
        },

        // reverse sync
        {
          path: 'integration-tally',
          element: (
            <>
              <PageTitle title="Integration" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'BankList
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <TallyReverseSync />
              </div>
            </>
          ),
        },
        {
          path: 'integration-tally-history',
          element: (
            <>
              <PageTitle
                title="History"
                onClick={() =>
                  navigate('/integration-tally', { state: { tab: 'History' } })
                }
              />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'BankList
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <SyncHistotyDetail />
              </div>
            </>
          ),
        },
        {
          path: 'integration-tally',
          element: (
            <>
              <PageTitle title="Integration" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'BankList
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <TallyReverseSync />
              </div>
            </>
          ),
        },
        {
          path: 'report',
          element: (
            <>
              <PageTitle title="Report" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? // ? 'dashboardBodyContainer'BankList
                      'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                {' '}
                <Report />{' '}
              </div>
            </>
          ),
        },

        // reimbursement
        {
          path: 'reimbursement',
          element: (
            <>
              <PageTitle
                title="Reimbursement"
                onClick={() => navigate('/dashboard')}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <Reimbursement />
              </div>
            </>
          ),
        },

        {
          path: 'reimbursement-expense',
          element: (
            <>
              <PageTitle
                title="Expense Reimbursement"
                onClick={() => navigate(-1)}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <ExpenseRequirementForm />
              </div>
            </>
          ),
        },
        {
          path: 'reimbursement-mileage',
          element: (
            <>
              <PageTitle
                title="Mileage Reimbursement"
                onClick={() => navigate('/reimbursement')}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <MilageRequirementForm />
              </div>
            </>
          ),
        },
        {
          path: 'reimbursement-trip',
          element: (
            <>
              <PageTitle
                title="Your Trip"
                onClick={() => navigate('/reimbursement')}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <TripRequirementForm />
              </div>
            </>
          ),
        },
        {
          path: 'reimbursement-trip-claim',
          element: (
            <>
              <PageTitle
                title="Trip Claim"
                onClick={() => navigate('/reimbursement-trip')}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <TripDetailsView />
              </div>
            </>
          ),
        },
        {
          path: 'reimbursement-trip-approval',
          element: (
            <>
              <PageTitle title="Trip Claim" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <ReimbursementTripClaimReview />
              </div>
            </>
          ),
        },
        {
          path: 'reimbursement-trip-advance-request',
          element: (
            <>
              <PageTitle title="Request Advance" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <RequestTripAdvanceForm />
              </div>
            </>
          ),
        },
        {
          path: 'reimbursement-trip-advance-pay',
          element: (
            <>
              <PageTitle title="Pay Advance" onClick={() => navigate(-1)} />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <PayTripAdvanceForm />
              </div>
            </>
          ),
        },
        {
          path: 'reimbursement-approval',
          element: (
            <>
              <PageTitle
                title="Claim Approval"
                onClick={() => navigate('/reimbursement')}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <ReimbursementApproval />
              </div>
            </>
          ),
        },
        {
          path: 'reimbursement-claim-review',
          element: (
            <>
              <PageTitle
                title="Claim Review"
                onClick={() => navigate('/reimbursement-approval')}
              />
              <div
                className={
                  device === 'mobile'
                    ? 'dashboardBodyContainerhideNavBar'
                    : 'dashboardBodyContainerDesktop'
                }
              >
                <ReimbursementClaimReview />
              </div>
            </>
          ),
        },
      ],
    },
  ]);
}
