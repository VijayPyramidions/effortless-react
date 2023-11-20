import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { StringtoNumber,showPlaceholder } from "../BankDetails/NumberConvertor";

export const checkEntriesbeforeUpdate = (organization,user,paidTo,updateshowLoader,changedTowards,categorizeData,revisedDocumentType,updateAlertOpen,getlocation,updatemultipleAutoFill,getchangedTransactions,updateopModal,updateanothercategorization,updatealertdisplaymessage,updatealertwarning,updatebuttontext1,updatebuttontext2,updateclosebutton,updateclickedforallfill,updatebuttonInProcess,openSnackBar,updaterecentcategorizationdone,selectedTowardsName,Narration,defaultTransactionType,totalarr,updatecategorizationDone,considerAmountField,selectedPurposeName,isrefund,updatechangedTransactions,updatetotalarr) =>{
    const updateChangedEntity = () =>{
        const url = `/organizations/${organization?.orgId}/entities/${paidTo.id}/create_entity_type`;
        const postData = {"entity_type":changedTowards?.etype?.toLowerCase()};
        RestApi(
            url,
            {
              method: METHOD.POST,
              headers: {
                Authorization: `Bearer ${user?.activeToken}`,
              },
              payload:postData
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
                   console.log(res);
                };
              };           
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
    const postbillsettlement = () =>{
        updatebuttonInProcess(false);
        updaterecentcategorizationdone(true);
        if (changedTowards?.etype?.toUpperCase() !== changedTowards?.type?.toUpperCase() && (changedTowards?.etype?.toUpperCase() !== "OTHER BANKS" && changedTowards?.etype?.toUpperCase() !== "GOVERNMENT")){
            updateChangedEntity();
        }   
        const brow = localStorage.getItem("pagestart");
        const bddata = getlocation().state.alldata.data[brow];
        let {amount} = bddata;
        if (amount < 0){
            amount *= -1;
        } 
        let postData = {};
        postData = {
             "bank_txn_id": bddata.id,
             "entity_id": paidTo.id,
             "account_id": selectedTowardsName.id,
             "narration":   Narration,
             "type": defaultTransactionType?.toLowerCase() === "receipt"?"receipt_from_party":"payment_to_party",
             "purpose" : selectedPurposeName
         };
         const billslist = [];
         const advance = {};
         Object.keys(getchangedTransactions()).forEach((id) =>{
              const blist = {};
              const postaamount = String(getchangedTransactions()[id].adjustment);
              const postaamount1 = StringtoNumber(postaamount);
              if (postaamount1 > 0){
                  blist.txn_line_id = id;
                  blist.amount = postaamount1;
                  let vdate = null;
                  categorizeData.data.forEach((cats)=>{
                      if (cats.id === id){
                          const posttaxamount = cats.taxamount;
                          const posttaxamount1 = StringtoNumber(posttaxamount);
                          blist.tds_amount = posttaxamount1;
                          blist.original_amount = StringtoNumber(cats.amount);
                          blist.pending_amount = StringtoNumber(cats.net_balance);
                          blist.taxable_amount = StringtoNumber(cats.taxable_amount);   
                          if (cats.account_id){
                              blist.account_id = cats.account_id;
                          }else{
                              blist.account_id = selectedTowardsName.id;
                          }    
                          vdate = cats.date;
                          if (!vdate){
                              vdate = cats.txn_month;
                          }
                          blist.date = vdate;
                          blist.document_number = cats.document_number;
                      } 
                  });
                  if (getchangedTransactions()[id].taxamount){
                      const newamount = getchangedTransactions()[id].taxamount;
                      const posttaxamount2 = StringtoNumber(newamount);
                      blist.tds_amount = posttaxamount2;
                  }
                  billslist.push(blist);
              }     
         });
         postData.bills = billslist;
         postData.amount = amount;
         if (totalarr[totalarr.length-1]){
             if (revisedDocumentType.toUpperCase() === "TYPE2"){
                 let advamt = totalarr[totalarr.length-1];
                 if (advamt < 0){
                     advamt *=  -1;
                 } 
                 advamt -= totalarr[3]; 
                 postData.amount = advamt;
                 const txvalue = totalarr[3];
                 postData.tds_amount = txvalue;
            }else{
                let advamt = totalarr[totalarr.length-1];
                if (advamt < 0){
                    advamt *=  -1;
                } 
                advamt -= totalarr[3]; 
                const txvalue = totalarr[3];
                advance.tds_amount = txvalue;
                advance.amount = advamt;
                postData.advance = advance;
            }    
         }   
         const url = `organizations/${organization?.orgId}/yodlee_bank_accounts/categorization`;
         console.log(postData);
         RestApi(
          url,
          {
            method: METHOD.POST,
            headers: {
               Authorization: `Bearer ${user?.activeToken}`,
            },
            payload:postData
          },
        )
          .then((res) => {
            updateshowLoader(0); 
            if (res && !res.error) {
              if (res.message) {   
                  updateanothercategorization(true);
                  updateopModal(true);
                  updatealertdisplaymessage("Categorization done");
                  updatealertwarning("Information"); 
                  updatebuttontext1("");
                  updatebuttontext2("Ok");
                  updateclosebutton(false);
                  updateAlertOpen(true);                  
              } else if (res){
                  console.log(res);
                  updatebuttonInProcess(true);
              }
            }else{
              if(res.error){
                openSnackBar({
                  message: Object.values(res.error_response[0]).join() || res.message,
                  type: MESSAGE_TYPE.WARNING,
                });
              }
               updatebuttonInProcess(true);
            }
            updatecategorizationDone(true);
  //            enableLoading(false);
          })
          .catch((e) => {
            console.log(e);
            updateshowLoader(0); 
            openSnackBar({
              message: e.message,
              type: MESSAGE_TYPE.WARNING,
            });
            updatebuttonInProcess(true);
          });
    };

    const postuploadeddocument = () =>{
        postbillsettlement();  
    };


    const updateEntries = () =>{
        if (revisedDocumentType === "TYPE1"){
            postbillsettlement();  
        }
        if (revisedDocumentType === "TYPE2"){
            postbillsettlement();  
        }
        if (revisedDocumentType === "TYPE3"){
            postuploadeddocument();  
        }
    };


    const handleModalforTaxamountgreaterthanpendingamount = (adjamount,voucheramount) =>{
        if (Object.keys(getchangedTransactions()).length > 0){
            updateopModal(true);
            updateanothercategorization(false);   
            updatealertdisplaymessage(`The TDS value ${adjamount} is greater than the bill amount of ${voucheramount}`);
            updatealertwarning("Warning !!!"); 
            updatebuttontext1("");
            updatebuttontext2("Ok");
            updateclosebutton(true);
            updateAlertOpen(true);
        }else{
            updateclickedforallfill(true);
            updatemultipleAutoFill(true);
        }
    };
       

    const  handleModalforAllotmentamountgreaterthanbillamount= (adjamount,voucheramount) =>{
           updateopModal(true);
           updateanothercategorization(false);   
           updatealertdisplaymessage(`The adjusted ${adjamount} is greater than the bill amount of ${voucheramount}`);
           updatealertwarning("Warning !!!"); 
           updatebuttontext1("");
           updatebuttontext2("Ok");
           updateclosebutton(true);
           updateAlertOpen(true);
    }; 

    const handleModalforAllotmentamountgreaterthanvoucher = (adjamount,voucheramount) =>{
          updateopModal(true);
          updateanothercategorization(false);   
          updatealertdisplaymessage(`The total adjusted ${adjamount} is greater than ${voucheramount}`);
          updatealertwarning("Warning !!!"); 
          updatebuttontext1("");
          updatebuttontext2("Ok");
          updateclosebutton(true);
          updateAlertOpen(true);
    };

    const handleModalforRecommendadvanceoption = (amount1,amount2,balance) =>{
          updateopModal(true);
          updateanothercategorization(false);   
          updatealertdisplaymessage(`The allocated amount of ${amount1} is less than the transaction amount of ${amount2}. The balance amount of  ${balance} shall be recorded as advance payment/receipt by clicking on add advance button`);
          updatealertwarning("Warning !!!"); 
          updatebuttontext1("");
          updatebuttontext2("Ok");
          updateclosebutton(true);
          updateAlertOpen(true);
    }; 

    if (categorizeData && categorizeData.data && categorizeData.data.length === 0 && revisedDocumentType !== "TYPE3" && paidTo.id !== "OTHER BANKS"){
        updateopModal(true);
        updatealertdisplaymessage("No Transactions to categorize");
        updatealertwarning("Information"); 
        updatebuttontext1("");
        updatebuttontext2("Ok");
        updateclosebutton(true);
        updateAlertOpen(true);     
        updateanothercategorization(false);      
        return; 
    }
    if (revisedDocumentType === "TYPE2"){
        const brow = localStorage.getItem("pagestart");        
        const bddata = getlocation().state.alldata.data[brow];
        let {amount} = bddata;
        if (amount < 0){
            amount *= -1;
        }
        if (paidTo.id !== "OTHER BANKS"){
            const postnnamount1 = StringtoNumber(categorizeData.data[0].settlementamount);
            const postnamount1 = StringtoNumber(categorizeData.data[0][considerAmountField]);
            const posttamount1  =  StringtoNumber(categorizeData.data[0].taxamount);
            const errorvalue1 = postnamount1;
            const errorvalue2 = posttamount1;
            if (postnamount1 < 0){
                handleModalforTaxamountgreaterthanpendingamount(showPlaceholder(errorvalue2),showPlaceholder(errorvalue1));
                return;
            }
            updatetotalarr(["","",postnamount1,posttamount1 ,0,0,postnnamount1]);
        }    
        updatechangedTransactions({});
        updateEntries();  
    }      
    if (revisedDocumentType === "TYPE3"){
        updateEntries();  
    }    
    if (revisedDocumentType === "TYPE1"){
        const brow = localStorage.getItem("pagestart");        
        const bddata = getlocation().state.alldata.data[brow];
        let {amount} = bddata;
        if (amount < 0){
            amount *= -1;
        }
        let totaladjusted  = 0;
        Object.keys(getchangedTransactions()).forEach((ckey)=>{
           const postaamount1 = StringtoNumber(getchangedTransactions()[ckey].adjustment);
           totaladjusted += postaamount1;
        });
        let errorvalue1 = 0;
        let errorvalue2 = 0;
        let errorindbilfound = false;
        let errorindtaxfound = false;
        Object.keys(getchangedTransactions).forEach((ckey)=>{
            categorizeData.data.forEach((cats)=>{
                 if (cats.id === ckey){
                     const postaamount1 = StringtoNumber(cats.adjustment);
                     const postpamount1 = StringtoNumber(cats.cash);
                     if (postpamount1 < 0){
                        const postnamount1 = StringtoNumber(cats[considerAmountField]);
                        const posttamount1 = StringtoNumber(cats.taxamount);
                        errorvalue1 = postnamount1;
                        errorvalue2 = posttamount1;
                        errorindtaxfound = true;                        
                     }
                     if (postaamount1 > postpamount1 && !errorindtaxfound){
                         errorvalue1 = postpamount1;
                         errorvalue2 = postaamount1;
                         if (!isrefund){
                             errorindbilfound = true;
                         }    
                     }                            
                 }
            });
        });  
        let advanceamt = totalarr[totalarr.length-1];
        if (advanceamt < 0){
            advanceamt *= -1;
        }
        if (!advanceamt){
            advanceamt = 0;
        }
        const finaladjusted = totaladjusted + advanceamt; 

        if (finaladjusted < amount){
            updateanothercategorization(false);   
            handleModalforRecommendadvanceoption(showPlaceholder(finaladjusted),showPlaceholder(amount),showPlaceholder(StringtoNumber(amount)-StringtoNumber(finaladjusted)));                
            return;
        }     
        if (errorindtaxfound){
            updateanothercategorization(false);   
            handleModalforTaxamountgreaterthanpendingamount(showPlaceholder(errorvalue2),showPlaceholder(errorvalue1));
            return;
        }     
        if (errorindbilfound){
            updateanothercategorization(false);   
            handleModalforAllotmentamountgreaterthanbillamount(showPlaceholder(errorvalue2),showPlaceholder(errorvalue1));
            return;
        }       
        if (totaladjusted > amount){
            updateanothercategorization(false);   
            handleModalforAllotmentamountgreaterthanvoucher(showPlaceholder(totaladjusted),showPlaceholder(amount));
        }else{
            updateEntries();  
        }
    }    
};    