
import { StringtoNumber,RoundingtheNumber } from "../BankDetails/NumberConvertor";


export const showadvance = (skipcheck,mainElementCategorize,advancefieldlist,documentnumberfield,showAdvance,getlocation,getchangedTransactions,advancedetails,hideTDS,TDS,editedresponse,considerAmountField,ctrans1) =>{
    const totalarray = [];
    advancefieldlist.forEach((field)=>{
        if (field === documentnumberfield){
            totalarray.push("Document");
        }   
        if (field === "amount"){
            totalarray.push("Advance");
        }     
        if (field !== documentnumberfield && field !== "amount"){
            totalarray.push(0);
        } 
    });
    if (!showAdvance && !skipcheck){   
        if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#advancetag")){
            mainElementCategorize.current.querySelector("#addadvancevalue").innerHTML = "";    
        };
        if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".addadvanceholder")){
            mainElementCategorize.current.querySelector(".addadvanceholder").style.visibility = "visible";
        }
    }else{
        let totaladjusted = 0;
        Object.keys(ctrans1).forEach((ckey)=>{
            const cats = ctrans1[ckey];         
            const atamount = cats.adjustment;
            const checkadamount = StringtoNumber(atamount);  
            if (checkadamount > 0){
                totaladjusted += checkadamount;    
            };    
        });  
        const currentpos = localStorage.getItem("pagestart");
        let vaamount = getlocation().state.alldata.data[currentpos].amount; 
        if (vaamount < 0){
            vaamount *= -1;
        }
        let finalamount = vaamount - totaladjusted; 
        if (finalamount < 0){
            finalamount = 0;
        }
        if (advancedetails && advancedetails.allocated_amount){
            finalamount = StringtoNumber(advancedetails.allocated_amount);
        }            
        let taxadvance = 0;
        if (!hideTDS){
            taxadvance  = RoundingtheNumber((finalamount * TDS/100));
            if (localStorage.getItem("itemstatus") === "Edit"){
                editedresponse.categorized_lines.forEach((catd)=>{
                    if (catd.advance){
                        taxadvance = catd.tds_amount;
                    }
                });
            }                  
        }    
        const totalpendamount = RoundingtheNumber((finalamount+taxadvance));
        advancefieldlist.forEach((field,count)=>{
            if (field === considerAmountField){
                totalarray[count] = totalpendamount;
            }
            if (field === "taxamount"){
                totalarray[count] = taxadvance;
            }
            if (field === "adjustment"){
                totalarray[count] = RoundingtheNumber((totalpendamount - taxadvance));
            }    
            if (field === "settlementamount"){
                if (totaladjusted >= 0){
                     totalarray[count] = finalamount;
                     totalarray[count] *= -1;
                 }else{
                     totalarray[count]  = 0;
                 }
            }     
        });    
        if (vaamount){
            const vamount = StringtoNumber(vaamount);  
            if (totaladjusted >= vamount){  
                if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#addadvancevalue")){
                    mainElementCategorize.current.querySelector("#addadvancevalue").innerHTML = "";
                }                          
                if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".addadvanceholder")){
                    mainElementCategorize.current.querySelector(".addadvanceholder").style.visibility = "visible";
                }
            }else if (vamount < totaladjusted){
                if (totaladjusted <= 0){
                    if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#addadvancevalue")){
                        mainElementCategorize.current.querySelector("#addadvancevalue").innerHTML = "";
                    }                            
                    if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".addadvanceholder")){
                        mainElementCategorize.current.querySelector(".addadvanceholder").style.visibility = "visible";
                    }
                }   
            }
        }              
    }
    return totalarray;
};


export const showadvancedeactive = (event,categorizeData,pickerType,mainElementCategorize,revisedDocumentType,updateshowAdvance) =>{
    if (event){        
        event.stopPropagation();
    }
    if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".addadvanceholder")){
       mainElementCategorize.current.querySelector(".addadvanceholder").style.visibility = "visible";
    }
    if (pickerType ===  "mobile"){
        if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#addadvancevalue")){
            mainElementCategorize.current.querySelector("#addadvancevalue").innerHTML = "";
            mainElementCategorize.current.querySelector("#addadvancevalue").style.height = "0px";
        }                
        let totalallocate = 0;
        categorizeData.data.forEach((cats)=>{   
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
            };    
        });
        if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer") && mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode){
            if (totalallocate > 0){
                mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.style.bottom = "10px";
            }else{
                mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.style.bottom = "10px";
            }    
        } 
    }
    updateshowAdvance(false);
};
