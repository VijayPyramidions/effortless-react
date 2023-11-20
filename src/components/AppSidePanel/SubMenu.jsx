import React, { memo, useRef } from 'react';
import SubNavButton from './SubNavButton';

const SubMenu = ({
  item,
  panelOpen,
  openSubMenu,
  activeSubMenu,
  handleClick,
  isMobile,
}) => {
  const navRef = useRef(null);

  const isSubNavOpen = (itm, items) =>
    !panelOpen &&
    (items?.some((i) => i === openSubMenu) || itm === openSubMenu);

  return (
    <div
      style={{
        height: !isSubNavOpen(item.id, item.subFolders)
          ? 0
          : navRef.current?.clientHeight,
        overflow: 'hidden',
        transition: '.2s',
        width: '184px',
        marginBottom: !isSubNavOpen(item.id, item.subFolders) ? '0px' : '10px',
      }}
    >
      <div ref={navRef}>
        {item?.subFolders.map((subItem) => (
          <>
            {isMobile ? (
              <>
                {(subItem?.hideWithCondition && <></>) ||
                  (subItem.mobile === undefined && (
                    <SubNavButton
                      item={subItem}
                      activeSubMenu={activeSubMenu}
                      handleClick={handleClick}
                    />
                  ))}
              </>
            ) : (
              <>
                {(subItem?.hideWithCondition && <></>) || (
                  <SubNavButton
                    item={subItem}
                    activeSubMenu={activeSubMenu}
                    handleClick={handleClick}
                  />
                )}
              </>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default memo(SubMenu);
