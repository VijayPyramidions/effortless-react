import NumberFormat from "../NumberFormat.jsx";

export const StringtoNumber = (value) =>{
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

export const RoundingtheNumber = (value) =>{
    return Math.round(value * 100) / 100;
};

export const addDecimals = (value) =>{
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

export const showPlaceholder = (value) =>{
    let derivedval = StringtoNumber(value);  
    derivedval = RoundingtheNumber(derivedval);
    const amountstr = addDecimals(derivedval);
    const finalstr = amountstr.split(".");
    const strreplaced = `${finalstr[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")}.${finalstr[1]}`;  
    return NumberFormat(strreplaced);
};


export const dateInput = (inp) =>{
    inp.preventDefault();
}; 

