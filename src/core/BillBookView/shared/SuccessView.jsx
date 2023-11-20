import { Button } from '@material-ui/core';
// import * as Mui from '@mui/material';
import React, { useContext } from 'react';
import AppContext from '@root/AppContext.jsx';
import * as Router from 'react-router-dom';
import sucessAnimation from '@root/Lotties/paymentSucess.json';
import Lottie from 'react-lottie';
import * as css from './SuccessView.scss';

const SuccessView = (props) => {
  const { title, description, onClick, btnTitle, btnStyle, redir, typePage } = props;
  const device = localStorage.getItem('device_detect');
  const { changeView, changeSubView } = useContext(AppContext);
  const navigate = Router.useNavigate();
  const returnToDashboard = () => {
    if (typePage?.name === 'emailBill') {
      navigate('/bill-box-email', { state: typePage?.stateForBack });
      return;
    }
    changeView('dashboard');
    changeSubView('');
    navigate('/dashboard');
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
    <>
      <div
        style={{
          width: device === 'mobile' ? '100%' : '50%',
          margin: device === 'mobile' ? '24px 0 0 0' : '0 26%',
        }}
        className={css.successMainContainer}
      >
        <div className={css.successViewContainerNew}>
          <div className={css.tickImg}>
            <Lottie options={defaultOptions} />
          </div>
          {title && <div className={css.title}>{title}</div>}
          <div className={css.description}>{description}</div>
          <div className={css.actionContainer}>
            {!typePage && <Button
              variant={btnStyle || 'contained'}
              className={
                btnStyle === 'outlined' ? css.outlineButton : css.actionButton
              }
              onClick={onClick}
              size="medium"
            >
              {btnTitle || 'Add another bill'}
            </Button>}
            {!redir && (
              <div
                className={css.linkDashboard}
                onClick={() => returnToDashboard()}
                role="link"
              >
                Return to Dashboard
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessView;
