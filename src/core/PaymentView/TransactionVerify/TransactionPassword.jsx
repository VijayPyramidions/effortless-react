/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Input from '@components/Input/Input.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import Radio from '@mui/material/Radio';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import * as Mui from '@mui/material';
import OTPInput from 'react-otp-input-rc-17';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import successRight from '@assets/success.png';
// import * as Router from 'react-router-dom';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import * as css from '../../Banking/banking.scss';

const TextfieldStyle = (props) => {
  return (
    <Input
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      required
      // fullWidth
      theme="light"
      className={css.textfieldStyle}
    />
  );
};

const TransactionPassword = ({ onClose }) => {
  const { user, currentUserInfo, openSnackBar, getCurrentUser, organization } =
    React.useContext(AppContext);

  const { congratsDrawer } = useSelector((state) => state.Banking);

  const [transactionPassword, setTransactionPassword] = React.useState(false);
  const [otpDrawer, setOtpDrawer] = React.useState(false);
  const [passwordError, setPasswordErr] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  const [questionErr, setQuestionErr] = React.useState('');
  const [answerErr, setAnswerErr] = React.useState('');
  const [sheetname, setsheetname] = React.useState('');
  const [list, setList] = React.useState();
  const [question, setQuestion] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [conformPassword, setConformPassword] = React.useState();
  const [answer, setAnswer] = React.useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  // const navigate = Router.useNavigate();
  const device = localStorage.getItem('device_detect');

  const handlePasswordChange = (evnt) => {
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
    if (passwordInputFieldName === 'password') setPassword(passwordInputValue);
    if (passwordInputFieldName === 'confirmPassword')
      setConformPassword(passwordInputValue);
  };

  const handleValidation = (evnt) => {
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
    if (passwordInputFieldName === 'password') {
      const uppercaseRegExp = /(?=.*?[A-Z])/;
      const lowercaseRegExp = /(?=.*?[a-z])/;
      const digitsRegExp = /(?=.*?[0-9])/;
      const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
      const minLengthRegExp = /.{8,}/;
      const passwordLength = passwordInputValue?.length;
      const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
      const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
      const digitsPassword = digitsRegExp.test(passwordInputValue);
      const specialCharPassword = specialCharRegExp.test(passwordInputValue);
      const minLengthPassword = minLengthRegExp.test(passwordInputValue);
      let errMsg = '';
      if (passwordLength === 0) {
        errMsg = 'Password is empty';
      } else if (!uppercasePassword) {
        errMsg = 'At least one Uppercase';
      } else if (!lowercasePassword) {
        errMsg = 'At least one Lowercase';
      } else if (!digitsPassword) {
        errMsg = 'At least one digit';
      } else if (!specialCharPassword) {
        errMsg = 'At least one Special Characters';
      } else if (!minLengthPassword) {
        errMsg = 'At least minumum 8 characters';
      } else {
        errMsg = '';
      }
      setPasswordErr(errMsg);
    }
    // for confirm password
    if (
      passwordInputFieldName === 'confirmPassword' ||
      (passwordInputFieldName === 'password' && conformPassword?.length > 0)
    ) {
      if (conformPassword !== password) {
        setConfirmPasswordError('Confirm password is not matched');
      } else {
        setConfirmPasswordError('');
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const RadioOption = (e, pwd, conpwd) => {
    setsheetname('pwd');
    setQuestion(e);
    setPassword(pwd);
    setConformPassword(conpwd);
  };

  const Proceed = () => {
    if (password === conformPassword && passwordError === '') {
      if (question) {
        setQuestionErr('');
        if (answer) {
          setAnswerErr('');
          RestApi(`users/transaction_passwords`, {
            method: METHOD.POST,
            headers: {
              Authorization: `Bearer ${user.activeToken}`,
            },
            payload: {
              security_answer: answer,
              transaction_password: password,
              confirm_transaction_password: conformPassword,
              security_question: question,
            },
          }).then(async (res) => {
            if (res && !res.error) {
              await getCurrentUser(organization.orgId);
              setOtpDrawer(false);
              // navigate(-1);
              onClose();
              if (res?.message) {
                openSnackBar({
                  message: res?.message || 'Success',
                  type: MESSAGE_TYPE.INFO,
                });
              }
            } else {
              openSnackBar({
                message: res?.message || 'Error',
                type: MESSAGE_TYPE.ERROR,
              });
              onClose();
            }
          });
        } else {
          setAnswerErr('Please enter valid answer');
        }
      } else {
        setQuestionErr('Please select the Secutity Question');
      }
    } else {
      if (!password) {
        setPasswordErr('Please enter valid password');
      }
      if (!conformPassword) {
        setConfirmPasswordError('Please enter valid password');
      }
      if (!question) setQuestionErr('Please select the Secutity Question');
      if (!answer) setAnswerErr('Please enter valid answer');
    }
  };

  const OtpDrawer = () => {
    RestApi(`users/transaction_passwords/otp`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        setOtpDrawer(true);
        setsheetname('');
        setTransactionPassword(false);
      }
    });
  };

  const Questions = () => {
    RestApi(`users/transaction_passwords/security_questions`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      setList(res);
    });
  };

  React.useEffect(() => {
    Questions();
  }, []);

  //   const Congrats = () => {
  const [otp, setOtp] = React.useState('');
  const DoneClick = () => {
    RestApi(`users/transaction_passwords/verify_otp`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        transaction_otp: otp,
      },
    }).then((res) => {
      if (!res?.error) {
        setQuestion('');
        setTransactionPassword(true);
      } else if (res?.error) {
        openSnackBar({
          message: res.message,
          type: MESSAGE_TYPE.ERROR,
        });
      } else {
        openSnackBar({
          message: res,
          type: MESSAGE_TYPE.ERROR,
        });
      }
    });
  };
  return (
    <>
      <Mui.Stack
        className={
          device === 'desktop' ? css.congratsStackDesktop : css.congratsStack
        }
      >
        <Mui.Stack className={css.congratsStack1}>
          <img src={successRight} alt="success" style={{ width: '25%' }} />
          <Mui.Typography className={css.congratsText1}>
            {congratsDrawer.accountType === 'icici'
              ? `Your ICICI Bank Account has been added successfully`
              : `Welcome to your Effortless Virtual Account`}
          </Mui.Typography>
          <Mui.Typography className={css.congratsText2}>
            {`You have successfully set up your ${
              congratsDrawer.accountType === 'icici'
                ? 'ICICI Bank'
                : 'Effortless Virtual'
            }  Account.`}
          </Mui.Typography>
          <SelectBottomSheet
            name="Verification"
            addNewSheet
            triggerComponent={
              <Mui.Button variant="contained" className={css.btnVisit}>
                <Mui.Typography
                  className={css.btnTextVisit}
                  onClick={() => OtpDrawer()}
                >
                  Set Transactions Password
                </Mui.Typography>
              </Mui.Button>
            }
            open={otpDrawer}
            maxHeight="45vh"
            hideClose
          >
            {sheetname === 'quest' ? (
              <div
                className={
                  device === 'desktop'
                    ? css.questionStackDesktop
                    : css.questionStack
                }
              >
                <Mui.Typography className={css.heading}>
                  List of security Questions
                </Mui.Typography>
                <Mui.Divider className={css.divider} />
                {list?.data?.map((c) => {
                  return (
                    <Mui.FormControl>
                      <Mui.Stack
                        direction="row"
                        htmlFor="my-input"
                        onClick={() => {
                          // console.log(password, 'LLLLLLL');
                          RadioOption(c, password, conformPassword);
                        }}
                        className={css.listStack}
                      >
                        <Radio
                          className={css.radio}
                          checked={question === c}
                          id="my-input"
                        />
                        <Mui.Typography
                          className={css.list}
                          id="my-helper-text"
                        >
                          {c}
                        </Mui.Typography>
                      </Mui.Stack>
                    </Mui.FormControl>
                  );
                })}
              </div>
            ) : transactionPassword ? (
              <Mui.Stack
                className={
                  device === 'desktop'
                    ? css.transactionStackDesktop
                    : css.transactionStack
                }
              >
                <Mui.Typography className={css.heading}>
                  Set a Transaction Password
                </Mui.Typography>
                <Mui.Divider className={css.divider} />
                <TextfieldStyle
                  style={{
                    border: '1px solid  rgba(153, 158, 165, 0.39)',
                    background: 'rgba(237, 237, 237, 0.15)',
                    margin: '1rem 0rem 0',
                  }}
                  label="Enter Transaction Password"
                  name="password"
                  onKeyUp={(e) => handleValidation(e)}
                  onChange={(e) => handlePasswordChange(e)}
                  value={password}
                  InputProps={{
                    type: showPassword ? 'password' : 'text',
                    endAdornment: (
                      <Mui.InputAdornment
                        position="end"
                        onClick={handleClickShowPassword}
                      >
                        <Mui.IconButton size="small" style={{ color: '#000' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </Mui.IconButton>
                      </Mui.InputAdornment>
                    ),
                  }}
                />
                <p
                  className={css.textdanger}
                  style={{
                    margin: `${passwordError ? '5px 0 0 0' : '2px 0 0 0'}`,
                  }}
                >
                  {passwordError}
                </p>
                <Mui.Typography className={css.list}>
                  Your Password should contain at the minimum 8 characters
                  <br />
                  1.Uppercase character <br />
                  2.Lowercase character
                  <br />
                  3.Number <br />
                  4.Special Character
                </Mui.Typography>
                <TextfieldStyle
                  label="Confirm Transaction Password"
                  style={{
                    border: '1px solid  rgba(153, 158, 165, 0.39)',
                    background: 'rgba(237, 237, 237, 0.15)',
                    margin: '1rem 0rem 0 ',
                  }}
                  name="confirmPassword"
                  onKeyUp={(e) => handleValidation(e)}
                  onChange={(e) => handlePasswordChange(e)}
                  value={conformPassword}
                  InputProps={{
                    type: showConfirmPassword ? 'password' : 'text',
                    endAdornment: (
                      <Mui.InputAdornment
                        position="end"
                        onClick={handleClickShowConfirmPassword}
                      >
                        <Mui.IconButton size="small" style={{ color: '#000' }}>
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </Mui.IconButton>
                      </Mui.InputAdornment>
                    ),
                  }}
                />
                <p
                  className={css.textdanger}
                  style={{
                    margin: `${
                      confirmPasswordError ? '10px 0 0 0' : '5px 0 0 0'
                    }`,
                  }}
                >
                  {confirmPasswordError}
                </p>
                <Mui.Stack
                  className={css.select}
                  direction="row"
                  onClick={() => setsheetname('quest')}
                  style={{ margin: '1rem 0rem 0' }}
                >
                  <Mui.Stack>
                    <Mui.Typography className={css.selectHeading}>
                      Select Security Question
                    </Mui.Typography>
                    <Mui.Typography className={css.selectAnswer}>
                      {question}
                    </Mui.Typography>
                  </Mui.Stack>
                  <KeyboardArrowDownIcon className={css.arrow} />
                </Mui.Stack>
                {!question && (
                  <p
                    className={css.textdanger}
                    style={{
                      margin: `${questionErr ? '10px 0 0 0' : '5px 0 0 0'}`,
                    }}
                  >
                    {questionErr}
                  </p>
                )}
                <TextfieldStyle
                  label="Enter Your Answer"
                  style={{
                    border: '1px solid  rgba(153, 158, 165, 0.39)',
                    background: 'rgba(237, 237, 237, 0.15)',
                    margin: '1rem 0rem 0',
                  }}
                  // text="capital"
                  onChange={(e) => setAnswer(e.target.value)}
                  value={answer}
                />
                {!answer && (
                  <p
                    className={css.textdanger}
                    style={{
                      margin: `${answerErr ? '10px 0 0 0' : '5px 0 0 0'}`,
                    }}
                  >
                    {answerErr}
                  </p>
                )}

                <p className={css.note}>
                  <span className={css.noteFont}>Note:</span>Your Transaction
                  Password’s validity expires in 90 Days. The reset window will
                  open for you to update your Transaction Password after 90
                  Days.
                </p>
                <Mui.Stack className={css.confirmBtn} onClick={() => Proceed()}>
                  Confirm & Proceed
                </Mui.Stack>
              </Mui.Stack>
            ) : (
              <Mui.Stack
                className={
                  device === 'desktop'
                    ? css.verificationStackDesktop
                    : css.verificationStack
                }
              >
                <Mui.Typography className={css.text1}>
                  Effortless Virtual Account
                </Mui.Typography>
                {device === 'desktop' ? (
                  <Mui.Divider className={css.divider} />
                ) : (
                  ''
                )}
                <Mui.Typography className={css.text2}>
                  Verification Code
                </Mui.Typography>
                <p
                  className={css.text3}
                  style={{ display: 'block', maxWidth: 330 }}
                >
                  Please enter the verification code sent to
                  <span className={css.number}>
                    +91 {currentUserInfo?.mobileNumber}
                  </span>
                </p>
                <Mui.Stack className={css.otpStack}>
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    style={{ width: '200px' }}
                    inputStyle={{
                      width: '41px',
                      height: '41px',
                      background: '#FDDFC5',
                      border: '0.7px solid #FDDFC5',
                      boxSizing: 'border-box',
                      borderRadius: '10px',
                    }}
                    separator={
                      <span
                        style={{
                          padding: '5px 5px ',
                        }}
                      />
                    }
                  />
                </Mui.Stack>
                <Mui.Typography className={css.text4}>
                  Didn’t receive OTP?
                </Mui.Typography>
                <Mui.Typography
                  className={css.text5}
                  onClick={() => OtpDrawer()}
                  role="presentation"
                >
                  resend otp
                </Mui.Typography>
                <Mui.Stack className={css.done} onClick={() => DoneClick()}>
                  done
                </Mui.Stack>
              </Mui.Stack>
            )}
          </SelectBottomSheet>
        </Mui.Stack>
      </Mui.Stack>
    </>
  );
};

export default TransactionPassword;
