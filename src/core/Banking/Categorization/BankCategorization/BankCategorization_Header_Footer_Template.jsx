import React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { checkNullandAssign } from '../BankDetails/CustomFunctions';
import * as css from '../categorization.scss';
import '../MuiAddonStyles.css';

export const MainTemplateGeneration = (
  type,
  selectedCategorizationType,
  pickerType,
  updateTemplate1,
  updateTemplate2,
  updateTemplate3,
  updateTemplate4,
  updateTemplate5,
  updateTemplate6,
  updatebasedata,
  updateupdatebasedata,
  updateTDS,
  tdsdefaultvalue,
  updatedoonly,
  updateRecalculate,
  displayPartypopup,
  defaultTransactionType,
  paidTo,
  getpaidto,
  getselectedtowards,
  selectedTowardsName,
  displayTowardsdropdown,
  mainElementCategorize,
  maxTDSPercentage,
  TDS,
  selectedIncomeCategoryName,
  resetnarration,
  displayIncomeCategorydropdown,
  getNarration,
  getlocation,
  currentposition,
  paidto,
  updatepurposeDetails,
  getpaidvalue,
  typesettings,
  contraBanks,
  taxidentification,
  updateSelectedTowards,
  getpaidtoclone
) => {
  let finaltemplate = '';
  if (selectedCategorizationType === 'others' && type === 1) {
    finaltemplate =
      pickerType === 'desktop' ? (
        <Box
          component="div"
          className={css.CategorizationBankboxHolderPaidTo}
          onClick={(event) => displayPartypopup(event)}
        >
          <div className={css.bankPaidToTitle}>
            {defaultTransactionType === 'Receipt' ? 'Party' : 'Party'}
          </div>
          <div className={css.bankPaidTo}>
            <div className={css.bankPaidToRightIcon}>
              <KeyboardArrowDown />
            </div>
            <div id="paidto">
              {paidTo && paidTo.name && paidTo.name.length > 40
                ? paidTo.name.substr(0, 40)
                : paidTo.name}
            </div>
          </div>
        </Box>
      ) : (
        <Stack>
          <div className={css.bankPaidToTitle}>
            {defaultTransactionType === 'Receipt' ? 'Party' : 'Party'}
          </div>
          <Box className={css.CategorizationBankboxHolderPaidToSmallBox}>
            <div className={css.bankPaidToRightIconSmallBox}>
              <KeyboardArrowDown />
            </div>
            <div
              id="paidto"
              className={css.selectedPaidTo}
              onClick={(event) => displayPartypopup(event)}
            >
              {getpaidto()}
            </div>
          </Box>
        </Stack>
      );
    updateTemplate1(finaltemplate);
  }
  if (selectedCategorizationType === 'incomecategorization' && type === 1) {
    finaltemplate = (
      <Box
        component="div"
        className={css.CategorizationBankboxHolderIncomeCategorizationName}
      >
        <div className={css.bankIncomeCategorizationTitleName}>Purpose</div>
        <div className={css.bankIncomeCategorizationName}>
          <div className={css.bankIncomeCategorizationRightIconName}>
            <ArrowForwardIosIcon />
          </div>
          Income Categorization
        </div>
      </Box>
    );
    updateTemplate1(finaltemplate);
  }
  if (selectedCategorizationType === 'expensecategorization' && type === 1) {
    finaltemplate = (
      <Box
        component="div"
        className={css.CategorizationBankboxHolderExpenseCategorization}
      >
        <div className={css.bankExpenseCategorizationTitle}>Purpose</div>
        <div className={css.bankExpenseCategorization}>
          <div className={css.bankExpenseCategorizationRightIcon}>
            <ArrowForwardIosIcon />
          </div>
          Expense Categorization
        </div>
      </Box>
    );
    updateTemplate1(finaltemplate);
  }
  if (selectedCategorizationType === 'others' && type === 2) {
    finaltemplate =
      pickerType === 'desktop' ? (
        <Box
          component="div"
          className={css.CategorizationBankboxHolderTowards}
          onClick={() =>
            displayTowardsdropdown(
              paidto,
              updatepurposeDetails,
              getpaidvalue,
              typesettings,
              defaultTransactionType,
              contraBanks,
              getlocation,
              taxidentification,
              updateSelectedTowards,
              getpaidtoclone
            )
          }
        >
          <div className={css.bankTowardsTitle}>Purpose</div>
          <div className={css.bankTowards}>
            <div className={css.bankTowardsRightIcon}>
              <KeyboardArrowDown />
            </div>
            <div id="towardsname" className={css.selectedTowards}>
              {getselectedtowards(selectedTowardsName.name)}
            </div>
          </div>
        </Box>
      ) : (
        <Stack>
          <div className={css.bankTowardsTitle}>Purpose</div>
          <Box
            component="div"
            className={css.CategorizationBankboxHolderTowardsSmallBox}
          >
            <div className={css.bankTowardsRightIconSmallBox}>
              <KeyboardArrowDown />
            </div>
            <div
              id="towardsname"
              onClick={() =>
                displayTowardsdropdown(
                  paidto,
                  updatepurposeDetails,
                  getpaidvalue,
                  typesettings,
                  defaultTransactionType,
                  contraBanks,
                  getlocation,
                  taxidentification,
                  updateSelectedTowards,
                  getpaidtoclone
                )
              }
              className={css.selectedTowards}
            >
              {getselectedtowards()}
            </div>
          </Box>
        </Stack>
      );
    updateTemplate2(finaltemplate);
  }
  if (selectedCategorizationType === 'incomecategorization' && type === 2) {
    finaltemplate = (
      <Box
        component="div"
        className={css.CategorizationBankboxHolderIncomeCategorization}
        onClick={(event) => displayIncomeCategorydropdown(event)}
      >
        <div className={css.bankIncomeCategorizationTitle}>Income Category</div>
        <div className={css.bankIncomeCategorization}>
          <div className={css.bankIncomeCategorizationRightIcon}>
            <ArrowForwardIosIcon />
          </div>
          <div id="incomecategoryname">{selectedIncomeCategoryName.name}</div>
        </div>
      </Box>
    );
    updateTemplate2(finaltemplate);
  }
  if (selectedCategorizationType === 'expensecategorization' && type === 2) {
    finaltemplate = (
      <Box component="div" className={css.CategorizationBankboxHolderNarration}>
        <div className={css.bankNarrationTitle}>Narration</div>
        <div readOnly={resetnarration} className={css.bankNarration}>
          {getNarration(`${resetnarration}`)}
        </div>
      </Box>
    );
    updateTemplate2(finaltemplate);
  }
  if (selectedCategorizationType === 'others' && type === 3) {
    finaltemplate =
      pickerType === 'desktop' ? (
        <Box component="div" className={css.CategorizationBankboxHolderTax}>
          <div>
            <div className={css.bankTaxTitle}>TDS</div>
            <div className={css.bankTax}>
              <TextField
                defaultValue={tdsdefaultvalue}
                className={css.taxpercentage}
                variant="standard"
                type="number"
                onChange={(event) => {
                  if (localStorage.getItem('itemstatus') === 'Edit') {
                    updateTDS(0);
                    event.target.value = 0;
                    updateupdatebasedata(!updatebasedata);
                    if (
                      mainElementCategorize &&
                      mainElementCategorize.current &&
                      mainElementCategorize.current.querySelector(
                        '#percentagesymbol'
                      )
                    ) {
                      mainElementCategorize.current.querySelector(
                        '#percentagesymbol'
                      ).style.display = 'none';
                    }
                    return;
                  }
                  if (event.target.value.length === 0) {
                    updateTDS(0);
                    event.target.value = 0;
                    updateupdatebasedata(!updatebasedata);
                    if (
                      mainElementCategorize &&
                      mainElementCategorize.current &&
                      mainElementCategorize.current.querySelector(
                        '#percentagesymbol'
                      )
                    ) {
                      mainElementCategorize.current.querySelector(
                        '#percentagesymbol'
                      ).style.display = 'none';
                    }
                    return;
                  }
                  if (event.target.value < 0) {
                    event.target.value = 0;
                    updateTDS(event.target.value);
                    updateupdatebasedata(!updatebasedata);
                    if (
                      mainElementCategorize &&
                      mainElementCategorize.current &&
                      mainElementCategorize.current.querySelector(
                        '#percentagesymbol'
                      )
                    ) {
                      mainElementCategorize.current.querySelector(
                        '#percentagesymbol'
                      ).style.display = 'block';
                    }
                    return;
                  }
                  if (event.target.value > maxTDSPercentage) {
                    event.target.value = maxTDSPercentage;
                    updateTDS(event.target.value);
                    updateupdatebasedata(!updatebasedata);
                    if (
                      mainElementCategorize &&
                      mainElementCategorize.current &&
                      mainElementCategorize.current.querySelector(
                        '#percentagesymbol'
                      )
                    ) {
                      mainElementCategorize.current.querySelector(
                        '#percentagesymbol'
                      ).style.display = 'block';
                    }
                    return;
                  }
                  updateTDS(event.target.value);
                  if (
                    mainElementCategorize &&
                    mainElementCategorize.current &&
                    mainElementCategorize.current.querySelector(
                      '#percentagesymbol'
                    )
                  ) {
                    mainElementCategorize.current.querySelector(
                      '#percentagesymbol'
                    ).style.display = 'block';
                  }
                  updatedoonly(0);
                  updateRecalculate(true);
                  updateupdatebasedata(!updatebasedata);
                }}
                onBlur={() => {
                  updatedoonly(0);
                }}
                onKeyPress={(event) => {
                  if (event?.key === '-' || event?.key === '+') {
                    event.preventDefault();
                  }
                }}
              />
              {TDS >= 0 ? <div id="percentagesymbol">%</div> : ''}
            </div>
          </div>
        </Box>
      ) : (
        <div>
          <div className={css.bankTaxTitle}>TDS</div>
          <div className={css.bankTax}>
            <TextField
              defaultValue={tdsdefaultvalue}
              className={css.taxpercentage}
              variant="standard"
              type="number"
              onChange={(event) => {
                if (localStorage.getItem('itemstatus') === 'Edit') {
                  updateTDS(0);
                  event.target.value = 0;
                  updateupdatebasedata(!updatebasedata);
                  if (
                    mainElementCategorize &&
                    mainElementCategorize.current &&
                    mainElementCategorize.current.querySelector(
                      '#percentagesymbol'
                    )
                  ) {
                    mainElementCategorize.current.querySelector(
                      '#percentagesymbol'
                    ).style.display = 'none';
                  }
                  return;
                }
                if (event.target.value.length === 0) {
                  updateTDS(0);
                  updateupdatebasedata(!updatebasedata);
                  if (
                    mainElementCategorize &&
                    mainElementCategorize.current &&
                    mainElementCategorize.current.querySelector(
                      '#percentagesymbol'
                    )
                  ) {
                    mainElementCategorize.current.querySelector(
                      '#percentagesymbol'
                    ).style.display = 'none';
                  }
                  return;
                }
                if (event.target.value < 0) {
                  event.target.value = 0;
                  updateTDS(event.target.value);
                  updateupdatebasedata(!updatebasedata);
                  if (
                    mainElementCategorize &&
                    mainElementCategorize.current &&
                    mainElementCategorize.current.querySelector(
                      '#percentagesymbol'
                    )
                  ) {
                    mainElementCategorize.current.querySelector(
                      '#percentagesymbol'
                    ).style.display = 'block';
                  }
                  return;
                }
                if (event.target.value > maxTDSPercentage) {
                  event.target.value = maxTDSPercentage;
                  updateTDS(event.target.value);
                  updateupdatebasedata(!updatebasedata);
                  if (
                    mainElementCategorize &&
                    mainElementCategorize.current &&
                    mainElementCategorize.current.querySelector(
                      '#percentagesymbol'
                    )
                  ) {
                    mainElementCategorize.current.querySelector(
                      '#percentagesymbol'
                    ).style.display = 'block';
                  }
                  return;
                }
                if (
                  mainElementCategorize &&
                  mainElementCategorize.current &&
                  mainElementCategorize.current.querySelector(
                    '#percentagesymbol'
                  )
                ) {
                  mainElementCategorize.current.querySelector(
                    '#percentagesymbol'
                  ).style.display = 'block';
                }
                updatedoonly(0);
                updateTDS(event.target.value);
                updateupdatebasedata(!updatebasedata);
                updateRecalculate(true);
              }}
              onBlur={() => {
                updatedoonly(0);
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
                  event.preventDefault();
                }
              }}
            />
            {TDS >= 0 ? <div id="percentagesymbol">%</div> : ''}
          </div>
        </div>
      );
    updateTemplate3(finaltemplate);
  }
  if (selectedCategorizationType === 'expensecategorization' && type === 3) {
    finaltemplate = (
      <Box component="div" className={css.CategorizationBankboxHolderType}>
        <div className={css.bankDateTitle}>Type</div>
        <div
          className={
            defaultTransactionType === 'Receipt'
              ? css.bankTransactionType_Inflow
              : css.bankTransactionType_Outflow
          }
        >
          {defaultTransactionType === 'Receipt' ? 'Inflow' : 'Outflow'}
        </div>
      </Box>
    );
    updateTemplate3(finaltemplate);
  }
  if (selectedCategorizationType === 'others' && type === 4) {
    finaltemplate =
      pickerType === 'desktop' ? (
        <Box
          component="div"
          className={css.CategorizationBankboxHolderNarration}
        >
          <div className={css.bankNarrationTitle}>Narration</div>
          <div readOnly={resetnarration} className={css.bankNarration}>
            {getNarration(`${resetnarration}`)}
          </div>
        </Box>
      ) : (
        <Stack className={css.bankNarrationHolder}>
          <div className={css.bankNarrationTitle}>Narration</div>
          <div className={css.bankNarration}>
            {getNarration(`${resetnarration}`)}
          </div>
        </Stack>
      );
    updateTemplate4(finaltemplate);
  }
  if (selectedCategorizationType === 'incomecategorization' && type === 4) {
    finaltemplate =
      pickerType === 'desktop' ? (
        <Box
          component="div"
          className={css.CategorizationBankboxHolderNarration}
        >
          <div className={css.bankNarrationTitle}>Narration</div>
          <div readOnly={resetnarration} className={css.bankNarration}>
            {getNarration(`${resetnarration}`)}
          </div>
        </Box>
      ) : (
        <Stack className={css.bankNarrationHolder}>
          <div className={css.bankNarrationTitle}>Narration</div>
          <div readOnly={resetnarration} className={css.bankNarration}>
            {getNarration(`${resetnarration}`)}
          </div>
        </Stack>
      );
    updateTemplate4(finaltemplate);
  }
  if (selectedCategorizationType === 'others' && type === 5) {
    finaltemplate =
      pickerType === 'desktop' ? (
        <Box component="div" className={css.CategorizationBankboxHolderDate}>
          <div className={css.bankDateTitle}>Date</div>
          <div className={css.bankDate}>{`${checkNullandAssign(
            getlocation().state.alldata.data[
              `${
                typeof currentposition === 'undefined'
                  ? getlocation().state.row
                  : currentposition
              }`
            ],
            {
              data1: { field: 'date', type: 'D', absolute: false, altname: '' },
            }
          )}`}</div>
        </Box>
      ) : (
        <Stack>
          <div className={css.bankDateTitle}>Date</div>
          <div className={css.bankDate}>{`${
            checkNullandAssign(
              getlocation().state.alldata.data[
                `${
                  typeof currentposition === 'undefined'
                    ? getlocation().state.row
                    : currentposition
                }`
              ],
              {
                data1: {
                  field: 'date',
                  type: 'D',
                  absolute: false,
                  altname: '',
                },
              }
            ).length === 1
              ? checkNullandAssign(
                  getlocation().state.alldata.data[
                    `${
                      typeof currentposition === 'undefined'
                        ? getlocation().state.row
                        : currentposition
                    }`
                  ],
                  {
                    data1: {
                      field: 'date',
                      type: 'D',
                      absolute: false,
                      altname: '',
                    },
                  }
                )
              : checkNullandAssign(
                  getlocation().state.alldata.data[
                    `${
                      typeof currentposition === 'undefined'
                        ? getlocation().state.row
                        : currentposition
                    }`
                  ],
                  {
                    data1: {
                      field: 'date',
                      type: 'D',
                      absolute: false,
                      altname: '',
                    },
                  }
                ).substr(
                  0,
                  checkNullandAssign(
                    getlocation().state.alldata.data[
                      `${
                        typeof currentposition === 'undefined'
                          ? getlocation().state.row
                          : currentposition
                      }`
                    ],
                    {
                      data1: {
                        field: 'date',
                        type: 'D',
                        absolute: false,
                        altname: '',
                      },
                    }
                  ).length - 4
                )
          }`}</div>
        </Stack>
      );
    updateTemplate5(finaltemplate);
  }
  if (selectedCategorizationType === 'incomecategorization' && type === 5) {
    finaltemplate = (
      <Box component="div" className={css.CategorizationBankboxHolderDate}>
        <div className={css.bankDateTitle}>Date</div>
        <div className={css.bankDate}>{`${checkNullandAssign(
          getlocation().state.alldata.data[
            `${
              typeof currentposition === 'undefined'
                ? getlocation().state.row
                : currentposition
            }`
          ],
          { data1: { field: 'date', type: 'D', absolute: false, altname: '' } }
        )}`}</div>
      </Box>
    );
    updateTemplate5(finaltemplate);
  }
  if (selectedCategorizationType === 'others' && type === 6) {
    finaltemplate = (
      <Box component="div" className={css.CategorizationBankboxHolderType}>
        <div className={css.bankTransactionTypeTitle}>Type</div>
        <div
          className={
            defaultTransactionType === 'Receipt'
              ? css.bankTransactionType_Inflow
              : css.bankTransactionType_Outflow
          }
        >
          {defaultTransactionType === 'Receipt' ? 'Inflow' : 'Outflow'}
        </div>
      </Box>
    );
    updateTemplate6(finaltemplate);
  }
  if (selectedCategorizationType === 'incomecategorization' && type === 6) {
    finaltemplate = (
      <Box component="div" className={css.CategorizationBankboxHolderType}>
        <div className={css.bankDateTitle}>Type</div>
        <div
          className={
            defaultTransactionType === 'Receipt'
              ? css.bankTransactionType_Inflow
              : css.bankTransactionType_Outflow
          }
        >
          {defaultTransactionType === 'Receipt' ? 'Inflow' : 'Outflow'}
        </div>
      </Box>
    );
    updateTemplate6(finaltemplate);
  }
  return finaltemplate;
};
