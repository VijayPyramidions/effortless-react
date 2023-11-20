
import { StringtoNumber,showPlaceholder,RoundingtheNumber } from "../BankDetails/NumberConvertor";
import '../MuiAddonStyles.css';

export const changeCollapse = (event,id,mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType) =>{
    if (event){
         event.preventDefault();
    }   
    if (id){
        Object.keys(getitemdrawerClickStatus()).forEach(idkey =>{
            if (idkey === id && !getitemdrawerClickStatus()[idkey]){
                updateitemdrawerClickStatus(false,idkey);
            }else{    
                updateitemdrawerClickStatus(true,idkey);
            }    
        });
        if (getitemdrawerClickStatus()[id]){
            updateitemdrawerClickStatus(false,id);
            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${id}"]`) && mainElementCategorize.current.querySelector(`[data-id="${id}"]`).querySelector("#cardopen")){
                mainElementCategorize.current.querySelector(`[data-id="${id}"]`).querySelector("#cardopen").style.display = "none";                
            }  
            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${id}"]`) && mainElementCategorize.current.querySelector(`[data-id="${id}"]`).querySelector("#cardclose")){
                mainElementCategorize.current.querySelector(`[data-id="${id}"]`).querySelector("#cardclose").style.display = "block";                
            }   
            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${id}"]`) && mainElementCategorize.current.querySelector(`[data-id="${id}"]`).querySelector('[rel="nonedit"]')){
                mainElementCategorize.current.querySelector(`[data-id="${id}"]`).querySelector('[rel="nonedit"]').style.display = "block";                
            }                
         }else{
            updateitemdrawerClickStatus(true,id);
            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${id}"]`) && mainElementCategorize.current.querySelector(`[data-id="${id}"]`).querySelector("#cardopen")){
                mainElementCategorize.current.querySelector(`[data-id="${id}"]`).querySelector("#cardopen").style.display = "block";                
            }  
            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${id}"]`) && mainElementCategorize.current.querySelector(`[data-id="${id}"]`).querySelector("#cardclose")){
                mainElementCategorize.current.querySelector(`[data-id="${id}"]`).querySelector("#cardclose").style.display = "none";                
            } 
            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${id}"]`) && mainElementCategorize.current.querySelector(`[data-id="${id}"]`).querySelector('[rel="nonedit"]')){
                mainElementCategorize.current.querySelector(`[data-id="${id}"]`).querySelector('[rel="nonedit"]').style.display = "none";                
            }
         }    
    };
    setTimeout(() =>{
      if (pickerType === "mobile"){  
          Object.keys(getitemdrawerClickStatus()).forEach((ikey)=>{
            if (getitemdrawerClickStatus()[ikey] ){
                if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`)){
                    if (mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]')){
                        let estyle = mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').getAttribute( 'style');;
                        estyle = estyle.split('max-height: 25px !important;').join('');
                        estyle = estyle.split('min-height: 25px !important;').join('');
                        estyle = estyle.split('max-height: unset !important;').join('');
                        estyle = estyle.split('min-height: unset !important;').join('');
                        estyle += `min-height: 25px !important;`;
                        estyle += `max-height: 25px !important;`; 
                        mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').setAttribute("style",estyle);
                    }
                    if (mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div")){
                        let estyle = mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").getAttribute( 'style');;
                        estyle = estyle.split('padding-top: 0px !important;').join('');
                        estyle = estyle.split('padding-top: 45px !important;').join('');
                        estyle = estyle.split('margin-top: 0px !important;').join('');
                        estyle += `padding-top: 45px !important;`;
                        // estyle += `margin-top: 0px !important;`; 
                        mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").setAttribute("style",estyle);
                    }    
                    if (mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").querySelector("div").querySelector("div").querySelector("div")){
//                          mainElementCategorize.current.querySelector(`[data-id="${data.id}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").querySelector("div").querySelector("div").querySelector("div").style.marginTop="0px !important";
                        let estyle = mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").querySelector("div").querySelector("div").querySelector("div").getAttribute( 'style');
                        estyle = estyle.split('margin-top: 0px !important;').join('');
                        estyle = estyle.split('margin-top: -30px !important;').join('');                         
                        estyle += `margin-top: -30px !important;`;
                        mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").querySelector("div").querySelector("div").querySelector("div").setAttribute("style",estyle);
                    }    
                    mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).style.height = "30px";
                    if (mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div")){
                        mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").style.height = "20px";
                        let estyle = mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").getAttribute( 'style');
                        estyle = estyle.split('max-height: 20px !important;').join('');
                        estyle = estyle.split('max-height: unset !important;').join('');
                        mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").setAttribute( 'style',  `${estyle}max-height: 20px !important;`);
                    }   
                }
            }else if (!getitemdrawerClickStatus()[ikey]){
               if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`)){
                   if (mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]')){
                       let estyle = mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').getAttribute( 'style');;
                       estyle = estyle.split('max-height: unset !important;').join('');
                       estyle = estyle.split('min-height: unset !important;').join('');
                       estyle = estyle.split('max-height: 25px !important;').join('');
                       estyle = estyle.split('min-height: 25px !important;').join('');
                       estyle += `max-height: unset !important;`;
                       estyle += `min-height: unset !important;`;
                       mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').setAttribute("style",estyle);
                   }
                   if (mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div")){
                       let estyle = mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").getAttribute( 'style');
                       estyle = estyle.split('padding-top: 0px !important;').join('');                        
                       estyle = estyle.split('padding-top: 45px !important;').join('');
                       estyle = estyle.split('margin-top: 0px !important;').join('');
                       estyle += `padding-top: 0px !important;`;
                       // estyle += `margin-top: 0px !important;`; 
                       mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").setAttribute("style",estyle);
                   }                      
                   if (mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").querySelector("div").querySelector("div").querySelector("div")){
//                           mainElementCategorize.current.querySelector(`[data-id="${data.id}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").querySelector("div").querySelector("div").querySelector("div").style.marginTop="0px !imepotant";
                       let estyle = mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").querySelector("div").querySelector("div").querySelector("div").getAttribute( 'style');
                       estyle = estyle.split('margin-top: 0px !important;').join('');
                       estyle = estyle.split('margin-top: -30px !important;').join('');    
                      //  estyle += `margin-top: 0px !important;`;
                       mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").querySelector("div").querySelector("div").querySelector("div").setAttribute("style",estyle);
                   }                      
                   mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).style.height = "160px";
                   if (mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div")){
                       mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").style.height = "auto";
                       let estyle = mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").getAttribute( 'style');
                       estyle = estyle.split('max-height: 20px !important;').join('');
                       estyle = estyle.split('max-height: unset !important;').join('');
                       mainElementCategorize.current.querySelector(`[data-id="${ikey}"]`).querySelector('[data-field="Details"]').querySelector("div").querySelector("div").setAttribute( 'style',  `${estyle}max-height: unset !important;`);
                   }    
                }                    
            }  
       }); 
    } 
    updateTriggerClickItem(!TriggerClickItem); 
   },1);  
};



export const handleScroll = (mainElementCategorize,geteditableTDSvalues,categorizeData,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem) =>{
    if (pickerType === "desktop"){
        setTimeout(()=>{
           if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#datagridbox")){
               categorizeData.data.forEach((cats)=>{  
                  if (!geteditableTDSvalues()[cats.id]){
                      const element = mainElementCategorize.current.querySelector("#datagridbox").querySelector(`[data-id="${cats.id}"]`);
                      if (element && element.querySelector('[data-field="taxamount"]')){                           
                          const cslist = element.querySelector('[data-field="taxamount"]').classList;
                          element.querySelector('[data-field="taxamount"]').style.background = "none";
                          element.querySelector('[data-field="taxamount"]').style.paddingRight="10px";                              
                          cslist.add("taxamountnoedit");
                      }                          
                  }
                });
            }
       },500);          
    }  
    if (pickerType === "mobile"){
        changeCollapse('','',mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
    }    
};


export const autofillselections = (catdata,specialTotal,getlocation,geteditableAdjustmentvalues,getchangedTransactions,updatechangedTransactions,isrefund,considerAmountField,paidto,hidetds)=>{
    const newdata  = {data:[]};
    const brow = localStorage.getItem("pagestart");
    const bddata = getlocation().state.alldata.data[brow];
    let vamount = bddata.amount;
    if (vamount < 0){
        vamount *= -1; 
    }
    newdata.data = catdata.data.map((cats)=>{
       if (specialTotal){ 
           if (vamount > 0 && !cats.hide && geteditableAdjustmentvalues()[cats.id]){ 
               const ttamount = cats.taxamount;
               const taxamount = StringtoNumber(ttamount);
               let penamount = 0;
               if (vamount <= 0){
                   cats.adjustment = 0;
                   cats.checked = false;  
               }else if (vamount > 0){
                     penamount = StringtoNumber(cats.osettlementamount);
                     if (vamount >= penamount){
                         cats.adjustment = penamount;
                         const newamount = vamount - cats.adjustment;
                         vamount = newamount;
                     }else{
                         cats.adjustment = vamount;
                         vamount = 0;
                     };  
                     cats.checked = true; 
                     if (!cats.adjustment){
                         cats.checked = false;
                     }    
                };   
                if (!getchangedTransactions()[cats.id]){
                    updatechangedTransactions({},cats.id);
                }
                const pendingBalance = StringtoNumber(cats.net_balance) - StringtoNumber(cats.adjustment);
                updatechangedTransactions({},cats.id,cats.taxamount,1);
                updatechangedTransactions({},cats.id,cats.adjustment,2);  
                updatechangedTransactions({},cats.id,pendingBalance,3);
       
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
          if (vamount > 0 && !cats.hide){ 
              const ttamount = cats.taxamount;
              const taxamount = StringtoNumber(ttamount);
              let penamount = 0;
              let pamount = cats[considerAmountField];
              if (paidto?.type?.toLowerCase() === "vendor"){
                  penamount = StringtoNumber(cats.cash);
                  pamount = StringtoNumber(cats.cash);
              }else{
                  penamount = StringtoNumber(cats.cash);
              }
              if (vamount <= 0){
                  cats.adjustment = 0;
                  cats.checked = false;  
              }else if (vamount > 0){
                    if (vamount >= penamount){
                        cats.adjustment = penamount;     // -taxamount;
                        const newamount = vamount - cats.adjustment;
                        vamount = newamount;
                    }else{
                        cats.adjustment = vamount;
                        vamount = 0;
                    };  
                    cats.checked = true; 
                    if (!cats.adjustment){
                        cats.checked = false;
                    }    
               };   
               if (!getchangedTransactions()[cats.id]){
                   updatechangedTransactions({},cats.id);
               }
               const pendingBalance = StringtoNumber(cats.net_balance) - StringtoNumber(cats.adjustment);

               updatechangedTransactions({},cats.id,cats.taxamount,1);
               updatechangedTransactions({},cats.id,cats.adjustment,2);   
               updatechangedTransactions({},cats.id,pendingBalance,3);
            
               if (hidetds){
                   cats.cash = pamount;
               }
               const cashamount = StringtoNumber(cats.cash);
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
               cats.cash = showPlaceholder(cats.cash);  
               cats.settlementamount = showPlaceholder(cats.settlementamount);
          }else{
               const ttamount = cats.taxamount;
               const taxamount = StringtoNumber(ttamount);
               cats.checked = false;
               cats.adjustment = showPlaceholder(0.00);
               if (getchangedTransactions()[cats.id]){
                   const nchangedTransactions = {};
                   Object.keys(getchangedTransactions()).forEach((tkeys)=>{
                       if (tkeys !== cats.id){
                           nchangedTransactions[tkeys] = getchangedTransactions()[tkeys];
                       }
                   });
                   updatechangedTransactions(nchangedTransactions);
               }   
               const cashamount = StringtoNumber(cats.cash);
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
               cats.cash = showPlaceholder(cats.cash);  
               cats.settlementamount = showPlaceholder(cats.settlementamount);
           }
       }    
       return cats;
    });
    return newdata;
};