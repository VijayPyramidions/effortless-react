import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';

import * as css from './AppSidePanel.scss';

const SubNavButton = ({ item, activeSubMenu, handleClick }) => {
  const { id, path, name } = item;

  return (
    <NavLink
      to={path}
      className={
        activeSubMenu === id
          ? `${css.navSubItem} ${css.active}`
          : css.navSubItem
      }
      key={name}
      onClick={(e) => handleClick(e, item)}
    >
      <FiberManualRecordRoundedIcon
        className={
          activeSubMenu === id
            ? `${css.navSubItemdot} ${css.active}`
            : css.navSubItemdot
        }
      />
      {name}
    </NavLink>
  );
};

export default memo(SubNavButton);
