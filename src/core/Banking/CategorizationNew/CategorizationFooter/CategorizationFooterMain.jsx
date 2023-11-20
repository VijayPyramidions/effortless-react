import React from 'react';
import { Box } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import { customCurrency } from '@components/formattedValue/FormattedValue';
import moment from 'moment';
import DoneIcon from '@mui/icons-material/Done';
import * as css from './CategorizationFooterMain.scss';

const CategorizationFooterMain = ({
  selectedTransaction,
  status,
  CategorizeNow,
  setTransactionStatus,
  CategorizationState,
  stateData,
}) => {
  const device = localStorage.getItem('device_detect');

  // const navigate = useNavigate();

  return (
    <>
      {device === 'desktop' ? (
        <div className={css.categorizationFooter}>
          <div className={css.narrationDataContainer}>
            <Box component="div">
              <span className={css.label}>Narration</span>
              <div className={css.narrationData}>
                <div className={css.displayData}>
                  {selectedTransaction?.narration}
                </div>
              </div>
            </Box>
          </div>

          <div className={css.dateDataContainer}>
            <Box
              component="div"
              sx={{
                width: '10vw',
              }}
            >
              <span className={css.label}>Date</span>
              <div className={css.dateData}>
                <div className={css.displayData}>
                  {moment.utc(selectedTransaction?.date).format('DD MMM YYYY')}
                </div>
              </div>
            </Box>
          </div>

          <div className={css.transactionTypeContainer}>
            <Box component="div">
              <span className={css.label}>Type</span>
              <div className={css.transactionTypeData}>
                <div className={css.displayData}>
                  {Number(selectedTransaction?.amount) > 0 ? (
                    <span style={{ color: '#2F9682' }}>Inflow</span>
                  ) : (
                    <span style={{ color: '#F08B32' }}>Outflow</span>
                  )}
                </div>
              </div>
            </Box>
          </div>
          <div className={css.categorizeBtnContainer}>
            {status === 'Edit' ? (
              <div
                className={css.categorizedFlow}
                style={
                  stateData?.selecteddata?.uneditable
                    ? {
                        pointerEvents: 'none',
                        width: '220px',
                      }
                    : {}
                }
              >
                <button className={css.categorizeBtn} type="button">
                  Categorized
                </button>
                {!stateData?.selecteddata?.uneditable && (
                  <button
                    className={css.editBtn}
                    type="button"
                    onClick={() => setTransactionStatus('Add')}
                  >
                    Edit
                  </button>
                )}
              </div>
            ) : (
              <div className={css.unCategorizedFlow}>
                <button
                  className={css.categorizeBtn}
                  type="button"
                  onClick={CategorizeNow}
                >
                  Categorize Now
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        (CategorizationState?.purposeState?.name === 'Expense' && <></>) || (
          <>
            <div className={css.categorizationFooterMobile}>
              {status === 'Edit' ? (
                <div
                  className={css.categorizedFlow}
                  style={
                    stateData?.selecteddata?.uneditable
                      ? {
                          pointerEvents: 'none',
                        }
                      : {}
                  }
                >
                  <div className={css.section1}>
                    <p className={css.section1amounttag}>
                      {customCurrency('INR', 'en-US').format(
                        Math.abs(Number(selectedTransaction?.amount || 0))
                      )}
                    </p>
                    <p className={css.section1descriptiontag}>
                      <DoneIcon style={{ fontSize: '16px' }} /> Categorized
                    </p>
                  </div>
                  {!stateData?.selecteddata?.uneditable && (
                    <div className={css.section2}>
                      <button
                        className={css.categorizeBtn}
                        type="button"
                        onClick={() => setTransactionStatus('Add')}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={css.unCategorizedFlow}>
                  <div className={css.section1}>
                    <p className={css.section1amounttag}>
                      {CategorizationState?.purposeState?.name ===
                      'Against Bills'
                        ? customCurrency('INR', 'en-US').format(
                            Number(
                              CategorizationState?.selectedBill?.selectedRowsWithBalance?.reduce(
                                (total, item) => total + Number(item.amount),
                                0
                              )
                            ) +
                              Number(
                                CategorizationState?.advanceData?.paid || 0
                              ) || 0
                          )
                        : customCurrency('INR', 'en-US').format(
                            Math.abs(Number(selectedTransaction?.amount || 0))
                          )}
                    </p>
                    <p className={css.section1descriptiontag}>Allocated</p>
                  </div>

                  <div className={css.section2}>
                    <button
                      className={css.categorizeBtn}
                      type="button"
                      onClick={CategorizeNow}
                    >
                      Categorize Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )
      )}
    </>
  );
};

export default CategorizationFooterMain;
