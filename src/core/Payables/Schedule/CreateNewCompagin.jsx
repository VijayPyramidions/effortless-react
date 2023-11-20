import React, { useState } from 'react';

import Input from '@components/Input/Input.jsx';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import AppContext from '@root/AppContext.jsx';
import * as css from './Schedule.scss';
import ReceivablesPopOver from '../Components/ReceivablesPopover';

const CreateNewCompagin = () => {
  const [drawer, setDrawer] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  // const [value, setValue] = React.useState('Payment Link');
  // const [communication, setCommunication] = React.useState('');
  const { changeSubView } = React.useContext(AppContext);

  return (
    <div className={css.bodyContent}>
      <div className={css.valueHeader}>Create New Compagin</div>
      <div className={css.addCustomerContainer}>
        {!nextPage ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Input
                name="compaginName"
                // onBlur={}
                // error={}
                // helperText={}
                label="Compagin Name"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                // onChange={}
                theme="light"
                multiline
                rows={2}
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Input
                name="sendTo"
                // onBlur={}
                // error={}
                // helperText={}
                label="Send to"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                // onChange={}
                theme="light"
                multiline
                rows={2}
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Input
                name="cc"
                // onBlur={}
                // error={}
                // helperText={}
                label="CC"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                // onChange={}
                theme="light"
                multiline
                rows={2}
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Input
                name="bcc"
                // onBlur={}
                // error={}
                // helperText={}
                label="BCC"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                // onChange={}
                theme="light"
                multiline
                rows={2}
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Input
                name="sendCompaginReportTo"
                // onBlur={}
                // error={}
                // helperText={}
                label="Send Compagin Report to"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                // onChange={}
                theme="light"
                multiline
                rows={2}
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <a href className={css.addContact}>
                Add contact
              </a>
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button
                variant="outlined"
                className={css.secondary}
                fullWidth
                onClick={() => changeSubView('receivables')}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className={css.submitButton}
                fullWidth
                onClick={() => setNextPage(true)}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Input
                name="message"
                // onBlur={}
                // error={}
                // helperText={}
                label="Write Your Message"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                // onChange={}
                theme="light"
                multiline
                rows={6}
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Input
                name="Frequency"
                // onBlur={}
                // error={}
                // helperText={}
                label="Frequency"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                // onChange={}
                theme="light"
                multiline
                rows={2}
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                required
              />
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button
                variant="outlined"
                className={css.secondary}
                fullWidth
                onClick={() => changeSubView('receivables')}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className={css.submitButton}
                fullWidth
                disableTouchRipple
              >
                Create Follow-up
              </Button>
            </Grid>
          </Grid>
        )}
      </div>
      <ReceivablesPopOver open={drawer} handleClose={() => setDrawer(false)}>
        <div className={css.effortlessOptions}>
          <span className={css.title}>Link</span>
          <ul className={css.optionsWrapper} />
        </div>
      </ReceivablesPopOver>
    </div>
  );
};

export default CreateNewCompagin;
