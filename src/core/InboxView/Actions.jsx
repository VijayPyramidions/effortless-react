import React from 'react';
import ActionsCard from '@components/ActionsCard/ActionsCard';
import * as css from './InboxViewContainer.scss';
import { notificationTime } from './Utils';

function Actions({ setDrawer, actionsListData }) {
  return (
    <div className={css.actionsContainer}>
      {actionsListData.map((item) => {
        return (
          <div key={item.id}>
            {!item.read && (
              <ActionsCard
                time={notificationTime(item.created_at)}
                initial={item.initial}
                allData={item}
                setDrawer={setDrawer}
                showButton={item.show_button}
                buttonText={item.button_text}
                subject={item.subject}
                body={item.body}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Actions;
