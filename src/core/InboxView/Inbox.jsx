import { Drawer, Tab, Tabs, styled, Button } from '@material-ui/core';
import Input from '@components/Input/Input.jsx';
import Checkbox from '@components/Checkbox/Checkbox.jsx';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import * as css from './InboxViewContainer.scss';
import Notifications from './Notifications';
import Actions from './Actions';

const ActionOptions = [
  { id: 1, name: 'View More' },
  { id: 2, name: 'Remind Me Later' },
  { id: 3, name: 'Settings' },
];
const NotificationOptions = [
  { id: 1, name: 'View More' },
  { id: 2, name: 'Delete This Notification' },
  { id: 3, name: 'Remind Me Later' },
  { id: 4, name: 'Go to Settings' },
];
const useStyles = makeStyles(() => ({
  indicator: {
    backgroundColor: '#F08B32',
  },
  buttonRoot: {
    borderRadius: 50,
    color: '#F08B32',
    borderColor: '#F08B32',
    fontSize: '10px',
  },
}));

function InboxViewContainer() {
  const { organization, user } = React.useContext(AppContext);
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [notificationListResponse, setNotificationListResponse] = useState([]);
  const [actionsListResponse, setActionsListResponse] = useState([]);
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0);
  const [actionsUnreadCount, setActionsUnreadCount] = useState(0);
  const [drawer, setDrawer] = useState({
    notificationMenu: false,
    actionMenu: false,
    message: false,
    invoice: false,
    remindMeLater: false,
  });
  const [item, setItem] = useState({});
  const fetchNotificationList = async () => {
    await RestApi(`organizations/${organization.orgId}/notifications`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        setNotificationUnreadCount(res.unread_count);
        setNotificationListResponse(res.data);
      }
    });
  };

  const fetchActionsList = async () => {
    await RestApi(
      `organizations/${organization.orgId}/notifications?category=action`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (res && !res.error) {
        setActionsUnreadCount(res.unread_count);
        setActionsListResponse(res.data);
      }
    });
  };
  useEffect(() => {
    fetchNotificationList();
    fetchActionsList();
  }, []);

  const SpecificTime = () => {
    return (
      <div className={css.specificTimeContainer}>
        <div className={css.timerSection}>
          <div>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              max="5"
            />
          </div>
          <div>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              max="5"
            />
          </div>
        </div>
        <div className={css.instructionsSection}>
          <div className={css.instructionsWrapper}>
            You will receive your daily Notifications at the Time you have set
            here. To reset your selected Time, visit the Remind Me Later section
            and reset the time.
          </div>
        </div>
        <div className={css.buttonSection}>
          <div className={css.buttonWrapper}>
            <div className={css.buttonText}>Confirm Specific Time</div>
          </div>
        </div>
      </div>
    );
  };
  const Frequency = () => {
    return (
      <div className={css.frequencyContainer}>
        <div className={css.checklistSection}>
          <div className={css.sectionLeft}>
            <div className={css.checkboxWithLable}>
              <Checkbox />
              <div>Every Hour</div>
            </div>
            <div className={css.checkboxWithLable}>
              <Checkbox />
              <div>Every 4 Hours</div>
            </div>
            <div className={css.checkboxWithLable}>
              <Checkbox />
              <div>Every 8 Hours</div>
            </div>
          </div>
          <div className={css.sectionRight}>
            <div className={css.checkboxWithLable}>
              <Checkbox />
              <div>Every 2 Hours</div>
            </div>
            <div className={css.checkboxWithLable}>
              <Checkbox />
              <div>Every 6 Hours</div>
            </div>
            <div className={css.checkboxWithLable}>
              <Checkbox />
              <div>End of the Day</div>
            </div>
          </div>
        </div>
        <div className={css.instruncionsSection}>
          <div className={css.instructionsWrapper}>
            Set the Frequencies at which you would like to receive your
            Notifications on Effortless
          </div>
        </div>
        <div className={css.buttonSection}>
          <div className={css.buttonWrapper}>
            <div className={css.buttonText}>Confirm Frequency</div>
          </div>
        </div>
      </div>
    );
  };

  const openDrawer = (name, subject) => {
    if (name) {
      setDrawer((d) => ({ ...d, [name]: true }));
      setItem(subject);
    }
  };
  const closeDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: false }));
    setItem({});
  };
  const tabchange = (event, value) => {
    setTabValue(value);
  };

  function TabPanel(props) {
    const { children, value, index } = props;

    return <>{value === index && children}</>;
  }

  const notificationViewMore = () => {
    RestApi(`organizations/${organization.orgId}/notifications/${item.id}`, {
      method: METHOD.PATCH,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res) {
          console.log('--notification read-->', res);
          fetchNotificationList();
        }
      })
      .catch((error) => {
        console.log('--notification read-->', error);
      });
  };

  const deleteNotification = () => {};

  const notificationSettings = () => {};

  const notificationHandler = (v) => {
    setDrawer({ notificationMenu: false });
    if (v.name === 'Remind Me Later') {
      openDrawer('remindMeLater', item);
    } else if (v.name === 'View More') {
      notificationViewMore();
    } else if (v.name === 'Delete This Notification') {
      deleteNotification();
    } else if (v.name === 'Go to Settings') {
      notificationSettings();
    } else {
      console.log(v.name);
    }
  };
  const actionsViewMore = () => {
    RestApi(`organizations/${organization.orgId}/notifications/${item.id}`, {
      method: METHOD.PATCH,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res) {
          console.log('--action read-->', res);
          fetchActionsList();
        }
      })
      .catch((error) => {
        console.log('--action read-->', error);
      });
  };

  const actionsSettings = () => {};

  const actionsHandler = (v) => {
    setDrawer({ actionMenu: false });
    if (v.name === 'Remind Me Later') {
      openDrawer('remindMeLater', item);
    } else if (v.name === 'View More') {
      actionsViewMore();
    } else if (v.name === 'Settings') {
      actionsSettings();
    } else {
      console.log(v.name);
    }
  };

  const NotificationContent = () => {
    return (
      <div className={css.styledDrawerWrapper}>
        <div className={css.styledDrawerHeader} />
        <div className={css.list}>
          {NotificationOptions.map((v) => (
            <div
              className={
                NotificationOptions.length === v.id
                  ? css.categoryOptionsLast
                  : css.categoryOptions
              }
              onClick={() => {
                notificationHandler(v);
              }}
              key={v.id}
              role="menuitem"
            >
              {v.name}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ActionContent = () => {
    return (
      <div className={css.styledDrawerWrapper}>
        <div className={css.styledDrawerHeader} />
        <div className={css.list}>
          {ActionOptions.map((v) => (
            <div
              className={
                ActionOptions.length === v.id
                  ? css.categoryOptionsLast
                  : css.categoryOptions
              }
              onClick={() => {
                actionsHandler(v);
              }}
              key={v.id}
              role="menuitem"
            >
              {v.name}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Message = () => {
    return (
      <div className={css.styledDrawerWrapper}>
        <div className={css.styledDrawerHeader} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px',
            marginLeft: '10px',
            marginRight: '10px',
          }}
        >
          <div
            style={{
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div className={css.valueHeader}>Write a Message</div>
              <span className={css.headerUnderline} />
            </div>
            <Button
              onClick={() => {
                console.log('button');
              }}
              variant="outlined"
              classes={{
                root: classes.buttonRoot,
              }}
            >
              Send Now
            </Button>
          </div>
          <Input
            name="message"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            onChange={(e) => console.log(e.target.value)}
            theme="light"
            multiline
            rows={10}
            rootStyle={{
              border: '1px solid #A0A4AF',
              backgroundColor: '#EDEDED26',
            }}
          />
        </div>
      </div>
    );
  };

  const Invoice = () => {
    return (
      <div className={css.styledDrawerWrapper}>
        <div className={css.styledDrawerHeader} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px',
            marginLeft: '10px',
            marginRight: '10px',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <div className={css.valueHeader}>ACME-10929-COMESK</div>
            <span className={css.headerUnderline} />
          </div>
          <div
            style={{
              height: '400px',
              backgroundColor: 'lightgray',
            }}
          />
        </div>
      </div>
    );
  };
  const RemindMeLater = () => {
    const [remindMeLaterTab, setRemindMeLaterTab] = useState(0);
    return (
      <div className={css.styledDrawerWrapper}>
        <div className={css.styledDrawerHeader} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px',
            marginLeft: '10px',
            marginRight: '10px',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <div className={css.valueHeader}>Remind Me Later</div>
            <span className={css.headerUnderline} />
          </div>
          <div
            className={css.remindMeLaterTab}
            style={{
              display: 'flex',
              flexDrection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div
              className={
                remindMeLaterTab === 0
                  ? css.remindMeLaterTabActive
                  : css.remindMeLaterTabDeActive
              }
              onClick={() => {
                setRemindMeLaterTab(0);
              }}
            >
              SPECIFIC TIME
            </div>
            <div
              className={
                remindMeLaterTab === 1
                  ? css.remindMeLaterTabActive
                  : css.remindMeLaterTabDeActive
              }
              onClick={() => {
                setRemindMeLaterTab(1);
              }}
            >
              FREQUENCY
            </div>
          </div>
          {remindMeLaterTab === 0 ? <SpecificTime /> : <Frequency />}
        </div>
      </div>
    );
  };
  const StyledDrawer = styled(Drawer)(() => ({
    '& .MuiPaper-root': {
      minHeight: '20vh',
      maxHeight: '80vh',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
    },
  }));

  return (
    <div className={css.inboxContainer}>
      <div className={css.tabsWrapper}>
        <Tabs
          value={tabValue}
          onChange={tabchange}
          className={css.tabsStyle}
          classes={{
            indicator: classes.indicator,
          }}
        >
          <Tab
            disableRipple
            value={0}
            key="notifications"
            label={
              notificationUnreadCount > 0
                ? `NOTIFICATIONS (${notificationUnreadCount})`
                : `NOTIFICATIONS`
            }
            className={tabValue === 0 ? css.activeTab : css.deactiveTab}
          />
          <Tab
            disableRipple
            value={1}
            key="actions"
            label={
              actionsUnreadCount > 0
                ? `ACTIONS (${actionsUnreadCount})`
                : `ACTIONS`
            }
            className={tabValue === 1 ? css.activeTab : css.deactiveTab}
          />
        </Tabs>
      </div>
      <TabPanel value={tabValue} index={0}>
        <Notifications
          setDrawer={openDrawer}
          notificationListData={notificationListResponse}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Actions setDrawer={openDrawer} actionsListData={actionsListResponse} />
      </TabPanel>

      <StyledDrawer
        anchor="bottom"
        variant="temporary"
        open={drawer.notificationMenu}
        onClose={() => {
          closeDrawer('notificationMenu');
        }}
      >
        <NotificationContent />
      </StyledDrawer>

      <StyledDrawer
        anchor="bottom"
        variant="temporary"
        open={drawer.actionMenu}
        onClose={() => {
          closeDrawer('actionMenu');
        }}
      >
        <ActionContent />
      </StyledDrawer>

      <StyledDrawer
        anchor="bottom"
        variant="temporary"
        open={drawer.message}
        onClose={() => {
          closeDrawer('message');
        }}
      >
        <Message />
      </StyledDrawer>

      <StyledDrawer
        anchor="bottom"
        variant="temporary"
        open={drawer.invoice}
        onClose={() => {
          closeDrawer('invoice');
        }}
      >
        <Invoice />
      </StyledDrawer>

      <StyledDrawer
        anchor="bottom"
        variant="temporary"
        open={drawer.remindMeLater}
        onClose={() => {
          closeDrawer('remindMeLater');
        }}
      >
        <RemindMeLater />
      </StyledDrawer>
    </div>
  );
}

export default InboxViewContainer;
