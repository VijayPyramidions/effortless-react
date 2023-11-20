
import { StringtoNumber,showPlaceholder } from "../BankDetails/NumberConvertor";
import {MainTemplateGeneration} from './BankCategorization_Header_Footer_Template';
import {taxCalculate} from './BankCategorization_TaxCalculate';


let eventstatus = "";
export const clearSelections = (mainElementCategorize,updatemodifycount,updatecategorizeData,paidto,pickerType,taxamountexcluded,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,updateucheckedids,updatechangedTransactions,updateupdateCheckSelections,prevData,nextData,categorizeData,specialTotal,isrefund,TDS,catMoveStatus,updatecatMoveStatus,recalculate,getchangedTDSvalues,geteditableTDSvalues,getlocation,hidetds,updateRecalculate,revisedDocumentType,getchangedTransactions,editedresponse,considerAmountField,ucheckedids) =>{
    updatemodifycount(0);
    const newData = {"data":[]};
    updatecategorizeData(newData);
    newData.data = categorizeData.data.map((data)=>{
       data.adjustment = "0.00";
       if (paidto?.type?.toLowerCase() === "vendor" || specialTotal){
           const ptamount = StringtoNumber(data.cash);
           const aamount = StringtoNumber(data.adjustment);
           if (isrefund){               
               data.settlementamount = ptamount + aamount;
           }else{
               data.settlementamount = ptamount - aamount;              
           }    
           if (specialTotal){
               if (isrefund){  
                   data.settlementamount = StringtoNumber(data.osettlementamount) + aamount;                          
               }else{
                   data.settlementamount = StringtoNumber(data.osettlementamount) - aamount;                          
               }    
           }  
       }else{
           data.cash = "0.00";
           data.settlementamount = "0.00";
           data.pendingamount = "0.00";
           if (specialTotal){
               data.settlementamount = StringtoNumber(data.osettlementamount);                          
           } 
       }    
       data.notes = "";
       data.checked = false;
       data.modified = false;
       data.taxamount = showPlaceholder(data.taxamount);
       data.cash = showPlaceholder(data.cash);
       data.adjustment = showPlaceholder(data.adjustment);
       data.settlementamount = showPlaceholder(data.settlementamount);   
       return data;
    });
    if (!taxamountexcluded){
        newData.data = taxCalculate(newData.data,TDS,recalculate,taxamountexcluded,getchangedTDSvalues,geteditableTDSvalues,isrefund,getlocation,hidetds,updateRecalculate,revisedDocumentType,paidto,getchangedTransactions,updatechangedTransactions,editedresponse,considerAmountField,ucheckedids);  
    }   
    updatetotalallocated(0);
    updatetotalallocatedbills("");
    updatetotalallocatedtext("");
    updateucheckedids({}); 
    updatechangedTransactions({});
    if (pickerType ===  "mobile"){
        if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#addadvancevalue")){
            mainElementCategorize.current.querySelector("#addadvancevalue").innerHTML = "";
            mainElementCategorize.current.querySelector("#addadvancevalue").style.height = "0px";
        }                
    }        
    updateupdateCheckSelections(true);
    if (catMoveStatus > 0){
        if (catMoveStatus === 1){
            updatecatMoveStatus(0);
            prevData(eventstatus);
        }
        if (catMoveStatus === 2){
            updatecatMoveStatus(0);
            nextData(eventstatus);
         };    
    }else{
         setTimeout(()=>{
             updatecategorizeData(newData);
         },1000);   
    };        
};   


export const moveCats = (updatepaidTo,updateselectedTowardsName,updateselectedIncomeCategoryName,updateselectedPurposeName,updateTemplate,updatechangedTransactions,updatecatMoveStatus,updateupdatebasedata,selectDescription,updatepaidto,updatetotalarr,updatebasedata,updateNarration,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,prevData,updatemainclear,updatecategorizeData,setNarration,settotalallocated,settotalallocatedbills,settotalallocatedtext,setcategorizeData,nextData,catMoveStatus) =>{
    if (catMoveStatus > 0){
        if (catMoveStatus === 1){
            updatecatMoveStatus(0);
            const rdata = {};
            rdata.id = "categorizationInitial";
            rdata.name = selectDescription;
            updatepaidTo(rdata);
            updatetotalarr([]);
            updatechangedTransactions({});
            updateselectedTowardsName(rdata); 
            updateselectedIncomeCategoryName(rdata);
            updateselectedPurposeName("Click to Select");
            updateTemplate(Math.random());
            updateupdatebasedata(!updatebasedata);
            MainTemplateGeneration(1);
            MainTemplateGeneration(2);
            MainTemplateGeneration(3);
            MainTemplateGeneration(4);
            MainTemplateGeneration(5);
            MainTemplateGeneration(6);
            updatetotalallocated(0);
            updateNarration("");
            updatetotalallocatedbills("");
            updatetotalallocatedtext("");                
            const newdata = {"data":[]};
            updatecategorizeData(newdata);
            setTimeout(()=>{
               prevData();
               updatemainclear(false);
            },500);   
        }
        if (catMoveStatus === 2){
            updatecatMoveStatus(0);
            const rdata = {};
            rdata.id = "categorizationInitial";
            rdata.name = selectDescription;
            updatepaidTo(rdata);
            updatepaidto(rdata);
            updatetotalarr([]);
            updatechangedTransactions({});
            updateselectedTowardsName(rdata); 
            updateselectedIncomeCategoryName(rdata);       
            updateTemplate(Math.random());
            updateupdatebasedata(!updatebasedata);
            updateselectedPurposeName("Click to Select");
            MainTemplateGeneration(1);
            MainTemplateGeneration(2);
            MainTemplateGeneration(3);
            MainTemplateGeneration(4);
            MainTemplateGeneration(5);
            MainTemplateGeneration(6);
            setNarration("");
            settotalallocated(0);
            settotalallocatedbills("");
            settotalallocatedtext("");
            const newdata = {"data":[]};
            setcategorizeData(newdata);
            setTimeout(()=>{
                nextData();
                updatemainclear(false);
             },500); 
         };    
     };
};

export const catcheck = (event,moved,getchangedTransactions,updatepaidTo,updateselectedTowardsName,updateselectedIncomeCategoryName,updateselectedPurposeName,updateTemplate,updatechangedTransactions,updatecatMoveStatus,updateupdatebasedata,selectDescription,updatepaidto,updatetotalarr,updatebasedata,updateNarration,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,prevData,updatemainclear,updatecategorizeData,setNarration,settotalallocated,settotalallocatedbills,settotalallocatedtext,setcategorizeData,nextData) => {
    updatecatMoveStatus(moved);
    event.persist();
    eventstatus = event;
    if (Object.keys(getchangedTransactions()).length > 0){        
        moveCats(updatepaidTo,updateselectedTowardsName,updateselectedIncomeCategoryName,updateselectedPurposeName,updateTemplate,updatechangedTransactions,updatecatMoveStatus,updateupdatebasedata,selectDescription,updatepaidto,updatetotalarr,updatebasedata,updateNarration,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,prevData,updatemainclear,updatecategorizeData,setNarration,settotalallocated,settotalallocatedbills,settotalallocatedtext,setcategorizeData,nextData,moved);
    }else{
        moveCats(updatepaidTo,updateselectedTowardsName,updateselectedIncomeCategoryName,updateselectedPurposeName,updateTemplate,updatechangedTransactions,updatecatMoveStatus,updateupdatebasedata,selectDescription,updatepaidto,updatetotalarr,updatebasedata,updateNarration,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,prevData,updatemainclear,updatecategorizeData,setNarration,settotalallocated,settotalallocatedbills,settotalallocatedtext,setcategorizeData,nextData,moved);
    }; 
};


export const movetoanother = (mainElementCategorize,updatecategorized,getlocation,updatechangedTDSvalues,updateeditableTDSvalues,updateMainTransactionType,updateselectedPurposeName,updatepurposeDetails,updatepaidto,updateucheckedids,updatetotalarr,updatepaidTo,updateselectedIncomeCategoryName,updateTemplate,updateupdatebasedata,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,updatecategorizeData,updateNarration,updateResetNarration,updatebuttonInProcess,updateclassforpercentage,updatefileuploaded,updateeditableAdjustmentvalues,nextData,prevData,updatechangedTransactions,updatemnTransactionType,mnTransactionType,selectDescription,updateselectedTowardsName,updatebasedata,resetnarration) =>{
    const brow = localStorage.getItem("pagestart");
    const bddata = getlocation().state.alldata.data[brow];
    updatecategorized(true,bddata.id);
    updateTemplate("");
    updatechangedTransactions({});
    if (mainElementCategorize.current.querySelector("#advancebutton")){
        mainElementCategorize.current.querySelector("#advancebutton").innerHTML = "";
    }
    updatechangedTDSvalues({});
    updateeditableTDSvalues({});
    updatemnTransactionType("Click to Select");
    updateMainTransactionType(mnTransactionType);
    updateselectedPurposeName("Click to Select");
    updatepurposeDetails([]);
    updateselectedPurposeName(selectDescription);
    updatepaidto({});
    updateucheckedids({});
    updatetotalarr([]);
    const rdata = {};
    rdata.id = "categorizationInitial";
    rdata.name = selectDescription;
    updatepaidTo(rdata);
    updateselectedTowardsName(rdata); 
    updateselectedIncomeCategoryName(rdata);
    updateTemplate(Math.random());
    updateupdatebasedata(!updatebasedata);
    MainTemplateGeneration(1);
    MainTemplateGeneration(2);
    MainTemplateGeneration(3);
    MainTemplateGeneration(4);
    MainTemplateGeneration(5);
    MainTemplateGeneration(6);
    const newdata = {"data":[]};
    updatetotalallocated(0);
    updatetotalallocatedbills("");
    updatetotalallocatedtext("");
    updatecategorizeData(newdata);
    updateNarration("");
    updateResetNarration(!resetnarration);
    updatebuttonInProcess(true);
    updateclassforpercentage("percentagehidden");
    updatefileuploaded({});  
    updateeditableAdjustmentvalues({});
    if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#addadvancevalue")){
        mainElementCategorize.current.querySelector("#addadvancevalue").innerHTML = "";
        mainElementCategorize.current.querySelector("#addadvancevalue").style.height = "0px";
    }    
    if (brow < getlocation().state.alldata.data.length-1){
        nextData('');
    }else{
        prevData('');                  
    }  
};



export const confirmcleardata = (response,mainElementCategorize,updatemodifycount,updatecategorizeData,paidto,pickerType,taxamountexcluded,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,updateucheckedids,updatechangedTransactions,updateupdateCheckSelections,prevData,nextData,categorizeData,specialTotal,isrefund,TDS,updatepaidTo,updateselectedTowardsName,updateselectedIncomeCategoryName,updateselectedPurposeName,updateTemplate,updatecatMoveStatus,updateupdatebasedata,selectDescription,updatepaidto,updatetotalarr,updatebasedata,updateNarration,updatemainclear,setNarration,settotalallocated,settotalallocatedbills,settotalallocatedtext,setcategorizeData,updatecategorized,getlocation,updatechangedTDSvalues,updateeditableTDSvalues,updateMainTransactionType,updatepurposeDetails,updateResetNarration,updatebuttonInProcess,updateclassforpercentage,updatefileuploaded,updateeditableAdjustmentvalues,updatemnTransactionType,mnTransactionType,resetnarration,updateAlertOpen,updateopModal,mainclear,anothercategorization,catMoveStatus,recalculate,getchangedTDSvalues,geteditableTDSvalues,hidetds,updateRecalculate,revisedDocumentType,getchangedTransactions,editedresponse,considerAmountField,ucheckedids) =>{

   if (response.answer === "Yes"){
       if (!mainclear){
           clearSelections(mainElementCategorize,updatemodifycount,updatecategorizeData,paidto,pickerType,taxamountexcluded,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,updateucheckedids,updatechangedTransactions,updateupdateCheckSelections,prevData,nextData,categorizeData,specialTotal,isrefund,TDS,catMoveStatus,updatecatMoveStatus,recalculate,getchangedTDSvalues,geteditableTDSvalues,getlocation,hidetds,updateRecalculate,revisedDocumentType,getchangedTransactions,editedresponse,considerAmountField,ucheckedids);
       }else{
           moveCats(updatepaidTo,updateselectedTowardsName,updateselectedIncomeCategoryName,updateselectedPurposeName,updateTemplate,updatechangedTransactions,updateupdatebasedata,selectDescription,updatepaidto,updatetotalarr,updatebasedata,updateNarration,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,prevData,updatemainclear,updatecategorizeData,setNarration,settotalallocated,settotalallocatedbills,settotalallocatedtext,setcategorizeData,nextData,catMoveStatus);
       }  
   };
   if (anothercategorization){
       movetoanother(mainElementCategorize,updatecategorized,getlocation,updatechangedTDSvalues,updateeditableTDSvalues,updateMainTransactionType,updateselectedPurposeName,updatepurposeDetails,updatepaidto,updateucheckedids,updatetotalarr,updatepaidTo,updateselectedIncomeCategoryName,updateTemplate,updateupdatebasedata,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,updatecategorizeData,updateNarration,updateResetNarration,updatebuttonInProcess,updateclassforpercentage,updatefileuploaded,updateeditableAdjustmentvalues,nextData,prevData,updatechangedTransactions,updatemnTransactionType,mnTransactionType,selectDescription,updateselectedTowardsName,updatebasedata,resetnarration);
   }
   updateAlertOpen(false);
   updateopModal(false);
};


