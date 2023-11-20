import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  tableContainer: {
    boxShadow: 'none',
    border: '1px solid var(--colorDashboardTableBorder)',
    borderRadius: '8px',
    minHeight: '365px',
  },
  // root: { borderTopWidth: 1, borderColor: 'red', borderStyle: 'solid' },
  thead: {
    '& tr:first-child th': {
      borderTop: '0px',
      textTransform: 'uppercase',
      fontSize: '10px',
    },
    '& tr:first-child th:first-child': { borderLeft: '0px' },
    '& tr:first-child th:last-child': { borderRight: '0px' },
    '& th': {
      background: 'var(--colorDashboardTableHeaderBg)',
      padding: '12px 4px',
      fontWeight: '600',
      lineHeight: 1.5,
    },
  },
  tbody: {
    '& td': { padding: '12px 0', fontWeight: '300', fontSize: '10px' },
    '& tr:last-child td': { borderBottom: '0px' },
    '& tr td:first-child': { borderLeft: '0px' },
    '& tr td:last-child': { borderRight: '0px' },
  },
  cell: {
    border: '1px solid var(--colorDashboardTableBorder)',
  },
  root: {
    minHeight: 'inherit',
  },
});

// Headers
// [
//      { title, dataKey } // dataKey will be used for 'key' prop while looping
//      { title, dataKey }
// ]

// Data
// [
//     { ...dataKey: 'value', key: 'uniqueKeyForLooping'},
//     { ...dataKey: 'value', key: 'uniqueKeyForLooping'}
// ]

// As of now, header colSpan not supported. Make sure No. of columns equal for both Headers & Data

const TableComponent = (props) => {
  const { header, data } = props;
  const classes = useStyles();
  return (
    <TableContainer className={`${classes.tableContainer}`} component={Paper}>
      <Table className={classes.root} aria-label="simple table">
        <TableHead className={classes.thead}>
          <TableRow>
            {header.map((h) => (
              <TableCell
                key={h.dataKey}
                className={classes.cell}
                align="center"
              >
                {h.title}
              </TableCell>
            ))}
            {/* <TableCell className={classes.cell} align="center">Bucket</TableCell>
                        <TableCell className={classes.cell} align="center">Outstanding</TableCell>
                        <TableCell className={classes.cell} align="center" colSpan={2}>COLLECTION EFFICIENCY</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody className={classes.tbody}>
          {data.map((row) => (
            <TableRow key={row.bucket}>
              {header.map((h) => (
                <TableCell
                  style={{ width: '30%' }}
                  className={classes.cell}
                  align="center"
                >
                  {row[h.key]}
                </TableCell>
              ))}
              {/* <TableCell style={{ width: '30%' }} className={classes.cell} align="center">{row.bucket}</TableCell>
                            <TableCell className={classes.cell} align="center">{row.outstanding}</TableCell>
                            <TableCell style={{ width: '30%' }} className={classes.cell} align="center">{row.collectionEff}</TableCell>
                            <TableCell className={`${classes.cell}`} align="center">{row.collectionEffPercent}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
