import React from 'react';
import DPSuperAccountant from '@assets/DPsuperaccountant.svg';
import * as css from '../Support.scss';

const EachAgent = (props) => {
  const Agentarr = props;
  const selectedAgent = (conversationid, id, acounter) => {
    Agentarr?.onChange(conversationid, id, acounter);
  };
  React.useEffect(() => {
        if (Agentarr.device === 'mobile') {
          Agentarr.setStartApiCall(false);
        }
      }, []);

  return Agentarr?.noData ? (
    <div className={`${css.messageListContainer}`}>No Conversations</div>
  ) : (
    <>
      <div
        className={`${css.messageListContainer} ${
          Agentarr?.currentAgent === Agentarr?.conversation_id &&
          css.selectedMessage
        }`}
        onClick={() => {
          // Agentarr?.setCurrentAgent(Agentarr.conversation_id);
          // Agentarr?.setCurrentConversationId(Agentarr.conversation_id);
          // Agentarr?.setSelectedId(Agentarr?.id);

          // // setTimeout(() => {
          // //   clearInterval(Agentarr?.myInterval.current.Interval);
          // //   Agentarr.myInterval.current.Interval=null;
          // // }, 1000);
          
          selectedAgent(
            Agentarr?.conversation_id,
            Agentarr?.id,
            Agentarr?.acounter,
          );
          if (Agentarr?.device === 'mobile') {
            Agentarr.setChatBox(true);
          }
        }}
      >
        <div className={css.messageInfoContainer}>
          <div className={css.avatar}>
            <img alt="avatar" src={Agentarr?.dp || DPSuperAccountant} />
          </div>
          <div className={css.info}>
            <p className={css.name}>{Agentarr?.name}</p>
            <p className={css.email}>{Agentarr?.email}</p>
          </div>
          <div className={css.time}>{Agentarr?.time}</div>
        </div>
        <div className={css.messageContentContainer}>
          <p className={css.message}>{Agentarr?.biography}</p>
          {!Agentarr?.readStatus && (
            <div className={css.notificationCount}>
              {Agentarr?.notificationCount}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EachAgent;