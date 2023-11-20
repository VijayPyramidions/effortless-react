import React from 'react';
// import AppContext from '@root/AppContext.jsx';
// import RestApi, { METHOD } from '@services/RestApi.jsx';
// import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { Box, Chip } from '@mui/material';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { CommonDrawer } from '@core/Banking/AccountBalance/CommonDrawer';
import { typesettings } from '@core/Banking/CategorizationNew/TransactionTypeSettings';
import downArrow from '@assets/downArrow.svg';
import * as css from './CategorizationHeader.scss';

const PurposeSelection = ({
  purposeBottomSheet,
  setPurposeBottomSheet,
  selectedPartyData,
  purposeDetails,
  transactionType,
  selectedTowardsData,
  setSelectedtowardsData,
  contraBanks,
  status,
  stateData,
}) => {
  const device = localStorage.getItem('device_detect');
  // const { organization, user, enableLoading, openSnackBar } = React.useContext(AppContext);
  const cButtonArray = [
    'Customer',
    'Vendor',
    'Employee',
    'Lender',
    'Promoter',
    'Government',
    'Other Banks',
  ];
  const taxidentification = [
    { name: 'Goods and Services Tax (GST)', tag: 'gst' },
    { name: 'Tax Deducted at source (TDS)', tag: 'tds' },
  ];

  return (
    <>
      {device === 'desktop' && (
        <div
          className={
            status === 'Edit' || selectedPartyData?.name === 'Salary Payable' || selectedPartyData?.name === 'Do Not Track Vendor'
              ? `${css.purposeSelectionContainer} ${css.disable}`
              : css.purposeSelectionContainer
          }
          onClick={() => {
            if (selectedPartyData?.type) {
              setPurposeBottomSheet(true);
            }
          }}
        >
          <Box component="div">
            <div className={css.downArrow}>
              <p className={css.label}>Purpose</p>
              <img src={downArrow} alt="arrow" />
            </div>
            <div className={css.purposeData}>
              <div className={css.partyName}>
                {selectedTowardsData?.name || 'Click to select'}
              </div>
            </div>
          </Box>
        </div>
      )}
      {device === 'mobile' && (
        <div
          className={
            status === 'Edit' || selectedPartyData?.name === 'Salary Payable' || selectedPartyData?.name === 'Do Not Track Vendor'
              ? `${css.purposeSelectionContainerMobile} ${css.disable}`
              : css.purposeSelectionContainerMobile
          }
        >
          <p className={css.label}>Purpose</p>

          <Chip
            label={selectedTowardsData?.name || 'Click to select'}
            variant="outlined"
            onClick={() => {
              if (selectedPartyData?.type) {
                setPurposeBottomSheet(true);
              }
            }}
            onDelete={() => {
              if (selectedPartyData?.type) {
                setPurposeBottomSheet(true);
              }
            }}
            deleteIcon={<img src={downArrow} alt="arrow" />}
            className={css.selectionchip}
          />
        </div>
      )}
      <SelectBottomSheet
        name="Party"
        addNewSheet
        open={purposeBottomSheet}
        onClose={() => setPurposeBottomSheet(false)}
        maxHeight="45vh"
        triggerComponent={<></>}
      >
        <CommonDrawer
          state="CUSTOM POPUPS PURPOSE"
          handleClick={(toward) => {
            if (toward?.name) {
              setSelectedtowardsData(toward);
              setPurposeBottomSheet(false);
            }
          }}
          //  purposeDetails={purposeDetails}
          selectedOption={selectedTowardsData?.etype || selectedPartyData?.type}
          party={selectedPartyData}
          transactiontype={transactionType}
          purposename={selectedTowardsData?.name}
          basetowardsdata={purposeDetails?.data}
          buttonarray={cButtonArray}
          //  buttoncolors = {ButtonBackColor}
          contrabanks={contraBanks}
          defaultTransactionType={transactionType}
          taxidentification={taxidentification}
          typesettings={typesettings}
          stateData={stateData}
          locationName={selectedTowardsData?.gstin || ''}
        />
      </SelectBottomSheet>
    </>
  );
};
export default PurposeSelection;
