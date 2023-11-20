/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable array-callback-return */
/* @flow */
/**
 * @fileoverview  Invoice options container
 */

import React, { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { capitalizeFirstLetter } from '@components/utils';
import {
  GetInvoiceDashboardState,
  GetInvoiceDashboardStateForCustomer,
  ClearStateInvoiceDashboardForCustomer,
} from '@action/Store/Reducers/Invoice/InvoiceState';
import moment from 'moment';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import * as Mui from '@mui/material';
import { styled } from '@material-ui/core/styles';
import AppContext from '@root/AppContext.jsx';
import SvgIcon from '@material-ui/core/SvgIcon';
import SmallVector from '@assets/SmallVector.png';
import * as Router from 'react-router-dom';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
// import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import { METHOD, BASE_URL } from '@services/RestApi.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { Link } from '@mui/material';
import * as css from './InvoiceViewContainer.scss';

const DraftInvoiceIcon = (props) => {
  return (
    <SvgIcon width="15" height="14" viewBox="0 0 15 14" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 6.56295C0 6.31434 0.0987612 6.07591 0.274557 5.90011C0.450353 5.72432 0.688783 5.62556 0.937395 5.62556H11.7981L7.77288 1.60226C7.59686 1.42624 7.49798 1.18751 7.49798 0.93858C7.49798 0.689653 7.59686 0.450922 7.77288 0.274904C7.9489 0.098886 8.18763 0 8.43656 0C8.68548 0 8.92422 0.098886 9.10023 0.274904L14.7246 5.89928C14.8119 5.98635 14.8812 6.08979 14.9284 6.20368C14.9757 6.31756 15 6.43965 15 6.56295C15 6.68625 14.9757 6.80834 14.9284 6.92222C14.8812 7.03611 14.8119 7.13955 14.7246 7.22663L9.10023 12.851C8.92422 13.027 8.68548 13.1259 8.43656 13.1259C8.18763 13.1259 7.9489 13.027 7.77288 12.851C7.59686 12.675 7.49798 12.4362 7.49798 12.1873C7.49798 11.9384 7.59686 11.6997 7.77288 11.5236L11.7981 7.50035H0.937395C0.688783 7.50035 0.450353 7.40159 0.274557 7.22579C0.0987612 7.04999 0 6.81156 0 6.56295Z"
        fill="black"
      />
    </SvgIcon>
  );
};

const InvoiceBetaIcon = (props) => (
  <SvgIcon width="44" height="44" viewBox="0 0 44 44" fill="none" {...props}>
    <g fill="none">
      <circle cx="22" cy="22" r="22" fill="white" />
      <path
        d="M30.515 15.4521L26.0534 10.986C25.8483 10.7809 25.5703 10.667 25.2786 10.667H25.0006V16.5003H30.834V16.2223C30.834 15.9352 30.72 15.6572 30.515 15.4521ZM23.5423 16.8649V10.667H14.4277C13.8216 10.667 13.334 11.1546 13.334 11.7607V32.9066C13.334 33.5127 13.8216 34.0003 14.4277 34.0003H29.7402C30.3464 34.0003 30.834 33.5127 30.834 32.9066V17.9587H24.6361C24.0345 17.9587 23.5423 17.4665 23.5423 16.8649ZM16.2507 13.9482C16.2507 13.7468 16.4138 13.5837 16.6152 13.5837H20.2611C20.4625 13.5837 20.6256 13.7468 20.6256 13.9482V14.6774C20.6256 14.8788 20.4625 15.042 20.2611 15.042H16.6152C16.4138 15.042 16.2507 14.8788 16.2507 14.6774V13.9482ZM16.2507 17.5941V16.8649C16.2507 16.6635 16.4138 16.5003 16.6152 16.5003H20.2611C20.4625 16.5003 20.6256 16.6635 20.6256 16.8649V17.5941C20.6256 17.7955 20.4625 17.9587 20.2611 17.9587H16.6152C16.4138 17.9587 16.2507 17.7955 16.2507 17.5941ZM22.8131 29.6199V30.7191C22.8131 30.9205 22.65 31.0837 22.4486 31.0837H21.7194C21.518 31.0837 21.3548 30.9205 21.3548 30.7191V29.6121C20.8403 29.5857 20.3399 29.4061 19.9252 29.0949C19.7475 28.9613 19.7383 28.6952 19.8992 28.5416L20.4347 28.0307C20.5609 27.9104 20.7487 27.9049 20.8964 27.9975C21.0727 28.1077 21.2728 28.167 21.4806 28.167H22.7617C23.0579 28.167 23.2994 27.8972 23.2994 27.5659C23.2994 27.2947 23.1349 27.0559 22.8997 26.9857L20.849 26.3705C20.0018 26.1162 19.4098 25.3032 19.4098 24.3931C19.4098 23.2757 20.2779 22.3678 21.3544 22.3391V21.2399C21.3544 21.0385 21.5175 20.8753 21.7189 20.8753H22.4481C22.6495 20.8753 22.8127 21.0385 22.8127 21.2399V22.3469C23.3272 22.3733 23.8276 22.5524 24.2423 22.8641C24.4201 22.9977 24.4292 23.2638 24.2683 23.4174L23.7328 23.9283C23.6066 24.0486 23.4188 24.054 23.2712 23.9615C23.0948 23.8508 22.8947 23.792 22.6869 23.792H21.4059C21.1096 23.792 20.8681 24.0618 20.8681 24.3931C20.8681 24.6643 21.0326 24.9031 21.2678 24.9732L23.3186 25.5885C24.1658 25.8428 24.7577 26.6558 24.7577 27.5659C24.7577 28.6838 23.8896 29.5911 22.8131 29.6199Z"
        fill="#2F9682"
      />
      <circle cx="28.6118" cy="31.815" r="2.13333" fill="#2F9682" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.3992 28.4019C26.6319 28.4019 25.1992 29.8346 25.1992 31.6019C25.1992 33.3691 26.6319 34.8019 28.3992 34.8019C30.1665 34.8019 31.5992 33.3691 31.5992 31.6019C31.5992 29.8346 30.1665 28.4019 28.3992 28.4019ZM28.6901 32.7655C28.6901 32.8426 28.6595 32.9166 28.6049 32.9712C28.5504 33.0258 28.4764 33.0564 28.3992 33.0564C28.3221 33.0564 28.2481 33.0258 28.1935 32.9712C28.139 32.9166 28.1083 32.8426 28.1083 32.7655V31.8928H27.2356C27.1584 31.8928 27.0844 31.8621 27.0299 31.8076C26.9753 31.753 26.9447 31.679 26.9447 31.6019C26.9447 31.5247 26.9753 31.4507 27.0299 31.3962C27.0844 31.3416 27.1584 31.3109 27.2356 31.3109H28.1083V30.4382C28.1083 30.3611 28.139 30.2871 28.1935 30.2325C28.2481 30.178 28.3221 30.1473 28.3992 30.1473C28.4764 30.1473 28.5504 30.178 28.6049 30.2325C28.6595 30.2871 28.6901 30.3611 28.6901 30.4382V31.3109H29.5629C29.64 31.3109 29.714 31.3416 29.7686 31.3962C29.8231 31.4507 29.8538 31.5247 29.8538 31.6019C29.8538 31.679 29.8231 31.753 29.7686 31.8076C29.714 31.8621 29.64 31.8928 29.5629 31.8928H28.6901V32.7655Z"
        fill="white"
      />
    </g>
  </SvgIcon>
);

// const NewInvoiceIcon = (props) => {
//   return (
//     <SvgIcon width="16" height="16" viewBox="0 0 16 16" {...props}>
//       <path
//         d="M8 0C8.26522 0 8.51957 0.105357 8.70711 0.292893C8.89464 0.48043 9 0.734784 9 1V7H15C15.2652 7 15.5196 7.10536 15.7071 7.29289C15.8946 7.48043 16 7.73478 16 8C16 8.26522 15.8946 8.51957 15.7071 8.70711C15.5196 8.89464 15.2652 9 15 9H9V15C9 15.2652 8.89464 15.5196 8.70711 15.7071C8.51957 15.8946 8.26522 16 8 16C7.73478 16 7.48043 15.8946 7.29289 15.7071C7.10536 15.5196 7 15.2652 7 15V9H1C0.734784 9 0.48043 8.89464 0.292893 8.70711C0.105357 8.51957 0 8.26522 0 8C0 7.73478 0.105357 7.48043 0.292893 7.29289C0.48043 7.10536 0.734784 7 1 7H7V1C7 0.734784 7.10536 0.48043 7.29289 0.292893C7.48043 0.105357 7.73478 0 8 0V0Z"
//         fill="black"
//       />
//     </SvgIcon>
//   );
// };

const DescIcon = (props) => {
  return (
    <SvgIcon width="15" height="19" viewBox="0 0 15 19" fill="none" {...props}>
      <path
        d="M2.375 10.0938C2.375 9.93628 2.43756 9.78525 2.54891 9.6739C2.66026 9.56256 2.81128 9.5 2.96875 9.5C3.12622 9.5 3.27724 9.56256 3.38859 9.6739C3.49994 9.78525 3.5625 9.93628 3.5625 10.0938C3.5625 10.2512 3.49994 10.4022 3.38859 10.5136C3.27724 10.6249 3.12622 10.6875 2.96875 10.6875C2.81128 10.6875 2.66026 10.6249 2.54891 10.5136C2.43756 10.4022 2.375 10.2512 2.375 10.0938ZM2.96875 11.875C2.81128 11.875 2.66026 11.9376 2.54891 12.0489C2.43756 12.1603 2.375 12.3113 2.375 12.4688C2.375 12.6262 2.43756 12.7772 2.54891 12.8886C2.66026 12.9999 2.81128 13.0625 2.96875 13.0625C3.12622 13.0625 3.27724 12.9999 3.38859 12.8886C3.49994 12.7772 3.5625 12.6262 3.5625 12.4688C3.5625 12.3113 3.49994 12.1603 3.38859 12.0489C3.27724 11.9376 3.12622 11.875 2.96875 11.875ZM2.375 14.8438C2.375 14.6863 2.43756 14.5353 2.54891 14.4239C2.66026 14.3126 2.81128 14.25 2.96875 14.25C3.12622 14.25 3.27724 14.3126 3.38859 14.4239C3.49994 14.5353 3.5625 14.6863 3.5625 14.8438C3.5625 15.0012 3.49994 15.1522 3.38859 15.2636C3.27724 15.3749 3.12622 15.4375 2.96875 15.4375C2.81128 15.4375 2.66026 15.3749 2.54891 15.2636C2.43756 15.1522 2.375 15.0012 2.375 14.8438ZM5.34375 9.5C5.18628 9.5 5.03525 9.56256 4.9239 9.6739C4.81256 9.78525 4.75 9.93628 4.75 10.0938C4.75 10.2512 4.81256 10.4022 4.9239 10.5136C5.03525 10.6249 5.18628 10.6875 5.34375 10.6875H11.2812C11.4387 10.6875 11.5897 10.6249 11.7011 10.5136C11.8124 10.4022 11.875 10.2512 11.875 10.0938C11.875 9.93628 11.8124 9.78525 11.7011 9.6739C11.5897 9.56256 11.4387 9.5 11.2812 9.5H5.34375ZM4.75 12.4688C4.75 12.3113 4.81256 12.1603 4.9239 12.0489C5.03525 11.9376 5.18628 11.875 5.34375 11.875H11.2812C11.4387 11.875 11.5897 11.9376 11.7011 12.0489C11.8124 12.1603 11.875 12.3113 11.875 12.4688C11.875 12.6262 11.8124 12.7772 11.7011 12.8886C11.5897 12.9999 11.4387 13.0625 11.2812 13.0625H5.34375C5.18628 13.0625 5.03525 12.9999 4.9239 12.8886C4.81256 12.7772 4.75 12.6262 4.75 12.4688ZM5.34375 14.25C5.18628 14.25 5.03525 14.3126 4.9239 14.4239C4.81256 14.5353 4.75 14.6863 4.75 14.8438C4.75 15.0012 4.81256 15.1522 4.9239 15.2636C5.03525 15.3749 5.18628 15.4375 5.34375 15.4375H11.2812C11.4387 15.4375 11.5897 15.3749 11.7011 15.2636C11.8124 15.1522 11.875 15.0012 11.875 14.8438C11.875 14.6863 11.8124 14.5353 11.7011 14.4239C11.5897 14.3126 11.4387 14.25 11.2812 14.25H5.34375ZM2.375 0C1.74511 0 1.14102 0.250222 0.695621 0.695621C0.250222 1.14102 0 1.74511 0 2.375V16.625C0 17.2549 0.250222 17.859 0.695621 18.3044C1.14102 18.7498 1.74511 19 2.375 19H11.875C12.5049 19 13.109 18.7498 13.5544 18.3044C13.9998 17.859 14.25 17.2549 14.25 16.625V6.42912C14.2496 5.95687 14.0616 5.5041 13.7275 5.17037L9.07963 0.521312C8.7457 0.187603 8.29296 0.000100797 7.82088 0H2.375ZM1.1875 2.375C1.1875 2.06006 1.31261 1.75801 1.53531 1.53531C1.75801 1.31261 2.06006 1.1875 2.375 1.1875H7.125V5.34375C7.125 5.81617 7.31267 6.26924 7.64672 6.60328C7.98076 6.93733 8.43383 7.125 8.90625 7.125H13.0625V16.625C13.0625 16.9399 12.9374 17.242 12.7147 17.4647C12.492 17.6874 12.1899 17.8125 11.875 17.8125H2.375C2.06006 17.8125 1.75801 17.6874 1.53531 17.4647C1.31261 17.242 1.1875 16.9399 1.1875 16.625V2.375ZM12.8167 5.9375H8.90625C8.74878 5.9375 8.59775 5.87494 8.4864 5.76359C8.37506 5.65225 8.3125 5.50122 8.3125 5.34375V1.43331L12.8167 5.9375Z"
        fill="black"
      />
    </SvgIcon>
  );
};

// eslint-disable-next-line no-unused-vars
const TemplateGalleryIcon = (props) => {
  return (
    <SvgIcon width="20" height="17" viewBox="0 0 20 17" fill="none" {...props}>
      <path
        d="M0 4.87057V12.8098C0 13.6585 0.337142 14.4724 0.937258 15.0725C1.53737 15.6726 2.35131 16.0098 3.2 16.0098H16C16.8487 16.0098 17.6626 15.6726 18.2627 15.0725C18.8629 14.4724 19.2 13.6585 19.2 12.8098V3.20977C19.2 2.36107 18.8629 1.54714 18.2627 0.947024C17.6626 0.346907 16.8487 0.00976563 16 0.00976562H3.2C2.35131 0.00976563 1.53737 0.346907 0.937258 0.947024C0.337142 1.54714 0 2.36107 0 3.20977V4.87057ZM3.2 1.60977H16C16.4243 1.60977 16.8313 1.77834 17.1314 2.0784C17.4314 2.37845 17.6 2.78542 17.6 3.20977V4.39377L9.6 8.70097L1.6 4.39377V3.20977C1.6 2.78542 1.76857 2.37845 2.06863 2.0784C2.36869 1.77834 2.77565 1.60977 3.2 1.60977ZM1.6 6.21137L9.2208 10.3138C9.33735 10.3765 9.46764 10.4093 9.6 10.4093C9.73236 10.4093 9.86265 10.3765 9.9792 10.3138L17.6 6.21137V12.8098C17.6 13.2341 17.4314 13.6411 17.1314 13.9411C16.8313 14.2412 16.4243 14.4098 16 14.4098H3.2C2.77565 14.4098 2.36869 14.2412 2.06863 13.9411C1.76857 13.6411 1.6 13.2341 1.6 12.8098V6.21137Z"
        fill="black"
      />
    </SvgIcon>
  );
};

const RecurringInvIcon = (props) => {
  return (
    <SvgIcon width="13" height="22" viewBox="0 0 13 22" fill="none" {...props}>
      <path
        d="M10.5 0H2.5C1.83696 0 1.20107 0.263392 0.732233 0.732233C0.263392 1.20107 0 1.83696 0 2.5V19.5C0 20.163 0.263392 20.7989 0.732233 21.2678C1.20107 21.7366 1.83696 22 2.5 22H10.5C11.163 22 11.7989 21.7366 12.2678 21.2678C12.7366 20.7989 13 20.163 13 19.5V2.5C13 1.83696 12.7366 1.20107 12.2678 0.732233C11.7989 0.263392 11.163 0 10.5 0ZM6.5 21C5.67 21 5 20.33 5 19.5C5 18.67 5.67 18 6.5 18C7.33 18 8 18.67 8 19.5C8 20.33 7.33 21 6.5 21ZM11 17H2V3H11V17Z"
        fill="black"
        fillOpacity="0.9"
      />
    </SvgIcon>
  );
};

const ClipboardIcon = (props) => (
  <SvgIcon width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <g fill="none">
      <path
        d="M15 3L18 3V3C18.5523 3 19 3.44772 19 4V4L19 20V20C19 20.5523 18.5523 21 18 21L6 21V21C5.44772 21 5 20.5523 5 20L5 4V4C5 3.44772 5.44772 3 6 3L9 3"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="15"
        y="2"
        width="2"
        height="6"
        rx="1"
        transform="rotate(90 15 2)"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </SvgIcon>
);

const Puller = styled(Mui.Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

export const InvoiceViewContainer = () => {
  const {
    changeSubView,
    setActiveInvoiceId,
    organization,
    user,
    // openSnackBar,
    // enableLoading,
    userPermissions,
    estimateName,
  } = useContext(AppContext);

  const INVOICE_TYPES = [
    {
      text: 'Tax Invoice',
      payload: 'tax_invoice',
    },
    {
      text: `${capitalizeFirstLetter(estimateName)}`,
      payload: 'estimate',
    },
    {
      text: 'Credit Note',
      payload: 'credit_note',
    },
    {
      text: 'Debit Note',
      payload: 'debit_note',
    },
    // {
    //   text: 'Receipt Voucher',
    //   payload: 'receipt_voucher',
    // },
    // {
    //   text: 'Refund Voucher',
    //   payload: 'refund_voucher',
    // },
    // {
    //   text: 'Reimbursement Note',
    //   payload: 'reimbursement_note',
    // },
    // {
    //   text: 'Credit Note without GST',
    //   payload: 'credit_note_without_gst',
    // },
  ];
  const dispatch = useDispatch();
  const {
    invoiceDashboardState,
    invoiceDashboardStateForCustomer,
    dashboardLoad,
  } = useSelector((value) => value.Invoice);
  const [html, sethtml] = useState();
  const navigate = Router.useNavigate();
  const invoiceViewOptions = [
    // {
    //   icon: (
    //     <div className={css.iconWrapper}>
    //       <NewInvoiceIcon className={css.icons} />
    //     </div>
    //   ),
    //   title: 'New Invoice',
    //   desc: <>Create a new Invoice and save it for future use</>,
    //   onClick: () => {
    //     setActiveInvoiceId({
    //       activeInvoiceId: '',
    //     });
    //     changeSubView('invoiceCreateView');
    //   },
    // },
    // {
    //   icon: (
    //     <div className={css.iconWrapper}>
    //       <NewInvoiceIcon className={css.icons} />
    //     </div>
    //   ),
    //   title: 'New Invoice(Beta)',
    //   desc: <>Create a new Invoice and save it for future use</>,
    //   onClick: () => {
    //     setActiveInvoiceId({
    //       activeInvoiceId: '',
    //     });
    //     changeSubView('invoiceCreateViewBeta');
    //   },
    // },
    {
      icon: (
        <div className={css.iconWrapper}>
          <DraftInvoiceIcon className={css.icons} />
        </div>
      ),
      title: 'Drafts',
      desc: <>View Invoices that need a few updates before Approval</>,
      onClick: () => {
        changeSubView('draftInvoiceView');
        navigate('/invoice-draft');
      },
    },
    {
      icon: (
        <div className={css.iconWrapper}>
          <DescIcon className={css.icons} />
        </div>
      ),
      title: 'Unapproved',
      desc: <>Review and Fix Invoices which need to be delivered</>,
      onClick: () => {
        changeSubView('unapprovedInvoiceView');
        navigate('/invoice-unapproved');
      },
    },
    {
      icon: (
        <div className={css.iconWrapper}>
          <DescIcon className={css.icons} />
        </div>
      ),
      title: 'Approved',
      desc: <>View validated Invoices ready for Dispatch and more</>,
      onClick: () => {
        changeSubView('approvedInvoiceView');
        navigate('/invoice-approved');
      },
    },
    {
      icon: (
        <div className={css.iconWrapper}>
          <RecurringInvIcon className={css.icons} />
        </div>
      ),
      title: 'Contracts',
      desc: <>View Ongoing Contracts and their Monthly Invoices</>,
      onClick: () => {
        changeSubView('recurringInvoiceView');
        navigate('/invoice-recurring');
      },
    },
    // {
    //   icon: (
    //     <div className={css.iconWrapper}>
    //       <TemplateGalleryIcon className={css.icons} />
    //     </div>
    //   ),
    //   title: 'Template Gallery',
    //   desc: <>Save time by using an Invoice Template from your Gallery</>,
    //   onClick: () => {
    //     changeSubView('templatesInvoiceView');
    //   },
    // },
    {
      icon: (
        <div className={css.iconWrapper}>
          <ClipboardIcon className={css.icons} />
        </div>
      ),
      title: `${capitalizeFirstLetter(estimateName)}`,
      desc: (
        <>
          Fasttrack new Business by creating{' '}
          {capitalizeFirstLetter(estimateName)}
        </>
      ),
      onClick: () => {
        setActiveInvoiceId({
          activeInvoiceId: '',
        });
        changeSubView('estimateView', 'estimate');
        navigate('/invoice-estimate');
      },
    },
  ];

  const device = localStorage.getItem('device_detect');
  const [value, setValue] = React.useState(0);
  const [durationDate, setDurationDate] = React.useState(new Date());
  const [filterTable, setFilterTable] = React.useState();
  const [custDetails, setCustDetails] = React.useState(false);
  const [customerinvoicedetails, setcustomerinvoicedetails] = React.useState(
    [],
  );
  const [monthyear, setmonthyear] = React.useState([]);
  const [invoicedialog, setinvoicedialog] = React.useState(false);
  const [drawer, setDrawer] = React.useState({
    invoiceType: false,
  });
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Invoicing || {})?.length > 0) {
      if (!userPermissions?.Invoicing?.Invoicing) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
    }
  }, [userPermissions]);

  const handleBottomSheet = (e) => {
    setDrawer((p) => ({ ...p, [e]: false }));
  };
  // const [html] = React.useState();
  const breakDown = [
    {
      value:
        value?.total_breakdown?.duration === 0
          ? 0
          : value?.total_breakdown?.duration?.split('-')[0],
      data: value?.total_breakdown?.prev_month || 0,
      click: false,
      // data: 0,
    },
    {
      value: 'New Customer',
      data: value?.total_breakdown?.new_customer || 0,
      click: 'newcustomer',
    },
    {
      value: 'Fee Increase',
      data: value?.total_breakdown?.fee_increase || 0,
      click: 'fee increase',
    },
    {
      value: 'Fee Decrease',
      data: value?.total_breakdown?.fee_decrease || 0,
      click: 'fee decrease',
    },
    {
      value: 'Churn',
      data: value?.total_breakdown?.churns_amount || 0,
      click: 'churn',
    },
    {
      value:
        value?.total_breakdown?.duration === 0
          ? 0
          : value?.total_breakdown?.duration?.split('-')[1],
      data: value?.total_breakdown?.current_month || 0,
      click: false,
      // data: 0,
    },
  ];

  const actionSample = [
    {
      value: 'UNAPPROVED INVOICES',
      desc: `There is currently ${value?.invoice_action?.unapproved_count} Invoice that is unapproved.`,
      button: 'Approve Now',
      route: '/invoice-unapproved',
    },
    {
      value: 'UNACCOUNTED INVOICES',
      desc: `There are currently ${value?.invoice_action?.draft_count} Invoices that are Unaccounted`,
      button: 'View and Download',
      route: '/invoice-draft',
    },
    {
      value: 'EXPIRING AGREEMENTS',
      desc: `There is currently  ${value?.invoice_action?.expiring_agreements_count} contract(s) that will expire in 30 days`,
      button: 'Renew Now',
      route: '/invoice-recurring',
    },
    {
      value: 'INVOICE REVISIONS',
      desc: `There is currently ${value?.invoice_action?.invoice_revision_count} Invoice that is pending for revision`,
      button: 'Revise Now',
      route: '/invoice-approved',
    },
  ];

  const titlesOne = [
    'Customer',
    'Change Description',
    value?.total_breakdown?.duration === 0
      ? 0
      : value?.total_breakdown?.duration?.split('-')[0] || '-',
    value?.total_breakdown?.duration === 0
      ? 0
      : value?.total_breakdown?.duration?.split('-')[1] || '-',
    'Variance',
  ];

  const byCustomer = filterTable
    ? value?.customer_breakdown?.filter(
        (filter) =>
          filter?.description?.trim().toLowerCase() ===
          filterTable.trim().toLowerCase(),
      )
    : value?.customer_breakdown;
  const byService = filterTable
    ? value?.item_breakdown?.filter(
        (filter) =>
          filter?.description?.trim().toLowerCase() ===
          filterTable.trim().toLowerCase(),
      )
    : value?.item_breakdown;

  const findgrandtotal = (arr) => {
    let total = 0;
    arr.map((item) => {
      item.invoice_items.map((i) => {
        total += Number(i.amount);
      });
    });
    return total;
  };
  const findtotal = (arr) => {
    let total = 0;
    if (arr?.length > 0) {
      arr.map((i, index) => {
        total += Number(arr[index].amount);
      });
    }
    return total;
  };
  const recurringPdfDownload = (id) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', user.activeToken);
    myHeaders.append(
      'Cookie',
      'ahoy_visit=81beb4a2-ae4e-4414-8e0c-6eddff401f95; ahoy_visitor=8aba61b6-caf3-4ef5-a0f8-4e9afc7d8d0f',
    );
    const requestOptions = {
      method: METHOD.GET,
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/organizations/${organization.orgId}/invoices/${id}.html`,
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => {
        sethtml(result);
      })
      .catch((error) => console.log('error', error));
  };
  React.useEffect(() => {
    if (device !== 'mobile') {
      dispatch(
        GetInvoiceDashboardState({
          durationDate: moment(durationDate).format('YYYY-MM-DD'),
        }),
      );
    }
  }, [durationDate, dispatch, device]);

  React.useEffect(() => {
    setValue(invoiceDashboardState);
  }, [invoiceDashboardState]);

  React.useEffect(() => {
    if (
      Object.keys(invoiceDashboardStateForCustomer || {})?.find(
        (e) => invoiceDashboardStateForCustomer[e]?.length > 0,
      )
    ) {
      setcustomerinvoicedetails(invoiceDashboardStateForCustomer);
      setmonthyear(Object.keys(invoiceDashboardStateForCustomer || {}));
      setCustDetails(true);
    }
  }, [invoiceDashboardStateForCustomer]);

  if (dashboardLoad === null && device === 'desktop') return null;

  return device === 'mobile' ? (
    <div className={css.invoiceViewContainer}>
      <div className={css.invoiceOptions}>
        <div
          className={css.newItemWrapper}
          aria-hidden="true"
          onClick={() => {
            // setActiveInvoiceId({
            //   activeInvoiceId: '',
            // });
            // changeSubView('invoiceCreateViewBeta');
            // navigate('/invoice-new');
            setDrawer((p) => ({ ...p, invoiceType: true }));
          }}
          // key={i.title}
        >
          <div className={css.iconContainer}>
            {/* <div className={css.iconWrapper}> */}
            <InvoiceBetaIcon />
            {/* </div> */}
          </div>
          <div className={css.itemInfo}>
            <span className={css.title}>New Invoice</span>
            <span className={css.desc}>
              Create a new Invoice within a few clicks
            </span>
          </div>
        </div>
        {invoiceViewOptions.map((i) => (
          <div
            className={css.itemWrapper}
            aria-hidden="true"
            onClick={i.onClick}
            key={i.title}
          >
            <div className={css.iconContainer}>{i.icon}</div>
            <div className={css.itemInfo}>
              <span className={css.title}>{i.title}</span>
              <span className={css.desc}>{i.desc}</span>
            </div>
            <ArrowForwardIosIcon className={css.arrowIcon} />
          </div>
        ))}
        {/* This is temp solution - needs to be removed */}
        <div style={{ height: 30, opacity: 0 }}>temp</div>
      </div>
      <SelectBottomSheet
        open={drawer.invoiceType}
        name="invoiceType"
        onClose={handleBottomSheet}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <>
          <Puller />
          <div style={{ padding: '20px 25px' }}>
            {INVOICE_TYPES?.map((val) => (
              <div
                onClick={() => {
                  setActiveInvoiceId({
                    activeInvoiceId: '',
                  });
                  changeSubView('invoiceCreateViewBeta');
                  if (val?.payload === 'estimate') {
                    navigate('/invoice-estimate');
                  } else {
                    navigate('/invoice-new', {
                      state: { typeOfInvoice: val?.payload },
                    });
                  }
                }}
              >
                <p className={css.invoiceType}>{val?.text}</p>
                <hr />
              </div>
            ))}
          </div>
        </>
      </SelectBottomSheet>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </div>
  ) : (
    <div style={{ width: '100%' }}>
      <div className={css.invoiceViewContainerDesk}>
        <div className={css.invoiceOptionsLeftDesk}>
          <div className={css.itemHead}>
            <h2 className={css.itemHeadTitle}>Breakdown</h2>
            <div
              style={{
                display: 'flex',
                margin: '0px 10px',
              }}
            >
              <div
                style={{
                  border: '1px solid #c1c1c1',
                  padding: '20px 10px',
                  borderRadius: '1.5px 0 0 1.5px',
                  whiteSpace: 'nowrap',
                  pointerEvents:
                    !value?.total_breakdown || new Date() === durationDate
                      ? 'none'
                      : 'unset',
                  cursor: new Date() === durationDate ? 'none' : 'pointer',
                }}
                onClick={() => {
                  setDurationDate(
                    new Date(
                      durationDate.getFullYear(),
                      durationDate.getMonth() - 1,
                      1,
                    ),
                  );
                }}
              >
                <ArrowForwardIosIcon
                  style={{
                    transform: 'rotate(180deg)',
                    width: '15px',
                    height: 'auto',
                  }}
                />
              </div>
              <div
                style={{
                  borderBottom: '1px solid rgb(193, 193, 193)',
                  borderTop: '1px solid rgb(193, 193, 193)',
                  height: '60px',
                  overflow: 'auto',
                  width: 'auto',
                }}
              >
                <p
                  style={{
                    padding: '14px 5px 0 5px',
                    fontFamily: 'Lexend !important',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: 'calc(12.2413px + 6 * ((100vw - 300px) / 900))',
                    lineHeight: '31px',
                    color: '#283049',
                    height: 'auto',
                    whiteSpace: 'nowrap',
                    margin: '0px',
                    textAlign: 'center',
                  }}
                >
                  {value?.total_breakdown
                    ? value?.total_breakdown?.duration
                    : '-'}
                </p>
              </div>
              <div
                style={{
                  border: '1px solid #c1c1c1',
                  padding: '20px 10px',
                  borderRadius: '0 1.5px 1.5px 0',
                  whiteSpace: 'nowrap',
                  pointerEvents:
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      1,
                    ).toLocaleDateString() ===
                    new Date(
                      durationDate.getFullYear(),
                      durationDate.getMonth(),
                      1,
                    ).toLocaleDateString()
                      ? 'none'
                      : 'unset',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setDurationDate(
                    new Date(
                      durationDate.getFullYear(),
                      durationDate.getMonth() + 1,
                      1,
                    ),
                  );
                }}
              >
                <ArrowForwardIosIcon
                  style={{
                    transform: 'rotate(360deg)',
                    width: '15px',
                    height: 'auto',
                  }}
                />
              </div>
            </div>
          </div>
          <div className={css.itemList}>
            {breakDown.map((i, index) => (
              <a href={i.click ? '#byCustomer' : false} className={css.forHref}>
                <div
                  className={css.itemDesk}
                  style={{
                    borderTop: index === 0 ? 'none' : '1px solid #EDEDED',
                  }}
                  key={i.value}
                  onClick={() =>
                    i.click ? setFilterTable(i.click) : setFilterTable()
                  }
                >
                  <div className={css.itemValueDesk}>
                    {(value?.total_breakdown && i.value) || '-'}
                  </div>
                  <div
                    className={css.itemDataDesk}
                    style={{
                      color:
                        i?.value === 'Fee Decrease' ? '#950909' : '#273049',
                    }}
                  >
                    {i?.value === 'Fee Decrease'
                      ? FormattedAmount(i?.data)
                      : FormattedAmount(i?.data)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className={css.invoiceOptionsRightDesk}>
          <div className={css.itemHead}>Action Required</div>
          <div className={css.itemList}>
            {actionSample.map((i) => (
              <div className={css.itemDesk} key={i.value}>
                <div className={css.itemLeft}>
                  <div className={css.itemValueDeskAction}>{i.value}</div>
                  <div className={css.itemDataDeskAction}>{i.desc}</div>
                </div>
                <div className={css.itemRight}>
                  <input
                    type="button"
                    value={i.button}
                    className={css.itemButton}
                    onClick={() => {
                      navigate(i.route);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={css.invoiceViewContainerDesk}
        style={{ flexDirection: 'column' }}
        id="byCustomer"
      >
        <Mui.Typography className={css.byCustomer}>By Customer</Mui.Typography>
        <br />
        <Mui.TableContainer
          style={{
            maxWidth: '100%',
            margin: '0 2% !important',
            borderRadius: '25px',
            overflow: 'auto',
            // height: '48vh',
            maxHeight: '48vh',
            minHeight: 'auto',
            padding: '0px',
            '&::-webkit-scrollbar': { width: 0 },
          }}
        >
          <Mui.Table size="medium" style={{ background: '#fff' }} stickyHeader>
            <Mui.TableHead
              style={{
                background: '#fff',
              }}
            >
              {titlesOne?.map((title, i) => (
                <Mui.TableCell
                  style={{
                    background: '#fff',
                  }}
                >
                  <Mui.Typography
                    noWrap
                    variant="body2"
                    className={css.tableHead}
                    style={{
                      width: 'inherit',
                      textAlign:
                        i === 4 || i === 3 || i === 2 ? 'right' : 'left',
                    }}
                  >
                    {i === 4 ? (
                      <>
                        {title}
                        <br /> <p className={css.tableHeadLaks}>Rs lakhs</p>
                      </>
                    ) : (
                      title
                    )}
                  </Mui.Typography>
                </Mui.TableCell>
              ))}
            </Mui.TableHead>
            <Mui.TableBody>
              {byCustomer?.map((val) => (
                <Mui.TableRow
                  style={{
                    borderColor: (theme) => theme.palette.grey[100],
                  }}
                >
                  <Mui.TableCell
                    style={{
                      maxWidth: '300px',
                      width: 'inherit',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      dispatch(
                        GetInvoiceDashboardStateForCustomer({
                          customerid: val.customer_id,
                          durationDate:
                            moment(durationDate).format('YYYY-MM-DD'),
                        }),
                      );
                    }}
                  >
                    <Mui.Typography
                      noWrap
                      style={{ fontWeight: 600, width: 'inherit' }}
                      className={`${css.tableValue} ${css.tableBaseName}`}
                    >
                      {val?.base_name}
                    </Mui.Typography>
                  </Mui.TableCell>

                  <Mui.TableCell
                    style={{
                      maxWidth: '150px',
                      width: 'inherit',
                    }}
                  >
                    <Mui.Typography
                      noWrap
                      style={{ fontWeight: 400, width: 'inherit' }}
                      className={`${css.tableValue} ${css.tableDescription}`}
                    >
                      {val?.description}
                    </Mui.Typography>
                  </Mui.TableCell>

                  <Mui.TableCell
                    style={{
                      maxWidth: '40px',
                      width: 'inherit',
                    }}
                    align="right"
                  >
                    <Mui.Typography
                      noWrap
                      style={{ fontWeight: 400, width: 'inherit' }}
                      className={css.tableValue}
                    >
                      {FormattedAmount(val?.prev_month)}
                    </Mui.Typography>
                  </Mui.TableCell>

                  <Mui.TableCell
                    style={{
                      maxWidth: '40px',
                      width: 'inherit',
                    }}
                    align="right"
                  >
                    <Mui.Typography
                      noWrap
                      style={{ fontWeight: 400, width: 'inherit' }}
                      className={css.tableValue}
                    >
                      {FormattedAmount(val?.current_month)}
                    </Mui.Typography>
                  </Mui.TableCell>

                  <Mui.TableCell
                    style={{
                      maxWidth: '40px',
                      width: 'inherit',
                    }}
                    align="right"
                  >
                    <Mui.Typography
                      noWrap
                      style={{ fontWeight: 400, width: 'inherit' }}
                      className={css.tableValue}
                    >
                      {FormattedAmount(val?.variance)}
                    </Mui.Typography>
                  </Mui.TableCell>
                </Mui.TableRow>
              ))}
            </Mui.TableBody>
          </Mui.Table>
        </Mui.TableContainer>
      </div>

      <Mui.Typography className={css.byCustomer}>By Service</Mui.Typography>

      <div className={css.invoiceViewContainerDesk}>
        <Mui.TableContainer
          style={{
            maxWidth: '100%',
            margin: '0 2% !important',
            borderRadius: '25px',
            overflow: 'auto',
            maxHeight: '48vh',
            minHeight: 'auto',
            '&::-webkit-scrollbar': { width: 0 },
          }}
        >
          <Mui.Table size="medium" style={{ background: '#fff' }} stickyHeader>
            <Mui.TableHead
              style={{
                background: '#fff',
              }}
            >
              {titlesOne?.map((title, i) => (
                <Mui.TableCell
                  style={{
                    background: '#fff',
                  }}
                >
                  <Mui.Typography
                    noWrap
                    style={{
                      width: 'inherit',
                      textAlign:
                        i === 4 || i === 3 || i === 2 ? 'right' : 'left',
                    }}
                    className={css.tableHead}
                  >
                    {i === 4 ? (
                      <>
                        {title}
                        <br /> <p className={css.tableHeadLaks}>Rs lakhs</p>
                      </>
                    ) : (
                      title
                    )}
                  </Mui.Typography>
                </Mui.TableCell>
              ))}
            </Mui.TableHead>
            <Mui.TableBody>
              {byService?.map((val) => (
                <Mui.TableRow
                  style={{
                    borderColor: (theme) => theme.palette.grey[100],
                  }}
                >
                  <Mui.TableCell
                    style={{
                      maxWidth: '300px',
                      width: 'inherit',
                    }}
                  >
                    <Mui.Typography
                      noWrap
                      style={{ fontWeight: 600, width: 'inherit' }}
                      className={`${css.tableValue} ${css.tableBaseName}`}
                    >
                      {val?.base_name}
                    </Mui.Typography>
                  </Mui.TableCell>

                  <Mui.TableCell
                    style={{
                      maxWidth: '150px',
                      width: 'inherit',
                    }}
                  >
                    <Mui.Typography
                      noWrap
                      style={{ fontWeight: 400, width: 'inherit' }}
                      className={`${css.tableValue} ${css.tableDescription}`}
                    >
                      {val?.description}
                    </Mui.Typography>
                  </Mui.TableCell>

                  <Mui.TableCell
                    style={{
                      maxWidth: '40px',
                      width: 'inherit',
                    }}
                    align="right"
                  >
                    <Mui.Typography
                      noWrap
                      style={{ fontWeight: 400, width: 'inherit' }}
                      className={css.tableValue}
                    >
                      {FormattedAmount(val?.prev_month)}
                    </Mui.Typography>
                  </Mui.TableCell>

                  <Mui.TableCell
                    style={{
                      maxWidth: '40px',
                      width: 'inherit',
                    }}
                    align="right"
                  >
                    <Mui.Typography
                      noWrap
                      style={{ fontWeight: 400, width: 'inherit' }}
                      className={css.tableValue}
                    >
                      {FormattedAmount(val?.current_month)}
                    </Mui.Typography>
                  </Mui.TableCell>

                  <Mui.TableCell
                    style={{
                      maxWidth: '40px',
                      width: 'inherit',
                    }}
                    align="right"
                  >
                    <Mui.Typography
                      noWrap
                      style={{ fontWeight: 400, width: 'inherit' }}
                      className={css.tableValue}
                    >
                      {FormattedAmount(val?.variance)}
                    </Mui.Typography>
                  </Mui.TableCell>
                </Mui.TableRow>
              ))}
            </Mui.TableBody>
          </Mui.Table>
        </Mui.TableContainer>
      </div>
      <Mui.Dialog
        open={custDetails}
        onClose={() => {
          setCustDetails(false);
          dispatch(ClearStateInvoiceDashboardForCustomer());
        }}
        PaperProps={{
          elevation: 3,
          style: {
            minWidth: '60%',
            borderRadius: 16,
          },
        }}
        maxWidth="sm"
      >
        <div className={css.dialog}>
          <div className={css.mainDiv}>
            <div className={css.topDiv}>
              {monthyear.map((i, index) => {
                return (
                  customerinvoicedetails[i]?.length > 0 && (
                    <div
                      className={css.mainContainer}
                      style={{
                        background: (index + 1) % 2 === 0 ? '#FFF7F0' : '#FFFF',
                      }}
                    >
                      <p className={css.titleContainer}>{i}</p>
                      {customerinvoicedetails[i]?.length === 0 ? (
                        <></>
                      ) : (
                        customerinvoicedetails[i].map((item) => {
                          return (
                            <div className={css.mainInnerContainer}>
                              <div className={css.subDiv}>
                                <Link
                                  underline="hover"
                                  className={css.customlink}
                                  onClick={() => {
                                    setinvoicedialog(true);
                                    recurringPdfDownload(item.id);
                                  }}
                                >
                                  <p className={css.invoiceId}>{item.number}</p>
                                </Link>
                                <p className={css.narration}>
                                  {item.narration}
                                </p>
                                <hr style={{ width: '100%' }} />
                              </div>

                              <div className={css.subDivTwo}>
                                <p className={css.dateAmont}>
                                  {moment(item.approved_on).format(
                                    'DD-MM-YYYY',
                                  )}
                                </p>
                                <span className={css.span}>
                                  <img
                                    src={SmallVector}
                                    alt="amt"
                                    className={css.image}
                                  />
                                  <p className={css.dateAmont}>
                                    {FormattedAmount(
                                      findtotal(item?.invoice_items),
                                    )}
                                  </p>
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )
                );
              })}
            </div>

            <div className={css.orangeBottom}>
              {monthyear.map((i, index) => {
                return customerinvoicedetails[i]?.length > 0 ? (
                  <>
                    {' '}
                    <div className={css.bottomDiv}>
                      <p className={css.total}>Total</p>
                      <p className={css.amount}>
                        {FormattedAmount(
                          findgrandtotal(customerinvoicedetails?.[i]),
                        )}
                      </p>
                    </div>
                    {monthyear.length > index + 1 ? (
                      <hr className={css.line} />
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                );
              })}
            </div>
          </div>
        </div>
      </Mui.Dialog>
      <Mui.Dialog
        open={invoicedialog}
        id="basic-menu-sort"
        onClose={() => setinvoicedialog(false)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          elevation: 3,
          style: {
            minWidth: '75%',
            padding: '5px',
            borderRadius: 16,
          },
        }}
      >
        <Mui.DialogContent>
          <Mui.Stack
            style={{ overflow: 'auto', margin: '1rem' }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {/* {Pdfj()} */}
        </Mui.DialogContent>
      </Mui.Dialog>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </div>
  );
};

export default InvoiceViewContainer;
