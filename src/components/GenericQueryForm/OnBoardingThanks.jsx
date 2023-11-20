import React from 'react';
import * as Router from 'react-router-dom';
import * as Mui from '@mui/material';
import * as css from './Onboarding.scss';

const OnBoardingThanks = ({ supportMail, organizationName }) => {
  const navigate = Router.useNavigate();
  return (
    <section>
      <div>
        <Mui.Stack direction="column" className={css.vendorFields}>
          <div>
            <p className={css.subTitleVendor}>Thank you </p>
          </div>

          <p className={css.thanksPtag}>
            Your details have been submitted successfully.
            <br />
            <br />
            <span className={css.thanksPtag}>
              In case of any queries, please reach out to{' '}
              <a
                className={css.thanksPtag}
                style={{ color: '#3049BF' }}
                target="_blank"
                rel="noreferrer"
                href={`mailto:${supportMail}`}
              >
                {supportMail}
              </a>
              .
            </span>{' '}
          </p>

          <p className={css.thanksPtag}>
            Thanking you.
            <br />
            {organizationName}
          </p>
        </Mui.Stack>

        <Mui.Stack
          direction="row"
          justifyContent="center"
          className={css.vendorFields}
        >
          <Mui.Button
            variant="contained"
            className={css.containedButton}
            onClick={() => {
              navigate('/');
            }}
          >
            Close
          </Mui.Button>
        </Mui.Stack>
      </div>
    </section>
  );
};

export default OnBoardingThanks;
