
export const LayoutSet = (mainElementCategorize,updateWinWidth,updateGridHeight,pickerType,domReplacement,mobilereduce,catbuttonheight) =>{
   if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.parentNode){
       mainElementCategorize.current.parentNode.style.float = "left";
       mainElementCategorize.current.parentNode.style.width = "100%";
       mainElementCategorize.current.parentNode.style.position = "relative";
       mainElementCategorize.current.parentNode.style.display = "block";
       mainElementCategorize.current.parentNode.style.overflow = "hidden";
       mainElementCategorize.current.parentNode.style.boxShadow = "0px 4px 4px rgb(0, 0, 0, .25)";
       mainElementCategorize.current.parentNode.style.borderRadius = "8px";
   } 
   function categorize_updateSize() {
     updateWinWidth(window.innerWidth);   
     let topelement = null;
     if (mainElementCategorize && mainElementCategorize.current){
         topelement = mainElementCategorize.current.querySelector("#toppart");
      }    
      let netheight = 0;
      if (mainElementCategorize && mainElementCategorize.current){
          netheight =  mainElementCategorize.current.parentNode.parentNode.parentNode.offsetHeight - topelement.offsetHeight - mobilereduce; 
      }    
      if (pickerType === "desktop"){ 
          updateGridHeight(netheight);   
      }else if (pickerType === "mobile") {
          if (window.innerWidth < 600){
              if (mainElementCategorize && mainElementCategorize.current){   
                  netheight =  mainElementCategorize.current.parentNode.parentNode.offsetHeight - 140 - catbuttonheight;
              } 
              updateGridHeight(netheight);
              if(netheight > 0){
                  if (document.querySelector(".DashboardViewContainer_appHeader")) {
                      document.querySelector(".DashboardViewContainer_appHeader").style.display = "none";
                  }
                  if (document.querySelector(".DashboardViewContainer_dashboardBodyContainerhideNavBar")) {
                      document.querySelector(".DashboardViewContainer_dashboardBodyContainerhideNavBar").style.height = "100%";
                  }
                  if (document.querySelector(".DashboardViewContainer_pageTitleContainer")) {
                      document.querySelector(".DashboardViewContainer_pageTitleContainer").style.background = "#401E01";
                  }
                  if (document.querySelector(".DashboardViewContainer_pageTitleContainer")) {
                      if (document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("svg")) {
                          document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("svg").style.fontSize = "4vw";
                      }
                      if (document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("span")) {
                          document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("span").style.fontSize = "4vw";
                      }
                  }
              }
          }else if (window.innerWidth > 600){
              if (document.querySelector(".DashboardViewContainer_pageTitleContainer")){
                  if (document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("svg")){
                      document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("svg").style.fontSize = "1.5vw";
                  }
                  if (document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("span")){                         
                      document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("span").style.fontSize = "1.5vw";
                  }    
              }    
          }   
      }  
      domReplacement();
      let buttonposition = 0;
      buttonposition = setInterval(()=>{
         if (mainElementCategorize && mainElementCategorize.current && mainElementCategorize.current.querySelector("#CategorizeMoveButtons")){
             clearInterval(buttonposition);
             if (pickerType === "mobile"){
                 mainElementCategorize.current.querySelector("#CategorizeMoveButtons").style.width = "100%";
             }else if (pickerType === "desktop"){
                if (mainElementCategorize.current.querySelector("#datagridbox")){
                    let epos = mainElementCategorize.current.querySelector("#datagridbox").offsetWidth-10;
                    if (window.innerWidth < 821){
                        // epos /= 2;
                        epos -= 33;
                    }    
                    mainElementCategorize.current.querySelector(".categorization_CategorizationNextBox").style.left = `${epos}px`;
                }  
             }    
         }   
      },10);
   };       
    if (pickerType === "mobile"){ 

        if (window.innerWidth < 600){           
            if (document.querySelector(".DashboardViewContainer_appHeader")){
                document.querySelector(".DashboardViewContainer_appHeader").style.display = "none";  
            }  
            if (document.querySelector(".DashboardViewContainer_dashboardBodyContainerhideNavBar")){
                document.querySelector(".DashboardViewContainer_dashboardBodyContainerhideNavBar").style.height = "100%";
            }
            if (document.querySelector(".DashboardViewContainer_dashboardContainer")){
               document.querySelector(".DashboardViewContainer_dashboardContainer").style.background = "#401E01";
            }   
            if (document.querySelector(".DashboardViewContainer_pageTitleContainer")){
                if (document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("svg")){
                    document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("svg").style.fontSize = "4vw";
                }    
                if (document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("span")){
                    document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("span").style.fontSize = "4vw";
                }    
            }                                
        }else if (window.innerWidth < 600){
            if (document.querySelector(".DashboardViewContainer_pageTitleContainer")){
                if (document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("svg")){
                    document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("svg").style.fontSize = "1.5vw";
                }    
                if (document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("span")){                
                    document.querySelector(".DashboardViewContainer_pageTitleContainer").querySelector("span").style.fontSize = "1.5vw";
                }    
            }   
        }   
    }
    window.addEventListener('resize', categorize_updateSize,false); 
    categorize_updateSize();    
    domReplacement();
    return () => window.removeEventListener("resize",  categorize_updateSize);
};