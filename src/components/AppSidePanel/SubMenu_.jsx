/* @flow */
/**
 * @fileoverview Date picker component
 */
import React from 'react';
import * as Mui from '@mui/material';
import { Divider } from '@material-ui/core';
import * as Router from 'react-router-dom';
import * as css from './AppSidePanel.scss';

export const SubMenuList = ({ text, subMenuClick, ids, statePathSubMenu }) => {
  return (
    <>
      {((text?.subFolder?.length > 0 && text?.activePanel && text?.subIcon) ||
        (!text?.activePanel && text?.subIcon)) && (
        <Mui.List className={css.ptpb} style={{ display: 'block' }}>
          {text?.subFolder?.map((d) => (
            <Mui.Stack
              component={Router.Link}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                subMenuClick(d);
              }}
              key={`index${d.id}`}
              sx={{ p: 0, textDecoration: 'none', color: '#000' }}
              to={statePathSubMenu}
            >
              <>
                {' '}
                <Mui.Typography
                  component={Router.Link}
                  id={d.id}
                  className={
                    ids === d.id
                      ? `${css.subIconLabel2}`
                      : `${css.subIconLabel}`
                  }
                  to={statePathSubMenu}
                >
                  {d.label}
                </Mui.Typography>
                {d?.divider === 'stop' ? (
                  ''
                ) : (
                  <Divider className={css.dividerSidepanelsubIcon} />
                )}
              </>
            </Mui.Stack>
          ))}
        </Mui.List>
      )}
    </>
  );
};
