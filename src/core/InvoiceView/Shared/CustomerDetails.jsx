import React from 'react';
import * as css from '../CreateInvoiceContainer.scss';

const CustomerDetails = (props) => {
  const { selectedData, handleClose, gstData, hideChange } = props;

  return (
    <div className={css.customerDetailsContainer}>
      {selectedData && (
        <div className={css.selectedCustomerList}>
          {!hideChange && (
            <span className={css.closeIcon} onClick={handleClose}>
              Change
            </span>
          )}
          <div className={css.selectedCustomerinGSTIN}>
            <div className={css.selectedCustomerTopIntialWrapper}>
              <div className={css.selectedCustomerIntialWrapper}>
                <span className={css.selectedCustomerIntial}>
                  {selectedData.initial}
                </span>
              </div>
            </div>
            <div className={css.selectedCustomerDataWrapper}>
              <span className={css.selectedCustomerName}>
                {selectedData.name}
              </span>
              <span className={css.selectedCustomerGstIN}>
                <span>GSTIN</span>
                <span
                  style={{
                    width: '130px',
                    height: '20px',
                    backgroundColor: '#fff',
                    display: 'inline-block',
                  }}
                >
                  {gstData.toUpperCase()}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
