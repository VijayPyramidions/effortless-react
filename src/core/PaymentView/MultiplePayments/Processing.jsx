import React from 'react';
import { Grid } from '@material-ui/core';

import processlogo from '@assets/processing.svg';
// import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  cardDesign: {
    textAlignLast: 'center',
  },
}));

const Processing = () => {
  const classes = useStyles();

  return (
    <>
      <Grid
        container
        spacing={{ xs: 5, md: 3 }}
        columns={{ xs: 1, sm: 1, md: 1 }}
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          height: 'calc(100% - 180px)',
          width: '100%',
          borderRadius: '25px 25px 0px 0px',
          overflow: 'auto',
        }}
      >
        <Grid item xs={12} style={{ paddingBlock: '14%' }}>
          <Grid>
            <Grid item xs={12} className={classes.cardDesign}>
              <img src={processlogo} style={{}} alt="Well Done" />
            </Grid>
            <Grid
              item
              xs={12}
              style={{ paddingTop: '10%', fontSize: '26px' }}
              className={classes.cardDesign}
            >
              Please Wait...
            </Grid>
            <Grid
              item
              xs={12}
              style={{ paddingTop: '4%', fontSize: '26px' }}
              className={classes.cardDesign}
            >
              Your Payment is being <br />
              processed
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default Processing;
