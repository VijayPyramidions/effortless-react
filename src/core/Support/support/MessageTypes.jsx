import React, { useEffect, useState } from 'react';
import * as css from '../Support.scss';

const MessageTypes = ({ setSelectedTab, selectedTab }) => {
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
    <div className={css.tabsContainer}>
      {TABS.map((TAB, i) => (
        <div
          key={`${TAB}tabsContainer`}
          className={`${css.tab} ${selectedTabP === TAB && css.selectedTab}`}
          onClick={tabClickHandler(TAB, i)}
        >
          {TAB}
        </div>
      ))}
    </div>
  );
};

export default MessageTypes;
