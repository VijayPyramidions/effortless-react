/* eslint-disable no-unused-vars */

import React, { useState, useMemo, useEffect } from 'react';
// import moment from 'moment';
// import EachAgent from './SelectedAgent';
import MessageTypesMobile from './MessageTypesMobile';
// import MessageTypes from './MessageTypes';
// import UrgentIssues from './UrgentIssues';
import MessageListMobile from './MessageListMobile';
import ChatWith from './ChatWith';
import Messages from './Messages';
import * as css from '../Support.scss';

const AgentsList = (props) => {
  const Agent = props;
  const conversations = Agent.Conversations ? Agent.Conversations : [];
  const [conversationfilter, setConversationFilter] = useState(
    Agent && Agent.conversationFilter ? Agent.conversationFilter : '',
  );
  const conversationmessages =
    Agent && Agent.conversationMessages ? Agent.conversationMessages : [];
  // const agentcounter = Agent && Agent.agentCounter ? Agent.agentCounter : 0;
  // eslint-disable-next-line no-unused-vars
  const [agentCounter, setAgentCounter] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [Name, setName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [textInput, setTextInput] = useState('');
  const [currentAgent, setCurrentAgent] = useState();
  const device = localStorage.getItem('device_detect');

  const changeHandler = (conversationid, id, acounter) => {
    Agent.makeRequestCall(
      'retrieveConversation',
      id,
      'get',
      `https://axb.freshchat.com/v2/conversations/${conversationid}/messages`,
    );
    setConversationFilter(conversationid);
    setAgentCounter(acounter);
  };

  const transferMessage = (message, time) => {
    Agent.onChange(message, Agent, time);
  };

  const chatWith = (status) => {
    if (status.status === 'clicked') {
      Agent.setChatBox(true);
    } else {
      Agent.setChatBox(false);
    }
  };

  useEffect(() => {
    if (Agent.agentCounter) {
      setAgentCounter(Agent.agentCounter);
    } else {
      setAgentCounter(0);
    }
  }, [Agent.Conversations]);

  useMemo(() => {
    if (conversations.length > 0) {
      const conversationIdList = conversations?.reduce((prev, curr) =>
        new Date(prev?.last_message_time) > new Date(curr?.last_message_time)
          ? prev
          : curr,
      );
      changeHandler(
        conversationIdList?.conversation_id,
        conversationIdList?.id,
        conversations.indexOf(conversationIdList),
      );
      setCurrentAgent(conversationIdList?.conversation_id);
      //   Agent.setCurrentConversationId(conversationIdList?.conversation_id);
      // Agent.setSelectedId(conversationIdList?.id);
    }
  }, [conversations]);

  return device === 'desktop' ? (
    <div className={css.supportDesktopContainer}>
      {/* <div className={css.leftSection}>
        <UrgentIssues
          createUserInFreshchat={Agent.createUserInFreshchat}
          FindFreshchatUsers={Agent?.FindFreshchatUsers}
        />
        <MessageTypes
          setSelectedTab={Agent.setSelectedTab}
          selectedTab={Agent.selectedTab}
        />
        <div className={css.msgListContainer}>
          
            {conversations.conversation_id ?
              <>
                <EachAgent
                  key={`${conversations.conversation_id}`}
                  name={`${Agent?.SuperaccountantInfo?.first_name} ${Agent.SuperaccountantInfo?.last_name} `}
                  dp={Agent?.SuperaccountantInfo?.avatar?.url}
                  email={Agent.SuperaccountantInfo?.email}
                  biography={Agent.SuperaccountantInfo?.biography}
                  id={conversations.conversation_id}
                  // time={moment(loopData.created_at).format('DD-MM-YYYY')}
                  // message={loopData.conversation_document[0].message_parts}
                  readStatus
                  notificationCount={0}
                  conversation_id={conversations.conversation_id}
                  conversationFilter={conversationfilter}
                  onChange={changeHandler}
                  agentCounter={agentCounter}
                  acounter={0}
                  currentAgent={currentAgent}
                  setCurrentAgent={setCurrentAgent}
                  device="desktop"
                  setCurrentConversationId={Agent?.setCurrentConversationId}
                  setSelectedId={Agent?.setSelectedId}
                  myInterval={Agent?.myInterval}
                />
              </>
            
            : (
            <>
              <EachAgent noData />
            </>
          )} 
        </div>

        <div className={css.queries}>
          For further queries, please reach out to us at: <br />
          <span>support@goeffortless.co</span>
        </div>
      </div> */}
      <div className={css.rightSection}>
        <Messages
          messageInfo={Agent?.Conversations}
          agentCounter={agentCounter}
          messageArr={conversationmessages}
          conversationFilter={conversationfilter}
          textInput={textInput}
          setTextInput={setTextInput}
          onChange={transferMessage}
          SuperaccountantInfo={Agent?.SuperaccountantInfo}
          setUpdateMessage={Agent?.setUpdateMessage}
          setMessageType={Agent?.setMessageType}
          makeRequestCall={Agent?.makeRequestCall}
          setCurrentConversationId={Agent?.setCurrentConversationId}
          setCurrentUserId={Agent?.setCurrentUserId}
          setCurrentSourceId={Agent?.setCurrentSourceId}
          setSelectedId={Agent?.setSelectedId}
          device="desktop"
          setStartApiCall={Agent?.setStartApiCall}
          conversationId={conversations.conversation_id}
        />
      </div>
    </div>
  ) : (
    <div className={css.supportMobileContainer}>
      {/* {!Agent.chatbox && (
        <MessageTypesMobile
          setSelectedTab={Agent.setSelectedTab}
          selectedTab={Agent.selectedTab}
        />
      )} */}
      <MessageListMobile
        chatbox={Agent.chatbox}
        messageInfo={conversations}
        agentCounter={agentCounter}
        messageArr={conversationmessages}
        conversationFilter={conversationfilter}
        textInput={textInput}
        setTextInput={setTextInput}
        onChange={transferMessage}
        SuperaccountantInfo={Agent?.SuperaccountantInfo}
        makeRequestCall={Agent?.makeRequestCall}
        conversations={conversations}
        currentAgent={currentAgent}
        setCurrentAgent={setCurrentAgent}
        setConversationFilter={setConversationFilter}
        setAgentCounter={setAgentCounter}
        setChatBox={Agent.setChatBox}
        setUpdateMessage={Agent?.setUpdateMessage}
        setMessageType={Agent?.setMessageType}
        setCurrentConversationId={Agent?.setCurrentConversationId}
        setCurrentUserId={Agent?.setCurrentUserId}
        setSelectedId={Agent?.setSelectedId}
        setCurrentSourceId={Agent?.setCurrentSourceId}
        setStartApiCall={Agent?.setStartApiCall}
        selectedTab={Agent.selectedTab}
        setSelectedTab={Agent.setSelectedTab}
        conversationId={conversations.conversation_id}
      />
      {/* {!Agent.chatbox && (
        <ChatWith
          name={Name}
          chatwithclick={chatWith}
          createUserInFreshchat={Agent.createUserInFreshchat}
          FindFreshchatUsers={Agent?.FindFreshchatUsers}
        />
      )} */}
      {/* <div className={css.queriesMobile}>
        For further queries, please reach out to us at: <br />
        <span>support@goeffortless.co</span>
      </div> */}
    </div>
  );
};

export default AgentsList;