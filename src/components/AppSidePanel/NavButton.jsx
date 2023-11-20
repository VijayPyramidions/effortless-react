/* eslint-disable no-nested-ternary */

import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, IconButton } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import * as css from './AppSidePanel.scss';

const NavButton = ({
  item,
  panelOpen,
  activeMenu,
  openSubMenu,
  handleClick,
  hanldeArrowClick,
  onMouseOver,
  onMouseOut,
}) => {
  const { id, path, name, icon, activeIcon, subFolders } = item;

  return (
    <NavLink
      to={path}
      className={
        panelOpen
          ? activeMenu === id
            ? `${css.navItem} ${css.active} ${css.openPanel}`
            : `${css.navItem} ${css.openPanel}`
          : activeMenu === id
          ? `${css.navItem} ${css.active}`
          : css.navItem
      }
      key={name}
      onMouseOver={!!subFolders && panelOpen && onMouseOver(item)}
      onMouseLeave={!!subFolders && panelOpen && onMouseOut}
      onClick={(e) => handleClick(e, item)}
    >
      {icon && (
        <Avatar
          src={activeMenu === id ? activeIcon : icon}
          className={css.menuicon}
        />
      )}
      {name}
      {!!subFolders && !panelOpen && (
        <IconButton
          className={css.moreicon}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            hanldeArrowClick(id);
          }}
        >
          <KeyboardArrowDownRoundedIcon
            sx={
              openSubMenu === id
                ? {
                    transform: 'rotate(180deg)',
                    transition: '.4s',
                  }
                : {
                    transition: '.4s',
                  }
            }
          />
        </IconButton>
      )}
    </NavLink>
  );
};

export default memo(NavButton);
