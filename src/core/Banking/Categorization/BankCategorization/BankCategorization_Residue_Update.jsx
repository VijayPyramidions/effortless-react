import { StringtoNumber,RoundingtheNumber,showPlaceholder } from "../BankDetails/NumberConvertor";

export const updateResidueRows = (key,datamodified,catsdata,categorizeData,getchangedTransactions,paidto,updatechangedTransactions,geteditableAdjustmentvalues,specialTotal,isrefund,considerAmountField,revisedDocumentType,hideTDS,TDS,updatetriggerRowModification,updatemodifiedRowIDS,updateModifiedRowIDS,getlocation,updatechangedTDSvalues,getchangedTDSvalues,geteditableTDSvalues,modifiedRowIDS,updateupdatelinecounter) =>{
    const tamount = showPlaceholder(datamodified.taxamount);
    let aamount = showPlaceholder(datamodified.adjustment);   
    let editstatus = false;
    let emptyvaluetax = false;
    let emptyvalueadj = false;
    let tadjusted = 0;
    categorizeData.data.forEach((cats)=>{
        if (cats.id !== key){
            tadjusted += StringtoNumber(cats.adjustment);
        }    
    });   
    const brow = localStorage.getItem("pagestart");
    const bddata = getlocation().state.alldata.data[brow];
    let vamount = bddata.amount;
    if (vamount < 0){
        vamount *= -1; 
    }  
    if (StringtoNumber(aamount) > vamount || StringtoNumber(aamount) > (vamount - tadjusted)){
        aamount = showPlaceholder(vamount-tadjusted);
    }         
    const radjusted = vamount - tadjusted;              
    catsdata.data = catsdata.data.map((cats)=>{
        const adjamount = StringtoNumber(cats.adjustment); 
        if (getchangedTransactions()[cats.id] && !getchangedTransactions()[cats.id].taxamount){
            updatechangedTransactions(0,cats.id,showPlaceholder(cats.taxamount),1);
        } 
        if (adjamount){
            cats.checked = true;
            cats.modified = true;
        }            
        if (cats.id === key){
            let txamount1 = StringtoNumber(cats.taxamount);  
            const txamount2 = StringtoNumber(tamount);
            if (txamount1 !== txamount2){
                updatechangedTDSvalues(true,key);
                editstatus = true;
            }
            if (!txamount2){
                emptyvaluetax = true;
            }
            cats.adjustment = StringtoNumber(aamount);
            if (paidto?.type?.toLowerCase() === "vendor" || specialTotal){ 
                const aaamount = StringtoNumber(aamount);
                if (isrefund){
                    cats.settlementamount = StringtoNumber(cats.cash) + aaamount;   
                }else{
                    cats.settlementamount = StringtoNumber(cats.cash) - aaamount;                          
                }    
                if (specialTotal && geteditableAdjustmentvalues()[cats.id]){
                    if (isrefund){
                        cats.settlementamount = StringtoNumber(cats.osettlementamount) + StringtoNumber(aaamount);
                    }else{
                        cats.settlementamount = StringtoNumber(cats.osettlementamount) - StringtoNumber(aaamount);
                    }    
                }                       
                if (cats.settlementamount < 0){
                    cats.adjustment += cats.settlementamount;
                    if (cats.adjustment > radjusted){
                        cats.adjustment = radjusted;
                    }
                    cats.adjustment = showPlaceholder(cats.adjustment);
                    if (isrefund){                        
                        cats.settlementamount = StringtoNumber(cats.cash) + StringtoNumber(cats.adjustment);
                    }else{
                        cats.settlementamount = StringtoNumber(cats.cash) - StringtoNumber(cats.adjustment);
                    }    
                    if (specialTotal && geteditableAdjustmentvalues()[cats.id]){
                        if (isrefund){     
                            cats.settlementamount = StringtoNumber(cats.osettlementamount) + StringtoNumber(cats.adjustment);
                        }else{
                            cats.settlementamount = StringtoNumber(cats.osettlementamount) - StringtoNumber(cats.adjustment);
                        }    
                    }   
                    if (!getchangedTransactions()[cats.id]){
                        updatechangedTransactions({},cats.id);
                    }
                    updatechangedTransactions(0,cats.id,showPlaceholder(cats.adjustment),2);
                    cats.adjustment = showPlaceholder(cats.adjustment);
                }else{
                    if (!isrefund){ 
                        if (cats.adjustment > radjusted){
                            cats.adjustment = radjusted;
                        }   
                    }else if (isrefund){ 
                        if (StringtoNumber(aamount) < radjusted){
                            cats.adjustment = aamount;
                        }else{
                            cats.adjustment = radjusted;                               
                        }
                    }                           
                    if (!getchangedTransactions()[cats.id]){
                        updatechangedTransactions({},cats.id);
                    }
                    updatechangedTransactions(0,cats.id,showPlaceholder(cats.adjustment),2);
                    if (isrefund){
                        cats.settlementamount = StringtoNumber(cats.cash) + StringtoNumber(cats.adjustment);  
                    }else{
                        cats.settlementamount = StringtoNumber(cats.cash) - StringtoNumber(cats.adjustment);  
                    }                            
                    if (specialTotal && geteditableAdjustmentvalues()[cats.id]){
                        if (isrefund){
                            cats.settlementamount = StringtoNumber(cats.osettlementamount) + StringtoNumber(cats.adjustment);
                        }else{
                            cats.settlementamount = StringtoNumber(cats.osettlementamount) - StringtoNumber(cats.adjustment);
                        }    
                    }     
                    cats.adjustment = showPlaceholder(cats.adjustment);      
                }    
                cats.settlementamount = showPlaceholder(cats.settlementamount);             
            }else{
               let cash = StringtoNumber(cats[considerAmountField]) - txamount1;
               if (cash < 0){
                   txamount1 = StringtoNumber(cats[considerAmountField]);
                   cash = 0;
                   updatechangedTransactions(0,cats.id,showPlaceholder(txamount1),1);
                   aamount = 0;
                   cats.adjustment = showPlaceholder(aamount);
                   cats.taxamount = showPlaceholder(txamount1);
                   cats.checked = false;
               }
               let settlementamount = 0;
               if (isrefund){                   
                   settlementamount = cash +  StringtoNumber(aamount);
               }else{
                   settlementamount = cash -  StringtoNumber(aamount);
               }    
               if (settlementamount < 0){
                   cats.adjustment += settlementamount;
                   if (cats.adjustment > radjusted){
                       cats.adjustment = radjusted;
                   }
                   cats.adjustment = showPlaceholder(cats.adjustment);
                   if (isrefund){
                       cats.settlementamount = cash + StringtoNumber(cats.adjustment);
                   }else{
                       cats.settlementamount = cash - StringtoNumber(cats.adjustment);                      
                   }    
                   updatechangedTransactions(0,cats.id,showPlaceholder(cats.adjustment),2);                   
               }else{
                    if (!isrefund){ 
                        if (cats.adjustment > radjusted){
                            cats.adjustment = radjusted;
                        }   
                    }else if (isrefund){ 
                        if (StringtoNumber(aamount) < radjusted){
                            cats.adjustment = aamount;
                        }
                    }    
                    if (!getchangedTransactions()[cats.id]){
                        updatechangedTransactions({},cats.id);
                    }    
                    updatechangedTransactions(0,cats.id,showPlaceholder(cats.adjustment),2);                                           
                    if (isrefund){  
                        cats.settlementamount =  cash + StringtoNumber(cats.adjustment); 
                    }else{
                        cats.settlementamount =  cash - StringtoNumber(cats.adjustment);                            
                    }    
                    cats.adjustment = showPlaceholder(cats.adjustment);
               }                          
               cats.cash = showPlaceholder(cash);
               cats.settlementamount  =  showPlaceholder(cats.settlementamount);
            } 
            if (cats.origdata){
                if (aamount !==  cats.origdata.adjusted){ 
                    editstatus = true;
                };
            }   
            const aamount1 = StringtoNumber(aamount);                
            if (!aamount1){
                emptyvalueadj = true;
            }
            if (revisedDocumentType.toUpperCase() === "TYPE2"){
                const currentpos = localStorage.getItem("pagestart");
                let vaamount = getlocation().state.alldata.data[currentpos].amount; 
                if (vaamount < 0){
                    vaamount *= -1;
                }
                const {amount,taxamount,adjustment} = cats;
                cats.amount = amount;
                cats.adjustment = adjustment;
                let nbalance = vaamount;
                const taxamt = taxamount; 
                if (!getchangedTDSvalues()[cats.id] || geteditableTDSvalues()[cats.id]){
                    let ttamount = 0.00;
                    if (!hideTDS){
                        ttamount = nbalance * (TDS/100);
                    }    
                    ttamount  = RoundingtheNumber(ttamount);   
                    nbalance += ttamount;
                    cats[considerAmountField] = RoundingtheNumber(nbalance);
                    cats.settlementamount = RoundingtheNumber((nbalance - ttamount));   
                    cats.taxamount = showPlaceholder(ttamount); 
                }else{
                    let ttamount = 0;
                    if (!hideTDS){
                        ttamount = StringtoNumber(taxamt);                          
                    }    
                    ttamount  = RoundingtheNumber(ttamount); 
                    nbalance += ttamount;
                    cats[considerAmountField] = RoundingtheNumber(nbalance);
                    if (isrefund){  
                        cats.settlementamount = RoundingtheNumber((nbalance + ttamount));    
                    }else{
                        cats.settlementamount = RoundingtheNumber((nbalance - ttamount));                              
                    }    
                }   
                cats[considerAmountField] =  showPlaceholder(cats[considerAmountField]);
                cats.settlementamount = showPlaceholder(cats.settlementamount);     
            }
            return {...cats,taxamount:showPlaceholder(txamount2), adjustment:aamount,cash:cats.cash,settlementamount:cats.settlementamount};
        }
        return cats;
    });
    const newdata = {"data":[]};
    newdata.data = catsdata.data.map((cdata)=>{
        const ndata = cdata;
        if (getchangedTransactions()[cdata.id]){
            Object.keys(getchangedTransactions()[cdata.id]).forEach((rkey)=>{
                if (getchangedTransactions()[cdata.id][rkey]){
                    ndata[rkey] = showPlaceholder(getchangedTransactions()[cdata.id][rkey]);
                }    
            });
        }
        return ndata;
    });

    if (editstatus && (!emptyvalueadj || !emptyvaluetax)){
        newdata.data = newdata.data.map((data) => {
            if (data.id === key){
                const adjamount = StringtoNumber(data.adjustment);    
                if (adjamount){ 
                    data.modified = true;
                    data.checked = true;
                }else{
                    data.modified = false;
                    data.checked = false;                      
                }   
            }
            return data;
         });   
         updateModifiedRowIDS(prev =>[...prev,key]);
         updatemodifiedRowIDS(key,1);
         updatetriggerRowModification(true);  
    }  
    if (emptyvalueadj){
        newdata.data = newdata.data.map((data) => {
            if (data.id === key){
                data.modified = false;
                data.checked = false;
            }
            return data;
         });   
         const modified = modifiedRowIDS.filter((data) => {return data.id !== key;});
         updatemodifiedRowIDS(modified,2);
         updateModifiedRowIDS(modified);  
         updatetriggerRowModification(true);                        
    }    
    catsdata.data = newdata.data;
    updateupdatelinecounter(0);
    return catsdata;
};
