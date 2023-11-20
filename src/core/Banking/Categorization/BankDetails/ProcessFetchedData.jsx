
   export const processFetchedData = (res,firsttime,firsttimeset,applyclicked,updateshowLoader,previousDataFetch,updateBankTransactions,updatecurrentPage,updateTotalPages,updateCompletedPages,updateApplyClicked,completedPages,BankTransactions,updatederivedTransactions,derivedTransactions) =>{
        const newdata = res;
        const simgroups = {};
        let count = 0;
        updateshowLoader(0);
        newdata.data.forEach((data)=>{                                          
            if (data.similarity_group &&  data.similarity_group !== "none"){
                if (!simgroups[data.similarity_group]){
                    simgroups[data.similarity_group] = {};
                    simgroups[data.similarity_group].subcounts = 0;
                    if (data.group_data && data.group_data.length > 0){
                        simgroups[data.similarity_group].subcounts = data.group_data.length-1;
                    }    
                    simgroups[data.similarity_group].counts = [];
                }
                simgroups[data.similarity_group].counts.push(count); 
            }
            count += 1;
        });
        if (newdata.data[0]){ 
            let openingbal = 0;                        
            if (!newdata.data[0].group_data){
                if (newdata.data[0].running_balance >= 0){
                    openingbal = newdata.data[0].running_balance - (newdata.data[0].amount);
                }else{
                    openingbal = newdata.data[0].running_balance + (newdata.data[0].amount);                            
                }    
            }else if (newdata.data[0].group_data){
                if (newdata.data[0].running_balance >= 0){
                    openingbal = newdata.data[0].running_balance - (newdata.data[0].group_amount);
                }else{
                    openingbal = newdata.data[0].running_balance + (newdata.data[0].group_amount);                            
                }  
            }
            openingbal = Math.round(openingbal * 100) / 100;
            let str = String(openingbal);
            str = str.split(".");
            if (str[1] && str[1].length < 2){
                str[1] += "0";
            }
            if (!str[1]){
                str[1] = "00";
            }
            const strreplaced = `${str[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")}.${str[1]}`;
            newdata.data[0].formatted_opening_balance = strreplaced;
            newdata.data[0].opening_balance = openingbal;
        }    

        Object.keys(simgroups).forEach((skey)=>{
            for (let skeys = 0; skeys < simgroups[skey].subcounts; skeys += 1){
                 const index = simgroups[skey].counts[skeys];
                 newdata.data = newdata.data.slice(0, index).concat(newdata.data.slice(index + 1));         
            }
        });
        
        if (applyclicked){
            updateBankTransactions(newdata);
            if (newdata.data.length > 0){                          
                updatecurrentPage(0);
                updateTotalPages(newdata.pages);
                setTimeout(()=>{
                    updateCompletedPages(completedPages+1);
                    updateApplyClicked(false);
                },2000);
            }; 
            return;
        }
        setTimeout(()=>{
            updateBankTransactions(newdata);                      
        },2000);    
        if (BankTransactions && BankTransactions.data && BankTransactions.data.length > 0){  
            if (previousDataFetch){
                if (newdata.data.length > 0){
                    if (newdata.pages > 1){
                        if (firsttimeset){ 
                            const derivedtransactions = {};
                            Object.keys(BankTransactions).forEach((datakey)=>{
                               if (datakey !== "data"){
                                   derivedtransactions[datakey] = BankTransactions[datakey];
                               }  
                            });   
                            updateTotalPages(newdata.pages);
                        }    
                        const transactions = newdata.data;                                  
                        if (derivedTransactions.data){
                            const newTransactions = derivedTransactions.data.concat(transactions);  
                            derivedTransactions.data = newTransactions;    
                        }else{
                            derivedTransactions.data = transactions;
                        };  
                        updatederivedTransactions(derivedTransactions);                    
                        updateCompletedPages(completedPages+1);
                   }else{
                        const transactions = res.data;
                        const newTransactions = transactions.concat(BankTransactions.data);   
                        const ntransactions  = {};
                        Object.keys(BankTransactions).forEach((datakey)=>{
                           if (datakey !== "data"){
                               ntransactions[datakey] = BankTransactions[datakey];
                           }  
                       });      
                       ntransactions.data = newTransactions;                                          
                       updateBankTransactions(ntransactions);                              
                   }
                }    
                if (newdata.pages > 1){                        
                    updateCompletedPages(completedPages+1);   
                }                            
            }else{
                if (newdata.data.length > 0){
                    const transactions = newdata.data;
                    const newTransactions = BankTransactions.data.concat(transactions);    
                    const ntransactions  = {};  
                    ntransactions.data = newTransactions;                            
                    if (firsttimeset){ 
                        updateTotalPages(newdata.pages);   
                    }  
                    setTimeout(()=>{
                       updateBankTransactions(ntransactions);
                    },2000);
                }       
                if (newdata.pages > 1){                        
                    updateCompletedPages(completedPages+1);   
                }                            
            }
        }else{
            if (previousDataFetch){
                if (newdata.pages > 1){
                    if (firsttimeset){ 
                        updateTotalPages(newdata.pages);
                    }    
                    updatederivedTransactions(newdata);                                                           
                    updateCompletedPages(completedPages+1);
                }else{
                    updateBankTransactions(newdata);
                }; 
            }else{
                if (newdata.pages > 1){
                    if (firsttimeset){ 
                        updateTotalPages(newdata.pages);   
                    }  
                    updateBankTransactions(newdata);  
                    updateCompletedPages(completedPages+1);
                }else{
                    updateBankTransactions(newdata);
                };                     
           };                    
        }   
        if (newdata.data.length > 0 && firsttime){
            updatecurrentPage(0);
            updateTotalPages(newdata.pages);
            setTimeout(()=>{
               updateCompletedPages(completedPages+1);
            },2000) ;
        }; 
    };
