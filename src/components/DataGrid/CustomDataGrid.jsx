import * as React from 'react';
import * as Mui from '@mui/material';
import AppContext from '@root/AppContext.jsx';
import NorthIcon from '@mui/icons-material/North';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  tableContainer: {},
  table: {},
  thead: {},
  tbody: {},
  tRow: {
    '& :hover': { background: '#e9e9e9' },
  },
  tbcell: {
    textOverflow: 'ellipsis',
    maxWidth: 110,
    // borderBottom: '#f4f5f4',
    overflow: 'hidden',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  thcell: {
    textOverflow: 'ellipsis',
    maxWidth: 110,
    // padding: '0 10px',
    overflow: 'hidden',
    whiteSpace: 'break-spaces',
    cursor: 'pointer',
  },
});

const MainTable = ({
  headData,
  bodyData,
  tableStyle,
  checkboxSelection,
  rowStyle,
  size,
  tableRowHeader,
  tableRowFooter,
}) => {
  const classes = useStyles();
  const { loading } = React.useContext(AppContext);
  const [orderBy, setOrderBy] = React.useState({});
  const [tableData, setTableData] = React.useState([]);
  const [selectedValue, setSelectedValue] = React.useState([]);
  React.useEffect(() => {
    setTableData(bodyData);
    headData.forEach((val) =>
      setOrderBy((prev) => ({ ...prev, [val?.id]: 'none' })),
    );
  }, [bodyData]);
  // console.log(tableData, bodyData);

  const sortingClick = (_id, from, type) => {
    if (orderBy[_id] === 'asc') {
      setOrderBy(
        Object.assign(
          {},
          ...Object.entries(orderBy).map(([key]) => ({
            [key]: key === String(_id) ? 'dsc' : 'none',
          })),
        ),
      );

      const typeOfSort =
        type === 'number'
          ? tableData.sort(function (a, b) {
              return Number(b[from]) - Number(a[from]);
            })
          : (type === 'date' &&
              tableData.sort(function (a, b) {
                return new Date(b[from]) - new Date(a[from]);
              })) ||
            tableData.sort((a, b) =>
              b[from]?.toLowerCase().localeCompare(a[from]?.toLowerCase()),
            );

      // console.log(typeOfSort);
      setTableData(typeOfSort);
    } else if (orderBy[_id] === 'dsc') {
      setOrderBy(
        Object.assign(
          {},
          ...Object.entries(orderBy).map(([key]) => ({
            [key]: key === String(_id) ? 'none' : 'none',
          })),
        ),
      );
      setTableData(bodyData);
    } else {
      setOrderBy(
        Object.assign(
          {},
          ...Object.entries(orderBy).map(([key]) => ({
            [key]: key === String(_id) ? 'asc' : 'none',
          })),
        ),
      );

      const typeOfSort =
        type === 'number'
          ? tableData.sort(function (a, b) {
              return Number(a[from]) - Number(b[from]);
            })
          : (type === 'date' &&
              tableData.sort(function (a, b) {
                return new Date(a[from]) - new Date(b[from]);
              })) ||
            tableData.sort((a, b) =>
              a[from]
                ?.toLocaleLowerCase()
                .localeCompare(b[from]?.toLocaleLowerCase()),
            );
      // console.log(typeOfSort);

      setTableData(typeOfSort);
    }
    // console.log(_id, from, type);
  };

  const handleDataClick = (ids) => {
    if (!selectedValue?.includes(ids)) {
      setSelectedValue((s) => [...s, ids]);
    } else if (selectedValue?.includes(ids)) {
      setSelectedValue(selectedValue?.filter((val) => val !== ids));
    }
  };

  React.useEffect(() => {
    if (checkboxSelection) {
      checkboxSelection(selectedValue);
    }
  }, [selectedValue]);

  return (
    <>
      <Mui.TableContainer sx={tableStyle} className={classes.tableContainer}>
        <Mui.Table stickyHeader size={size || 'large'}>
          <Mui.TableHead>
            <Mui.TableRow>
              {checkboxSelection && (
                <Mui.TableCell>
                  <Mui.Checkbox
                    checked={
                      selectedValue.sort().join() ===
                      tableData
                        ?.map((v) => v?.id)
                        .sort()
                        .join()
                    }
                    onChange={(e) => {
                      if (e?.target?.checked) {
                        setSelectedValue(tableData?.map((v) => v?.id));
                      } else {
                        setSelectedValue([]);
                      }
                    }}
                  />
                </Mui.TableCell>
              )}
              {headData.map((val) => (
                <Mui.TableCell
                  key={val.id}
                  align={val?.align || 'left'}
                  sx={{
                    maxWidth: val?.columnWidth,
                    minWidth: val?.columnWidth2,
                  }}
                  onClick={() => {
                    if (!val.hideSort) {
                      sortingClick(val?.id, val?.value, val?.type);
                    }
                  }}
                >
                  <Mui.Stack
                    direction="row"
                    alignItems="center"
                    justifyContent={val?.align || 'left'}
                    gap="10px"
                  >
                    {val.hideSortLeft === false ? (
                      <Mui.IconButton>
                        <NorthIcon
                          sx={{
                            width: '20px',
                            transform:
                              orderBy[val.id] === 'dsc'
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)',
                            opacity: orderBy[val.id] !== 'none' ? '1' : '.3',
                            transition: '.2s',
                          }}
                        />
                      </Mui.IconButton>
                    ) : (
                      ''
                    )}
                    {val.title}
                    {!val.hideSort && (
                      <Mui.IconButton>
                        <NorthIcon
                          sx={{
                            width: '20px',
                            transform:
                              orderBy[val.id] === 'dsc'
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)',
                            opacity: orderBy[val.id] !== 'none' ? '1' : '.3',
                            transition: '.2s',
                          }}
                        />
                      </Mui.IconButton>
                    )}
                  </Mui.Stack>
                </Mui.TableCell>
              ))}
            </Mui.TableRow>

            {tableData?.length > 0 && tableRowHeader && (
              <Mui.TableRow>
                <Mui.TableCell
                  style={{ top: 51 }}
                  colSpan={headData?.length}
                  align="center"
                >
                  {tableRowHeader}
                </Mui.TableCell>
              </Mui.TableRow>
            )}
          </Mui.TableHead>

          <Mui.TableBody sx={rowStyle} className={classes.tRow}>
            {/* {(tableData?.length > 0 && tableRowHeader) && <Mui.TableRow><Mui.TableCell colSpan={headData?.length} align='center'>{tableRowHeader}</Mui.TableCell></Mui.TableRow>} */}
            {tableData?.length > 0 &&
              tableData?.map((val, index) => (
                <Mui.TableRow key={val.id}>
                  {checkboxSelection && (
                    <Mui.TableCell>
                      <Mui.Checkbox
                        checked={selectedValue?.includes(val.id)}
                        onChange={() => handleDataClick(val.id)}
                      />
                    </Mui.TableCell>
                  )}
                  {headData.map((key) => (
                    <Mui.TableCell
                      key={key.id}
                      style={
                        key?.style && key?.style(val[key.styleVal || key.value])
                      }
                      align={key?.align || 'left'}
                      className={classes.tbcell}
                      onClick={() => {
                        if (key?.cellClick) {
                          key?.cellClick(val);
                        }
                        if (checkboxSelection) {
                          handleDataClick(val.id);
                        }
                      }}
                      // onClick={() => key?.cellClick && key?.cellClick(val)}
                    >
                      {key?.displayVal
                        ? key?.displayVal(val[key.value])
                        : val[key.value]}
                      {key?.type === 'icon' && key?.icon}
                      {key?.type === 'rowId' && index + 1}
                    </Mui.TableCell>
                  ))}
                </Mui.TableRow>
              ))}
            {!loading && tableData?.length === 0 && (
              <Mui.TableRow>
                <Mui.TableCell colSpan={headData?.length} align="center">
                  No Data Found
                </Mui.TableCell>
              </Mui.TableRow>
            )}
            {loading && (
              <Mui.TableRow>
                <Mui.TableCell colSpan={headData?.length} align="center">
                  Data is being fetched...
                </Mui.TableCell>
              </Mui.TableRow>
            )}
          </Mui.TableBody>
          {tableData?.length > 0 && tableRowFooter && (
            <Mui.TableFooter
              style={{
                backgroundColor: 'white',
                position: 'sticky',
                bottom: 0,
              }}
            >
              <Mui.TableCell colSpan={headData?.length} align="center">
                {tableRowFooter}
              </Mui.TableCell>
            </Mui.TableFooter>
          )}
        </Mui.Table>
      </Mui.TableContainer>
    </>
  );
};

export default MainTable;
