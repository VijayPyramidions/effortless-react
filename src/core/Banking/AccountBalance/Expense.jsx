import * as React from 'react';
import * as Mui from '@mui/material';
import MuiTextField from '@material-ui/core/TextField';
import * as theme from '@root/theme.scss';
import { makeStyles, withStyles } from '@material-ui/core/styles';
// import Input from '@components/Input/Input.jsx';
import uploadBanking from '@assets/uploadBanking.svg';
// import AppContext from '@root/AppContext.jsx';

// import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
// import { CommonDrawer } from './CommonDrawer';
import * as css from './categorize.scss';

const Input = withStyles({
  root: (props) => {
    const borderColor =
      props.theme === 'light' ? theme.colorMain : theme.colorWhiteLight;
    const labelColor =
      props.theme === 'light' ? theme.colorGrey : theme.colorWhiteLight;
    const color =
      props.theme === 'light' ? theme.colorDark : theme.colorWhiteDark;
    const formControlMargin =
      props.type !== 'date'
        ? {
            marginTop: '12px',
            marginLeft: '10px',
            paddingRight: '16px',
          }
        : { margin: '18px 10px' };
    return {
      border: `1px solid rgba(160, 164, 175, 0.46) `,
      borderRadius: '8px',
      // minHeight: '56px',
      marginBottom: '24px',
      height: '43px',
      ...props.rootStyle,
      '& .MuiInputLabel-root': {
        padding: '0px 15px',
        color: labelColor,
        fontWeight: 400,
        fontSize: '13px',
        '&.Mui-error': {
          color: theme.colorError,
        },
      },
      '& .MuiInputLabel-root.MuiInputLabel-shrink': {
        padding: '4px 4px',
      },
      '& .MuiInputBase-root': {
        color,
        width: props.type === 'date' ? '80%' : '100%',
        fontWeight: 400,
        fontSize: '14px',
      },
      '& .MuiInputBase-input': {
        padding: '-10px',
      },
      '& label + .MuiInput-formControl': {
        ...formControlMargin,
      },
      '& label.Mui-focused': {
        color: borderColor,
        fontWeight: 400,
      },
      '& .MuiInput-underline:after, .MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before':
        {
          borderBottom: 'none',
        },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          border: 'none',
        },
        '&:hover fieldset': {
          border: 'none',
        },
        '&.Mui-focused fieldset': {
          border: 'none',
        },
      },

      '& .MuiFormHelperText-root': {
        paddingLeft: '8px',
        color: theme.colorError,
        position: 'absolute',
        bottom: '-20px',
        fontSize: '10px',
      },
      '& .MuiInputAdornment-root': {
        margin: '0 4px 12px',
      },
      '& .MuiFormLabel-asterisk': {
        color: 'black',
      },
    };
  },
})(MuiTextField);

const useStyles = makeStyles(() => ({
  root: {},

  expenseInput: {
    backgroundColor: 'rgba(237, 237, 237, 0.15)',
    border: '0.7px solid rgba(153, 158, 165, 0.39)',
    width: '93%',
    minHeight: '34px',
  },
  lastStack: {
    marginLeft: '10px',
    marginRight: '10px',
  },
}));
const Expense = ({ setCategory, ExpenseDat }) => {
  const classes = useStyles();
  // const { changeSubView } = React.useContext(AppContext);

  React.useEffect(() => {
    setCategory('expense');
  }, []);

  const [gst, SetGst] = React.useState('');
  // const [gst2, SetGst2] = React.useState('');
  const [gst3, SetGst3] = React.useState('');
  const [taxVal, setTaxVal] = React.useState('');
  const [totalVal, setTotalVal] = React.useState('');
  // const [sgstDisable, setsgstDisable] = React.useState(false);

  // const [expense,set]=React.useState();
  React.useEffect(() => {
    const totalGst = +gst * 2 + +gst3;
    const totalVals = totalGst + +taxVal;
    setTotalVal(totalVals);
    ExpenseDat({ amount: taxVal, taxAmt: totalGst });
  }, [taxVal, gst3, gst]);

  return (
    <>
      <Mui.Grid
        style={{
          fontWeight: '700',
          fontSize: '13px',
          lineHeight: '16px',
          marginTop: '16px',
          marginBottom: '10px',
          color: '#333333',
        }}
      >
        Upload Bill
      </Mui.Grid>
      <Mui.Stack
        direction="row"
        justifyContent="space-around"
        style={{
          backgroundColor: 'rgba(241, 241, 239, 0.6)',
          borderRadius: '8px',
          paddingBlock: '11px',
          alignItems: 'center',
        }}
      >
        <Mui.Grid
          style={{
            fontWeight: '400',
            color: '#283049',
            fontSize: '14px',
          }}
        >
          Clik here to Upload
        </Mui.Grid>
        <Mui.Grid>
          <img
            src={uploadBanking}
            style={{ verticalAlign: '-webkit-baseline-middle' }}
            alt="upload"
          />
        </Mui.Grid>
      </Mui.Stack>
      <Mui.Stack direction="column" className={classes.lastStack}>
        <Mui.Grid style={{ display: 'flex', flexDirection: 'row' }}>
          <Mui.Grid
            xs={6}
            lg={6}
            md={6}
            sm={6}
            style={{
              textAlignLast: 'left',
              marginTop: '22px',
              fontSize: '13px',
              color: 'grey',
            }}
          >
            Taxable Value
          </Mui.Grid>
          <Mui.Grid xs={6} lg={6} md={6} sm={6} style={{}}>
            <Input
              // label="Enter Your Name"
              variant="standard"
              value={taxVal}
              type="number"
              style={{
                backgroundColor: 'rgba(237, 237, 237, 0.15)',
                border: '0.7px solid rgba(153, 158, 165, 0.39)',
                width: '100%',
                height: ' 33px',
                marginTop: '19px',
                paddingLeft: '10px',
                marginLeft: '-16px',
              }}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={(e) => {
                setTaxVal(e.target.value);
              }}
              theme="light"
            />
          </Mui.Grid>
        </Mui.Grid>

        <Mui.Grid style={{ display: 'flex', flexDirection: 'row' }}>
          <Mui.Grid xs={4} lg={4} md={4} sx={4}>
            <Input
              label="SGST"
              type="number"
              variant="standard"
              value={gst}
              disabled={gst3 !== ''}
              //  autoFocus='true'
              autoComplete="off"
              className={classes.expenseInput}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={(e) => {
                SetGst(e.target.value);
              }}
              theme="light"
            />{' '}
          </Mui.Grid>
          <Mui.Grid xs={4} lg={4} md={4} sx={4}>
            <Input
              label="CGST"
              type="number"
              variant="standard"
              value={gst}
              disabled={gst3 !== ''}
              //  autoFocus='false'
              className={classes.expenseInput}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={(e) => {
                SetGst(e.target.value);
              }}
              theme="light"
            />{' '}
          </Mui.Grid>
          <Mui.Grid xs={4} lg={4} md={4} sx={4}>
            <Input
              label="IGST"
              type="number"
              variant="standard"
              disabled={gst !== ''}
              value={gst3}
              // autoFocus='false'
              className={classes.expenseInput}
              InputLabelProps={{
                shrink: true,
                //  inputProps: { min: 0, max: 10 }
              }}
              fullWidth
              onChange={(e) => {
                SetGst3(e.target.value);
              }}
              theme="light"
            />
          </Mui.Grid>
        </Mui.Grid>
        <Mui.Grid
          style={{
            display: 'flex',
            marginTop: '-10px',
            fontSize: '13px',
            color: 'grey',
          }}
        >
          <Mui.Grid xs={6} lg={6} md={6} sx={6} textAlignLast="left ">
            Total Value
          </Mui.Grid>
          <Mui.Grid xs={6} lg={6} md={6} sx={6}>
            <Input
              disabled="true"
              variant="standard"
              type="number"
              value={totalVal}
              className={css.lastInput}
              style={{
                paddingLeft: '10px',
                marginLeft: '-16px',
              }}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              // onChange={(e) => {
              //   setTemplateName(e.target.value);
              // }}
              theme="light"
            />
          </Mui.Grid>
        </Mui.Grid>
      </Mui.Stack>
    </>
  );
};
export default Expense;
