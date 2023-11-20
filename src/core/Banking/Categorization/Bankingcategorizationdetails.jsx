import React,{useEffect,useState,useLayoutEffect,useRef} from 'react';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import Loader from '@components/ProcessLoading';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import * as Router from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker,DesktopDatePicker } from '@mui/x-date-pickers-pro';


import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DataGridPro  } from '@mui/x-data-grid-pro';
import { LicenseInfo } from '@mui/x-license-pro';

// import { DataGrid ,gridPageCountSelector,gridPageSelector,useGridApiContext,useGridSelector} from '@mui/x-data-grid';

// import { DataGrid,gridPageCountSelector,gridPageSelector,useGridApiContext,useGridSelector } from '@mui/x-data-grid-pro';
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";


import Collapse from '@mui/material/Collapse';

import { useLocation } from 'react-router-dom';
import NumberFormat from "./NumberFormat.jsx";

import * as css from './BankingCategorizationDetails.scss';
import './MuiAddonStyles.css';
import { CommonDrawer } from '../AccountBalance/CommonDrawer';



LicenseInfo.setLicenseKey(
    'e8185c84beb4956b5b6eb26765b7b0a1Tz01NDk0NixFPTE3MDA5MDAyNzQwNDQsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=',
  );



//  const Valid = () => {
//    const v = validateAllFields();
//    const valid = Object.values(v).every((val) => !val);
//    if (!valid) {
//      setValidationErr((s) => ({ ...s, ...v }));
//      return false;
//    }
//    return true;
//  };  
  
let derivedTransactions = {};
let processing = false;
let bankName = "";
let bankAccount = "";
const ispagination = false;
const derivedMasters = {"incomecategories":{"data":[]},"expensecategories":{"data":[]},"towards":{"inflow":{},"outflow":{},"data":[]},"type":[{"name":"Receipt","id":"receipt_from_party"},{"name":"Payment","id":"pauyment_to_party"}]};
const categoryList = {};
const showtooltip = false;



const BankCategoryDetails = () => {
    const {
      organization,
      user,
 //     enableLoading,
      openSnackBar,
    } = React.useContext(AppContext);
    const navigate = Router.useNavigate();


//    const [SelectedBank, setSelectedBank] = React.useState(true);
    const [BankList, setBankList] = useState({});
    const [SelectedBankID,setSelectedBankID] = useState(null);
    const perDayTimeinMicroSeconds = 24 * 60 * 60 * 1000;
    const [fromDate,setFromDate] = useState(new Date(new Date().getTime() - (31 * perDayTimeinMicroSeconds)));
    const [toDate,setToDate] = useState(new Date());
    const [winWidth,setWinWidth] = useState(window.innerWidth);
    const [pickerType,setPickerType] = useState("");
    const [BankTransactions, setBankTransactions] = useState([]);
    const [GridHeight,setGridHeight] = useState(400);
    const [gridSize,setGridSize] = useState(5);
    const gridElement = useRef();
    const mainElement = useRef();
    const Months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const [openingBalance,setopeningBalance] = useState(0);
    const [closingBalance,setclosingBalance] = useState(0);  
    const [rawclosingBalance,setrawclosingBalance] = useState(0);
    const [rawopeningBalance,setrawopeningBalance] = useState(0);
    const [currentPage,setcurrentPage] = useState(-1);
    const [showLoader,setshowLoader] = useState(0);
    const [categorization,setCategorization] = useState(false);
    const [totalPages,setTotalPages] = useState(0);
    const [completedPages,setCompletedPages] = useState(1);
    const [previousDataFetch,setpreviousDataFetch] = useState(false);
    const [pageProcessingFromDate,setpageProcessingFromDate] = useState('');
    const [pageProcessingToDate,setpageProcessingToDate] = useState('');
    const [Currentrow,setCurrentrow] = useState(-1);
    const [dataSelected,setdataSelected] = useState({});
    const [initClosingBalance,setinitClosingBalance] = useState(false);
    const [BankAccountID,setBankAccountID] = useState("");


 //   const [defaultPage,setdefaultPage] = useState(3);
    const location = useLocation();
//    const [lfromDate,setlfromDate] = useLocalStorage("fromDate", new Date(new Date().getTime() - (31 * perDayTimeinMicroSeconds)));
//    const [ltoDate,setltoDate] = useLocalStorage("toDate",new Date());
//    const [lbankID,setlbankID] = useLocalStorage("bankID","");
//    const [lcatoption,setlcatOption] = useLocalStorage("catoption",0);
    const [arrowDown,setarrowDown] = useState(false);
    const [arrowUp,setarrowUp] = useState(false);   
    const [arrowClicked,setarrowClicked] = useState(false);
    const [CollapseElementHeight,setCollapseElementHeight] = useState(0);
    const [BottomSheetNumber, setBottomSheetNumber] = useState(false);
    let bid = "";
    if (location && location.state && location.state.bandetails){
         bid = location.state.bankdetails.id;
    }   
    let bankaccount = "";
    if (location && location.state && location.state.bank_account_id){
        bankaccount = location.state.bank_account_id;
    }    

    useLayoutEffect(() => {     
      function updateSize() {
        setWinWidth(window.innerWidth);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      const topelement = mainElement.current.firstChild;
      // const topelementposition = topelement.offsetTop+topelement.offsetHeight; 
//      const netheight = window.innerHeight - topelementposition;      
      const netheight =  mainElement.current.parentNode.offsetHeight - topelement.offsetHeight - 40;   
      if (pickerType === "desktop"){ 
          setGridHeight(netheight-30);
      }else{ 
          mainElement.current.querySelector("#datagridbox").style.height = `${netheight}px`; 
          setGridHeight(netheight);
          setGridSize(5);
          if (document.querySelector(".DashboardViewContainer_appHeader")){
              document.querySelector(".DashboardViewContainer_appHeader").style.display = "flex";  
          }    
          if (document.querySelector(".DashboardViewContainer_dashboardBodyContainerhideNavBar")){
              document.querySelector(".DashboardViewContainer_dashboardBodyContainerhideNavBar").style.height = "100%";
              document.querySelector(".DashboardViewContainer_dashboardBodyContainerhideNavBar").style.background = "#f2f2f0";
          }
      }
      setarrowDown(false);
      setarrowUp(true);
    
      return () =>{
        window.removeEventListener('resize', updateSize);
      
          if (
            document.querySelector(
              '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
            )
          ) {
            const element = document.querySelector(
              '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
            );
            element.style.removeProperty('background');
            element.style.removeProperty('height');
          }
      };
      

    }, []);


    useEffect(()=>{
       if (winWidth <  600){    
           setPickerType("mobile");
       }else{
           setPickerType("desktop");
       }     
       const topelement = mainElement.current.firstChild;
//       const topelementposition = topelement.offsetTop+topelement.offsetHeight; 
       const netheight =  mainElement.current.parentNode.offsetHeight - topelement.offsetHeight - 40;   
//       const netheight = window.innerHeight - topelementposition;      
       if (pickerType === "desktop"){ 
           setGridHeight(netheight-30);
       }else{ 
           mainElement.current.querySelector("#datagridbox").style.height = `${netheight}px`; 
           setGridHeight(netheight);
           setGridSize(5);
       }    
    },[winWidth]);

    const StringtoNumber = (value) =>{
        let derivedval = String(value).split(" ")[1];
        if (!derivedval){
            derivedval = String(value);
        }
        if (!derivedval){
            derivedval = "0.00"; 
        }
        derivedval = parseFloat(derivedval.split(",").join(""));
        return derivedval;
    };

    const RoundingtheNumber = (value) =>{
        return Math.round(value * 100) / 100;
    };

    const addDecimals = (value) =>{
        let cstr = String(value);
        let cstrdecimal = cstr.split(".")[1];
        if (cstrdecimal){
           if (cstrdecimal.length < 2){
               cstrdecimal += "0".repeat(2-cstrdecimal.length );
               cstr = `${cstr.split(".")[0]}.${cstrdecimal}`;
           }
         }else{
           cstr += ".00";
         }           
        return  cstr;
    };    

    const showPlaceholder = (value) =>{
        let derivedval = StringtoNumber(value);  
        derivedval = RoundingtheNumber(derivedval);
        const amountstr = addDecimals(derivedval);
        const finalstr = amountstr.split(".");
        const strreplaced = `${finalstr[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")}.${finalstr[1]}`;  
        return NumberFormat(strreplaced);
    };


    const dateInput = (inp) =>{
        inp.preventDefault();
    }; 

    useEffect(()=>{
           const topelement = mainElement.current.firstChild;
 //          const topelementposition = topelement.offsetTop+topelement.offsetHeight; 
           setCollapseElementHeight(topelement.offsetHeight);
           const netheight =  mainElement.current.parentNode.offsetHeight - topelement.offsetHeight ;      
           if (pickerType === "desktop"){ 
               mainElement.current.querySelector("#datagridbox").style.height = `${netheight-30}px`; 
           }else{ 
               mainElement.current.querySelector("#datagridbox").style.height = `${netheight}px`; 

           } 
    },[pickerType,GridHeight]);


    useEffect(()=>{
      if (arrowDown){
          const netheight =  mainElement.current.parentNode.offsetHeight - 80;      
          if (pickerType === "mobile"){ 
              mainElement.current.querySelector("#datagridbox").style.height = `${netheight}px`; 
          } 
      }
      if (arrowUp){
           const netheight =  mainElement.current.parentNode.offsetHeight - CollapseElementHeight - 40;    
          if (pickerType === "mobile"){ 
              mainElement.current.querySelector("#datagridbox").style.height = `${netheight}px`; 
          } 
      }
      const elList = document.querySelectorAll("div");
      elList.forEach((el)=>{
        if (el.innerHTML === "MUI X: Invalid license key") {
            el.style.display = "none";
   //         el.innerHTML = "";
        }
      });
      

    },[arrowClicked,arrowDown,arrowUp,CollapseElementHeight,pickerType]);



    const resetBankData = () =>{
       setopeningBalance(0);
       setclosingBalance(0);
       setrawclosingBalance(0);
       setrawopeningBalance(0);
       setBankTransactions({});
       derivedTransactions = {};
       setcurrentPage(-1);
    };

    const fetchExpenseCategoryDetails = () =>{
        setshowLoader(1); 
        const params = {
            "category_type": "expense_category"
        };
        const tquery = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}` ).join('&');
        const query = `?${tquery}`;
        const urls = `organizations/${organization?.orgId}/accounts${query}`;
        RestApi(urls,{
            method: METHOD.GET,
            headers: {
              Authorization: `Bearer ${user?.activeToken}`,
            }
          },
        )
        .then((res) => {
            const newdata = res.data.filter((ecategory)=>{return ecategory.active;});
            derivedMasters.expensecategories.data = newdata;          
            setshowLoader(0);          
        })
        .catch((e) => {
            openSnackBar({
              message: e.message,
              type: MESSAGE_TYPE.INFO,
            });
        });    
    };

    const fetchIncomeCategoryDetails = () =>{
        setshowLoader(1); 
        const urls = `organizations/${organization?.orgId}/income_categories`;
        RestApi(urls,{
            method: METHOD.GET,
            headers: {
              Authorization: `Bearer ${user?.activeToken}`,
            }
          },
        )
        .then((res) => {
            const newdata = res.data.filter((ecategory)=>{return ecategory.active;});
            derivedMasters.incomecategories.data = newdata;          
            setshowLoader(0);          
        })
        .catch((e) => {
            openSnackBar({
              message: e.message,
              type: MESSAGE_TYPE.INFO,
            });
        });    
    };
    

    const fetchTowardsDetails = () =>{
        setshowLoader(1); 
        const urls = `organizations/${organization?.orgId}/accounts/categorization_account_list`;
        RestApi(urls,{
            method: METHOD.GET,
            headers: {
              Authorization: `Bearer ${user?.activeToken}`,
            }
          },
        )
        .then((res) => {
            derivedMasters.towards.data = res.data; 
            derivedMasters.towards.data.push({"id":"expense","name":"Expenses",inflow_description:"Expense",outflow_description:"Expense"});
            derivedMasters.towards.data.push({"id":"income","name":"Income",inflow_description:"Income",outflow_description:"Income"});
            const newlist1 = {};
            const newlist2 = {};
            res.data.forEach((toward)=>{
               newlist1[toward.inflow_description] = toward;
               newlist2[toward.outflow_description] = toward;
            }); 
            derivedMasters.towards.inflow = newlist1;
            derivedMasters.towards.outflow = newlist2;           
            setshowLoader(0);          
        })
        .catch((e) => {
            openSnackBar({
              message: e.message,
              type: MESSAGE_TYPE.INFO,
            });
        });    
    };
    

     useEffect(()=>{
        if (pickerType === "mobole"){
            if (document.querySelector(".DashboardViewContainer_appHeader")){
                document.querySelector(".DashboardViewContainer_appHeader").style.display = "flex";  
            }    
            if (document.querySelector(".DashboardViewContainer_dashboardBodyContainerhideNavBar")){
   //             document.querySelector(".DashboardViewContainer_dashboardBodyContainerhideNavBar").style.height = "100%";
            }  
            if (document.querySelector(".DashboardViewContainer_dashboardContainer")){
                document.querySelector(".DashboardViewContainer_dashboardContainer").style.background = "";
            }
        }        
        fetchTowardsDetails();
        fetchExpenseCategoryDetails();
        fetchIncomeCategoryDetails();

     },[]);


    const fetchBankTransactions = (firsttime,restricttodate,fdate,tdate,firsttimeset,applyclicked,bankid) => {
      setshowLoader(1); 
      let fromdate = new Date();
      let todate = new Date();
      if (!restricttodate){
          let fmonth = String(fromDate.getMonth()+1);
          if (fmonth.length < 2){
              fmonth = `0${fmonth}`;
          };           
          let tmonth = String(toDate.getMonth()+1);
          if (tmonth.length < 2){
              tmonth = `0${tmonth}`;
          };
          let fday = String(fromDate.getDate());
          if (fday.length < 2){
              fday = `0${fday}`;
          } 
          let tday = String(toDate.getDate());
          if (tday.length < 2){
              tday = `0${tday}`;
          } 
          fromdate = `${fromDate.getFullYear()}-${fmonth}-${fday}`;
          todate = `${toDate.getFullYear()}-${tmonth}-${tday}`;   
          setpageProcessingFromDate(fromDate);
          setpageProcessingToDate(toDate);                           
      }else{
         let fmonth = String(fdate.getMonth()+1);
         if (fmonth.length < 2){
             fmonth = `0${fmonth}`;
         };           
         let tmonth = String(tdate.getMonth()+1);
         if (tmonth.length < 2){
             tmonth = `0${tmonth}`;
         };
         let fday = String(fdate.getDate());
         if (fday.length < 2){
             fday = `0${fday}`;
         } 
         let tday = String(tdate.getDate());
         if (tday.length < 2){
             tday = `0${tday}`;
         }       
         fromdate = `${fdate.getFullYear()}-${fmonth}-${fday}`;
         todate = `${tdate.getFullYear()}-${tmonth}-${tday}`;      
         setpageProcessingFromDate(fdate);
         setpageProcessingToDate(tdate);       
      }    

      const params = {
        "from_date": fromdate,
        "to_date": todate,
        "sort_by": "date:asc",
        "page": completedPages
      };


      const tquery = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}` ).join('&');
      const query = `?${tquery}`;
      let url = "";
      if (bankid){
          url = `organizations/${organization?.orgId}/yodlee_bank_accounts/${bankid}/txns${query}`;
     }else{
          url = `organizations/${organization?.orgId}/yodlee_bank_accounts/${SelectedBankID}/txns${query}`;
      }    
      RestApi(url,{
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user?.activeToken}`,
          }
        },
      )
        .then((res) => {
          processing = false;
          if (res && !res.error) {
             if (res.message) {
                 openSnackBar({
                    message: res.message,
                    type: MESSAGE_TYPE.WARNING,
                 });
             }else{ 
                 if (res && res.data){
                     const newdata = res;
                     const simgroups = {};
                     let count = 0;
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
                         setBankTransactions(newdata);
                         if (newdata.data.length > 0){                          
                             setcurrentPage(0);
                             setTotalPages(newdata.pages);
                             setTimeout(()=>{
                                 setCompletedPages(completedPages+1);
                             },2000);
                         }; 
                         return;
                     }
                     setTimeout(()=>{
                         setBankTransactions(newdata);                      
                     },2000);    
                     if (BankTransactions && BankTransactions.data && BankTransactions.data.length > 0){  
                         if (previousDataFetch){
                             if (newdata.data.length > 0){
                                 if (newdata.pages > 1){
                                     if (firsttimeset){ 
                                         derivedTransactions = {};
                                         Object.keys(BankTransactions).forEach((datakey)=>{
                                            if (datakey !== "data"){
                                                derivedTransactions[datakey] = BankTransactions[datakey];
                                            }  
                                         });   
                                         setTotalPages(newdata.pages);
                                     }    
                                     const transactions = newdata.data;                                  
                                     if (derivedTransactions.data){
                                         const newTransactions = derivedTransactions.data.concat(transactions);  
                                         derivedTransactions.data = newTransactions;    
                                     }else{
                                         derivedTransactions.data = transactions;
                                     }                        
                                     setCompletedPages(completedPages+1);
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
                                    setBankTransactions(ntransactions);                              
                                }
                             }    
                             if (newdata.pages > 1){                        
                                 setCompletedPages(completedPages+1);   
                             }                            
                         }else{
                             if (newdata.data.length > 0){
                                 const transactions = newdata.data;
                                 const newTransactions = BankTransactions.data.concat(transactions);    
                                 const ntransactions  = {};
                           //      Object.keys(BankTransactions).forEach((datakey)=>{
                          //         if (datakey !== "data"){
                          //             ntransactions[datakey] = BankTransactions[datakey];
                          //         }  
                          //       });      
                                 ntransactions.data = newTransactions;                            
                                 if (firsttimeset){ 
                                     setTotalPages(newdata.pages);   
                                 }  
                                 setTimeout(()=>{
                                    setBankTransactions(ntransactions);
                                 },2000);
                             }       
                             if (newdata.pages > 1){                        
                                 setCompletedPages(completedPages+1);   
                             }                            
                         }
                     }else{
                         if (previousDataFetch){
                             if (newdata.pages > 1){
                                 if (firsttimeset){ 
                                     setTotalPages(newdata.pages);
                                 }    
                                 derivedTransactions = newdata;                                                           
                                 setCompletedPages(completedPages+1);
                             }else{
                                 setBankTransactions(newdata);
                             }; 
                         }else{
                             if (newdata.pages > 1){
                                 if (firsttimeset){ 
                                     setTotalPages(newdata.pages);   
                                 }  
                                 setBankTransactions(newdata);  
                                 setCompletedPages(completedPages+1);
                             }else{
                                 setBankTransactions(newdata);
                             };                     
                        };                    
                     }   
                     if (newdata.data.length > 0 && firsttime){
                         setcurrentPage(0);
                         setTotalPages(newdata.pages);
                         setTimeout(()=>{
                            setCompletedPages(completedPages+1);
                         },2000) ;
                     }; 
//                    setdefaultPage(defpage);                  
                };           
            }
          }
          setshowLoader(0);
 //         setdefaultPage(defpage);
//          enableLoading(false);
        })
        .catch((e) => {
            console.log(e);
          setshowLoader(0); 
          openSnackBar({
            message: e.message,
            type: MESSAGE_TYPE.INFO,
          });
        });
    };

    useEffect(()=>{
       if (completedPages <= totalPages){
           if (previousDataFetch){
               if (currentPage < 0){
                   fetchBankTransactions(true,true,pageProcessingFromDate,pageProcessingToDate,false,false);   
               }else{
                   fetchBankTransactions(false,true,pageProcessingFromDate,pageProcessingToDate,false,false);            
               };
           }else if (currentPage < 0){
                  fetchBankTransactions(true,true,pageProcessingFromDate,pageProcessingToDate,false,false);   
           }else{
                  fetchBankTransactions(false,true,pageProcessingFromDate,pageProcessingToDate,false,false);            
           };
       } else if (previousDataFetch){   
              if (derivedTransactions.data){  
                   const newtransactions = derivedTransactions.data.concat(BankTransactions.data);
                   const ntransactions  = {};
                   Object.keys(BankTransactions).forEach((datakey)=>{
                     if (datakey !== "data"){
                         ntransactions[datakey] = BankTransactions[datakey];
                     }  
                   }); 
                   ntransactions.data = newtransactions;
                   setBankTransactions(ntransactions);
               }    
               setpreviousDataFetch(false);
               setTotalPages(0);
               setCompletedPages(1);
               derivedTransactions = {};
               Object.keys(BankTransactions).forEach((datakey)=>{
                  if (datakey !== "data"){
                      derivedTransactions[datakey] = BankTransactions[datakey];
                  };    
              });
      } else {        
           setTotalPages(0);        
           setCompletedPages(1);
      };
    },[completedPages,totalPages]);


    const fetchBankDetails = () => {
        setinitClosingBalance(false);
        RestApi(
          `organizations/${organization?.orgId}/yodlee_bank_accounts/bank_listing`,
          {
            method: METHOD.GET,
            headers: {
              Authorization: `Bearer ${user?.activeToken}`,
            },
          },
        )
          .then((res) => {
            if (res && !res.error) {
              if (res.message) {
                openSnackBar({
                  message: res.message,
                  type: MESSAGE_TYPE.WARNING,
                });
              } else {
                if (res.data && res.data.length === 0){
                    return;
                }
                setinitClosingBalance(true);
                resetBankData();     
                setBankList(res);
                let returndata = localStorage.getItem("bankdetails");
                let selectedbankid = "";
                if (!returndata){
                    if (!bid){
                        selectedbankid = res && res.data && res.data[0].id;
                    }else{
                        selectedbankid = bid;
                    }    
                }    
                if (res && res.data){
                    if (!returndata){                    
                        if (!bid){
                            res.data.forEach((bank)=>{
                               if (bank.account_type.lowerCase !== "fd"){ 
                                   selectedbankid = bank.id;
                               }
                            });
                        }    
                    };    
                };        
                if (returndata){
                    returndata = JSON.parse(returndata);
                    selectedbankid = returndata.bankID;
                    localStorage.setItem("bankdetails","");
                }
                if (!returndata){
                    if (!bid){
                        setSelectedBankID(res && res.data && res.data.length > 0 ? selectedbankid : null);    
                    }else{
                        setBankAccountID(bankaccount);
                        setSelectedBankID(bid);
                    }    
                }else{
                    setBankAccountID(returndata.bankaccountid);    
                    setSelectedBankID(returndata.bankID);    
                }    
              }
            }
//            enableLoading(false);
          })
          .catch((e) => {
            openSnackBar({
              message: e.message,
              type: MESSAGE_TYPE.INFO,
            });
          });
    };

    useEffect(()=>{
//        if (!bid){
            fetchBankDetails();
//        }else{
//            console.log(bankaccount);
//            console.log(bid);
//            setBankAccountID(bankaccount);
//            setSelectedBankID(bid);
 //       }    
    },[]);

    const getData = (data)=>{
       setBankAccountID(data.bank_account_id);
       setSelectedBankID(data.id);
       setBottomSheetNumber(!BottomSheetNumber);
    };

    useEffect(()=>{
       if (SelectedBankID){
           resetBankData();
           setTimeout(()=>{
              fetchBankTransactions(true);
           },1000);   
       }
    },[SelectedBankID]);



    const reProcessData = (firsttime,restricttodate,fdate,tdate,firsttimeset,resetdata,applyclicked,bankid) =>{
      if (resetdata){
          resetBankData();          
      }
      if (currentPage < 0){
          fetchBankTransactions(true,restricttodate,fdate,tdate,firsttimeset,applyclicked,bankid);   
      }else if (currentPage >= 0){
          if (resetdata){
              fetchBankTransactions(true,restricttodate,fdate,tdate,firsttimeset,applyclicked,bankid);          
          }else{
              fetchBankTransactions(firsttime,restricttodate,fdate,tdate,firsttimeset,applyclicked,bankid);          
          }    
      }    
    };

//    useEffect(()=>{
//       if (SelectedBankID){
//           reProcessData(false,false,fromDate,toDate,false,true,false,SelectedBankID,defaultPage);
//        }    
//    },[fromDate,toDate,SelectedBankID]);



 
    useEffect(() => {
        let returndata = localStorage.getItem("bankdetails");
        if (returndata){
            resetBankData();
            returndata = JSON.parse(localStorage.getItem("bankdetails")); 
            setFromDate(new Date(returndata.fromdate));
            setToDate(new Date(returndata.todate));
            let selectedcategorization = false;
            if (returndata.categorization===1){
                selectedcategorization = true;
            }
            setCategorization(selectedcategorization);
            setcurrentPage(returndata.currentpage+1);
            setBankList(returndata.banklist);
            setSelectedBankID(returndata.bankID);            
//            reProcessData(false,true,new Date(returndata.fromdate),new Date(returndata.todate),true,false,false,returndata.bankID,returndata);
        }   
    },[location]);



    const loadAdditionalPrevmonthDate = (e) =>{
      if (processing){
          return;
      }  
      e.stopPropagation();
      e.preventDefault();
      processing = true;
      setpreviousDataFetch(true);
      let currentdate = fromDate;
      currentdate = new Date(currentdate.getTime() - (31 * perDayTimeinMicroSeconds));
      reProcessData(false,true,currentdate,new Date(fromDate.getTime()-(1 * perDayTimeinMicroSeconds)),true,false,false);
      setFromDate(currentdate);
    };



    


    useEffect(()=>{
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
            if (mainElement.current.querySelector(".MuiDataGrid-footerContainer")){
                mainElement.current.querySelector(".MuiDataGrid-footerContainer").querySelector("div").innerHTML = opvar;
                mainElement.current.querySelector("#closingbalancebutton").addEventListener('click', loadAdditionalPrevmonthDate);
            }
        }else if (mainElement.current.querySelector("#desktopclosing")){
                mainElement.current.querySelector("#desktopclosing").innerHTML = "";

        }     
        if (pickerType === "desktop" && !ispagination){
            setTimeout( () =>{
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
                               if (rawclosingBalance > 0){
                                   opvar += `<div id="bankingCategorizationClosingBalance_value_debit_desktop">${showPlaceholder(closingBalance)}</div>`;
                               }    
                               opvar += `</div>`;                            
                           }    
                           if (column.toUpperCase() === "AMOUNT1"){
                               opvar += `<div style = "height:20px;float:left;min-width:${widthmin};max-width:${widthmax};width:${widthmin};">`;
                               if (rawclosingBalance <= 0){
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
                if (mainElement.current.querySelector(".MuiDataGrid-footerContainer") && opvar){
                    mainElement.current.querySelector(".MuiDataGrid-footerContainer").querySelector("div").innerHTML = opvar;
                    mainElement.current.querySelector("#closingbalancebutton").addEventListener('click', loadAdditionalPrevmonthDate);
                }
           },500);
        }else if (mainElement.current.querySelector("#desktopclosing")){
                mainElement.current.querySelector("#desktopclosing").innerHTML = ""; 
        }    
    },[pickerType,closingBalance,initClosingBalance]);




    const checkNullandAssign = (data,keydata) =>{
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
                 returnvalue = `${day} ${Months[dt.getMonth()]} ${dt.getFullYear()}`;
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


    const customHeaderOpeningBalanceText = (defs,title) =>{
       const html = <div><div className = {css.baseNameOther}>{defs.colDef.headerName}</div><div className={css.customNameText}>{title}<button type="button" className={[css.AdditionalDataButton,css.addnewrows,css.buttonopening].join(' ')} onClick={(e) => loadAdditionalPrevmonthDate(e)}>Preceding Month</button></div></div>;
       return html;
    };

    const customHeaderOpeningBalanceValue = (defs) =>{
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


    const getAmount = (typee,data) =>{
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
       }  
       return "";    
    };

    const getTooltipAmount = (type,data) =>{
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

    const customHeaderOpeningBalanceMobile = (defs,title) =>{
      const html = <div className={css.baseNameMobileHolder}><div className={css.baseNameMobile}>{defs.colDef.headerName}</div><div id = "customTextHolder"><div className={css.customNameMobileText}>{title}</div><button className={[css.AdditionalDataButton,css.addnewrows,css.buttonopening].join(' ')} type = "button" onClick={(e) => loadAdditionalPrevmonthDate(e)}>Preceding Month</button><div className={rawopeningBalance > 0 ? css.customNameMobileValue : css.customNameMobileValueZero }>{showPlaceholder(openingBalance)}</div></div></div>;
      return html;
    };

    const debitNone = () =>{
        const html =  <div className={css.baseNameDebitNone}>Inflow</div>;
        return html;
    };


    const creditNone = () =>{
        const html =  <div className={css.baseNameCreditNone}>Outflow</div>;
        return html;
    };


    const transactionColumnsDesktop = [
      {field:"date",headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:.5,headerName:"Date", renderFooter : () =>{return "<div>dddd</div>";},valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:"date",type:'D',absolute:false,altname:""}});},renderCell: (data) =>  (showtooltip?<Tooltip title={data.row.date} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:"date",type:'D',absolute:false,altname:""}})}</span></Tooltip>:checkNullandAssign(data.row,{data1:{field:"date",type:'D',absolute:false,altname:""}}))},
      {field:'txn_id',headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:1,headerName:"Document No.", valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:"voucher_reference",type:'C',absolute:false,altname:"Uncategorized"}}).trim(); },renderCell: (data) =>  (showtooltip?<Tooltip title={checkNullandAssign(data.row,{data1:{field:"voucher_reference",type:'C',absolute:false,altname:"Uncategorized"}}).trim()} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:"voucher_reference",type:'C',absolute:false,altname:"Uncategorized"}}).trim()}</span></Tooltip>:checkNullandAssign(data.row,{data1:{field:"voucher_reference",type:'C',absolute:false,altname:"Uncategorized"}}).trim())},
      {field:"party_name",headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:1,headerName:"Party",renderHeader: (params) => {return customHeaderOpeningBalanceText(params,'OPENING BALANCE');} ,valueGetter: (data) => {return  checkNullandAssign(data.row,{data1:{field:"party_initial",type:'C',absolute:false,altname:""},data2:{field:"party_name",type:'C'}}); },renderCell: (data) =>  (showtooltip?<Tooltip title={checkNullandAssign(data.row,{data1:{field:"party_initial",type:'C',absolute:false,altname:""},data2:{field:"party_name",type:'C',altname:""}})} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:"party_initial",type:'C',altname:""},data2:{field:"party_name",type:'C',absolute:false,altname:""}})}</span></Tooltip>:checkNullandAssign(data.row,{data1:{field:"party_initial",type:'C',absolute:false,altname:""},data2:{field:"party_name",type:'C'}}))},
      {field:'purpose',headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:1,headerName:"Purpose", valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:"purpose",type:'C',absolute:false,altname:""}}).trim(); },renderCell: (data) =>  (showtooltip?<Tooltip title={checkNullandAssign(data.row,{data1:{field:"purpose",type:'C',absolute:false,altname:""}}).trim()} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:"purpose",type:'C',absolute:false,altname:""}}).trim()}</span></Tooltip>:checkNullandAssign(data.row,{data1:{field:"purpose",type:'C',absolute:false,altname:""}}).trim())},
      {field:"narration",headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:2,headerName:"Description",valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:"narration",type:'C',absolute:false,altname:""}}); },renderCell: (data) =>  (showtooltip?<Tooltip title={checkNullandAssign(data.row,{data1:{field:"narration",type:'C',absolute:false,altname:""}})} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:"narration",type:'C',absolute:false,altname:""}})}</span></Tooltip>:checkNullandAssign(data.row,{data1:{field:"narration",type:'C',absolute:false,altname:""}}))},
      {field:"amount2",headerClassName:"headerStyle",sortable: false,align:'right',headerAlign: 'right',flex:.8,headerName:"Inflow",renderHeader: (params) => {return rawopeningBalance  >= 0 ? customHeaderOpeningBalanceValue(params): debitNone();},valueGetter: (data) => {return getAmount(1,data); },renderCell: (data) =>  (showtooltip?<Tooltip title={getTooltipAmount(1,data)}><span className={css.table_cell_trucate}>{getTooltipAmount(1,data)}</span></Tooltip>:getTooltipAmount(1,data) )},
      {field:"amount1",headerClassName:"headerStyle",sortable: false,align:'right',headerAlign: 'right',flex:.8,headerName:"Outflow",renderHeader: (params) => {return rawopeningBalance < 0 ? customHeaderOpeningBalanceValue(params) : creditNone();},valueGetter: (data) => {return getAmount(-1,data);  },renderCell: (data) =>  (showtooltip?<Tooltip title={getTooltipAmount(-1,data)} ><span className={css.table_cell_trucate}>{getTooltipAmount(-1,data)}</span></Tooltip>:getTooltipAmount(-1,data)   )},
    ]; 
//    !data.row.group_data ? (parseFloat(data.row.amount) > 0 ?`${numberFormat(checkNullandAssign(data.row,{data1:{field:"formatted_amount",type:'N',absolute:true,altname:""}}))}` :'') : (parseFloat(data.row.group_total) > 0 ?`${numberFormat(checkNullandAssign(data.row,{data1:{field:"formatted_group_total",type:'N',absolute:true,altname:""}}))}` :'')
 //   !data.row.group_data ? (parseFloat(data.row.amount) > 0 ?`${numberFormat(checkNullandAssign(data.row,{data1:{field:"formatted_amount",type:'N',absolute:true,altname:""}}))}`:'') : (parseFloat(data.row.group_total) > 0 ?`${numberFormat(checkNullandAssign(data.row,{data1:{field:"formatted_group_total",type:'N',absolute:true,altname:""}}))}`:'') 

 const header = <Box style={{width:"100%",position:"absolute"}}><Grid  container style = {{height:"60px",marginTop:"-26px",width:"100%"}}>
 <Grid item xs={12} className = {css.mobileGridRow}>
   <Box id = "cardTitleLeft" style={{color:"#283049"}}>
      <div style = {{marginLeft: "71%"}}>Transaction Details</div>
  </Box>  
 </Grid>
 </Grid>
 <Box><hr id = "transactionline" style = {{marginLeft:"-10px",marginTop:"-25px",width:"100%"}}/></Box></Box>;


    const transactionColumnsMobile = [
      {field:"Details",sortable: false,align:'left',headerAlign: 'center',flex:1,headerName:header,colSpan: 6,renderHeader: (params) => {return customHeaderOpeningBalanceMobile(params,'OPENING BALANCE');},
         renderCell: (data) => {
           const datetitle = checkNullandAssign(data.row,{data1:{field:"date",type:'D',absolute:false,altname:""}});
           const documenttitle = checkNullandAssign(data.row,{data1:{field:"document",type:'D',absolute:false,altname:"Uncategorized"}});
           const customertitle = checkNullandAssign(data.row,{data1:{field:"party_initial",type:'C',absolute:false},data2:{field:"party_name",type:'C',altname:""}});
           const purposetitle = checkNullandAssign(data.row,{data1:{field:"purpose",type:'C',absolute:false},data2:{field:"purpose",type:'C',altname:""}});
           const descriptiontitle = checkNullandAssign(data.row,{data1:{field:"narration",type:'C',absolute:false,altname:""}});
           let credittitle = getAmount(-1,data);
           if (!credittitle){
               credittitle = "-";
           }
           let debittitle = getAmount(1,data);
           if (!debittitle){
               debittitle = "-";
           }
           const runningbalancetitle = showPlaceholder(data.row.formatted_running_balance);
           const datedesc =        `Date         `;   // ${datetitle}`;
           const documentdesc =    `Document No. `;   //  ${documenttitle}`;
           const customerdesc =    `Party      `;  // ${customertitle}`;
           const purposedesc =    `Purpose     `;  // ${customertitle}`;          
           const descriptiondesc = `Description  `;  // ${descriptiontitle}`;
           const creditdesc =      `Inflow    `;  // ${credittitle}`;
           const debitdesc =       `Outflow      `;  // ${debittitle}`;
           const runningbalancedesc =       `Balance     `;  // ${debittitle}`;
           return (
             <Stack className={data.row.categorized?css.categorizedColor:css.uncategorizedColor} sx={{width:"100%",minHeight:"none !important",maxHeight:"none !important",height:"auto"}}> 
               <span id = "details" className = {css.mobileGridRow} title = {datetitle}><label htmlFor="details" id = "cardTitleLeft">{datedesc}</label><label htmlFor="derails" id = "cardDataLeft">{datetitle}</label></span>
               <span id = "details" className = {css.mobileGridRow} title = {documenttitle}><label htmlFor="details" id = "cardTitleLeft">{documentdesc}</label><label htmlFor="details"  id = "cardDataLeft">{documenttitle}</label></span>
               <span id = "details" className = {css.mobileGridRow} title = {customertitle}><label htmlFor="details" id = "cardTitleLeft">{customerdesc}</label><label htmlFor="details"  id = "cardDataLeft">{customertitle}</label></span>
               <span id = "details" className = {css.mobileGridRow} title = {purposetitle}><label htmlFor="details" id = "cardTitleLeft">{purposedesc}</label><label htmlFor="details"  id = "cardDataLeft">{customertitle}</label></span>
               <span id = "details" className = {css.mobileGridRow} title = {descriptiontitle}><label className = {css.Notes} htmlFor="details" id = "cardTitleLeft">{descriptiondesc}</label><label htmlFor="details" className = {css.Notes}  id = "cardDataLeft">{descriptiontitle}</label></span>
               <span id = "details" className = {css.mobileGridRow} title = {credittitle}><label htmlFor="details" id = "cardTitleLeft">{creditdesc}</label><label htmlFor="details" className={credittitle === "-"?css.centerposition:''}  rel={credittitle === "-"?"":"diffcolor1"} id = "cardDataRight">{credittitle}</label></span>
               <span id = "details" className = {css.mobileGridRow} title = {debittitle}><label htmlFor="details" id = "cardTitleLeft">{debitdesc}</label><label htmlFor="details"  className={debittitle === "-"?css.centerposition:''} rel={debittitle === "-"?"":"diffcolor2"} id = "cardDataRight">{debittitle}</label></span>
               <span id = "details" className = {css.mobileGridRow} title = {runningbalancetitle}><label htmlFor="details" id = "cardTitleLeft">{runningbalancedesc}</label><label htmlFor="details" rel="diffcolor2" id = "cardDataRight">{runningbalancetitle}</label></span>
             </Stack>
           );
         }
      }      
    ]; 

//    const BankSelect = (c) => {
//        setBankAccountID(c.bank_account_id);
//        setSelectedBankID(c.id);
//        setSelectedBank(!SelectedBank);
//    };


    const BankTransactionSelected = (eve) =>{
        let dataselected = [];
        let rowcounter = 0;
        let rowfound = 0;
        if (BankTransactions && BankTransactions.data){
            BankTransactions.data.forEach((banktransaction)=>{
               if (banktransaction.id === eve[0]){
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
            setCurrentrow(rowf);
            setdataSelected(dataselected);
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
            setCurrentrow(rowf);
            localStorage.setItem("itemstatus",dataselected.categorized?"Edit":"Add");            
            navigate('/bankingcategorization',{state: {status:!dataselected.categorized?"Add":"Edit",bankaccountid:BankAccountID,selectedtype: "others",row:Currentrow,alldata,bankname:bankName,bankaccount:bankAccount,bankid:SelectedBankID,selecteddata:dataSelected,masterslist:derivedMasters} });
        };  
        setTimeout(()=>{
           if (mainElement && mainElement.current && mainElement.current.querySelector("#desktopclosing") && mainElement.current.querySelector("#desktopclosing").parentNode){
               mainElement.current.querySelector("#desktopclosing").parentNode.setAttribute("class","");
           }    
        },200);   
        setinitClosingBalance(!initClosingBalance);  
    };

    const getBankName = () => {
        let bankname = "";
        if (!SelectedBankID){
            bankname = BankList && BankList.data  && BankList.data.length > 0 ? `${BankList.data[0].bank_name} - ${BankList.data[0].bank_account_number}` : '';
            bankName = BankList && BankList.data  && BankList.data.length > 0 ? BankList.data[0].bank_name : '';
            bankAccount = BankList && BankList.data  && BankList.data.length > 0 ? BankList.data[0].bank_account_number : '';
        }else{
            BankList.data.forEach((bank)=>{
                if (bank.id === SelectedBankID){
                    bankName = bank.bank_name;
                    bankAccount = bank.bank_account_number;
                    bankname = `${bank.bank_name} - ${bank.bank_account_number}`;
                }
            });
        }
        return bankname;
    };


      const displayBankpopup = () =>{
//           setSelectedBank(false);   
         setBottomSheetNumber(true);
      };

      const handlePageChange = (d) =>{
           if (currentPage > -1){
               setcurrentPage(d);
           }   
      };

      const getUnCategorized = (d) =>{
           setCategorization(d.target.checked);
      };

      useEffect(()=>{
        if (BankTransactions && BankTransactions.data && BankTransactions.data.length > 0){
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
                    setopeningBalance(BankTransactions.data[startPosition].formatted_opening_balance);
                    setrawopeningBalance(parseFloat(BankTransactions.data[startPosition].opening_balance));
                }else{
                    setopeningBalance(BankTransactions.data[startPosition].formatted_running_balance);
                    setrawopeningBalance(parseFloat(BankTransactions.data[startPosition].running_balance));
                };    
            }    
            if (BankTransactions.data.length >  pagePosition){
                setclosingBalance(BankTransactions.data[pagePosition].formatted_running_balance);
                setrawclosingBalance(parseFloat(BankTransactions.data[pagePosition].running_balance));
            }else{
                setclosingBalance(BankTransactions.data[BankTransactions.data.length-1].formatted_running_balance);
                setrawclosingBalance(parseFloat(BankTransactions.data[BankTransactions.data.length-1].running_balance));
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
        }
      },[currentPage,gridSize,BankTransactions,SelectedBankID]);


     return (
         <div className={css.bankCategorizationWrapper} ref={mainElement}>
           <Loader showloader={showLoader}/>
           {pickerType === "desktop" ?
           <Grid container spacing={1}>    
              <Grid item xs={12} sm={4} id = "bankCategorizationgrid">   
                   <Box component="div"  className={css.bankCategorizationBankboxHolder} onClick={() => displayBankpopup() }>
                       <div className = {css.banktitlename}>Bank Name</div>
                       <div className = {css.bankdetailsholder}>
                          <div className = {css.bankname}>{getBankName()}</div> 
                          <div className = {css.expandbank}><KeyboardArrowRightIcon /></div> 
                       </div>   
                   </Box>
               </Grid> 
               <Grid item xs={6} sm={2} id = "bankCategorizationgrid">
                 <Box component="div" id = "fromdate"  className={css.bankCategorizationDateboxHolder}>
                    <div className = {css.fromdatename}>Start Date</div>               
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div style = {{display:pickerType==='mobile'?'block':'none'}}>
                         <MobileDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}} label="" value={fromDate} onChange={(newValue) => {setFromDate(newValue.$d);}} renderInput={(params) => <TextField  onKeyDown={dateInput} variant="standard" {...params} />} />
                      </div>
                      <div style = {{display:pickerType==='desktop'?'block':'none'}}>
                          <MobileDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}} label="" value={fromDate} onChange={(newValue) => {setFromDate(newValue.$d);}} renderInput={(params) => <TextField  onKeyDown={dateInput} variant="standard" {...params} />} />
                      </div>                      
                    </LocalizationProvider>
                 </Box>  
               </Grid>
               <Grid item xs={6} sm={2} id = "bankCategorizationgrid">
                  <Box component="div" id = "todate" className={css.bankCategorizationDateboxHolder}>
                    <div className = {css.todatename}>End Date</div>               
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div style = {{display:pickerType==='mobile'?'block':'none'}}>
                         <MobileDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}}  label="" value={toDate} onChange={(newValue) => {setToDate(newValue.$d);}} renderInput={(params) => <TextField onKeyDown={dateInput} variant="standard" {...params} />} />
                      </div>
                      <div style = {{display:pickerType==='desktop'?'block':'none'}}>
                         <MobileDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}}  label="" value={toDate} onChange={(newValue) => {setToDate(newValue.$d);}} renderInput={(params) => <TextField onKeyDown={dateInput} variant="standard" {...params} />} />
                   </div>      
                    </LocalizationProvider>
                  </Box>   
               </Grid>
               <Grid item xs={12} sm={2} className = "bankCategorizationgrid_uncategorized_option">
                  <FormGroup>
                      <FormControlLabel control={<Checkbox checked={categorization} color="success" onChange={getUnCategorized}/>} label="Select only Uncategorized" />
                  </FormGroup>
               </Grid>
               <Grid item xs={12} sm={2} id = "bankCategorizationgrid">
                  <div className={css.applyHolder}><Button onClick={() => reProcessData(false,false,new Date(),new Date(),false,true,true,SelectedBankID,1)} className={css.apply}>Apply</Button></div>
               </Grid>
            </Grid>   
            :
             <Box>
               <Collapse orientation="vertical" in={!arrowClicked} collapsedSize={20}>
               <Grid container spacing={1}>    
                <Grid item xs={12} sm={4} id = "bankCategorizationgrid">   
                     <Box component="div"  className={css.bankCategorizationBankboxHolder} onClick={() => displayBankpopup() }>
                         <div className = {css.banktitlename}>Bank Name</div>
                         <div className = {css.bankdetailsholder}>
                            <div className = {css.bankname}>{getBankName()}</div> 
                            <div className = {css.expandbank}><KeyboardArrowDown/></div> 
                         </div>   
                     </Box>
                 </Grid> 
                 <Grid item xs={6} sm={2} rel = "dates" id = "bankCategorizationgrid">
                   <Box component="div" id = "fromdate" className={css.bankCategorizationDateboxHolder}>
                     <div className = {css.fromdatename}>From Date</div>               
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className = {css.fromdate} style = {{display:pickerType==='mobile'?'block':'none'}}>
                           <MobileDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}} label="" value={fromDate} onChange={(newValue) => {setFromDate(newValue.$d);}} renderInput={(params) => <TextField onKeyDown={dateInput} variant="standard" {...params} />} />
                           <div rel="adjustdateposition" className = {css.expandbank}><KeyboardArrowDown/></div> 
                        </div>
                        <div className = {css.todate} style = {{display:pickerType==='desktop'?'block':'none'}}>
                           <DesktopDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}}  label="" value={fromDate} onChange={(newValue) => {setFromDate(newValue.$d);}} renderInput={(params) => <TextField onKeyDown={dateInput} variant="standard" {...params} />} />
                           <div rel="adjustdateposition" className = {css.expandbank}><KeyboardArrowDown/></div> 
                        </div>                      
                      </LocalizationProvider>
                   </Box>   
                 </Grid>
                 <Grid item xs={6} sm={2} rel = "dates" id = "bankCategorizationgrid">
                    <Box component="div"  id = "todate" className={css.bankCategorizationDateboxHolder}>
                      <div className = {css.todatename}>To Date</div>               
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className = {css.fromdate} style = {{display:pickerType==='mobile'?'block':'none'}}>
                           <MobileDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}} label="" value={toDate} onChange={(newValue) => {setToDate(newValue.$d);}} renderInput={(params) => <TextField onKeyDown={dateInput} variant="standard" {...params} />} />
                           <div rel="adjustdateposition" className = {css.expandbank}><KeyboardArrowDown/></div> 
                        </div>
                        <div className = {css.todate} style = {{display:pickerType==='desktop'?'block':'none'}}>
                           <DesktopDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}}  label="" value={toDate} onChange={(newValue) => {setToDate(newValue.$d);}} renderInput={(params) => <TextField onKeyDown={dateInput} variant="standard" {...params} />} />
                           <div rel="adjustdateposition"  className = {css.expandbank}><KeyboardArrowDown/></div> 
                        </div>      
                      </LocalizationProvider>
                   </Box>   
                 </Grid>
                 <Grid item xs={12} sm={2} className =  "bankCategorizationgrid_uncategorized_option">
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={categorization} color="success" onChange={getUnCategorized}/>} label="SELECT ONLY UNCATEGORIZED" />
                    </FormGroup>
                 </Grid>
                 <Grid item xs={12} sm={2} rel="applybutton"  id = "bankCategorizationgrid">
                    <div className={css.applyHolder}><Button onClick={() => reProcessData(false,false,new Date(),new Date(),false,true,true,SelectedBankID,1)} className={css.apply}>Apply</Button></div>
                 </Grid>
              </Grid>
              </Collapse>  
              <Box sx={{display:"none",textAlign:"center",transform:"scale(2)",zIndex:"10"}}>
                 {arrowDown?<KeyboardArrowDown onClick = {()=>{setarrowClicked(false);setarrowDown(false);setarrowUp(true);}}   className={css.drawerkeys}/>:''}
                 {arrowUp?<KeyboardArrowUp onClick = {()=>{setarrowClicked(true);setarrowDown(true);setarrowUp(false);}}  className={css.drawerkeys}/>:''} 
              </Box> 
             </Box> 
            }
            <Box id = "datagridbox" sx={{width: '100%' }}>
              {pickerType==="desktop" ?
                <DataGridPro
                  disableColumnMenu
//                  pagination
//                  pageSize={100}
                  getRowClassName={(params) => params.row.categorized?css.categorizedColor:css.uncategorizedColor}
                  disableColumnFilter
                  rowsPerPageOptions={[5, 10, 20,40,60,80,100]}
                  rows={BankTransactions && BankTransactions.data && BankTransactions.data.length > 0 ? BankTransactions.data.filter(data=>{let returnvalue = true;if (categorization){ returnvalue = !data.categorized;};  return returnvalue; }):[]}
                  columns={pickerType==='mobile'? transactionColumnsMobile : transactionColumnsDesktop}
                  categorization={categorization}               
                  components={{  
                    NoRowsOverlay: () => (
                        <Stack className = {css.noRowsMessage}>
                          No Transactions for this period.
                        </Stack>
                    ),
                    NoResultsOverlay: () => (
                        <Stack className = {css.noRowsMessage}>
                          No transactions for this period.
                        </Stack>
                      )
                  }}
                  ref = {gridElement}
                  onSelectionModelChange={BankTransactionSelected}
                  getRowId={(row) => row.id}
                  headerHeight={60}    
                  onPageChange={handlePageChange}
                  onPageSizeChange={(pageSize) => {
                    // Maybe save into state
                    setGridSize(pageSize);
                 }}
                 sx={{
                    '& .MuiDataGrid-columnHeaderTitle': {
                        textOverflow: "clip",
                        whiteSpace: "break-spaces",
                        lineHeight: 1
                    }
                }}
               />
               :
               <DataGridPro
                  hideFooterRowCount
                  hideFooterSelectedRowCount
                  // hideFooterPagination
                  disableColumnFilter
                  rowsPerPageOptions={[5, 10, 20,40,60,80,100]}
                  rows={BankTransactions && BankTransactions.data && BankTransactions.data.length > 0 ? BankTransactions.data.filter(data=>{let returnvalue = true;if (categorization){ returnvalue = !data.categorized;}; return returnvalue; }):[]}
                  columns={pickerType==='mobile'? transactionColumnsMobile : transactionColumnsDesktop}
                  categorization={categorization}
                  components={{
                    NoRowsOverlay: () => (
                      <Stack className = {css.noRowsMessage}>
                        No Transactions for this period.
                      </Stack>
                    ),
                    NoResultsOverlay: () => (
                      <Stack className = {css.noRowsMessage}>
                        No transactions for this period.
                      </Stack>
                    )                    
                  }}
                  pageSize={100}
                  headerHeight={100} 
                  onPageChange={handlePageChange}
                  ref = {gridElement}
                  onSelectionModelChange={BankTransactionSelected}
                  getRowId={(row) => row.id}     
                  onPageSizeChange={(pageSize) => {
                    // Maybe save into state
                    setGridSize(pageSize);
                 }}                                      
               />   
                }        
           </Box>

           {BottomSheetNumber?
            <SelectBottomSheet
              name="Bank List"
              addNewSheet
             // triggerComponent={<div style={{ display: 'none' }} />}
              open={BottomSheetNumber}
              onClose={() => setBottomSheetNumber(false)}
              maxHeight="45vh"
            >
]             <CommonDrawer
                 state="BANKLIST"
                 handleClick={getData}
                 setBottomSheetNumber={setBottomSheetNumber}
              />
             </SelectBottomSheet>:
           ''}
         </div> 
     );
};
export default BankCategoryDetails;