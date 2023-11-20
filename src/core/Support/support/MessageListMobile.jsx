/* eslint-disable no-unused-vars */

import React from 'react';
// import moment from 'moment';
import * as css from '../Support.scss';
import Messages from './Messages';
// import EachAgent from './SelectedAgent';

const MessageListMobile = (props) => {
  const messageDetails = props;
  const {
    chatbox,
    agentCounter,
    messageArr,
    conversationfilter,
    textInput,
    setTextInput,
    onChange,
    SuperaccountantInfo,
    conversations,
    currentAgent,
    setCurrentAgent,
    makeRequestCall,
    setAgentCounter,
    setConversationFilter,
    setChatBox,
    setUpdateMessage,
    setMessageType,
    setCurrentConversationId,
    setCurrentUserId,
    setCurrentSourceId,
    setSelectedId,
    setStartApiCall,
    selectedTab,
    setSelectedTab,
    conversationId
  } = props;

  const changeHandler = (conversationid, id, acounter) => {
    makeRequestCall(
      'retrieveConversation',
      id,
      'get',
      `https://axb.freshchat.com/v2/conversations/${conversationid}/messages`,
    );
    setConversationFilter(conversationid);
    setAgentCounter(acounter);
  };
  return (
    <div
      className={
        // chatbox
           css.messageListContainerMobileChatbox
          // : css.messageListContainerMobile
      }
    >
      {/* {chatbox ? ( */}
        <>
          <Messages
            messageInfo={messageDetails.messageInfo}
            agentCounter={agentCounter}
            messageArr={messageArr}
            conversationFilter={conversationfilter}
            textInput={textInput}
            setTextInput={setTextInput}
            onChange={onChange}
            SuperaccountantInfo={SuperaccountantInfo}
            setUpdateMessage={setUpdateMessage}
            setMessageType={setMessageType}
            makeRequestCall={makeRequestCall}
            setCurrentConversationId={setCurrentConversationId}
            setCurrentUserId={setCurrentUserId}
            setSelectedId={setSelectedId}
            setCurrentSourceId={setCurrentSourceId}
            device="mobile"
            setChatBox={setChatBox}
            setStartApiCall={setStartApiCall}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            conversationId={conversationId}
          />
        </>
      {/* ) : ( */}
        {/* <div className={css.msgListContainerMobile}> */}
          {/* {conversations.length > 0 ? (
            conversations.map((loopData, i) => (
              <>
                <EachAgent
                  key={`${loopData.id}`}
                  name={`${SuperaccountantInfo?.first_name} ${SuperaccountantInfo?.last_name} `}
                  dp={SuperaccountantInfo?.avatar?.url}
                  email={SuperaccountantInfo?.email}
                  biography={SuperaccountantInfo?.biography}
                  id={loopData.id}
                  time={moment(loopData.created_at).format('DD-MM-YYYY')}
                  message={loopData.conversation_document[0].message_parts}
                  readStatus
                  notificationCount={0}
                  conversation_id={loopData.conversation_id}
                  conversationFilter={conversationfilter}
                  onChange={changeHandler}
                  agentCounter={agentCounter}
                  acounter={i}
                  currentAgent={currentAgent}
                  setCurrentAgent={setCurrentAgent}
                  device="mobile"
                  setChatBox={setChatBox}
                  setStartApiCall={setStartApiCall}
                  setCurrentConversationId={setCurrentConversationId}
                  setSelectedId={setSelectedId}
                  // chatWith={chatWith}
                />
              </>
            ))
          ) : (
            <>
              <EachAgent noData />
            </>
          )} */}
          {/* {conversations.conversation_id ?
              <>
                <EachAgent
                  key={`${conversations.conversation_id}`}
                  name={`${SuperaccountantInfo?.first_name} ${SuperaccountantInfo?.last_name} `}
                  dp={SuperaccountantInfo?.avatar?.url}
                  email={SuperaccountantInfo?.email}
                  biography={SuperaccountantInfo?.biography}
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
                  device="mobile"
                  setChatBox={setChatBox}
                  setStartApiCall={setStartApiCall}
                  // setCurrentConversationId={Agent?.setCurrentConversationId}
                  // setSelectedId={Agent?.setSelectedId}
                  // myInterval={Agent?.myInterval}
                />
              </>
            
            : (
            <>
              <EachAgent noData />
            </>
          )} 
        </div>
      )} */}
    </div>
  );
};

export default MessageListMobile;