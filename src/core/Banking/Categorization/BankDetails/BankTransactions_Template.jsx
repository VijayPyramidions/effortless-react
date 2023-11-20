import React from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker,DesktopDatePicker } from '@mui/x-date-pickers-pro';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from "@mui/material/Stack";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DataGridPro  } from '@mui/x-data-grid-pro';
import { LicenseInfo } from '@mui/x-license-pro';
import {dateInput} from  './NumberConvertor';
import * as css from '../BankingCategorizationDetails.scss';
import '../MuiAddonStyles.css';


LicenseInfo.setLicenseKey(
    'e8185c84beb4956b5b6eb26765b7b0a1Tz01NDk0NixFPTE3MDA5MDAyNzQwNDQsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=',
  );
 

export const BankTransactionsTemplate = (props) =>{
    const {
        pickerType,
        displayBankpopup,
        SelectedBankID,
        BankList,
        updateFromDate,
        updateToDate,
        fromDate,
        toDate,
        getUnCategorized,
        reProcessData,
        Banktransactions,
        categorization,
        BankTransactionSelected,
        updateGridSize,
        transactionColumnsMobile,
        transactionColumnsDesktop,
        updatearrowClicked,
        updatearrowDown,
        updatearrowUp,
        arrowClicked,
        arrowDown,
        arrowUp,
        gridElement,
        handlePageChange,
        updateBankName,
        updateBankAccount,
        getBankName
   } = props;

  return (
    <div>
        {pickerType === "desktop" ?
           <Grid container spacing={1}>    
              <Grid item xs={12} sm={4} id = "bankCategorizationgrid">   
                   <Box component="div"  className={css.bankCategorizationBankboxHolder} onClick={() => displayBankpopup() }>
                       <div className = {css.banktitlename}>Bank Name</div>
                       <div className = {css.bankdetailsholder}>
                          <div className = {css.bankname}>{getBankName(SelectedBankID,BankList,updateBankName,updateBankAccount)}</div> 
                          <div className = {css.expandbank}><KeyboardArrowRightIcon /></div> 
                       </div>   
                   </Box>
               </Grid> 
               <Grid item xs={6} sm={2} id = "bankCategorizationgrid">
                 <Box component="div" id = "fromdate"  className={css.bankCategorizationDateboxHolder}>
                    <div className = {css.fromdatename}>Start Date</div>               
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div style = {{display:pickerType==='mobile'?'block':'none'}}>
                         <MobileDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}} label="" value={fromDate} onChange={(newValue) => {updateFromDate(newValue.$d);}} renderInput={(params) => <TextField  onKeyDown={dateInput} variant="standard" {...params} />} />
                      </div>
                      <div style = {{display:pickerType==='desktop'?'block':'none'}}>
                          <MobileDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}} label="" value={fromDate} onChange={(newValue) => {updateFromDate(newValue.$d);}} renderInput={(params) => <TextField  onKeyDown={dateInput} variant="standard" {...params} />} />
                      </div>                      
                    </LocalizationProvider>
                 </Box>  
               </Grid>
               <Grid item xs={6} sm={2} id = "bankCategorizationgrid">
                  <Box component="div" id = "todate" className={css.bankCategorizationDateboxHolder}>
                    <div className = {css.todatename}>End Date</div>               
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div style = {{display:pickerType==='mobile'?'block':'none'}}>
                         <MobileDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}}  label="" value={toDate} onChange={(newValue) => {updateToDate(newValue.$d);}} renderInput={(params) => <TextField onKeyDown={dateInput} variant="standard" {...params} />} />
                      </div>
                      <div style = {{display:pickerType==='desktop'?'block':'none'}}>
                         <MobileDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}}  label="" value={toDate} onChange={(newValue) => {updateToDate(newValue.$d);}} renderInput={(params) => <TextField onKeyDown={dateInput} variant="standard" {...params} />} />
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
                            <div className = {css.bankname}>{getBankName(SelectedBankID,BankList,updateBankName,updateBankAccount)}</div> 
                            <div className = {css.expandbank}><KeyboardArrowDown/></div> 
                         </div>   
                     </Box>
                 </Grid> 
                 <Grid item xs={6} sm={2} rel = "dates" id = "bankCategorizationgrid">
                   <Box component="div" id = "fromdate" className={css.bankCategorizationDateboxHolder}>
                     <div className = {css.fromdatename}>From Date</div>               
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className = {css.fromdate} style = {{display:pickerType==='mobile'?'block':'none'}}>
                           <MobileDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}} label="" value={fromDate} onChange={(newValue) => {updateFromDate(newValue.$d);}} renderInput={(params) => <TextField onKeyDown={dateInput} variant="standard" {...params} />} />
                           <div rel="adjustdateposition" className = {css.expandbank}><KeyboardArrowDown/></div> 
                        </div>
                        <div className = {css.todate} style = {{display:pickerType==='desktop'?'block':'none'}}>
                           <DesktopDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}}  label="" value={fromDate} onChange={(newValue) => {updateFromDate(newValue.$d);}} renderInput={(params) => <TextField onKeyDown={dateInput} variant="standard" {...params} />} />
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
                           <MobileDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}} label="" value={toDate} onChange={(newValue) => {updateToDate(newValue.$d);}} renderInput={(params) => <TextField onKeyDown={dateInput} variant="standard" {...params} />} />
                           <div rel="adjustdateposition" className = {css.expandbank}><KeyboardArrowDown/></div> 
                        </div>
                        <div className = {css.todate} style = {{display:pickerType==='desktop'?'block':'none'}}>
                           <DesktopDatePicker inputFormat="DD MMM YYYY" InputProps={{disableUnderline: true}}  label="" value={toDate} onChange={(newValue) => {updateToDate(newValue.$d);}} renderInput={(params) => <TextField onKeyDown={dateInput} variant="standard" {...params} />} />
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
                 {arrowDown?<KeyboardArrowDown onClick = {()=>{updatearrowClicked(false);updatearrowDown(false);updatearrowUp(true);}}   className={css.drawerkeys}/>:''}
                 {arrowUp?<KeyboardArrowUp onClick = {()=>{updatearrowClicked(true);updatearrowDown(true);updatearrowUp(false);}}  className={css.drawerkeys}/>:''} 
              </Box> 
             </Box> 
            }
            <Box id = "datagridbox" sx={{width: '100%'}}>
              {pickerType==="desktop" ?
                <DataGridPro
                  disableColumnMenu
                  getRowClassName={(params) => params.row.categorized?css.categorizedColor:css.uncategorizedColor}
                  disableColumnFilter
                  rowsPerPageOptions={[5, 10, 20,40,60,80,100]}
                  rows={Banktransactions && Banktransactions.data && Banktransactions.data.length > 0 ? Banktransactions.data.filter(data=>{let returnvalue = true;if (categorization){ returnvalue = !data.categorized;};  return returnvalue; }):[]}
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
                    updateGridSize(pageSize);
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
                  rows={Banktransactions && Banktransactions.data && Banktransactions.data.length > 0 ? Banktransactions.data.filter(data=>{let returnvalue = true;if (categorization){ returnvalue = !data.categorized;}; return returnvalue; }):[]}
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
                    updateGridSize(pageSize);
                 }}                                      
               />   
                }        
           </Box>
    </div>
  );
};