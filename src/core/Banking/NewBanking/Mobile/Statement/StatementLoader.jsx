import React from 'react';

import { Stack, Typography, Skeleton } from '@mui/material';

import * as css from '../bankingmobile.scss';

const StatementLoader = ({ rowNm }) => {
  return (
    <>
      {[...Array(rowNm)]?.map((item) => (
        <Stack key={item}>
          <Stack className={css.datesticky}>
            <Typography className={css.transacdate}>
              <Skeleton animation="wave" variant="text" />
            </Typography>
          </Stack>

          {/* {[1, 2, 3, 4]?.map((row) => (
            <Stack className={css.transacsubcontainer} key={row}>
              <Stack className={css.transacsubdescwrp}>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Typography className={css.transacsubdesc}>
                    <Skeleton animation="wave" variant="text" />
                  </Typography>
                </Stack>

                <Typography>
                  <Skeleton animation="wave" variant="text" />
                </Typography>
              </Stack>
            </Stack>
          ))} */}
        </Stack>
      ))}
    </>
  );
};

export default StatementLoader;
