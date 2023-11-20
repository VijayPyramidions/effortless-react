import React, { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import * as css from '../Support.scss';

const RightMessage = ({ messageData }) => {
  const { user, currentUserInfo } = useContext(AppContext);

  function downloadFile(data) {
    //     const binaryData = [];
    // binaryData.push(data?.url);

    // const url = window.URL.createObjectURL(new Blob(data?.url, {type: data.content_type}));
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `${data?.name}`;
    //     document.body.appendChild(a);
    //     a.click();
    //     a.remove();

    // fetch(
    //   `${data?.url}`,
    //   {
    //     method: 'GET',
    //     // mode: 'no-cors',
    //     // headers: {
    //     //   'Content-Type': data.content_type
    //     // },
    //   },
    // )
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `${data?.name}`;
    //     document.body.appendChild(a);
    //     a.click();
    //     a.remove();
    //     // setFileFormat('');
    //     // setdownloadPeriod('');
    //     // setcustomDate('');
    //   });

    // makeRequestCall("fileDownload",data?.url,"get");

    RestApi(`download`, {
      method: METHOD.POST,
      payload: {
        url: data?.url,
        content_type: data?.content_type,
        filename: data?.name,
        disposition: 'inline',
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      console.log(res, 'direct');
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data?.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }
  return (
    <div className={css.messageBodyContainerRight}>
      {messageData?.text && (
        <div
          className={css.messageBody}
          dangerouslySetInnerHTML={{ __html: messageData?.text?.content }}
        />
      )}
      {messageData?.file && (
        <div
          className={css.messageBody}
          onClick={() => {
            downloadFile(messageData?.file);
          }}
        >
          Download file
        </div>
      )}

      {messageData?.image && (
        <div className={css.messageBody}>
          <img
            src={messageData?.image?.url}
            style={{
              width: '250px',
              heiaspectRatio: '3/2',
              objectFit: 'contain',
            }}
            alt="img"
          />
        </div>
      )}
      {currentUserInfo && (
        <Avatar
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUserInfo?.name}&chars=2`}
          sx={{ width: 28, height: 28 }}
        />
      )}
    </div>
  );
};

export default RightMessage;
