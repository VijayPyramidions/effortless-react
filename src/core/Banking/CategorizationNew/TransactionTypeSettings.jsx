export const typesettings = {
    "vendor" :{
       "against bills" :{inflow:false,outflow:true},
       "advance" : {inflow:false,outflow:true},
       "refund" : {inflow:true,outflow:false},
       "expense" : {inflow:false,outflow:true},
       "deposit" : {inflow:true,outflow:true}
    },
    "customer" :{
       "against bills":{inflow:true,outflow:false},
       "advance" : {inflow:true,outflow:false},
       "refund" : {inflow:false,outflow:true}
    },
    "promoter":{
        "drawing" : {inflow: false, outflow: true},
        "capital" : {inflow: true, outflow: false},
        "loan taken - taken" : {inflow:true,outflow:false},
        "loan taken - repaid" : {inflow:false,outflow:true},
        "loan given - given" : {inflow:false,outflow:true},
        "loan given - repaid" : {inflow:true,outflow:false},
        "reimbursement":{inflow:true,outflow:true},
        "director remuneration":{inflow:false,outflow:true}
    },
    "lender":{
        "loan borrowed - taken":{inflow:true,outflow:false},
        "loan borrowed - repaid" :{inflow:false,outflow:true},
        "emi schedule upload" : {inflow:false,outflow:true},
        "loan borrowed - emi repaid":{inflow:false,outflow:true},
        "loan borrowed - emi taken": {inflow:true,outflow:false},
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
        "payment of epf":{inflow:false,outflow:true},
        "payment of esi":{inflow:false,outflow:true},
        "payment of gst":{inflow:false,outflow:true},
        "payment of tds":{inflow:false,outflow:true},
        "payment of pt":{inflow:false,outflow:true},
        "payment of income tax":{inflow:false,outflow:true},
        "income tax refund":{inflow:true,outflow:false},
        "advance tax" :{inflow:false,outflow:true},
        "statutory dues":{inflow:false,outflow:true},
        "refund":{inflow:true,outflow:false}
    },
    "other banks":{
        // "other banks" : {inflow:true,outflow:true},
        // 'bank list (contra)': {inflow:true,outflow:true},
        "other income" : {inflow:true,outflow:false},
        "bank interest" : {inflow:true,outflow:false}
    }
 };
 