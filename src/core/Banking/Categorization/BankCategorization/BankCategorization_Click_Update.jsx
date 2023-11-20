import { StringtoNumber,RoundingtheNumber,showPlaceholder } from "../BankDetails/NumberConvertor";

export const ClickUpdate = (categorizeData,clickedID,geteditableAdjustmentvalues,pickerType,clickedProcess,specialTotal,mainElementCategorize,updateucheckedids,getchangedTransactions,updatechangedTransactions,getlocation,getchangedTDSvalues,ucheckedids,updatechangedTDSvalues,paidTo,isrefund,taxCalculate,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,updatecategorizeData,updateUpdateTemplate,hidetds,TDS,revisedDocumentType,taxamountexcluded,selectedTowardsName,updatetemplate,recalc,geteditableTDSvalues,updateRecalculate,paidto,editedresponse,considerAmountField,editclicked)  =>{
            let totaladjusted = 0;
            categorizeData.data.forEach((cats)=>{
                if (cats.id !==  clickedID){               
                    const atamount = cats.adjustment;
                    const checkadamount = StringtoNumber(atamount);
                    totaladjusted += checkadamount;  
                };    
            }); 
            const newdata  = {data:[]};
            newdata.data = categorizeData.data.map((cats)=>{
                if (specialTotal){ 
                    if (cats.id ===  clickedID && !cats.hide && geteditableAdjustmentvalues()[cats.id]){ 
                        if (pickerType === "mobile"){
                            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`) && mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#adjustmentamount")){
                                mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#adjustmentamount").value = undefined;
                                mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#adjustmentamount").value = showPlaceholder(0);
                            };
                            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`) && mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#taxamount")){
                                mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#taxamount").value = undefined;
                                mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#taxamount").value = showPlaceholder(0);
                             };
                        };
                        const brow = localStorage.getItem("pagestart");
                        const bddata = getlocation().state?.alldata?.data[brow];
                        let vamount = bddata?.amount;
                        if (vamount < 0){
                            vamount *= -1; 
                        }
                        let taxamount = 0;
                        if (clickedProcess){  
                            const ttamount = StringtoNumber(cats.taxamount);
                            taxamount = RoundingtheNumber(ttamount); 
                            if (pickerType === "mobile"){
                                if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`) && mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#taxamount")){
                                    mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#taxamount").value = showPlaceholder(taxamount);
                                };
                            }; 
                            const pamount = cats.osettlementamount;
                            const penamount = StringtoNumber(pamount);   // -taxamount;
                            const netamount = vamount - totaladjusted; 
                            if (netamount <= 0){
                                cats.adjustment = 0;
                                cats.checked = false;
                                const uids = {};
                                let foundid = false;
                                Object.keys(ucheckedids).forEach((ids)=>{
                                    if (ids !== cats.id){
                                        uids[ids] = ucheckedids[ids];
                                    }
                                    if (ids === cats.id){
                                        foundid = true;
                                    }
                               });
                               if (!foundid){
                                   uids[cats.id] = true;
                               }
                               updateucheckedids(uids);                           
                           }else if (netamount > 0){
                                 if (netamount >= penamount){
                                     cats.adjustment =  vamount;                   
                                 }else{
                                     cats.adjustment = netamount;
                                 };  
                                 cats.checked = true;        
                                 const uids = {};
                                 Object.keys(ucheckedids).forEach((ids)=>{
                                     if (ids !== cats.id){
                                         uids[ids] = ucheckedids[ids];
                                     }
                                });
                                updateucheckedids(uids);
                          };   
                          cats.adjustment = showPlaceholder(cats.adjustment);
                          if (!getchangedTransactions()[cats.id]){
                              updatechangedTransactions({},cats.id);
                          }
                          const pendingBalance = StringtoNumber(cats.net_balance) - StringtoNumber(cats.adjustment);
                          updatechangedTransactions({},cats.id,cats.taxamount,1);
                          updatechangedTransactions({},cats.id,cats.adjustment,2);
                          updatechangedTransactions({},cats.id,pendingBalance,3);
                      }else{
                         cats.checked = false;
                         const uids = {};
                         let foundid = false;
                         Object.keys(ucheckedids).forEach((ids)=>{
                             if (ids !== cats.id){
                                 uids[ids] = ucheckedids[ids];
                             }
                             if (ids === cats.id){
                                 foundid = true;
                             }
                         });
                         if (!foundid){
                             uids[cats.id] = true;
                         }
                         updateucheckedids(uids);      
                         cats.adjustment = showPlaceholder(0.00);
                         if (hidetds){
                             cats.taxamount = showPlaceholder(0.00);
                         }    
                         if (getchangedTDSvalues()[cats.id]){
                             const nchangedTDSvalues = {};
                             Object.keys(getchangedTDSvalues()).forEach((tkeys)=>{
                                 if (tkeys !== cats.id){
                                     nchangedTDSvalues[tkeys] = getchangedTDSvalues()[tkeys];
                                 }
                             });
                             updatechangedTDSvalues(nchangedTDSvalues);
                         }
                         if (getchangedTransactions()[cats.id]){
                             const nchangedTransactions = {};
                             Object.keys(getchangedTransactions()).forEach((tkeys)=>{
                                 if (tkeys !== cats.id){
                                     nchangedTransactions[tkeys] = getchangedTransactions()[tkeys];
                                 }
                             });
                             updatechangedTransactions(nchangedTransactions);
                         } 
                      }  
                      const cashamount = StringtoNumber(cats.osettlementamount);
                      const adjust = StringtoNumber(cats.adjustment);
                      if (isrefund){                       
                          cats.settlementamount =  cashamount + adjust;                
                      }else{
                          cats.settlementamount =  cashamount - adjust;                          
                      }    
                      cats.settlementamount  = RoundingtheNumber(cats.settlementamount);
                      cats.adjustment = RoundingtheNumber(adjust);
                      cats.taxamount = RoundingtheNumber(taxamount);
                      cats.adjustment = showPlaceholder(cats.adjustment);      
                      cats.taxamount = showPlaceholder(cats.taxamount);  
                      cats.settlementamount = showPlaceholder(cats.settlementamount); 
                    }
                }else if (!specialTotal){         
                   if (cats.id ===  clickedID && !cats.hide){
                       if (pickerType === "mobile"){
                           if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`) && mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#adjustmentamount")){
                               mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#adjustmentamount").value = undefined;
                               mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#adjustmentamount").value = showPlaceholder(0);
                           };
                           if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`) && mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#taxamount")){
                               mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#taxamount").value = undefined;
                               mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#taxamount").value = showPlaceholder(0);
                            };
                       };
                       const brow = localStorage.getItem("pagestart");
                       const bddata = getlocation().state?.alldata?.data[brow];
                       let vamount = bddata?.amount;
                       if (vamount < 0){
                           vamount *= -1; 
                       }
                       if (clickedProcess){  
                           const ttamount = StringtoNumber(cats.taxamount);
                           const taxamount = RoundingtheNumber(ttamount); 
                           if (pickerType === "mobile"){
                               if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`) && mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#taxamount")){
                                   mainElementCategorize.current.querySelector(`[data-id="${cats.id}"]`).querySelector("#taxamount").value = showPlaceholder(taxamount);
                               };
                           }; 
                           const pamount = cats.cash;   // cats[considerAmountField];
                           const penamount = StringtoNumber(pamount);
                           const netamount = vamount - totaladjusted; 
                           const namount = paidTo?.type?.toLowerCase() === "vendor"?StringtoNumber(cats.cash):penamount;
                           if (netamount <= 0){
                               cats.adjustment = 0;
                               cats.checked = false;
                               const uids = {};
                               let foundid = false;
                               Object.keys(ucheckedids).forEach((ids)=>{
                                   if (ids !== cats.id){
                                       uids[ids] = ucheckedids[ids];
                                   }
                                   if (ids === cats.id){
                                       foundid = true;
                                   }
                              });
                              if (!foundid){
                                  uids[cats.id] = true;
                              }
                              updateucheckedids(uids);                           
                          }else if (netamount > 0){
                                if (netamount >=  namount){
                                    cats.adjustment =  namount;                   
                                }else{
                                    cats.adjustment = netamount;
                                };  
                                cats.checked = true;        
                                const uids = {};
                                Object.keys(ucheckedids).forEach((ids)=>{
                                    if (ids !== cats.id){
                                        uids[ids] = ucheckedids[ids];
                                    }
                               });
                               updateucheckedids(uids);
                         };   
                         cats.adjustment = showPlaceholder(cats.adjustment);
                         if (!getchangedTransactions()[cats.id]){
                             updatechangedTransactions({},cats.id);
                         }
                         const pendingBalance = StringtoNumber(cats.net_balance) - StringtoNumber(cats.adjustment);
                         updatechangedTransactions({},cats.id,cats.taxamount,1);
                         updatechangedTransactions({},cats.id,cats.adjustment,2);
                         updatechangedTransactions({},cats.id,pendingBalance,3);
                     }else{
                        cats.checked = false;
                        const uids = {};
                        let foundid = false;
                        Object.keys(ucheckedids).forEach((ids)=>{
                            if (ids !== cats.id){
                                uids[ids] = ucheckedids[ids];
                            }
                            if (ids === cats.id){
                                foundid = true;
                            }
                        });
                        if (!foundid){
                            uids[cats.id] = true;
                        }
                        updateucheckedids(uids);      
                        cats.adjustment = showPlaceholder(0.00);
                        if (hidetds){
                            cats.taxamount = showPlaceholder(0.00);
                        }    
                        if (getchangedTDSvalues()[cats.id]){
                            const nchangedTDSvalues = {};
                            Object.keys(getchangedTDSvalues()).forEach((tkeys)=>{
                                if (tkeys !== cats.id){
                                    nchangedTDSvalues[tkeys] = getchangedTDSvalues()[tkeys];
                                }
                            });
                            updatechangedTDSvalues(nchangedTDSvalues);
                        }
                        if (getchangedTransactions()[cats.id]){
                            const nchangedTransactions = {};
                            Object.keys(getchangedTransactions()).forEach((tkeys)=>{
                                if (tkeys !== cats.id){
                                    nchangedTransactions[tkeys] = getchangedTransactions()[tkeys];
                                }
                            });
                            updatechangedTransactions(nchangedTransactions);
                        } 
                     }
                 };
                 const ttamount = cats.taxamount;
                 const taxamount = StringtoNumber(ttamount);
                 const cashamount = StringtoNumber(cats.cash);
                 const adjust = StringtoNumber(cats.adjustment);
                 console.log(editclicked);
                 if (isrefund || editclicked){  
                     cats.settlementamount =  cashamount + adjust;                
                 }else{
                     cats.settlementamount =  cashamount - adjust;                    
                 } 
                 cats.settlementamount  = RoundingtheNumber(cats.settlementamount);
                 cats.adjustment = RoundingtheNumber(adjust);
                 cats.taxamount = RoundingtheNumber(taxamount);
                 cats.adjustment = showPlaceholder(cats.adjustment);      
                 cats.taxamount = showPlaceholder(cats.taxamount);   
                 cats.settlementamount = showPlaceholder(cats.settlementamount);                
               }  
               return cats;
            });
            if (!taxamountexcluded){
                newdata.data = taxCalculate(newdata.data,TDS,recalc,taxamountexcluded,getchangedTDSvalues,geteditableTDSvalues,isrefund,getlocation,hidetds,updateRecalculate,revisedDocumentType,paidto,getchangedTransactions,updatechangedTransactions,editedresponse,considerAmountField,ucheckedids); 
            }    
            const brow = localStorage.getItem("pagestart");
            const bddata = getlocation().state?.alldata?.data[brow];
            let vamount = bddata?.amount;
            if (vamount < 0){
                vamount *= -1; 
            }               

            if (pickerType === "mobile"){
                let totalallocate = 0;
                let totalbillsallocated = 0;
                newdata.data.forEach((cats)=>{         
                    let atamount = 0;
                    let checkadamount = 0;
                    if (revisedDocumentType === "TYPE2"){
                        atamount = cats.settlementamount;
                        checkadamount = StringtoNumber(atamount);  
                    }else{    
                        atamount = cats.adjustment;
                        checkadamount = StringtoNumber(atamount);  
                    }   
                    if (checkadamount > 0){
                        totalallocate += checkadamount;   
                        totalbillsallocated += 1; 
                    };    
                }); 
                if (selectedTowardsName && selectedTowardsName.name  && selectedTowardsName.name.toUpperCase() === "EXPENSE"){
                    totalallocate = 0;
                    totalbillsallocated = 0;
                    updatetotalallocated(totalallocate);
                    updatetotalallocatedbills("");
                    updatetotalallocatedtext(showPlaceholder(totalallocate));
                 }                
                if (revisedDocumentType.toUpperCase() ===  "TYPE2"){
                    if (categorizeData && categorizeData.data && categorizeData.data.length > 0){
                        const samount = StringtoNumber(categorizeData.data[0].settlementamount);
                        updatetotalallocated(samount);
                        updatetotalallocatedbills("");
                        updatetotalallocatedtext(showPlaceholder(samount));
                    }    
                }else if (revisedDocumentType && revisedDocumentType.toUpperCase() !==  "TYPE2"){             
                   if (totalallocate > 0){
                       updatetotalallocatedbills(`Selected Bills : ${totalbillsallocated}`);
                       updatetotalallocated(totalallocate);
                       updatetotalallocatedtext(showPlaceholder(totalallocate));
                   };   
                }   
             }
            updatecategorizeData(newdata);
        // }
        updateUpdateTemplate(!updatetemplate);
};