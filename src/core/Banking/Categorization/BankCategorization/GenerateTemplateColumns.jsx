import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import NumericFormat from 'react-number-format-datagrid-stable-version';
import { showPlaceholder } from '../BankDetails/NumberConvertor';
import { checkNullandAssign } from '../BankDetails/CustomFunctions';
import NumberFormat from '../NumberFormat';
import * as css from '../categorization.scss';
import '../MuiAddonStyles.css';

export const GenerateColumns = (
  type,
  numbertitle,
  datetitle,
  cashtitle,
  numbername,
  hidetds,
  updateTemplateColumns,
  hideTDS,
  paycheck,
  paytitle1,
  paytitle2,
  editaddstatus,
  autoFillValues,
  showtooltip,
  considerAmountField,
  geteditableTDSvalues,
  setfocusSelect,
  residueUpdate,
  editAdjustmentAmount,
  paidto,
  editTaxAmount,
  itemdrawerClickStatus,
  isrefund,
  changeCollapse,
  openUpCard,
  updateValue,
  defaultTransactionType,
  geteditableAdjustmentvalues,
  updateNarration,
  specialTotal,
  Narration,
  mainElementCategorize,
  getitemdrawerClickStatus,
  updateitemdrawerClickStatus,
  TriggerClickItem,
  updateTriggerClickItem,
  pickerType
) => {
  let transactionColumnsDesktop = [];
  let transactionColumnsMobile = [];
  const billnodesc1 = numbername;
  let header = '';
  if (type === 'template1') {
    header = (
      <Grid container style={{ width: '103%', marginTop: '-12px' }}>
        <Grid
          item
          xs={4}
          className={css.mobileGridRow}
          style={{ maxWidth: '28%', position: 'absolute', marginLeft: '-15px' }}
        >
          <Box id="cardTitleLeft" style={{ color: '#283049' }}>
            {billnodesc1}
          </Box>
        </Grid>
        <Grid
          item
          xs={4}
          className={css.mobileGridRow}
          style={{
            maxWidth: '19%',
            marginLeft: `${window.innerWidth < 300 ? '18vw' : '27vw'}`,
          }}
        >
          <Box
            id="cardTitleright"
            style={{ paddingRight: '2px', color: '#283049' }}
          >
            {cashtitle}
          </Box>
        </Grid>
        <Grid
          item
          xs={4}
          className={css.mobileGridRow}
          style={{
            marginLeft: '10px',
            maxWidth: `${window.innerWidth < 300 ? '25%' : '33%'}`,
          }}
        >
          <Box
            id="cardTitleright"
            style={{ paddingRight: '0px', color: '#283049' }}
          >
            Allocate
          </Box>
        </Grid>
      </Grid>
    );
  }

  if (type === 'template2') {
    let pos1 = '';
    let pos2 = '';
    if (paycheck === 'R') {
      pos1 = '-1.5vw';
      pos2 = '5vw';
    } else {
      pos1 = '3vw';
      pos2 = '1vw';
    }
    header = (
      <Grid container style={{ width: '90%', marginTop: '-18px' }}>
        <Grid
          item
          xs={4}
          className={css.mobileGridRow}
          style={{ marginLeft: '10px', maxWidth: '30%' }}
        >
          <Box id="cardTitleLeft" style={{ color: '#401E01' }}>
            {billnodesc1}
          </Box>
        </Grid>
        <Grid
          item
          xs={4}
          className={css.mobileGridRow}
          style={{ maxWidth: '30%', marginLeft: `${pos1}` }}
        >
          <Box
            id="cardTitleright"
            style={{ paddingRight: '2px', color: '#401E01' }}
          >
            {paytitle1}
          </Box>
        </Grid>
        <Grid
          item
          xs={4}
          className={css.mobileGridRow}
          style={{ maxWidth: '30%', marginLeft: `${pos2}` }}
        >
          <Box
            id="cardTitleright"
            style={{ paddingRight: '0px', color: '#401E01' }}
          >
            {paytitle2}
          </Box>
        </Grid>
      </Grid>
    );
  }

  if (type === 'template3') {
    header = (
      <Grid container style={{ width: '100%', marginTop: '-12px' }}>
        <Grid
          item
          xs={4}
          className={css.mobileGridRow}
          style={{ maxWidth: '28%', position: 'absolute', marginLeft: '-15px' }}
        >
          <Box id="cardTitleLeft" style={{ color: '#283049' }}>
            Month
          </Box>
        </Grid>
        <Grid
          item
          xs={4}
          className={css.mobileGridRow}
          style={{
            maxWidth: '19%',
            marginLeft: `${window.innerWidth < 300 ? '16vw' : '27vw'}`,
          }}
        >
          <Box
            id="cardTitleright"
            style={{ paddingRight: '2px', color: '#283049' }}
          >
            To allocate
          </Box>
        </Grid>
        <Grid
          item
          xs={4}
          className={css.mobileGridRow}
          style={{
            maxWidth: `${window.innerWidth < 300 ? '25%' : '33%'}`,
            marginLeft: '3vw',
          }}
        >
          <Box
            id="cardTitleright"
            style={{ paddingRight: '0px', color: '#283049' }}
          >
            Balance
          </Box>
        </Grid>
      </Grid>
    );
  }
  let editable = true;
  if (localStorage.getItem('itemstatus') === 'Edit' && !editaddstatus) {
    editable = false;
  }

  switch (type) {
    case 'template1':
      if (!hidetds) {
        transactionColumnsDesktop = [
          {
            field: 'selection',
            headerName: '',
            sortable: false,
            filter: false,
            flex: 0.25,
            renderCell: (params) => (
              <Checkbox
                checked={params.row.checked}
                id={`selectionofvalue_${params.row.id}`}
                onClick={(event) => autoFillValues(event, params.row.id)}
              />
            ),
          },
          //                 {field:numbertitle,editable:false,headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:1,headerName:`${numbername}`,valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}});},renderCell: (data) =>  (showtooltip?<Tooltip title={`${data.row[numbertitle]}`} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}} )}</span></Tooltip>:<a href={" "} onClick={(event)=>showInvoicePDF(event,data.row.id)}>{`${checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}})}`}</a>)},
          {
            field: numbertitle,
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            headerName: `${numbername}`,
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: numbertitle,
                  type: 'C',
                  absolute: false,
                  altname: '',
                },
                data2: {
                  field: datetitle,
                  type: 'D',
                  absolute: false,
                  altmname: '',
                  prefix: ' dt ',
                  substr: 4,
                  interchange: true,
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={`${data.row[numbertitle]}`}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: numbertitle,
                        type: 'C',
                        absolute: false,
                        altname: '',
                      },
                      data2: {
                        field: datetitle,
                        type: 'D',
                        absolute: false,
                        altmname: '',
                        prefix: ' dt ',
                        substr: 4,
                        interchange: true,
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                <div id="document">{`${checkNullandAssign(data.row, {
                  data1: {
                    field: numbertitle,
                    type: 'C',
                    absolute: false,
                    altname: '',
                  },
                  data2: {
                    field: datetitle,
                    type: 'D',
                    absolute: false,
                    altmname: '',
                    prefix: ' dt ',
                    substr: 4,
                    interchange: true,
                  },
                })}`}</div>
              ),
          },
          {
            field: 'amount',
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'Original Amount',
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'amount',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.amount}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'amount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'amount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: considerAmountField,
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'Pending Amount',
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'net_payable',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row[considerAmountField]}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: considerAmountField,
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: considerAmountField,
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'taxamount',
            editable,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'TDS',
            renderEditCell: (props) => {
              return geteditableTDSvalues()[props.row.id] ? (
                <NumericFormat
                  onFocus={setfocusSelect}
                  autoFocus
                  id="taxamount"
                  thousandsGroupStyle="lakh"
                  thousandSeparator=","
                  prefix={NumberFormat('', false)}
                  onValueChange={editTaxAmount}
                  placeholder={showPlaceholder(props.row.taxamount)}
                  defaultValue={showPlaceholder(props.row.taxamount)}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  customInput={TextField}
                />
              ) : (
                showPlaceholder(props.row.taxamount)
              );
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.taxamount}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'taxamount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'taxamount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'cash',
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: `${cashtitle}`,
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'cash',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.cash}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'cash',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'cash',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'adjustment',
            editable,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'To Allocate',
            renderEditCell: (props) => {
              return (
                <NumericFormat
                  onFocus={setfocusSelect}
                  onBlur={residueUpdate}
                  autoFocus
                  id="adjustment"
                  thousandsGroupStyle="lakh"
                  thousandSeparator=","
                  placeholder={showPlaceholder(props.row.adjustment)}
                  prefix={NumberFormat('', false)}
                  onValueChange={editAdjustmentAmount}
                  defaultValue={showPlaceholder(props.row.adjustment)}
                  customInput={TextField}
                />
              );
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.adjustment}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'adjustment',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'adjustment',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'settlementamount',
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'Balance',
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'settlementamount',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.settlementamount}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'settlementamount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'settlementamount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
        ];
      } else if (hidetds) {
        if (paidto?.type?.toLowerCase() === 'vendor') {
          if (!isrefund) {
            transactionColumnsDesktop = [
              {
                field: 'selection',
                headerName: '',
                sortable: false,
                filter: false,
                flex: 0.25,
                renderCell: (params) => (
                  <Checkbox
                    checked={params.row.checked}
                    id={`selectionofvalue_${params.row.id}`}
                    onClick={(event) => autoFillValues(event, params.row.id)}
                  />
                ),
              },
              //                    {field:numbertitle,editable:false,headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:1,headerName:`${numbername}`,valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}});},renderCell: (data) =>  (showtooltip?<Tooltip title={`${data.row[numbertitle]}`} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}} )}</span></Tooltip>:<a href={" "} onClick={(event)=>showInvoicePDF(event,data.row.id)}>{`${checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}})}`}</a>)},
              {
                field: numbertitle,
                editable: false,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'left',
                headerAlign: 'left',
                flex: 1,
                headerName: `${numbername}`,
                valueGetter: (data) => {
                  return checkNullandAssign(data.row, {
                    data1: {
                      field: numbertitle,
                      type: 'C',
                      absolute: false,
                      altname: '',
                    },
                    data2: {
                      field: datetitle,
                      type: 'D',
                      absolute: false,
                      altmname: '',
                      prefix: ' dt ',
                      substr: 4,
                      interchange: true,
                    },
                  });
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={`${data.row[numbertitle]}`}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: numbertitle,
                            type: 'C',
                            absolute: false,
                            altname: '',
                          },
                          data2: {
                            field: datetitle,
                            type: 'D',
                            absolute: false,
                            altmname: '',
                            prefix: ' dt ',
                            substr: 4,
                            interchange: true,
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    <div id="document">{`${checkNullandAssign(data.row, {
                      data1: {
                        field: numbertitle,
                        type: 'C',
                        absolute: false,
                        altname: '',
                      },
                      data2: {
                        field: datetitle,
                        type: 'D',
                        absolute: false,
                        altmname: '',
                        prefix: ' dt ',
                        substr: 4,
                        interchange: true,
                      },
                    })}`}</div>
                  ),
              },
              {
                field: 'amount',
                editable: false,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                flex: 1,
                headerName: 'Original Amount',
                valueGetter: (data) => {
                  return checkNullandAssign(data.row, {
                    data1: {
                      field: 'amount',
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  });
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={data.row.amount}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: 'amount',
                            type: 'N',
                            absolute: false,
                            altname: '',
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    checkNullandAssign(data.row, {
                      data1: {
                        field: 'amount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })
                  ),
              },
              {
                field: considerAmountField,
                editable: false,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                flex: 1,
                headerName: 'Pending Amount',
                valueGetter: (data) => {
                  return checkNullandAssign(data.row, {
                    data1: {
                      field: 'net_payable',
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  });
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={data.row[considerAmountField]}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: considerAmountField,
                            type: 'N',
                            absolute: false,
                            altname: '',
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    checkNullandAssign(data.row, {
                      data1: {
                        field: considerAmountField,
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })
                  ),
              },
              {
                field: 'taxamount',
                editable,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                flex: 1,
                headerName: 'TDS',
                renderEditCell: (props) => {
                  return geteditableTDSvalues()[props.row.id] ? (
                    <NumericFormat
                      onFocus={setfocusSelect}
                      autoFocus
                      id="taxamount"
                      thousandsGroupStyle="lakh"
                      thousandSeparator=","
                      prefix={NumberFormat('', false)}
                      onValueChange={editTaxAmount}
                      placeholder={showPlaceholder(props.row.taxamount)}
                      defaultValue={showPlaceholder(props.row.taxamount)}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      customInput={TextField}
                    />
                  ) : (
                    showPlaceholder(props.row.taxamount)
                  );
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={data.row.taxamount}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: 'taxamount',
                            type: 'N',
                            absolute: false,
                            altname: '',
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    checkNullandAssign(data.row, {
                      data1: {
                        field: 'taxamount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })
                  ),
              },
              {
                field: 'cash',
                editable: false,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                flex: 1,
                headerName: `${cashtitle}`,
                valueGetter: (data) => {
                  return checkNullandAssign(data.row, {
                    data1: {
                      field: 'cash',
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  });
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={data.row.cash}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: 'cash',
                            type: 'N',
                            absolute: false,
                            altname: '',
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    checkNullandAssign(data.row, {
                      data1: {
                        field: 'cash',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })
                  ),
              },
              {
                field: 'adjustment',
                editable,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                flex: 1,
                headerName: 'To Allocate',
                renderEditCell: (props) => {
                  return (
                    <NumericFormat
                      onFocus={setfocusSelect}
                      onBlur={residueUpdate}
                      autoFocus
                      id="adjustment"
                      thousandsGroupStyle="lakh"
                      thousandSeparator=","
                      placeholder={showPlaceholder(props.row.adjustment)}
                      prefix={NumberFormat('', false)}
                      onValueChange={editAdjustmentAmount}
                      defaultValue={showPlaceholder(props.row.adjustment)}
                      customInput={TextField}
                    />
                  );
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={data.row.adjustment}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: 'adjustment',
                            type: 'N',
                            absolute: false,
                            altname: '',
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    checkNullandAssign(data.row, {
                      data1: {
                        field: 'adjustment',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })
                  ),
              },
              {
                field: 'settlementamount',
                editable: false,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                flex: 1,
                headerName: 'Balance',
                valueGetter: (data) => {
                  return checkNullandAssign(data.row, {
                    data1: {
                      field: 'settlementamount',
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  });
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={data.row.settlementamount}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: 'settlementamount',
                            type: 'N',
                            absolute: false,
                            altname: '',
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    checkNullandAssign(data.row, {
                      data1: {
                        field: 'settlementamount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })
                  ),
              },
            ];
          } else {
            transactionColumnsDesktop = [
              {
                field: 'selection',
                headerName: '',
                sortable: false,
                filter: false,
                flex: 0.25,
                renderCell: (params) => (
                  <Checkbox
                    checked={params.row.checked}
                    id={`selectionofvalue_${params.row.id}`}
                    onClick={(event) => autoFillValues(event, params.row.id)}
                  />
                ),
              },
              //                      {field:numbertitle,editable:false,headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:1,headerName:`${numbername}`,valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}});},renderCell: (data) =>  (showtooltip?<Tooltip title={`${data.row[numbertitle]}`} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}} )}</span></Tooltip>:<a href={" "} onClick={(event)=>showInvoicePDF(event,data.row.id)}>{`${checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}})}`}</a>)},
              {
                field: numbertitle,
                editable: false,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'left',
                headerAlign: 'left',
                flex: 1,
                headerName: `${numbername}`,
                valueGetter: (data) => {
                  return checkNullandAssign(data.row, {
                    data1: {
                      field: numbertitle,
                      type: 'C',
                      absolute: false,
                      altname: '',
                    },
                    data2: {
                      field: datetitle,
                      type: 'D',
                      absolute: false,
                      altmname: '',
                      prefix: ' dt ',
                      substr: 4,
                      interchange: true,
                    },
                  });
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={`${data.row[numbertitle]}`}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: numbertitle,
                            type: 'C',
                            absolute: false,
                            altname: '',
                          },
                          data2: {
                            field: datetitle,
                            type: 'D',
                            absolute: false,
                            altmname: '',
                            prefix: ' dt ',
                            substr: 4,
                            interchange: true,
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    <div id="document">{`${checkNullandAssign(data.row, {
                      data1: {
                        field: numbertitle,
                        type: 'C',
                        absolute: false,
                        altname: '',
                      },
                      data2: {
                        field: datetitle,
                        type: 'D',
                        absolute: false,
                        altmname: '',
                        prefix: ' dt ',
                        substr: 4,
                        interchange: true,
                      },
                    })}`}</div>
                  ),
              },
              {
                field: 'amount',
                editable: false,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                flex: 1,
                headerName: 'Original Amount',
                valueGetter: (data) => {
                  return checkNullandAssign(data.row, {
                    data1: {
                      field: 'amount',
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  });
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={data.row.amount}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: 'amount',
                            type: 'N',
                            absolute: false,
                            altname: '',
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    checkNullandAssign(data.row, {
                      data1: {
                        field: 'amount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })
                  ),
              },
              {
                field: considerAmountField,
                editable: false,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                flex: 1,
                headerName: 'Pending Amount',
                valueGetter: (data) => {
                  return checkNullandAssign(data.row, {
                    data1: {
                      field: 'net_payable',
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  });
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={data.row[considerAmountField]}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: considerAmountField,
                            type: 'N',
                            absolute: false,
                            altname: '',
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    checkNullandAssign(data.row, {
                      data1: {
                        field: considerAmountField,
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })
                  ),
              },
              {
                field: 'cash',
                editable: false,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                flex: 1,
                headerName: `${cashtitle}`,
                valueGetter: (data) => {
                  return checkNullandAssign(data.row, {
                    data1: {
                      field: 'cash',
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  });
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={data.row.cash}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: 'cash',
                            type: 'N',
                            absolute: false,
                            altname: '',
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    checkNullandAssign(data.row, {
                      data1: {
                        field: 'cash',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })
                  ),
              },
              {
                field: 'adjustment',
                editable,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                flex: 1,
                headerName: 'To Allocate',
                renderEditCell: (props) => {
                  return (
                    <NumericFormat
                      onFocus={setfocusSelect}
                      onBlur={residueUpdate}
                      autoFocus
                      id="adjustment"
                      thousandsGroupStyle="lakh"
                      thousandSeparator=","
                      placeholder={showPlaceholder(props.row.adjustment)}
                      prefix={NumberFormat('', false)}
                      onValueChange={editAdjustmentAmount}
                      defaultValue={showPlaceholder(props.row.adjustment)}
                      customInput={TextField}
                    />
                  );
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={data.row.adjustment}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: 'adjustment',
                            type: 'N',
                            absolute: false,
                            altname: '',
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    checkNullandAssign(data.row, {
                      data1: {
                        field: 'adjustment',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })
                  ),
              },
              {
                field: 'settlementamount',
                editable: false,
                headerClassName: 'headerStyle',
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                flex: 1,
                headerName: 'Balance',
                valueGetter: (data) => {
                  return checkNullandAssign(data.row, {
                    data1: {
                      field: 'settlementamount',
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  });
                },
                renderCell: (data) =>
                  showtooltip ? (
                    <Tooltip title={data.row.settlementamount}>
                      <span className={css.table_cell_trucate}>
                        {checkNullandAssign(data.row, {
                          data1: {
                            field: 'settlementamount',
                            type: 'N',
                            absolute: false,
                            altname: '',
                          },
                        })}
                      </span>
                    </Tooltip>
                  ) : (
                    checkNullandAssign(data.row, {
                      data1: {
                        field: 'settlementamount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })
                  ),
              },
            ];
          }
        } else {
          transactionColumnsDesktop = [
            {
              field: 'selection',
              headerName: '',
              sortable: false,
              filter: false,
              flex: 0.25,
              renderCell: (params) => (
                <Checkbox
                  checked={params.row.checked}
                  id={`selectionofvalue_${params.row.id}`}
                  onClick={(event) => autoFillValues(event, params.row.id)}
                />
              ),
            },
            //                      {field:numbertitle,editable:false,headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:1,headerName:`${numbername}`,valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}});},renderCell: (data) =>  (showtooltip?<Tooltip title={`${data.row[numbertitle]}`} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}} )}</span></Tooltip>:<a href={" "} onClick={(event)=>showInvoicePDF(event,data.row.id)}>{`${checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}})}`}</a>)},
            {
              field: numbertitle,
              editable: false,
              headerClassName: 'headerStyle',
              sortable: false,
              align: 'left',
              headerAlign: 'left',
              flex: 1,
              headerName: `${numbername}`,
              valueGetter: (data) => {
                return checkNullandAssign(data.row, {
                  data1: {
                    field: numbertitle,
                    type: 'C',
                    absolute: false,
                    altname: '',
                  },
                  data2: {
                    field: datetitle,
                    type: 'D',
                    absolute: false,
                    altmname: '',
                    prefix: ' dt ',
                    substr: 4,
                    interchange: true,
                  },
                });
              },
              renderCell: (data) =>
                showtooltip ? (
                  <Tooltip title={`${data.row[numbertitle]}`}>
                    <span className={css.table_cell_trucate}>
                      {checkNullandAssign(data.row, {
                        data1: {
                          field: numbertitle,
                          type: 'C',
                          absolute: false,
                          altname: '',
                        },
                        data2: {
                          field: datetitle,
                          type: 'D',
                          absolute: false,
                          altmname: '',
                          prefix: ' dt ',
                          substr: 4,
                          interchange: true,
                        },
                      })}
                    </span>
                  </Tooltip>
                ) : (
                  <div id="document">{`${checkNullandAssign(data.row, {
                    data1: {
                      field: numbertitle,
                      type: 'C',
                      absolute: false,
                      altname: '',
                    },
                    data2: {
                      field: datetitle,
                      type: 'D',
                      absolute: false,
                      altmname: '',
                      prefix: ' dt ',
                      substr: 4,
                      interchange: true,
                    },
                  })}`}</div>
                ),
            },
            {
              field: 'amount',
              editable: false,
              headerClassName: 'headerStyle',
              sortable: false,
              align: 'right',
              headerAlign: 'right',
              flex: 1,
              headerName: 'Original Amount',
              valueGetter: (data) => {
                return checkNullandAssign(data.row, {
                  data1: {
                    field: 'amount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                });
              },
              renderCell: (data) =>
                showtooltip ? (
                  <Tooltip title={data.row.amount}>
                    <span className={css.table_cell_trucate}>
                      {checkNullandAssign(data.row, {
                        data1: {
                          field: 'amount',
                          type: 'N',
                          absolute: false,
                          altname: '',
                        },
                      })}
                    </span>
                  </Tooltip>
                ) : (
                  checkNullandAssign(data.row, {
                    data1: {
                      field: 'amount',
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  })
                ),
            },
            {
              field: considerAmountField,
              editable: false,
              headerClassName: 'headerStyle',
              sortable: false,
              align: 'right',
              headerAlign: 'right',
              flex: 1,
              headerName: 'Pending Amount',
              valueGetter: (data) => {
                return checkNullandAssign(data.row, {
                  data1: {
                    field: 'net_payable',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                });
              },
              renderCell: (data) =>
                showtooltip ? (
                  <Tooltip title={data.row[considerAmountField]}>
                    <span className={css.table_cell_trucate}>
                      {checkNullandAssign(data.row, {
                        data1: {
                          field: considerAmountField,
                          type: 'N',
                          absolute: false,
                          altname: '',
                        },
                      })}
                    </span>
                  </Tooltip>
                ) : (
                  checkNullandAssign(data.row, {
                    data1: {
                      field: considerAmountField,
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  })
                ),
            },
            {
              field: 'cash',
              editable: false,
              headerClassName: 'headerStyle',
              sortable: false,
              align: 'right',
              headerAlign: 'right',
              flex: 1,
              headerName: `${cashtitle}`,
              valueGetter: (data) => {
                return checkNullandAssign(data.row, {
                  data1: {
                    field: 'cash',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                });
              },
              renderCell: (data) =>
                showtooltip ? (
                  <Tooltip title={data.row.cash}>
                    <span className={css.table_cell_trucate}>
                      {checkNullandAssign(data.row, {
                        data1: {
                          field: 'cash',
                          type: 'N',
                          absolute: false,
                          altname: '',
                        },
                      })}
                    </span>
                  </Tooltip>
                ) : (
                  checkNullandAssign(data.row, {
                    data1: {
                      field: 'cash',
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  })
                ),
            },
            {
              field: 'adjustment',
              editable,
              headerClassName: 'headerStyle',
              sortable: false,
              align: 'right',
              headerAlign: 'right',
              flex: 1,
              headerName: 'To Allocate',
              renderEditCell: (props) => {
                return (
                  <NumericFormat
                    onFocus={setfocusSelect}
                    onBlur={residueUpdate}
                    autoFocus
                    id="adjustment"
                    thousandsGroupStyle="lakh"
                    thousandSeparator=","
                    placeholder={showPlaceholder(props.row.adjustment)}
                    prefix={NumberFormat('', false)}
                    onValueChange={editAdjustmentAmount}
                    defaultValue={showPlaceholder(props.row.adjustment)}
                    customInput={TextField}
                  />
                );
              },
              renderCell: (data) =>
                showtooltip ? (
                  <Tooltip title={data.row.adjustment}>
                    <span className={css.table_cell_trucate}>
                      {checkNullandAssign(data.row, {
                        data1: {
                          field: 'adjustment',
                          type: 'N',
                          absolute: false,
                          altname: '',
                        },
                      })}
                    </span>
                  </Tooltip>
                ) : (
                  checkNullandAssign(data.row, {
                    data1: {
                      field: 'adjustment',
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  })
                ),
            },
            {
              field: 'settlementamount',
              editable: false,
              headerClassName: 'headerStyle',
              sortable: false,
              align: 'right',
              headerAlign: 'right',
              flex: 1,
              headerName: 'Balance',
              valueGetter: (data) => {
                return checkNullandAssign(data.row, {
                  data1: {
                    field: 'settlementamount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                });
              },
              renderCell: (data) =>
                showtooltip ? (
                  <Tooltip title={data.row.settlementamount}>
                    <span className={css.table_cell_trucate}>
                      {checkNullandAssign(data.row, {
                        data1: {
                          field: 'settlementamount',
                          type: 'N',
                          absolute: false,
                          altname: '',
                        },
                      })}
                    </span>
                  </Tooltip>
                ) : (
                  checkNullandAssign(data.row, {
                    data1: {
                      field: 'settlementamount',
                      type: 'N',
                      absolute: false,
                      altname: '',
                    },
                  })
                ),
            },
          ];
        }
      }
      transactionColumnsMobile = [
        {
          field: 'selection',
          headerName: '',
          sortable: false,
          filter: false,
          renderCell: (params) => (
            <Checkbox
              className={
                itemdrawerClickStatus[params.row.id]
                  ? css.collapsecrdcheckclass
                  : css.expandcrdcheckclass
              }
              checked={params.row.checked}
              id="selectionofvalue"
              onClick={(event) => autoFillValues(event, params.row.id)}
            />
          ),
        },
        {
          field: 'Details',
          sortable: false,
          align: 'left',
          headerAlign: 'center',
          flex: 1,
          headerName: header,
          colSpan: 6,
          renderCell: (data) => {
            const billnotitle = checkNullandAssign(data.row, {
              data1: {
                field: numbertitle,
                type: 'C',
                absolute: false,
                altname: '',
              },
              data2: {
                field: datetitle,
                type: 'D',
                absolute: false,
                altmname: '',
                prefix: ' dt ',
                substr: 4,
                interchange: true,
              },
            });
            const origamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: 'amount',
                type: 'N',
                absolute: false,
                altname: '',
              },
            });
            const pendingamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: considerAmountField,
                type: 'N',
                absolute: false,
                altname: '',
              },
            });
            const cashamounttitle = checkNullandAssign(data.row, {
              data1: { field: 'cash', type: 'N', absolute: false, altname: '' },
            });
            const settlementamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: 'settlementamount',
                type: 'N',
                absolute: false,
                altname: '',
              },
            });
            const taxamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: 'taxamount',
                type: 'N',
                absolute: false,
                altname: '',
              },
            });
            const adjustmentamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: 'adjustment',
                type: 'N',
                absolute: false,
                altname: '',
              },
            });
            const pendingamountdesc = `Pending Amount`;
            const origamountdesc = `Original Amount`;
            const taxamountdesc = `TDS Amount`;
            const settlementdesc = `Balance Amount`;
            const displaytds =
              hidetds && paidto?.type?.toLowerCase() === 'vendor'
                ? taxamounttitle
                : '';
            return (
              <Stack
                style={{ width: '100%' }}
                className={css.cardConfiguration}
                onClick={(event) =>
                  changeCollapse(
                    event,
                    data.row.id,
                    mainElementCategorize,
                    getitemdrawerClickStatus,
                    updateitemdrawerClickStatus,
                    TriggerClickItem,
                    updateTriggerClickItem,
                    pickerType
                  )
                }
              >
                <Collapse
                  orientation="vertical"
                  in={itemdrawerClickStatus[data.row.id]}
                  collapsedSize={22}
                >
                  <Grid
                    container
                    style={{ marginTop: '-22px', marginLeft: '20px' }}
                    className={
                      itemdrawerClickStatus[data.row.id]
                        ? css.collapsegrdclass
                        : css.expandgrdclass
                    }
                  >
                    <Grid
                      item
                      xs={4}
                      className={css.mobileGridRow}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Box
                        className={
                          itemdrawerClickStatus[data.row.id]
                            ? css.collapsecrdclass
                            : css.expandcrdclass
                        }
                        id="cardDataleft"
                        rel="documentdetails"
                        style={{
                          maxWidth: '80%',
                          color: '#1A38C3',
                          wordWrap: 'break-word',
                        }}
                      >
                        <div
                          id="document"
                          onClick={(event) =>
                            changeCollapse(
                              event,
                              data.row.id,
                              mainElementCategorize,
                              getitemdrawerClickStatus,
                              updateitemdrawerClickStatus,
                              TriggerClickItem,
                              updateTriggerClickItem,
                              pickerType
                            )
                          }
                        >
                          {billnotitle}
                        </div>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      className={css.mobileGridRow}
                      style={{
                        maxWidth: '28%',
                        paddingRight: '10px',
                        marginLeft: '-12px',
                        marginTop: `${window.innerWidth < 300 ? '2px' : '0px'}`,
                      }}
                    >
                      <Box
                        className={
                          itemdrawerClickStatus[data.row.id]
                            ? css.collapsecrdclass
                            : css.expandcrdclass
                        }
                        id="cardDataright"
                        rel="amountdetails"
                        style={{ paddingRight: '2px', color: '#283049' }}
                      >
                        <div
                          onClick={(event) =>
                            changeCollapse(
                              event,
                              data.row.id,
                              mainElementCategorize,
                              getitemdrawerClickStatus,
                              updateitemdrawerClickStatus,
                              TriggerClickItem,
                              updateTriggerClickItem,
                              pickerType
                            )
                          }
                        >
                          {cashamounttitle}
                        </div>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      className={css.mobileGridRow}
                      style={{
                        paddingRight: `${
                          window.innerWidth < 300 ? '10px' : '0px'
                        }`,
                        marginTop: `${window.innerWidth < 300 ? '2px' : '0px'}`,
                        marginLeft: `${
                          window.innerWidth < 300 ? '5px' : '0px'
                        }`,
                      }}
                    >
                      <Box
                        onClick={(event) =>
                          changeCollapse(
                            event,
                            data.row.id,
                            mainElementCategorize,
                            getitemdrawerClickStatus,
                            updateitemdrawerClickStatus,
                            TriggerClickItem,
                            updateTriggerClickItem,
                            pickerType
                          )
                        }
                        className={
                          itemdrawerClickStatus[data.row.id]
                            ? css.collapsecrdclass
                            : css.expandcrdclass
                        }
                        id="cardDataright"
                        rel="adjustmentdetails"
                        style={{ color: '#283049' }}
                      >
                        {localStorage.getItem('itemstatus') === 'Add' ? (
                          <NumericFormat
                            id="adjustmentamount"
                            onClick={(event) => {
                              openUpCard(`${data.row.id}`, event, 'adjustment');
                            }}
                            onBlur={(event) =>
                              updateValue(`${data.row.id}`, event, 'adjustment')
                            }
                            thousandsGroupStyle="lakh"
                            thousandSeparator=","
                            prefix={NumberFormat('', false)}
                            onFocus={setfocusSelect}
                            onValueChange={editAdjustmentAmount}
                            placeholder={showPlaceholder(data.row.adjustment)}
                            defaultValue={showPlaceholder(data.row.adjustment)}
                            value={showPlaceholder(data.row.adjustment)}
                            customInput={TextField}
                          />
                        ) : (
                          adjustmentamounttitle
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                  {!itemdrawerClickStatus[data.row.id] ? (
                    <hr className={css.cardMainDivider} />
                  ) : (
                    ''
                  )}
                  <Grid
                    container
                    style={{ marginTop: '-10px' }}
                    className={css.mobileGridRow}
                  >
                    <Grid item xs={5}>
                      <span
                        id="cardDataleft"
                        style={{ color: '#283049', marginLeft: '18px' }}
                      >
                        {origamountdesc}
                      </span>
                    </Grid>
                    <Grid item xs={`${window.width < 300 ? 5 : 4.1}`}>
                      <span
                        id="cardDataright"
                        className="adjustpadding"
                        style={{ color: '#283049' }}
                      >
                        {origamounttitle}
                      </span>
                    </Grid>
                    <Grid item xs={`${window.width < 300 ? 2 : 2.9}`}>
                      {}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{ marginTop: '-10px' }}
                    className={css.mobileGridRow}
                  >
                    <Grid item xs={5}>
                      <span
                        id="cardDataleft"
                        style={{ color: '#283049', marginLeft: '18px' }}
                      >
                        {pendingamountdesc}
                      </span>
                    </Grid>
                    <Grid item xs={`${window.width < 300 ? 5 : 4.1}`}>
                      <span
                        id="cardDataright"
                        className="adjustpadding"
                        style={{ color: '#283049' }}
                      >
                        {pendingamounttitle}
                      </span>
                    </Grid>
                    <Grid item xs={`${window.width < 300 ? 2 : 2.9}`}>
                      {}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{ marginTop: '-10px' }}
                    className={css.mobileGridRow}
                  >
                    <Grid item xs={5}>
                      <span
                        id="cardDataleft"
                        style={{
                          color: '#283049',
                          marginLeft: '18px',
                          fontWeight: '500',
                        }}
                      >
                        {taxamountdesc}
                      </span>
                    </Grid>
                    <Grid item xs={`${window.width < 300 ? 5 : 4.1}`}>
                      {!hidetds ? (
                        <span
                          id="cardDataright"
                          rel="nonedit"
                          className="adjusttaxpadding"
                          style={{ color: '#283049' }}
                        >
                          {localStorage.getItem('itemstatus') === 'Add' ? (
                            <NumericFormat
                              id="taxamount"
                              onBlur={(event) =>
                                updateValue(
                                  `${data.row.id}`,
                                  event,
                                  'taxamount'
                                )
                              }
                              thousandsGroupStyle="lakh"
                              thousandSeparator=","
                              prefix={NumberFormat('', false)}
                              onFocus={setfocusSelect}
                              onValueChange={editTaxAmount}
                              placeholder={showPlaceholder(data.row.taxamount)}
                              defaultValue={showPlaceholder(data.row.taxamount)}
                              customInput={TextField}
                            />
                          ) : (
                            taxamounttitle
                          )}
                        </span>
                      ) : (
                        <span
                          id="cardDataright"
                          rel="nonedit"
                          className="adjusttaxpadding"
                        >
                          {displaytds}
                        </span>
                      )}
                    </Grid>
                    <Grid item xs={`${window.width < 300 ? 2 : 2.9}`}>
                      {}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{ marginTop: '-14px' }}
                    className={css.mobileGridRow}
                  >
                    <Grid item xs={3}>
                      {}
                    </Grid>
                    <Grid item xs={5.5}>
                      <span
                        id="cardDataleft"
                        style={{
                          color: '#F08B32',
                          marginTop: '0px',
                          paddingLeft: '25px',
                        }}
                      >
                        {settlementdesc}
                      </span>
                    </Grid>
                    <Grid item xs={3.5}>
                      <span
                        id="cardDataright"
                        className="adjustbalancepadding"
                        style={{ color: '#283049' }}
                      >
                        {settlementamounttitle}
                      </span>
                    </Grid>
                  </Grid>
                </Collapse>
              </Stack>
            );
          },
        },
      ];
      updateTemplateColumns((tcolumns) => ({
        ...tcolumns,
        transactionColumnsDesktop,
        transactionColumnsMobile,
      }));
      break;
    case 'template2':
      if (!hideTDS) {
        transactionColumnsDesktop = [
          {
            field: numbertitle,
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            headerName: `${numbername}`,
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: numbertitle,
                  type: 'C',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={`${data.row[numbertitle]}`}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: numbertitle,
                        type: 'C',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: numbertitle,
                    type: 'C',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: considerAmountField,
            editable: false,
            headerClassName: 'headerStyleAmount',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: `${paytitle2}`,
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'net_payable',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row[considerAmountField]}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: considerAmountField,
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: considerAmountField,
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'taxamount',
            editable,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'TDS',
            renderEditCell: (props) => {
              return geteditableTDSvalues()[props.row.id] ? (
                <NumericFormat
                  onFocus={setfocusSelect}
                  autoFocus
                  id="taxamount"
                  thousandsGroupStyle="lakh"
                  thousandSeparator=","
                  prefix={NumberFormat('', false)}
                  onValueChange={editTaxAmount}
                  placeholder={showPlaceholder(props.row.taxamount)}
                  defaultValue={showPlaceholder(props.row.taxamount)}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  customInput={TextField}
                />
              ) : (
                showPlaceholder(props.row.taxamount)
              );
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.taxamount}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'taxamount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'taxamount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'settlementamount',
            editable: false,
            headerClassName: 'headerStyleAmount',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: `${paytitle1}`,
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'settlementamount',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.settlementamount}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'settlementamount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'settlementamount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
        ];
      } else {
        transactionColumnsDesktop = [
          {
            field: numbertitle,
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            headerName: `${numbername}`,
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: numbertitle,
                  type: 'C',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={`${data.row[numbertitle]}`}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: numbertitle,
                        type: 'C',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: numbertitle,
                    type: 'C',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: considerAmountField,
            editable: false,
            headerClassName: 'headerStyleAmount',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: `${paytitle2}`,
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'net_payable',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row[considerAmountField]}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: considerAmountField,
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: considerAmountField,
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'settlementamount',
            editable: false,
            headerClassName: 'headerStyleAmount',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: `${paytitle1}`,
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'settlementamount',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.settlementamount}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'settlementamount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'settlementamount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
        ];
      }
      transactionColumnsMobile = [
        {
          field: 'Advances',
          sortable: false,
          align: 'left',
          headerAlign: 'center',
          flex: 1,
          headerName: header,
          colSpan: 6,
          renderCell: (data) => {
            const billnotitle = checkNullandAssign(data.row, {
              data1: {
                field: numbertitle,
                type: 'C',
                absolute: false,
                altname: '',
              },
            });
            const pendingamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: considerAmountField,
                type: 'N',
                absolute: false,
                altname: '',
              },
            });
            const settlementamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: 'settlementamount',
                type: 'N',
                absolute: false,
                altname: '',
              },
            });
            const taxamountdesc = `TDS Amount`;
            const taxamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: 'taxamount',
                type: 'N',
                absolute: false,
                altname: '',
              },
            });

            return (
              <Stack
                style={{ width: '100%' }}
                className={css.cardConfiguration}
              >
                <Grid
                  xs={12}
                  container
                  style={{
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '3px',
                    paddingBottom: '3px',
                    marginTop: '-37px',
                    background: '#FFFFFF',
                    border: '1px solid #D8D8D8',
                    borderRadius: '4px',
                    width: '96%',
                  }}
                >
                  <Grid
                    item
                    xs={4}
                    className={css.mobileGridRow}
                    style={{ marginTop: '-10px' }}
                  >
                    <Box
                      id="cardDataleft"
                      rel="documentdetails"
                      style={{ color: '#1A38C3' }}
                    >
                      {billnotitle}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    style={{ marginLeft: '5px', marginTop: '-14px' }}
                    className={css.mobileGridRow}
                  >
                    <Box
                      id="cardDataright"
                      style={{ paddingRight: '2px', color: '#401E01' }}
                    >
                      {pendingamounttitle}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    style={{ marginLeft: '-5px', marginTop: '-14px' }}
                    className={css.mobileGridRow}
                  >
                    <Box
                      id="cardDataright"
                      className={
                        defaultTransactionType === 'Payment'
                          ? css.settlementcolor1
                          : css.settlementcolor2
                      }
                    >
                      {settlementamounttitle}
                    </Box>
                  </Grid>
                </Grid>
                <Grid
                  container
                  style={{
                    height: '48px',
                    marginTop: '0px',
                    background: '#EDEDED',
                    paddingLeft: '15px',
                    paddingRight: '14px',
                    paddingTop: '7px',
                    paddingBottom: '7px',
                    width: '96%',
                  }}
                  className={css.mobileGridRow}
                >
                  <Grid item xs={3}>
                    <span
                      id="cardDataleft"
                      style={{
                        marginTop: '-15px',
                        color: '#401E01',
                        fontWeight: 500,
                      }}
                    >
                      {taxamountdesc}
                    </span>
                  </Grid>
                  <Grid
                    item
                    xs={6.5}
                    style={{
                      marginTop: '-7px',
                      marginLeft: '18px',
                      paddingRight: '4px',
                    }}
                  >
                    {!hideTDS ? (
                      <span
                        id="cardDataright"
                        rel="nonedit"
                        className="adjusttaxpadding"
                        style={{
                          marginTop: '-10px',
                          marginLeft: '40px',
                          color: '#283049',
                          width: '100px',
                        }}
                      >
                        {localStorage.getItem('itemstatus') === 'Add' ? (
                          <NumericFormat
                            id="taxamount"
                            onBlur={(event) =>
                              updateValue(`${data.row.id}`, event, 'taxamount')
                            }
                            thousandsGroupStyle="lakh"
                            thousandSeparator=","
                            prefix={NumberFormat('', false)}
                            onFocus={setfocusSelect}
                            onValueChange={editTaxAmount}
                            placeholder={showPlaceholder(data.row.taxamount)}
                            defaultValue={showPlaceholder(data.row.taxamount)}
                            customInput={TextField}
                          />
                        ) : (
                          taxamounttitle
                        )}
                      </span>
                    ) : (
                      ''
                    )}
                  </Grid>
                  <Grid item xs={0.5}>
                    {}
                  </Grid>
                </Grid>
                <Grid
                  container
                  style={{ marginTop: '10px' }}
                  className={css.mobileGridRow}
                >
                  <div className={css.NotesTitle}>Notes (Optional)</div>
                  <div className={css.mobileTextEntryHolder}>
                    <TextField
                      defaultValue={Narration}
                      onChange={(eve) => updateNarration(eve.target.value)}
                      variant="standard"
                      multiline
                      InputProps={{ disableUnderline: true }}
                      className={css.textEntry}
                    />
                  </div>
                </Grid>
              </Stack>
            );
          },
        },
      ];
      updateTemplateColumns((tcolumns) => ({
        ...tcolumns,
        transactionColumnsDesktop,
        transactionColumnsMobile,
      }));
      break;

    case 'template3':
      if (!hidetds) {
        transactionColumnsDesktop = [
          {
            field: 'selection',
            headerName: '',
            sortable: false,
            filter: false,
            flex: 0.25,
            renderCell: (params) =>
              geteditableAdjustmentvalues()[params.row.id] || !specialTotal ? (
                <Checkbox
                  checked={params.row.checked}
                  id={`selectionofvalue_${params.row.id}`}
                  onClick={(event) => autoFillValues(event, params.row.id)}
                />
              ) : (
                ''
              ),
          },
          //                 {field:numbertitle,editable:false,headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:1,headerName:`${numbername}`,valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}});},renderCell: (data) =>  (showtooltip?<Tooltip title={`${data.row[numbertitle]}`} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}} )}</span></Tooltip>:<a href={" "} onClick={(event)=>showInvoicePDF(event,data.row.id)}>{`${checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}})}`}</a>)},
          {
            field: numbertitle,
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            headerName: `${numbername}`,
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: numbertitle,
                  type: 'C',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={`${data.row[numbertitle]}`}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: numbertitle,
                        type: 'C',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                <div id="document">{`${checkNullandAssign(data.row, {
                  data1: {
                    field: numbertitle,
                    type: 'C',
                    absolute: false,
                    altname: '',
                  },
                })}`}</div>
              ),
          },
          {
            field: 'account_name',
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            headerName: 'Account',
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'account_name',
                  type: 'C',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={`${data.row.account_name}`}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'account_name',
                        type: 'C',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                <div id="accounttype">{`${checkNullandAssign(data.row, {
                  data1: {
                    field: 'account_name',
                    type: 'C',
                    absolute: false,
                    altname: '',
                  },
                })}`}</div>
              ),
          },
          {
            field: 'amount',
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'Original Amount',
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'amount',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.amount}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'amount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'amount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: considerAmountField,
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'Pending Amount',
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'net_payable',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row[considerAmountField]}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: considerAmountField,
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: considerAmountField,
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'taxamount',
            editable,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'TDS',
            renderEditCell: (props) => {
              return geteditableTDSvalues()[props.row.id] ? (
                <NumericFormat
                  onFocus={setfocusSelect}
                  autoFocus
                  id="taxamount"
                  thousandsGroupStyle="lakh"
                  thousandSeparator=","
                  prefix={NumberFormat('', false)}
                  onValueChange={editTaxAmount}
                  placeholder={showPlaceholder(props.row.taxamount)}
                  defaultValue={showPlaceholder(props.row.taxamount)}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  customInput={TextField}
                />
              ) : (
                showPlaceholder(props.row.taxamount)
              );
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.taxamount}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'taxamount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'taxamount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'cash',
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: `${cashtitle}`,
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'cash',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.cash}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'cash',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'cash',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'adjustment',
            editable,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'To Allocate',
            renderEditCell: (props) => {
              return geteditableAdjustmentvalues()[props.row.id] ||
                !!specialTotal ? (
                <NumericFormat
                  onFocus={setfocusSelect}
                  onBlur={residueUpdate()}
                  autoFocus
                  id="adjustment"
                  thousandsGroupStyle="lakh"
                  thousandSeparator=","
                  placeholder={showPlaceholder(props.row.adjustment)}
                  prefix={NumberFormat('', false)}
                  onValueChange={editAdjustmentAmount}
                  defaultValue={showPlaceholder(props.row.adjustment)}
                  customInput={TextField}
                />
              ) : (
                showPlaceholder(props.row.adjustment)
              );
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.adjustment}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'adjustment',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'adjustment',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'settlementamount',
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'Balance',
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'settlementamount',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.settlementamount}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'settlementamount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'settlementamount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
        ];
      } else {
        transactionColumnsDesktop = [
          {
            field: 'selection',
            headerName: '',
            sortable: false,
            filter: false,
            flex: 0.25,
            renderCell: (params) =>
              geteditableAdjustmentvalues()[params.row.id] || !specialTotal ? (
                <Checkbox
                  checked={params.row.checked}
                  id={`selectionofvalue_${params.row.id}`}
                  onClick={(event) => autoFillValues(event, params.row.id)}
                />
              ) : (
                ''
              ),
          },
          //                  {field:numbertitle,editable:false,headerClassName:"headerStyle",sortable: false,align:'left',headerAlign: 'left',flex:1,headerName:`${numbername}`,valueGetter: (data) => {return checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}});},renderCell: (data) =>  (showtooltip?<Tooltip title={`${data.row[numbertitle]}`} ><span className={css.table_cell_trucate}>{checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}} )}</span></Tooltip>:<a href={" "} onClick={(event)=>showInvoicePDF(event,data.row.id)}>{`${checkNullandAssign(data.row,{data1:{field:numbertitle,type:'C',absolute:false,altname:""},data2:{field:datetitle,type:"D",absolute:false,altmname:"",prefix:" dt ",substr:4,interchange:true}})}`}</a>)},
          {
            field: numbertitle,
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            headerName: `${numbername}`,
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: numbertitle,
                  type: 'C',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={`${data.row[numbertitle]}`}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: numbertitle,
                        type: 'C',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                <div id="document">{`${checkNullandAssign(data.row, {
                  data1: {
                    field: numbertitle,
                    type: 'C',
                    absolute: false,
                    altname: '',
                  },
                })}`}</div>
              ),
          },
          {
            field: 'account_name',
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            headerName: 'Account',
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'account_name',
                  type: 'C',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={`${data.row.account_name}`}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'account_name',
                        type: 'C',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                <div id="accounttype">{`${checkNullandAssign(data.row, {
                  data1: {
                    field: 'account_name',
                    type: 'C',
                    absolute: false,
                    altname: '',
                  },
                })}`}</div>
              ),
          },
          {
            field: 'amount',
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'Original Amount',
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'amount',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.amount}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'amount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'amount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: considerAmountField,
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'Pending Amount',
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'net_payable',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row[considerAmountField]}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: considerAmountField,
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: considerAmountField,
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'adjustment',
            editable,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'To Allocate',
            renderEditCell: (props) => {
              return geteditableAdjustmentvalues()[props.row.id] ||
                !specialTotal ? (
                <NumericFormat
                  onFocus={setfocusSelect}
                  onBlur={residueUpdate()}
                  autoFocus
                  id="adjustment"
                  thousandsGroupStyle="lakh"
                  thousandSeparator=","
                  placeholder={showPlaceholder(props.row.adjustment)}
                  prefix={NumberFormat('', false)}
                  onValueChange={editAdjustmentAmount}
                  defaultValue={showPlaceholder(props.row.adjustment)}
                  customInput={TextField}
                />
              ) : (
                showPlaceholder(props.row.adjustment)
              );
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.adjustment}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'adjustment',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'adjustment',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
          {
            field: 'settlementamount',
            editable: false,
            headerClassName: 'headerStyle',
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            flex: 1,
            headerName: 'Balance',
            valueGetter: (data) => {
              return checkNullandAssign(data.row, {
                data1: {
                  field: 'settlementamount',
                  type: 'N',
                  absolute: false,
                  altname: '',
                },
              });
            },
            renderCell: (data) =>
              showtooltip ? (
                <Tooltip title={data.row.settlementamount}>
                  <span className={css.table_cell_trucate}>
                    {checkNullandAssign(data.row, {
                      data1: {
                        field: 'settlementamount',
                        type: 'N',
                        absolute: false,
                        altname: '',
                      },
                    })}
                  </span>
                </Tooltip>
              ) : (
                checkNullandAssign(data.row, {
                  data1: {
                    field: 'settlementamount',
                    type: 'N',
                    absolute: false,
                    altname: '',
                  },
                })
              ),
          },
        ];
      }
      transactionColumnsMobile = [
        {
          field: 'selection',
          headerName: '',
          sortable: false,
          filter: false,
          renderCell: (params) =>
            geteditableAdjustmentvalues()[params.row.id] || !specialTotal ? (
              <Checkbox
                className={
                  itemdrawerClickStatus[params.row.id]
                    ? css.collapsecrdcheckclass
                    : css.expandcrdcheckclass
                }
                checked={params.row.checked}
                id="selectionofvalue"
                onClick={(event) => autoFillValues(event, params.row.id)}
              />
            ) : (
              ''
            ),
        },
        {
          field: 'Details',
          sortable: false,
          align: 'left',
          headerAlign: 'center',
          flex: 1,
          headerName: header,
          colSpan: 6,
          renderCell: (data) => {
            const billnotitle = checkNullandAssign(data.row, {
              data1: {
                field: numbertitle,
                type: 'C',
                absolute: false,
                altname: '',
              },
            });
            const origamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: 'amount',
                type: 'N',
                absolute: false,
                altname: '',
              },
            });
            const pendingamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: considerAmountField,
                type: 'N',
                absolute: false,
                altname: '',
              },
            });
            const cashamounttitle = checkNullandAssign(data.row, {
              data1: { field: 'cash', type: 'N', absolute: false, altname: '' },
            });
            const settlementamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: 'settlementamount',
                type: 'N',
                absolute: false,
                altname: '',
              },
            });
            const taxamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: 'taxamount',
                type: 'N',
                absolute: false,
                altname: '',
              },
            });
            const adjustmentamounttitle = checkNullandAssign(data.row, {
              data1: {
                field: 'adjustment',
                type: 'N',
                absolute: false,
                altname: '',
              },
            });

            const pendingamountdesc = `Pending Amount`;
            const origamountdesc = `Original Amount`;
            const taxamountdesc = `TDS Amount`;
            const settlementdesc = `Balance Amount`;
            return (
              <Stack
                style={{ width: '100%' }}
                className={css.cardConfiguration}
              >
                <Collapse
                  orientation="vertical"
                  in={itemdrawerClickStatus[data.row.id]}
                  collapsedSize={22}
                  className={
                    itemdrawerClickStatus[data.row.id]
                      ? css.collapsegrdclass1
                      : css.expandgrdclass1
                  }
                >
                  <Grid
                    container
                    style={{ marginTop: '-22px', marginLeft: '20px' }}
                    className={
                      itemdrawerClickStatus[data.row.id]
                        ? css.collapsegrdclass
                        : css.expandgrdclass
                    }
                  >
                    <Grid
                      item
                      xs={4}
                      className={css.mobileGridRow}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Box
                        className={
                          itemdrawerClickStatus[data.row.id]
                            ? css.collapsecrdclass
                            : css.expandcrdclass
                        }
                        id="cardDataleft"
                        rel="documentdetails"
                        style={{
                          maxWidth: '80%',
                          color: '#1A38C3',
                          wordWrap: 'break-word',
                        }}
                      >
                        <div id="document">{billnotitle}</div>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      className={css.mobileGridRow}
                      style={{
                        maxWidth: '28%',
                        paddingRight: '10px',
                        marginLeft: '-12px',
                        marginTop: `${window.innerWidth < 300 ? '2px' : '0px'}`,
                      }}
                    >
                      <Box
                        className={
                          itemdrawerClickStatus[data.row.id]
                            ? css.collapsecrdclass
                            : css.expandcrdclass
                        }
                        id="cardDataright"
                        rel="amountdetails"
                        style={{ paddingRight: '2px', color: '#283049' }}
                      >
                        {cashamounttitle}
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      className={css.mobileGridRow}
                      style={{
                        paddingRight: `${
                          window.innerWidth < 300 ? '10px' : '0px'
                        }`,
                        marginTop: `${window.innerWidth < 300 ? '2px' : '0px'}`,
                        marginLeft: `${
                          window.innerWidth < 300 ? '5px' : '0px'
                        }`,
                      }}
                    >
                      <Box
                        className={
                          itemdrawerClickStatus[data.row.id]
                            ? css.collapsecrdclass
                            : css.expandcrdclass
                        }
                        id="cardDataright"
                        rel="adjustmentdetails"
                        style={{ color: '#F08B32' }}
                      >
                        {geteditableAdjustmentvalues()[data.row.id] ||
                        !specialTotal ? (
                          <NumericFormat
                            id="adjustmentamount"
                            onClick={(event) => {
                              openUpCard(`${data.row.id}`, event, 'adjustment');
                            }}
                            onBlur={(event) =>
                              updateValue(`${data.row.id}`, event, 'adjustment')
                            }
                            thousandsGroupStyle="lakh"
                            thousandSeparator=","
                            prefix={NumberFormat('', false)}
                            onFocus={setfocusSelect}
                            onValueChange={editAdjustmentAmount}
                            placeholder={showPlaceholder(data.row.adjustment)}
                            defaultValue={showPlaceholder(data.row.adjustment)}
                            value={showPlaceholder(data.row.adjustment)}
                            customInput={TextField}
                          />
                        ) : (
                          adjustmentamounttitle
                        )}
                        :
                      </Box>
                    </Grid>
                  </Grid>
                  {!itemdrawerClickStatus[data.row.id] ? (
                    <hr className={css.cardMainDivider} />
                  ) : (
                    ''
                  )}
                  <Grid
                    container
                    style={{ marginTop: '-10px' }}
                    className={css.mobileGridRow}
                  >
                    <Grid item xs={5}>
                      <span
                        id="cardDataleft"
                        style={{ color: '#283049', marginLeft: '18px' }}
                      >
                        {origamountdesc}
                      </span>
                    </Grid>
                    <Grid item xs={4.4}>
                      <span
                        id="cardDataright"
                        className="adjustpadding"
                        style={{ color: '#283049' }}
                      >
                        {origamounttitle}
                      </span>
                    </Grid>
                    <Grid item xs={2.6}>
                      {}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{ marginTop: '-10px' }}
                    className={css.mobileGridRow}
                  >
                    <Grid item xs={5}>
                      <span
                        id="cardDataleft"
                        style={{ color: '#283049', marginLeft: '18px' }}
                      >
                        {pendingamountdesc}
                      </span>
                    </Grid>
                    <Grid item xs={4.4}>
                      <span
                        id="cardDataright"
                        className="adjustpadding"
                        style={{ color: '#283049' }}
                      >
                        {pendingamounttitle}
                      </span>
                    </Grid>
                    <Grid item xs={2.6}>
                      {}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{ display: 'none', marginTop: '-10px' }}
                    className={css.mobileGridRow}
                  >
                    <Grid item xs={5}>
                      <span
                        id="cardDataleft"
                        style={{ color: '#283049', marginLeft: '18px' }}
                      >
                        {taxamountdesc}
                      </span>
                    </Grid>
                    <Grid item xs={4.4}>
                      {!hidetds ? (
                        <span
                          id="cardDataright"
                          rel="nonedit"
                          className="adjusttaxpadding"
                          style={{ color: '#283049', display: 'none' }}
                        >
                          {localStorage.getItem('itemstatus') === 'Add' ? (
                            <NumericFormat
                              id="taxamount"
                              onBlur={(event) =>
                                updateValue(
                                  `${data.row.id}`,
                                  event,
                                  'taxamount'
                                )
                              }
                              thousandsGroupStyle="lakh"
                              thousandSeparator=","
                              prefix={NumberFormat('', false)}
                              onFocus={setfocusSelect}
                              onValueChange={editTaxAmount}
                              placeholder={showPlaceholder(data.row.taxamount)}
                              defaultValue={showPlaceholder(data.row.taxamount)}
                              value={showPlaceholder(data.row.taxamount)}
                              customInput={TextField}
                            />
                          ) : (
                            taxamounttitle
                          )}
                          :
                        </span>
                      ) : (
                        ''
                      )}
                    </Grid>
                    <Grid item xs={2.6}>
                      {}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{ display: 'none', marginTop: '-14px' }}
                    className={css.mobileGridRow}
                  >
                    <Grid item xs={3}>
                      {}
                    </Grid>
                    <Grid item xs={5.5}>
                      <span
                        id="cardDataleft"
                        style={{
                          color: '#F08B32',
                          marginTop: '0px',
                          paddingLeft: '25px',
                        }}
                      >
                        {settlementdesc}
                      </span>
                    </Grid>
                    <Grid item xs={3.5}>
                      <span
                        id="cardDataright"
                        className="adjustbalancepadding"
                        style={{ color: '#283049' }}
                      >
                        {settlementamounttitle}
                      </span>
                    </Grid>
                  </Grid>
                </Collapse>
              </Stack>
            );
          },
        },
      ];
      updateTemplateColumns((tcolumns) => ({
        ...tcolumns,
        transactionColumnsDesktop,
        transactionColumnsMobile,
      }));
      break;
    default:
      break;
  }
};
