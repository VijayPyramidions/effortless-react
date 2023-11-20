 
 import { StringtoNumber,showPlaceholder,RoundingtheNumber } from "../BankDetails/NumberConvertor";

 export const RowUpdate = (categorizeData,specialTotal,getchangedTransactions,updatechangedTDSvalues,updatechangedTransactions,updatetriggerRowModification,selectedData,newRow,selectedItem,getlocation,paidto,isrefund,geteditableAdjustmentvalues,considerAmountField,revisedDocumentType,getchangedTDSvalues,geteditableTDSvalues,hideTDS,TDS,mainElementCategorize,updateModifiedRowIDS,updatemodifiedRowIDS,modifiedRowIDS,updatecategorizeData,updateupdatelinecounter,updatedoonly,pickerType,updateselectedData,updateselectedItem) =>{ 
         updatetriggerRowModification(false);
         const tamount = showPlaceholder(selectedData.taxamount);
         let aamount = showPlaceholder(selectedData.adjustment);   
         const catsdata = {"data":[]};
         let updatedRow = { ...newRow, isNew: false};
         let editstatus = false;
         let emptyvaluetax = false;
         let emptyvalueadj = false;
         let tadjusted = 0;
         categorizeData.data.forEach((cats)=>{
             if (cats.id !== selectedItem[0]){
                 tadjusted += StringtoNumber(cats.adjustment);
             }    
         });    
         const brow = localStorage.getItem("pagestart");
         const bddata = getlocation().state.alldata.data[brow];
         let vamount = bddata.amount;
         if (vamount < 0){
             vamount *= -1; 
         }        
         const radjusted = vamount - tadjusted;
         const catdata = categorizeData.data.map((cats)=>{
             const adjamount = StringtoNumber(cats.adjustment);  
             if (adjamount){
                 cats.checked = true;
                 cats.modified = true;
             }            
             if (cats.id === selectedItem[0]){
                 if (getchangedTransactions()[cats.id] && !getchangedTransactions()[cats.id].taxamount){
                     updatechangedTransactions({},cats.id,showPlaceholder(cats.taxamount),1);
                 }                 
                 let  txamount1 = StringtoNumber(cats.taxamount);  
                 const txamount2 = StringtoNumber(tamount);
                 if (txamount1 !== txamount2){
                     updatechangedTDSvalues(true,selectedData.id);
                     editstatus = true;
                 }
                 if (!txamount2){
                     emptyvaluetax = true;
                 }
                 cats.adjustment = StringtoNumber(aamount);
                 if (paidto?.type?.toLowerCase() === "vendor"  || specialTotal){ 
                     const aaamount = StringtoNumber(aamount);
                     if (isrefund){
                         cats.settlementamount = StringtoNumber(cats.cash) + aaamount;  
                     }else{
                         cats.settlementamount = StringtoNumber(cats.cash) - aaamount;                        
                     }    
                     if (specialTotal && geteditableAdjustmentvalues()[cats.id]){
                         if (isrefund){
                             cats.settlementamount = StringtoNumber(cats.osettlementamount) + aaamount;                          
                         }else{
                             cats.settlementamount = StringtoNumber(cats.osettlementamount) - aaamount;                          
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
                         updatechangedTransactions(0,cats.id,cats.adjustment,2);
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
                         updatechangedTransactions(0,cats.id,cats.adjustment,2);                        
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
                     cats.settlementamount  =  showPlaceholder(cats.settlementamount);         
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
                        settlementamount = cash + StringtoNumber(aamount); 
                    }else{
                        settlementamount = cash - StringtoNumber(aamount);                 
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
                            cats.settlementamount = cash + StringtoNumber(cats.adjustment);
                        }else{
                            cats.settlementamount = cash - StringtoNumber(cats.adjustment);
                        }    
                        cats.adjustment = showPlaceholder(cats.adjustment);        
                    }  
                    cats.cash = showPlaceholder(cash);
                    if (isrefund){   
                        cats.settlementamount =  cash + StringtoNumber(cats.adjustment);
                    }else{
                        cats.settlementamount =  cash - StringtoNumber(cats.adjustment);                    
                    }    
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
                         if (isrefund){
                             cats.settlementamount = RoundingtheNumber((nbalance + ttamount));   
                         }else{
                             cats.settlementamount = RoundingtheNumber((nbalance - ttamount));                             
                         }    
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
                 if (aamount){
                     updatedRow = { ...newRow, isNew: false, taxamount:showPlaceholder(txamount2), adjustment:cats.adjustment, cash:cats.cash, settlementamount:cats.settlementamount};
                 }else{
                     updatedRow = { ...newRow, isNew: false, checked:false, taxamount:showPlaceholder(txamount2), adjustment:cats.adjustment, cats:cats.cash, settlementamount:cats.settlementamount};
                 }                   
                 return {...cats,taxamount:showPlaceholder(txamount2), adjustment:cats.adjustment,cash:cats.cash,settlementamount:cats.settlementamount};
             }
             return cats;
         });
         catsdata.data  = catsdata.data.concat(catdata);
         const newdata = {"data":[]};
         newdata.data = catsdata.data.map((cdata)=>{
             const ndata = cdata;
             if (getchangedTransactions()[cdata.id]){
                 Object.keys(getchangedTransactions()[cdata.id]).forEach((rkey)=>{
                    ndata[rkey] = showPlaceholder(getchangedTransactions()[cdata.id][rkey]);
                 });
             }
             return ndata;
         });
 
         if (editstatus && (!emptyvalueadj || !emptyvaluetax)){
             newdata.data = newdata.data.map((data) => {
                 if (data.id === selectedItem[0]){
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
              updateModifiedRowIDS(selectedItem[0]);
              updatemodifiedRowIDS(selectedItem[0],1);
              updatetriggerRowModification(true);  
         }  
         if (emptyvalueadj){
             newdata.data = newdata.data.map((data) => {
                 if (data.id === selectedItem[0]){
                     data.modified = false;
                     data.checked = false;
                 }
                 return data;
              });   
              const modified = modifiedRowIDS.filter((data) => {return data.id !== selectedItem[0];});
              updatemodifiedRowIDS(modified,2);
              updateModifiedRowIDS(modified);  
              updatetriggerRowModification(true);                        
         }    
         catsdata.data = newdata.data;
         updatecategorizeData(catsdata);
         updateupdatelinecounter(0);
         updatedoonly(0); 
         updateselectedData({});
         updateselectedItem([]); 
         if (pickerType === "desktop"){  
             const domreplace = setInterval(()=>{                
                if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#datagridbox") && mainElementCategorize.current.querySelector("#datagridbox") && mainElementCategorize.current.querySelector("#datagridbox").querySelector(".MuiDataGrid-selectedRowCount")){
                    clearInterval(domreplace);
                    mainElementCategorize.current.querySelector("#datagridbox").querySelector(".MuiDataGrid-selectedRowCount").innerHTML = '';
                };
             },10);
         }    
         return updatedRow;
 };