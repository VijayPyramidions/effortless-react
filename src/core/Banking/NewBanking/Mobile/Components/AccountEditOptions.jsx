import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { txnsRefresh } from '@action/Store/Reducers/Banking/StatementState';
import {
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { iciciAccountSync } from '@action/Store/Reducers/Banking/BankingState';
import { enableLoading } from '@action/Store/Reducers/Errors/Errors';

import * as css from '../bankingmobile.scss';

const AccountEditOptions = ({
  onClose,
  HandleOption,
  Sync,
  Status,
  oneBank,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const IciciSync = (e) => {
    e.stopPropagation();
    dispatch(iciciAccountSync(oneBank.bank_account_id));
  };

  const uploadTaransaction = () => {
    navigate(`/invoice-upload`, {
      state: {
        from: 'banking',
        bank_account_id: oneBank?.bank_account_id,
        thisFor: 'transactions'
      },
    });
  };

  const TnxsRefresh = () => {
    onClose();
    dispatch(enableLoading(true));
    dispatch(txnsRefresh(oneBank));
  };

  return (
    <Stack className={css.bottommodalcontainer}>
      <Stack className={css.emptyBar} />

      <List sx={{ paddingTop: '0px', margin: '15px -20px 0 -20px' }}>
        {oneBank.sub_account_group === 'Cash Accounts' ? (
          <>
            <ListItem className={css.listitem} onClick={HandleOption('ECAN')}>
              <ListItemButton className={css.ListButtons}>
                <ListItemText
                  primary="Edit Cash Account Name"
                  className={css.listtext}
                />
              </ListItemButton>
            </ListItem>
            <ListItem className={css.listitem} onClick={HandleOption('DCA')}>
              <ListItemButton className={css.ListButtons}>
                <ListItemText
                  primary="Delete Cash Account"
                  className={css.listtext}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: '#FF0000 !important',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            {oneBank.service_provider === 'icici' &&
              !oneBank.registration_status && (
                <ListItem className={css.listitem} onClick={IciciSync}>
                  <ListItemButton className={css.ListButtons}>
                    <ListItemText
                      primary="Sync Now"
                      className={css.listtext}
                      sx={{
                        '& span': {
                          color: ' #f08b32 !important',
                          fontWeight: '400 !important',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            <ListItem className={css.listitem} onClick={HandleOption('EAD')}>
              <ListItemButton className={css.ListButtons}>
                <ListItemText
                  primary="Edit Account Details"
                  className={css.listtext}
                />
              </ListItemButton>
            </ListItem>

            {oneBank.sub_account_group === 'Connected Banking' ? (
              <>
                {oneBank.registration_status && (
                  <ListItem
                    className={css.listitem}
                    onClick={uploadTaransaction}
                  >
                    <ListItemButton className={css.ListButtons}>
                      <ListItemText
                        primary=" Upload Transactions"
                        className={css.listtext}
                      />
                    </ListItemButton>
                  </ListItem>
                )}
              </>
            ) : (
              <ListItem className={css.listitem} onClick={uploadTaransaction}>
                <ListItemButton className={css.ListButtons}>
                  <ListItemText
                    primary=" Upload Transactions"
                    className={css.listtext}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {oneBank.service_provider !== 'yodlee' &&
              oneBank.registration_status && (
                <ListItem className={css.listitem} onClick={TnxsRefresh}>
                  <ListItemButton className={css.ListButtons}>
                    <ListItemText
                      primary="Refresh Bank Feed"
                      className={css.listtext}
                    />
                  </ListItemButton>
                </ListItem>
              )}

            {oneBank.service_provider === 'yodlee' && (
              <ListItem className={css.listitem} onClick={HandleOption('UBC')}>
                <ListItemButton className={css.ListButtons}>
                  <ListItemText
                    primary="Update Bank Credentials"
                    className={css.listtext}
                  />
                </ListItemButton>
              </ListItem>
            )}
            {oneBank.sub_account_group === 'Connected Banking' ? (
              <>
                {oneBank.registration_status && (
                  <>
                    <ListItem
                      className={css.listitem}
                      onClick={HandleOption('DEBS')}
                    >
                      <ListItemButton className={css.ListButtons}>
                        <ListItemText
                          primary={`${Sync} Bank Sync`}
                          className={css.listtext}
                        />
                      </ListItemButton>
                    </ListItem>

                    <ListItem
                      className={css.listitem}
                      onClick={HandleOption('DEA')}
                    >
                      <ListItemButton className={css.ListButtons}>
                        <ListItemText
                          primary={`${Status} Account`}
                          className={css.listtext}
                        />
                      </ListItemButton>
                    </ListItem>
                  </>
                )}
              </>
            ) : (
              <>
                <ListItem
                  className={css.listitem}
                  onClick={HandleOption('DEBS')}
                >
                  <ListItemButton className={css.ListButtons}>
                    <ListItemText
                      primary={`${Sync} Bank Sync`}
                      className={css.listtext}
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  className={css.listitem}
                  onClick={HandleOption('DEA')}
                >
                  <ListItemButton className={css.ListButtons}>
                    <ListItemText
                      primary={`${Status} Account`}
                      className={css.listtext}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            {(oneBank.service_provider === 'eff_books' ||
              oneBank.service_provider === 'zoho_books' ||
              oneBank.service_provider === 'tally_books') && (
              <ListItem className={css.listitem} onClick={HandleOption('MBA')}>
                <ListItemButton className={css.ListButtons}>
                  <ListItemText
                    primary="Merge Bank Account"
                    className={css.listtext}
                  />
                </ListItemButton>
              </ListItem>
            )}

            <ListItem className={css.listitem} onClick={HandleOption('DBA')}>
              <ListItemButton className={css.ListButtons}>
                <ListItemText
                  primary="Delete Bank Account"
                  className={css.listtext}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: '#FF0000 !important',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Stack>
  );
};

export default memo(AccountEditOptions);
