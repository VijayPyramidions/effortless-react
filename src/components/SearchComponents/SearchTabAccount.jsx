import React from 'react';
import * as css from './searchComponents.scss';

const SearchTabPayment = ({ Data }) => {
  return (
    <div className={css.searchTabDetails}>
      <div className={css.header}>
        <p className={css.headerText}>Account</p>
        <p className={css.viewText}>View All</p>
      </div>

      {Data?.map((element, index) => (
        <div className={css.bodyContInvoice}>
          <div className={css.eachCont}>
            <div className={css.topTextCont}>
              <div className={css.topfirstTextCont}>
                <span>{index + 1}.</span>
                <p className={css.topId}>{element?.name}</p>
              </div>
              <p className={css.topAmonut}>₹50,000</p>
            </div>
            <div className={css.bottomTextCont}>
              <p className={css.bottomDate}>20/03/2023</p>
              <p className={css.bottomInfo}>
                {element?.content}
                {/* Estimate <span style={{fontWeight: 200}}>Created by</span> Siva Balan */}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchTabPayment;
