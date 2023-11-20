import React from 'react';
import NotificationCard from '@components/NotificationCard/NotificationCard';
import * as css from './InboxViewContainer.scss';
import { notificationImage, notificationTime } from './Utils';

function Notifications({ setDrawer, notificationListData }) {
  return (
    <div className={css.notificationsContainer}>
      {notificationListData.map((item) => {
        return (
          <div key={item.id}>
            {!item.read && (
              <NotificationCard
                allData={item}
                setDrawer={setDrawer}
                showButton={item.button}
                subject={item.subject}
                body={item.body}
                time={notificationTime(item.created_at)}
                notificationImage={notificationImage(item.notification_type)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Notifications;
