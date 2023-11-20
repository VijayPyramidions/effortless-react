/* eslint-disable no-useless-return */
/* eslint-disable no-else-return */

import * as React from 'react';
import * as Mui from '@mui/material';
import * as css from './LoadAndWithDraw.scss';

const LoadWithDraw = ({ type, accounts, handleBottomSheet }) => {
  const [valueRadio, setValueRadio] = React.useState('');

  React.useState(() => {
    const serviceProviderAvailable = accounts?.filter(
      (e) => e.service_provider,
    );
    if (serviceProviderAvailable?.length > 0) {
      setValueRadio(
        accounts?.find((e) => e.service_provider !== 'fidypay')?.id,
      );
    } else {
      setValueRadio(
        accounts?.find((e) => e.account_type !== 'FD')?.bank_account_id,
      );
    }
  }, [accounts]);
  return (
    <div className={css.mainCss}>
      <div
        style={{ padding: '5px 0', margin: '1rem 0' }}
        className={css.headerContainer}
      >
        <p className={css.headerLabel}>{type} Money - Select an Account</p>
        <span className={css.headerUnderline} />
      </div>
      <div>
        <ul className={css.optionsWrapper}>
          <Mui.FormControl style={{ width: '100%' }}>
            <li className={css.items} aria-hidden="true">
              <Mui.RadioGroup
                name="controlled-radio-buttons-group"
                value={valueRadio}
                onChange={(event) => {
                  event.persist();
                  setValueRadio(event.target.value);
                }}
                style={{ gap: '10px' }}
              >
                {accounts?.map((e) => (
                  <>
                    {e.service_provider
                      ? e.service_provider !== 'fidypay' && (
                          <Mui.FormControlLabel
                            sx={{
                              width: '100%',
                              marginLeft: '0px !important',
                              marginRight: '0px !important',
                              '& .MuiFormControlLabel-label': {
                                width: '100%',
                              },
                            }}
                            value={e.id}
                            control={<Mui.Radio style={{ color: '#F08B32' }} />}
                            label={
                              <div className={css.bankDetails}>
                                <p style={{ margin: 0 }}>{e?.account_name}</p>
                                <p
                                  className={
                                    e?.account_type === 'company'
                                      ? css.buisnessCss
                                      : css.personalCss
                                  }
                                >
                                  {e?.account_type === 'company'
                                    ? 'Business'
                                    : 'Personal'}
                                </p>
                              </div>
                            }
                          />
                        )
                      : e.account_type !== 'FD' && (
                          <Mui.FormControlLabel
                            sx={{
                              width: '100%',
                              marginLeft: '0px !important',
                              marginRight: '0px !important',
                              '& .MuiFormControlLabel-label': {
                                width: '100%',
                              },
                            }}
                            value={e.bank_account_id}
                            control={<Mui.Radio style={{ color: '#F08B32' }} />}
                            label={
                              <div className={css.bankDetails}>
                                <p style={{ margin: 0 }}>
                                  {e?.account_name} - {e?.bank_name}
                                </p>
                                <p
                                  className={
                                    e?.bank_account_type === 'company'
                                      ? css.buisnessCss
                                      : css.personalCss
                                  }
                                >
                                  {e?.bank_account_type === 'company'
                                    ? 'Business'
                                    : 'Personal'}
                                </p>
                              </div>
                            }
                          />
                        )}
                  </>
                ))}
              </Mui.RadioGroup>
            </li>
          </Mui.FormControl>
        </ul>
      </div>
      <div className={css.btnField}>
        <Mui.Button
          variant="outlined"
          className={css.proceedBtn}
          onClick={() => handleBottomSheet(valueRadio)}
        >
          <Mui.Typography className={css.proceedBtnText}>Done</Mui.Typography>
        </Mui.Button>

        {type === 'withdraw' && (
          <Mui.Button
            variant="contained"
            className={css.addAccBtn}
            // onClick={() => handleBottomSheet(valueRadio)}
          >
            <Mui.Typography className={css.addAccText}>
              Add Another Account
            </Mui.Typography>
          </Mui.Button>
        )}
      </div>
    </div>
  );
};

export default LoadWithDraw;
