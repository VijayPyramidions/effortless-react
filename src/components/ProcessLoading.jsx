import React from 'react';
import hourglass from '@assets/loading-hourglass.gif';
import * as css from './ProcessLoading.scss';

const processLoading = (showHourGlass) => {
  return (
    showHourGlass === 1 && (
      <div className={css.processHolder}>
        <img src={hourglass} className={css.hourGlass} alt="loading..." />
      </div>
    )
  );
};

export default processLoading;
