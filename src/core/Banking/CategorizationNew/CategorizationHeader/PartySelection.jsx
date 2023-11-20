import React from 'react';
import { Box, Chip } from '@mui/material';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { CommonDrawer } from '@core/Banking/AccountBalance/CommonDrawer';
import downArrow from '@assets/downArrow.svg';
import * as css from './CategorizationHeader.scss';

const PartySelection = ({
  partyBottomSheet,
  setPartyBottomSheet,
  selectedPartyData,
  setSelectedPartyData,
  transactionType,
  status,
  contraBanks,
  stateData,
  setCategorizationTablesState,
}) => {
  const device = localStorage.getItem('device_detect');

  const ButtonArray = [
    'All Parties',
    'Customer',
    'Vendor',
    'Employee',
    'Lender',
    'Promoter',
    'Government',
    'Other Banks',
  ];
  return (
    <>
      {device === 'desktop' && (
        <div
          className={
            status === 'Edit'
              ? `${css.partySelectionContainer} ${css.disable}`
              : css.partySelectionContainer
          }
          onClick={() => {
            setPartyBottomSheet(true);
          }}
        >
          <Box component="div">
            <div className={css.downArrow}>
              <p className={css.label}>Party</p>
              <img src={downArrow} alt="arrow" />
            </div>
            <div className={css.partyData}>
              <div className={css.partyName}>
                {selectedPartyData?.name || 'Click to select'}
              </div>
            </div>
          </Box>
        </div>
      )}
      {device === 'mobile' && (
        <div
          className={
            status === 'Edit'
              ? `${css.partySelectionContainerMobile} ${css.disable}`
              : css.partySelectionContainerMobile
          }
        >
          <p className={css.label}>Party</p>

          <Chip
            label={selectedPartyData?.name || 'Click to select'}
            variant="outlined"
            onClick={() => setPartyBottomSheet(true)}
            onDelete={() => setPartyBottomSheet(true)}
            deleteIcon={<img src={downArrow} alt="arrow" />}
            className={css.selectionchip}
          />
        </div>
      )}
      <SelectBottomSheet
        name="Party"
        addNewSheet
        open={partyBottomSheet}
        onClose={() => setPartyBottomSheet(false)}
        // maxHeight="45vh"
        triggerComponent={<></>}
      >
        <CommonDrawer
          state="CUSTOM POPUPS"
          handleClick={(event) => {
            setCategorizationTablesState([]);
            setSelectedPartyData(event);
            if (event?.id === 'OTHER BANKS') {
              setPartyBottomSheet(false);
            }
          }}
          setBottomSheetNumber={setPartyBottomSheet}
          //  trigger
          //  purposeDetails={purposeDetails}
          //  selectedOption
          //  selectedId
          //  party
          transactiontype={transactionType}
          //  purposename = {undefined}
          basetowardsdata={selectedPartyData}
          buttonarray={ButtonArray}
          //  buttoncolors = {ButtonBackColor}
           contrabanks = {contraBanks}
           stateData={stateData}
          //  taxidentification = {taxidentification}
        />
      </SelectBottomSheet>
    </>
  );
};
export default PartySelection;
