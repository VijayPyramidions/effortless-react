import { makeStyles } from '@material-ui/core/styles';
import { TextareaAutosize} from '@mui/material';
import { styled } from '@mui/system';

export const useStyles = makeStyles({
    datagridcategorization: {
        borderLeft: '.5px solid #E0E0E0 !important',
        borderRight: '.5px solid #E0E0E0 !important',
        borderTop: '1px solid #E0E0E0 !important',
        borderBottom: '1px solid #E0E0E0 !important',
        borderRadius: '8px !important',
        '& .MuiDataGrid-main': {
            borderRadius: '8px',
        },
        '& .MuiDataGrid-columnHeader': {
            borderLeft: '.5px solid #E0E0E0',
            borderRight: '.5px solid #E0E0E0',
            borderTop: 'none',
            borderBottom: '.5px solid #E0E0E0',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontFamily: "'Lexend', sans-serif !important",
          fontWeight: '700 !important',
          fontSize: '14px',
        },
        '& .MuiDataGrid-columnHeaderTitleContainer': {
            justifyContent: 'center',
        },
        '& .MuiDataGrid-cell': {
            border: '.5px solid #E0E0E0 !important',
        },
        '& .MuiDataGrid-iconSeparator': {
            display: 'none',
        },
        '& .MuiCheckbox-root': {
            color: '#F08B32',
          },
          '& .Mui-checked': {
            color: '#F08B32 !important',
          },
          '& .MuiDataGrid-aggregationColumnHeaderLabel': {
            display: 'none',
          },
  },
});


  export const StyledTextarea = styled(TextareaAutosize)(
    () => `
    width: calc(100% - 26px);
    height: calc(100% - 26px) !important;
    font-family: 'Lexend', sans-serif !important;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 8px;
    color: #666;
    background: rgba(234, 232, 232, 0.26);
    border: 1px solid #E0E0E0;
    box-shadow: none;
    resize: none;
  
    &:hover {
      border-color: none;
    }
  
    &:focus {
      border-color: none;
      box-shadow: none;
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );