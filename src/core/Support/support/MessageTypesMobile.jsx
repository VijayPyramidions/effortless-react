import React, { useState, useEffect } from 'react';
import * as css from '../Support.scss';

const MessageTypesMobile = ({ setSelectedTab, selectedTab }) => {
  const TABS = ['ONGOING', 'CLOSED'];

  const [selectedTabP, setSelectedTabP] = useState(TABS[selectedTab]);
  const tabClickHandler = (tab, i) => {
    return () => {
      setSelectedTabP(tab);
      setSelectedTab(i);
    };
  };

  useEffect(() => {
    setSelectedTab(0);
    setSelectedTabP('ONGOING');
  }, []);

  return (
    <div className={css.mobileTabsContainer}>
      {TABS.map((TAB, i) => (
        <div
          key={`${TAB}-mobile`}
          className={`${css.mobileTabs} ${
            selectedTabP === TAB && css.selectedMobTab
          }`}
          onClick={tabClickHandler(TAB, i)}
        >
          {TAB}
        </div>
      ))}
    </div>
  );
};
export default MessageTypesMobile;
