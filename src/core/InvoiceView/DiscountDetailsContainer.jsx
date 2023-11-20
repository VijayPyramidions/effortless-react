import React, { useState } from 'react';
import Input from '@components/Input/Input.jsx';
import { makeStyles } from '@material-ui/core';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import * as css from './CreateInvoiceContainer.scss';

const useStyles = makeStyles(() => ({
  root: {
    border: '0.7px solid rgb(153, 158, 165, 0.39)',
    borderRadius: '8px',
    margin: '0px',
    display: 'flex',
    textAlign: 'center',
    width: '79px',
    minHeight: '37.5px',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiInputBase-root': {
      margin: '0 !important',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      alignSelf: 'center',
      padding: '0 !important',
    },
    '& .MuiInputBase-input': {
      textAlign: 'center',
      width: '100%',
    },
  },
}));

const DiscountDetailsContainer = (props) => {
  const { lineItems, onProductUpdate } = props;
  const [discountType, setDiscountType] = useState('rate');
  const classes = useStyles();

  const billCounter = () => {
    return lineItems.map((element) => (
      <div className={css.billList}>
        <div className={css.productDetails}>
          <span className={css.itemName}>{element.item_name}</span>
          {element.rate === element.amount ? (
            <span className={css.itemRate}>
              {FormattedAmount(element?.rate)}
            </span>
          ) : (
            <span className={`${css.itemRate}`}>
              <s style={{ paddingRight: '9px' }}>
                {FormattedAmount(element?.rate)}
              </s>{' '}
              <span style={{ color: '#00A676' }}>
                {FormattedAmount(element?.amount)}
              </span>
            </span>
          )}
        </div>
        <div key={element.id} className={css.discountSelection}>
          <span
            className={
              discountType === 'rate'
                ? css.selectedDiscountBtn
                : css.discountBtn
            }
            onClick={() => setDiscountType('rate')}
          >
            #
          </span>
          <span
            className={
              discountType === 'percentage'
                ? css.selectedDiscountBtn
                : css.discountBtn
            }
            onClick={() => setDiscountType('percentage')}
          >
            %
          </span>
        </div>
        <div className={css.discountValue}>
          <Input
            name="discountValue"
            defaultValue={Number(element.discount)}
            onChange={(e) => {
              e.persist();
              setTimeout(() => {
                onProductUpdate(element.id, 'discount', e.target.value);
              }, 1000);
            }}
            className={classes.root}
            label=" "
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            theme="light"
          />
        </div>
      </div>
    ));
  };

  return (
    <div className={css.selectDataContainer}>
      <div className={css.selectDataHeader}>
        <span className={css.selectDataTitle}>Step 4: Give Discount</span>
      </div>
      {lineItems && lineItems.length > 0 && (
        <div className={css.selectDiscountBody}>{billCounter()}</div>
      )}
    </div>
  );
};

export default DiscountDetailsContainer;
