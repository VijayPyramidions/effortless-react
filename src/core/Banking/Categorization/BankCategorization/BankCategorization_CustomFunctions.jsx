import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CategorizationUploadCloudImage from '@assets/categorizationuploadcloudimage';
import CategorizationUploadIconImage from '@assets/categorizationuploadiconimage';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import * as css from '../categorization.scss';
import '../MuiAddonStyles.css';

export const domupdate = (categorizeData,mainElementCategorize,pickerType,checkboxChecked_desktop,checkboxChecked_mobile,checkboxDefault_desktop,checkboxDefault_mobile,handleModalOpen) =>{
        let domreplace = null;
        const counts = categorizeData?.data?.filter((dt)=>dt.checked).length;
        if (categorizeData?.data?.filter((dt)=>dt.checked).length > 0){
           domreplace = setInterval(()=>{
              if (mainElementCategorize &&  mainElementCategorize.current && mainElementCategorize.current.querySelector('[data-field="selection"]')){
                  clearInterval(domreplace);
                  if (pickerType === "desktop"){
                      mainElementCategorize.current.querySelectorAll('[data-field="selection"]')[0].innerHTML = checkboxChecked_desktop;
                  }else{
                      mainElementCategorize.current.querySelectorAll('[data-field="selection"]')[0].innerHTML = checkboxChecked_mobile;                  
                  }    
                  if (counts < 2){
                      if (pickerType === "desktop"){
                          mainElementCategorize.current.querySelectorAll('[data-field="selection"]')[0].innerHTML = checkboxDefault_desktop;
                      }else{
                          mainElementCategorize.current.querySelectorAll('[data-field="selection"]')[0].innerHTML = checkboxDefault_mobile;
                      }   
                      mainElementCategorize.current.querySelector("#selectionclickable").addEventListener('click', handleModalOpen);                    
                      // mainElementCategorize.current.querySelectorAll('[data-field="selection"]')[0].querySelector("#selectionclickable").style.visibility = "hidden";
                  }                  
                  if (counts > 1){
                      mainElementCategorize.current.querySelector("#selectionclickable").addEventListener('click', handleModalOpen);
                  }    
              };
           },10); 
        }else{
          domreplace = setInterval(()=>{
              if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector('[data-field="selection"]')){
                  clearInterval(domreplace);
                  if (pickerType === "desktop"){
                      mainElementCategorize.current.querySelectorAll('[data-field="selection"]')[0].innerHTML = checkboxDefault_desktop;
                  }else{
                      mainElementCategorize.current.querySelectorAll('[data-field="selection"]')[0].innerHTML = checkboxDefault_mobile;
                  }   
                  mainElementCategorize.current.querySelector("#selectionclickable").addEventListener('click', handleModalOpen);
              };
          },10); 
        }
};     


export const NarrationGet = (selectedPurposeName,pickerType,currentposition,getlocation) =>{
    //  currentposition = localStorage.getItem("pagestart");
    const nadata = getlocation().state.alldata.data[`${typeof currentposition==='undefined'?getlocation().state.row:currentposition}`];
    let narra = "";
    if (pickerType === "desktop"){
        if (selectedPurposeName.toUpperCase() !== "EXPENSE"){              
            narra = nadata.narration.replace(/(\r\n|\n|\r)/gm, " ").trim().substr(0,60); 
            if (nadata.narration.length > 60){
                narra += "...";
            }  
        }else{
            narra = nadata.narration.replace(/(\r\n|\n|\r)/gm, " ").substr(0,300);  
            if (nadata.narration.length > 300){
                narra += "...";
            }        
        }    
    }
    if (pickerType === "mobile"){
        narra = nadata.narration.substr(0,80);
        if (nadata.narration.length > 80){
            narra += "...";
        }
    }
    return narra;
 };

export const uploadfields = (dragActive,handleDrag,fileuploadinputRef,handleFileUploadChange,handleFileUploadClick,handleDrop,UploadText,fileuploaded,handleCloseFileUploaded) => {
 return (<Box style = {{height:"95%",width:"96%",padding:"2%"}}><div className = {dragActive?css.fileuploadHighlight:css.fileuploadNormal}> 
 <div onDragEnter={handleDrag}  onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} style = {{height:"100%",width:"100%",display:"flex"}}>
 <Grid xs={4}>
    {}
 </Grid>
 <Grid xs={4} style = {{display:"flex",alignItems: "center",justifyContent:"center"}}>
   <Grid container>
    <Grid item xs={12} style = {{alignItems: "center",justifyContent:"center",textAlign:"center"}}>
      <CategorizationUploadCloudImage/>
    </Grid>
    <Grid item xs = {12} style = {{display:"flex",marginTop:"15px",alignItems: "center",justifyContent:"center",fontFamily: 'Lexend',fontStyle: "normal",fontWeight: "400",fontSize: ".9vw",lineHeight: "18px",color:"#283049"}}>
         {UploadText}
    </Grid>
    <Grid item xs = {12} style = {{display:"flex",marginTop:"15px",alignItems: "center",justifyContent:"center",fontFamily: 'Lexend',fontStyle: "normal",fontWeight: "400",fontSize: ".9vw",lineHeight: "18px",color:"#283049"}}>
        <input
          style={{display: 'none'}}
          ref={fileuploadinputRef}
          type="file"
          onChange={handleFileUploadChange}
          accept="application/pdf"
        />        
        <Button onClick={handleFileUploadClick} className={css.uploadbutton}><CategorizationUploadIconImage/><label htmlFor="details">Browse</label></Button>
    </Grid>
   </Grid>  
 </Grid>
 <Grid xs={4}>
    {} 
 </Grid> 
</div>  
</div>
<Grid container> 
   <Grid item xs = {11}>
      <Box style = {{marginTop:"15px"}} className={css.fileuploaded}>{`${fileuploaded.name ? fileuploaded.name : ''}`}</Box>
   </Grid> 
   <Grid item xs = {1}>
      {fileuploaded && fileuploaded.name ?
        <IconButton aria-label="close" onClick={handleCloseFileUploaded}>
          <CloseIcon />
        </IconButton>
      : '' }
   </Grid>   
</Grid>   
</Box>);
};

export const uploadfields_mobile = (dragActive,handleDrag,fileuploadinputRef,handleFileUploadChange,handleFileUploadClick,handleDrop,UploadText) =>{
 return (<Box style = {{marginTop:"20px",maxHeight:"40%",width:"80%",padding:"4%"}}><div className = {dragActive?css.fileuploadHighlight:css.fileuploadNormal}> 
<div onDragEnter={handleDrag}  onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} style = {{height:"100%",width:"100%",display:"flex"}}>
<Grid xs={12} style = {{display:"flex",alignItems: "center",justifyContent:"center"}}>
<Grid container>
 <Grid item xs={12} className={css.cloudimage}>
   <CategorizationUploadCloudImage/>
 </Grid>
 <Grid item xs = {12} className = {css.uploadtext}>
      {UploadText}
 </Grid>
 <Grid item xs = {12}  className = {css.uploads}>
     <input
       style={{display: 'none'}}
       ref={fileuploadinputRef}
       type="file"
       onChange={handleFileUploadChange}
       accept="application/pdf"
     />        
     <Button onClick={handleFileUploadClick} className={css.uploadbutton}><CategorizationUploadIconImage/><label htmlFor="details">Browse</label></Button>
 </Grid>
</Grid>  
</Grid>
</div>  
</div></Box>);
};

export const DomReplacement = (mainElementCategorize) =>{
   let domreplacement = 0;
   domreplacement = 0;
   domreplacement = setInterval(()=>{
       if (!mainElementCategorize || !mainElementCategorize.current){
           clearInterval(domreplacement);
           return;
       }
       if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector('[data-field="notes"]')){
           if (document.querySelectorAll(".categorization_textareaholder") && document.querySelectorAll(".categorization_textareaholder").length > 0){
               clearInterval(domreplacement);
               document.querySelectorAll(".categorization_textareaholder").forEach((element)=>{
                 element.style.width = `${mainElementCategorize.current.querySelector('[data-field="notes"]').offsetWidth}px`;
                 element.querySelector("textarea").setAttribute("id","notes_textarea");
               });
               document.querySelectorAll(".categorization_textarea").forEach((element)=>{
                 element.style.width = `${mainElementCategorize.current.querySelector('[data-field="notes"]').offsetWidth}px`;
              });                             
           };
       };     
    },10); 
};

export const IncomeCategorySelectt = (id,updateSelectedIncomeCategory,SelectedIncomeCategory,updateselectedIncomeCategoryName,getlocation) =>{
    if (id){  
        updateSelectedIncomeCategory(!SelectedIncomeCategory);
        const setname = {id:"",name:""};
        getlocation().state.masterslist.incomecategories.data.forEach((incomecategory)=>{
            if (incomecategory.id === id){
                setname.id = incomecategory.id;
                setname.name = incomecategory.name;
            }
        });
        updateselectedIncomeCategoryName(setname);
    }; 
 };

export const TowardsTag = (updateUpdateTemplate,mainElementCategorize,selectedPurposeName,pickerType) =>{
    if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#towardsname")){
       if (pickerType === "mobile"){
           mainElementCategorize.current.querySelector("#towardsname").innerHTML = selectedPurposeName.length > 15?`${selectedPurposeName.substr(0,15)}...`:selectedPurposeName;
       }else{
           mainElementCategorize.current.querySelector("#towardsname").innerHTML = selectedPurposeName.length > 30?`${selectedPurposeName.substr(0,30)}...`:selectedPurposeName;
       }        
   }
   updateUpdateTemplate(Math.random());
};

export const FileUploadProcess = (event,updateopModal,updateanothercategorization,updatealertdisplaymessage,updatealertwarning,updatebuttontext1,updatebuttontext2,updateclosebutton,updateAlertOpen,showuploadmessage,updatefileuploaded,updateUpdateTemplate,updatetemplate) =>{
   const fileObj = event.target.files && event.target.files[0];
   if (!fileObj) {
       return;   
   }
    if (fileObj.type !== "application/pdf"){
        updateopModal(true);
        updateanothercategorization(false);   
        updatealertdisplaymessage("Only PDF file format is supported.");
        updatealertwarning("Warning !!!"); 
        updatebuttontext1("");
        updatebuttontext2("Ok");
        updateclosebutton(true);
        updateAlertOpen(true);
        return;
    }
    if (showuploadmessage){
        updateopModal(true);
        updateanothercategorization(false);   
        updatealertdisplaymessage("Thanks for sharing these details with us. \r\n \r\n \r\n Our SuperAccountant will be in touch with you shortly to ensure that your Salary Transaction has been accurately categorized.");
        updatealertwarning("Heads Up !"); 
        updatebuttontext1("");
        updatebuttontext2("Continue");
        updateclosebutton(true);
        updateAlertOpen(true);    
    }   
    updatefileuploaded(fileObj);
    updateUpdateTemplate(!updatetemplate);   
};

