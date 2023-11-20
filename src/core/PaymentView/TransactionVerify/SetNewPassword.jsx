import React, { useState, memo } from 'react';
import { useDispatch } from 'react-redux';

import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

import {
  Stack,
  Typography,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import Input from '@components/Input/Input';

import * as css from './TransactionForgetPassword.scss';

const SetNewPassword = ({ onSubmit, btnDisable }) => {
  const dispatch = useDispatch();

  const initialState = {
    ShowPass: false,
    ShowConfPass: false,
    passErr: false,
    confpassErr: false,
    PassValue: '',
    ConfPassValue: '',
  };
  const [Password, setPassword] = useState(initialState);

  const HandlePassChange = (val) => {
    const reg_Pass =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (reg_Pass.test(val))
      setPassword({ ...Password, passErr: true, PassValue: val });
    else setPassword({ ...Password, passErr: false, PassValue: val });
  };

  const HandleConfPassChange = (val) => {
    setPassword({ ...Password, ConfPassValue: val });
  };

  const HandlePasswordShow = () => {
    if (Password.ShowPass) setPassword({ ...Password, ShowPass: false });
    else setPassword({ ...Password, ShowPass: true });
  };

  const HandleConfPasswordShow = () => {
    if (Password.ShowConfPass)
      setPassword({ ...Password, ShowConfPass: false });
    else setPassword({ ...Password, ShowConfPass: true });
  };

  const HandleSubmit = () => {
    if (Password.PassValue === Password.ConfPassValue) {
      if (Password.passErr)
        onSubmit(
          { pass: Password.PassValue, confpass: Password.ConfPassValue },
          'setpassword'
        );
      else
        dispatch(
          openSnackbar({
            message: "Password doesn't match the criteria!",
            type: MESSAGE_TYPE.ERROR,
          })
        );
    } else {
      dispatch(
        openSnackbar({
          message: "Password does't match!",
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
  };

  return (
    <Stack>
      <Typography className={`${css.subtitle}`}>Set New Password</Typography>
      <Stack>
        <Stack>
          <Input
            name="password"
            label="Enter New Transaction Password"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => HandlePassChange(e.target.value)}
            InputProps={{
              type: Password.ShowPass ? 'text' : 'password',
              className: 'PasswordInput',
              endAdornment: (
                <InputAdornment position="end" onClick={HandlePasswordShow}>
                  <IconButton size="small" style={{ color: '#283049' }}>
                    {/* {Password.ShowPass &&
                      (Password.passErr ? (
                        <CheckCircleOutlineOutlinedIcon
                          sx={{ color: '#00A676' }}
                        />
                      ) : (
                        <VisibilityOutlinedIcon sx={{ color: '#283049' }} />
                      ))} */}

                    {Password.ShowPass ? (
                      <>
                        {Password.passErr && (
                          <CheckCircleOutlineOutlinedIcon
                            sx={{ color: '#00A676' }}
                          />
                        )}
                        {!Password.passErr && (
                          <VisibilityOutlinedIcon sx={{ color: '#283049' }} />
                        )}
                      </>
                    ) : (
                      <VisibilityOffOutlinedIcon sx={{ color: '#283049' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
            className={
              Password.passErr
                ? `${css.inputElement} ${css.passinputElement} ${css.inputErr}`
                : `${css.inputElement} ${css.passinputElement}`
            }
            autoComplete="off"
          />
        </Stack>
        <Typography className={css.passvalidationtext}>
          Your Password should contain at the minimum 8 characters
          <br />
          1 Uppercase character <br />
          1 Lowercase character
          <br />
          1 Number
          <br />
          1 Special Character
          <br />
        </Typography>
        <Stack>
          <Input
            name="password"
            label="Confirm New Transaction Password"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => HandleConfPassChange(e.target.value)}
            InputProps={{
              type: Password.ShowConfPass ? 'text' : 'password',
              className: 'PasswordInput',
              endAdornment: (
                <InputAdornment position="end" onClick={HandleConfPasswordShow}>
                  <IconButton size="small" style={{ color: '#283049' }}>
                    {Password.ShowConfPass ? (
                      <VisibilityOutlinedIcon sx={{ color: '#283049' }} />
                    ) : (
                      <VisibilityOffOutlinedIcon sx={{ color: '#283049' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
            className={`${css.inputElement} ${css.passinputElement}`}
            autoComplete="off"
          />
        </Stack>
        <Typography className={css.notemsg}>
          <span>NOTE :</span> Your Transaction Password’s validity expires in 90
          Days. The reset window will open for you to update your Transaction
          Password after 90 Days.
        </Typography>
        <Stack className={css.proceedbtnwrap}>
          <Button
            className={css.proceedbtn}
            onClick={HandleSubmit}
            disabled={btnDisable}
          >
            Confirm
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(SetNewPassword);
