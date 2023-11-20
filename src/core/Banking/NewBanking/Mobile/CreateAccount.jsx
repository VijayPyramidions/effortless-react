import React from 'react';
import { Stack, Typography, Button } from '@mui/material';

import VirtualAccount from '../../../../assets/virtualaccountnotconnect.svg';
// import bankicon from '../../../../assets/bankicon.svg';

const CreateAccount = () => {
  return (
    <Stack>
      <img src={VirtualAccount} alt="logo" />
      <Typography variant="h4">Choose Effortless banking</Typography>
      <Typography>
        Effortless Banking is the Fastest Way to run your business transactions.
        It is powered by your Effortless Virtual Account.
      </Typography>
      <Typography>
        Registration and Setup are <span>FREE.</span>
      </Typography>
      <Button>Create Free Account</Button>
    </Stack>
  );
};

export default CreateAccount;
