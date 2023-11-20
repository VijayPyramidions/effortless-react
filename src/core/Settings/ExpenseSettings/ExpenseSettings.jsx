import React, { useContext, useState, useEffect } from 'react';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { FormGroup, FormControlLabel } from '@mui/material';
import AppContext from '@root/AppContext.jsx';
import * as css from './ExpenseSettings.scss';

function ExpenseSettings() {
  const { organization, user, openSnackBar, enableLoading } =
    useContext(AppContext);

  const device = localStorage.getItem('device_detect');

  const [data, setData] = useState();

  const FetchData = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/settings`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        setData(res);
        if (res.error) {
          openSnackBar({
            message: res.errors?.base || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((err) => {
        enableLoading(false);
        openSnackBar({
          message: err?.message || 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const update = (editedColumn) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/settings/`, {
      method: METHOD.PATCH,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        [editedColumn]: !data[editedColumn],
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          openSnackBar({
            message: `Edited Successfully`,
            type: MESSAGE_TYPE.INFO,
          });
          FetchData();
        }
        if (res?.error) {
          openSnackBar({
            message:
              Object.values(res.errors).join() ||
              res?.message ||
              'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message:
            Object.values(res.errors).join() ||
            res?.message ||
            `Unknown Error Occured`,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div
      className={
        device === 'desktop' ? css.expSettingsDesktop : css.expSettingMobile
      }
    >
      <div className={css.card}>
        <FormGroup style={{ width: '100%' }}>
          <FormControlLabel
            style={{ justifyContent: 'space-between', margin: '0px' }}
            label={
              <div>
                <div>
                  Enable Effortless and SuperAccountant to Deduct TDS on Bills
                </div>
                <div className={css.descriptiontext}>
                  (Enabling this will make the TDS non-editable)
                </div>
              </div>
            }
            labelPlacement="start"
            control={
              <ToggleSwitch
                checked={data?.can_deduct_tds || false}
                onChange={() => update('can_deduct_tds')}
              />
            }
          />
        </FormGroup>
      </div>
    </div>
  );
}

export default ExpenseSettings;
