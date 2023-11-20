import React, { useEffect, useState } from 'react';
import bank_inflow from '@assets/banking_inflow.svg';
import bank_outflow from '@assets/banking_outflow.svg';
import * as css from './main.scss';

const BankingCategorizationHeader = ({ HeaderData }) => {
  const [tdsValue, setTdsValue] = useState();
  const handleKeyPress = (e) => {
    const isValidKey = /[0-9]/i.test(e.key);
    if (!isValidKey) {
      e.preventDefault();
    }
  };

  const getLettersWithEllipsis = (text) => {
    if (text?.length >= 75) {
      return `${text.slice(0, 75)}...`;
    }
    return text;
  };

  useEffect(() => {
    if (tdsValue <= 30 && tdsValue > 0) {
      HeaderData?.settdspercentagestate(String(tdsValue));
    } else {
      HeaderData?.settdspercentagestate('');
    }
  }, [tdsValue]);

  return (
    <div className={css.bankingmobilecatgorizationheader}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <div className={css.contentwithimage}>
          {HeaderData?.flow === 'inflow' && (
            <img src={bank_inflow} alt="inflow" />
          )}
          {HeaderData?.flow === 'outflow' && (
            <img src={bank_outflow} alt="outflow" />
          )}
        </div>
        <div className={css.topcontent}>
          <div>
            <p className={css.headertexttag}>Amount</p>
            <p className={css.bottomtexttag}>{HeaderData?.amount}</p>
          </div>
          <div>
            <p className={css.headertexttag}>Date</p>
            <p className={css.bottomtexttag}>{HeaderData?.date}</p>
          </div>
          {HeaderData?.showTds && (
            <div>
              <p className={css.headertexttag}>TDS</p>
              <input
                type="number"
                placeholder="10%"
                value={HeaderData?.tds}
                onChange={(e) => {
                  setTdsValue(parseInt(String(e.target.value), 10));
                }}
                onKeyPress={handleKeyPress}
                className={css.tdscovertag}
                disabled={HeaderData?.status === 'Edit'}
              />
            </div>
          )}
          <div>
            <p className={css.headertexttag}>{HeaderData?.bankName}</p>
            <p className={css.bottomtexttag}>{HeaderData?.bankAcc}</p>
          </div>
        </div>
      </div>

      <div className={css.bottomcontent}>
        <div>
          <p className={css.headertexttag}>Narration</p>
          <p className={css.bottomnarrationtexttag}>
            {getLettersWithEllipsis(HeaderData?.narration)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankingCategorizationHeader;
