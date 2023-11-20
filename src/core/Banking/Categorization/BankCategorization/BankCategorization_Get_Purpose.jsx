export const GetPurpose = (returndata,updatemnTransactionType,updatepurposeDetails,updatecategorizationDone,updatepaidto,selectDescription,mainElementCategorize,templateset,typesettings,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,updateMainTransactionType,getlocation,defaultTransactionType,mnTransactionType,updatechangedTowards,updateselectedPurposeName,updatedispType,updateselectedTowardsName,updateresettemplate,updateshowAdvance,updateclassforpercentage,taxidentification,updatetdsdefaultvalue,updatepaidTo,paidto,updateBottomSheetNumber,updatetriggerContraBanks) =>{
   updatemnTransactionType('');
   updatepurposeDetails([]);
   updatecategorizationDone(false);
   if (!returndata.type){
       updatepaidto({});
       return;
   }
   updatechangedTowards({});
   updateselectedPurposeName(selectDescription);
   if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#advancebutton")){
       mainElementCategorize.current.querySelector("#advancebutton").innerHTML = "";    
   };  
   updatetotalallocated(0);
   updatetotalallocatedbills("");
   updatetotalallocatedtext("");
   updatedispType("Others");
   updatemnTransactionType("Click to Select");
   updateMainTransactionType(mnTransactionType);
   updateselectedTowardsName({"name":selectDescription,"id":"categorizationInitial"});
   updateresettemplate(true);
   templateset(Math.random());
   const newdatas = {};
   updateshowAdvance(false);   
   updateclassforpercentage("percentagehidden");
   getlocation().state.masterslist.towards.data.forEach((toward)=>{   
        if (toward.entity_type && (toward.entity_type.toUpperCase() === returndata.type.toUpperCase() || toward.entity_type.toUpperCase().indexOf(returndata.type.toUpperCase()) > -1)){
            let taxselected = false;
            taxidentification.forEach((tax)=>{
               if (returndata.name.toUpperCase() === tax.name.toUpperCase()){
                   if (toward.entity_type.toUpperCase() === `${returndata.type.toUpperCase()}_${tax.tag.toUpperCase()}`){                     
                       taxselected = true;   
                       toward.purpose.forEach((purpose)=>{
                          if (typesettings[returndata?.type?.toLowerCase()][purpose?.toLowerCase()]?.inflow && defaultTransactionType === "Receipt"){
                              newdatas[purpose] = true;
                          }    
                          if (typesettings[returndata?.type?.toLowerCase()][purpose?.toLowerCase()]?.outflow && defaultTransactionType === "Payment"){
                              newdatas[purpose] = true;
                          }    
                       });
                  }    
               }                    
            });
            if (!taxselected){
                toward.purpose.forEach((purpose)=>{
                  if (typesettings[returndata?.type?.toLowerCase()][purpose?.toLowerCase()]?.inflow && defaultTransactionType === "Receipt"){
                      newdatas[purpose] = true;
                  }    
                  if (typesettings[returndata?.type?.toLowerCase()][purpose?.toLowerCase()]?.outflow && defaultTransactionType === "Payment"){
                      newdatas[purpose] = true;
                  }    
                });   
            }    
        }      
   });
   updatepurposeDetails(Object.keys(newdatas));
   const newdata = {};
   newdata.name = selectDescription;
   newdata.id = "categorizationInitial";
   updateselectedTowardsName(newdata);
   updateselectedPurposeName(selectDescription);
   if (returndata.taxpercentage && returndata.taxpercentage > 0){
       updatetdsdefaultvalue(returndata.taxpercentage);
   }else{
       updatetdsdefaultvalue(10);   
   }
   updatepaidTo(returndata);  
   updatepaidto(returndata);    
   updateBottomSheetNumber(false);
   if (returndata.type.toUpperCase() === "OTHER BANKS"){
       updatetriggerContraBanks(true);
   }    
};