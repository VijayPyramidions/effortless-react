import React from 'react';
import { Avatar, Button, IconButton } from '@mui/material';
import { isMobile } from 'react-device-detect';

import Lottie from 'react-lottie';
import moment from 'moment';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import sucessAnimation from '@root/Lotties/paymentSucess.json';
import failAnimation from '@root/Lotties/paymentFailed.json';
import processingAnimation from '@root/Lotties/paymentProcessing.json';
import Bharat from '@assets/phonePostpaid/bpbs.svg';
import bgbill from '@assets/billdetailbg.svg';
import bgbillmobile from '@assets/bgbillmobile.svg';

import * as css from './BillComponent.scss';

const defaultOptionsSuccess = {
  loop: true,
  autoplay: true,
  animationData: sucessAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const defaultOptionsFailed = {
  loop: true,
  autoplay: true,
  animationData: failAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const defaultOptionsProcessing = {
  loop: true,
  autoplay: true,
  animationData: processingAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export const BillDetails = ({ SelectedValue, handleClose, OnSubmit }) => {
  console.log(SelectedValue);
  return (
    <div className={css.dialogCont}>
      <div className={css.topCont}>
        <p className={css.head}>Bill Details</p>
        <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => handleClose()} />
      </div>

      <div className={css.midCont}>
        <Avatar
          src={isMobile ? bgbillmobile : bgbill}
          alt="background"
          className={css.bgimage}
        />

        <div className={css.innerCont}>
          <Avatar
            alt="provider icon"
            src={`https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bbps_biller_logos/${SelectedValue.source_id}.svg`}
            className={css.avatar}
          >
            <img
              src="https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bbps_biller_logos/unknown_mobile_broadband.svg"
              alt="fallback"
              style={{ background: '#FFFFFF' }}
            />
          </Avatar>
          <div className={css.billDetails}>
            <p className={css.billHead}>
              {SelectedValue?.biller_name.includes('Postpaid') &&
                'MOBILE POSTPAID'}
              {SelectedValue?.biller_name.includes('Broadband') &&
                'BROADBAND / LANDLINE'}
              {SelectedValue?.biller_name.includes('Electricity') &&
                'ELECTRICITY BILL'}
            </p>
            <p className={css.billSubHead}>{SelectedValue?.biller_name}</p>
          </div>
        </div>
      </div>

      <div className={css.lastCont}>
        {(SelectedValue.total_amount === 0.0 || SelectedValue.paid) && (
          <p className={css.lastHead}>
            All good here! your Bill is <span>already paid</span>
          </p>
        )}

        <div className={css.detailsDiv}>
          {SelectedValue?.input_params?.map((val) => (
            <div className={css.detailsInnerDiv}>
              <p className={css.detailsName}>{val?.key}</p>
              <p className={css.detailsInfo}>-</p>
              <p className={css.detailsInfo}> {val?.value}</p>
            </div>
          ))}
          <div className={css.detailsInnerDiv}>
            <p className={css.detailsName}>Customer name</p>
            <p className={css.detailsInfo}>-</p>
            <p className={css.detailsInfo}>
              {SelectedValue?.account_holder_name}
            </p>
          </div>
          <div className={css.detailsInnerDiv}>
            <p className={css.detailsName}>Bill Date</p>
            <p className={css.detailsInfo}>-</p>
            <p className={css.detailsInfo}>
              {moment(SelectedValue?.date, 'YYYY-MM-DD').format(
                'DD MMM YYYY'
              ) !== 'Invalid date'
                ? moment(SelectedValue?.date, 'YYYY-MM-DD').format(
                    'DD MMM YYYY'
                  )
                : '      -'}
            </p>
          </div>
          <div className={css.detailsInnerDiv}>
            <p className={css.detailsName}>Last Paid</p>
            <p className={css.detailsInfo}>-</p>

            <p className={css.detailsInfo}>
              {moment(SelectedValue?.last_paid, 'YYYY-MM-DD').format(
                'DD MMM YYYY'
              ) !== 'Invalid date'
                ? moment(SelectedValue?.last_paid, 'YYYY-MM-DD').format(
                    'DD MMM YYYY'
                  )
                : '     -'}
            </p>
          </div>
        </div>
        {(SelectedValue.total_amount === 0.0 || SelectedValue.paid) && (
          <div className={css.notifyCont}>
            <CheckCircleIcon sx={{ color: '#00A676' }} />
            <p className={css.notifyText}>
              we’ll notify once a new bill is generated
            </p>
          </div>
        )}
        <div className={css.buttonCont}>
          <Button
            className={css.primaryButton}
            disabled={
              SelectedValue?.paid ||
              SelectedValue.total_amount === 0.0 ||
              SelectedValue.payment_status === 'bbps_pending'
            }
            onClick={() => {
              OnSubmit(SelectedValue?.fetch_id);
              handleClose();
            }}
          >
            Proceed to Pay
          </Button>
        </div>

        <div className={css.finalFooter}>
          <p className={css.pTag}>Securest by Bharat BillPay</p>
          <img
            src={Bharat}
            style={{ width: '48px', height: '16px' }}
            alt="bharat"
          />
        </div>
      </div>
    </div>
  );
};

export const PaymentDetilsShow = (props) => {
  const { paymentDetails, handleClose } = props;
  const device = localStorage.getItem('device_detect');
  return (
    <div className={css.paymentHistoryDetail}>
      <div className={`${css.headerContainer} ${css.headerWithClose}`}>
        <div>
          <div className={css.headerLabel}>View Details</div>
        </div>
        <IconButton onClick={() => handleClose()}>
          <CloseIcon />
        </IconButton>
      </div>

      <div className={`${css.detailsContainer} `}>
        <p className={device === 'mobile' ? css.dialogHeadMob : css.dialogHead}>
          {paymentDetails?.beneficiary_name}
        </p>
        <p className={device === 'mobile' ? css.dialogAmtMob : css.dialogAmt}>
          {FormattedAmount(paymentDetails?.amount)}
        </p>
      </div>

      <>
        {(paymentDetails?.payment_status === 'success_wallet' ||
          paymentDetails?.payment_status === 'bbps_success' ||
          paymentDetails?.payment_status === 'success_bank') && (
          <div className={css.tickImg}>
            <Lottie options={defaultOptionsSuccess} />
          </div>
        )}
        {(paymentDetails?.payment_status === 'processing' ||
          paymentDetails?.payment_status === 'bbps_pending' ||
          paymentDetails?.payment_status === 'settlement_processing') && (
          <div className={css.tickImg}>
            <Lottie options={defaultOptionsProcessing} />
          </div>
        )}
        {(paymentDetails?.payment_status === 'failed' ||
          paymentDetails?.payment_status === 'bbps_failure' ||
          paymentDetails?.payment_status === 'failure_bank') && (
          <div className={css.tickImg}>
            <Lottie options={defaultOptionsFailed} />
          </div>
        )}
      </>
      <p className={css.dialogDate}>{paymentDetails?.paid_at}</p>

      <div className={css.contentBody}>
        <div
          className={
            device === 'mobile' ? css.secondConatinSubMob : css.secondConatinSub
          }
        >
          <p className={css.key}>Paid From</p>
          <p className={css.value}>-</p>
          <p className={css.value}>{paymentDetails?.bank_name}</p>
        </div>
        <div
          className={
            device === 'mobile' ? css.secondConatinSubMob : css.secondConatinSub
          }
        >
          <p className={css.key}>Paid By</p>
          <p className={css.value}>-</p>

          <p className={css.value}>{paymentDetails?.payer_name || '-'}</p>
        </div>
        <div
          className={
            device === 'mobile' ? css.secondConatinSubMob : css.secondConatinSub
          }
        >
          <p className={css.key}>Bank Name</p>
          <p className={css.value}>-</p>

          <p className={css.value}>{paymentDetails?.beneficiary_bank_name}</p>
        </div>
        {paymentDetails?.bank_reference_number && (
          <div
            className={
              device === 'mobile'
                ? css.secondConatinSubMob
                : css.secondConatinSub
            }
          >
            <p className={css.key}>Transaction Number</p>
            <p className={css.value}>-</p>
            <p className={css.value}>{paymentDetails?.bank_reference_number}</p>
          </div>
        )}
      </div>
    </div>
  );
};
