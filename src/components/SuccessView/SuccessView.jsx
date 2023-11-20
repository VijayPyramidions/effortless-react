import { Button } from '@material-ui/core';
import React, { useContext } from 'react';
import AppContext from '@root/AppContext.jsx';
import Lottie from 'react-lottie';
import sucessAnimation from '@root/Lotties/paymentSucess.json';
import * as css from './SuccessView.scss';

const SuccessView = (props) => {
  const { title, description, onClick, btnTitle, btnStyle, hideDashboardBtn } =
    props;
  const { changeView, changeSubView } = useContext(AppContext);
  const returnToDashboard = () => {
    changeView('dashboard');
    changeSubView('');
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: sucessAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className={css.successViewContainer}>
      <div className={css.tickImg}>
        <Lottie options={defaultOptions} />
      </div>

      {title && <div className={css.title}>{title}</div>}
      <div className={css.description}>{description}</div>
      <div className={css.actionContainer}>
        <Button
          variant={btnStyle || 'contained'}
          className={
            btnStyle === 'outlined' ? css.outlineButton : css.actionButton
          }
          onClick={onClick}
          size="medium"
        >
          {btnTitle || 'Add another bill'}
        </Button>
        {!hideDashboardBtn && (
          <div
            className={css.linkDashboard}
            onClick={returnToDashboard}
            role="link"
          >
            Return to Dashboard
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessView;
