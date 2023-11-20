/* eslint-disable no-unused-vars */

import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import AppContext from '@root/AppContext.jsx';
import AgentsList from './support/AgentsList';

const Support = () => {
  // eslint-disable-next-line no-unused-vars
  const [userinfo, setUserInfo] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [accountinfo, setAccountInfo] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [agentid, setSelectedAgentid] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [ConversationDetails, setConversationDetails] = useState([]);
  const [conversationData, setConversationData] = useState();
  const [allMessages, setAllMessages] = useState();
  const [updateMessage, setUpdateMessage] = useState({
    contentData: {},
    status: '',
  });
  const [messageType, setMessageType] = useState();
  // eslint-disable-next-line no-unused-vars
  const [channels, setChannels] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [conversationfilter, setConversationFilter] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [agentsraw, setAgentsraw] = useState();
  // eslint-disable-next-line no-unused-vars
  const [agentsFinal, setAgentsFinal] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [conversationfoundstatus, setConversationFoundStatus] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [usersfinal, setusersFinal] = useState([]);
  const [Agentsdetails, setAgentsdetails] = useState([]);
  const [triggerchat, settriggerChat] = useState(false);
  const messageParts = [];
  const chatPersonType = 'user';
  const [SuperaccountantInfo, setSuperaccountantInfo] = useState('');
  const [totalConversation, setTotalConversation] = useState();
  const [currentConversationId, setCurrentConversationId] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const [currentSourceId, setCurrentSourceId] = useState();
  const [conversationMessages, setConversationMessages] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [chatbox, setChatBox] = useState(false);
  const [startApiCall, setStartApiCall] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [callFindFreshchatUsers, setCallFindFreshchatUsers] = useState();
  // const SuperaccountantInfo = {
  //   name: 'Mano',
  //   email: 'superaccountant@goeffoerless.co',
  // };
  const [uid, setUid] = useState('');
  // const { currentUserInfo } = useContext(AppContext);
  const fcobject = {};
  const myInterval = useRef({});

  const { user, organization, openSnackBar, currentUserInfo, cable } =
    React.useContext(AppContext);

  useEffect(() => {
    // Clear time on component dismount
    return () => clearInterval(myInterval.current);
  }, []);

  // function handleCableData(data) {
  //   console.log('actioncable', data);
  //   return <></>;
  // }

  const makeRequestCall = async (type, idVal, method, url, body) => {
    await RestApi(`make_request`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        body,
        method,
        url,
        id: idVal,
      },
    })
      .then(async (res) => {
        if (res && !res.error) {
          if (type === 'users') {
            setUserInfo(res?.data);
          }
          if (type === 'getConversation') {
            setConversationData(res?.data);
            setTotalConversation(res?.data);
          }
          // if (type === 'createNewConversation') {
          //   setConversationDetails(res?.data);
          // }
          if (type === 'retrieveConversation') {
            setAllMessages(res?.data);

            // setStartApiCall(true);
          }
          if (type === 'getAgents') {
            setAgentsraw(res?.data);
          }
          if (type === 'updateConversation_normal') {
            // conversationmessages = [];
            // setConversationMessages([]);
            // const url = `https://axb.freshchat.com/v2/conversations/${conversationData?.conversations[conversationData.conversations.length - 1].id}/messages`;
            makeRequestCall(
              'retrieveConversation',
              selectedId,
              'get',
              `https://axb.freshchat.com/v2/conversations/${currentConversationId}/messages`,
            );
          }

          if (type === 'updateConversation_resolved') {
            // conversationmessages = [];
            // setConversationMessages([]);
            // const url = `https://axb.freshchat.com/v2/conversations/${conversationData?.conversations[conversationData.conversations.length - 1].id}/messages`;
            makeRequestCall(
              'retrieveConversation',
              selectedId,
              'get',
              `https://axb.freshchat.com/v2/conversations/${currentConversationId}/messages`,
            );
            setCallFindFreshchatUsers('call');
          }

          if (type === 'uploadImg') {
            console.log('uploadImg', res);
          }
          if (type === 'getAllConversation') {
            console.log('getAllConversation', res);
          }
          console.log('make', res);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (currentUserInfo?.id) {
      console.log('cable', cable);
      console.log(
        'memberId',
        `member_notification_${currentUserInfo?.membershipId}`,
      );
      cable.subscriptions.create(
        {
          channel: `MemberNotificationChannel`,
          member_id: currentUserInfo?.membershipId,
        },
        {
          initialized: (data) => {
            console.log('initialized', data);
          },
          connected: (data) => {
            console.log('Connected', data);
          },
          received: (data) => {
            makeRequestCall(
              'retrieveConversation',
              myInterval.current.selectedId || undefined,
              'get',
              `https://axb.freshchat.com/v2/conversations/${myInterval.current.currentConversationId}/messages`,
            );
            console.log('received', data);
          },
          disconnected: (data) => {
            console.log('disconnected', data);
          },
          rejected: (data) => {
            console.log('rejected', data);
          },
        },
      );
    }
  }, [currentUserInfo?.id]);

  // const startTimer = (type) => {
  //   if (type === 'start') {
  //     myInterval.current.Interval = setInterval(() => {
  //       makeRequestCall(
  //         'retrieveConversation',
  //         myInterval.current.selectedId || undefined,
  //         'get',
  //         `https://axb.freshchat.com/v2/conversations/${myInterval.current.currentConversationId}/messages`,
  //       );
  //     }, 5000);
  //   } else {
  //     clearInterval(myInterval.current.Interval);
  //     myInterval.current.Interval = null;
  //   }
  //   // return () => clearInterval(interval);
  // };
  useEffect(() => {
    if (selectedId) myInterval.current.selectedId = selectedId;
    if (currentConversationId)
      myInterval.current.currentConversationId = currentConversationId;
  }, [selectedId, currentConversationId]);

  // useEffect(() => {
  //   if (currentConversationId && startApiCall) startTimer('start');
  //   else {
  //     startTimer('stop');
  //   }
  // }, [currentConversationId, startApiCall]);

  const createUserInFreshchat = (content) => {
    RestApi(`freshchat/${organization?.orgId}/create_conversation`, {
      method: METHOD.POST,
      payload: {
        message: content,
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      const url3 = `https://axb.freshchat.com/v2/conversations/${res?.conversation_id}`;
      makeRequestCall('getConversation', undefined, 'get', url3);

      const url = `https://axb.freshchat.com/v2/conversations/${res?.conversation_id}/messages`;
      makeRequestCall('retrieveConversation', undefined, 'get', url);

      setCurrentConversationId(res?.conversation_id);
      setCurrentUserId(res?.source_document?.id);

      // const url = `https://axb.freshchat.com/v2/conversations/${res?.conversation_id}/messages`;
      // makeRequestCall('retrieveConversation', res?.id, 'get', url);
    });
  };

  const FindFreshchatUsers = () => {
    RestApi(`freshchat/${organization?.orgId}/freshchat_users`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res?.data?.length > 0) {
        const totalConversationList = res.data.filter(
          (ele) => ele.conversation_id,
        );
        setTotalConversation(totalConversationList);
        // setConversationDetails(totalConversationList);
        // if (!currentConversationId) {
        //   const conversationIdList = totalConversationList?.reduce(
        //     (prev, curr) =>
        //       new Date(prev?.created_at) > new Date(curr?.created_at)
        //         ? prev
        //         : curr,
        //   );
        //   setCurrentConversationId(conversationIdList.conversation_id);
        // }
      } else {
        createUserInFreshchat();
        setTimeout(() => {
          FindFreshchatUsers();
        }, 3000);
        setTimeout(() => {
          setChatBox(true);
        }, 4000);
      }
    });
  };
  useMemo(() => {
    if (callFindFreshchatUsers === 'call') {
      setTimeout(() => {
        FindFreshchatUsers();
      }, 3000);
    }
  }, [callFindFreshchatUsers]);

  useMemo(() => {
    if (totalConversation) {
      if (selectedTab === 0) {
        if (totalConversation.status !== 'resolved') {
          setConversationDetails(totalConversation);
          if (currentConversationId) {
            const url = `https://axb.freshchat.com/v2/conversations/${currentConversationId}/messages`;
            makeRequestCall('retrieveConversation', undefined, 'get', url);
          }
        } else {
          setConversationDetails([]);
        }

        // if (
        //   totalConversation).length <= 0
        // ) {
        //   setConversationMessages([]);
        // }
        // if (!currentConversationId) {
        // const conversationIdList = totalConversation
        //   ?.filter((ele) => ele.conversation_status !== 'resolved')
        //   ?.reduce((prev, curr) =>
        //     new Date(prev?.created_at) > new Date(curr?.created_at)
        //       ? prev
        //       : curr,
        //   );
        // setCurrentConversationId(conversationIdList?.conversation_id);
        // conversationIdList?.forEach((ele, i) => {

        // });
        // }
      } else if (selectedTab === 1) {
        if (totalConversation.status === 'resolved') {
          setConversationDetails(totalConversation);
          if (currentConversationId) {
            const url = `https://axb.freshchat.com/v2/conversations/${currentConversationId}/messages`;
            makeRequestCall('retrieveConversation', undefined, 'get', url);
          }
        } else {
          setConversationDetails([]);
        }
        // setConversationDetails(totalConversation);
        // if (
        //   totalConversation?.filter(
        //     (ele) => ele.conversation_status === 'resolved',
        //   ).length <= 0
        // ) {
        //   setConversationMessages([]);
        // }
        // if (!currentConversationId) {
        // const conversationIdList = totalConversation
        //   ?.filter((ele) => ele.conversation_status !== 'resolved')
        //   ?.reduce((prev, curr) =>
        //     new Date(prev?.created_at) > new Date(curr?.created_at)
        //       ? prev
        //       : curr,
        //   );
        // setCurrentConversationId(conversationIdList?.conversation_id);
        // conversationIdList?.forEach((ele, i) => {

        // });
        // }
      }
    }
  }, [selectedTab, totalConversation]);

  useEffect(() => {
    if (currentUserInfo?.id) {
      const url2 = `https://axb.freshchat.com/v2/agents`;
      makeRequestCall('getAgents', undefined, 'get', url2);
      if (currentUserInfo?.conversationId) {
        // FindFreshchatUsers();

        const url3 = `https://axb.freshchat.com/v2/conversations/${currentUserInfo?.conversationId}`;
        makeRequestCall('getConversation', undefined, 'get', url3);

        const url = `https://axb.freshchat.com/v2/conversations/${currentUserInfo?.conversationId}/messages`;
        makeRequestCall('retrieveConversation', undefined, 'get', url);

        setCurrentConversationId(currentUserInfo?.conversationId);
        setCurrentUserId(currentUserInfo?.sourceDocument?.id);
      }
      // else {
      //   createUserInFreshchat();
      // }
    }
  }, [currentUserInfo?.id, currentUserInfo?.conversation_id]);

  // useMemo(() => {
  //   if (userinfo?.id) {
  //     const url = `https://axb.freshchat.com/v2/users/${
  //       currentUserInfo?.freshchatId || currentUserInfo?.membershipId
  //     }/conversations`;
  //     makeRequestCall('getConversation', 'get', url);
  //   } else if (userinfo?.status === 'USER_NOT_FOUND') {
  //     createUserInFreshchat();
  //     setTimeout(() => {
  //       FindFreshchatUsers();
  //     }, 3000);
  //   }
  // }, [userinfo]);

  // useMemo(() => {
  //   if (totalConversation?.length > 0) {
  //     const conversationIdList = totalConversation?.map(
  //       (element) => element.conversation_id,
  //     );
  //     conversationIdList?.forEach((ele, i) => {
  //       const url = `https://axb.freshchat.com/v2/conversations/${ele}/messages`;
  //       makeRequestCall(
  //         'retrieveConversation',
  //         totalConversation[i].id,
  //         'get',
  //         url,
  //       );
  //     });
  //   }
  // }, [totalConversation]);

  // useMemo(() => {
  //   // if (conversationData?.conversations?.length <= 0) {
  //   //   const url = `https://axb.freshchat.com/v2/conversations`;
  //   //   const body = {
  //   //     status: 'new',
  //   //     messages: [
  //   //       {
  //   //         message_parts: [
  //   //           {
  //   //             text: {
  //   //               content: 'Hiii',
  //   //             },
  //   //           },
  //   //         ],
  //   //         channel_id: '2405429b-9a04-427e-9cb6-ecb94fbb70aa',
  //   //         message_type: 'normal',
  //   //         actor_type: 'user',
  //   //         actor_id:
  //   //           currentUserInfo?.freshchatId || currentUserInfo?.membershipId,
  //   //       },
  //   //     ],
  //   //     channel_id: '2405429b-9a04-427e-9cb6-ecb94fbb70aa',
  //   //     users: [
  //   //       {
  //   //         id: currentUserInfo?.freshchatId || currentUserInfo?.membershipId,
  //   //       },
  //   //     ],
  //   //   };
  //   //   makeRequestCall('createNewConversation', 'post', url, body);
  //   // } else if (conversationData?.conversations?.length > 0) {
  //     const url = `https://axb.freshchat.com/v2/conversations/${
  //       conversationData?.conversations[
  //         conversationData.conversations.length - 1
  //       ].id
  //     }/messages`;
  //     makeRequestCall('retrieveConversation', 'get', url);
  //   // }
  // }, [conversationData]);

  useMemo(() => {
    if (allMessages?.messages?.length > 0) {
      setConversationMessages(allMessages?.messages?.reverse());
    }
    const agentsId = allMessages?.messages?.filter(
      (ele) => ele.actor_type === 'agent',
    );
    if (agentsId?.length > 0) {
      agentsId?.forEach((ele) => {
        if (ele?.actor_id) {
          setSuperaccountantInfo(
            agentsraw?.agents?.filter(
              (element) => element.id === ele?.actor_id,
            )[0],
          );
        }
      });
    }
  }, [allMessages]);

  useMemo(() => {
    if (Object.keys(updateMessage?.contentData || {})?.length > 0) {
      if (updateMessage?.status === 'resolved' && currentConversationId) {
        const url = `https://axb.freshchat.com/v2/conversations/${currentConversationId}`;
        const body = {
          channel_id: '2405429b-9a04-427e-9cb6-ecb94fbb70aa',
          assigned_agent_id: '0ee299af-64f4-4d18-a2dc-ba227f40d26c',
          status: 'resolved',
          // users: [{
          //   id: currentUserId
          // }]
        };
        makeRequestCall(
          'updateConversation_resolved',
          selectedId,
          'put',
          url,
          body,
        );
      } else if (
        updateMessage?.status === 'reopened' &&
        currentConversationId
      ) {
        const url = `https://axb.freshchat.com/v2/conversations/${currentConversationId}`;
        const body = {
          channel_id: '2405429b-9a04-427e-9cb6-ecb94fbb70aa',
          assigned_agent_id: '0ee299af-64f4-4d18-a2dc-ba227f40d26c',
          status: 'reopened',
          // users: [{
          //   id: currentUserId
          // }]
        };
        makeRequestCall(
          'updateConversation_resolved',
          selectedId,
          'put',
          url,
          body,
        );
      } else if (updateMessage?.contentData && currentConversationId) {
        const url = `https://axb.freshchat.com/v2/conversations/${currentConversationId}/messages`;
        const body = {
          message_parts: updateMessage?.contentData,
          channel_id: '2405429b-9a04-427e-9cb6-ecb94fbb70aa',
          message_type: 'normal',
          actor_type: 'user',
          actor_id: currentUserId,
          user_id: currentUserId,
        };
        makeRequestCall(
          'updateConversation_normal',
          selectedId,
          'post',
          url,
          body,
        );
      } else {
        createUserInFreshchat(updateMessage?.contentData?.text);
      }
    }
  }, [updateMessage?.contentData, updateMessage?.status]);

  async function fetchResults(passVal) {
    let res = null;
    if (
      import.meta.env &&
      import.meta.ENVIRONMENT &&
      import.meta.ENVIRONMENT === 'LOCAL'
    ) {
      const cheader = {
        authorization: import.meta.FC_TOKEN,
        'Content-Type': 'application/json',
      };
      if (passVal.data) {
        cheader.data = JSON.stringify(passVal.data);
      }
      res = await axios({
        method: passVal.type,
        url: passVal.url,
        headers: cheader,
      });
    } else {
      const cheader = {
        authorization: import.meta.FC_TOKEN,
        'Content-Type': 'application/json',
      };
      res = await axios({
        method: passVal.type,
        url: passVal.url,
        withCredentials: false,
        headers: cheader,
        body: JSON.stringify(passVal.data),
      });
    }
    return res.data;
  }

  const getEnteredMessage = (message, conversations, time) => {
    const agentdetail = '';
    const mess = {};
    const mparts = [];
    const mpartsunit = {};
    mpartsunit.text = {};
    if (!conversationfoundstatus) {
      mpartsunit.text.content = message;
      mparts.push(mpartsunit);
      mess.app_id = agentdetail.app_id;
      mess.actor_type = chatPersonType;
      mess.actor_id = agentdetail.uid;
      mess.channel_id = agentdetail.channel_id;
      mess.message_type = 'normal';
      mess.id = uuidv4();
      mess.message_parts = mparts;
      messageParts.push(mess);
      const messageblock = {};
      messageblock.app_id = agentdetail.app_id;
      messageblock.channel_id = agentdetail.channel_id;
      messageblock.messages = messageParts;
      messageblock.status = 'new';
      messageblock.users = [{ id: agentdetail.uid }];
      messageblock.agents = [{ id: agentdetail.id }];

      const mpartss = {};
      mpartss.message_parts = [];
      const mtext = {};
      mtext.text = { content: message };
      const conversation = conversations;
      const mpart = {};
      mpart.text = {};
      mpart.text.content = message;
      // conversation.Conversations[0].conversation_document[0].message_parts.push(
      //   mpart,
      // );
      settriggerChat(!triggerchat);
    } else {
      mparts.text.content = message;
      mess.app_id = agentdetail.app_id;
      mess.actor_type = chatPersonType;
      mess.actor_id = agentdetail.uid;
      mess.channel_id = agentdetail.channel_id;
      mess.message_type = 'normal';
      mess.created_time = time;
      mess.message_parts = mparts;
      messageParts.push(mess);
      const messageblock = {};
      messageblock.app_id = agentdetail.app_id;
      messageblock.channel_id = agentdetail.channel_id;
      messageblock.messages = messageParts;
      messageblock.status = 'new';
      messageblock.users = [{ id: agentdetail.uid }];
      messageblock.agents = [{ id: agentdetail.id }];
    }
  };

  useEffect(() => {
    if (
      Agentsdetails &&
      Agentsdetails.agents &&
      Agentsdetails.agents.length > 0
    ) {
      Agentsdetails.agents.forEach((agent) => {
        let aname = '';
        if (agent.last_name) {
          aname = `${agent.first_name.toUpperCase()} ${agent.last_name.toUpperCase()}`;
        } else {
          aname = `${agent.first_name.toUpperCase()}`;
        }
        if (aname === 'SUPER ACCOUNTANT') {
          fcobject[agent.id] = {};
        }
      });
    }
  }, [uid, usersfinal, accountinfo, Agentsdetails]);

  // const setChannelInfo = (channel) => {
  //   setChannels(channel);
  // };

  // useEffect(() => {
  //   let urldata = '';
  //   if (
  //     import.meta &&
  //     import.meta.ENVIRONMENT &&
  //     import.meta.ENVIRONMENT === 'LOCAL'
  //   ) {
  //     urldata = { url: '/fc_accountInformation', type: 'POST' };
  //   } else {
  //     urldata = {
  //       url: 'https://api.freshchat.com//v2/accounts/configuration',
  //       type: 'GET',
  //     };
  //   }
  //   fetchResults(urldata).then((data) => setAccountInfo(data));
  //   if (
  //     import.meta &&
  //     import.meta.ENVIRONMENT &&
  //     import.meta.ENVIRONMENT === 'LOCAL'
  //   ) {
  //     urldata = { url: '/fc_chatapiChannels', type: 'GET', data: {} };
  //   } else {
  //     urldata = {
  //       url: 'https://api.freshchat.com/v2/channels?sort_by=name&items_per_page=30&sort_order=desc&page=1',
  //       type: 'GET',
  //       data: {},
  //     };
  //   }
  //   fetchResults(urldata).then((data) => setChannelInfo(data));
  //   if (
  //     import.meta &&
  //     import.meta.ENVIRONMENT &&
  //     import.meta.ENVIRONMENT === 'LOCAL'
  //   ) {
  //     urldata = { url: '/fc_allagents', type: 'POST', data: {} };
  //   } else {
  //     urldata = {
  //       url: 'https://api.freshchat.com/v2/agents?items_per_page=20',
  //       type: 'GET',
  //       data: {},
  //     };
  //   }
  //   fetchResults(urldata).then((data) => {
  //     setAgentsdetails(data);
  //   });
  // }, []);

  return (
    <>
      <AgentsList
        SuperaccountantInfo={SuperaccountantInfo}
        Conversations={ConversationDetails}
        conversationFilter={conversationfilter}
        conversationMessages={conversationMessages}
        onChange={getEnteredMessage}
        setUpdateMessage={setUpdateMessage}
        setMessageType={setMessageType}
        makeRequestCall={makeRequestCall}
        setCurrentConversationId={setCurrentConversationId}
        setCurrentUserId={setCurrentUserId}
        setCurrentSourceId={setCurrentSourceId}
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        createUserInFreshchat={createUserInFreshchat}
        FindFreshchatUsers={FindFreshchatUsers}
        setChatBox={setChatBox}
        chatbox={chatbox}
        setSelectedId={setSelectedId}
        selectedId={selectedId}
        setStartApiCall={setStartApiCall}
        myInterval={myInterval}
      />
    </>
  );
};

export default Support;
