import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  tableContainer: {
    boxShadow: 'none',
    border: '1px solid #999EA5CC',
    borderRadius: '15px',
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
});

const TableComponentWitoutHead = (props) => {
  const { data } = props;
  const classes = useStyles();
  return (
    <TableContainer className={`${classes.tableContainer}`} component={Paper}>
      <Table className={classes.root} aria-label="simple table">
        <TableBody className={classes.tbody}>
          {data.map((row) => (
            <TableRow key={row}>
              <TableCell
                style={{ width: '30%' }}
                className={classes.cell}
                align="center"
              >
                {row.age_bucket}
              </TableCell>
              <TableCell
                style={{ width: '30%' }}
                className={classes.cell}
                align="center"
              >
                {row.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponentWitoutHead;
