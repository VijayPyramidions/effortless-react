import React from 'react';
import * as css from '@core/InvoiceView/CreateInvoiceContainer.scss';
import * as Mui from '@mui/material';
import * as MuiIcon from '@mui/icons-material';
// import * as css from './CreateInvoiceContainerNew.scss';
// import FormControlLabel from '@material-ui/core/FormControlLabel';

const RecurringDateDialog = ({
  openPop,
  HandlePop,
  valueRadio,
  setValueRadio,
  drawer,
  setPopValue,
  setSendDate,
  setDrawer,
}) => {
  const recurringDate = [
    { id: new Date().getDate(), val: 'Same Date of Next Month' },
    { id: 1, val: '1st of Next Month' },
    { id: 30, val: 'Last of The Month' },
    { id: 'custom', val: 'Custom' },
  ];

  const Number = Array.from(Array(31).keys());

  React.useEffect(() => {
    if (valueRadio === 'Custom') {
      setDrawer((prev) => ({ ...prev, datePopup: true }));
    } else if (valueRadio) {
      const temp = recurringDate.filter((value) => value.val === valueRadio);
      if (setSendDate) {
        setPopValue(temp[0]?.id);
        setSendDate(temp[0]?.id);
        setDrawer((prev) => ({ ...prev, datePopup: false }));
        HandlePop();
      } else {
        setPopValue(temp[0]?.id);
        // setSendDate(temp[0]?.id);
        setDrawer((prev) => ({ ...prev, datePopup: false }));
        HandlePop();
      }
    }
  }, [valueRadio]);

  const device = localStorage.getItem('device_detect');

  return (
    <Mui.Dialog
      open={openPop}
      // anchorEl={HandlePop}
      onClose={() => HandlePop()}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <Mui.Stack
        style={{
          width: 'auto',
          height: device === 'desktop' ? '20rem' : 'auto',
          padding: device === 'desktop' ? '20px' : '20px 20px',
        }}
      >
        <Mui.Grid container>
          <Mui.Grid item xs={12}>
            <Mui.Stack direction="row" justifyContent="space-between">
              <div>
                <Mui.Typography className={css.scheduleHead} noWrap>
                  Set Invoice Delivery Schedule
                </Mui.Typography>
                <hr className={css.forline} />
              </div>
              {device === 'desktop' && (
                <Mui.IconButton onClick={() => HandlePop()}>
                  <MuiIcon.Close />
                </Mui.IconButton>
              )}
            </Mui.Stack>
            <Mui.Typography className={css.scheduleHead} noWrap>
              Deliver Invoices to your Customer on:
            </Mui.Typography>
          </Mui.Grid>
          <Mui.Grid item xs={12} sm={6}>
            <div>
              {recurringDate?.map((ele) => (
                <div
                  style={{ display: 'flex', gap: '5px', alignItems: 'center' }}
                >
                  <Mui.Radio
                    style={{
                      color: '#F08B32',
                    }}
                    checked={ele?.val === valueRadio}
                    onChange={(e) => setValueRadio(e?.target?.value)}
                    value={ele?.val}
                  />
                  <div onClick={() => setValueRadio(ele?.val)}>
                    <p
                      style={{
                        margin: '10px 0',
                        cursor: 'pointer',
                      }}
                    >
                      {ele?.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Mui.Grid>
          {drawer && (
            <Mui.Grid item xs={11} sm={5} className={css.gridStack}>
              {Number.slice(1, 31).map((c) => (
                // <Mui.Grid xs={2}>
                <Mui.Stack
                  className={css.numberStackNew}
                  onClick={() => {
                    if (setSendDate) {
                      setPopValue(c);
                      setSendDate(c);
                      HandlePop();
                    } else {
                      setPopValue(c);
                      HandlePop();
                    }
                  }}
                >
                  <Mui.Typography>{c}</Mui.Typography>
                </Mui.Stack>
                // </Mui.Grid>
              ))}
            </Mui.Grid>
          )}
        </Mui.Grid>
      </Mui.Stack>
    </Mui.Dialog>
  );
};

export default RecurringDateDialog;
