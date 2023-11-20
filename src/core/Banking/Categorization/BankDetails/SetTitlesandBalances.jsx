import {showPlaceholder} from './NumberConvertor';

export const setTitlesandBalances = (pickerType,ispagination,rawclosingBalance,closingBalance,mainElement) =>{
    let opvar = "";
    if (pickerType === "mobile" && !ispagination){
        if (rawclosingBalance > 0){
            opvar = '<div id = "mobileclosing"><div id="bankingCategorizationClosingBalanceWrapper_Mobile"><div id = "bankingCategorizationClosingBalance"><div id="bankingCategorizationClosingBalance_text_mobile">CLOSING BALANCE</div>';
            opvar += '<button class="bankCategorizationWrapper_AdditionalDataButton bankCategorizationWrapper_addnewrows"';
            opvar += ' type="button" id = "closingbalancebutton">';
            opvar += "Preceding Month</button>";
            opvar += `<div id="bankingCategorizationClosingBalance_value_debit_mobile">${showPlaceholder(closingBalance)}</div>`;
            opvar += "</div></div></div>";
        };    
        if (rawclosingBalance < 0){
           opvar = '<div id = "mobileclosing"><div id="bankingCategorizationClosingBalanceWrapper_Mobile""><div id = "bankingCategorizationClosingBalance"><div id="bankingCategorizationClosingBalance_text_mobile">CLOSING BALANCE</div>';
           opvar += '<button class="bankCategorizationWrapper_AdditionalDataButton bankCategorizationWrapper_addnewrows"';
           opvar += ' type="button" id = "closingbalancebutton">';
           opvar += "Preceding Month</button>";
           opvar += `<div id="bankingCategorizationClosingBalance_value_credit_mobile">${showPlaceholder(closingBalance)}</div>`;
           opvar += "</div></div></div>";
        }; 
        if (rawclosingBalance === 0){
            opvar = '<div id = "mobileclosing"><div id="bankingCategorizationClosingBalanceWrapper_Mobile""><div id = "bankingCategorizationClosingBalance"><div id="bankingCategorizationClosingBalance_text_mobile">CLOSING BALANCE</div>';
            opvar += '<button class="bankCategorizationWrapper_AdditionalDataButton bankCategorizationWrapper_addnewrows"';
            opvar += ' type="button" id = "closingbalancebutton">';
            opvar += "Preceding Month</button>";
            opvar += `<div id="bankingCategorizationClosingBalance_value_debit_zero_mobile">${showPlaceholder(closingBalance)}</div>`;
            opvar += "</div></div></div>";
        };             
    }     
    if (pickerType === "desktop" && !ispagination){
        const columnlist = ["date","txn_id","party_name","purpose","narration","amount2","amount1"];
        opvar = "";
        let xminwidth = 0;
        let xmaxwidth = 0;            
        columnlist.forEach((column) =>{
            const totalfieldkey = `[data-field="${column}"]`;
            if (mainElement.current.querySelector(totalfieldkey)){  
                const widthmin = mainElement.current.querySelector(totalfieldkey).style.minWidth;
                const widthmax = mainElement.current.querySelector(totalfieldkey).style.maxWidth; 
                if (column.toUpperCase() === "PURPOSE" || column.toUpperCase() === "NARRATION"  || column.toUpperCase() === "AMOUNT2" || column.toUpperCase() === "AMOUNT1"){
                    if (column.toUpperCase() === "NARRATION"){
                        xminwidth += parseFloat(widthmin.split("px")[0]);
                        xmaxwidth += parseFloat(widthmax.split("px")[0]);
                        opvar += `<div style = "height:20px;float:left;min-width:${xminwidth}px;max-width:${xmaxwidth}px;width:${widthmin};">`;
                        opvar += '<div id = "desktopclosing"><div id="bankingCategorizationClosingBalanceWrapper"><div id = "bankingCategorizationClosingBalance"><div id="bankingCategorizationClosingBalance_text_desktop">CLOSING BALANCE</div>';
                        opvar += '<button class="bankCategorizationWrapper_AdditionalDataButton bankCategorizationWrapper_addnewrows"';
                        opvar += ' type="button" id = "closingbalancebutton">';
                        opvar += "Preceding Month</button></div></div></div>";
                        opvar += `</div>`;
                    }    
                    if (column.toUpperCase() === "PURPOSE"){
                        xminwidth += parseFloat(widthmin.split("px")[0]);
                        xmaxwidth += parseFloat(widthmax.split("px")[0]);
                    }
                    if (column.toUpperCase() === "AMOUNT2"){
                        opvar += `<div style = "height:20px;float:left;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                        if (rawclosingBalance >= 0){
                            opvar += `<div id="bankingCategorizationClosingBalance_value_debit_desktop">${showPlaceholder(closingBalance)}</div>`;
                        }    
                        opvar += `</div>`;                            
                    }    
                    if (column.toUpperCase() === "AMOUNT1"){
                        opvar += `<div style = "height:20px;float:left;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                        if (rawclosingBalance < 0){
                            opvar += `<div id="bankingCategorizationClosingBalance_value_credit_desktop">${showPlaceholder(closingBalance)}</div>`;
                            opvar += "</div></div></div>";
                        }   
                        opvar += `</div>`;   
                    }   
                }else if (column.toUpperCase() !== "PURPOSE" && column.toUpperCase() !== "NARRATION"  && column.toUpperCase() !== "AMOUNT2" && column.toUpperCase() !== "AMOUNT1"){
                  if  (column.toUpperCase() === "TXN_ID"){
                       opvar += `<div style = "height:20px;float:left;min-width:${parseFloat(widthmin.split("px")[0]) *  .95}px;max-width:${parseFloat(widthmax.split("px")[0]) * .95}px;width:${parseFloat(widthmin.split("px")[0]) * .95}px;">`;
                       opvar += '<div style = "float:right;"></div>';                 
                       opvar += `</div>`;
                  }else{
                       opvar += `<div style = "height:20px;float:left;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                       opvar += '<div style = "float:right;"></div>';                 
                       opvar += `</div>`;
                 }    
             }
           }        
       });
    }
    return opvar;
};