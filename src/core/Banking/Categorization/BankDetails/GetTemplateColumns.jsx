import React from 'react';
import Stack from "@mui/material/Stack";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from "@mui/material/Tooltip";
import {showPlaceholder} from  './NumberConvertor';
import {checkNullandAssign,customHeaderOpeningBalanceValue,getAmount,getTooltipAmount,debitNone,creditNone} from './CustomFunctions' ;

import '../MuiAddonStyles.css';
import * as css from '../BankingCategorizationDetails.scss';

const showtooltip = false;

export const TemplateColumnsDesktop = (loadAdditionalPrevmonthDate,rawopeningBalance,openingBalance) =>{
  const customHeaderOpeningBalanceText = (defs,title) =>{
        const html = <div><div className = {css.baseNameOther}>{defs.colDef.headerName}</div><div className={css.customNameText}>{title}<button type="button" className={[css.AdditionalDataButton,css.addnewrows,css.buttonopening].join(' ')} onClick={(e) => loadAdditionalPrevmonthDate(e)}>Preceding Month</button></div></div>;
        return html;
   };      
  const transactionColumnsDesktop = [
    {field:"date",headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:.5,headerName:"Date", renderFooter : () =>{return "<div>dddd</div>";},valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:"date",type:'D',absolute:false,altname:""}});},renderCell: (data) =>  (showtooltip?<Tooltip title={data.row.date} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:"date",type:'D',absolute:false,altname:""}})}</span></Tooltip>:checkNullandAssign(data.row,{data1:{field:"date",type:'D',absolute:false,altname:""}}))},
    {field:'txn_id',headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:1,headerName:"Document No.", valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:"voucher_reference",type:'C',absolute:false,altname:"Uncategorized"}}).trim(); },renderCell: (data) =>  (showtooltip?<Tooltip title={checkNullandAssign(data.row,{data1:{field:"voucher_reference",type:'C',absolute:false,altname:"Uncategorized"}}).trim()} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:"voucher_reference",type:'C',absolute:false,altname:"Uncategorized"}}).trim()}</span></Tooltip>:checkNullandAssign(data.row,{data1:{field:"voucher_reference",type:'C',absolute:false,altname:"Uncategorized"}}).trim())},
    {field:"party_name",headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:1,headerName:"Party",renderHeader: (params) => {return customHeaderOpeningBalanceText(params,'OPENING BALANCE');} ,valueGetter: (data) => {return  checkNullandAssign(data.row,{data1:{field:"party_initial",type:'C',absolute:false,altname:""},data2:{field:"party_name",type:'C'}}); },renderCell: (data) =>  (showtooltip?<Tooltip title={checkNullandAssign(data.row,{data1:{field:"party_initial",type:'C',absolute:false,altname:""},data2:{field:"party_name",type:'C',altname:""}})} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:"party_initial",type:'C',altname:""},data2:{field:"party_name",type:'C',absolute:false,altname:""}})}</span></Tooltip>:checkNullandAssign(data.row,{data1:{field:"party_initial",type:'C',absolute:false,altname:""},data2:{field:"party_name",type:'C'}}))},
    {field:'purpose',headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:1,headerName:"Purpose", valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:"purpose",type:'C',absolute:false,altname:""}}).trim(); },renderCell: (data) =>  (showtooltip?<Tooltip title={checkNullandAssign(data.row,{data1:{field:"purpose",type:'C',absolute:false,altname:""}}).trim()} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:"purpose",type:'C',absolute:false,altname:""}}).trim()}</span></Tooltip>:checkNullandAssign(data.row,{data1:{field:"purpose",type:'C',absolute:false,altname:""}}).trim())},
    {field:"narration",headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:2,headerName:"Description",valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:"narration",type:'C',absolute:false,altname:""}}); },renderCell: (data) =>  (showtooltip?<Tooltip title={checkNullandAssign(data.row,{data1:{field:"narration",type:'C',absolute:false,altname:""}})} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:"narration",type:'C',absolute:false,altname:""}})}</span></Tooltip>:checkNullandAssign(data.row,{data1:{field:"narration",type:'C',absolute:false,altname:""}}))},
    {field:"amount2",headerClassName:"headerStyle",sortable: false,align:'right',headerAlign: 'right',flex:.8,headerName:"Inflow",renderHeader: (params) => {return rawopeningBalance  >= 0 ? customHeaderOpeningBalanceValue(params,rawopeningBalance,openingBalance): debitNone();},valueGetter: (data) => {return getAmount(1,data); },renderCell: (data) =>  (showtooltip?<Tooltip title={getTooltipAmount(1,data)}><span className={css.table_cell_trucate}>{getTooltipAmount(1,data)}</span></Tooltip>:getTooltipAmount(1,data) )},
    {field:"amount1",headerClassName:"headerStyle",sortable: false,align:'right',headerAlign: 'right',flex:.8,headerName:"Outflow",renderHeader: (params) => {return rawopeningBalance < 0 ? customHeaderOpeningBalanceValue(params,rawopeningBalance,openingBalance) : creditNone();},valueGetter: (data) => {return getAmount(-1,data);  },renderCell: (data) =>  (showtooltip?<Tooltip title={getTooltipAmount(-1,data)} ><span className={css.table_cell_trucate}>{getTooltipAmount(-1,data)}</span></Tooltip>:getTooltipAmount(-1,data)   )},
  ]; 
  return transactionColumnsDesktop ;
};

export const TemplateColumnsMobile = (loadAdditionalPrevmonthDate,rawopeningBalance) =>{
    const customHeaderOpeningBalanceMobile = (defs,title,rawopeningbalance) =>{
        const html = <div className={css.baseNameMobileHolder}><div className={css.baseNameMobile}>{defs.colDef.headerName}</div><div id = "customTextHolder"><div className={css.customNameMobileText}>{title}</div><button className={[css.AdditionalDataButton,css.addnewrows,css.buttonopening].join(' ')} type = "button" onClick={(e) => loadAdditionalPrevmonthDate(e)}>Preceding Month</button><div className={rawopeningbalance > 0 ? css.customNameMobileValue : css.customNameMobileValueZero }>{showPlaceholder(rawopeningbalance)}</div></div></div>;
        return html;
    };        
    const header = <Box style={{width:"100%",position:"absolute"}}><Grid  container style = {{height:"60px",marginTop:"-26px",width:"100%"}}>  
     <Grid item xs={12} className = {css.mobileGridRow}>
       <Box id = "cardTitleLeft" style={{color:"#283049"}}>
           <div style = {{marginLeft: "71%"}}>Transaction Details</div>
       </Box>  
     </Grid>
    </Grid>
   <Box><hr id = "transactionline" style = {{marginLeft:"-10px",marginTop:"-25px",width:"100%"}}/></Box></Box>;

   const transactionColumnsMobile = [
    {field:"Details",sortable: false,align:'left',headerAlign: 'center',flex:1,headerName:header,colSpan: 6,renderHeader: (params) => {return customHeaderOpeningBalanceMobile(params,'OPENING BALANCE',rawopeningBalance);},
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
  return transactionColumnsMobile;
};
