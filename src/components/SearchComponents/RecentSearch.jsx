import React from 'react';
import { Avatar } from '@mui/material';
import AppContext from '@root/AppContext';

import * as css from './searchComponents.scss';

const RecentSearch = ({ RecentData, RecentSearchDeletion }) => {
  const { setGlobalSearch } = React.useContext(AppContext);

  return (
    <div className={css.recentSearch}>
      <div className={css.topCont}>
        <p className={css.header}>Recent</p>
        <div
          style={{
            opacity: RecentData?.length === 0 ? 0.4 : 1,
            pointerEvents: RecentData?.length === 0 ? 'none' : 'auto',
          }}
          onClick={() => RecentSearchDeletion()}
        >
          <p className={css.clear}>Clear All</p>
        </div>
      </div>
      {RecentData?.length > 0 && (
        <div className={css.secondCont}>
          {RecentData?.map((val) => (
            <div
              className={css.innerCont}
              onClick={() => setGlobalSearch(val?.search_text)}
            >
              <Avatar
                className={css.avatarSearch}
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${val?.search_text}&chars=2`}
              />
              <p className={css.textSearch}>{val?.search_text}</p>
            </div>
          ))}
        </div>
      )}
      {RecentData?.length === 0 && (
        <p style={{ margin: '20px' }}>There is no search history to display.</p>
      )}
    </div>
  );
};

export default RecentSearch;
