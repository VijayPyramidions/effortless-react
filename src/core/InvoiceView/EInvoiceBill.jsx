import React, { memo, useState } from 'react';
import { Stack, FormGroup, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';
import * as css from './PaymentTermCss.scss';

const EInvoiceBill = ({ data, OnChange, disabled }) => {
  const [drawer, setDrawer] = useState({
    exapndEInvoiceBill: false,
  });

  const onTriggerDrawer = (name, state) => {
    setDrawer((d) => ({ ...d, [name]: state }));
  };

  return (
    <>
      <div
        className={css.maindiveinvoicebill}
        onClick={() =>
          onTriggerDrawer('exapndEInvoiceBill', !drawer?.exapndEInvoiceBill)
        }
      >
        <p className={css.einvoicebill}>Generate E-Invoice</p>
        <ExpandMoreIcon
          sx={{
            transition: '.5s',
            transform: drawer.exapndEInvoiceBill
              ? 'rotate(180deg)'
              : 'rotate(360deg)',
          }}
        />
      </div>
      {drawer.exapndEInvoiceBill && (
        <div className={css.expandeinvoicebill}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <p className={css.emaintext}>Generate IRN</p>
            <FormGroup style={{ alignItems: 'center', width: '15%' }}>
              <FormControlLabel
                control={
                  <ToggleSwitch
                    checked={data?.generate_e_invoice}
                    name="generate_e_invoice"
                    onChange={OnChange}
                    disabled={disabled}
                  />
                }
                sx={{ margin: 0 }}
              />
            </FormGroup>
          </Stack>
          {/* <Divider sx={{ margin: '16px 0' }} />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <p className={css.emaintext}>E-Way Bill</p>
            <FormGroup style={{ alignItems: 'center', width: '15%' }}>
              <FormControlLabel
                control={
                  <ToggleSwitch
                    checked={data?.generate_e_way_bill}
                    name="generate_e_way_bill"
                    onChange={OnChange}
                  />
                }
                sx={{ margin: 0 }}
              />
            </FormGroup>
          </Stack> */}
        </div>
      )}
    </>
  );
};

export default memo(EInvoiceBill);
