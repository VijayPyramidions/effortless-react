import React from 'react';
import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';
import * as Mui from '@mui/material';
import eclipse from '../../../assets/Ellipse 726.svg';
import exclamation from '../../../assets/exclamation.png';
import image1 from '../../../assets/message-add.png';
import rectangle from '../../../assets/rec.svg';
import watsapp from '../../../assets/akar-icons_whatsapp-fill.svg';
import payments from '../../../assets/payments.svg';

import * as css from './ReminderSettings.scss';

const ReminderSettings = () => {
  const Party = [
    {
      name: '  Send SMS to Party on Creating Transactions',
      icon: image1,
      width: '20px',
      isActive: true,
    },
    {
      name: 'Payment Reminder on Due Date',
      icon: exclamation,
      width: '4px',
      isActive: true,
    },
  ];

  const YourReminder = [
    {
      name: 'Payment Reminder on Due Date',
      icon: exclamation,
      isActive: true,
      width: '4px',
    },
    {
      name: 'Daily Outstanding Payments',
      icon: payments,
      isActive: true,
      width: '13px',
      color: 'grey',
    },
    {
      name: 'Daily Sales Summary',
      icon: rectangle,
      width: '20px',
      isActive: true,
    },
    {
      name: 'WhatsApp Alert',
      icon: watsapp,
      width: '16px',
      isActive: true,
    },
  ];
  const device = localStorage.getItem('device_detect');

  return (
    <Mui.Stack
      className={device === 'desktop' ? css.TermsHeadDesktop : css.TermsHead}
      spacing={2}
    >
      <Mui.Stack
        className={
          device === 'desktop' ? css.TermsHead3Desktop : css.TermsHead3
        }
      >
        <Mui.Typography className={css.heading}>PARTY REMINDERS</Mui.Typography>
        <Mui.Stack mt={2} spacing={2}>
          {Party.map((c) => {
            return (
              <Mui.Stack className={css.contentStack} direction="row">
                <Mui.Stack direction="row" alignItems="center" spacing={2}>
                  <Mui.Avatar sx={{ bgcolor: '#F2F2F0' }}>
                    <img
                      src={c.icon}
                      alt={eclipse}
                      width={c.width}
                      style={{ color: 'black' }}
                    />
                  </Mui.Avatar>
                </Mui.Stack>
                <Mui.FormGroup style={{ width: '100%' }}>
                  <Mui.FormControlLabel
                    style={{
                      justifyContent: 'space-between',
                    }}
                    // label={c.name}
                    label={
                      <Mui.Typography
                        variant="body2"
                        style={{
                          color: 'black !important',
                          fontSize: '14px',
                          textColor: 'black !important',
                        }}
                      >
                        {c.name}
                      </Mui.Typography>
                    }
                    labelPlacement="start"
                    control={
                      <ToggleSwitch
                        defaultChecked={c.isActive}
                        style={{
                          '&. Component-root-59 .MuiSwitch-track': {
                            backgroundColor: 'red',
                          },
                        }}
                      />
                    }
                  />
                </Mui.FormGroup>
              </Mui.Stack>
            );
          })}
        </Mui.Stack>
      </Mui.Stack>

      <Mui.Stack
        className={
          device === 'desktop' ? css.TermsHead1Desktop : css.TermsHead1
        }
      >
        <Mui.Typography className={css.heading}>YOUR REMINDERS</Mui.Typography>
        <Mui.Stack mt={2} spacing={2}>
          {YourReminder.map((c) => {
            return (
              <Mui.Stack className={css.contentStack} direction="row">
                <Mui.Stack direction="row" alignItems="center" spacing={2}>
                  <Mui.Avatar sx={{ bgcolor: '#F2F2F0' }}>
                    <img
                      src={c.icon}
                      alt={eclipse}
                      width={c.width}
                      style={{ color: 'black' }}
                    />
                  </Mui.Avatar>
                  {/* <Mui.Typography className={css.text}>{c.name}</Mui.Typography> */}
                </Mui.Stack>
                <Mui.FormGroup style={{ width: '100%' }}>
                  <Mui.FormControlLabel
                    style={{ justifyContent: 'space-between' }}
                    label={
                      <Mui.Typography
                        variant="body2"
                        style={{
                          color: 'black !important',
                          fontSize: '14px',
                          textColor: 'black !important',
                        }}
                      >
                        {c.name}
                      </Mui.Typography>
                    }
                    labelPlacement="start"
                    control={
                      <ToggleSwitch
                        defaultChecked={c.isActive}
                        style={{
                          '&. Component-root-59 .MuiSwitch-track': {
                            backgroundColor: 'red',
                          },
                        }}
                      />
                    }
                  />
                </Mui.FormGroup>
              </Mui.Stack>
            );
          })}
        </Mui.Stack>
      </Mui.Stack>
    </Mui.Stack>
  );
};

export default ReminderSettings;
