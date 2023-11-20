export const typesettings = {
    "vendor" :{
       "against bills" :{inflow:false,outflow:true},
       "advance" : {inflow:false,outflow:true},
       "refund" : {inflow:true,outflow:false},
       "expense" : {inflow:false,outflow:true},
       "deposit" : {inflow:false,outflow:true}
    },
    "customer" :{
       "against bills":{inflow:true,outflow:false},
       "advance" : {inflow:true,outflow:false},
       "refund" : {inflow:false,outflow:true}
    },
    "promoter":{
        "capital" : {inflow:true,outflow:true},
        "loan taken - taken" : {inflow:true,outflow:false},
        "loan taken - repaid" : {inflow:false,outflow:true},
        "loan given - given" : {inflow:false,outflow:true},
        "loan given - repaid" : {inflow:true,outflow:false},
        "reimbursement":{inflow:true,outflow:true},
        "salary":{inflow:false,outflow:true}
    },
    "lender":{
        "loan borrowed - taken":{inflow:true,outflow:false},
        "loan borrowed - repaid" :{inflow:false,outflow:true},
        "emi schedule upload" : {inflow:false,outflow:true}
    },
    "employee":{
        "loan given - given" :{inflow:false,outflow:true},
        "loan given - repaid" : {inflow:true,outflow:false},
        "advance":{inflow:false,outflow:true},
        "reimbursement" :{inflow:true,outflow:true},
        "salary":{inflow:false,outflow:true}
    },
    "government":{
        "payment of taxes":{inflow:false,outflow:true},
        "income tax refund":{inflow:true,outflow:false},
        "advance tax" :{inflow:false,outflow:true},
        "statutory dues":{inflow:false,outflow:true},
        "refund":{inflow:true,outflow:false}
    },
    "other banks":{
        "other banks" : {inflow:true,outflow:true}
    }
 };
 