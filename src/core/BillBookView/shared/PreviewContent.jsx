import React from 'react';
import { Button } from '@material-ui/core';
import * as css from './PreviewContent.scss';

export default function PreviewContent({ title, data, onProceed }) {
  /** 
  console.log(
    '🚀 ~ file: PreviewContent.jsx ~ line 6 ~ PreviewContent ~ title, data, onProceed',
    title,
    data,
    onProceed,
  );
  */
  return (
    <div className={css.previewTrigger}>
      <div className={css.headerContainer}>
        <div className={css.headerLabel}>{title || 'Preview'}</div>
        <span className={css.headerUnderline} />
      </div>
      <div className={css.previewBody}>
        {data.map((d) => (
          <div className={css.previewItem}>
            <div className={css.label}>{d.label}</div>
            <div className={css.value}>{d.value}</div>
          </div>
        ))}
      </div>
      <div className={css.previewAction}>
        <Button
          variant="contained"
          className={css.primaryButton}
          onClick={onProceed}
          size="medium"
        >
          Record Bill
        </Button>
      </div>
    </div>
  );
}
