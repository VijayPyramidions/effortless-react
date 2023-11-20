import React from 'react';
import RightArrow from '@assets/rightArrow.svg';
import { Divider } from '@material-ui/core';
import * as css from './SettingsCard.scss';

function SettingsCard({
  icon,
  lable,
  alt,
  route,
  handlePageChange,
  id,
  length,
  upcoming,
  setUpcomingDia,
}) {
  return (
    <div>
      <div
        className={css.settingsCardContainer}
        onClick={() => {
          if (upcoming) {
            setUpcomingDia(true);
          } else {
            handlePageChange(route, id);
          }
        }}
      >
        <div className={css.iconWrapper}>
          <img className={css.icon} src={icon} alt={alt} />
        </div>
        <div className={css.lable}>{lable}</div>
        <div className={css.arrowWrapper}>
          <img src={RightArrow} alt={alt} />
        </div>
      </div>
      {length !== id && (
        <div className={css.divider}>
          <Divider />
        </div>
      )}
    </div>
  );
}

export default SettingsCard;
