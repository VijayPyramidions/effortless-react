import { StringtoNumber,RoundingtheNumber,showPlaceholder } from "../BankDetails/NumberConvertor";

export const EditDataUpdate = (getlocation,editedresponse,modifieddetails,updatecategorizeData,considerAmountField,vreference,addtransaction,taxamountexcluded,updaterupdate,rupdate,taxCalculate,TDS,recalculate,getchangedTDSvalues,geteditableTDSvalues,isrefund,updateRecalculate,hidetds,revisedDocumentType,paidto,getchangedTransactions,updatechangedTransactions,ucheckedids) => {
   const newdata = {data:[]}; 
   if (modifieddetails){
       const currentpos = localStorage.getItem("pagestart");
       let vaamount = getlocation().state.alldata.data[currentpos].amount; 
       if (vaamount < 0){
           vaamount *= -1;
       }
       editedresponse?.categorized_lines.forEach((catd)=>{                       
          const nndata = {};
          nndata.document_number = catd.number;
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
          nndata.index = 1;
          nndata.settlementamount = 0;
          nndata.hide = false; 
          nndata[considerAmountField] = vaamount + StringtoNumber(catd.tds_amount);
          nndata.taxableamount = catd.taxable_amount;
          nndata.taxamount = catd.tds_amount;
          nndata.taxamount = showPlaceholder(nndata.taxamount);
          nndata.net_balance = showPlaceholder(nndata.net_balance);
          nndata.cash = showPlaceholder(nndata.cash);
          nndata.settlementamount = showPlaceholder(nndata.settlementamount);
          nndata.adjustment = showPlaceholder(nndata.adjustment);     
          nndata[considerAmountField] = showPlaceholder(nndata[considerAmountField]);     
          nndata.settlementamount = showPlaceholder(vaamount);                  
          newdata.data.push(nndata); 
      });             
   }else{
      updaterupdate(rupdate + 1);
      const currentpos = localStorage.getItem("pagestart");
      let vaamount = getlocation().state.alldata.data[currentpos].amount; 
      if (vaamount < 0){
          vaamount *= -1;
      }
      const ndata  = {};
      ndata.id = vreference;
      ndata.document_number = vreference;
      ndata.amount = "0.00";
      ndata.taxamount = "0.00";
      ndata.cash = "0.00";
      ndata.adjustment = "0.00";
      ndata.settlementamount = "0.00";
      ndata[considerAmountField] = vaamount;
      ndata.notes = "";
      ndata.index =  1;
      ndata.hide = false;
      ndata.taxamount = showPlaceholder(ndata.taxamount);
      ndata.cash =  showPlaceholder(ndata.cash);
      ndata.adjustment =  showPlaceholder(ndata.adjustment);
      ndata.amount =  showPlaceholder(ndata.amount);
      ndata.settlementamount = showPlaceholder(vaamount);
      ndata[considerAmountField] = showPlaceholder(ndata[considerAmountField]);
      if (addtransaction){
          newdata.data.push(ndata);
          if (!taxamountexcluded){
               newdata.data = taxCalculate(newdata.data,TDS,recalculate,taxamountexcluded,getchangedTDSvalues,geteditableTDSvalues,isrefund,getlocation,hidetds,updateRecalculate,revisedDocumentType,paidto,getchangedTransactions,updatechangedTransactions,editedresponse,considerAmountField,ucheckedids);  
          }else{
              ndata.settlementamount  = showPlaceholder(ndata[considerAmountField]);
          }
      }   
      newdata.data.push(ndata);  
   }        
   if (newdata.data.length > 0){
       const nndata = {data:[newdata.data[0]]};
       updatecategorizeData(nndata);
   }    
};


export const EditDataUpdate_next = (categorizeData,advancevoucher,TDS,recalculate,taxamountexcluded,getchangedTDSvalues,geteditableTDSvalues,isrefund,getlocation,hidetds,updateRecalculate,revisedDocumentType,paidto,getchangedTransactions,updatechangedTransactions,editedresponse,considerAmountField,ucheckedids,updateNarration,mainElementCategorize,updateeditableTDSvalues,updatecategorizeData,taxCalculate,modifieddetails) =>{
    const newdata = {data:[]};
    const datanew = categorizeData.data[0];
    newdata.data.push(datanew);
    newdata.data[0].id = advancevoucher;
    newdata.data[0].document_number = advancevoucher;
    updateeditableTDSvalues(true,advancevoucher);
    if (!modifieddetails){
        newdata.data = taxCalculate(newdata.data,TDS,recalculate,taxamountexcluded,getchangedTDSvalues,geteditableTDSvalues,isrefund,getlocation,hidetds,updateRecalculate,revisedDocumentType,paidto,getchangedTransactions,updatechangedTransactions,editedresponse,considerAmountField,ucheckedids);
    }     
    if (localStorage.getItem("itemstatus") === "Edit"){
        if (editedresponse && editedresponse.categorized_lines && editedresponse.categorized_lines.length > 0 && editedresponse.categorized_lines[0] && editedresponse.categorized_lines[0].advance){
             newdata.data[0].taxamount = editedresponse.categorized_lines[0].tds_amount;
        }  
        let  nbalance = StringtoNumber(newdata.data[0].net_balance);
        const ttamount = RoundingtheNumber(newdata.data[0].taxamount);
        nbalance += ttamount;
        newdata.data[0][considerAmountField] = RoundingtheNumber(nbalance);                         
        if (isrefund){
            newdata.data[0].settlementamount = RoundingtheNumber((nbalance + ttamount));   
        }else{
            newdata.data[0].settlementamount = RoundingtheNumber((nbalance - ttamount));                             
        }  
        newdata.data[0].settlementamount = showPlaceholder(newdata.data[0].settlementamount);                      
        setTimeout(()=>{   
            updateNarration(editedresponse.categorization_narration);
            if (mainElementCategorize && mainElementCategorize.current &&  mainElementCategorize.current.querySelector(".categorization_textEntry")){
                mainElementCategorize.current.querySelector(".categorization_textEntry").querySelector("textarea").innerHTML = editedresponse.categorization_narration;
            };    
        },2000);    
    }
    updatecategorizeData(newdata);    
};

export const DataandTemplateset = (taxCalculate,TDS,recalculate,taxamountexcluded,getchangedTDSvalues,geteditableTDSvalues,isrefund,getlocation,hidetds,updateRecalculate,revisedDocumentType,paidto,getchangedTransactions,updatechangedTransactions,editedresponse,considerAmountField,ucheckedids,categorizeData,updateTemplate,updatecategorizeData,dispType,selectedTowardsName,contraBanks,templateset,selectedPurposeName) =>{
    const newdata = {data:[]};  
    newdata.data = taxCalculate(categorizeData.data,TDS,recalculate,taxamountexcluded,getchangedTDSvalues,geteditableTDSvalues,isrefund,getlocation,hidetds,updateRecalculate,revisedDocumentType,paidto,getchangedTransactions,updatechangedTransactions,editedresponse,considerAmountField,ucheckedids);
    if (newdata && newdata.data && newdata.data.length > 0){   
        updatecategorizeData(newdata);  
        updateTemplate(Math.random());
        if (dispType === "Expenses" || dispType === "Income"){
            if (dispType === "Expenses"){
                templateset("Expense");
            }   
            if (dispType === "Income"){
                templateset("Income");
            }   
         }else if (dispType !== "Expenses" || dispType !== "Income"){
               if (selectedTowardsName.etype && selectedTowardsName.etype.toUpperCase() === "OTHER BANKS"){
                   contraBanks.forEach((bank)=>{
                      if (bank.id === selectedTowardsName.id){
                          templateset(selectedPurposeName);
                      }
                   });
               }else{                
                   getlocation().state.masterslist.towards.data.forEach((toward)=>{
                      if (toward.id === selectedTowardsName.id){
                          templateset(selectedPurposeName);
                      };
                   });
               }    
        }             
    }      
};