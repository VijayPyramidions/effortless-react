import React from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import * as css from '../Support.scss';

const ChatWith = (chatname) => {
  const { chatwithclick } = chatname;

  const updateStatus = async () => {
    // await createUserInFreshchat();
    // setTimeout(() => {
    //   FindFreshchatUsers();
    // }, 3000);
    setTimeout(() => {
      chatwithclick({ status: 'clicked' });
    }, 1000);
  };

  return (
    <div className={css.chatWithManoMobileContainer}>
      <p>
        Raise a New Issue <br /> Solve burning issues with the support of your
        Effortless Super Accountant
      </p>
      <div>
        <ArrowForwardIcon onClick={updateStatus} />
      </div>
    </div>
  );
};

export default ChatWith;