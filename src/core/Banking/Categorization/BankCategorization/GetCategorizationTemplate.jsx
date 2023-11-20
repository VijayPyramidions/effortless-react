
import {GenerateColumns} from './GenerateTemplateColumns';
import {Templates} from './BankCategorization_GridTemplate_Master';

export const getTemplate = (templateNam,paidTo,updateisrefund,updateVReference,updatespecialTotal,updateaccountnamefield,updateshowuploadmessage,updatePayCheck,collapsetimer,mainElementCategorize,updaterevisedDocumentType,updateRowHeight,updatePagination,updatetaxamountexcluded,updateNarrationElement,updateclassforpercentage,updateaddtransaction,tdefaultTransactionType,selectedTowardsName,taxCalculate,updatewidthcalculatefields,updatetotalfieldlist,updateadvancefieldlist,updateshowadvancefieldlist,updateconsiderAmountField,updatedocumentnumberfield,updatetotalrequired,updateadvancerequired,updatepaytitle1,updatepaytitle2,updatealternatekeys,updateUploadText,selectedIncomeCategoryName,resettemplate,TDS,categorizeData,selectedCategorizationType,updatehidetds,hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,updateshowtotalfieldlist,updatecollapserequired,noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,templatecolumns,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,updatetemplateName,updateTriggerClickItem,recalculate,taxamountexcluded,getchangedTDSvalues,getlocation,updateRecalculate,revisedDocumentType,getchangedTransactions,updatechangedTransactions,editedresponse,ucheckedids,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,pickerType,editclicked,ExpenseDone)=>{
        if (paidTo.id === "categorizationInitial"){
            return ' ';
        }
        if (resettemplate){
             return ' ';
        }
        updateisrefund(false);
        updateVReference("");
        updatespecialTotal(false);
        updateaccountnamefield("");
        updateshowuploadmessage(false);
        updatePayCheck("");
        if (collapsetimer){
            clearInterval(collapsetimer);
        }
        let templateName = templateNam;
        if (selectedCategorizationType === "incomecategorization"){
            templateName = "Income";
        }
        if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".categorization_gridElementExpense") && mainElementCategorize.current.querySelector(".categorization_gridElementExpense").querySelector("div")){
            mainElementCategorize.current.querySelector(".categorization_gridElementExpense").querySelector("div").style.height = "95%";
        }
        let derivedtemplate = "";
        let templates = "";
        updaterevisedDocumentType("");  
        updateRowHeight(62);
        updatePagination(false);
        updatetaxamountexcluded(false);
        updateNarrationElement(false);
        updateclassforpercentage("percentagehidden");
        updateaddtransaction(true);
        let ptype = "";
        templateName = templateName.split(" ").join("");
        updatetemplateName(templateName);
        switch (templateName.toUpperCase()){
          case "EXPENSE":
               updateclassforpercentage("percentagehidden");
               templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
               derivedtemplate = templates.uploadbills;
               updatetaxamountexcluded(true);     
               updateNarrationElement(true);
               break;     
          case "DEPOSIT":
              if (tdefaultTransactionType === "Payment"){
                 if (paidTo && selectedTowardsName){
                     updatetaxamountexcluded(true);
                     updatehidetds(true);
                     ptype = paidTo.type;
                     if (paidTo.etype  && paidTo.type !== paidTo.etype){
                         ptype = paidTo.etype;
                     }                    
                     if (ptype?.toLowerCase() === "vendor"){
                         updateclassforpercentage("percentagevisible") ;
                         updatetaxamountexcluded(false);  
                         const newdata = {data:[]};
                         newdata.data = taxCalculate(categorizeData.data,TDS,recalculate,taxamountexcluded,getchangedTDSvalues,geteditableTDSvalues,isrefund,getlocation,hidetds,updateRecalculate,revisedDocumentType,paidto,getchangedTransactions,updatechangedTransactions,editedresponse,considerAmountField,ucheckedids); 
                         updatehidetds(false);
                     }    
                 }           
                 updaterevisedDocumentType("TYPE2");  
                 updatePagination(false);
                 GenerateColumns("template2","document_number","date","To Pay","Ref. No.",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                 templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                 derivedtemplate = templates.multilineandlongtext;
                 updatewidthcalculatefields(["document_number"]);
                 updatetotalfieldlist(["amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                 updateadvancefieldlist(["document_number","amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                 updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:true,settlementamount:true,adjustment:true});
                 updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:true,settlementamount:true,adjustment:true});
                 updateconsiderAmountField("net_balance");
                 updatedocumentnumberfield("document_number");
                 updateNarrationElement(false);
                 updatecollapserequired(false);
                 updatetotalrequired(false);
                 updateadvancerequired(false);
                 if (tdefaultTransactionType === "Receipt"){
                     updatepaytitle1("Receivable Amount");
                     updatepaytitle2("Received");
                     updatealternatekeys(['Ref. No.','Receivable Amount','Received']);    
                     updatePayCheck("R");                   
                 }else{   
                     updatepaytitle1("Payable Amount");
                     updatepaytitle2("Paid");
                     if (paidTo?.type?.toLowerCase() === "vendor"){
                         updatealternatekeys(['Ref. No.','Payable Amount',"TDS",'Paid']);
                     }else{
                         updatealternatekeys(['Ref. No.','Payable Amount','Paid']);                      
                     }
                    updatePayCheck("P"); 
                 }    
              }
              break;
          case "LOANGIVEN-GIVEN":
              if (tdefaultTransactionType === "Payment"){
                 if (paidTo && selectedTowardsName){
                     updatetaxamountexcluded(true);
                     updatehidetds(true);
                 }           
                 updaterevisedDocumentType("TYPE2");  
                 updatePagination(false);
                 GenerateColumns("template2","document_number","date","To Pay","Ref. No.",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                 templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                 derivedtemplate = templates.multilineandlongtext;
                 updatewidthcalculatefields([]);
                 updatetotalfieldlist(["amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                 updateadvancefieldlist(["document_number","amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                 updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:false,settlementamount:true,adjustment:true});
                 updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:true,settlementamount:true,adjustment:true});
                 updateconsiderAmountField("net_balance");
                 updatedocumentnumberfield("document_number");
                 updateNarrationElement(false);
                 updatecollapserequired(false);
                 updatetotalrequired(false);
                 updateadvancerequired(false);
                 if (tdefaultTransactionType === "Receipt"){
                     updatepaytitle1("Receivable Amount");
                     updatepaytitle2("Received");
                     updatealternatekeys(['Ref. No.','Receivable Amount','Received']);
                     updatePayCheck("R"); 
                 }else{   
                     updatepaytitle1("Payable Amount");
                     updatepaytitle2("Paid");
                     updatealternatekeys(['Ref. No.','Payable Amount','Paid']);
                     updatePayCheck("P"); 
                 }     
             }
              break;
          case "REIMBURSEMENT":   
               ptype = paidTo.type;
               if (paidTo.etype  &&  paidTo.type !== paidTo.etype){
                   ptype = paidTo.etype;
               }         
               if (ptype?.toLowerCase() === "employee" || ptype?.toLowerCase() === "promoter"){
                    if (paidTo && selectedTowardsName){
                        updatetaxamountexcluded(true);
                        updatehidetds(true);
                    }                    
                    updaterevisedDocumentType("TYPE1");  
                    updatePagination(false);
                    GenerateColumns("template1","document_number","date","To Pay","Bill No. & Date",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                    templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                    derivedtemplate = templates.multiLine;  
                    updatewidthcalculatefields([]);
                    updatetotalfieldlist(["amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                    updateadvancefieldlist(["document_number","amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                    updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:false,settlementamount:true,adjustment:true});
                    updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:true,settlementamount:true,adjustment:true});
                    updateconsiderAmountField("net_balance");
                    updatedocumentnumberfield("document_number");
                    updatealternatekeys(['Bill No. & Date','Original Amount','Pending Amount','To Pay','To Allocate','Balance']);
                    updatecollapserequired(true);
                    updatetotalrequired(true);
                    updateadvancerequired(true);            
                }
                break;             
          case "LOANGIVEN-REPAID":   
                if (tdefaultTransactionType === "Receipt"){
                    if (paidTo && selectedTowardsName){
                        updatetaxamountexcluded(true);
                        updatehidetds(true);
                    }                    
                    updaterevisedDocumentType("TYPE1");  
                    updatePagination(false);
                    GenerateColumns("template1","document_number","date","To Pay","Bill No. & Date",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                    templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                    derivedtemplate = templates.multiLine;  
                    updatewidthcalculatefields([]);
                    updatetotalfieldlist(["amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                    updateadvancefieldlist(["document_number","amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                    updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:false,settlementamount:true,adjustment:true});
                    updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:true,settlementamount:true,adjustment:true});
                    updateconsiderAmountField("net_balance");
                    updatedocumentnumberfield("document_number");
                    updatealternatekeys(['Bill No. & Date','Original Amount','Pending Amount','To Pay','To Allocate','Balance']);
                    updatecollapserequired(true);
                    updatetotalrequired(true);
                    updateadvancerequired(true);            
                }
                break;                        
          case "LOANBORROWED-TAKEN":
               if (tdefaultTransactionType === "Receipt"){
                   if (paidTo && selectedTowardsName){
                       updatetaxamountexcluded(true);
                       updatehidetds(true);
                   }           
                   updaterevisedDocumentType("TYPE2");  
                   updatePagination(false);
                   GenerateColumns("template2","document_number","date","To Pay","Ref. No.",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                   templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                   derivedtemplate = templates.multilineandlongtext;
                   updatewidthcalculatefields([]);
                   updatetotalfieldlist(["amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                   updateadvancefieldlist(["document_number","amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                   updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:false,settlementamount:true,adjustment:true});
                   updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:true,settlementamount:true,adjustment:true});
                   updateconsiderAmountField("net_balance");
                   updatedocumentnumberfield("document_number");
                   updateNarrationElement(false);
                   updatecollapserequired(false);
                   updatetotalrequired(false);
                   updateadvancerequired(false);
                   if (tdefaultTransactionType === "Receipt"){
                       updatepaytitle1("Receivable Amount");
                       updatepaytitle2("Received");
                       updatealternatekeys(['Ref. No.','Receivable Amount','Received']);
                       updatePayCheck("R"); 
                   }else{   
                       updatepaytitle1("Payable Amount");
                       updatepaytitle2("Paid");
                       updatealternatekeys(['Ref. No.','Payable Amount','Paid']);
                       updatePayCheck("P"); 
                   }     
               }
               break;
          case "LOANBORROWED-REPAID":   
                if (tdefaultTransactionType === "Payment"){
                    if (paidTo && selectedTowardsName){
                        updatetaxamountexcluded(true);
                        updatehidetds(true);
                    }                    
                    updaterevisedDocumentType("TYPE1");  
                    updatePagination(false);
                    GenerateColumns("template1","document_number","date","To Pay","Bill No. & Date",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                    templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                    derivedtemplate = templates.multiLine;  
                    updatewidthcalculatefields([]);
                    updatetotalfieldlist(["amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                    updateadvancefieldlist(["document_number","amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                    updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:false,settlementamount:true,adjustment:true});
                    updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:true,settlementamount:true,adjustment:true});
                    updateconsiderAmountField("net_balance");
                    updatedocumentnumberfield("document_number");
                    updatealternatekeys(['Bill No. & Date','Original Amount','Pending Amount','To Pay','To Allocate','Balance']);
                    updatecollapserequired(true);
                    updatetotalrequired(true);
                    updateadvancerequired(true);            
                }
                break;
          case "LOANTAKEN-TAKEN":
             if (tdefaultTransactionType === "Receipt"){
                 if (paidTo && selectedTowardsName){
                     updatetaxamountexcluded(true);
                     updatehidetds(true);
                 }           
                 updaterevisedDocumentType("TYPE2");  
                 updatePagination(false);
                 GenerateColumns("template2","document_number","date","To Pay","Ref. No.",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                 templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                 derivedtemplate = templates.multilineandlongtext;
                 updatewidthcalculatefields([]);
                 updatetotalfieldlist(["amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                 updateadvancefieldlist(["document_number","amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                 updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:false,settlementamount:true,adjustment:true});
                 updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:true,settlementamount:true,adjustment:true});
                 updateconsiderAmountField("net_balance");
                 updatedocumentnumberfield("document_number");
                 updateNarrationElement(false);
                 updatecollapserequired(false);
                 updatetotalrequired(false);
                 updateadvancerequired(false);
                 if (tdefaultTransactionType === "Receipt"){
                     updatepaytitle1("Receivable Amount");
                     updatepaytitle2("Received");
                     updatealternatekeys(['Ref. No.','Receivable Amount','Received']);
                     updatePayCheck("R"); 
                 }else{   
                     updatepaytitle1("Payable Amount");
                     updatepaytitle2("Paid");
                     updatealternatekeys(['Ref. No.','Payable Amount','Paid']);
                     updatePayCheck("P"); 
                 } 
             }
             break;                      
          case "LOANTAKEN-REPAID":
             if (tdefaultTransactionType === "Payment"){
                 if (paidTo && selectedTowardsName){
                     updatetaxamountexcluded(true);
                     updatehidetds(true);
                 }                    
                 updaterevisedDocumentType("TYPE1");  
                 updatePagination(false);
                 GenerateColumns("template1","document_number","date","To Pay","Bill No. & Date",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                 templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                 derivedtemplate = templates.multiLine;  
                 updatewidthcalculatefields([]);
                 updatetotalfieldlist(["amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                 updateadvancefieldlist(["document_number","amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                 updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:false,settlementamount:true,adjustment:true});
                 updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:true,settlementamount:true,adjustment:true});
                 updateconsiderAmountField("net_balance");
                 updatedocumentnumberfield("document_number");
                 updatealternatekeys(['Bill No. & Date','Original Amount','Pending Amount','To Pay','To Allocate','Balance']);
                 updatecollapserequired(true);
                 updatetotalrequired(true);
                 updateadvancerequired(false);    
             }         
             break;      
          case "STATUTORYDUES":
             if (tdefaultTransactionType === "Payment"){
                 if (paidTo && selectedTowardsName){
                     updatetaxamountexcluded(true);
                     updatehidetds(true);
                 }        
                 updaterevisedDocumentType("TYPE1");  
                 updatePagination(false);
                 GenerateColumns("template3","document_number","date","To Allocate","Month",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                 templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                 derivedtemplate = templates.multilineandlongtextlong;
                 updatewidthcalculatefields([]);
                 updatetotalfieldlist(["amount","net_balance","adjustment","settlementamount"]);
                 updatetotalfieldlist(["amount","net_balance","cash","adjustment","settlementamount"]);
                 updateadvancefieldlist(["document_number","account_name","amount","net_balance","adjustment","settlementamount"]);
                 updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:false,settlementamount:true,adjustment:true});
                 updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:false,settlementamount:true,adjustment:true});
                 updateconsiderAmountField("net_balance");
                 updatedocumentnumberfield("document_number");
                 updatealternatekeys(['Month',"Account",'Original Amount','Pending Amount','To Allocate','Balance']);
                 updatecollapserequired(true);
                 updatetotalrequired(true);
                 updateadvancerequired(true);    
                 updateNarrationElement(false);
                 updateaccountnamefield("account_name");
             }
             break;                                          
          case "EMISCHEDULEUPLOAD":
               templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
               derivedtemplate = templates.documentupload;
               updatetaxamountexcluded(true);
               updatehidetds(true);
               updateNarrationElement(true);
               updatecollapserequired(false);
               updatetotalrequired(false);
               updateadvancerequired(false);
               updateaddtransaction(false);    
               updateUploadText("Upload EMI Schedule Sheet");
               updateclassforpercentage("percentagehidden");
               updaterevisedDocumentType("TYPE3");  
               updatetaxamountexcluded(true);
               if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".categorization_gridElementExpense") && mainElementCategorize.current.querySelector(".categorization_gridElementExpense").querySelector("div")){
                   mainElementCategorize.current.querySelector(".categorization_gridElementExpense").querySelector("div").style.height = "90%";
               }   
               break;
          case "REFUND": 
               updateisrefund(true);     
               ptype = paidTo.type;
               if (paidTo.etype && paidTo.type !== paidTo.etype){
                   ptype = paidTo.etype;
               }                 
               if (tdefaultTransactionType === "Payment"){
                   if (ptype?.toLowerCase() === "customer"){
                       updaterevisedDocumentType("TYPE1");  
                       updatePagination(false);
                       updatehidetds(true);
                       GenerateColumns("template1","document_number","date","To Pay","Bill No. & Date",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                       templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                       derivedtemplate = templates.multiLine;    
                       updatewidthcalculatefields([]);
                       updatetotalfieldlist(["amount","net_balance","cash","adjustment","settlementamount"]);
                       updateadvancefieldlist(["document_number","amount","net_balance","cash","adjustment","settlementamount"]);
                       updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:false,settlementamount:true,adjustment:true});
                       updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:false,settlementamount:true,adjustment:true});
                       updateconsiderAmountField("net_balance");
                       updatedocumentnumberfield("document_number");
                       updatealternatekeys(['Bill No. & Date','Original Amount','Pending Amount','To Pay','To Allocate','Balance']);
                       updatecollapserequired(true);
                       updatetotalrequired(true);
                       updateadvancerequired(false);
                   }    
              }else if (tdefaultTransactionType === "Receipt"){
                   if (ptype?.toLowerCase() === "vendor"){    
                       updaterevisedDocumentType("TYPE1");               
                       updatePagination(false);
                       updatehidetds(true);
                       GenerateColumns("template1","document_number","date","To Collect","Bill No. & Date",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                       templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                       derivedtemplate = templates.multiLine;   
                       updatewidthcalculatefields([]);
                       updatetotalfieldlist(["amount","net_balance","cash","adjustment","settlementamount"]);
                       updateadvancefieldlist(["document_number","amount","net_balance","cash","adjustment","settlementamount"]);
                       updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:false,settlementamount:true,adjustment:true});
                       updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:false,settlementamount:true,adjustment:true});
                       updateconsiderAmountField("net_balance");
                       updatedocumentnumberfield("document_number");
                       updatealternatekeys(['Bill No. & Date','Original Amount','Pending Amount','To Collect','To Allocate','Balance']);
                       updatecollapserequired(true);
                       updatetotalrequired(true);
                       updateadvancerequired(false);
                   }    
              }   
              break;  
          case "SALARY":
             ptype = paidTo.type;
             if (paidTo.etype  &&  paidTo.type !== paidTo.etype){
                 ptype = paidTo.etype;
             }            
              if (ptype === "employee" || ptype === "promoter"){
                  templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                  derivedtemplate = templates.documentupload;
                  updateNarrationElement(true);
                  updatecollapserequired(false);
                  updatetotalrequired(false);
                  updateadvancerequired(false);
                  updateaddtransaction(false);    
                  updateUploadText("Upload Salary Sheet");
                  updateclassforpercentage("percentagehidden");
                  updaterevisedDocumentType("TYPE3");  
                  updatetaxamountexcluded(true);  
                  updatehidetds(true);      
                  if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".categorization_gridElementExpense") && mainElementCategorize.current.querySelector(".categorization_gridElementExpense").querySelector("div")){
                      mainElementCategorize.current.querySelector(".categorization_gridElementExpense").querySelector("div").style.height = "90%";
                  }
                  updateshowuploadmessage(true);  
              }   
              break;
          case "CAPITAL":
              updaterevisedDocumentType("TYPE2");   
              updatetaxamountexcluded(true);
              updatehidetds(true);
              updatePagination(false);
              GenerateColumns("template2","document_number","date","To Pay","Ref. No.",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
              templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
              derivedtemplate = templates.multilineandlongtext;
              updatewidthcalculatefields([]);
              updatetotalfieldlist(["amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
              updateadvancefieldlist(["document_number","amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
              updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:false,settlementamount:true,adjustment:true});
              updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:true,settlementamount:true,adjustment:true});
              updateconsiderAmountField("net_balance");
              updatedocumentnumberfield("document_number");
              updateNarrationElement(true);
              updatecollapserequired(false);
              updatetotalrequired(false);
              updateadvancerequired(false);
              if (tdefaultTransactionType === "Receipt"){
                  updatepaytitle1("Receivable Amount");
                  updatepaytitle2("Received");
                  updatealternatekeys(['Ref. No.','Receivable Amount','Received']);
                  updatePayCheck("R"); 
              }else{   
                  updatepaytitle1("Payable Amount");
                  updatepaytitle2("Paid");
                  updatealternatekeys(['Ref. No.','Payable Amount','Paid']);
                  updatePayCheck("P"); 
             }  
             break;                              
          case "ADVANCE":
              updaterevisedDocumentType("TYPE2");   
              updateclassforpercentage("percentagevisible");
              updatePagination(false);
              GenerateColumns("template2","document_number","date","To Pay","Ref. No.",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
              templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
              derivedtemplate = templates.multilineandlongtext;
              updatewidthcalculatefields([]);
              updatetotalfieldlist(["amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
              updateadvancefieldlist(["document_number","amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
              updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:false,settlementamount:true,adjustment:true});
              updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:true,settlementamount:true,adjustment:true});
              updateconsiderAmountField("net_balance");
              updatedocumentnumberfield("document_number");
              updateNarrationElement(false);
              updatecollapserequired(false);
              updatetotalrequired(false);
              updatehidetds(false);
              updateadvancerequired(false);
              if (tdefaultTransactionType === "Receipt"){
                  updatepaytitle1("Receivable Amount");
                  updatepaytitle2("Received");
                  updatealternatekeys(['Ref. No.','Receivable Amount','TDS','Received']);
                  updatePayCheck("R"); 
              }else{   
                  updatepaytitle1("Payable Amount");
                  updatepaytitle2("Paid");
                  updatealternatekeys(['Ref. No.','Payable Amount','TDS','Paid']);
                  updatePayCheck("P"); 
             }   
             break;                      
          case "AGAINSTBILLS":
               updatehidetds(false);            
               updaterevisedDocumentType("TYPE1");   
               if (paidTo && selectedTowardsName){
                   ptype = paidTo.type;
                   if (paidTo.etype  &&  paidTo.type !== paidTo.etype){
                       ptype = paidTo.etype;
                   }
                   if (ptype?.toLowerCase() === "vendor"){
                       updatetaxamountexcluded(true);
                       updateclassforpercentage("percentagehidden");
                       updatehidetds(true);
                   }else{
                       updatetaxamountexcluded(false);
                       updateclassforpercentage("percentagevisible");
                       const newdata = {data:[]};
                       newdata.data = taxCalculate(categorizeData.data,TDS,recalculate,taxamountexcluded,getchangedTDSvalues,geteditableTDSvalues,isrefund,getlocation,hidetds,updateRecalculate,revisedDocumentType,paidto,getchangedTransactions,updatechangedTransactions,editedresponse,considerAmountField,ucheckedids); 
                   }    
               }    
               if (tdefaultTransactionType === "Payment"){
                   updatePagination(false);
                   GenerateColumns("template1","document_number","date","To Pay","Bill No. & Date",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                   templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                   derivedtemplate = templates.multiLine;
                   updatewidthcalculatefields(["document_number"]);
                   updatetotalfieldlist(["amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                   updateadvancefieldlist(["document_number","amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                   updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:true,settlementamount:true,adjustment:true});
                   updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:true,settlementamount:true,adjustment:true});
                   updateconsiderAmountField("net_balance");
                   updatedocumentnumberfield("document_number");
                   updatealternatekeys(['Bill No. & Date','Original Amount','Pending Amount','TDS','To Pay','To Allocate','Balance']);
                   updatecollapserequired(true);
                   updatetotalrequired(true);
                   updateadvancerequired(true);
               }else{
                   updatePagination(false);
                   GenerateColumns("template1","document_number","date","To Collect","Bill No. & Date",hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip.considerAmountField,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,itemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
                   templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                   derivedtemplate = templates.multiLine;
                   updatewidthcalculatefields(["document_number"]);
                   updatetotalfieldlist(["amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                   updateadvancefieldlist(["document_number","amount","net_balance","taxamount","cash","adjustment","settlementamount"]);
                   updateshowtotalfieldlist({"document_number":true,"Advance":true,taxamount:true,settlementamount:true,adjustment:true});
                   updateshowadvancefieldlist({"document_number":true,amount:true,"net_balance":true,taxamount:true,settlementamount:true,adjustment:true});
                   updateconsiderAmountField("net_balance");
                   updatedocumentnumberfield("document_number");
                   updatealternatekeys(['Bill No. & Date','Original Amount','Pending Amount','TDS','To Collect','To Allocate','Balance']);
                   updatecollapserequired(true);
                   updatetotalrequired(true);
                   updateadvancerequired(true);
               }
               break;
          default:
              if (paidTo.id === "OTHER BANKS"){
                  templates = Templates(noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone);
                  derivedtemplate = templates.longText;
                  updaterevisedDocumentType("TYPE2");   
                  updateconsiderAmountField("net_balance");
                  updatetaxamountexcluded(true);
                  updatehidetds(true);
                  updateNarrationElement(true); 
              }
              break;    
        }   
       if (templateName === "Income" && selectedIncomeCategoryName.id === "categorizationInitial"){
           return '';
        };
        return derivedtemplate;
     };
 