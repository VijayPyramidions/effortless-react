import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Check from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';
import CategorizationPrevItem from '@assets/categorizationprevitem';
import CategorizationNextItem from '@assets/categorizationnextitem';
import CategorizationPrevItemDisabled from '@assets/categorizationprevitemdisabled';
import CategorizationNextItemDisabled from '@assets/categorizationnextitemdisabled';
import amountindicatoriconreceipt_mobile from '@assets/categorizationamountup_mobile.svg';
import amountindicatoriconpayment_mobile from '@assets/categorizationamountdown_mobile.svg';
import amountindicatoriconreceipt_desktop from '@assets/categorizationamountup_desktop.svg';
import amountindicatoriconpayment_desktop from '@assets/categorizationamountdown_desktop.svg';
import NumberFormat from '../NumberFormat';
import AlertDialog from '../ConfirmationDialog';
import {
  confirmcleardata,
  catcheck,
} from './BankCategorization_Navigation_Data_Utilities';

import * as css from '../categorization.scss';
import '../MuiAddonStyles.css';

export const CategorizationTemplate = (props) => {
  const {
    hitTop,
    hitBottom,
    mainElementCategorize,
    getlocation,
    currentposition,
    dispType,
    classforpercentage,
    Template1,
    Template2,
    Template3,
    Template4,
    Template5,
    Template6,
    selectedPurposeName,
    categorizeData,
    selectedTowardsName,
    closebutton,
    pickerType,
    Transition,
    opModal,
    alertdisplaymessage,
    alertwarning,
    buttontext1,
    buttontext2,
    AlertOpen,
    pagination,
    template,
    button1,
    button2,
    temppos,
    GridHeight,
    paidTo,
    noTransactionElementOverall,
    NarrationElement,
    taxamountexcluded,
    categorizationDone,
    revisedDocumentType,
    selectDescription,
    totalallocated,
    totalallocatedbills,
    totalallocatedtext,
    initthis,
    buttonInProcess,
    mobilecategorizebutton,
    updatecategorized,
    updatechangedTDSvalues,
    updateeditableTDSvalues,
    updateMainTransactionType,
    updateselectedPurposeName,
    updatepurposeDetails,
    updatepaidto,
    updateucheckedids,
    updatetotalarr,
    updatepaidTo,
    updateselectedIncomeCategoryName,
    updateTemplate,
    updateupdatebasedata,
    updatetotalallocated,
    updatetotalallocatedbills,
    updatetotalallocatedtext,
    updatecategorizeData,
    updateNarration,
    updateResetNarration,
    updatebuttonInProcess,
    updateclassforpercentage,
    updatefileuploaded,
    updateeditableAdjustmentvalues,
    nextData,
    prevData,
    updatechangedTransactions,
    updatemnTransactionType,
    mnTransactionType,
    updateselectedTowardsName,
    updatebasedata,
    resetnarration,
    updatecatMoveStatus,
    updatemainclear,
    settotalallocated,
    settotalallocatedbills,
    settotalallocatedtext,
    setcategorizeData,
    mainclear,
    anothercategorization,
    updateAlertOpen,
    updateopModal,
    updatemodifycount,
    paidto,
    updateupdateCheckSelections,
    specialTotal,
    isrefund,
    TDS,
    setNarration,
    catMoveStatus,
    getchangedTransactions,
    recalculate,
    getchangedTDSvalues,
    geteditableTDSvalues,
    hidetds,
    updateRecalculate,
    editedresponse,
    ucheckedids,
    considerAmountField,
  } = props;
  return (
    <div id="main" className={css.CategorizationContainer}>
      {pickerType === 'desktop' ? (
        <div className={css.CategorizationWrapper} ref={mainElementCategorize}>
          <div className={css.CategorizeCardMove} id="CategorizeMoveButtons">
            <Grid container spacing={1}>
              <Grid item xs={6} sm={6} id="Categorizationgridbuttons">
                <Box
                  component="div"
                  tpos={temppos}
                  className={css.CategorizationPreviousBox}
                  onClick={(event) =>{
                    if(hitTop){
                    catcheck(
                      event,
                      1,
                      getchangedTransactions,
                      updatepaidTo,
                      updateselectedTowardsName,
                      updateselectedIncomeCategoryName,
                      updateselectedPurposeName,
                      updateTemplate,
                      updatechangedTransactions,
                      updatecatMoveStatus,
                      updateupdatebasedata,
                      selectDescription,
                      updatepaidto,
                      updatetotalarr,
                      updatebasedata,
                      updateNarration,
                      updatetotalallocated,
                      updatetotalallocatedbills,
                      updatetotalallocatedtext,
                      prevData,
                      updatemainclear,
                      updatecategorizeData,
                      setNarration,
                      settotalallocated,
                      settotalallocatedbills,
                      settotalallocatedtext,
                      setcategorizeData,
                      nextData
                    );
                  }
                }
                  }
                >
                  {hitTop ? (
                    <div className={css.iconadjust1}>
                      <CategorizationPrevItem />
                    </div>
                  ) : (
                    <div className={css.iconadjust1}>
                      <CategorizationPrevItemDisabled />
                    </div>
                  )}
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} id="Categorizationgridbuttons">
                <Box
                  component="div"
                  tpos={temppos}
                  className={css.CategorizationNextBox}
                  onClick={(event) =>{
                    if(hitBottom){
                    catcheck(
                      event,
                      2,
                      getchangedTransactions,
                      updatepaidTo,
                      updateselectedTowardsName,
                      updateselectedIncomeCategoryName,
                      updateselectedPurposeName,
                      updateTemplate,
                      updatechangedTransactions,
                      updatecatMoveStatus,
                      updateupdatebasedata,
                      selectDescription,
                      updatepaidto,
                      updatetotalarr,
                      updatebasedata,
                      updateNarration,
                      updatetotalallocated,
                      updatetotalallocatedbills,
                      updatetotalallocatedtext,
                      prevData,
                      updatemainclear,
                      updatecategorizeData,
                      setNarration,
                      settotalallocated,
                      settotalallocatedbills,
                      settotalallocatedtext,
                      setcategorizeData,
                      nextData
                    );
                    }
                  }
                  }
                >
                  {hitBottom ? (
                    <div className={css.iconadjust2}>
                      <CategorizationNextItem />
                    </div>
                  ) : (
                    <div className={css.iconadjust2}>
                      <CategorizationNextItemDisabled />
                    </div>
                  )}
                </Box>
              </Grid>
            </Grid>
          </div>
          <Grid id="toppart" container spacing={3}>
            <Grid
              item
              style={{ marginTop: '7px' }}
              xs={6}
              sm={2}
              id="Categorizationgrid"
            >
              <Box
                component="div"
                className={[
                  css.CategorizationBankboxHolderBank,
                  css.noborder,
                ].join('')}
              >
                <div className={css.bankTitle}>
                  {getlocation().state.bankname}
                </div>
                <div className={css.bankAccount}>
                  {getlocation().state.bankaccount}
                </div>
              </Box>
            </Grid>
            <Grid item xs={2.5} sm={2.5} id="Categorizationgrid">
              <Box
                component="div"
                className={css.CategorizationBankboxHolderTransactionAmount}
              >
                <div className={css.bankTrasactionAmountTitle}>Amount</div>
                <div className={css.bankTransactionAmountHolder}>
                  <div className={css.bankTransactionIndicatorHolder}>
                    {getlocation().state.alldata.data[
                      `${
                        typeof currentposition === 'undefined'
                          ? getlocation().state.row
                          : currentposition
                      }`
                    ]?.amount < 0 ? (
                      <div className={css.bankTransactionAmountUpIcon}>
                        <img
                          alt="Inflow"
                          src={amountindicatoriconreceipt_desktop}
                        />
                      </div>
                    ) : (
                      <div className={css.bankTransactionAmountDownIcon}>
                        <img
                          alt="Outflow"
                          src={amountindicatoriconpayment_desktop}
                        />
                      </div>
                    )}
                  </div>
                  <div className={css.bankTransactionAmount}>
                    {NumberFormat(
                      getlocation().state?.alldata?.data[
                        `${
                          typeof currentposition === 'undefined'
                            ? getlocation().state.row
                            : currentposition
                        }`
                      ]?.formatted_amount
                    )}
                  </div>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3} id="Categorizationgrid">
              {Template1}
            </Grid>
            <Grid item xs={12} sm={3} id="Categorizationgrid">
              {Template2}
            </Grid>
            {selectedPurposeName.toUpperCase() !== 'EXPENSE' ? (
              <Grid
                item
                xs={12}
                sm={1}
                id="Categorizationgrid"
                className={dispType === 'Expense' ? '' : classforpercentage}
              >
                {Template3}
              </Grid>
            ) : (
              <Grid item xs={12} sm={1} id="Categorizationgrid">
                {Template6}
              </Grid>
            )}
          </Grid>
          {selectedPurposeName.toUpperCase() === 'EXPENSE' ? (
            <Grid
              style={{ marginLeft: '.5%', paddingLeft: '10%' }}
              container
              spacing={3}
            >
              <Grid item xs={12} sm={1} id="Categorizationgrid">
                {}
              </Grid>
              <Grid item xs={12} sm={10.5} id="Categorizationgrid">
                {Template4}
              </Grid>
              <Grid item xs={12} sm={0.5} id="Categorizationgrid">
                {}
              </Grid>
            </Grid>
          ) : (
            ''
          )}
          <Box
            id="datagridbox"
            rel="datagridbox"
            sx={{
              height: GridHeight,
              width: '100%',
              marginTop: pickerType === 'mobile' ? '150px' : '0px',
            }}
          >
            {categorizeData &&
            categorizeData.data &&
            categorizeData.data.length === 0 &&
            dispType !== 'Income' &&
            dispType !== 'Expenses' &&
            !NarrationElement ? (
              <div>
                {selectedTowardsName &&
                  selectedTowardsName.name &&
                  selectedTowardsName.name.length > 0 &&
                  selectedTowardsName.id !== 'categorizationInitial' &&
                  paidTo &&
                  paidTo.name &&
                  paidTo.name.length > 0 &&
                  paidTo.id !== 'categorizationInitial' &&
                  noTransactionElementOverall}
              </div>
            ) : (
              <div
                className={
                  selectedTowardsName.name === 'Expenses' || NarrationElement
                    ? css.gridElementExpense
                    : css.gridElement
                }
              >
                {pagination
                  ? template.desktoppagination
                  : template.desktopnopagination}
              </div>
            )}
          </Box>
          {dispType === 'Expenses' ? button2 : button1}

          {AlertOpen ? (
            <AlertDialog
              keepMounted
              closebutton={closebutton}
              ptype={pickerType}
              TransitionComponent={Transition}
              initopen={opModal}
              handleClick={(response) =>
                confirmcleardata(
                  response,
                  mainElementCategorize,
                  updatemodifycount,
                  updatecategorizeData,
                  paidto,
                  pickerType,
                  taxamountexcluded,
                  updatetotalallocated,
                  updatetotalallocatedbills,
                  updatetotalallocatedtext,
                  updateucheckedids,
                  updatechangedTransactions,
                  updateupdateCheckSelections,
                  prevData,
                  nextData,
                  categorizeData,
                  specialTotal,
                  isrefund,
                  TDS,
                  updatepaidTo,
                  updateselectedTowardsName,
                  updateselectedIncomeCategoryName,
                  updateselectedPurposeName,
                  updateTemplate,
                  updatecatMoveStatus,
                  updateupdatebasedata,
                  selectDescription,
                  updatepaidto,
                  updatetotalarr,
                  updatebasedata,
                  updateNarration,
                  updatemainclear,
                  setNarration,
                  settotalallocated,
                  settotalallocatedbills,
                  settotalallocatedtext,
                  setcategorizeData,
                  updatecategorized,
                  getlocation,
                  updatechangedTDSvalues,
                  updateeditableTDSvalues,
                  updateMainTransactionType,
                  updatepurposeDetails,
                  updateResetNarration,
                  updatebuttonInProcess,
                  updateclassforpercentage,
                  updatefileuploaded,
                  updateeditableAdjustmentvalues,
                  updatemnTransactionType,
                  mnTransactionType,
                  resetnarration,
                  updateAlertOpen,
                  updateopModal,
                  mainclear,
                  anothercategorization,
                  catMoveStatus,
                  recalculate,
                  getchangedTDSvalues,
                  geteditableTDSvalues,
                  hidetds,
                  updateRecalculate,
                  revisedDocumentType,
                  getchangedTransactions,
                  editedresponse,
                  considerAmountField,
                  ucheckedids
                )
              }
              name={alertdisplaymessage}
              message={alertwarning}
              buttontext1={buttontext1}
              buttontext2={buttontext2}
              catMoveStatus={catMoveStatus}
            />
          ) : (
            ''
          )}
        </div>
      ) : (
        <div className={css.CategorizationWrapper} ref={mainElementCategorize}>
          <Box style={{ height: '23%', float: 'left' }}>
            <Grid id="toppart" container spacing={3}>
              <Grid
                item
                xs={!taxamountexcluded ? 4.5 : 5.5}
                sm={!taxamountexcluded ? 3 : 4}
                id="Categorizationgrid"
              >
                <Stack sx={{ marginTop: '3px' }}>
                  <Grid
                    xs={12}
                    sm={12}
                    className={css.bankTrasactionAmountTitle}
                  >
                    Amount
                  </Grid>
                  <Grid
                    xs={12}
                    sm={12}
                    className={css.bankTransactionAmountHolder}
                  >
                    <Grid xs={3} sm={12}>
                      <div className={css.bankTransactionIndicatorHolder}>
                        {getlocation().state.alldata.data[
                          `${
                            typeof currentposition === 'undefined'
                              ? getlocation().state.row
                              : currentposition
                          }`
                        ].amount < 0 ? (
                          <div className={css.bankTransactionAmountUpIcon}>
                            <img
                              alt="Inflow"
                              src={amountindicatoriconreceipt_mobile}
                            />
                          </div>
                        ) : (
                          <div className={css.bankTransactionAmountDownIcon}>
                            <img
                              alt="Outflow"
                              src={amountindicatoriconpayment_mobile}
                            />
                          </div>
                        )}
                      </div>
                    </Grid>
                    <Grid
                      xs={9}
                      sm={12}
                      className={css.bankTransactionAmountAmountHolder}
                    >
                      <div className={css.bankTransactionAmount}>
                        {NumberFormat(
                          getlocation().state.alldata.data[
                            `${
                              typeof currentposition === 'undefined'
                                ? getlocation().state.row
                                : currentposition
                            }`
                          ].formatted_amount
                        )}
                      </div>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
              <Grid
                item
                xs={!taxamountexcluded ? 2.5 : 2.5}
                sm={!taxamountexcluded ? 3 : 4}
                id="Categorizationgridbottom"
              >
                {Template5}
              </Grid>
              {!taxamountexcluded ? (
                <Grid
                  item
                  xs={2}
                  sm={1}
                  id="Categorizationgrid"
                  className={dispType === 'Expense' ? '' : classforpercentage}
                >
                  {Template3}
                </Grid>
              ) : (
                ''
              )}
              <Grid
                item
                xs={!taxamountexcluded ? 3 : 4}
                sm={!taxamountexcluded ? 3 : 4}
                id="Categorizationgrid"
              >
                <Stack>
                  <div className={css.bankTitle}>
                    {getlocation().state.bankname &&
                      getlocation().state.bankname.substr(0, 10)}
                  </div>
                  <div className={css.bankAccount}>
                    {getlocation().state.bankaccount
                      ? `XXXX ${getlocation().state.bankaccount.substr(
                          getlocation().state.bankaccount.length - 4
                        )}`
                      : ''}
                  </div>
                </Stack>
              </Grid>
              <Grid
                item
                xs={!taxamountexcluded ? 12 : 12}
                sm={1}
                id="Categorizationgrid"
              >
                {Template4}
              </Grid>
            </Grid>
          </Box>
          <Box
            id="datagridbox"
            className={css.mobiledatagrid}
            sx={{
              border: 'none',
              borderRadius: '0vw',
              height: `${parseFloat(GridHeight) - 160}px`,
              width: '100%',
            }}
          >
            <Grid
              sx={{
                marginTop: '5px',
                paddingTop: '15px',
                paddingRight: '20px',
                paddingLeft: '20px',
              }}
              container
              spacing={3}
            >
              <Grid
                item
                xs={5.7}
                sm={3}
                id="Categorizationgrid"
                rel="party"
                sx={{ marginLeft: '15px' }}
              >
                {Template1}
              </Grid>
              <Grid
                item
                xs={5.7}
                sm={3}
                id="Categorizationgrid"
                rel="purpose"
                sx={{ paddingRight: '15px' }}
              >
                {Template2}
              </Grid>
            </Grid>
            {categorizeData &&
            categorizeData.data &&
            categorizeData.data.length === 0 &&
            dispType !== 'Income' &&
            dispType !== 'Expenses' &&
            !NarrationElement ? (
              <div>
                {selectedTowardsName &&
                  selectedTowardsName.name &&
                  selectedTowardsName.name.length > 0 &&
                  selectedTowardsName.id !== 'categorizationInitial' &&
                  paidTo &&
                  paidTo.name &&
                  paidTo.name.length > 0 &&
                  paidTo.id !== 'categorizationInitial' &&
                  noTransactionElementOverall}
              </div>
            ) : (
              <div
                style={{ paddingRight: '20px', paddingLeft: '23px' }}
                className={
                  selectedTowardsName.name === 'Expenses' || NarrationElement
                    ? css.gridElementExpense
                    : css.gridElement
                }
              >
                {template.mobile}
              </div>
            )}
          </Box>
          <div
            className={
              categorizationDone
                ? css.CategorizeCardMovemobileupdate
                : css.CategorizeCardMovemobile
            }
            id="CategorizeMoveButtons"
          >
            {revisedDocumentType.length > 0 ? (
              <div
                className={
                  (categorizeData &&
                    categorizeData.data &&
                    categorizeData.data.length > 0) ||
                  (selectedTowardsName &&
                    selectedTowardsName.name !== selectDescription) ||
                  (paidTo && paidTo.name !== selectDescription)
                    ? 'allocated'
                    : 'allocatednotrans'
                }
              >
                {totalallocated > 0 &&
                selectedTowardsName &&
                selectedTowardsName.name &&
                selectedTowardsName.name.toUpperCase() !== 'EXPENSE' ? (
                  <Box>
                    {selectedTowardsName &&
                    selectedTowardsName.name &&
                    selectedTowardsName.name.trim().toUpperCase() !==
                      'ADVANCE' ? (
                      <Box>
                        <div
                          id="allocatedbillcount"
                          className="allocatedbillcount"
                        >
                          <Box className={css.allocatedname1}>
                            {totalallocatedbills}
                          </Box>
                        </div>
                        <div id="allocatedname">
                          <Box className={css.allocatedname1}>
                            {totalallocatedtext}
                          </Box>
                        </div>
                        <div id="allocatedtext">
                          {localStorage.getItem('itemstatus') === 'Add' ? (
                            <Box className={css.allocatedtext1}>Allocated</Box>
                          ) : (
                            ''
                          )}
                        </div>
                      </Box>
                    ) : (
                      <Box>
                        <div
                          id="allocatedbillcount"
                          className="allocatedbillcount"
                        >
                          <Box className={css.allocatedname2}>
                            {totalallocatedbills}
                          </Box>
                        </div>
                        <div id="allocatedname">
                          <Box className={css.allocatedname2}>
                            {totalallocatedtext}
                          </Box>
                        </div>
                        <div id="allocatedtext">
                          {localStorage.getItem('itemstatus') === 'Add' ? (
                            <Box className={css.allocatedtext2}>Allocated</Box>
                          ) : (
                            ''
                          )}
                        </div>
                      </Box>
                    )}
                    <Box
                      className={
                        categorizeData &&
                        categorizeData.data &&
                        categorizeData.data.length > 0
                          ? css.categorizedtextanother
                          : css.categorizedtextnotrans
                      }
                    >
                      {localStorage.getItem('itemstatus') === 'Edit' &&
                      initthis ? (
                        <Check />
                      ) : (
                        ''
                      )}
                      <div id="mobileeditcattext">
                        {localStorage.getItem('itemstatus') === 'Edit' &&
                        initthis
                          ? 'Categorized'
                          : ''}
                      </div>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    {selectedTowardsName &&
                    selectedTowardsName.name &&
                    selectedTowardsName.name.trim().toUpperCase() ===
                      'ADVANCE' ? (
                      <Box>
                        <div
                          id="allocatedbillcount"
                          className="allocatedbillcount"
                        >
                          <Box className={css.allocatedname2}>
                            {totalallocatedbills}
                          </Box>
                        </div>
                        <div id="allocatedname">
                          <Box className={css.allocatedname2}>
                            {totalallocatedtext}
                          </Box>
                        </div>
                        <div id="allocatedtext">
                          {localStorage.getItem('itemstatus') === 'Add' ? (
                            <Box className={css.allocatedtext2}>Allocated</Box>
                          ) : (
                            ''
                          )}
                        </div>
                      </Box>
                    ) : (
                      ''
                    )}
                    <Box
                      className={
                        categorizeData &&
                        categorizeData.data &&
                        categorizeData.data.length > 0
                          ? css.categorizedtext
                          : css.categorizedtextnotrans
                      }
                    >
                      {localStorage.getItem('itemstatus') === 'Edit' &&
                      initthis ? (
                        <Check />
                      ) : (
                        ''
                      )}
                      <div id="mobileeditcattext">
                        {localStorage.getItem('itemstatus') === 'Edit' &&
                        initthis
                          ? 'Categorized'
                          : ''}
                      </div>
                    </Box>
                  </Box>
                )}
              </div>
            ) : (
              <Box
                className={
                  categorizeData &&
                  categorizeData.data &&
                  categorizeData.data.length > 0
                    ? css.categorizedtext
                    : css.categorizedtextnotrans
                }
              >
                {localStorage.getItem('itemstatus') === 'Edit' && initthis ? (
                  <Check />
                ) : (
                  ''
                )}
                <div id="mobileeditcattext">
                  {localStorage.getItem('itemstatus') === 'Edit' && initthis
                    ? 'Categorized'
                    : ''}
                </div>
              </Box>
            )}
            <Grid container spacing={1}>
              <Grid item xs={3} sm={3} id="Categorizationgridbuttons_left">
                <Box
                  component="div"
                  className={css.CategorizationPreviousBox}
                  onClick={(event) =>{
                    if(hitTop){
                    catcheck(
                      event,
                      1,
                      getchangedTransactions,
                      updatepaidTo,
                      updateselectedTowardsName,
                      updateselectedIncomeCategoryName,
                      updateselectedPurposeName,
                      updateTemplate,
                      updatechangedTransactions,
                      updatecatMoveStatus,
                      updateupdatebasedata,
                      selectDescription,
                      updatepaidto,
                      updatetotalarr,
                      updatebasedata,
                      updateNarration,
                      updatetotalallocated,
                      updatetotalallocatedbills,
                      updatetotalallocatedtext,
                      prevData,
                      updatemainclear,
                      updatecategorizeData,
                      setNarration,
                      settotalallocated,
                      settotalallocatedbills,
                      settotalallocatedtext,
                      setcategorizeData,
                      nextData
                    );
                    }
                  }
                  }
                >
                  {hitTop ? (
                    <div className={css.iconadjust1}>
                      <CategorizationPrevItem />
                    </div>
                  ) : (
                    <div className={css.iconadjust1}>
                      <CategorizationPrevItemDisabled />
                    </div>
                  )}
                </Box>
              </Grid>
              {selectedPurposeName.toUpperCase() !== 'EXPENSE' ? (
                <Grid
                  className={css.categorizenow}
                  item
                  xs={6}
                  sm={6}
                  id="bankCategorizationgrid"
                >
                  {buttonInProcess
                    ? mobilecategorizebutton
                    : mobilecategorizebutton}
                </Grid>
              ) : (
                ''
              )}
              <Grid item xs={3} sm={3} id="Categorizationgridbuttons_right">
                <Box
                  component="div"
                  className={css.CategorizationNextBox}
                  onClick={(event) =>{
                    if(hitBottom){
                    catcheck(
                      event,
                      2,
                      getchangedTransactions,
                      updatepaidTo,
                      updateselectedTowardsName,
                      updateselectedIncomeCategoryName,
                      updateselectedPurposeName,
                      updateTemplate,
                      updatechangedTransactions,
                      updatecatMoveStatus,
                      updateupdatebasedata,
                      selectDescription,
                      updatepaidto,
                      updatetotalarr,
                      updatebasedata,
                      updateNarration,
                      updatetotalallocated,
                      updatetotalallocatedbills,
                      updatetotalallocatedtext,
                      prevData,
                      updatemainclear,
                      updatecategorizeData,
                      setNarration,
                      settotalallocated,
                      settotalallocatedbills,
                      settotalallocatedtext,
                      setcategorizeData,
                      nextData
                    );
                    }
                  }
                  }
                >
                  {hitBottom ? (
                    <div className={css.iconadjust2}>
                      <CategorizationNextItem />
                    </div>
                  ) : (
                    <div className={css.iconadjust2}>
                      <CategorizationNextItemDisabled />
                    </div>
                  )}
                </Box>
              </Grid>
            </Grid>
          </div>
          {AlertOpen ? (
            <AlertDialog
              keepMounted
              closebutton={closebutton}
              ptype={pickerType}
              TransitionComponent={Transition}
              initopen={opModal}
              handleClick={(response) =>
                confirmcleardata(
                  response,
                  mainElementCategorize,
                  updatemodifycount,
                  updatecategorizeData,
                  paidto,
                  pickerType,
                  taxamountexcluded,
                  updatetotalallocated,
                  updatetotalallocatedbills,
                  updatetotalallocatedtext,
                  updateucheckedids,
                  updatechangedTransactions,
                  updateupdateCheckSelections,
                  prevData,
                  nextData,
                  categorizeData,
                  specialTotal,
                  isrefund,
                  TDS,
                  updatepaidTo,
                  updateselectedTowardsName,
                  updateselectedIncomeCategoryName,
                  updateselectedPurposeName,
                  updateTemplate,
                  updatecatMoveStatus,
                  updateupdatebasedata,
                  selectDescription,
                  updatepaidto,
                  updatetotalarr,
                  updatebasedata,
                  updateNarration,
                  updatemainclear,
                  setNarration,
                  settotalallocated,
                  settotalallocatedbills,
                  settotalallocatedtext,
                  setcategorizeData,
                  updatecategorized,
                  getlocation,
                  updatechangedTDSvalues,
                  updateeditableTDSvalues,
                  updateMainTransactionType,
                  updatepurposeDetails,
                  updateResetNarration,
                  updatebuttonInProcess,
                  updateclassforpercentage,
                  updatefileuploaded,
                  updateeditableAdjustmentvalues,
                  updatemnTransactionType,
                  mnTransactionType,
                  resetnarration,
                  updateAlertOpen,
                  updateopModal,
                  mainclear,
                  anothercategorization,
                  catMoveStatus,
                  recalculate,
                  getchangedTDSvalues,
                  geteditableTDSvalues,
                  hidetds,
                  updateRecalculate,
                  revisedDocumentType,
                  getchangedTransactions,
                  editedresponse,
                  considerAmountField,
                  ucheckedids
                )
              }
              name={alertdisplaymessage}
              message={alertwarning}
              buttontext1={buttontext1}
              buttontext2={buttontext2}
              catMoveStatus={catMoveStatus}
            />
          ) : (
            ''
          )}
        </div>
      )}
    </div>
  );
};
