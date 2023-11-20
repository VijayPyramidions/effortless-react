/* eslint-disable no-nested-ternary */

import { Button, Drawer, FormHelperText, styled } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import * as themes from '@root/theme.scss';
import * as css from './SelectBottomSheet.scss';

const StyledDrawer = styled(Drawer)((props) => {
  return {
    '& .MuiPaper-root': {
      minHeight: props.minHeight,
      maxHeight: props.maxHeight,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      borderRadius: props.borderRadius,
      background: props.background,
      overflow: props.overflow,
      height: props.height,
      transition: 'all 0.2s ease-in',
    },
  };
});

const errorStyle = {
  position: 'absolute',
  bottom: '-20px',
  left: '8px',
  fontSize: '10px',
  color: themes.colorError,
};

const SelectBottomSheet = (props) => {
  const deviceDetect = localStorage.getItem('device_detect');
  const {
    id,
    triggerComponent,
    onClose,
    value,
    label,
    children,
    open,
    onTrigger,
    name,
    error,
    helperText,
    multiple,
    required,
    styleDrawerMinHeight = '25vh',
    styleDrawerMaxHeight = deviceDetect === 'desktop' ? '100vh' : '80vh',
    // heightDrawer = deviceDetect === 'desktop' ? '100%' : '83vh',
    background = '#FFFFFF',
    toShow,
    dateChange,
    hideClose,
    bankBorder,
    selectedDate,
    max,
    min,
    // addNewSheet,
    showAddText,
    Vendor_id,
    classNames,
    disabled,
    fixedWidthSheet,
    fromEmailProvider,
  } = props;

  const [showDrawer, setShowDrawer] = useState(false);

  const onCloseDrawer = () => {
    onClose(name);
  };

  useEffect(() => {
    setShowDrawer(open);
  }, [open]);

  const val = multiple ? value?.join?.(', ') : value;
  return (
    <>
      {triggerComponent || (
        <>
          <div
            className={`${css.trigger} ${multiple ? css.multiple : ''} ${
              bankBorder ? css.bankBorder : ''
            } ${classNames} ${fromEmailProvider ? css.addnewprovider : ''}`}
            role="menuitem"
            onClick={() => {
              if (id === 'recordBillVendor') {
                onTrigger('list');
              } else if (!disabled) {
                onTrigger(name);
              }
            }}
            id={id}
          >
            <div className={css.label}>
              {label}
              {required ? <span style={{ color: 'red' }}> *</span> : ''}
            </div>

            {id === 'recordBillVendor' && toShow === false ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  className={css.value}
                  style={{ width: '100%', padding: '0 5px', height: '20px' }}
                  onClick={() => !disabled && onTrigger('list')}
                >
                  {val}
                </div>

                <Button
                  style={{
                    width: '50%',
                    fontSize: 10,
                    background: '#F08B32',
                    color: '#FFF',
                    whiteSpace: 'nowrap',
                    borderRadius: 15,
                    padding: '5px 15px',
                    textTransform: 'capitalize',
                    marginRight: deviceDetect === 'mobile' ? '5px' : '20px',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) onTrigger('addManually');
                  }}
                >
                  {showAddText}
                </Button>

                {Vendor_id === false && val === '' ? (
                  <Button
                    style={{
                      fontSize: 10,
                      background: '#00A676',
                      color: '#FFFFFF',
                      whiteSpace: 'nowrap',
                      borderRadius: 15,
                      padding: '2px 35px',
                      textTransform: 'capitalize',

                      marginRight: deviceDetect === 'mobile' ? '5px' : '20px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTrigger('reload');
                    }}
                  >
                    <CachedIcon
                      style={{ marginRight: 5, transform: 'rotate(45deg)' }}
                    />
                    Reload
                  </Button>
                ) : (
                  ''
                )}
              </div>
            ) : (
              (!disabled &&
                (id === 'dateForDesktop' ||
                  id === 'dueDateForDesktop' ||
                  id === 'accountedDateForDesktop') && (
                  <div style={{ display: 'flex', padding: '0 10px 0 0' }}>
                    <div
                      className={css.value}
                      style={{ padding: '5px 10px 5px 10px' }}
                    >
                      {val}
                    </div>
                    <OnlyDatePicker
                      onChange={(e) =>
                        dateChange(
                          id === 'dueDateForDesktop'
                            ? 'dueDate'
                            : id === 'accountedDateForDesktop'
                            ? 'accountedOn'
                            : 'date',
                          e,
                        )
                      }
                      maxDate={max ? false : undefined}
                      minDate={min || undefined}
                      selectedDate={selectedDate || new Date()}
                    />
                  </div>
                )) || (
                <div>
                  <div className={css.value}>{val}</div>
                  <ExpandMoreOutlinedIcon className={css.icon} />{' '}
                </div>
              )
            )}
            {error && (
              <FormHelperText style={errorStyle}>{helperText}</FormHelperText>
            )}
          </div>
        </>
      )}

      <StyledDrawer
        anchor={deviceDetect === 'desktop' ? 'right' : 'bottom'}
        variant="temporary"
        open={showDrawer}
        onClose={onCloseDrawer}
        minHeight={styleDrawerMinHeight || '25vh'}
        maxHeight={styleDrawerMaxHeight || '80vh'}
        minWidth={
          deviceDetect === 'desktop' ? fixedWidthSheet || '30vw' : '100%'
        }
        maxWidth={
          deviceDetect === 'desktop' ? fixedWidthSheet || '30vw' : '100%'
        }
        borderRadius={deviceDetect === 'desktop' ? '0px' : '20px 20px 0 0'}
        background={background || '#FFFFFF'}
        overflow={deviceDetect === 'desktop' && 'visible !important'}
        // height={
        //   deviceDetect === 'desktop'
        //     ? '100%'
        //     : (addNewSheet && '75vh') || '80vh'
        // }
      >
        <div>
          {deviceDetect === 'desktop' && !hideClose && (
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => {
                  onCloseDrawer();
                }}
                style={{
                  background: '#36E3C0',
                  width: 20,
                  height: 20,
                  position: 'absolute',
                  top: 10,
                  left: -15,
                  display: 'flex',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                X
              </div>
            </div>
          )}
          <span
            className={deviceDetect === 'desktop' ? css.desktop : css.handle}
          />
          <div
            className={
              deviceDetect === 'desktop'
                ? css.childContainer2
                : css.childContainer
            }
            style={{ overflow: id === 'overFlowHidden' ? 'hidden' : 'auto' }}
          >
            {children}
          </div>
        </div>
      </StyledDrawer>
    </>
  );
};

export default SelectBottomSheet;
