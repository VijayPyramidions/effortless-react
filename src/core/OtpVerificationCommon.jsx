import * as React from 'react';
import * as Mui from '@mui/material';
import OtpInput from 'react-otp-input';

const OtpVerificationCommon = ({ head }) => {
  return (
    <>
      <Mui.Grid container style={{ overflow: 'hidden' }}>
        <Mui.Grid
          item
          xs={12}
          lg={12}
          md={12}
          sm={12}
          style={{
            marginBottom: '2rem',
            marginLeft: '1rem',
            marginRight: '1rem',
          }}
        >
          {/* <Mui.Box sx={{ width: '100%' }}> */}
          <Mui.Stack style={{ textAlign: 'center' }}>
            <Mui.Typography
              style={{
                paddingBottom: '19px',
                alignSelf: 'flex-start',
                fontWeight: '400',
                fontSize: '16px',
                lineHeight: '20px',
                color: '#F08B32',
              }}
            >
              {' '}
              {head}
            </Mui.Typography>
            <Mui.Grid
              style={{
                paddingBottom: '16px',
                fontWeight: '500',
                fontSize: '24px',
                lineHeight: '41px',
                letterSpacing: '0.374px',
                color: '#283049',
              }}
            >
              Verification Code
            </Mui.Grid>
            <Mui.Grid
              style={{
                fontWeight: '300',
                fontSize: '16px',
                lineHeight: '150%',
                textAlign: 'center',
                letterSpacing: '0.374px',
                color: '#6E6E6E',
              }}
            >
              Please enter the verification code{' '}
            </Mui.Grid>
            <Mui.Grid
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Mui.Grid
                style={{
                  fontWeight: '300',
                  fontSize: '16px',
                  lineHeight: '150%',
                  textAlign: 'center',
                  letterSpacing: '0.374px',
                  color: '#6E6E6E',
                }}
              >
                sent to
              </Mui.Grid>
              <Mui.Grid
                style={{
                  paddingBottom: '43px',
                  fontWeight: '500',
                  fontSize: '18px',
                  lineHeight: '150%',
                  textAlign: 'center',
                  letterSpacing: '0.374px',
                  color: '#283049',
                }}
              >
                +91 6865577889
              </Mui.Grid>
            </Mui.Grid>
            <Mui.Grid
              style={{
                alignSelf: 'center',
                paddingBottom: '43px',
              }}
            >
              <OtpInput
                // value={otp}
                // onChange={(otp) => setOTP(otp)}
                numInputs={6}
                // inputStyle="otpInput"
                style={{}}
                inputStyle={{
                  width: '45.76px',

                  height: '56px',
                  left: '153.83px',
                  backgroundColor: '#FDDFC5',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxSizing: 'border-box',
                  borderRadius: '8px',
                }}
                // className={classes.otp}
                separator={
                  <span
                    style={{
                      paddingRight: '10px',
                    }}
                  >
                    {' '}
                  </span>
                }
              />
            </Mui.Grid>
            <Mui.Grid
              style={{
                paddingBottom: '19px',
                fontWeight: '300',
                fontSize: '16px',
                lineHeight: '150%',
                textAlign: 'center',
                letterSpacing: '0.374px',

                color: '#6E6E6E',
              }}
            >
              Didn’t receive OTP?
            </Mui.Grid>
            <Mui.Grid
              style={{
                fontWeight: '500',
                fontSize: '16px',
                lineHeight: '150%',
                textAlign: 'center',
                letterSpacing: '0.374px',
                textDecorationLine: 'underline',

                color: '#283049',
              }}
            >
              Resent OTP
            </Mui.Grid>
          </Mui.Stack>
          {/* </Mui.Box> */}
        </Mui.Grid>
      </Mui.Grid>
      <Mui.Stack component={Mui.CardActions} sx={{ padding: '27px' }}>
        <Mui.Button
          style={{
            border: '2px solid #F08B32',
            boxSizing: 'border-box',
            borderRadius: ' 45px',
            backgroundColor: '#F08B32',
            fontWeight: 'bold',
            fontSize: '14px',
            textTransform: 'capitalize',
            // paddingInline: '2rem',
            width: '144px',
            color: 'white',
            // marginBottom: '30px',
            alignSelf: 'center',
          }}
          // onClick={() => {
          //   setBottomSheetName(true);
          // }}
        >
          {' '}
          Done
        </Mui.Button>
      </Mui.Stack>
    </>
  );
};
export default OtpVerificationCommon;
