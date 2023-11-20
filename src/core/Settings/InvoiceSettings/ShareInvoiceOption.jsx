import { Divider } from '@material-ui/core';
import React from 'react';
import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';
import { shareInvoiceOptionsCard } from '../SettingsImages';
import * as css from './InvoiceSettings.scss';

const card1 = [
  {
    id: 1,
    lable: 'Email',
    icon: shareInvoiceOptionsCard.Email,
    isActive: true,
  },
  {
    id: 2,
    lable: 'WhatsApp',
    icon: shareInvoiceOptionsCard.WhatsApp,
    isActive: true,
  },
  {
    id: 3,
    lable: 'SMS',
    icon: shareInvoiceOptionsCard.sms,
    isActive: true,
  },
];
const device = localStorage.getItem('device_detect');

function ShareInvoiceOption() {
  const toggleSwitch = () => {};

  const ToggleCard = ({ item, length }) => {
    return (
      <>
        <div className={css.ToggleCardContainer}>
          <div
            className={
              device === 'desktop' ? css.iconWrapperDesktop : css.iconWrapper
            }
          >
            <img className={css.icon} src={item.icon} alt={item.lable} />
          </div>
          <div className={css.lable}>{item.lable}</div>
          <ToggleSwitch
            onChange={(e, c) => {
              toggleSwitch(item.id, c);
            }}
            defaultChecked={item.isActive}
          />
        </div>
        {length !== item.id && (
          <div className={css.divider}>
            <Divider />
          </div>
        )}
      </>
    );
  };
  return (
    <div
      className={
        device === 'desktop'
          ? css.contactDetailsOnInvoiceContainerDesktop
          : css.contactDetailsOnInvoiceContainer
      }
    >
      <div className={device === 'desktop' ? css.cardDesktop : css.card}>
        {card1.map((item) => {
          return (
            <div key={item.id}>
              <ToggleCard item={item} length={card1.length} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShareInvoiceOption;
