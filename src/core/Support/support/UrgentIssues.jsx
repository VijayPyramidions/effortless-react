import React from 'react';
import * as css from '../Support.scss';

const UrgentIssues = () => {
  return (
    <div
      className={css.urgentIssuesContainer}
      // onClick={async () => {
      //   // await createUserInFreshchat();
      //   // setTimeout(() => {
      //   //   FindFreshchatUsers();
      //   // }, 3000);
      // }}
    >
      <div className={css.exclamation}>+</div>
      <div className={css.urgentIssuesContent}>
        <p className={css.title}>Raise a New Issue</p>
        <p>
          Solve burning issues with the support of your Effortless Super
          Accountant
        </p>
      </div>
      <div className={css.proceed}>{`>`}</div>
    </div>
  );
};

export default UrgentIssues;