import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DataGridPro} from '@mui/x-data-grid-pro';
import UploadYourBillContainer from '@core/BillBookView/UploadYourBillContainer';
import * as css from '../categorization.scss';
import '../MuiAddonStyles.css';

export const Templates = (noTransactionElement,handlePageChange,TransactionSelected,gridElement,rowHeight,categorizeData,templatecolumns,Narration,setNarration,CustomPagination,processRowUpdate,GridHeight,catbuttonheight,gridSize,updateGridSize,uploadfield,uploadfield_mobile,handleScroll,expensetemplate,movefromExpense,billloadheading,paidTo,updateTriggerClickItem,mainElementCategorize,geteditableTDSvalues,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,editclicked,getlocation,ExpenseDone) =>{
 const templates = {
    multiLine: {
      desktoppagination :<DataGridPro
          disableColumnMenu
          disableColumnResize
          pagination
          autoPageSize
          disableColumnFilter
          rowsPerPageOptions={[5, 10, 20,40,60,80,100]}
          experimentalFeatures={{ newEditingApi: true }}                  
          rows={categorizeData && categorizeData.data && categorizeData.data.length > 0 ? categorizeData.data.filter((data)=>{return data.id !== "" && !data.hide;}):[]}
          columns={templatecolumns.transactionColumnsDesktop}  
          processRowUpdate={processRowUpdate}   
          onProcessRowUpdateError={(error) => {console.log(error);}} 
          components={{
            Pagination: CustomPagination,    
            NoRowsOverlay: () => (
               <div>
                {noTransactionElement}
               </div>  
            ),
            NoResultsOverlay: () => (
              <div>
                {noTransactionElement}
              </div>  
            )
          }}           
          rowHeight={rowHeight}
          ref = {gridElement}
          getRowId={(row) => row.id}
          headerHeight={50}
          onPageChange={handlePageChange}   
          onSelectionModelChange={TransactionSelected}
          gsize={gridSize}
          getCellClassName={(params) =>{
            if (params.field === "taxamount" || params.field === "adjusted"){
                return "editable";
            }
            return "";
          }}
          pageSize = {5}
          onPageSizeChange={(pageSize) => {
             updateGridSize(pageSize);
          }}
          getRowHeight={() => 'auto'}
          sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                  textOverflow: "clip",
                  whiteSpace: "break-spaces",
                  lineHeight: 1
              }
          }}/>,
     desktopnopagination : <DataGridPro
        disableColumnMenu
        disableColumnResize
        disableColumnFilter
        rowsPerPageOptions={[5, 10, 20,40,60,80,100]}
        experimentalFeatures={{ newEditingApi: true }}   
        rows={categorizeData && categorizeData.data && categorizeData.data.length > 0 ? categorizeData.data.filter((data)=>{return data.id !== "" && !data.hide;}):[]}
        columns={templatecolumns.transactionColumnsDesktop}  
        processRowUpdate={processRowUpdate}   
        onProcessRowUpdateError={(error) => {console.log(error);}} 
        onScroll={()=>{
          handleScroll(mainElementCategorize,geteditableTDSvalues,categorizeData,pickerType,getitemdrawerClickStatus,updateitemdrawerClickStatus,TriggerClickItem,updateTriggerClickItem);
        }}
        components={{    
          NoRowsOverlay: () => (
             <div>
              {noTransactionElement}
             </div>  
          ),
          NoResultsOverlay: () => (
            <div>
              {noTransactionElement}
            </div>  
          )
        }}
        rowHeight={rowHeight}
        ref = {gridElement}
        getRowId={(row) => row.id}
        headerHeight={50}    
        onPageChange={handlePageChange}   
        onSelectionModelChange={TransactionSelected}
        gsize={gridSize}
        getCellClassName={(params) =>{
          if (params.field === "taxamount" || params.field === "adjusted"){
              return "editable";
          }
          return "";
        }}
        onPageSizeChange={(pageSize) => {
           updateGridSize(pageSize);
        }}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
              textOverflow: "clip",
              whiteSpace: "break-spaces",
              lineHeight: 1
          }
        }}            
      />,
      mobile: <DataGridPro
          disableColumnFilter
          disableColumnResize
          rowsPerPageOptions={[5, 10, 20,40,60,80,100]}
          rows={categorizeData && categorizeData.data && categorizeData.data.length > 0 ? categorizeData.data.filter((data)=>{return data.id !== "" && !data.hide;}):[]}
          columns={templatecolumns.transactionColumnsMobile}               
          components={{
            NoRowsOverlay: () => (
              <div> 
                 {noTransactionElement}
              </div>   
            ),
            NoResultsOverlay: () => (
              <div>
                 {noTransactionElement}
              </div>   
            )             
          }}
          headerHeight={40} 
          onPageChange={handlePageChange}
          onSelectionModelChange={TransactionSelected}
          ref = {gridElement}
          getRowId={(row) => row.id}     
          onPageSizeChange={(pageSize) => {
             updateGridSize(pageSize);
          }}            
        />  
   },
   longText:{
       desktoppagination:<Box id = "cardDataright" style={{paddingLeft:"8px",width:"100%",height:"98%",color:"#283049"}}><div id = "desktoptextEntryHolder"><TextField disabled={localStorage.getItem("itemstatus") === "Edit" && !editclicked} defaultValue={Narration}  variant="standard" placeholder="Note (Optional)" onChange = {(eve)=>setNarration(eve.target.value)} multiline className={css.textEntry}   InputProps={{disableUnderline: true}}/></div></Box>,
       desktopnopagination:<Box id = "cardDataright" style={{paddingLeft:"8px",width:"100%",height:"98%",color:"#283049"}}><div id = "desktoptextEntryHolder"><TextField disabled={localStorage.getItem("itemstatus") === "Edit" && !editclicked} defaultValue={Narration}  variant="standard" placeholder="Note (Optional)" onChange = {(eve)=>setNarration(eve.target.value)} multiline className={css.textEntry}   InputProps={{disableUnderline: true}}/></div></Box>,
       mobile:<Box id = "cardDataright" className={css.mobileTextEntryHolder1}><div id="desktoptextEntryHolder"><TextField disabled={localStorage.getItem("itemstatus") === "Edit" && !editclicked} variant="standard"  defaultValue={Narration} placeholder="Note (Optional)" onChange = {(eve)=>setNarration(eve.target.value)} multiline className={css.textEntry}   InputProps={{disableUnderline: true}}/></div></Box>
   },
   documentupload:{
       desktoppagination:uploadfield , 
       desktopnopagination:uploadfield,
       mobile:uploadfield_mobile
   },
   multilineandlongtext:{
       desktoppagination:<Grid   container style = {{"height":"100%",marginTop:"-5px"}}>                               
         <Grid style = {{"height":"100%"}} item xs={6} className = {css.mobileGridRow} >
            <Box style = {{"height":"40%",width:"95%",marginLeft:"20px"}}>
               <DataGridPro
                 disableColumnMenu
                 disableColumnResize
                 pagination
                 autoPageSize
                 disableColumnFilter
                 rowsPerPageOptions={[5, 10, 20,40,60,80,100]}
                 experimentalFeatures={{ newEditingApi: true }}                  
                 rows={categorizeData && categorizeData.data && categorizeData.data.length > 0 ? categorizeData.data.filter((data)=>{return data.id !== "" && !data.hide;}):[]}
                 columns={templatecolumns.transactionColumnsDesktop}  
                 processRowUpdate={processRowUpdate}   
                 onProcessRowUpdateError={(error) => {console.log(error);}} 
                 components={{
                   Pagination: CustomPagination,    
                   NoRowsOverlay: () => (
                     <div>
                      {noTransactionElement}
                    </div>  
                 ),
                 NoResultsOverlay: () => (
                    <div>
                      {noTransactionElement}
                    </div>  
                 )
               }}
               rowHeight={rowHeight}
               ref = {gridElement}
               getRowId={(row) => row.id}
               headerHeight={50}
               onPageChange={handlePageChange}   
               onSelectionModelChange={TransactionSelected}
               gsize={gridSize}
               getCellClassName={(params) =>{
                  if (params.field === "taxamount" || params.field === "adjusted"){
                      return "editable";
                 }
                   return "";
               }}
               pageSize = {5}
               onPageSizeChange={(pageSize) => {
                  updateGridSize(pageSize);
               }}
               sx={{
                   '& .MuiDataGrid-columnHeaderTitle': {
                       textOverflow: "clip",
                       whiteSpace: "break-spaces",
                       lineHeight: 1
                   }
               }}/>     
            </Box>   
         </Grid>
         <Grid  style = {{"height":"100%"}} item xs={6} className = {css.mobileGridRow}>
            <Box id = "cardDataright" style={{height:"100%",paddingRight:"2px",color:"#283049"}}>
                <div className={css.desktopTextEntryHolder}><TextField disabled={localStorage.getItem("itemstatus") === "Edit" && !editclicked} defaultValue={Narration}  variant="standard" placeholder="Note (Optional)" onChange = {(eve)=>setNarration(eve.target.value)} multiline className={css.textEntry}   InputProps={{disableUnderline: true}}/></div>
            </Box>   
         </Grid>
      </Grid>,
     desktopnopagination:<Grid   container style = {{"height":"100%",marginTop:"-5px"}}>                               
       <Grid style = {{"height":"100%"}} item xs={6} className = {css.mobileGridRow} >
          <Box style = {{"height":"40%",width:"95%",marginLeft:"20px"}}>
             <DataGridPro
               disableColumnMenu
               disableColumnResize
               disableColumnFilter
               rowsPerPageOptions={[5, 10, 20,40,60,80,100]}
               experimentalFeatures={{ newEditingApi: true }}   
               rows={categorizeData && categorizeData.data && categorizeData.data.length > 0 ? categorizeData.data.filter((data)=>{return data.id !== "" && !data.hide;}):[]}
               columns={templatecolumns.transactionColumnsDesktop}  
               processRowUpdate={processRowUpdate}   
               onProcessRowUpdateError={(error) => {console.log(error);}} 
               components={{    
                 NoRowsOverlay: () => (
                   <div>
                    {noTransactionElement}
                   </div>  
                 ),
                 NoResultsOverlay: () => (
                   <div>
                     {noTransactionElement}
                   </div>  
                 )
              }}
              rowHeight={rowHeight}
              ref = {gridElement}
              getRowId={(row) => row.id}
              headerHeight={50}    
              onPageChange={handlePageChange}   
              onSelectionModelChange={TransactionSelected}
              gsize={gridSize}
              getCellClassName={(params) =>{
                 if (params.field === "taxamount" || params.field === "adjusted"){
                     return "editable";
                 }
                 return "";
              }}
              onPageSizeChange={(pageSize) => {
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
          </Box>   
        </Grid>
        <Grid style = {{"height":"100%"}} item xs={6} className = {css.mobileGridRow}>
           <Box  id = "cardDataright" style={{"height":"100%",paddingRight:"2px",color:"#283049"}}>
               <Box id  = "desktoptextEntryHolder"><TextField disabled={localStorage.getItem("itemstatus") === "Edit" && !editclicked} defaultValue={Narration} variant="standard" placeholder="Notes (Optional)" onChange = {(eve)=>setNarration(eve.target.value)} multiline className={css.textEntry}   InputProps={{disableUnderline: true}}/></Box>
           </Box>   
        </Grid>
     </Grid>,
     mobile:<Grid  className={css.NotesHolder} container style = {{height:"100%",marginTop:"-5px"}}>                               
     <Grid item xs={12} style = {{height:"100%"}} className = {css.mobileGridRow} >
        <Box style = {{height:`${(GridHeight-catbuttonheight) * .70}px`}}>
           <DataGridPro
             disableColumnFilter
             disableColumnResize
             rowsPerPageOptions={[5, 10, 20,40,60,80,100]}
             rows={categorizeData && categorizeData.data && categorizeData.data.length > 0 ? categorizeData.data.filter((data)=>{return data.id !== "" && !data.hide;}):[]}
             columns={templatecolumns.transactionColumnsMobile}
             components={{
                NoRowsOverlay: () => (
                  <div> 
                     {noTransactionElement}
                  </div>   
                ),
                NoResultsOverlay: () => (
                  <div>
                     {noTransactionElement}
                  </div>   
               )             
             }}
             headerHeight={20} 
             onPageChange={handlePageChange}
             onSelectionModelChange={TransactionSelected}
             ref = {gridElement}
             getRowId={(row) => row.id}     
             onPageSizeChange={(pageSize) => {
               updateGridSize(pageSize);
             }}
           />                                 
        </Box>   
      </Grid>
     </Grid>
   },
   multilineandlongtextlong:{
       desktoppagination:<Grid   container style = {{"height":"100%",marginTop:"-5px"}}>                               
         <Grid style = {{"height":"100%"}} item xs={10} className = {css.mobileGridRow} >
            <Box style = {{"height":"100%",width:"95%",marginLeft:"20px"}}>
               <DataGridPro
                 disableColumnMenu
                 disableColumnResize
                 pagination
                 autoPageSize
                 disableColumnFilter
                 rowsPerPageOptions={[5, 10, 20,40,60,80,100]}
                 experimentalFeatures={{ newEditingApi: true }}                  
                 rows={categorizeData && categorizeData.data && categorizeData.data.length > 0 ? categorizeData.data.filter((data)=>{return data.id !== "" && !data.hide;}):[]}
                 columns={templatecolumns.transactionColumnsDesktop}  
                 processRowUpdate={processRowUpdate}   
                 onProcessRowUpdateError={(error) => {console.log(error);}} 
                 components={{
                   Pagination: CustomPagination,    
                   NoRowsOverlay: () => (
                     <div>
                      {noTransactionElement}
                    </div>  
                 ),
                 NoResultsOverlay: () => (
                    <div>
                      {noTransactionElement}
                    </div>  
                 )
               }}
               rowHeight={rowHeight}
               ref = {gridElement}
               getRowId={(row) => row.id}
               headerHeight={50}
               onPageChange={handlePageChange}   
               onSelectionModelChange={TransactionSelected}
               gsize={gridSize}
               getCellClassName={(params) =>{
                  if (params.field === "taxamount" || params.field === "adjusted"){
                      return "editable";
                 }
                   return "";
               }}
               pageSize = {5}
               onPageSizeChange={(pageSize) => {
                  updateGridSize(pageSize);
               }}
               sx={{
                   '& .MuiDataGrid-columnHeaderTitle': {
                       textOverflow: "clip",
                       whiteSpace: "break-spaces",
                       lineHeight: 1
                   }
               }}/>     
            </Box>   
         </Grid>
         <Grid  style = {{"height":"100%"}} item xs={2} className = {css.mobileGridRow}>
            <Box id = "cardDataright" style={{height:"100%",paddingRight:"2px",color:"#283049"}}>
                <div className={css.desktopTextEntryHolder}><TextField disabled={localStorage.getItem("itemstatus") === "Edit" && !editclicked} defaultValue={Narration}  variant="standard" placeholder="Note (Optional)" onChange = {(eve)=>setNarration(eve.target.value)} multiline className={css.textEntry}   InputProps={{disableUnderline: true}}/></div>
            </Box>   
         </Grid>
      </Grid>,
     desktopnopagination:<Grid   container style = {{"height":"100%",marginTop:"-5px"}}>                               
       <Grid style = {{"height":"100%"}} item xs={10} className = {css.mobileGridRow} >
          <Box style = {{"height":"100%",width:"95%",marginLeft:"20px"}}>
             <DataGridPro
               disableColumnMenu
               disableColumnResize
               disableColumnFilter
               rowsPerPageOptions={[5, 10, 20,40,60,80,100]}
               experimentalFeatures={{ newEditingApi: true }}   
               rows={categorizeData && categorizeData.data && categorizeData.data.length > 0 ? categorizeData.data.filter((data)=>{return data.id !== "" && !data.hide;}):[]}
               columns={templatecolumns.transactionColumnsDesktop}  
               processRowUpdate={processRowUpdate}   
               onProcessRowUpdateError={(error) => {console.log(error);}} 
               components={{    
                 NoRowsOverlay: () => (
                   <div>
                    {noTransactionElement}
                   </div>  
                 ),
                 NoResultsOverlay: () => (
                   <div>
                     {noTransactionElement}
                   </div>  
                 )
              }}
              rowHeight={rowHeight}
              ref = {gridElement}
              getRowId={(row) => row.id}
              headerHeight={50}    
              onPageChange={handlePageChange}   
              onSelectionModelChange={TransactionSelected}
              gsize={gridSize}
              getCellClassName={(params) =>{
                 if (params.field === "taxamount" || params.field === "adjusted"){
                     return "editable";
                 }
                 return "";
              }}
              onPageSizeChange={(pageSize) => {
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
          </Box>   
        </Grid>
        <Grid style = {{"height":"100%"}} item xs={2} className = {css.mobileGridRow}>
           <Box  id = "cardDataright" style={{"height":"100%",paddingRight:"2px",color:"#283049"}}>
               <Box id  = "desktoptextEntryHolder"><TextField disabled={localStorage.getItem("itemstatus") === "Edit" && !editclicked} defaultValue={Narration}  variant="standard" placeholder="Notes (Optional)" onChange = {(eve)=>setNarration(eve.target.value)} multiline className={css.textEntry}   InputProps={{disableUnderline: true}}/></Box>
           </Box>   
        </Grid>
     </Grid>,
     mobile:<DataGridPro
             disableColumnFilter
             disableColumnResize
             rowsPerPageOptions={[5, 10, 20,40,60,80,100]}
             rows={categorizeData && categorizeData.data && categorizeData.data.length > 0 ? categorizeData.data.filter((data)=>{return data.id !== "" && !data.hide;}):[]}
             columns={templatecolumns.transactionColumnsMobile}
             components={{
                NoRowsOverlay: () => (
                  <div> 
                     {noTransactionElement}
                  </div>   
                ),
                NoResultsOverlay: () => (
                  <div>
                     {noTransactionElement}
                  </div>   
               )             
             }}
             headerHeight={40} 
             onPageChange={handlePageChange}
             onSelectionModelChange={TransactionSelected}
             ref = {gridElement}
             getRowId={(row) => row.id}     
             onPageSizeChange={(pageSize) => {
               updateGridSize(pageSize);
             }}
           />                                 
   },       
   expenseForm:{
      desktoppagination:expensetemplate,
      desktopnopagination:expensetemplate,
      mobile:expensetemplate       
    },
   uploadbills: {
      desktoppagination:<UploadYourBillContainer status = {localStorage.getItem("itemstatus")} movetonext={movefromExpense} heading={billloadheading} categorizationvendordetails={paidTo} bankAccountDetails={getlocation().state} ExpenseDone={ExpenseDone} categ="categorization"/>,
      desktopnopagination:<UploadYourBillContainer status = {localStorage.getItem("itemstatus")} movetonext={movefromExpense} heading={billloadheading} categorizationvendordetails={paidTo} bankAccountDetails={getlocation().state} ExpenseDone={ExpenseDone} categ="categorization"/>,
      mobile:<UploadYourBillContainer status = {localStorage.getItem("itemstatus")} movetonext={movefromExpense} heading={billloadheading} categorizationvendordetails={paidTo} bankAccountDetails={getlocation().state} ExpenseDone={ExpenseDone} categ="categorization"/>
   },   
 };
 return templates;
};


