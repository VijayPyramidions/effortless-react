import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
// import Paper from '@material-ui/core/Paper';

const PopperComp = (props) => {
  const {
    openProps,
    anchorElProps,
    children,
    onClose,
    popperStyle,
    className,
    subClass,
  } = props;

  return (
    <Popper
      open={openProps}
      anchorEl={anchorElProps}
      role={undefined}
      transition
      disablePortal
      className={className}
      style={{
        ...popperStyle,
        boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        zIndex: 11,
        background: '#FFF',
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          className={subClass}
          style={{ transformOrigin: 'center top' }}
        >
          <ClickAwayListener
            onClickAway={() => {
              onClose();
            }}
          >
            {children}
          </ClickAwayListener>
        </Grow>
      )}
    </Popper>
  );
};
export default PopperComp;
