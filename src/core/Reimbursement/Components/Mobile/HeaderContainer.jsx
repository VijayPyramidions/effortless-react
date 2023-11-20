import React from 'react';
import { Button } from '@material-ui/core';
import plus from '@assets/plus.svg';
import transfer from '@assets/Transfer.svg';
import * as css from '../../reimbursement.scss';

const HeaderContainer = ({
  disablecount,
  type,
  title,
  btnName,
  amount,
  btnAction,
  count,
  disabled,
}) => {
  return (
    <div className={`${css.headerContainer} ${css[type]}`}>
      <p className={css.title}>
        {title}{' '}
        {!disablecount && <span className={css.claimCount}>{count}</span>}
      </p>
      <div className={css.amtField}>{amount}</div>
      <hr />
      <Button
        className={css.headerBtn}
        onClick={(e) => btnAction(e)}
        disabled={disabled}
      >
        {type === 'claims' && (
          <img className={css.image} src={plus} alt="Icon" />
        )}
        {type === 'unsettled' && (
          <img className={css.image} src={transfer} alt="Transfer Icon" />
        )}
        <span className={css.btnName}>{btnName}</span>
      </Button>
    </div>
  );
};

export default HeaderContainer;
