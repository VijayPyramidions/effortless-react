import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Stack, Typography, IconButton, Button } from '@mui/material';

import AppContext from '@root/AppContext';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';
import {
  addBankAccounts,
  addOtherBank,
} from '@action/Store/Reducers/Banking/BankingState';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import * as css from '../bankingmobile.scss';

const BusinessAccountConnect = ({ onClose, connectType }) => {
  const dispatch = useDispatch();

  const [havePermission, setHavePermission] = useState({ open: false });
  const { userPermissions } = useContext(AppContext);

  const AddBankAccounts = (row) => () => {
    let data;
    if (row === 'Add ICICI Bank Account') {
      if (
        !userPermissions?.Banking?.['ICICI Connected Banking']
          ?.create_icici_account
      ) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
            onClose();
          },
        });

        return;
      }

      data = { type: 'Add ICICI Bank Account' };
    } else if (row === 'Other Bank Account') {
      if (
        !userPermissions?.Banking?.['Connecting a Bank']?.create_yodlee_account
      ) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
            onClose();
          },
        });
        return;
      }

      data = {
        type: connectType === 'Business' ? 'Other Bank' : 'Add Others',
        fastConfig: 'add_bank',
        fastConfigLocal: 'add_bank',
        accountType: connectType === 'Business' ? 'company' : 'founder',
      };
    } else {
      dispatch(addOtherBank(true));
      onClose();
      return;
    }

    dispatch(addBankAccounts(data));
    onClose();
  };

  return (
    <>
      <Stack className={css.bottommodalcontainer}>
        <Stack className={css.emptyBar} />
        <Stack className={css.headerWrp}>
          <Typography variant="h4" className={css.accpreftitle}>
            Business Account
          </Typography>
          <IconButton onClick={onClose}>
            <CloseRoundedIcon sx={{ width: '16px', height: '16px' }} />
          </IconButton>
        </Stack>
        <Stack>
          {connectType === 'Business' && (
            <Button
              className={css.conectaccbtns}
              onClick={AddBankAccounts('Add ICICI Bank Account')}
            >
              Add ICICI Bank Account
            </Button>
          )}
          <Button
            className={css.conectaccbtns}
            onClick={AddBankAccounts('Other Bank Account')}
          >
            Add Other Bank Account
          </Button>
          <Button
            className={css.conectaccbtns}
            onClick={AddBankAccounts('Add Bank Manually')}
          >
            Add Bank Account Manually
          </Button>
        </Stack>
      </Stack>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default BusinessAccountConnect;
