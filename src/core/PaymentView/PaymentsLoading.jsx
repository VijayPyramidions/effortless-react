/* eslint-disable no-else-return */
/* eslint-disable consistent-return */

import React, { useState } from 'react';

import { Grid, Button, Skeleton } from '@mui/material';

import * as css from './Payments.scss';

const PaymentsLoading = () => {
  const [paymentProcessed] = useState(false);
  const [paymentFailed] = useState(false);

  return (
    <div className={`${css.dashboardBodyContainer} ${css.anime}`}>
      <div className={css.advancePaymentContainer}>
        <div>
          {paymentProcessed && (
            <div className={`${css.paymentProcessed} ${css.paymentInfo}`}>
              <div className={css.cardBody}>
                <p className={css.cardTitle}>Payment is Underway</p>
                <p className={css.cardSubTitle}>
                  Payment to 3 Parties is being processed
                </p>
              </div>
              <div className={css.cardAction}>
                <Button size="large" className={css.submitButton}>
                  Track
                </Button>
              </div>
            </div>
          )}
          {paymentFailed && (
            <div className={`${css.paymentFailed} ${css.paymentInfo}`}>
              <div className={css.cardBody}>
                <p className={css.cardTitle}>Attention Required</p>
                <p className={css.cardSubTitle}>
                  Payment to 3 Parties has failed
                </p>
              </div>
              <div className={css.cardAction}>
                <Button size="large" className={css.submitButton}>
                  Retry
                </Button>
              </div>
            </div>
          )}
          <div className={css.overdueContainer}>
            <div className={css.overdueCard}>
              <div className={css.overdueCardMain}>
                <div className={css.overdueBody}>
                  <p className={css.overdueTitle}>
                    <Skeleton animation="wave" />
                  </p>
                  <p className={css.overdueContent}>
                    <Skeleton animation="wave" width={130} />
                    <br />
                    <span>
                      <Skeleton animation="wave" />
                    </span>
                  </p>
                </div>
                <div className={css.overdueAction} style={{ marginLeft: 12 }}>
                  <Skeleton
                    animation="wave"
                    height="28px"
                    width="57px"
                    style={{ borderRadius: 20, padding: '9px 12px' }}
                  />
                </div>
              </div>
            </div>

            <div className={css.overdueCard}>
              <div className={css.overdueCardMain}>
                <div className={css.overdueBody}>
                  <p className={css.overdueTitle}>
                    <Skeleton animation="wave" />
                  </p>
                  <p className={css.overdueContent}>
                    <Skeleton animation="wave" width={130} />

                    <br />
                    <span>
                      <Skeleton animation="wave" />
                    </span>
                  </p>
                </div>
                <div className={css.overdueAction}>
                  <Skeleton
                    animation="wave"
                    height="28px"
                    width="57px"
                    style={{ borderRadius: 20, padding: '9px 12px' }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={css.mainContainer}>
            <p className={css.title}>
              <Skeleton animation="wave" width={300} />
            </p>
            <div className={css.contentBody}>
              <Grid container spacing={2} direction="row">
                <Grid item xs={4} className={css.item}>
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    className={css.icon}
                  />
                  <p>
                    <Skeleton animation="wave" width={60} />
                  </p>
                </Grid>
                <Grid item xs={4} className={css.item}>
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    className={css.icon}
                  />
                  <p>
                    <Skeleton animation="wave" width={60} />
                  </p>
                </Grid>
                <Grid item xs={4} className={css.item}>
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    className={css.icon}
                  />
                  <p>
                    <Skeleton animation="wave" width={60} />
                  </p>
                </Grid>
              </Grid>
            </div>
          </div>
          <p className={css.sectionTitle}>
            <Skeleton animation="wave" width={300} />
          </p>
          <div className={css.vendorContainer}>
            {[1, 2, 3].map((item) => {
              return (
                <div className={css.vendorCard} key={item}>
                  <div className={css.vendorCardBody}>
                    <p>
                      <Skeleton
                        animation="wave"
                        width={230}
                        height={18}
                        style={{
                          marginTop: '8px',
                        }}
                      />
                    </p>
                    <span>
                      <Skeleton
                        animation="wave"
                        width={180}
                        height={18}
                        style={{ marginBottom: '8px' }}
                      />
                    </span>
                  </div>
                  <div className={css.vendorCardAction}>
                    <Skeleton
                      animation="wave"
                      width={70}
                      height={38}
                      style={{ borderRadius: '18px' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className={css.sectionTitle}>
            <Skeleton animation="wave" width={300} height={18} />
          </p>
          <div className={css.otherActivities}>
            <Skeleton
              animation="wave"
              width={100}
              height={216}
              style={{
                backgroundColor: '#f08b32',
                borderRadius: '7px',
                padding: '10px 7px',
                top: '-52px',
              }}
            />
            <Skeleton
              animation="wave"
              width={100}
              height={216}
              style={{
                backgroundColor: '#f08b32',
                borderRadius: '7px',
                padding: '10px 7px',
                top: '-52px',
              }}
            />
            <Skeleton
              animation="wave"
              width={100}
              height={216}
              style={{
                backgroundColor: '#f08b32',
                borderRadius: '7px',
                padding: '10px 7px',
                top: '-52px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentsLoading;
