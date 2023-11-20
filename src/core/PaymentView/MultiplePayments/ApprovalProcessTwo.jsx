import React, { useContext } from 'react';
import {
  // Card,
  Grid,
  Typography,
  ListItem,
  Button,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import AppContext from '@root/AppContext.jsx';
// import OtpVerification from './OtpVerification';

const useStyles = makeStyles((theme) => ({
  cardDesign: {
    backgroundColor: '#C4C4C4',
    paddingBottom: '5%',
    paddingLeft: '19px',
    paddingRight: '20px',
    paddingTop: '25px',
    borderRadius: '5%',
    position: 'relative',
    height: 'calc(100% - 156px)',
    // height:"100%",
    overflow: 'auto',
    display: 'flex',
    // flexDirection: 'column',
  },
  listofitems: {
    paddingTop: '28px',
    display: 'flex',
    alignItems: 'start',
    flexDirection: 'column',
    '&:hover, &:focus': {
      backgroundColor: theme.palette.background.yellow,
    },
  },
  buttons: {
    backgroundColor: '#F08B32',
    color: 'white',
    fontFamily: 'Arial',
    borderRadius: '25px',
    opacity: '1',
    fontSize: '10px',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  buttons2: {
    backgroundColor: '#C4C4C4',
    color: '#F08B32',
    fontFamily: 'Arial',
    borderRadius: '25px',
    // marginLeft:"50px",
    opacity: '1',
    fontSize: '10px',
    border: '2px solid #F08B32',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  List: {
    paddingBottom: '35px',
    color: 'rgba(40, 48, 73, 0.6)',
    fontWeight: '300',
    fontSize: '13px',
    lineHeight: '16px',
  },
  bottomButtons: {
    paddingTop: '3%',
    // backgroundColor:'#C4C4C4',
    paddingBottom: '3%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  List2: {
    paddingBottom: '35px',

    alignItems: 'end',
    color: '#283049',

    fontWeight: '300',
    fontSize: '13px',
    lineHeight: '16px',
  },
  listofitems2: {
    paddingTop: '28px',
    alignItems: 'end',

    display: 'flex',
    marginRight: '5%',
    flexDirection: 'column',
    // "&:hover, &:focus": {
    //   backgroundColor: theme.palette.background.yellow
    // }
  },
  listofitems4: {
    paddingTop: '28px',
    alignItems: 'end',
    display: 'flex',
    marginRight: '7%',
    flexDirection: 'column',
    // "&:hover, &:focus": {
    //   backgroundColor: theme.palette.background.yellow
    // }
  },
}));

const ApprovalProcess2 = () => {
  const { changeSubView } = useContext(AppContext);
  // const onclick = (view) => {
  //   console.log('viewotp', view);
  //   // <OtpVerification/>;
  //   changeSubView('approve');
  // };

  const classes = useStyles();

  return (
    <>
      {/* <Grid style={{height:"950px"}} > */}
      <Grid container className={classes.cardDesign}>
        <Grid
          item
          xs={12}
          lg={12}
          md={12}
          lg={12}
          style={{
            backgroundColor: 'white',
            boxShadow: '0px 0px 14px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          }}
        >
          <Grid item xs={12} lg={12} md={12} lg={12}>
            <Typography
              style={{
                paddingLeft: '16px',
                paddingTop: '5%',
                paddingBottom: '2%',
              }}
            >
              Payment Details
            </Typography>
            <Divider variant="fullWidth" />

            <Grid
              item
              xs={12}
              lg={12}
              md={12}
              lg={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <ListItem className={classes.listofitems}>
                <Typography className={classes.List}>Payment Id</Typography>
                <Typography className={classes.List}>Party</Typography>
                <Typography className={classes.List}>
                  {' '}
                  Customer/verndor
                </Typography>
                <Typography className={classes.List}>Bank</Typography>
                <Typography className={classes.List}> Account NO</Typography>
                <Typography className={classes.List}>Invoice Id</Typography>
              </ListItem>
              <ListItem className={classes.listofitems2}>
                <Typography className={classes.List2}>xxxxxxxxxxxxx</Typography>
                <Typography className={classes.List2}>xxxxxxxxxxxxx</Typography>
                <Typography className={classes.List2}>
                  {' '}
                  xxxxxxxxxxxxx
                </Typography>
                <Typography className={classes.List2}>xxxxxxxxxxxxx</Typography>
                <Typography className={classes.List2}>
                  {' '}
                  xxxxxxxxxxxxx
                </Typography>
                <Typography style={{}}>
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'end',
                      color: '#283049',
                      marginRight: '-25px',
                    }}
                  >
                    <Typography
                      style={{
                        fontWeight: '300',
                        fontSize: '13px',
                        lineHeight: '16px',
                      }}
                    >
                      xxxxxxxxxxxxxx
                    </Typography>

                    <ArrowForwardIosIcon
                      style={{
                        height: '14px',
                        color: '#F08B32',
                        marginLeft: '1px',
                      }}
                    />
                  </Box>
                </Typography>
              </ListItem>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={12} md={12} lg={12}>
            <Divider variant="fullWidth" style={{ height: '0.1px' }} />
            <Typography
              style={{
                paddingLeft: '16px',
                paddingTop: '29px',
                paddingBottom: '6px',
              }}
            >
              Amount
            </Typography>
            <Grid
              item
              xs={12}
              lg={12}
              md={12}
              lg={12}
              style={{
                width: ' 96px',
                height: ' 0.1px',
                marginLeft: ' 15px',
                top: ' 627px',

                // border:" 1px solid #EBEBEB",
                boxSizing: ' border-box',
              }}
            >
              <Divider variant="fullWidth" style={{ height: '0.1px' }} />
            </Grid>
            <Grid
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <ListItem className={classes.listofitems}>
                <Typography className={classes.List}>
                  Break-Up Item01
                </Typography>
                <Typography className={classes.List}>
                  Break-Up Item02
                </Typography>
                <Typography className={classes.List}>
                  Break-Up Item03
                </Typography>
              </ListItem>
              <ListItem className={classes.listofitems4}>
                <Typography className={classes.List2}>Rs.xxxxxx</Typography>
                <Typography className={classes.List2}>Rs.xxxxxx</Typography>
                <Typography className={classes.List2}> Rs.xxxxxx</Typography>
              </ListItem>
            </Grid>
            <Grid
              item
              xs={12}
              lg={12}
              md={12}
              lg={12}
              style={{
                width: ' 100%',
                height: ' 1px',
                marginTop: '-19px',
                // border:" 1px solid #CACACA",
                boxSizing: ' border-box',
              }}
            >
              <Divider variant="fullWidth" style={{ height: '0.1px' }} />
            </Grid>{' '}
            <Grid
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: '-3px',
              }}
            >
              <ListItem className={classes.listofitems}>
                <Typography className={classes.List}> GRAND TOTAL</Typography>
              </ListItem>
              <ListItem className={classes.listofitems4}>
                <Typography className={classes.List2}> Rs.xxxxxx</Typography>
              </ListItem>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          lg={12}
          md={12}
          lg={12}
          style={{ marginBottom: '46px', marginTop: '21px' }}
        >
          <Grid
            item
            xs={12}
            lg={12}
            md={12}
            lg={12}
            className={classes.bottomButtons}
          >
            <Button
              className={classes.buttons2}
              variant="outlined"
              onClick={() => {
                changeSubView('comment');
              }}
            >
              comment
            </Button>
            <Button
              className={classes.buttons}
              onClick={() => {
                changeSubView('otpVerify');
              }}
              variant="outlined"
            >
              send it myself
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* </Grid> */}
    </>
  );
};
export default ApprovalProcess2;
