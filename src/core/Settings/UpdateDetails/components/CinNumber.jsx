import React from 'react';
// import * as Mui from '@mui/material';
import { OnlyAlphaNumeric } from '@components/utils';
import Input from '@components/Input/Input.jsx';
import { validateCin } from '@services/Validation.jsx';
import { makeStyles } from '@material-ui/core/styles';
import * as themes from '@root/theme.scss';
// import CloseIcon from '@mui/icons-material/Close';
import InputBusiness from '../../../../components/Input/inputBusiness';

const useStyles = makeStyles(() => ({
  header: {
    color: '#2E3A59 !important',
    fontSize: '13px !important',
    fontWeight: '600 !important',
    textTransform: 'uppercase',
    alignSelf: 'center',
  },
  headerIcon: {
    color: '#2E3A59 !important',
  },
  filledBtn: {
    borderRadius: '20px !important',
    backgroundColor: '#F08B32 !important',
    width: '203px !important',

    marginTop: '2rem !important',
  },
  filledBtnText: {
    textTransform: 'capitalize',
    color: 'white',
    fontSize: '14px !important',
  },
  root: {
    background: '#FFF',
    // border: '0.7px solid',
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
    margin: '0px !important',
    '& .MuiInputLabel-root': {
      margin: '0px',
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiInput-root': {
      marginTop: '24px',
    },
    '& .MuiInput-multiline': {
      paddingTop: '10px',
    },
    '& .MuiSelect-icon': {
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiSelect-select': {
      borderColor: themes.colorInputBorder,
    },
    '& .MuiInputBase-adornedEnd .MuiSvgIcon-root': {
      marginTop: '-10px',
    },
  },
}));

const CinNumberSheet = ({
  infoData,
  // closeDrawer,
  cinNumber,
  setCinNumber,
  // UpdateCINNumber,
}) => {
  const classes = useStyles();
  const [validationErr, setValidationErr] = React.useState(false);
  const device = localStorage.getItem('device_detect');

  const reValidate = (ps) => {
    setValidationErr(!validateCin(ps?.target.value));
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    setCinNumber((prev) => ({ ...prev, change: ps?.target.value }));
  };

  return device === 'mobile' ? (
    <>
      {infoData && (
        <div style={{ margin: '0 0 18px 0' }}>
          <Input
            label="Business CIN Number"
            className={` ${classes.root}`}
            onChange={onInputChange}
            value={cinNumber?.change?.toLocaleUpperCase()}
            onBlur={reValidate}
            error={validationErr}
            helperText={validationErr ? 'Enter Valid CIN Number' : ''}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            autoComplete="off"
          />
        </div>
      )}
      {/* <Mui.Stack direction="row" style={{ justifyContent: 'space-between' }}>
        <Mui.Typography className={classes.header}>
          business CIN NUMBER
        </Mui.Typography>
        <CloseIcon
          className={classes.headerIcon}
          onClick={() => {
            closeDrawer('businessPhNo');
            setCinNumber((prev) => ({ ...prev, change: prev?.original }));
          }}
        />
      </Mui.Stack>

      <Mui.Stack spacing={2} alignItems="center" mt={2}>
        {infoData && (
          <Input
            label="Enter CIN Number"
            onChange={onInputChange}
            value={cinNumber?.change?.toLocaleUpperCase()}
            onBlur={reValidate}
            error={validationErr}
            helperText={validationErr ? 'Enter Valid CIN Number' : ''}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            autoComplete="off"
          />
        )}
        <Mui.Button
          variant="contained"
          className={classes.filledBtn}
          onClick={() => {
            if (!validationErr) {
              UpdateCINNumber();
            }
          }}
        >
          <Mui.Typography className={classes.filledBtnText}>
            Save CIN Number
          </Mui.Typography>
        </Mui.Button>
      </Mui.Stack> */}
    </>
  ) : (
    <>
      {infoData && (
        <div style={{ margin: '0 0 18px 0' }}>
          <InputBusiness
            label="Business CIN Number"
            onChange={onInputChange}
            value={cinNumber?.change?.toLocaleUpperCase()}
            onBlur={reValidate}
            error={validationErr}
            helperText={validationErr ? 'Enter Valid CIN Number' : ''}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #999ea563',
            }}
            autoComplete="off"
            onKeyPress={OnlyAlphaNumeric}
          />
        </div>
      )}
    </>
  );
};

export default CinNumberSheet;
