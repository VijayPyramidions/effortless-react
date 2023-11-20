import * as React from 'react';
// import { useNavigate } from 'react-router-dom';
import { Button, Dialog } from '@mui/material';

export const PermissionDialog = ({ onClose }) => {
  // const navigate = useNavigate();

  return (
    <Dialog
      open
      maxWidth="xs"
      fullWidth
      PaperProps={{
        elevation: 3,
        style: {
          borderRadius: 16,
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        <p style={{ fontSize: '15px' }}>You don`t have permission to access.</p>
        <Button
          style={{
            background: '#F08B32',
            padding: '10px 25px',
            margin: '10px 0',
            borderRadius: '10px',
            color: '#fff',
          }}
          onClick={() => onClose()}
        >
          CLOSE
        </Button>
      </div>
    </Dialog>
  );
};
