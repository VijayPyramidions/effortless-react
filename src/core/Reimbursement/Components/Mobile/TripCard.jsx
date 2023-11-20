import React from 'react';
import moment from 'moment';
import { Typography, Avatar, Checkbox } from '@mui/material';
import { StatusComponents } from '../../Reimbursement';
import * as css from '../../reimbursement.scss';
import { IndianCurrency } from '../../../../components/utils';

const TripCard = ({
  active,
  type,
  description,
  amountData,
  date,
  status,
  name,
  toNavigate,
  handleCardClick,
  id,
  selectedIds,
  setSelectedItems,
  selectedItems,
  handleCheckbox,
  showCheckbox,
}) => {
  const handleSelection = (e, val) => {
    if (e?.target?.checked) {
      const newArray = [...selectedItems, val];
      setSelectedItems((prev) => [...prev, val]);
      handleCheckbox(newArray);
    } else {
      const newArray = selectedItems?.filter((ele) => ele !== val);
      setSelectedItems(newArray);
      handleCheckbox(newArray);
    }
  };
  return (
    <>
      {type === 'outstanding' && (
        <div className={`${css.tripCardContainer} ${css[type]}`}>
          <div className={css.tripFirstContainer}>
            {showCheckbox && (
              <Checkbox
                name="pendingPaymentCheckbox"
                checked={selectedIds.includes(id)}
                disabled={!showCheckbox}
                onChange={(e) => {
                  handleSelection(e, id);
                }}
                sx={{
                  padding: '0 8px 0px 0px',
                  borderRadius: '2px',
                  color: '#F08B32 !important',
                }}
              />
            )}
            <p
              className={css.description}
              onClick={() => handleCardClick()}
              role="presentation"
            >
              {description}
            </p>
            <p
              className={css.amountData}
              onClick={() => handleCardClick()}
              role="presentation"
            >
              {IndianCurrency.format(amountData || 0)}
            </p>
          </div>
          <div
            className={css.tripSecondContainer}
            onClick={() => handleCardClick()}
          >
            <p className={css.DateField}>
              <span>Date : </span>
              {moment(date).format('Do MMM')}
            </p>
            <p className={css.StatusField}>{StatusComponents[status]}</p>
          </div>
        </div>
      )}
      {type === 'settled' && (
        <div
          className={`${css.tripCardContainer} ${css[type]}`}
          onClick={() => handleCardClick()}
        >
          <div className={css.tripFirstContainer}>
            <p className={css.description}>{description}</p>
            <p className={css.amountData}>
              {IndianCurrency.format(amountData || 0)}
            </p>
          </div>
          <div className={css.tripSecondContainer}>
            <p className={css.DateField}>
              <span>Payment Date : </span>
              {moment(date).format('Do MMM')}
            </p>
            <p className={css.StatusField}>{StatusComponents[status]}</p>
          </div>
        </div>
      )}
      {type === 'advance' && (
        <div
          className={`${css.tripCardContainer} ${css[type]}`}
          onClick={() => handleCardClick()}
        >
          <div className={css.tripFirstContainer}>
            <p className={css.DateField}>
              <span>Date: </span>
              {moment(date).format('Do MMM')}
            </p>
            <p className={css.amountData}>
              {IndianCurrency.format(amountData || 0)}
            </p>
          </div>
          <div className={css.tripSecondContainer}>
            <p className={css.categoryField}>
              <span>Description : </span>
              {description}
            </p>
            <p className={css.StatusField}>{StatusComponents[status]}</p>
          </div>
        </div>
      )}
      {type === 'pendingClaims' && (
        <div className={`${css.tripCardContainer} ${css[type]}`}>
          <div className={css.tripFirstContainer}>
            {showCheckbox && (
              <Checkbox
                name="pendingPaymentCheckbox"
                checked={selectedIds.includes(id)}
                disabled={!showCheckbox}
                onChange={(e) => {
                  handleSelection(e, id);
                }}
                sx={{
                  padding: '0 8px 0px 0px',
                  borderRadius: '2px',
                  color: '#F08B32 !important',
                }}
              />
            )}
            <div className={css.nameContainer} onClick={toNavigate}>
              <Avatar
                className={css.orgAvatar}
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}&chars=2`}
              />
              <Typography className={css.nameContainerText}>{name}</Typography>
            </div>

            {/* <p className={css.DateField}>
              <span>Date: </span>
              {moment(date).format('Do MMM')}
            </p> */}
            <p
              className={css.amountData}
              onClick={toNavigate}
              role="presentation"
            >
              {amountData}
            </p>
          </div>
          <div className={css.tripSecondContainer} onClick={toNavigate}>
            <p className={css.categoryField}>
              <span>
                {active === 'advance_claims' ? 'Description: ' : 'Category: '}
              </span>
              {description}
            </p>
            <p className={css.StatusField}>{StatusComponents[status]}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default TripCard;
