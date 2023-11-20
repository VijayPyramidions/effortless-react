import React from 'react';
import * as Mui from '@mui/material';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { CommonDrawer } from '../../AccountBalance/CommonDrawer';
import Puller from "../Puller";
import {TowardsSelect} from './BankCategorization_Towards_Select';
import {GetPurpose} from './BankCategorization_Get_Purpose';
import * as css from '../categorization.scss';
import '../MuiAddonStyles.css';

export const DropDowns = (props)=>{
   const {
    BottomSheetNumber,
    updateBottomSheetNumber,
    tdefaultTransactionType,
    purposeDetails,
    paidTo,
    ButtonArray,
    ButtonBackColor,
    contraBanks,
    taxidentification,
    SelectedTowards,
    selectedPurposeName,
    getlocation,
    SelectedIncomeCategory,
    updateSelectedIncomeCategory,
    IncomeCategorySelect,
    updateSelectedTowards,
    cButtonArray,
    defaultTransactionType,
    typesettings,
    updatetriggerContraBanks,
    mainElementCategorize,
    updateresettemplate,
    updateUpdateTemplate,
    updatechangedTowards,
    updatemnTransactionType,
    updateMainTransactionType,
    updatedispType,
    updatepaidTo,
    updatetemplate,
    updateselectedTowardsName,
    paidto,
    mobilereduce,
    pickerType,
    updateselectedPurposeName,
    updateinittowards,
    inittowards,
    mnTransactionType,
    updatepaidto,
    addAdvance,
    organization,
    user,
    updateadvancevoucher,
    updateVReference,
    updateshowLoader,
    openSnackBar,
    editadvancenumber,
    showadvance,
    updateshowAdvance,
    updateanothercategorization,
    updateopModal,
    updatealertdisplaymessage,
    updatealertwarning,
    updatebuttontext1,
    updatebuttontext2,
    updateclosebutton,
    updateAlertOpen,
    getchanged,
    updatetotalarr,
    setpaidTo,
    updatepurposeDetails,
    updatecategorizationDone,
    selectDescription,
    templateset,
    updatetotalallocated,
    updatetotalallocatedbills,
    updatetotalallocatedtext,
    updateclassforpercentage,
    updatetdsdefaultvalue,
    updatespecialTotal,
    updatemodifieddetails,
    editclicked
   } = props;


   return (
    <div>
    {BottomSheetNumber?
        <SelectBottomSheet
          name="Party"
          addNewSheet
          open={BottomSheetNumber}
          onClose={() => updateBottomSheetNumber(false)}
          maxHeight="45vh"
          triggerComponent={<></>}
        >
         <CommonDrawer
             state="CUSTOM POPUPS"
             handleClick={(event)=>{GetPurpose(event,updatemnTransactionType,updatepurposeDetails,updatecategorizationDone,updatepaidto,selectDescription,mainElementCategorize,templateset,typesettings,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,updateMainTransactionType,getlocation,defaultTransactionType,mnTransactionType,updatechangedTowards,updateselectedPurposeName,updatedispType,updateselectedTowardsName,updateresettemplate,updateshowAdvance,updateclassforpercentage,taxidentification,updatetdsdefaultvalue,updatepaidTo,paidto,updateBottomSheetNumber,updatetriggerContraBanks);}}
             setBottomSheetNumber={updateBottomSheetNumber}
             trigger
             purposeDetails={purposeDetails}
             selectedOption
             selectedId
             party
             transactiontype={tdefaultTransactionType}
             purposename = {undefined}
             basetowardsdata = {paidTo}
             buttonarray = {ButtonArray}
             buttoncolors = {ButtonBackColor}
             contrabanks = {contraBanks}
             taxidentification = {taxidentification}
          />
       </SelectBottomSheet>:
       ''}
 
 
       {!SelectedTowards?
        <SelectBottomSheet
          name="Purpose"
          addNewSheet
          open={paidTo.id === "categorizationInitial"?true:!SelectedTowards}
          onClose={() => updateSelectedTowards(!SelectedTowards)}
          maxHeight="45vh"
          triggerComponent={<></>}
        >
         <CommonDrawer
             state="CUSTOM POPUPS PURPOSE"
             handleClick={(toward)=>TowardsSelect(toward,updatetriggerContraBanks,mainElementCategorize,updateresettemplate,updateSelectedTowards,updateUpdateTemplate,updatechangedTowards,paidTo,updatemnTransactionType,updateMainTransactionType,updatedispType,contraBanks,updatepaidTo,updatetemplate,updateselectedTowardsName,getlocation,taxidentification,defaultTransactionType,mobilereduce,pickerType,SelectedTowards,updateselectedPurposeName,updateinittowards,inittowards,mnTransactionType,updatepaidto,addAdvance,organization,user,updateadvancevoucher,updateVReference,updateshowLoader,openSnackBar,editadvancenumber,showadvance,updateshowAdvance,updateanothercategorization,updateopModal,updatealertdisplaymessage,updatealertwarning,updatebuttontext1,updatebuttontext2,updateclosebutton,updateAlertOpen,getchanged,updatetotalarr,setpaidTo,updatespecialTotal,updatemodifieddetails,editclicked)}
             setBottomSheetNumber={SelectedTowards}
             purposeDetails={purposeDetails}
             selectedOption={paidTo.type}
             party = {paidTo}
             transactiontype
             purposename = {selectedPurposeName}
             basetowardsdata = {getlocation().state.masterslist.towards.data}
             buttonarray = {cButtonArray}
             buttoncolors = {ButtonBackColor}
             contrabanks = {contraBanks}
             defaultTransactionType = {defaultTransactionType}
             taxidentification = {taxidentification}
             typesettings = {typesettings}
          />
       </SelectBottomSheet>:
       ''}
 
 
 
 
       {!SelectedIncomeCategory?  
          <SelectBottomSheet
                name="Income Categories"
                addNewSheet
                open={!SelectedIncomeCategory}
                onClose={() => updateSelectedIncomeCategory(!SelectedIncomeCategory)}
                maxHeight="45vh"
                key={`${Math.random()}`}
                style= {{display:!SelectedIncomeCategory?"block":"none"}}
                triggerComponent={<></>}
            >
               <Mui.Stack m={3}>
                 <Puller />
                 <Mui.Stack className={css.textBankHeadingStack}  key={`${Math.random()}`}>
                    <Mui.Typography className={css.textBankHeading}>
                       Income Categories
                    </Mui.Typography>
                    <Mui.Divider className={css.dotBank} />
                 </Mui.Stack>
                 <Mui.Stack  key={`${Math.random()}`}>
                       {getlocation().state.masterslist.incomecategories && getlocation().state.masterslist.incomecategories.data && getlocation().state.masterslist.incomecategories.data.length > 0 && getlocation().state.masterslist.incomecategories.data.map((incomecategory) => {
                          return (
                            <>
                              <Mui.Typography
                                  className={css.textBank}
                                  name="bank"
                                  key={incomecategory.id}
                                  onClick={() => IncomeCategorySelect(incomecategory.id)}
                              >
                                {`${incomecategory.name}`}
                              </Mui.Typography>
                              <Mui.Divider key={`d_${incomecategory.id}`}/>
                            </>
                         );
                       })}
                    </Mui.Stack>
                 </Mui.Stack>
            </SelectBottomSheet> :
            ''} 
      </div>
   );
};