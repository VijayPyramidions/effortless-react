import React, { useContext } from 'react';

import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from '@root/AppContext.jsx';
import Stack from '@mui/material/Stack';
import Input from '@components/Input/Input.jsx';

const useStyles = makeStyles(() => ({
  text: {
    // height: 60,
    color: 'red',
    '& .MuiInputBase-root': {
      backgroundColor: 'rgba(237, 237, 237, 0.15)',
      border: '0.7px solid rgba(153, 158, 165, 0.39)',
      color: 'red',
      //   height: 60,
      '& input': {
        textAlign: 'left',
        color: '#6E6E6E',
      },
      '&. .MuiInputLabel-filled': {
        color: 'red',
      },
    },
  },

  textField: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 500,
  },
  input: {
    color: 'white',
  },
  buttons: {
    backgroundColor: '#F08B32',
    color: 'white',
    fontFamily: 'Arial',
    borderRadius: '25px',
    opacity: '1',
    fontSize: '10px',
    paddingLeft: '10%',
    paddingRight: '10%',
  },
}));
const DeliverComments = () => {
  const { changeSubView } = useContext(AppContext);

  const classes = useStyles();

  return (
    <>
      <Grid
        container
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '-webkit-fill-available',
          textAlignLast: 'center',
        }}
      >
        <Grid
          item
          // xs={12} lg={12} md={12} lg={12} lg={12} md={12} lg={12}
          style={{
            backgroundColor: 'white',
            height: 'calc(100% - 197px)',
            borderRadius: '25px 25px 0px 0px',
            overflow: 'scroll',
            padding: '10%',
          }}
        >
          <Stack direction="column" spacing={2}>
            {/* <Grid item xs={12} lg={12} md={12} lg={12} style={{ textAlign: 'center',overheight:"442px",paddingBottom:"34px", marginTop: '5%' }}> */}
            {/* <TextField
                style={{ width: '86%',alignSelf:"center" }}
                id="outlined-multiline-static"
                label="send a comment"
                multiline
                rows={17}
                variant="outlined"
              /> */}

            <Input
              multiline
              rows={23}
              label="Enter Number"
              variant="standard"
              // value={templateName}
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

            <Grid
              item
              xs={12}
              lg={12}
              md={12}
              lg={12}
              style={{ paddingTop: '5%' }}
            >
              <Button
                className={classes.buttons}
                variant="outlined"
                onClick={() => {
                  changeSubView('approvalProcess4');
                }}
              >
                Deliver Comment
              </Button>
              {/* </Grid> */}
              {/* </Stack> */}
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};
export default DeliverComments;
