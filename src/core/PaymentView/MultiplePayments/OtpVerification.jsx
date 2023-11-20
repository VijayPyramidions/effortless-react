import React, { useContext } from 'react';
import {
  // Card,
  Grid,
  // Typography,
  // ListItem,
  // ListItemText,
  Button,
  Card,
  // Box
} from '@material-ui/core';
import otp from '@assets/phone icon.svg';
// import { makeStyles } from '@material-ui/core/styles';
//   import Divider from '@material-ui/core/Divider';

//   import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import AppContext from '@root/AppContext.jsx';
import Input from '@components/Input/Input.jsx';

// const useStyles = makeStyles(() => ({
//   text: {
//     height: 60,
//     color: 'red',
//     '& .MuiInputBase-root': {
//       backgroundColor: 'rgba(237, 237, 237, 0.15)',
//       border: '0.7px solid rgba(153, 158, 165, 0.39)',
//       color: 'red',
//       height: 60,
//       '& input': {
//         textAlign: 'left',
//         color: '#6E6E6E',
//       },
//       '&. .MuiInputLabel-filled': {
//         color: 'red',
//       },
//     },
//   },
// }));

const OtpVerification = () => {
  const { changeSubView } = useContext(AppContext);
  // const onclick = (view) => {
  //   console.log('viewotp', view);
  //   changeSubView('approve');
  // };

  // const classes = useStyles();

  return (
    <>
      {/* <Typography
          style={{
            color: 'white',
            paddingBottom: '4%',
            marginTop: '3px',
            paddingLeft: '5%',
          }}
        >
          Payments Approval
        </Typography> */}
      <Grid style={{ backgroundColor: 'white', height: '100%', width: '100%' }}>
        <Card style={{ height: '100%', overflow: 'auto' }}>
          <Grid
            style={{ paddingTop: '3%', paddingLeft: '3%', fontSize: '16px' }}
          >
            Verification
            {/* </Grid> */}
          </Grid>

          <Grid
            style={{
              border: '1px solid #F08B32',
              width: '3%',
              marginLeft: '4%',
              marginTop: '1%',
            }}
          />
          <Grid
            style={{
              textAlignLast: 'center',
              paddingLeft: '26%',
              paddingTop: '8%',
              width: '50%',
            }}
          >
            <img
              src={otp}
              style={{ width: '20%', paddingBottom: '35px' }}
              alt="Well Done"
            />
          </Grid>
          <Grid
            style={{
              textAlignLast: 'center',
              display: 'flex',
              flexDirection: 'column',
              fontSize: '16px',
            }}
          >
            <Grid>Enter the verification code we sent to</Grid>
            <Grid style={{ color: '#36E3C0' }}>1234567890</Grid>
          </Grid>
          <div
            style={{
              paddingLeft: '10%',
              paddingRight: '10%',
              paddingTop: '35px',
              paddingBottom: '35px',
              width: '80%',
            }}
          >
            <Input
              label="Type otp here"
              variant="standard"
              // value={" "}
              style={{
                backgroundColor: 'rgba(237, 237, 237, 0.15)',
                border: '0.7px solid rgba(153, 158, 165, 0.39)',
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
            {/* <TextField
              className={classes.text}
              required
              fullWidth
              id="filled-required"
              label="Type otp here"
              defaultValue=""
              variant="filled"
            /> */}
          </div>
          <Grid style={{ textAlignLast: 'center' }}>
            <Button
              style={{
                backgroundColor: '#F08B32',
                color: 'white',
                borderRadius: '29px',
                padding: '1%',
                paddingLeft: '6%',
                paddingRight: '6%',
                width: '40%',
              }}
              onClick={() => {
                changeSubView('approved');
              }}
            >
              Submit
            </Button>
          </Grid>
          <Grid
            style={{
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'row',

              paddingBottom: '15%',
              paddingTop: '6%',
              fontSize: '16px',
            }}
          >
            <Grid>Didnt get the code?</Grid>
            <Grid style={{ color: '#36E3C0' }}>Resend</Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid style={{ height: '20%', backgroundColor: 'white' }} />
      {/* </Grid> */}
    </>
  );
};

export default OtpVerification;
