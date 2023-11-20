/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */


import React, { useRef, useContext, useState,useEffect } from 'react';
import AppContext from '@root/AppContext.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { TrixEditor } from 'react-trix';
import DPSuperAccountant from '@assets/DPsuperaccountant.svg';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import 'trix/dist/trix.css';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import RightMessage from './MessagesRight';
import LeftMessage from './MessagesLeft';
import * as css from '../Support.scss';

const Messages = (MessageDetails) => {
  const { user,openSnackBar } = useContext(AppContext);
  const [msgDetails, setMsgDetails] = useState();
  const [msgType, setMsgType] = useState();
  const [fileVal, setFileVal] = useState();
  // let disableBtn = false;
  const Message = MessageDetails;
  const messageArr = Message && Message.messageArr ? Message.messageArr : [];
  const textAreaRef = useRef({
    text:"",
    conversationId:''
  });
  const fileref = useRef();
  const autoScrollArea = useRef('');
  const [messageMob, setMessageMob] = React.useState('');
  let messageCounter = 0;
  let EnteredMessage = '';
  let EnteredMessageTxt = '';

  function getBinary(data) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(data);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  

  const tcurrent = () => {
    return textAreaRef.current.container.focus();
  };

  const handleEditorReady = (editor) => {
    editor.element.setAttribute('placeholder', 'Type your message');
  };
  // eslint-disable-next-line no-unused-vars
  const handleChange = (html, text) => {
    EnteredMessage = html;
    EnteredMessageTxt = text;
  };

  const handleChangeMobile = (event) => {
    textAreaRef.current.text = event?.target?.value;
    setMessageMob(event?.target?.value);
  };

  
  // window.addEventListener('trix-attachment-add', async function (event) {
  //   event.stopImmediatePropagation();
  //   if (event.attachment.file) {
  //     console.log(event.attachment);
  //   }
  //   if (event.attachment.file) {
  //     if (event.attachment.file.type === 'application/pdf') {
  //       Message.setMessageType('file');
  //       setMsgType('file');
  //     } else {
  //       Message.setMessageType('img');
  //       setMsgType('img');
  //     }
  //     await getBinary(event.attachment.file).then(async (data) => {
  //       const fileData = await btoa(data);
  //       onFileUpload(fileData, event.attachment.file);
  //     });
  //   }
  // });

  function isHTMLTag(input) {
    const regex = /(<([^>]+)>)/ig;
    return regex.test(input);
  }

  const sendMessages = () => {
    if(textAreaRef?.current?.text){
    const checkMsg = isHTMLTag(textAreaRef?.current?.text?.trim()||'');
    if(checkMsg){
      openSnackBar({
        message: "Please avoid typing HTML codes",
        type: MESSAGE_TYPE.WARNING,
      });
      return;
    }
    EnteredMessageTxt = textAreaRef?.current?.text?.trim()||'';
    Message.onChange(EnteredMessage, new Date().toISOString());
    // Message.setCurrentConversationId(Message.messageInfo.conversation_id);
    // Message.setCurrentUserId(Message.messageInfo.user_id);
    // Message.setSelectedId(Message?.messageInfo.id);
    // Message.setCurrentSourceId(Message.messageInfo.source_id);
    Message.setStartApiCall(true);
    let content;
    if(textAreaRef?.current?.conversationId){
     content =
      msgType === 'img'
        ? [
            {
              image: {
                url: msgDetails,
              },
            },
          ]
        : msgType === 'file'
        ? [
            {
              file: {
                url: msgDetails,
                name: fileVal?.filename,
                file_size_in_bytes: fileVal?.byte_size,
                content_type: fileVal?.content_type,
              },
              // file: {
              //   url: "https://morth.nic.in/sites/default/files/dd12-13_0.pdf",
              //   name: "Dummy",
              //   file_size_in_bytes: 13000,
              //   content_type:"application/pdf"
              // },
            },
          ]
        : [
            {
              text: {
                content: EnteredMessageTxt,
              },
            },
          ];
    } else {
      content = {
        text:EnteredMessageTxt
      };
    }
    
    Message.setUpdateMessage({ contentData: content, status: 'normal' });
    setMessageMob('');
    textAreaRef.current.text='';
  }
    // setTimeout(() => {
    //   textAreaRef.current.editor.loadHTML('');
    //   console.log(autoScrollArea.current);
    //   window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });

    //   autoScrollArea.current.scrollIntoView({ behavior: 'smooth' });
    // }, 100);
  };

  const onFileUpload = (base64, directFile) => {
    // disableBtn = true;
    const file = directFile;
    RestApi(`direct_uploads/file`, {
      method: METHOD.POST,
      payload: {
        blob: {
          io: base64,
          filename: file.name,
        },
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then(async(res) => {
        if (res) {
          setMsgDetails(res?.direct_upload?.url);
          setFileVal(res);
          // await sendMessages();
          // disableBtn = false;
        }
      })
      .catch((e) => console.log('file upload err', e));
  };

  const HanldeFileUpload = async(e) =>{
    console.log("fileevent",e?.target?.files[0]);
    let file;
    if (e?.target?.files[0]) {
      file = e?.target?.files[0];
      if (e?.target?.files[0].type === 'application/pdf') {
        Message.setMessageType('file');
        setMsgType('file');
      } else {
        Message.setMessageType('img');
        setMsgType('img');
      }
      await getBinary(e?.target?.files[0]).then(async (data) => {
        const fileData = await btoa(data);
        onFileUpload(fileData, file);
      });
    }
  };

  useEffect(()=>{
    if(msgDetails){
      sendMessages();
    }
  },[msgDetails]);

  useEffect(()=>{
    if(Message?.conversationId){
      textAreaRef.current.conversationId = Message?.conversationId;
    }
  },[Message?.conversationId]);

  useEffect(() => {
    
    const listener = (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        console.log('Enter key was pressed. Run your function.');
        event.preventDefault();
        sendMessages(event);
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  // const setStatus =()=>{
  //   Message.setCurrentConversationId(Message.messageInfo.conversation_id);
  //   Message.setCurrentUserId(Message.messageInfo.user_id);
  //   Message.setSelectedId(Message?.messageInfo.id);
  //   Message.setCurrentSourceId(Message.messageInfo.source_id);
  //   const content = [
  //           {
  //             text: {
  //               content: "Conversation was marked resolved by User",
  //             },
  //           },
  //         ];
  //   if(Message?.messageInfo?.conversation_status === 'resolved') Message.setUpdateMessage({ status:"reopened"});
  //   else Message.setUpdateMessage({ contentData:content, status:"resolved"});
  // };

  // useEffect(()=>{
  //   if(messageArr.length > 0){
  //     setTimeout(() => {
  //       // textAreaRef.current.editor.loadHTML('');
  //       console.log(autoScrollArea.current);
  //       // autoScrollArea.current.scrollIntoView({ behavior: 'smooth' });
  //       // autoScrollArea.current.scrollTop = autoScrollArea.current.scrollHeight;

  //       autoScrollArea.current.scrollTo({
  //         top: autoScrollArea.current.scrollTop + 5,
  //         behavior: 'smooth'
  //       });
  //     }, 200);
  //   }
  // },[messageArr]);

  useEffect(() => {
    // if(messageArr.length > 0){
    const interval = setInterval(() => {
      const scrollSpeed = 30;
      const { scrollTop, scrollHeight, clientHeight } = autoScrollArea.current;
      const scrolled = scrollTop + scrollSpeed;
      if (scrolled < scrollHeight - clientHeight) {
        autoScrollArea.current.scrollTop = scrolled;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [messageArr]);

  const Onbrowse = () => {
    fileref.current.click();
  };

  return (
    <div className={css.conversationContainer}>
      <input
        ref={fileref}
        type="file"
        name="file"
        accept="image/*,.pdf"
        onChange={HanldeFileUpload}
        hidden
        multiple={false}
      />
      <div className={css.topConversation}>
        {/* {Message.device === 'mobile' && (
          <div className={css.markDiv} onClick={()=>{setStatus();}}>
            <ErrorOutlineIcon />
            <p className={css.markP}>{Message?.messageInfo?.conversation_status === 'resolved' ? "Reopen Issue" : "Mark as Resolved"}</p>
          </div>
        )} */}
        <div className={css.conversationInfoContainer}>
          {/* {Message.device === 'mobile' && (
            <ArrowBackIosOutlinedIcon
              onClick={() => {
                Message.setChatBox(false);
                Message.setSelectedTab(Message.selectedTab);
                Message.setStartApiCall(false);
              }}
              // className={(!desktopView && css.icon) || css.icon2}
            />
          )} */}
          <div className={css.avatar}>
            <img
              alt="avatar"
              src={
                Message?.SuperaccountantInfo?.avatar?.url || DPSuperAccountant
              }
            />
          </div>
          <div className={css.info}>
            <p className={css.name}>
              {Message &&
              Message.SuperaccountantInfo &&
              Message.SuperaccountantInfo.first_name
                ? `${Message.SuperaccountantInfo.first_name} ${Message.SuperaccountantInfo.last_name}`
                : ''}
            </p>
            <p className={css.email}>
              {Message &&
              Message.SuperaccountantInfo &&
              Message.SuperaccountantInfo.email
                ? Message.SuperaccountantInfo.email
                : ''}
            </p>
          </div>
        </div>
      </div>
      <div
        className={
          Message.device === 'mobile'
            ? css.messageContainerMobile
            : css.messageContainerDesktop
        }
      >
        <div ref={autoScrollArea} className={css.messages}>
          {messageArr.length !== 0 &&
            messageArr.map((msgmain) => {
              // return msgmain?.map((msg) => {
              messageCounter += 1;
              if(msgmain?.message_type?.toLowerCase() === 'system'){
                return( 
                <div
          className={css.systemMsg}
          dangerouslySetInnerHTML={{ __html: msgmain.message_parts[0].text?.content }}
        />);
              };
              if (msgmain?.actor_type?.toLowerCase() === 'user') {
                return (
                  <RightMessage
                    key={`r_${messageCounter}`}
                    messageData={msgmain.message_parts[0]}
                  />
                );
              }

              // if (msgmain.actor_type.toLowerCase() === 'agent') {
              return (
                <LeftMessage
                  key={`l_${messageCounter}`}
                  messageData={msgmain.message_parts[0]}
                  avatar={
                    Message?.SuperaccountantInfo?.avatar?.url ||
                    DPSuperAccountant
                  }
                  makeRequestCall={Message.makeRequestCall}
                />
              );
              // };
              // });
            })}
        </div>
        {Message?.device === 'mobile' ? (
          <div className={css.inputBoxContainerMobile}>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AttachFileIcon
                      sx={{ marginRight: 2, transform: 'rotate(45deg)' }}
                    />
                    <SendIcon
                      sx={{ color: '#00A676' }}
                      onClick={(e) => {
                        if (messageMob.trim()) {
                          // textAreaRef.current.
                          // EnteredMessageTxt = messageMob;
                          sendMessages(e);
                          // setMessageMob('');
                        }
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter your issue or response here"
              onChange={handleChangeMobile}
              value={messageMob}
            />
          </div>
        ) : (
          // <div onClick={() => tcurrent()} className={css.inputBoxContainer}>
          //   <div className={css.inputBox}>
          //     <TrixEditor
          //       onChange={handleChange}
          //       ref={textAreaRef}
          //       onEditorReady={handleEditorReady}
          //     />
          //   </div>
          //   <div className={css.markAndSend}>
          //     {/* <div className={css.markDiv} onClick={()=>{setStatus();}}>
          //       <ErrorOutlineIcon />
          //       <p className={css.markP}>{Message?.messageInfo?.conversation_status === 'resolved' ? "Reopen Issue" : "Mark as Resolved"}</p>
          //     </div> */}
          //     <button
          //       type="button"
          //       className={`${css.sendBtn}`}
          //       onClick={sendMessages}
          //       disabled={disableBtn}
          //     >
          //       Send
          //     </button>
          //   </div>
          // </div>
          <div className={css.SupportTextField}>
          <TextField
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AttachFileIcon
                      sx={{ marginRight: 2, transform: 'rotate(45deg)',cursor:'pointer' }}
                      onClick={Onbrowse}
                    />
                    <SendIcon
                      sx={{ color: '#00A676' ,cursor:'pointer'}}
                      onClick={(e) => {
                        if (messageMob.trim()) {
                          // EnteredMessageTxt = messageMob;
                          sendMessages(e);
                          // setMessageMob('');
                        }
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter your issue or response here"
              onChange={handleChangeMobile}
              value={messageMob}
            />
            </div>
        )}
      </div>
      <div className={css.queries}>
          For further queries, please reach out to us at: <br />
          <span>support@goeffortless.co</span>
      </div>
    </div>
  );
};

export default Messages;