import * as React from 'react';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import * as css from './ListItem.scss';

const ListItem = ({ variant, label, field, nonEditable, handleChange }) => {
  const WIDTH_FOR = {
    amount: '158px',
    paidTo: '244px',
    narration: '266px',
    percent: '67px',
    date: '158px',
    towards: '244px',
    type: '158px',
  };

  return (
    <div
      style={{
        background: nonEditable ? '#FBFBFB' : '#F2F2F2',
        width: WIDTH_FOR[variant],
      }}
      className={css.mainContainer}
    >
      <p
        style={{
          margin: 2,
          textAlign: variant === 'percent' ? 'center' : 'left',
        }}
      >
        {label}
      </p>
      {variant === 'amount' && (
        <div className={css.amountF}>
          <NorthEastIcon />

          <p style={{ margin: 2 }}>{field}</p>
        </div>
      )}

      {variant === 'narration' && (
        <div className={css.narrationF}>
          {/* <img
            src="https://previews.123rf.com/images/blankstock/blankstock1803/blankstock180300109/97120715-left-arrow-simple-icon-direction-arrowhead-symbol-navigation-pointer-sign-circle-flat-button-with-sh.jpg"
            style={{ width: '35px' }}
          /> */}

          <p
            style={{
              margin: 2,
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              height: '45px',
            }}
          >
            {field?.slice(0, 55)}
            {field?.length > 50 && '...'}
          </p>
        </div>
      )}

      {variant === 'paidTo' && (
        <div className={css.paidToF}>
          <p
            style={{
              margin: 2,
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              height: '45px',
            }}
          >
            {field?.slice(0, 45)}
            {field?.length > 50 && '...'}
          </p>

          <ExpandMoreIcon className={css.downIconColor} />
        </div>
      )}

      {variant === 'percent' && (
        <div className={css.percentF}>
          <p style={{ margin: 2, textAlign: 'center' }}>{field}</p>
        </div>
      )}

      {variant === 'towards' && (
        <div className={css.towardsF}>
          <p
            style={{
              margin: 2,
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              height: '45px',
            }}
          >
            {field?.slice(0, 45)}
            {field?.length > 50 && '...'}
          </p>

          <ExpandMoreIcon className={css.downIconColor} />
        </div>
      )}

      {variant === 'date' && (
        <div className={css.percentF}>
          <p style={{ margin: 2, textAlign: 'center' }}>{field}</p>
          <OnlyDatePicker selectedDate={field} onChange={handleChange} />
        </div>
      )}

      {variant === 'type' && (
        <div className={css.percentF}>
          <p style={{ margin: 2, textAlign: 'center' }}>{field}</p>
        </div>
      )}
    </div>
  );
};

export default ListItem;
