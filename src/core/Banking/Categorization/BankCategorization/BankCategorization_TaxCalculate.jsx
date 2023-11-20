import { StringtoNumber,RoundingtheNumber,showPlaceholder } from "../BankDetails/NumberConvertor";

export const taxCalculate = (data,tds,recalc,taxamountexcluded,getchangedTDSvalues,geteditableTDSvalues,isrefund,getlocation,hidetds,updateRecalculate,revisedDocumentType,paidto,getchangedTransactions,updatechangedTransactions,editedresponse,considerAmountField,ucheckedids) =>{
    let returndata = data;
    if (!data || (data && data.length === 0) || hidetds){
        return returndata;
    }
    const brow = localStorage.getItem("pagestart");
    const bddata = getlocation().state.alldata.data[brow];
    let vamount = bddata.amount;
    if (vamount < 0){
        vamount *= -1; 
    }       
    if (!taxamountexcluded && data && data.length > 0){
        returndata = data.map((categorize)=>{
          let tadjusted = 0;
          data.forEach((cats)=>{
              if (cats.id !== categorize.id){
                  tadjusted += StringtoNumber(cats.adjustment);
              }    
          });      
          const radjusted = vamount - tadjusted;   
          if (!getchangedTDSvalues()[categorize.id] && geteditableTDSvalues()[categorize.id]){
              const {amount,adjustment,net_balance,taxable_amount,tds_amount} = categorize;
              let tamount  = 0;
              if (taxable_amount === undefined || taxable_amount === null){
                  tamount = StringtoNumber(amount);
              }else if (taxable_amount !== undefined && taxable_amount !== null){
                  if (paidto?.type?.toLowerCase() === "vendor"){
                      tamount = StringtoNumber(tds_amount);
                  }else{
                      tamount = StringtoNumber(taxable_amount); 
                  }    
              }   
              if (!hidetds){
                  categorize.taxamount =  tamount * (tds/100);
              }else{
                  categorize.taxamount =  0.00;                   
              }   
              const nbalance = StringtoNumber(net_balance);
              categorize.cash = nbalance - categorize.taxamount;
              categorize.cash  = RoundingtheNumber(StringtoNumber(categorize.cash));
              const aamount = StringtoNumber(adjustment);      
              categorize.adjustment = StringtoNumber(categorize.adjustment);     
              if (isrefund){  
                  categorize.settlementamount =  categorize.cash  + aamount;
              }else{
                  categorize.settlementamount =  categorize.cash  - aamount;                   
              }    
              if (categorize.settlementamount < 0){
                  categorize.adjustment += categorize.settlementamount;
                  if (categorize.adjustment > radjusted){
                      categorize.adjustment = radjusted;
                  }
                  if (isrefund){                      
                      categorize.settlementamount =  categorize.cash  + categorize.adjustment;
                  }else{
                      categorize.settlementamount =  categorize.cash  - categorize.adjustment;                       
                  }    
                  categorize.adjustment = showPlaceholder(categorize.adjustment);                  
              }else{
                  if (recalc && categorize.checked ){
                      categorize.adjustment += categorize.settlementamount;
                  }    
                  if (!isrefund){ 
                      if (categorize.adjustment > radjusted){
                          categorize.adjustment = radjusted;
                      }   
                  }else if (isrefund){ 
                      if (StringtoNumber(aamount) < radjusted){
                          categorize.adjustment = aamount;
                      }
                  }   
                  if (getchangedTransactions()[categorize.id]){
                       updatechangedTransactions(0,categorize.id,categorize.adjustment,2);
                       updatechangedTransactions(0,categorize.id,categorize.taxamount,1);
                  }     
                  if (isrefund){                       
                      categorize.settlementamount =  categorize.cash  + categorize.adjustment;   
                  }else{
                      categorize.settlementamount =  categorize.cash  - categorize.adjustment;                          
                  }    
                  categorize.adjustment = showPlaceholder(categorize.adjustment);      
              }  
              if (localStorage.getItem("itemstatus") === "Edit"){
                  editedresponse.categorized_lines.forEach((catd)=>{
                      if (catd.txn_line_id === categorize.id){
                          categorize.taxamount = catd.tds_amount;
                      }
                  });
              }                
              categorize.settlementamount  = RoundingtheNumber(StringtoNumber(categorize.settlementamount));
              categorize.settlementamount = showPlaceholder(categorize.settlementamount);   
              categorize.taxamount = RoundingtheNumber(StringtoNumber(categorize.taxamount));
              categorize.taxamount = showPlaceholder(categorize.taxamount);
              categorize.cash = RoundingtheNumber(StringtoNumber(categorize.cash));
              categorize.cash = showPlaceholder(categorize.cash);                 
          }else{
              if (revisedDocumentType.toUpperCase() !== "TYPE2"){
                  const {taxamount,adjustment,net_balance} = categorize;
                  const tamount = StringtoNumber(taxamount);  
                  const aamount = StringtoNumber(adjustment); 
                  const nebalance = StringtoNumber(net_balance);                 
                  categorize.cash = nebalance - tamount;
                  categorize.cash  = RoundingtheNumber(StringtoNumber(categorize.cash));
                  if (isrefund){                        
                      categorize.settlementamount =  categorize.cash + aamount;
                  }else{
                      categorize.settlementamount =  categorize.cash - aamount;                      
                  }                    
                  categorize.adjustment = StringtoNumber(categorize.adjustment);
                  if (categorize.settlementamount < 0){
                      categorize.adjustment += categorize.settlementamount;
                      if (categorize.adjustment > radjusted){
                          categorize.adjustment = radjusted;
                      }
                      if (isrefund){                          
                          categorize.settlementamount =  categorize.cash  + categorize.adjustment;                        
                      }else{
                          categorize.settlementamount =  categorize.cash  - categorize.adjustment;                        
                      }    
                      categorize.adjustment = showPlaceholder(categorize.adjustment);
                  }else{
                      if (recalc && categorize.checked){
                          categorize.adjustment += categorize.settlementamount;
                      }    
                      if (categorize.adjustment > radjusted){
                          categorize.adjustment = radjusted;
                      }  
                      if (getchangedTransactions()[categorize.id]){
                          updatechangedTransactions(0,categorize.id,categorize.adjustment,2);
                      }    
                      if (isrefund){                            
                          categorize.settlementamount =  categorize.cash  + categorize.adjustment;   
                      }else{
                          categorize.settlementamount =  categorize.cash  - categorize.adjustment;                              
                      }    
                      categorize.adjustment = showPlaceholder(categorize.adjustment);            
                  }    
              }  
              categorize.settlementamount  = RoundingtheNumber(StringtoNumber(categorize.settlementamount));
              categorize.settlementamount = showPlaceholder(categorize.settlementamount);  
              categorize.cash = RoundingtheNumber(StringtoNumber(categorize.cash));
              if (hidetds){
                  categorize.taxamount = 0.00;
                  categorize.taxamount = showPlaceholder(categorize.taxamount);                 
              }     
              categorize.cash = showPlaceholder(categorize.cash);                
          }
          if (revisedDocumentType.toUpperCase() === "TYPE2"){
              const currentpos = localStorage.getItem("pagestart");
              let vaamount = getlocation().state.alldata.data[currentpos].amount; 
              if (vaamount < 0){
                  vaamount *= -1;
              }
              const {taxamount} = categorize;
              let nbalance = vaamount;
              const taxamt = taxamount; 
              if (!getchangedTDSvalues()[categorize.id] && geteditableTDSvalues()[categorize.id]){
                  let ttamount = 0.00;
                  if (!hidetds){
                      ttamount = nbalance * (tds/100);
                  }    
                  ttamount = RoundingtheNumber(StringtoNumber(ttamount));
                  nbalance += ttamount;
                  categorize[considerAmountField] = RoundingtheNumber(StringtoNumber(nbalance));
                  if (isrefund){                      
                      categorize.settlementamount = RoundingtheNumber(StringtoNumber(nbalance + ttamount));   
                  }else{
                      categorize.settlementamount = RoundingtheNumber(StringtoNumber(nbalance - ttamount));                          
                  }    
                  categorize.taxamount = showPlaceholder(ttamount); 
              }else{
                  let ttamount = 0;
                  if (!hidetds){
                      ttamount = StringtoNumber(StringtoNumber(taxamt));
                  }    
                  ttamount  = RoundingtheNumber(StringtoNumber(ttamount)); 
                  nbalance += ttamount;
                  categorize[considerAmountField] = RoundingtheNumber(StringtoNumber(nbalance));
                  if (isrefund){                      
                      categorize.settlementamount = RoundingtheNumber(StringtoNumber(nbalance + ttamount));    
                  }else{
                      categorize.settlementamount = RoundingtheNumber(StringtoNumber(nbalance - ttamount));                         
                  }    
              }   
              categorize[considerAmountField] =  showPlaceholder(categorize[considerAmountField]);
              categorize.settlementamount = showPlaceholder(categorize.settlementamount);
          }
          return categorize;
       });
    } 
    let ltadjusted = 0;
    returndata.forEach((cats)=>{
      ltadjusted += StringtoNumber(StringtoNumber(cats.adjustment));
    });    
    let rvalue = vamount - ltadjusted;
    const release = false;
    if (rvalue > 0 && release){
        returndata = returndata.map((cats) =>{
           if (StringtoNumber(cats.adjustment) === 0 && `rvalue > 0` && !ucheckedids[cats.id]){
               if (StringtoNumber(cats.cash) > rvalue){
                   cats.adjustment = showPlaceholder(rvalue);
                   rvalue -= StringtoNumber(cats.cash);
                   if (isrefund){ 
                       cats.settlementamount = StringtoNumber(cats.cash) + StringtoNumber(cats.adjustment);
                   }else{
                      cats.settlementamount = StringtoNumber(cats.cash) - StringtoNumber(cats.adjustment);                       
                   }    
                   cats.checked = true;
                   cats.modified = true;   
                   if (!getchangedTransactions()[cats.id]){
                       updatechangedTransactions({},cats.id); 
                   }              
                   updatechangedTransactions(0,cats.id,showPlaceholder(rvalue),2); 
               }else{
                   cats.adjustment = showPlaceholder(cats.cash);
                   rvalue -= StringtoNumber(cats.cash);  
                   if (isrefund){                      
                       cats.settlementamount = StringtoNumber(cats.cash) + StringtoNumber(cats.adjustment);   
                   }else{
                       cats.settlementamount = StringtoNumber(cats.cash) - StringtoNumber(cats.adjustment);   
                   }    
                   cats.checked = true;
                   cats.modified = true;     
                   if (!getchangedTransactions()[cats.id]){
                       updatechangedTransactions({},cats.id); 
                   }           
                   updatechangedTransactions(0,cats.id,showPlaceholder(rvalue),2);            
               }
           }
           return cats;
        });
    }
    returndata = returndata.map((cats) =>{
         if (StringtoNumber(cats.adjustment) === 0){
              cats.checked = false;
              cats.modify = false;
         }
         return cats;
    });  
    updateRecalculate(false);
    return returndata;
  };
