import React from 'react';
import { TableRow, TableCell, Skeleton } from '@mui/material';

const TableRowsLoader = ({ rowsNum, cellNum }) => {
  return [...Array(rowsNum)].map((row) => (
    <TableRow key={row}>
      {[...Array(cellNum)].map((item) => (
        <TableCell component="th" scope="row" key={item}>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
      ))}
    </TableRow>
  ));
};

export default TableRowsLoader;
