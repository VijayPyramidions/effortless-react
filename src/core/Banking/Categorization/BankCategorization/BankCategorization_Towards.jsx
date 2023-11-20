export const  displayTowardsdropdown = (paidto,updatepurposeDetails,getpaidvalue,typesettings,defaultTransactionType,contraBanks,getlocation,taxidentification,updateSelectedTowards,getpaidtoclone) =>{
         if (localStorage.getItem("itemstatus") === "Edit"){
              return;
         }
         if (getpaidtoclone() && getpaidtoclone().type && getpaidvalue() !== "categorizationInitial"){
            if (getpaidtoclone().id.toUpperCase() === "OTHER BANKS"){
                const purposedetails = [];
                contraBanks.forEach((bankdetails)=>{
                   purposedetails.push(bankdetails.name);
                });
                updatepurposeDetails(purposedetails);
            }else{    
                const newdatas = [];
                getlocation().state.masterslist.towards.data.forEach((toward)=>{   
                   if (toward.entity_type && (toward.entity_type.toUpperCase() === getpaidtoclone().type.toUpperCase() || toward.entity_type.toUpperCase().indexOf(`${getpaidtoclone().type.toUpperCase()}_`) > -1 )){
                       let taxselected = false;
                       taxidentification.forEach((tax)=>{
                          if (getpaidtoclone().name.toUpperCase() === tax.name.toUpperCase()){
                              if (toward.entity_type.toUpperCase() === `${getpaidtoclone().type.toUpperCase()}_${tax.tag.toUpperCase()}`){
                                  taxselected = true;
                                  toward.purpose.forEach((purpose)=>{
                                      if (typesettings[getpaidtoclone()?.type?.toLowerCase()][purpose?.toLowerCase()]?.inflow && defaultTransactionType === "Receipt"){
                                          newdatas[purpose] = true;
                                      }    
                                      if (typesettings[getpaidtoclone()?.type?.toLowerCase()][purpose?.toLowerCase()]?.outflow && defaultTransactionType === "Payment"){
                                          newdatas[purpose] = true;
                                      }    
                                  });
                              }    
                          }                    
                       });
                       if (!taxselected){                    
                           toward.purpose.forEach((purpose)=>{
                              if (typesettings[getpaidtoclone()?.type?.toLowerCase()][purpose?.toLowerCase()]?.inflow && defaultTransactionType === "Receipt"){
                                  newdatas.push(purpose);
                              }    
                              if (typesettings[getpaidtoclone()?.type?.toLowerCase()][purpose?.toLowerCase()]?.outflow && defaultTransactionType === "Payment"){
                                  newdatas.push(purpose);
                              }    
                            });
                       }        
                   }      
                });
                const ndatas = {};
                newdatas.forEach((pdata)=>{
                   if (!ndatas[pdata]){
                       ndatas[pdata] = true;
                   }
                });
                updatepurposeDetails(Object.keys(ndatas));
            }     
            updateSelectedTowards(false);
        };    
};
