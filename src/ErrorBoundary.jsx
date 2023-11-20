import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as css from '@root/App.scss';
import { UnavailablePage } from '@components/SvgIcons/SvgIcons.jsx';
import { Button } from '@material-ui/core';

function ErrorBoundary({ children }) {
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState();
  window.errb = function onErrClose(data) {
    setErrorType(data);
    setHasError(true);
  };

  useEffect(() => {
    function handleError(error, info) {
      // You can also log the error to an error reporting service
      console.error(error, info);
      setHasError(true);
    }

    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    // You can render any custom fallback UI
    return (
      <div className={css.errorBoundaryCss}>
        <p
          className={
            device === 'mobile'
              ? `${css.errorHeaderText} ${css.errorHeaderTextMobile}`
              : css.errorHeaderText
          }
        >
          Oh Oh !
        </p>
        <UnavailablePage
          className={
            device === 'mobile'
              ? `${css.UnavailablePageImg} ${css.UnavailablePageImgMobile}`
              : css.UnavailablePageImg
          }
        />
        <div className={css.errorBottomCont}>
          <div
            className={
              device === 'mobile'
                ? `${css.errorBottomTextCont} ${css.errorBottomTextContMobile}`
                : `${css.errorBottomTextCont} ${css.errorBottomTextContDesktop}`
            }
          >
            <p className={css.errorBottomHeaderText}>
              This Page is currently unavailable
            </p>
            <p className={css.errorBottomDescriptionText}>
              The page you requested cannot be found on our server. Please check
              the URL and try again
            </p>
          </div>
          <Button
            className={css.errorBottomButtonCont}
            onClick={() => {
              setHasError(false);
              if (errorType === 'rateLimit') navigate('/');
              else navigate('/dashboard');
            }}
          >
            {errorType === 'rateLimit' ? `Back to Login` : `Back to Dashboard`}
          </Button>
        </div>
      </div>
    );
  }

  return children;
}

export default ErrorBoundary;
