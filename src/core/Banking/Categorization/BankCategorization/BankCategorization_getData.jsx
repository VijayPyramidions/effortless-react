import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import {getTemplate} from './GetCategorizationTemplate';
import { StringtoNumber,showPlaceholder } from "../BankDetails/NumberConvertor";

export const getContraBanks = (organization,user,updatecontraBanks,openSnackBar,updateshowLoader) =>{
    updateshowLoader(1);   
    const url = `/organizations/${organization?.orgId}/bank_accounts/connected_bankings`;
    RestApi(
        url,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user?.activeToken}`,
          },
        },
      )
        .then((res) => {
          updateshowLoader(0); 
          if (res && !res.error) {
            if (res.message) {
              openSnackBar({
                message: res.message,
                type: MESSAGE_TYPE.INFO,
              });
            } else { 
               let cdata = res.data.connected_banking;
               cdata = cdata.concat(res.data.other_bank_accounts);
               updatecontraBanks(cdata);
            };
          };           
        })
        .catch((e) => {
          updateshowLoader(0); 
          openSnackBar({
            message: e.message,
            type: MESSAGE_TYPE.INFO,
          });
        });
};


export const fetchdocumentreference = (paidTo,organization,user,updateadvancevoucher,updateVReference,updateshowLoader,openSnackBar,updatespecialTotal,editadvancenumber) =>{
    if (paidTo?.name?.toLowerCase() === "other banks"){
        return;
    }        
    updateshowLoader(1);   
    const url = `/organizations/${organization?.orgId}/yodlee_bank_accounts/advance_voucher_reference`;
    RestApi(
        url,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user?.activeToken}`,
          },
        },
      )
        .then((res) => {
          updateshowLoader(0); 
          if (res && !res.error) {
            if (res.message) {
              openSnackBar({
                message: res.message,
                type: MESSAGE_TYPE.INFO,
              });
            } else if (!res.message){
                if (localStorage.getItem("itemstatus") === "Edit"){
                    updateadvancevoucher(editadvancenumber);
                    updateVReference(editadvancenumber);                                                
                }else if (localStorage.getItem("itemstatus") !== "Edit"){
                    updateadvancevoucher(res.advance_voucher_number);
                    updateVReference(res.advance_voucher_number);
                }    
            }
          }           
        })
        .catch((e) => {
          console.log(e);  
          updateshowLoader(0); 
          openSnackBar({
            message: e.message,
            type: MESSAGE_TYPE.INFO,
          });
        });
};

export const settypes = (templateName,updaterevisedDocumentType,tdefaultTransactionType,updateaddtransaction,paidTo,updatespecialTotal) =>{
    updaterevisedDocumentType("");
    updateaddtransaction(true);
    const templateNam = templateName.split(" ").join("");
    switch (templateNam.toUpperCase()){
        case "EXPENSE":
             break;     
        case "DEPOSIT":
            if (tdefaultTransactionType === "Payment"){          
                updaterevisedDocumentType("TYPE2");                        
            }
            break;
        case "LOANGIVEN-GIVEN":
            if (tdefaultTransactionType === "Payment"){         
                updaterevisedDocumentType("TYPE2");  
            }
            break;
        case "REIMBURSEMENT":   
             if (paidTo?.type?.toLowerCase() === "employee" || paidTo?.type?.toLowerCase() === "promoter"){
                 updaterevisedDocumentType("TYPE1");  
              }
              break;             
        case "LOANGIVEN-REPAID":   
              if (tdefaultTransactionType === "Receipt"){
                  updaterevisedDocumentType("TYPE1");  
              }
              break;                        
        case "LOANBORROWED-TAKEN":
             if (tdefaultTransactionType === "Receipt"){
                updaterevisedDocumentType("TYPE2");  
             }
             break;
        case "LOANBORROWED-REPAID":   
              if (tdefaultTransactionType === "Payment"){
                  updaterevisedDocumentType("TYPE1");  
              }
              break;
        case "LOANTAKEN-TAKEN":
           if (tdefaultTransactionType === "Receipt"){
               updaterevisedDocumentType("TYPE2");  
           }
           break;                      
        case "LOANTAKEN-REPAID":
           if (tdefaultTransactionType === "Payment"){
               updaterevisedDocumentType("TYPE1");  
           }
           break;    
        case "STATUTORYDUES":
            if (tdefaultTransactionType === "Payment"){
                updatespecialTotal(false);
            }    
            break;
        case "EMISCHEDULEUPLOAD":
            updaterevisedDocumentType("TYPE3");  
             break;
        case "REFUND": 
             if (tdefaultTransactionType === "Payment"){
                 if (paidTo?.type?.toLowerCase() === "customer"){  
                     updaterevisedDocumentType("TYPE1");  
                 }    
            }else if (tdefaultTransactionType === "Receipt"){
                 if (paidTo?.type?.toLowerCase() === "vendor"){   
                     updaterevisedDocumentType("TYPE1");               
                 }    
            }   
            break;   
        case "ADVANCE":
            updaterevisedDocumentType("TYPE2");   
             break;                      
        case "AGAINSTBILLS":
            updaterevisedDocumentType("TYPE1");   
             break;
        case "SALARY":
            updaterevisedDocumentType("TYPE3");   
             break;   
        case "CAPITAL":
            updaterevisedDocumentType("TYPE2");   
             break;                  
        default:
            if (paidTo.id === "OTHER BANKS"){
                updaterevisedDocumentType("TYPE2");   
             }
            break;    
      }   
};


export const  addAdvance = (event,mainElementCategorize,paidTo,organization,user,updateadvancevoucher,updateVReference,updateshowLoader,openSnackBar,editadvancenumber,showadvance,updateshowAdvance,updateanothercategorization,updateopModal,updatealertdisplaymessage,updatealertwarning,updatebuttontext1,updatebuttontext2,updateclosebutton,updateAlertOpen,advancefieldlist,documentnumberfield,showAdvance,getlocation,getchangedTransactions,advancedetails,hideTDS,TDS,editedresponse,considerAmountField,getchanged,updatetotalarr,updatespecialTotal) =>{
    event.stopPropagation();
    event.preventDefault();
    const ctrans = getchanged(); 
    fetchdocumentreference(paidTo,organization,user,updateadvancevoucher,updateVReference,updateshowLoader,openSnackBar,updatespecialTotal,editadvancenumber);
    const totarr = showadvance(true,mainElementCategorize,advancefieldlist,documentnumberfield,showAdvance,getlocation,getchangedTransactions,advancedetails,hideTDS,TDS,editedresponse,considerAmountField,ctrans);
    updatetotalarr(totarr);
    if (totarr[totarr.length-1] !== 0){
        if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".addadvanceholder")){
            mainElementCategorize.current.querySelector(".addadvanceholder").style.visibility = "hidden";
        }
        updateshowAdvance(true);
    }else{
        updateanothercategorization(false);   
        updateopModal(true);
        updatealertdisplaymessage("No advance left over to set..");
        updatealertwarning("Information"); 
        updatebuttontext1("");
        updatebuttontext2("Ok");
        updateclosebutton(true);
        updateAlertOpen(true);
    }   
};


export const fetchunsettledBills = (templatereset,paidTo,selectedPurposeName,updaterevisedDocumentType,templateName,tdefaultTransactionType,updateshowLoader,updatecategorizeData,editclicked,updatemodifieddetails,organization,user,updateadvancevoucher,updateVReference,updateshowAdvance,showadvancedeactive,editedresponse,updateeditadvancenumber,revisedDocumentType,updateitemdrawerClickStatus,getchangedTransactions,updatechangedTransactions,taxamountexcluded,updateeditableTDSvalues,updateadvancedetails,specialTotal,updatespecialTotal,domReplacement,updatecurrentPage,updateCatButtonHeight,editadvancenumber,taxCalculate,categorizeData,hidetds,paidto,updateaddtransaction,updaterupdate,selectedTowardsName,openSnackBar,updatedoonlyi,updatedoonly,updatecollapseprocess,considerAmountField,geteditableTDSvalues,getchangedTDSvalues,isrefund,updateeditableAdjustmentvalues,updatechangedTDSvalues,TDS,updatespecialtotallinghelper,autofillselections,updatebasedata,updateupdatebasedata,dispType,contraBanks,updateTemplate,updateisrefund,updateaccountnamefield,updateshowuploadmessage,updatePayCheck,collapsetimer,mainElementCategorize,updateRowHeight,updatePagination,updatetaxamountexcluded,updateNarrationElement,updateclassforpercentage,updatewidthcalculatefields,updatetotalfieldlist,updateadvancefieldlist,updateshowadvancefieldlist,updateconsiderAmountField,updatedocumentnumberfield,updatetotalrequired,updateadvancerequired,updatepaytitle1,updatepaytitle2,updatealternatekeys,updateUploadText,selectedIncomeCategoryName,resettemplate,selectedCategorizationType,updatehidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip,setfocusSelect,residueUpdate,editAdjustmentAmount,editTaxAmount,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,Narration,updateshowtotalfieldlist,updatecollapserequired,noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,templatecolumns,CustomPagination,processRowUpdate,GridHeight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,specialtotallinghelper,getitemdrawerClickStatus,catbuttonheight,getlocation,updateinitthis,advancedetails,updateditclicked,pickerType,recalculate,updateRecalculate,ucheckedids) =>{  
    let advanceBillDetils;
    updateshowLoader(1); 
    updatemodifieddetails(false);
    if (editclicked){
        updatecategorizeData({data:[]});         
    }
    if (revisedDocumentType.toUpperCase() === "TYPE2" && !editclicked && localStorage.getItem("itemstatus")==="Edit"){
        return;
    }
    updaterupdate(0);   
    settypes(templateName,updaterevisedDocumentType,tdefaultTransactionType,updateaddtransaction,paidTo,updatespecialTotal);
    if (paidTo?.etype?.toLowerCase() === "other banks"){
        return;
    }
    let params = {};  
    if (paidTo?.type?.toLowerCase() === "customer"){
        params = {
          "customer_id": paidTo.id,
          "account_id": selectedTowardsName.id
        };
        if (selectedPurposeName.toUpperCase() === "REFUND"){
            params.refund = true;
            params.settled = true;
        }
    }else if (paidTo?.type?.toLowerCase() !== "customer"){
        if (paidTo?.type?.toLowerCase() === "government"){
            params = {
              "government_entity": true,
              "account_id": selectedTowardsName.id
            };
        }else{  
           params = {
             "vendor_id": paidTo.id,
             "account_id": selectedTowardsName.id
           };
        }  
        if (selectedPurposeName.toUpperCase() === "REFUND"){
            params.refund = true;
            params.settled = true;
          };
        }              
    const tquery = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}` ).join('&');
    const query = `?${tquery}`;    
    let url = "";
    if (paidTo?.type?.toLowerCase() === "customer"){
        url = `organizations/${organization?.orgId}/customer_unsettled${query}`;
    }else{
        url = `organizations/${organization?.orgId}/vendor_unsettled${query}`;    
    }
    showadvancedeactive('',categorizeData,pickerType,mainElementCategorize,revisedDocumentType,updateshowAdvance);
    RestApi(
        url,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user?.activeToken}`,
          },
        },
      )
        .then((res) => {
          updateshowLoader(0); 
          if (res && !res.error) {
            if (res.message) {
              openSnackBar({
                message: res.message,
                type: MESSAGE_TYPE.INFO,
              });
            } else { 
                updatedoonlyi(0);
                updatedoonly(0);
                updatecollapseprocess(true);   
                const newdata = {data:[]};
                const deriveddata = newdata.data.concat(res.data);
                newdata.data = deriveddata;
                let counter = 0;
                updateitemdrawerClickStatus();
                if (revisedDocumentType.toUpperCase() === "TYPE2" && localStorage.getItem("itemstatus")==="Edit"){
                    if (editedresponse && editedresponse.categorized_lines && editedresponse.categorized_lines.length > 0 && editedresponse.categorized_lines[0] && editedresponse.categorized_lines[0].advance){
                        updateeditadvancenumber(editedresponse.categorized_lines[0].number);
                    }     
                }
                if (localStorage.getItem("itemstatus") === "Edit" && editclicked){
                    const ndata = [];
                    editedresponse.categorized_lines.forEach((catd)=>{
                      if (!catd.advance){
                          let datafound = false; 
                          newdata.data.map((data) =>{  
                             if (data.id === catd.txn_line_id){
                                 datafound = true; 
                                 if (!data[considerAmountField]){
                                     data[considerAmountField] = showPlaceholder(StringtoNumber(catd.allocated_amount));
                                 }
                             }
                             return data;
                          });  
                          if (!datafound){
                              const n = {};
                              n.amount = catd.original_amount;
                              n.net_balance = catd.pending_amount;                   
                              n.taxable_amount = catd.taxable_amount;
                              n.narration = catd.narration;
                              n.tds_amount = catd.tds_amount;
                              n.id = catd.txn_line_id;
                              n.document_number = catd.number;
                              n.date = catd.date;
                              ndata.push(n);
                          }    
                      }         
                    });  
                    if (ndata.length > 0){
                        const nxdata = {data:ndata};
                        const derivednewdata = nxdata.data.concat(newdata.data); 
                        newdata.data = derivednewdata;
                    }     
                }   
                let onlyadvance = true;
                newdata.data = newdata.data.map((data) =>{  
                    data.taxamount = "0.00";
                    if (data.tds_amount === null || data.tds_amount === undefined || !StringtoNumber(data.tds_amount) ){
                        if (paidto?.type?.toLowerCase() !== "vendor"){     
                            updateeditableTDSvalues(true,data.id);                
                        }    
                    }else{
                        const txamount = StringtoNumber(data.tds_amount);                 
                        data.taxamount = txamount;
                        if (data.taxamount < 0){
                            data.taxamount *= -1;
                        }
                    } 
                    data.cash = "0.00";
                    data.adjustment = "0.00";
                    data.settlementamount = "0.00";
                    data.pendingamount = "0.00";
                    data.notes = "";
                    data.index = counter;
                    data.hide = false;
                    counter += 1;
                    data.checked = false;
                    data.modified = false;                        
                    if (paidto?.type?.toLowerCase() === "vendor" || paidto?.type?.toLowerCase() === "government" || selectedPurposeName?.toUpperCase() === "REFUND"){
                        const pamount = StringtoNumber(data[considerAmountField]);
                        data.cash = pamount;
                        const aamount = StringtoNumber(data.adjustment);
                        data.settlement = data.cash - aamount;
                        if (data.cash < 0){
                            data.hide = true;
                        }                          
                    }else{
                        data.pendingamount = showPlaceholder(data.pendingamount);
                        if (hidetds){
                            data.cash = data[considerAmountField];
                        }
                        if (StringtoNumber(data.amount) < 0 || StringtoNumber(data[considerAmountField]) < 0){
                            data.hide = true;
                        }
                    }    
                    const odata = {};
                    Object.keys(data).forEach((odt)=>{
                        odata[odt] = data[odt];
                    });
                    if (!data.cash){
                        data.cash = 0.00;
                    }
                    data.origdata = odata;
                    data.origdata.taxamount = showPlaceholder(data.taxamount);
                    data.origdata.cash = showPlaceholder(data.cash);
                    data.origdata.adjustment = showPlaceholder(data.adjustment);
                    data.origdata.pendingamount = showPlaceholder(data.pendingamount); 
                    data.taxamount = showPlaceholder(data.taxamount);
                    data.cash = showPlaceholder(data.cash);
                    data.net_balance = showPlaceholder(data.net_balance);
                    data.amount = showPlaceholder(data.amount);
                    data.adjustment = showPlaceholder(data.adjustment);        
                    data.settlementamount = showPlaceholder(data.settlementamount);                
                    if (localStorage.getItem("itemstatus") === "Edit" && editclicked){
                        updateeditableTDSvalues({});
                        updateeditableAdjustmentvalues();    
                        updateeditableTDSvalues(true,data.id);
                        updatechangedTDSvalues(false,data.id);     
                        editedresponse.categorized_lines.forEach((catd)=>{
                             if (catd.advance){
                                 updateeditadvancenumber(catd.number);
                             }
                             updateeditableTDSvalues(true,catd.txn_line_id);
                             updatechangedTDSvalues(false,catd.txn_line_id);     
                             if (catd.txn_line_id === data.id && !catd.advance){
                                 data.adjustment = showPlaceholder(StringtoNumber(catd.allocated_amount));  
                                 data.taxamount =  showPlaceholder(StringtoNumber(catd.tds_amount));
                                 if (!getchangedTransactions()[data.id]){
                                     updatechangedTransactions({},data.id);
                                 }
                                 const pendingBalance = StringtoNumber(data.net_balance) - StringtoNumber(data.adjustment);

                                 updatechangedTransactions({},data.id,data.taxamount,1);
                                 updatechangedTransactions({},data.id,data.adjustment,2);
                                 updatechangedTransactions({},data.id,pendingBalance,3);
                                 data.checked = true;     
                                 data.modified = true;     
                                 const aaamount = StringtoNumber(data.adjustment);
                                 if (isrefund){
                                     data.settlementamount = StringtoNumber(data.cash) + aaamount;  
                                 }else{
                                     data.settlementamount = StringtoNumber(data.cash);                        
                                 }   
                                 data.settlementamount = showPlaceholder(data.settlementamount);    
                                 data[considerAmountField]=showPlaceholder(StringtoNumber(data.cash) + aaamount);
                                 data.cash = showPlaceholder(StringtoNumber(data.cash) + aaamount);
                                //  data.settlementamount = showPlaceholder(StringtoNumber(data.cash) + aaamount);
                             }
                       });
                    }           
                    updateitemdrawerClickStatus(true,data.id);                            
                    return data;
                });
                if (localStorage.getItem("itemstatus") === "Edit" && editclicked){
                    editedresponse.categorized_lines.forEach((catd)=>{
                        if (!catd.advance){
                            onlyadvance = false;
                        }
                    }); 
                    if (onlyadvance){
                        newdata.data = [];
                        editedresponse.categorized_lines.forEach((catd)=>{                       
                           const nndata = {};
                           nndata.document_number = '';
                           nndata.date = '';
                           nndata.amount = 0;
                           nndata.net_balance = 0;
                           nndata.taxableamount = 0;
                           nndata.taxamount = 0;
                           nndata.cash = 0;
                           nndata.adjustment = 0;
                           nndata.id = catd.txn_line_id;
                           nndata.pendingamount = "0.00";
                           nndata.notes = "";
                           nndata.index = counter;
                           nndata.settlementamount = 0;
                           nndata.hide = false; 
                           nndata.taxableamount = catd.taxable_amount;
                           nndata.taxamount = catd.tds_amount;
                           nndata.taxamount = showPlaceholder(nndata.taxamount);
                           nndata.net_balance = showPlaceholder(nndata.net_balance);
                           nndata.cash = showPlaceholder(nndata.cash);
                           nndata.settlementamount = showPlaceholder(nndata.settlementamount);
                           nndata.adjustment = showPlaceholder(nndata.adjustment);      
                           nndata.net_balance = showPlaceholder(nndata.net_balance);
                           newdata.data.push(nndata); 
                       });   
                    }                     
                }                  
                updateadvancedetails();
                if (localStorage.getItem("itemstatus") === "Edit" && !editclicked){
                    updateeditableTDSvalues();
                    updateeditableAdjustmentvalues();
                    newdata.data = [];
                    const addedid = {};
                    counter = 0;
                    editedresponse.categorized_lines.forEach((catd)=>{
                      if (!catd.advance){
                          onlyadvance = false;
                      }
                    });        
                    editedresponse.categorized_lines.forEach((catd)=>{
                       if (catd.advance){
                           updateeditadvancenumber(catd.number);
                           updateadvancedetails(catd);
                           advanceBillDetils=catd;
                       }
                       addedid[catd.txn_line_id] = true;
                       const ndata = {};
                       if (onlyadvance){
                          ndata.document_number = '';
                          ndata.date = '';
                          ndata.amount = 0;
                          ndata.net_balance = 0;
                          ndata.taxableamount = 0;
                          ndata.taxamount = 0;
                          ndata.cash = 0;
                          ndata.adjustment = 0;
                          ndata.id = catd.txn_line_id;
                          ndata.pendingamount = "0.00";
                          ndata.notes = "";
                          ndata.index = counter;
                          ndata.settlementamount = 0;
                          ndata.hide = false; 
                          ndata.taxableamount = catd.taxable_amount;
                          ndata.taxamount = catd.tds_amount;
                          ndata.taxamount = showPlaceholder(ndata.taxamount);
                          ndata.net_balance = showPlaceholder(ndata.net_balance);
                          ndata.cash = showPlaceholder(ndata.cash);
                          ndata.settlementamount = showPlaceholder(ndata.settlementamount);
                          ndata.adjustment = showPlaceholder(ndata.adjustment);     
                          ndata.amount = showPlaceholder(ndata.amount);                       
                          newdata.data.push(ndata);                                                                                       
                       }else if (!onlyadvance){
                          if (!catd.advance){
                              ndata.document_number = catd.number;
                              ndata.date = catd.date;
                              ndata.amount = catd.original_amount;
                              ndata.net_balance = catd.pending_amount;
                              ndata.taxableamount = catd.taxable_amount;
                              ndata.taxamount = catd.tds_amount;
                              ndata.cash = 0;
                              ndata.adjustment = catd.allocated_amount;
                              ndata.id = catd.txn_line_id;
                              ndata.pendingamount = "0.00";
                              ndata.notes = "";
                              ndata.index = counter;
                              ndata.hide = false;  
                                
                              updateeditableAdjustmentvalues(false,catd.txn_line_id);
                              if (!getchangedTransactions()[catd.id]){
                                   updatechangedTransactions({},catd.id);
                              }
                              updateeditableTDSvalues(false,ndata.id);
                              updatechangedTDSvalues(false,ndata.id);
                              const pendingBalance = StringtoNumber(ndata.net_balance) - StringtoNumber(ndata.adjustment);
                              updatechangedTransactions(false,ndata.id,ndata.adjustment,1); 
                              updatechangedTransactions(false,ndata.id,ndata.taxamount,2); 
                              updatechangedTransactions(false,ndata.id,pendingBalance,3);
                            
                              ndata.checked = true;
                              if (paidto?.type?.toLowerCase() === "vendor" || paidto?.type?.toLowerCase() === "government" || selectedPurposeName?.toUpperCase() === "REFUND"){
                                  const pamount = StringtoNumber(ndata[considerAmountField]);
                                  ndata.cash = pamount;
                                  const aamount = StringtoNumber(ndata.adjustment);
                                  ndata.settlementamount = ndata.cash - aamount;
                                  if (ndata.cash < 0){
                                      ndata.hide = true;
                                  }                          
                              }else{
                                  ndata.pendingamount = showPlaceholder(ndata.pendingamount);
                                  if (hidetds){
                                      ndata.cash = ndata[considerAmountField];
                                  }
                                  if (StringtoNumber(ndata.amount) < 0 || StringtoNumber(ndata[considerAmountField]) < 0){
                                      ndata.hide = true;
                                  }
                              }
                              ndata.taxamount = showPlaceholder(ndata.taxamount);
                              ndata.net_balance = showPlaceholder(ndata.net_balance);
                              ndata.cash = showPlaceholder(ndata.cash);
                              ndata.settlementamount = showPlaceholder(ndata.settlementamount);
                              ndata.adjustment = showPlaceholder(ndata.adjustment);    
                              ndata.amount = showPlaceholder(ndata.amount);
                              updateitemdrawerClickStatus(true,ndata.id);
                              newdata.data.push(ndata);                                  
                          }                                                         
                      }     
                      counter += 1;                 
                    });   
                    res.data.forEach((data) =>{
                        if (!addedid[data.id]){
                            newdata.data.push(data);
                        }else{
                            console.log("hit");
                            newdata.data.forEach((dataa)=>{
                                if (dataa.id === data.id){
                                    dataa.account_name = data.account_name;
                                }    
                            });    
                        }
                    });
                }  
                if (editclicked){
                    updatemodifieddetails(true);
                    newdata.data.forEach((data) =>{
                      updateeditableTDSvalues(true,data.id);
                      updatechangedTDSvalues(false,data.id);
                    });
                }

                if (!taxamountexcluded && localStorage.getItem("itemstatus") === "Add"){              
                    newdata.data = taxCalculate(newdata.data,TDS,recalculate,taxamountexcluded,getchangedTDSvalues,geteditableTDSvalues,isrefund,getlocation,hidetds,updateRecalculate,revisedDocumentType,paidto,getchangedTransactions,updatechangedTransactions,editedresponse,considerAmountField,ucheckedids);   
                };

                if (specialTotal){
                    let uniquecheckvalue = "";
                    updatespecialtotallinghelper({});
                    let cbalance = 0;
                    let previd = "";
                    newdata.data.map((data) =>{
                      data.hide = false;
                      if (!specialtotallinghelper[data.document_number]){
                          updatespecialtotallinghelper([],data.document_number);
                      }
                      updatespecialtotallinghelper([],data.document_number,data.id);                    
                      if (uniquecheckvalue !== data.document_number){
                          data.totalthis = true;
                          data.document_number_old = data.document_number;
                          uniquecheckvalue = data.document_number;
                          cbalance = StringtoNumber(data[considerAmountField]);
                          data.settlementamount = showPlaceholder(cbalance);
                          data.osettlementamount = showPlaceholder(cbalance);                          
                          if (previd){
                              updateeditableAdjustmentvalues(true,previd);
                          }    
                      }else{
                          data.totalthis = false;
                          cbalance += StringtoNumber(data[considerAmountField]);
                          data.settlementamount = showPlaceholder(cbalance);    
                          data.osettlementamount = showPlaceholder(cbalance);                          
                          data.document_number_old = data.document_number;
                          data.document_number = "";
                          previd = data.id;
                      }    
                      return data;
                    });
                }
                if (revisedDocumentType.toUpperCase() !== "TYPE2"){
                    if (localStorage.getItem("itemstatus") === "Edit"){ 
                        updatecategorizeData(newdata);
                    }else if (localStorage.getItem("itemstatus") !== "Edit"){
                       const nndata = autofillselections(newdata,specialTotal,getlocation,geteditableAdjustmentvalues,getchangedTransactions,updatechangedTransactions,isrefund,considerAmountField,paidto,hidetds); 
                       updatecategorizeData(nndata);
                    }   
                }
                if (editclicked){
                   localStorage.setItem("itemstatus","Add");
                }                  
                if (!templatereset){
                    updateupdatebasedata(!updatebasedata);
                }   
                if (templatereset){
                    if (dispType !== "Expenses" && dispType !== "Income"){
                        if (selectedTowardsName.etype && selectedTowardsName.etype.toUpperCase() === "OTHER BANKS"){
                            contraBanks.forEach((bank)=>{
                               if (bank.id === selectedTowardsName.id){
                                   updateTemplate(getTemplate(selectedPurposeName,paidTo,updateisrefund,updateVReference,updatespecialTotal,updateaccountnamefield,updateshowuploadmessage,updatePayCheck,collapsetimer,mainElementCategorize,updaterevisedDocumentType,updateRowHeight,updatePagination,updatetaxamountexcluded,updateNarrationElement,updateclassforpercentage,updateaddtransaction,tdefaultTransactionType,selectedTowardsName,taxCalculate,updatewidthcalculatefields,updatetotalfieldlist,updateadvancefieldlist,updateshowadvancefieldlist,updateconsiderAmountField,updatedocumentnumberfield,updatetotalrequired,updateadvancerequired,updatepaytitle1,updatepaytitle2,updatealternatekeys,updateUploadText,selectedIncomeCategoryName,resettemplate,TDS,categorizeData,selectedCategorizationType,updatehidetds,hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,updateshowtotalfieldlist,updatecollapserequired,noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,templatecolumns,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading));
                               }
                            });
                        }else{                        
                            getlocation().state.masterslist.towards.data.forEach((toward)=>{
                                if (toward.id === selectedTowardsName.id){
                                    updateTemplate(getTemplate(selectedPurposeName,paidTo,updateisrefund,updateVReference,updatespecialTotal,updateaccountnamefield,updateshowuploadmessage,updatePayCheck,collapsetimer,mainElementCategorize,updaterevisedDocumentType,updateRowHeight,updatePagination,updatetaxamountexcluded,updateNarrationElement,updateclassforpercentage,updateaddtransaction,tdefaultTransactionType,selectedTowardsName,taxCalculate,updatewidthcalculatefields,updatetotalfieldlist,updateadvancefieldlist,updateshowadvancefieldlist,updateconsiderAmountField,updatedocumentnumberfield,updatetotalrequired,updateadvancerequired,updatepaytitle1,updatepaytitle2,updatealternatekeys,updateUploadText,selectedIncomeCategoryName,resettemplate,TDS,categorizeData,selectedCategorizationType,updatehidetds,hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,getitemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,updateshowtotalfieldlist,updatecollapserequired,noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,templatecolumns,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading));
                                }
                            });
                        }     
                    }else{
                        if (dispType === "Expenses"){
                            updateTemplate(getTemplate("Expense",paidTo,updateisrefund,updateVReference,updatespecialTotal,updateaccountnamefield,updateshowuploadmessage,updatePayCheck,collapsetimer,mainElementCategorize,updaterevisedDocumentType,updateRowHeight,updatePagination,updatetaxamountexcluded,updateNarrationElement,updateclassforpercentage,updateaddtransaction,tdefaultTransactionType,selectedTowardsName,taxCalculate,updatewidthcalculatefields,updatetotalfieldlist,updateadvancefieldlist,updateshowadvancefieldlist,updateconsiderAmountField,updatedocumentnumberfield,updatetotalrequired,updateadvancerequired,updatepaytitle1,updatepaytitle2,updatealternatekeys,updateUploadText,selectedIncomeCategoryName,resettemplate,TDS,categorizeData,selectedCategorizationType,updatehidetds,hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,getitemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,updateshowtotalfieldlist,updatecollapserequired,noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,templatecolumns,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading));
                        }
                        if (dispType === "Income"){
                            updateTemplate(getTemplate("Income",paidTo,updateisrefund,updateVReference,updatespecialTotal,updateaccountnamefield,updateshowuploadmessage,updatePayCheck,collapsetimer,mainElementCategorize,updaterevisedDocumentType,updateRowHeight,updatePagination,updatetaxamountexcluded,updateNarrationElement,updateclassforpercentage,updateaddtransaction,tdefaultTransactionType,selectedTowardsName,taxCalculate,updatewidthcalculatefields,updatetotalfieldlist,updateadvancefieldlist,updateshowadvancefieldlist,updateconsiderAmountField,updatedocumentnumberfield,updatetotalrequired,updateadvancerequired,updatepaytitle1,updatepaytitle2,updatealternatekeys,updateUploadText,selectedIncomeCategoryName,resettemplate,TDS,categorizeData,selectedCategorizationType,updatehidetds,hidetds,updateTemplateColumns,hideTDS,paycheck,paytitle1,paytitle2,editaddstatus,autoFillValues,showtooltip,considerAmountField,geteditableTDSvalues,setfocusSelect,residueUpdate,editAdjustmentAmount,paidto,editTaxAmount,getitemdrawerClickStatus,isrefund,changeCollapse,openUpCard,updateValue,defaultTransactionType,geteditableAdjustmentvalues,updateNarration,specialTotal,Narration,updateshowtotalfieldlist,updatecollapserequired,noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,templatecolumns,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading));
                        }
                    }   
                }  
                domReplacement();   
                updatecurrentPage(-1);
                if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#CategorizeMoveButtons")){
                    updateCatButtonHeight(mainElementCategorize.current.querySelector("#CategorizeMoveButtons").offsetHeight);
                }
                if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".categorization_CategorizeCardMovemobile")){
                    mainElementCategorize.current.querySelector(".categorization_CategorizeCardMovemobile").style.marginTop = "-1px";
                }
                if (revisedDocumentType.toUpperCase() === "TYPE2"){
                    fetchdocumentreference(paidTo,organization,user,updateadvancevoucher,updateVReference,updateshowLoader,openSnackBar,updatespecialTotal,editadvancenumber);
                }
                updateinitthis(Math.random());
                if (localStorage.getItem("itemstatus") === "Edit"){
                    if (onlyadvance && !editclicked && revisedDocumentType.toUpperCase() !== "TYPE2"){
                        fetchdocumentreference(paidTo,organization,user,updateadvancevoucher,updateVReference,updateshowLoader,openSnackBar,updatespecialTotal,editadvancenumber);
                        updateshowAdvance(true);
                    }    
                } 
                if (editadvancenumber){
                    if (((advancedetails && advancedetails.allocated_amount) || advanceBillDetils?.allocated_amount)&& revisedDocumentType.toUpperCase() !== "TYPE2"){
                        updateadvancedetails(advanceBillDetils);
                        updateshowAdvance(true);
                    }    
                }     
                updateditclicked(false);
            }
          }
        })
        .catch((e) => {
          console.log(e);
          updateshowLoader(0); 
          openSnackBar({
            message: e.message,
            type: MESSAGE_TYPE.INFO,
          });
        });
  };

  export const getEntities = (editdata,openSnackBar,updateeditedresponse,organization,user,getlocation,updateshowLoader,updatepaidTo,updatepaidto,updateselectedPurposeName,updateselectedTowardsName,TowardsSelect,updatetriggerContraBanks,mainElementCategorize,updateresettemplate,updateSelectedTowards,updateUpdateTemplate,updatechangedTowards,paidTo,updatemnTransactionType,updateMainTransactionType,updatedispType,contraBanks,updatetemplate,taxidentification,paidto,defaultTransactionType,mobilereduce,pickerType,SelectedTowards,updateinittowards,inittowards,mnTransactionType,updateadvancevoucher,updateVReference,editadvancenumber,showadvance,updateshowAdvance,updateanothercategorization,updateopModal,updatealertdisplaymessage,updatealertwarning,updatebuttontext1,updatebuttontext2,updateclosebutton,updateAlertOpen,getchanged,updatetotalarr,setpaidTo,updatespecialTotal,updatemodifieddetails) =>{
    updateeditedresponse(editdata);
    const searchVal = editdata.party_name;
    const url = `organizations/${organization.orgId}/entities?search=${
        searchVal || ''
    }`;
    RestApi(
        url,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user?.activeToken}`,
          },
        },
      )
      .then((res) => {
        updateshowLoader(0); 
//        if (editdata.party_name){
            getlocation().state.masterslist.towards.data.forEach((toward)=>{
               if (toward.id === editdata.account_id){
                   const etype = toward.entity_type; 
                   if (etype.toUpperCase() === "OTHER_BANK"){
                       toward.purpose.forEach((purpose)=>{                               
                           if (purpose?.toLowerCase() === editdata?.purpose?.toLowerCase()){                     
                               const pto = {};
                               pto.id =  "OTHER BANKS";
                               pto.type = "other banks";
                               pto.etype = "other banks";
                               pto.name = "N/A";
                               updatepaidTo(pto); 
                               updatepaidto(pto);
                               const tow = {};
                               tow.id = toward.id;
                               tow.name = purpose;
                               tow.etype = pto.etype;
                               updateselectedPurposeName(purpose);
                               updateselectedTowardsName(tow);
                               TowardsSelect(tow,updatetriggerContraBanks,mainElementCategorize,updateresettemplate,updateSelectedTowards,updateUpdateTemplate,updatechangedTowards,pto,updatemnTransactionType,updateMainTransactionType,updatedispType,contraBanks,updatepaidTo,updatetemplate,updateselectedTowardsName,getlocation,taxidentification,defaultTransactionType,mobilereduce,pickerType,SelectedTowards,updateselectedPurposeName,updateinittowards,inittowards,mnTransactionType,updatepaidto,addAdvance,organization,user,updateadvancevoucher,updateVReference,updateshowLoader,openSnackBar,editadvancenumber,showadvance,updateshowAdvance,updateanothercategorization,updateopModal,updatealertdisplaymessage,updatealertwarning,updatebuttontext1,updatebuttontext2,updateclosebutton,updateAlertOpen,getchanged,updatetotalarr,setpaidTo,updatespecialTotal,updatemodifieddetails);
                           }  
                        });                    
                   }else{
                      res.data.forEach((party)=>{ 
                         if ((party?.primary_relationship?.toLowerCase() === etype?.toLowerCase() && editdata?.party_name?.toUpperCase() === party?.name?.toUpperCase()) || toward.entity_type?.toLowerCase().indexOf(party.primary_relationship?.toLowerCase()) > -1){
                             toward.purpose.forEach((purpose)=>{                               
                                 if (purpose?.toLowerCase() === editdata.purpose?.toLowerCase()){
                                     const pto = {};
                                     pto.id =  party.id;
                                     pto.type = etype.split("_")[1]?etype.split("_")[0]:etype;
                                     pto.name = editdata.party_name;
                                     updatepaidTo(pto); 
                                     updatepaidto(pto);
                                     const tow = {};
                                     tow.id = toward.id;
                                     tow.name = purpose;
                                     tow.etype = etype.split("_")[1]?etype.split("_")[0]:etype;
                                     updateselectedPurposeName(purpose);
                                     updateselectedTowardsName(tow);
                                     TowardsSelect(tow,updatetriggerContraBanks,mainElementCategorize,updateresettemplate,updateSelectedTowards,updateUpdateTemplate,updatechangedTowards,pto,updatemnTransactionType,updateMainTransactionType,updatedispType,contraBanks,updatepaidTo,updatetemplate,updateselectedTowardsName,getlocation,taxidentification,defaultTransactionType,mobilereduce,pickerType,SelectedTowards,updateselectedPurposeName,updateinittowards,inittowards,mnTransactionType,updatepaidto,addAdvance,organization,user,updateadvancevoucher,updateVReference,updateshowLoader,openSnackBar,editadvancenumber,showadvance,updateshowAdvance,updateanothercategorization,updateopModal,updatealertdisplaymessage,updatealertwarning,updatebuttontext1,updatebuttontext2,updateclosebutton,updateAlertOpen,getchanged,updatetotalarr,setpaidTo,updatespecialTotal,updatemodifieddetails);
                                 }  
                              });
                         }
                     });
                  }       
               }
            }); 
 //       };       
      })
      .catch((e) => {
        console.log(e);  
        updateshowLoader(0); 
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };  



  export const getEditableData = (getlocation,updateshowLoader,updateeditedresponse,organization,user,currentposition,openSnackBar,updatepaidTo,updatepaidto,updateselectedPurposeName,updateselectedTowardsName,TowardsSelect,updatetriggerContraBanks,mainElementCategorize,updateresettemplate,updateSelectedTowards,updateUpdateTemplate,updatechangedTowards,paidTo,updatemnTransactionType,updateMainTransactionType,updatedispType,contraBanks,updatetemplate,taxidentification,paidto,defaultTransactionType,mobilereduce,pickerType,SelectedTowards,updateinittowards,inittowards,mnTransactionType,updateadvancevoucher,updateVReference,editadvancenumber,showadvance,updateshowAdvance,updateanothercategorization,updateopModal,updatealertdisplaymessage,updatealertwarning,updatebuttontext1,updatebuttontext2,updateclosebutton,updateAlertOpen,getchanged,updatetotalarr,setpaidTo,updatespecialTotal,updatemodifieddetails) =>{ 
    const {id} = getlocation().state.alldata.data[`${typeof currentposition ==='undefined' || getlocation().state.alldata.data.length < currentposition ?getlocation().state.row:currentposition}`];
    const url = `/organizations/${organization?.orgId}/bank_txns/${id}`;
    RestApi(
        url,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user?.activeToken}`,
          },
        },
      )
        .then((res) => {
          updateshowLoader(0); 
          if (res && !res.error) {
            if (res.message) {
              openSnackBar({
                message: res.message,
                type: MESSAGE_TYPE.INFO,
              });
            } else { 
                getEntities(res,openSnackBar,updateeditedresponse,organization,user,getlocation,updateshowLoader,updatepaidTo,updatepaidto,updateselectedPurposeName,updateselectedTowardsName,TowardsSelect,updatetriggerContraBanks,mainElementCategorize,updateresettemplate,updateSelectedTowards,updateUpdateTemplate,updatechangedTowards,paidTo,updatemnTransactionType,updateMainTransactionType,updatedispType,contraBanks,updatetemplate,taxidentification,paidto,defaultTransactionType,mobilereduce,pickerType,SelectedTowards,updateinittowards,inittowards,mnTransactionType,updateadvancevoucher,updateVReference,editadvancenumber,showadvance,updateshowAdvance,updateanothercategorization,updateopModal,updatealertdisplaymessage,updatealertwarning,updatebuttontext1,updatebuttontext2,updateclosebutton,updateAlertOpen,getchanged,updatetotalarr,setpaidTo,updatespecialTotal,updatemodifieddetails); 
            };    
          }          
        })
        .catch((e) => {
          console.log(e);  
          updateshowLoader(0); 
          openSnackBar({
            message: e.message,
            type: MESSAGE_TYPE.INFO,
          });
        });
   };
