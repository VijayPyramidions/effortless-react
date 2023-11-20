

import { StringtoNumber,showPlaceholder } from "../BankDetails/NumberConvertor";

export const SetAdvanceTotalandScreenAdjustments = (mainElementCategorize,paycheck,categorizeData,selectedTowardsName,updatetotalallocated,updatetotalallocatedbills,updatetotalallocatedtext,revisedDocumentType,pickerType,changeCollapse,gridSize,currentPage,totalrequired,advancerequired,updateCatButtonHeight,showAdvance,showadvance,advancefieldlist,geteditableTDSvalues,alternatekeys,collapserequired,handleScroll,totalallocated,collapseprocess,totalfieldlist,addAdvance,paidTo,organization,user,updateadvancevoucher,updateVReference,updateshowLoader,openSnackBar,editadvancenumber,updateshowAdvance,updateanothercategorization,updateopModal,updatealertdisplaymessage,updatealertwarning,updatebuttontext1,updatebuttontext2,updateclosebutton,updateAlertOpen,accountnamefield,totalarr,updatetotalarr,advancecheckboxChecked_desktop,advancecheckboxChecked_mobile,showadvancedeactive,advancevoucher,considerAmountField,widthcalculatefields,defaultTransactionType,updatecollapseprocess,showadvancefieldlist,showtotalfieldlist,getlocation,documentnumberfield,getchangedTransactions,advancedetails,hideTDS,TDS,editedresponse,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,getchanged,updatespecialTotal,editclicked) =>{
    let totarr = [];
    if (pickerType === "mobile"){
        setTimeout(()=>{
          if (paycheck === "R" || paycheck === "P"){
              if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#datagridbox") && mainElementCategorize.current.querySelector("#datagridbox") && mainElementCategorize.current.querySelector("#datagridbox").querySelector(".MuiDataGrid-row")){
                  mainElementCategorize.current.querySelector("#datagridbox").querySelector(".MuiDataGrid-row").style.border = "none";
                  mainElementCategorize.current.querySelector("#datagridbox").querySelector(".MuiDataGrid-row").style.boxShadow = "none";
              }
          }
          if (pickerType === "mobile"){
              if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer") && mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode){
                  let totalallocate = 0;
                  let totalbillsallocated = 0;
                  categorizeData.data.forEach((cats)=>{   
                    const atamount = cats.adjustment;
                    const checkadamount = StringtoNumber(atamount);  
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
                  if (totalallocate > 0){                 
                      mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.style.bottom = "10px";
                  }else{
                      mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.style.bottom = "10px";
                  }   
                  mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.style.float = "left";          
                  mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.style.position= "relative";
                  mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.style.zIndex = "2";
                  mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.style.width = "94%";
                  mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.style.marginLeft =  "5px";
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
                   }
                }                         
              } 
          }    
        },500);  
  }             
  if (pickerType === "mobile"){  
      if (document.querySelector(".DashboardViewContainer_appHeader")){
          document.querySelector(".DashboardViewContainer_appHeader").style.display = "none";  
      }    
      if (document.querySelector(".DashboardViewContainer_dashboardBodyContainerhideNavBar")){
          document.querySelector(".DashboardViewContainer_dashboardBodyContainerhideNavBar").style.height = "100%";
      }
      if (document.querySelector(".DashboardViewContainer_pageTitleContainer")){
          document.querySelector(".DashboardViewContainer_pageTitleContainer").style.background = "#401E01";
      }
      if (document.querySelector(".DashboardViewContainer_pageTitleContainer")){
          if (document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("svg")){
              document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("svg").style.fontSize = "4vw";
          }    
          if (document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("span")){
              document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("span").style.fontSize = "4vw";
          }    
      }  
  }else if (pickerType !== "mobile"){
    if (document.querySelector(".DashboardViewContainer_pageTitleContainer")){
        if (document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("svg")){
            document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("svg").style.fontSize = "1.5vw";
        }    
        if (document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("span")){
            document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("span").style.fontSize = "1.5vw";
        }    
    }      
  }   
  if (categorizeData && categorizeData.data && categorizeData.data.length > 0){
      if (revisedDocumentType.toUpperCase() === "TYPE2"  && pickerType === "mobile"){
           if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector('#datagridbox') && mainElementCategorize.current.querySelector('#datagridbox').querySelector(".MuiDataGrid-row")){
               mainElementCategorize.current.querySelector('#datagridbox').querySelector(".MuiDataGrid-row").style.border = "none";
               mainElementCategorize.current.querySelector('#datagridbox').querySelector(".MuiDataGrid-row").style.boxShadow = "none";
               mainElementCategorize.current.querySelector('#datagridbox').querySelector(".MuiDataGrid-columnHeaders").style.border = "none";
           }
      }
      if (pickerType === "desktop"){
          setTimeout(() =>{
            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector('[aria-rowindex="1"]')){
                let counter = 0;
                mainElementCategorize.current.querySelector("#datagridbox").querySelector('[aria-rowindex="1"]').querySelectorAll(".MuiDataGrid-columnHeader").forEach((element)=>{
                    if (element.getAttribute("class").indexOf("headerStyle") > -1){
                        if (element.getAttribute("role") === "columnheader" && element.getAttribute("data-field") !== "selection"){
                            if (element.querySelector(".MuiDataGrid-columnHeaderTitleContainerContent") && element.querySelector(".MuiDataGrid-columnHeaderTitleContainerContent").querySelector("div")){
                                element.querySelector(".MuiDataGrid-columnHeaderTitleContainerContent").style.float = "right";
                                element.querySelector(".MuiDataGrid-columnHeaderTitleContainerContent").style.textAlign = "right";
                                element.querySelector(".MuiDataGrid-columnHeaderTitleContainerContent").querySelector("div").innerHTML = alternatekeys[counter];
                                counter += 1; 
                            }     
                        }   
                    }    
                });
            } 
          },500);     
      } 
      const elList = document.querySelectorAll("div");
      elList.forEach((el)=>{
        if (el.innerHTML === "MUI X: Invalid license key") {
            el.style.display = "none";
        }
      });
      setTimeout(()=>{
         elList.forEach((el)=>{
           if (el.innerHTML === "MUI X: Invalid license key") {
               el.style.display = "none";
           }
         });
        },500);   

      setTimeout(()=>{
            elList.forEach((el)=>{
              if (el.innerHTML === "MUI X: Invalid license key") {
                  el.style.display = "none";
              }
            });
      },1500);     
      if (pickerType === "mobile"){
          let totalallocate = 0;
          let totalbillsallocated = 0;
          categorizeData.data.forEach((cats)=>{       
              const atamount = cats.adjustment;
              const checkadamount = StringtoNumber(atamount);                     
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
                  setTimeout(()=>{
                     updatetotalallocated(samount);
                     updatetotalallocatedbills("");
                     updatetotalallocatedtext(showPlaceholder(samount));
                  },1000);   
              }    
          }else if (revisedDocumentType && revisedDocumentType.toUpperCase() !==  "TYPE2"){
             if (totalallocate > 0){
                 updatetotalallocatedbills(`Selected Bills : ${totalbillsallocated}`);
                 updatetotalallocated(totalallocate);
                 updatetotalallocatedtext(showPlaceholder(totalallocate));
             }
          }    
      }         
      if (pickerType === "mobile"){
          if (mainElementCategorize.current.querySelector("#datagridbox").querySelector('[role="grid"]')){
             let estyle = mainElementCategorize.current.querySelector("#datagridbox").querySelector('[role="grid"]').getAttribute( 'style');
             if (estyle){
                 estyle = estyle.split('height: 77% !important;').join('');
                 estyle = estyle.split('height: 74% !important;').join('');
                 estyle = estyle.split('height: 83% !important;').join('');
                 estyle = estyle.split('height: 86% !important;').join('');
                 estyle = estyle.split('height: 78% !important;').join('');
             }else{
                 estyle = "";
             }    
             mainElementCategorize.current.querySelector("#datagridbox").querySelector('[role="grid"]').setAttribute("style",`height: 100% !important;${estyle}`);
          }               
          if (collapserequired && collapseprocess){
              updatecollapseprocess(false);
              setTimeout(()=>{
                if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".MuiDataGrid-virtualScroller")){
                    mainElementCategorize.current.querySelector(".MuiDataGrid-virtualScroller").addEventListener("scroll",()=>{handleScroll(mainElementCategorize,geteditableTDSvalues,categorizeData,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem);});        
                }      
                changeCollapse('','',mainElementCategorize,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem,pickerType);
            },10);
          };
      }else if (pickerType === "desktop"){
        if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".MuiDataGrid-virtualScroller")){
            mainElementCategorize.current.querySelector(".MuiDataGrid-virtualScroller").addEventListener("scroll",()=>{handleScroll(mainElementCategorize,geteditableTDSvalues,categorizeData,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem);});        
        }    
      } 
      if (pickerType === "mobile"){
        let totalallocate = 0;
        let totalbillsallocated = 0;
        categorizeData.data.forEach((cats)=>{         
           const atamount = cats.adjustment;
           const checkadamount = StringtoNumber(atamount);   
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
                setTimeout(()=>{
                   updatetotalallocated(samount);
                   updatetotalallocatedbills("");
                   updatetotalallocatedtext(showPlaceholder(samount));
                },1000);    
            }    
        }else if (revisedDocumentType &&  revisedDocumentType.toUpperCase() !==  "TYPE2"){
          if (totalallocated > 0){
              updatetotalallocatedbills(`Selected Bills : ${totalbillsallocated}`);
              updatetotalallocated(totalallocate);
              updatetotalallocatedtext(showPlaceholder(totalallocate));
          }    
        }    
     }
     let div = '';
     const pagePosition = gridSize * (currentPage+1);
     let startPosition = pagePosition - gridSize;    
     if (startPosition < 0){
         startPosition = 0;
     } 
     let endPosition = (startPosition+gridSize);
     const dataswithinthepagerange = {"data":[]};
     if (categorizeData.data.length >  endPosition){
         dataswithinthepagerange.data = categorizeData.data.filter((data)=> {return data.index >= startPosition && data.index < endPosition;});
     }else{ if (startPosition === 0){
              dataswithinthepagerange.data = categorizeData.data;
            }else{
              endPosition = categorizeData.data[categorizeData.data.length - 1].index;
              dataswithinthepagerange.data = categorizeData.data.filter((data)=> {return data.index >= startPosition && data.index < endPosition;});
            };  
      }                        
      if (!totalrequired && !advancerequired){
          if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#total")){
              mainElementCategorize.current.querySelector("#total").innerHTML = "";
          };  
          if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#addadvancevalue")){
              mainElementCategorize.current.querySelector("#addadvancevalue").innerHTML = "";
          };  
          if (mainElementCategorize && mainElementCategorize.current && !mainElementCategorize.current.querySelector(".addadvanceplus")){
              if (mainElementCategorize.current.querySelector("#advancebutton")){
                  mainElementCategorize.current.querySelector("#advancebutton").innerHTML = "";
              }    
          }                 
          return;
      }

      const totals = [];

      if (totalrequired){
          categorizeData.data.forEach((totalrange) => {
            if (!totalrange.hide){
                totalfieldlist.forEach((element,totalcount)=>{ 
                    if (!totals[totalcount]){
                        totals[totalcount] = 0;
                    }                
                    totals[totalcount] += StringtoNumber(totalrange[element]);
                 });
            }               
         }); 
    }   
    if (pickerType === "mobile"){
        setTimeout(()=>{
          if (paycheck === "R" || paycheck === "P"){
              if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#datagridbox") && mainElementCategorize.current.querySelector("#datagridbox") && mainElementCategorize.current.querySelector("#datagridbox").querySelector(".MuiDataGrid-row")){
                  mainElementCategorize.current.querySelector("#datagridbox").querySelector(".MuiDataGrid-row").style.border = "none";
                  mainElementCategorize.current.querySelector("#datagridbox").querySelector(".MuiDataGrid-row").style.boxShadow = "none";
              }
          }
        },500);  
// height of the data grid
        if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#CategorizeMoveButtons")){
            updateCatButtonHeight(mainElementCategorize.current.querySelector("#CategorizeMoveButtons").offsetHeight);
        }
        if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#datagridbox") && mainElementCategorize.current.querySelector("#datagridbox").querySelector('[role="grid"]')){
            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#datagridbox")){              
                mainElementCategorize.current.querySelector("#datagridbox").querySelector('[role="grid"]').style.height = `${mainElementCategorize.current.querySelector("#datagridbox").offsetHeight}`;
            }        
        }    
    }

     let domfindtimer = null;
     domfindtimer = setInterval (()=>{
        if (totalrequired || advancerequired){ 
            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer") && !mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.querySelector("#addadvancevalue")){
                if ( mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.querySelector("#totalblock") && totalrequired){
                     div = document.createElement("div");
                     div.id  = "totalblock";
                     mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.prepend(div);
                 }    
                 if (advancerequired){
                     if (!mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.querySelector("#advancebutton")){
                         div = document.createElement("div");
                         div.id  = "advancebutton";
                         mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.append(div);
                     }    
                     if (!mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.querySelector("#addadvancevalue")){
                         div = document.createElement("div");
                         div.id  = "addadvancevalue";
                         mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.prepend(div);
                     }    
                     if (mainElementCategorize && mainElementCategorize.current && !mainElementCategorize.current.querySelector(".addadvanceplus")){
                         if (localStorage.getItem("itemstatus") === "Edit" && !editclicked){
                             // blank statement
                         }else{   
                            mainElementCategorize.current.querySelector("#advancebutton").innerHTML = '<div class="addadvanceholder"><label class="addadvanceplus">+</label><span><a class="addadvance" href={" "} id = "addadvancesvalue">Add Advance</a></span></div>';
                            mainElementCategorize.current.querySelector("#advancebutton").addEventListener('click',(event)=>{addAdvance(event,mainElementCategorize,paidTo,organization,user,updateadvancevoucher,updateVReference,updateshowLoader,openSnackBar,editadvancenumber,showadvance,updateshowAdvance,updateanothercategorization,updateopModal,updatealertdisplaymessage,updatealertwarning,updatebuttontext1,updatebuttontext2,updateclosebutton,updateAlertOpen,advancefieldlist,documentnumberfield,showAdvance,getlocation,getchangedTransactions,advancedetails,hideTDS,TDS,editedresponse,considerAmountField,getchanged,updatetotalarr,updatespecialTotal);});
                         }    
                     } 
                 }        
           }    
        }            
        let left1 = 0;
        let widthl = 0;
        let html = '';
        if (!accountnamefield){
            html = '<div style = "display:flex;position:absolute;width:96.6%;background-color:#FBE2CC; padding-top: 5px;padding-bottom: 5px;margin-top: -11px;height: 20px;">';
        }else{
            html = '<div style = "display:flex;position:absolute;width:96%;background-color:#FBE2CC; padding-top: 5px;padding-bottom: 5px;margin-top: -11px;height: 20px;">';
        }    
        if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#addadvancevalue")){
            clearInterval(domfindtimer);
        }
        if (pickerType === "mobile" && showAdvance){
            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#addadvancevalue")){
                if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer") && mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode){
                    mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.style.bottom = "10px";
                } 
                mainElementCategorize.current.querySelector("#addadvancevalue").style.height = "16vh";
                clearInterval(domfindtimer);
                const ctrans = getchanged();
                totarr = showadvance(true,mainElementCategorize,advancefieldlist,documentnumberfield,showAdvance,getlocation,getchangedTransactions,advancedetails,hideTDS,TDS,editedresponse,considerAmountField,ctrans);
                updatetotalarr(totarr);
                let totalallocate = totarr[totarr.length-1];
                if (totalallocate < 0){
                    totalallocate *= -1;  
                }
                let totalbillsallocated = 0;
                let actualallocated = 0;
                categorizeData.data.forEach((cats)=>{         
                        const atamount = cats.adjustment;
                        const checkadamount = StringtoNumber(atamount);       
                        if (checkadamount > 0){
                            totalallocate += checkadamount;    
                            totalbillsallocated += 1; 
                            actualallocated += checkadamount;
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
                }else if (revisedDocumentType &&  revisedDocumentType.toUpperCase() !==  "TYPE2"){                
                   if (actualallocated  > 0){
                       updatetotalallocatedbills(`Selected Bills : ${totalbillsallocated}`);
                       updatetotalallocated(totalallocate);
                       updatetotalallocatedtext(showPlaceholder(totalallocate));
                   }    
                }
                mainElementCategorize.current.querySelector("#addadvancevalue").innerHTML = '<div style = "margin-top:10px"><div id = "advancesel"></div><div id="advancedetails"></div></div>';
                const cwidthmin = mainElementCategorize.current.querySelector('[data-field="selection"]').style.minWidth;
                const cwidthmax = mainElementCategorize.current.querySelector('[data-field="selection"]').style.maxWidth; 
                widthl = mainElementCategorize.current.querySelector('[data-field="selection"]').offsetWidth;  
                if (mainElementCategorize && mainElementCategorize.current.querySelector("#addadvancevalue").querySelector("#advancesel")){                    
                    if (pickerType === "desktop"){
                        mainElementCategorize.current.querySelector("#addadvancevalue").querySelector("#advancesel").innerHTML  = `<div style = "align-items: center;display: flex;min-width:${cwidthmin};max-width:${cwidthmax};width:${cwidthmin};">${advancecheckboxChecked_desktop}</div>`;
                    }else{
                        mainElementCategorize.current.querySelector("#addadvancevalue").querySelector("#advancesel").innerHTML  = `<div style = "margin-left:-10px;min-width:${cwidthmin};max-width:${cwidthmax};width:${cwidthmin};">${advancecheckboxChecked_mobile}</div>`;
                    }
                    if(localStorage.getItem("itemstatus") === "Add") mainElementCategorize.current.querySelector("#addadvancevalue").querySelector("#advancesel").querySelector("#advanceselectionclickable").addEventListener('click', (event)=>showadvancedeactive(event,categorizeData,pickerType,mainElementCategorize,revisedDocumentType,updateshowAdvance));
                }    
                if (mainElementCategorize.current.querySelector(".categorization_CategorizationWrapper") &&  mainElementCategorize.current.querySelector(".categorization_CategorizationWrapper").querySelector(".MuiDataGrid-footerContainer")){ 
                    mainElementCategorize.current.querySelector(".categorization_CategorizationWrapper").querySelector(".MuiDataGrid-footerContainer").style.display = "none";
                }    
                let headervalue = "";
                advancefieldlist.forEach((element,totalcount)=>{
                      if (element === "document_number"){
                          let newvalue = totarr[totalcount];
                          if (totarr[totalcount] === "Document"){
                              newvalue = advancevoucher;
                              if (!newvalue){
                                  newvalue = "Document";
                              }
                          }
                          headervalue += `<div id = "mobile_docno"><label style = "text-align:left;margin-left:2px;">${newvalue}</label></div>`;
                      }
                      if (element === considerAmountField){
                          headervalue += `<div id = "mobile_value1"><label style = "text-align:right;float:right;">${showPlaceholder(totarr[totalcount])}</label></div>`;                           
                      }
                      if (element === "adjustment"){
                          headervalue += `<div id = "mobile_value2"><label style = "text-align:right;float:right;">${showPlaceholder(totarr[totalcount])}</label></div>`;                           
                      }
                });   
                headervalue += '<hr style = "margin-left:-25px;opacity:.5;width:110%;color:#D8D8D8;"/><br>';
                advancefieldlist.forEach((element,totalcount)=>{
                      if (element === considerAmountField){
                          headervalue += `<div style = "width:100%;float:left;"><div id = "mobile_title1"><label style = "text-align:right;float:right;">Payable Amount</label></div><div id = "mobile_value3"><label style = "text-align:right;float:right;">${showPlaceholder(totarr[totalcount])}</label></div></div>`;
                      }
                });  
                advancefieldlist.forEach((element,totalcount)=>{
                      if (element === "taxamount"){
                          headervalue += `<div style = "width:100%;float:left;"><div id = "mobile_title2"><label style = "text-align:right;float:right;padding-right:15%;">TDS Amount</label></div><div id = "mobile_value4"><label style = "text-align:right;float:right;">${showPlaceholder(totarr[totalcount])}</label></div></div>`;
                      } 
                }); 
                advancefieldlist.forEach((element,totalcount)=>{
                    if (element === "settlementamount"){
                        headervalue += `<div style = "width:100%;float:left;"><div id = "mobile_title3"><label style = "text-align:right;float:right;padding-right:0%;">Balance Amount</label></div><div id = "mobile_value5"><label style = "text-align:right;float:right;">${showPlaceholder(totarr[totalcount])}</label></div></div>`;
                    } 
                });                                            
                mainElementCategorize.current.querySelector("#addadvancevalue").querySelector("#advancedetails").innerHTML = headervalue;
            }
        }
        if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector('[data-field="document_number"]')){
            clearInterval(domfindtimer);
            widthcalculatefields.forEach((field)=>{
                 widthl += mainElementCategorize.current.querySelector(`[data-field="${field}"]`).offsetWidth;
            });
            if (mainElementCategorize.current.querySelector('[data-field="selection"]')){
                widthl += mainElementCategorize.current.querySelector('[data-field="selection"]').offsetWidth-10;
            }
            if (mainElementCategorize.current.querySelector(`[data-field="${widthcalculatefields[0]}"]`)){   
                left1 = mainElementCategorize.current.querySelector(`[data-field="${widthcalculatefields[0]}"]`).offsetLeft;
            }    
            const lefttext = `padding-top:15px;min-width:${widthl}px;max-width:${widthl}px;width:${widthl}px;top:10px;float:left;left:${left1}px;`;
   

            if (mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer")){
                const ctrans = getchanged();
                totarr = showadvance(false,mainElementCategorize,advancefieldlist,documentnumberfield,showAdvance,getlocation,getchangedTransactions,advancedetails,hideTDS,TDS,editedresponse,considerAmountField,ctrans);
                updatetotalarr(totarr);
                if (mainElementCategorize.current.querySelector("#totalblock")){
                    mainElementCategorize.current.querySelector("#totalblock").remove();
                }  
                if (mainElementCategorize.current.querySelector("#addadvancevalue")){
                    mainElementCategorize.current.querySelector("#addadvancevalue").remove();
                }
                if (revisedDocumentType.toUpperCase() ===  "TYPE1" && (defaultTransactionType === "Payment" || defaultTransactionType === "Receipt")){
                    if (!mainElementCategorize.current.querySelector("#addadvancevalue")){
                        div = document.createElement("div");
                        div.id  = "addadvancevalue";
                        mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.prepend(div);
                    }
                }  
                if (!mainElementCategorize.current.querySelector("#totalblock")){
                    div = document.createElement("div");
                    div.id  = "totalblock";
                    mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.append(div);
                    mainElementCategorize.current.querySelector("#totalblock").innerHTML = '<div id = "pagetotal"></div><div id = "total"></div>';
                }   
                if (!mainElementCategorize.current.querySelector("#totalcount")){
                    div = document.createElement("div");
                    div.id  = "totalcount";
                    mainElementCategorize.current.querySelector(".MuiDataGrid-footerContainer").parentNode.append(div);
                }                        
  
                if (totarr.length > 0 && showAdvance && mainElementCategorize.current.querySelector("#addadvancevalue")){
                    mainElementCategorize.current.querySelector("#addadvancevalue").innerHTML = '<div id = "advancesel"></div><div id="advancedetails"></div>';
                    const cwidthmin = mainElementCategorize.current.querySelector('[data-field="selection"]').style.minWidth;
                    const cwidthmax = mainElementCategorize.current.querySelector('[data-field="selection"]').style.maxWidth; 
                    widthl = mainElementCategorize.current.querySelector('[data-field="selection"]').offsetWidth;                      
                    if (pickerType === "desktop"){
                        mainElementCategorize.current.querySelector("#addadvancevalue").querySelector("#advancesel").innerHTML  = `<div style = "min-width:${cwidthmin};max-width:${cwidthmax};width:${cwidthmin};">${advancecheckboxChecked_desktop}</div>`;
                    }else{
                        mainElementCategorize.current.querySelector("#addadvancevalue").querySelector("#advancesel").innerHTML  = `<div style = "margin-left:-10px;min-width:${cwidthmin};max-width:${cwidthmax};width:${cwidthmin};">${advancecheckboxChecked_mobile}</div>`;
                    }    
                    if(localStorage.getItem("itemstatus") === "Add") mainElementCategorize.current.querySelector("#addadvancevalue").querySelector("#advancesel").querySelector("#advanceselectionclickable").addEventListener('click', (event)=>showadvancedeactive(event,categorizeData,pickerType,mainElementCategorize,revisedDocumentType,updateshowAdvance));
                    advancefieldlist.forEach((element,totalcount)=>{
                      let advancefieldkey = `[data-field="${element}"]`;
                      if (accountnamefield === element){
                          const widthmin = mainElementCategorize.current.querySelector(advancefieldkey).style.minWidth;
                          const widthmax = mainElementCategorize.current.querySelector(advancefieldkey).style.maxWidth; 
                          widthl = mainElementCategorize.current.querySelector(advancefieldkey).offsetWidth;  
                          html += `<div style = "display: flex;align-items: center;justify-content: center;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                          html += `</div>`;
                      }else{
                         if (showadvancefieldlist[element]){
                            if (mainElementCategorize.current.querySelector(advancefieldkey)){  
                                const widthmin = mainElementCategorize.current.querySelector(advancefieldkey).style.minWidth;
                                const widthmax = mainElementCategorize.current.querySelector(advancefieldkey).style.maxWidth; 
                                widthl = mainElementCategorize.current.querySelector(advancefieldkey).offsetWidth;                   
                                if (String(totarr[totalcount]).toUpperCase() === "ADVANCE"){   
                                    if (accountnamefield){
                                        html += `<div style = "padding-left:3.3vw;display: flex;align-items: center;justify-content: center;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                                    }else{
                                        html += `<div style = "padding-left:3.1vw;padding-right:0.4vw;display: flex;align-items: center;justify-content: center;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                                    }    
                                }else if (String(totarr[totalcount]).toUpperCase() !== "ADVANCE"){
                                    if (element.toUpperCase() === "TAXAMOUNT"){
                                        html += `<div style = "padding-left:.3vw;display: flex;align-items: center;justify-content: center;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                                    }else if (element.toUpperCase() !== "TAXAMOUNT"){
                                        if (element.toUpperCase() === "ADJUSTMENT"){
                                            if (accountnamefield){
                                                html += `<div style = "margin-left:-0.2vw;display: flex;align-items: center;justify-content: center;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                                            }else{
                                                html += `<div style = "margin-left:-1vw;display: flex;align-items: center;justify-content: center;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                                            }    
                                        }else if (element.toUpperCase() !== "ADJUSTMENT"){
                                            if (accountnamefield && element.toUpperCase() === "NET_BALANCE"){
                                                html += `<div style = "margin-left:-.2vw;display: flex;align-items: center;justify-content: center;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                                            }else{
                                                html += `<div style = "margin-left:-.1vw;display: flex;align-items: center;justify-content: center;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                                            }    
                                        }    
                                    }    
                                }    
                                if (element === "document_number" || element === "amount"){
                                    let newvalue = totarr[totalcount];
                                    if (totarr[totalcount] === "Document"){
                                        newvalue = advancevoucher;
                                    }
                                    html += `<div class="advancevalue" style = "float:right;">${newvalue}</div>`;                 
                                }else{
                                    html += `<div class="advancevalue" style = "float:right;">${showPlaceholder(totarr[totalcount])}</div>`;                 
                                }   
                                html += `</div>`;
                            }else{
                               advancefieldkey = `[aria-label="${alternatekeys[totalcount]}"]`;
                               if (mainElementCategorize.current.querySelector(advancefieldkey)){  
                                   const widthmin = mainElementCategorize.current.querySelector(advancefieldkey).style.minWidth;
                                   const widthmax = mainElementCategorize.current.querySelector(advancefieldkey).style.maxWidth; 
                                   widthl = mainElementCategorize.current.querySelector(advancefieldkey).offsetWidth;  
                                   if (String(totarr[totalcount]).toUpperCase() === "ADVANCE"){                 
                                       html += `<div style = "padding-left:3vw;display: flex;align-items: center;justify-content: center;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                                   }else if (String(totarr[totalcount]).toUpperCase() !== "ADVANCE"){
                                       if (element.toUpperCase() !== "TAXAMOUNT"){
                                           if (element.toUpperCase() === "ADJUSTMENT"){                                            
                                               html += `<div style = "margin-left:-.6vw;display: flex;align-items: center;justify-content: center;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                                           }else{
                                               html += `<div style = "display: flex;align-items: center;justify-content: center;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                                           }    
                                       }else if (element.toUpperCase() !== "ADJUSTMENT"){ 
                                           html += `<div style = "padding-left:.4vw;display: flex;align-items: center;justify-content: center;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                                       }    
                                   }    
                                   if (element === "document_number" || element === "amount"){
                                       let newvalue = totarr[totalcount];
                                       if (totarr[totalcount] === "Document"){
                                           newvalue = advancevoucher;
                                       }
                                       html += `<div class="advancevalue" style = "float:right;">${newvalue}</div>`;                 
                                   }else{
                                       html += `<div class="advancevalue" style = "float:right;">${showPlaceholder(totarr[totalcount])}</div>`;                 
                                   }   
                                   html += `</div>`;
                               }    
                            }
                         }else{
                              let widthmaxa =0;
                              let widthmina = 0;
                              if (mainElementCategorize.current.querySelector(advancefieldkey)){
                                  widthmina = mainElementCategorize.current.querySelector(advancefieldkey).style.minWidth;
                                  widthmaxa = mainElementCategorize.current.querySelector(advancefieldkey).style.maxWidth; 
                              }else{
                                  advancefieldkey = `[aria-label="${alternatekeys[totalcount]}"]`;
                                  widthmina = mainElementCategorize.current.querySelector(advancefieldkey).style.minWidth;
                                  widthmaxa = mainElementCategorize.current.querySelector(advancefieldkey).style.maxWidth; 
                              }    

                              html += `<div style = "min-width:${widthmina};max-width:${widthmaxa};width:${widthmina};">`;
                              html += `<div class="advancevalue" style = "float:right;"></div>`;                 
                              html += `</div>`;
                        };                       
                      }   
                   });  
                   html += "</div>";
                   mainElementCategorize.current.querySelector("#addadvancevalue").querySelector("#advancedetails").innerHTML = html;
                }else{
                   if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#addadvancevalue")){
                       mainElementCategorize.current.querySelector("#addadvancevalue").innerHTML = "";    
                   };
                }
                let totalbillsallocated = 0;
                categorizeData.data.forEach((cats)=>{         
                        const atamount = cats.adjustment;
                        const checkadamount = StringtoNumber(atamount);  
                        if (checkadamount > 0){
                            totalbillsallocated += 1;   
                        };   
                }); 
                if (totalbillsallocated <= 0){
                    html = '';
                    mainElementCategorize.current.querySelector("#totalcount").innerHTML = html;   
                }                    
                html = `<div style = ${lefttext}>`;

                html += `<div class="total">TOTAL</div>`;
                html += '</div>';   
                totalfieldlist.forEach((element,totalcount)=>{
                  let totalfieldkey = `[data-field="${element}"]`;
                  if (showtotalfieldlist[element]){
                      if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(totalfieldkey)){  
                         const widthmin = mainElementCategorize.current.querySelector(totalfieldkey).style.minWidth;
                         const widthmax = mainElementCategorize.current.querySelector(totalfieldkey).style.maxWidth; 
                         widthl = mainElementCategorize.current.querySelector(totalfieldkey).offsetWidth;   
                         let tamount = totals[totalcount];
                         if (showAdvance){ 
                             tamount =  totals[totalcount] + totarr[totalcount+1];
                         };   
                         html += `<div style = "padding-top:15px;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                         html += `<div class="total" style = "float:right;">${showPlaceholder(tamount)}</div>`;                 
                         html += `</div>`;
                      }else{
                         totalfieldkey = `[aria-label="${alternatekeys[totalcount]}"]`;
                         if (mainElementCategorize.current.querySelector(totalfieldkey)){ 
                             const widthmin = mainElementCategorize.current.querySelector(totalfieldkey).style.minWidth;
                             const widthmax = mainElementCategorize.current.querySelector(totalfieldkey).style.maxWidth; 
                             widthl = mainElementCategorize.current.querySelector(totalfieldkey).offsetWidth;   
                             let tamount = totals[totalcount];
                             if (showAdvance){ 
                                 tamount =  totals[totalcount] + totarr[totalcount+1];
                             };   
                             html += `<div style = "padding-top:15px;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                             html += `<div class="total" style = "float:right;">${showPlaceholder(tamount)}</div>`;                 
                             html += `</div>`;
                         }   
                      }
                  }else{
                        let widthmaxx = 0;
                        let widthminn = 0;
                        if (mainElementCategorize.current.querySelector(totalfieldkey)){
                            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(totalfieldkey)){
                                widthminn = mainElementCategorize.current.querySelector(totalfieldkey).style.minWidth;
                                widthmaxx = mainElementCategorize.current.querySelector(totalfieldkey).style.maxWidth; 
                            }    
                        }else{
                            totalfieldkey = `[aria-label="${alternatekeys[totalcount]}"]`;
                            if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector(totalfieldkey)){
                                widthminn = mainElementCategorize.current.querySelector(totalfieldkey).style.minWidth;
                                widthmaxx = mainElementCategorize.current.querySelector(totalfieldkey).style.maxWidth; 
                            }      
                        }
                        html += `<div style = "min-width:${widthminn};max-width:${widthmaxx};width:${widthminn};">`;
                        html += `<div class="total" style = "float:right;"></div>`;                 
                        html += `</div>`;
                  };                       
                });  
                html += "</div>";
                mainElementCategorize.current.querySelector("#total").innerHTML = html;
            };
        }    
     },500); 
  }
  if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#categorizenow")){
      mainElementCategorize.current.querySelector("#categorizenow").addEventListener("mouseenter", (event) => {
          event.preventDefault();
          event.stopPropagation();
          return false;
      },true);  
      mainElementCategorize.current.querySelector("#categorizenow").addEventListener("mouseover", (event) => {
        event.preventDefault();
        event.stopPropagation();
        return false;
      },true);    
      mainElementCategorize.current.querySelector("#categorizenow").addEventListener("mouseovut", (event) => {
        event.preventDefault();
        event.stopPropagation();
        return false;
      },true);                     
      mainElementCategorize.current.querySelector("#categorizenow").addEventListener("mouseleave", (event) => {
        event.preventDefault();
        event.stopPropagation();
        return false;
     },true);  
  }
  if (pickerType === "mobile"){
    let totalallocate = 0;
    let totalbillsallocated = 0;
    if (categorizeData && categorizeData.data){
        categorizeData.data.forEach((cats)=>{         
           const atamount = cats.adjustment;
           const checkadamount = StringtoNumber(atamount);    
           if (checkadamount > 0){
               totalallocate += checkadamount;  
               totalbillsallocated += 1;  
           };    
        });
    }    
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
            setTimeout(()=>{
               updatetotalallocated(samount);
               updatetotalallocatedbills("");
               updatetotalallocatedtext(showPlaceholder(samount));
            },1000);    
        }    
    }else if (revisedDocumentType && revisedDocumentType.toUpperCase() !==  "TYPE2"){
        if (totalallocate > 0){
            updatetotalallocatedbills(`Selected Bills : ${totalbillsallocated}`);
            updatetotalallocated(totalallocate);
            updatetotalallocatedtext(showPlaceholder(totalallocate));
        }    
    };
  }  
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
};
