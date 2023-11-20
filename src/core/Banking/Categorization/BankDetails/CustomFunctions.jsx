import React from 'react';

import '../MuiAddonStyles.css';
import * as css from '../BankingCategorizationDetails.scss';
import {showPlaceholder} from  './NumberConvertor';

let bankName = "";
let bankAccount = "";
const categoryList = {};

export  const checkNullandAssign = (data,keydata) =>{
    const Months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let returnvalue = "";
    let emptyfound = false;
    Object.keys(keydata).forEach((kdataouter) => {
          if (!data[keydata[kdataouter].field] && keydata[kdataouter].type === "C" && !emptyfound){
              emptyfound = true;
              if (keydata[kdataouter].altname){
                  returnvalue =  keydata[kdataouter].altname;
              }else{   
                  returnvalue = "-";
              }    
          }
          if (!data[keydata[kdataouter].field] && keydata[kdataouter].type === "D" && !emptyfound){
              emptyfound = true;
              if (keydata[kdataouter].altname){
                  returnvalue =  keydata[kdataouter].altname;
              }else{   
                  returnvalue = "-";
              }  
          }          
          if (data[keydata[kdataouter].field] && keydata[kdataouter].type === "D" && !emptyfound){
              emptyfound = false;
              const dt = new Date(data[keydata[kdataouter].field]);
              let day = String(dt.getDate());
              if (day.length < 2){
                  day = `0${day}`;
              }
              if (keydata[kdataouter].prefix){
                  returnvalue += keydata[kdataouter].prefix;
              }
              let datestring = `${day} ${Months[dt.getMonth()]} ${dt.getFullYear()}`;
              if (keydata[kdataouter].substr){
                  datestring = datestring.substr(0,datestring.length - keydata[kdataouter].substr);
              }
              if (keydata[kdataouter].interchange){
                  datestring = datestring.split(" ");
                  datestring = `${datestring[1]} ${datestring[0]}`;
              }
              returnvalue += `${datestring}`;                          
//              returnvalue = `${day} ${Months[dt.getMonth()]} ${dt.getFullYear()}`;
          }                        
          if (data[keydata[kdataouter].field] && keydata[kdataouter].type === "C" && !emptyfound){
              returnvalue += ` ${data[keydata[kdataouter].field]}` ;
          }    
          if (data[keydata[kdataouter].field] && keydata[kdataouter].type === "N" && !emptyfound){           
              returnvalue = `${data[keydata[kdataouter].field]}`;
          }                        
    });
    return returnvalue;
 };


export const customHeaderOpeningBalanceValue = (defs,rawopeningBalance,openingBalance) =>{
    let html = "";
    if (parseFloat(rawopeningBalance) < 0){
        html = <div><div className = {css.baseNameCreditNew}>{defs.colDef.headerName}</div><div className={css.customNameValueCreditNew}>{showPlaceholder(openingBalance)}</div></div>;
    }else if (parseFloat(rawopeningBalance) >= 0){
          if (parseFloat(rawopeningBalance) > 0){
              html = <div><div className = {css.baseNameDebitNew}>{defs.colDef.headerName}</div><div className={css.customNameValueDebitNew}>{showPlaceholder(openingBalance)}</div></div>;
          }else{
              html = <div><div className = {css.baseNameDebitNew}>{defs.colDef.headerName}</div><div className={css.customNameValueDebitNew_zero}>{showPlaceholder(openingBalance)}</div></div>;
          }    
    }      
    return html;
};


export const toCategorize = (BankTransactions,mainElement,updateinitClosingBalance,BankAccountID,clickevent,categorization,fromDate,toDate,SelectedBankID,currentPage,BankList,initClosingBalance,toNavigate,updateCurrentrow,updatedataSelected) =>{
    let dataselected = [];
    let rowcounter = 0;
    let rowfound = 0;
    if (BankTransactions && BankTransactions.data){
        BankTransactions.data.forEach((banktransaction)=>{
           if (banktransaction.id === clickevent[0]){
               dataselected = banktransaction;
               rowfound = rowcounter;
           }
           rowcounter += 1;
        });
    };    
    if (dataselected){
        let rowf  = rowfound;
        if (rowf < 0){
            rowf = 0;
        }
        const alldata = {data:[]};
        let counter = 0;
        const datanew = BankTransactions && BankTransactions.data && BankTransactions.data.length > 0 && BankTransactions.data.map((data)=>{
            data.index = counter;
            counter += 1;
            return data;
        });
        alldata.data = datanew;
        if (!datanew){
            return;
        }
        updateCurrentrow(rowf);
        updatedataSelected(dataselected);
        if (dataselected.amount >= 0){
            categoryList.data = [];
            categoryList.data.push({"id":"incomecategorization","name":"Income"});
            categoryList.data.push({"id":"others","name":"Receipts"});
        }else{
            categoryList.data = [];
            categoryList.data.push({"id":"expensecategorization","name":"Expenses"});
            categoryList.data.push({"id":"others","name":"Payments"});
        }
        localStorage.setItem("pagestart",rowf);
        localStorage.setItem("bankdetails",JSON.stringify({bankaccountid:BankAccountID,"categorization":(categorization?1:0),fromdate:fromDate,todate:toDate,bankID:SelectedBankID,currentpage:currentPage,banklist:BankList,bankselected:''}));        
        updateCurrentrow(rowf);
        localStorage.setItem("itemstatus",dataselected.categorized?"Edit":"Add");       
        toNavigate(alldata);
    };  
    setTimeout(()=>{
        if (mainElement && mainElement.current && mainElement.current.querySelector("#desktopclosing") && mainElement.current.querySelector("#desktopclosing").parentNode){
            mainElement.current.querySelector("#desktopclosing").parentNode.setAttribute("class","");
        }    
    },200);   
    updateinitClosingBalance(!initClosingBalance); 
};


export const dataAdjustments = (updateopeningBalance,updaterawopeningBalance,updateclosingBalance,updaterawclosingBalance,BankTransactions,mainElement,gridSize,currentPage,pickerType) =>{
   let pagePosition = gridSize * (currentPage+1);
   let startPosition = pagePosition - gridSize;
   if (pagePosition > 0){
       pagePosition -= 1;      
   }
   if (startPosition > 0){
       startPosition -= 1;
   }       
   if (BankTransactions.data[startPosition]){
       if (BankTransactions.data[startPosition].formatted_opening_balance){
           updateopeningBalance(BankTransactions.data[startPosition].formatted_opening_balance);
           updaterawopeningBalance(parseFloat(BankTransactions.data[startPosition].opening_balance));
       }else{
           updateopeningBalance(BankTransactions.data[startPosition].formatted_running_balance);
           updaterawopeningBalance(parseFloat(BankTransactions.data[startPosition].running_balance));
       };       
   }       
   if (BankTransactions.data.length >  pagePosition){
       updateclosingBalance(BankTransactions.data[pagePosition].formatted_running_balance);
       updaterawclosingBalance(parseFloat(BankTransactions.data[pagePosition].running_balance));
   }else{
       updateclosingBalance(BankTransactions.data[BankTransactions.data.length-1].formatted_running_balance);
       updaterawclosingBalance(parseFloat(BankTransactions.data[BankTransactions.data.length-1].running_balance)); 
   }
   const elList = document.querySelectorAll("div");
   elList.forEach((el)=>{
     if (el.innerHTML === "MUI X: Invalid license key") {
         el.style.display = "none";
     }
   }); 
   if  (mainElement && mainElement.current && mainElement.current.querySelector(".MuiDataGrid-footerContainer")  && pickerType === "mobile"){
        mainElement.current.querySelector(".MuiDataGrid-footerContainer").parentNode.style.height = "30px";
   }
   setTimeout(()=>{               
      if  (mainElement && mainElement.current && mainElement.current.querySelector(".MuiDataGrid-virtualScroller") && pickerType === "mobile"){
           let estyle = parseFloat(mainElement.current.querySelector(".MuiDataGrid-virtualScroller").style.height.split("px")[0]);
           estyle += 40;
           mainElement.current.querySelector(".MuiDataGrid-virtualScroller").style.height = `${estyle}px`;
      }
   },2000);         
};



export const getBankName = (SelectedBankID,BankList,updateBankName,updateBankAccount) => {
    let bankname = "";
    if (!SelectedBankID){
        bankname = BankList && BankList.data  && BankList.data.length > 0 ? `${BankList.data[0].bank_name} - ${BankList.data[0].bank_account_number}` : '';
        bankName = BankList && BankList.data  && BankList.data.length > 0 ? BankList.data[0].bank_name : '';
        bankAccount = BankList && BankList.data  && BankList.data.length > 0 ? BankList.data[0].bank_account_number : '';
        updateBankName(bankName);
        updateBankAccount(bankAccount);
    }else{
        BankList.data.forEach((bank)=>{
            if (bank.id === SelectedBankID){
                bankName = bank.bank_name;
                bankAccount = bank.bank_account_number;
                bankname = `${bank.bank_name} - ${bank.bank_account_number}`;
                updateBankName(bankName);
                updateBankAccount(bankAccount);
            }
        });
    }
    return bankname;
};


export  const getAmount = (typee,data) =>{
    if (typee === -1){
        if (!data.row.group_data){
            if (!parseFloat(data.row.amount)){
                return '-';
            }
            return  (parseFloat(data.row.amount) < 0 ?`${showPlaceholder(checkNullandAssign(data.row,{data1:{field:"formatted_amount",type:'N',absolute:true,altname:""}}))}`:'');
        };
        if (data.row.group_data){      
            if (!parseFloat(data.row.group_total)){
                return '-';
            }                 
            return (parseFloat(data.row.group_total) < 0 ?`${showPlaceholder(checkNullandAssign(data.row,{data1:{field:"formatted_group_total",type:'N',absolute:true,altname:""}}))}`:''); 
        };
    }
    if (typee === 1){
        if (!data.row.group_data){
            if (!parseFloat(data.row.amount)){
                return '-';
            }
            return  (parseFloat(data.row.amount) > 0 ?`${showPlaceholder(checkNullandAssign(data.row,{data1:{field:"formatted_amount",type:'N',absolute:true,altname:""}}))}`:'');
        };   
        if (data.row.group_data){
            if (!parseFloat(data.row.group_total)){
                return '-';
            }               
            return (parseFloat(data.row.group_total) > 0 ?`${showPlaceholder(checkNullandAssign(data.row,{data1:{field:"formatted_group_total",type:'N',absolute:true,altname:""}}))}`:''); 
        };   
    };
    return "";    
 };

export const getTooltipAmount = (type,data) =>{
    if (type === -1){
        if (!data.row.group_data){
            if (!parseFloat(data.row.amount)){
                return '-';
            }            
            return (parseFloat(data.row.amount) < 0 ?`${showPlaceholder(checkNullandAssign(data.row,{data1:{field:"formatted_amount",type:'N',absolute:true,altname:""}}))}` :'');
        }
        if (data.row.group_data){     
            if (!parseFloat(data.row.group_total)){
                return '-';
            }                   
            return (parseFloat(data.row.group_total) < 0 ?`${showPlaceholder(checkNullandAssign(data.row,{data1:{field:"formatted_group_total",type:'N',absolute:true,altname:""}}))}` :'');
        }    
    } 
    if (type === 1){
        if (!data.row.group_data){
            if (!parseFloat(data.row.amount)){
                return '-';
            }            
            return (parseFloat(data.row.amount) > 0 ?`${showPlaceholder(checkNullandAssign(data.row,{data1:{field:"formatted_amount",type:'N',absolute:true,altname:""}}))}` :'');
        }
        if (parseFloat(data.row.group_data)){
            if (!data.row.group_total){
                return '-';
            }             
            return (parseFloat(data.row.group_total) > 0 ?`${showPlaceholder(checkNullandAssign(data.row,{data1:{field:"formatted_group_total",type:'N',absolute:true,altname:""}}))}` :'');
        }  
    }
    return "";
 };


export const debitNone = () =>{
     const html =  <div className={css.baseNameDebitNone}>Inflow</div>;
     return html;
 };


export const creditNone = () =>{
     const html =  <div className={css.baseNameCreditNone}>Outflow</div>;
     return html;
 };

