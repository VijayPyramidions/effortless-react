import React from "react";
import { Box } from '@mui/material';
import { customCurrency } from '@components/formattedValue/FormattedValue';
import amountindicatoriconreceipt_desktop from '@assets/categorizationamountup_desktop.svg';
import amountindicatoriconpayment_desktop from '@assets/categorizationamountdown_desktop.svg';
import * as css from './CategorizationHeader.scss';

const AmountData = ({ transactionType, amount }) => {
  return <>
    <div className={css.amountDataContainer}>
      <Box
        component="div"
      >
        <span className={css.label}>
          Amount
        </span>
        <div className={css.amountData}>
          {transactionType === 'inflow' ? (
            <div className={css.bankTransactionAmountUpIcon}>
              <img
                alt="Inflow"
                src={amountindicatoriconreceipt_desktop}
              />
            </div>
          )
            : (
              <div className={css.bankTransactionAmountDownIcon}>
                <img
                  alt="Outflow"
                  src={amountindicatoriconpayment_desktop}
                />
              </div>
            )}
          <div className={css.bankTransactionAmount}>
            {customCurrency("INR", "en-US").format(Math.abs(Number(amount || 0)))}
          </div>
        </div>
      </Box>
    </div>
  </>;
};

export default AmountData;