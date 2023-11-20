

export const nextCategorization = (event,categorized,updatecategorizationDone,getlocation,selectedTowardsName,updatetdefaultTransactionType,updateHitTop,updateHitBottom,updateResetNarration,updateinitthis,updateisedit,updatecollapseprocess,updatechangedTransactions,updateselectedIncomeCategoryName,updateTempPos,updateTemplate,updateupdatebasedata,updateMainTemplateGeneration,updateselectedPurposeName,updatechangedTDSvalues,updateeditableTDSvalues,updateoonlyi,updateoonly,updatecategorizeData,updateclassforpercentage,updatepaidTo,updatepaidto,updateselectedTowardsName,updateUpdateExpenseTemplate,updatedefaultTransactionType,recentcategorizationdone,resetnarration,selectDescription,updatebasedata,dispType,updateexpensetemplate,updateshowLoader) =>{
    updateshowLoader(1);  
        if (event){  
            event.preventDefault();
            event.stopPropagation();
        }   
        if (recentcategorizationdone){
            updatecategorizationDone(true);
            updateisedit(false);
        }   
        localStorage.setItem("itemstatus","");
        const prevRow = parseFloat(localStorage.getItem("pagestart"));
        let foundrow = false;
        let currentRow = 0;
        let iscategorized = false;
        getlocation().state.alldata.data.forEach((data)=>{
            if (data.index > prevRow && !foundrow){
                if (categorized[data.id]){
                    iscategorized = categorized[data.id];
                } 
                currentRow = data.index;
                foundrow = true;
            }; 
        });
        const alength = getlocation().state.alldata && getlocation().state.alldata.data && getlocation().state.alldata.data.length-1;
        updatecollapseprocess(true);
        if (currentRow >= alength || !foundrow ){
            currentRow = getlocation().state.alldata.data.length-1;
            localStorage.setItem("pagestart",currentRow);  
            updateHitTop(true);
            updateHitBottom(false);
            updateResetNarration(!resetnarration);
            localStorage.setItem("itemstatus","Add");   
            updateinitthis(Math.random());     
            if (getlocation().state.alldata.data[currentRow].categorized || iscategorized){      
                localStorage.setItem("itemstatus","Edit");
                updateinitthis(Math.random());     
                updateisedit(true);
            }            
            return;
        }  
        updateHitTop(true);        
        updatedefaultTransactionType(getlocation().state.alldata.data[currentRow].amount > 0 ? "Receipt" : "Payment");
        updatetdefaultTransactionType(getlocation().state.alldata.data[currentRow].amount > 0 ? "Receipt" : "Payment");
        if (selectedTowardsName.id){
            getlocation().state.masterslist.towards.data.forEach((toward)=>{
              if (toward.id === selectedTowardsName.id && toward.inflow_description === "Vendor Refund / Advance"){
                  updatetdefaultTransactionType("Payment");
              }
            }); 
        }  
   
        localStorage.setItem("pagestart",currentRow);  
        const rdata = {};
        rdata.id = "categorizationInitial";
        rdata.name = selectDescription;
        updateResetNarration(!resetnarration);      
        updatechangedTransactions({});
        updateselectedIncomeCategoryName(rdata);
        updateTempPos(currentRow);
        updateTemplate(Math.random());
        updateupdatebasedata(!updatebasedata);
        updateMainTemplateGeneration(1);
        updateMainTemplateGeneration(2);
        updateMainTemplateGeneration(3);
        updateMainTemplateGeneration(4);
        updateMainTemplateGeneration(5);
        updateMainTemplateGeneration(6);
        updateselectedPurposeName("Click to Select");
        const newdata = {"data":[]};
        updatechangedTDSvalues({});
        updateeditableTDSvalues({});
        if (dispType === "Expenses"){
            updateUpdateExpenseTemplate(!updateexpensetemplate);     
        }
        updateoonlyi(0);
        updateoonly(0);
        updateclassforpercentage("percentagehidden");
        updateResetNarration(!resetnarration);
        localStorage.setItem("itemstatus","Add");    
        updateinitthis(Math.random()); 
        updatepaidTo(rdata);
        updatepaidto(rdata);
        updateselectedTowardsName(rdata);   
        updatecategorizeData(newdata);    
        if (getlocation().state.alldata.data[currentRow].categorized || iscategorized){     
            localStorage.setItem("itemstatus","Edit");
            updateinitthis(Math.random());
            updateisedit(true);
        }  
        updateshowLoader(0);  
};  


export const prevCategorization = (event,categorized,updatecategorizationDone,getlocation,selectedTowardsName,updatetdefaultTransactionType,updateHitTop,updateHitBottom,updateResetNarration,updateinitthis,updateisedit,updatecollapseprocess,updatechangedTransactions,updateselectedIncomeCategoryName,updateTempPos,updateTemplate,updateupdatebasedata,updateMainTemplateGeneration,updateselectedPurposeName,updatechangedTDSvalues,updateeditableTDSvalues,updateoonlyi,updateoonly,updatecategorizeData,updateclassforpercentage,updatepaidTo,updatepaidto,updateselectedTowardsName,updateUpdateExpenseTemplate,updatedefaultTransactionType,recentcategorizationdone,resetnarration,selectDescription,updatebasedata,dispType,updateexpensetemplate,updateshowLoader) =>{
    updateshowLoader(1);  
    if (event){  
        event.preventDefault();
        event.stopPropagation();
    }  
    if (recentcategorizationdone){
        updatecategorizationDone(true);
    }    
    updateisedit(false);
    localStorage.setItem("itemstatus","");
    const prevRow = parseFloat(localStorage.getItem("pagestart"));
    let foundrow = false;
    let currentRow = 0;
    let iscategorized = false;
    getlocation().state.alldata.data.slice().reverse().forEach((data)=>{
        if (data.index < prevRow && !foundrow){
            if (categorized[data.id]){
                 iscategorized = categorized[data.id];
            }    
            currentRow = data.index;
            foundrow = true;
        } 
    });
    updatecollapseprocess(true);
    if (currentRow <= 0 || !foundrow){
        currentRow = 0; 
        updateHitTop(false);
        updateHitBottom(true);    
        updateResetNarration(!resetnarration);  
        localStorage.setItem("itemstatus","Add");
        updateinitthis(Math.random());
        if (getlocation().state.alldata.data[currentRow].categorized || iscategorized){
            localStorage.setItem("itemstatus","Edit");
            updateinitthis(Math.random());
            updateisedit(true);
        }          
        return;
    };
    updateHitBottom(true);
    localStorage.setItem("pagestart",currentRow);
    updatedefaultTransactionType(getlocation().state.alldata.data[currentRow].amount > 0 ? "Receipt" : "Payment");
    updatetdefaultTransactionType(getlocation().state.alldata.data[currentRow].amount > 0 ? "Receipt" : "Payment");
    if (selectedTowardsName.id){
        getlocation().state.masterslist.towards.data.forEach((toward)=>{
          if (toward.id === selectedTowardsName.id && toward.inflow_description === "Vendor Refund / Advance"){
              updatetdefaultTransactionType("Payment");
          }
        }); 
    }    
    const rdata = {};
    rdata.id = "categorizationInitial";
    rdata.name = selectDescription;
    updatechangedTransactions({});
    updateselectedIncomeCategoryName(rdata);
    updateTempPos(currentRow); 
    updateTemplate(Math.random());  
    updateupdatebasedata(!updatebasedata);
    updateMainTemplateGeneration(1);
    updateMainTemplateGeneration(2);
    updateMainTemplateGeneration(3);
    updateMainTemplateGeneration(4);
    updateMainTemplateGeneration(5);
    updateMainTemplateGeneration(6);
    updateselectedPurposeName("Click to Select");
    updatechangedTDSvalues({});
    updateeditableTDSvalues({});
    const newdata = {"data":[]};        
    if (dispType === "Expenses"){
        updateUpdateExpenseTemplate(!updateexpensetemplate);     
    }
    updateoonlyi(0);
    updateoonly(0);
    updateclassforpercentage("percentagehidden");
    updateResetNarration(!resetnarration);
    localStorage.setItem("itemstatus","Add");
    updateinitthis(Math.random());  
    updateselectedTowardsName(rdata);    
    if (getlocation().state.alldata.data[currentRow].categorized || iscategorized){
        localStorage.setItem("itemstatus","Edit");
        updateinitthis(Math.random());
        updateisedit(true);
    }   
    setTimeout(()=>{
        updatepaidTo(rdata);
        updatepaidto(rdata);   
        updatecategorizeData(newdata);   
    },1000);   
    updateshowLoader(0);        
};


  