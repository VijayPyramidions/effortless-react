import { Button, Drawer, FormHelperText, styled } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import * as themes from '@root/theme.scss';
import * as css from './SelectBottomSheet.scss';

const StyledDrawer = styled(Drawer)((props) => {
  return {
    '& .MuiPaper-root': {
      minHeight: props.minHeight,
      maxHeight: props.maxHeight,
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '0px',
      background: props.background,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      overflow: props.overflow,
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

const SelectRightSheet = (props) => {
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
    styleDrawerMinHeight = '100vh',
    styleDrawerMaxHeight = '100vh',
    // styleDrawerWidth = '50vh',
    background = '#FFFFFF',
    toShow,
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
            className={`${css.trigger1} ${multiple ? css.multiple : ''}`}
            role="menuitem"
            onClick={() => onTrigger(name)}
          >
            <div className={css.label}>
              {label}
              {required ? <span style={{ color: 'red' }}> *</span> : ''}
            </div>

            {id && id === 'recordBillVendor' && toShow === false ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                <div
                  className={css.value}
                  style={{ width: '55%' }}
                  onClick={() => onTrigger('list')}
                >
                  {val}
                </div>
                <Button
                  style={{
                    width: '55%',
                    fontSize: 10,
                    background: '#F08B32',
                    color: '#FFF',
                    whiteSpace: 'nowrap',
                    borderRadius: 15,
                    padding: 5,
                    textTransform: 'capitalize',
                    marginTop: '-8px',
                  }}
                  onClick={() => onTrigger('addManually')}
                >
                  Add this Vendor
                </Button>
              </div>
            ) : (
              <div>
                <div className={css.value}>{val}</div>
                {/* <ExpandMoreOutlinedIcon className={css.icon} />{' '} */}
              </div>
            )}
            {error && (
              <FormHelperText style={errorStyle}>{helperText}</FormHelperText>
            )}
          </div>
        </>
      )}

      <StyledDrawer
        anchor="right"
        variant="temporary"
        open={showDrawer}
        onClose={onCloseDrawer}
        minHeight={styleDrawerMinHeight || '100vh'}
        maxHeight={styleDrawerMaxHeight || '100vh'}
        minWidth={deviceDetect === 'desktop' ? '30vw' : '100%'}
        maxWidth={deviceDetect === 'desktop' ? '30vw' : '100%'}
        background={background || '#FFFFFF'}
        // overflow={id === 'overFlowHidden' ? 'hidden' : 'auto'}
        style={{
          boxShadow: '-5px 0px 10px rgba(0, 0, 0, 0.11)',
        }}
        overflow="visible"
      >
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
          <span className={css.handleR} />
          <div
            // className={css.childContainer}
            style={{ padding: '20px 0' }}
          >
            {children}
          </div>
        </div>
      </StyledDrawer>
    </>
  );
};

export default SelectRightSheet;
