
export const AdjustDataGrid = (mainElementCategorize,pickerType,mobilereduce) =>{
   if (mainElementCategorize &&  mainElementCategorize.current){
       const topelement = mainElementCategorize.current.firstChild;
       if (mainElementCategorize.current.querySelector("#datagridbox")){
           if (pickerType === "desktop"){ 
               const netheight =  mainElementCategorize.current.parentNode.parentNode.offsetHeight - topelement.offsetHeight - mobilereduce - 40;     
               if (mainElementCategorize.current.querySelector("#datagridbox")){
                   mainElementCategorize.current.querySelector("#datagridbox").style.height = `${netheight}px`;                 
                   const epos = mainElementCategorize.current.querySelector("#datagridbox").offsetWidth-10;
                   mainElementCategorize.current.querySelector(".categorization_CategorizationNextBox").style.left = `${epos}px`;
               }  
           }else{ 
               if (mainElementCategorize.current.querySelector("#datagridbox")){
                   mainElementCategorize.current.querySelector("#datagridbox").style.height = `70%`; 
                   mainElementCategorize.current.querySelector("#datagridbox").style.position = "relative";
                   mainElementCategorize.current.querySelector("#datagridbox").style.float = "left";
               }    
           }  
      };       
   };
};    