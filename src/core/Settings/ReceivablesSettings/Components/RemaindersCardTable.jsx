import React, { useState, useEffect, memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Popover,
  Box,
  Dialog,
  Button,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import {
  ClearStateCreateReceivablesRemainder,
  DeleteReceivablesRemainderState,
  GetReceivablesDuplicateRemainderState,
} from '@action/Store/Reducers/Settings/ReceivablesSettingsState';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import copy_settings from '@assets/copy_settings.svg';
import edit_settings from '@assets/edit_settings.svg';
import red_color_delete from '@assets/red_color_delete.svg';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import RemaindersActionSheet from './RemaindersActionSheet';
import TableRowsLoader from '../../../Banking/NewBanking/Mobile/Statement/TableRowLoader';
import {
  MobileCardLoadingSkeleton,
} from '../../../../components/SkeletonLoad/SkeletonLoader';
import * as css from '../receivablesSettings.scss';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const RemaindersCardTable = ({ tableRow, id }) => {
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { receivablesSettingsAction, remainderDataLoad } = useSelector(
    (value) => value.ReceivablesSettings
  );

  const [drawer, setDrawer] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [ActiveItem, setActiveItem] = useState({});

  const tableHead = [
    { name: 'S.NO' },
    { name: 'Template Name' },
    { name: 'Subject' },
    { name: 'Body' },
    { name: 'Action', align: 'center' },
  ];

  const openDrawerClick = (action, event) => {
    if (event === 'open') {
      setDrawer((prev) => ({ ...prev, [action]: true }));
    } else {
      setDrawer((prev) => ({ ...prev, [action]: event.currentTarget }));
    }
  };
  const closeDrawerClick = (action, set) => {
    setDrawer((prev) => ({ ...prev, [action]: set }));
  };

  useEffect(() => {
    if (
      Object.keys(receivablesSettingsAction?.newRemainder || {})?.length > 0
    ) {
      if (device === 'desktop') {
        setDrawer({});
        dispatch(ClearStateCreateReceivablesRemainder());
      }
    }
  }, [JSON.stringify(receivablesSettingsAction?.newRemainder)]);

  useEffect(() => {
    if (
      Object.keys(receivablesSettingsAction?.duplicateRemainder || {})?.length > 0 && receivablesSettingsAction?.duplicateRemainder?.category_type === id
    ) {
      setActiveItem(receivablesSettingsAction?.duplicateRemainder);
      if (device === 'desktop') {
        openDrawerClick('editExsistingRemainder', 'open');
      } else if (device === 'mobile') {
        navigate('/settings-receivables-action', {
          state: { type: 'edit', from: id, dataShow: receivablesSettingsAction?.duplicateRemainder, duplicateType: true },
        });
      }
      dispatch(ClearStateCreateReceivablesRemainder());
     }
  }, [JSON.stringify(receivablesSettingsAction?.duplicateRemainder)]);

  return (
    <>
      {device === 'desktop' ? (
        <Paper
          style={{
            width: '100%',
            overflow: 'hidden',
            boxShadow: 'none',
            border: '1px solid #E5E5E5',
            borderRadius: '8px',
          }}
        >
          <TableContainer style={{ maxHeight: 300 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow className={css.emailTemplateHeadRow}>
                  {tableHead.map((val) => (
                    <TableCell align={val?.align || 'left'}>
                      {val?.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!remainderDataLoad ? (
                          <TableRowsLoader
                            rowsNum={4}
                            cellNum={5}
                          />
                ) :
                tableRow?.length === 0 && <TableRow><TableCell>No Data</TableCell></TableRow> || 
                  tableRow?.map((row, i) => (
                  <TableRow
                    onClick={() => {
                      setActiveItem(row);
                      openDrawerClick('viewExsistingRemainder', 'open');
                    }}
                    key={row.id}
                    className={css.emailTemplateBodyRow}
                  >
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{row?.name}</TableCell>
                    <TableCell>{row?.subject}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          height: '22px',
                          overflow: 'hidden',
                          width: 300,
                        }}
                      >
                        <span dangerouslySetInnerHTML={{ __html: row?.body }} />
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveItem(row);
                          setAnchorEl(e?.currentTarget);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <div style={{ display: 'flex', overflow: 'auto', gap: '12px' }}>
          {!remainderDataLoad ? (
                          <MobileCardLoadingSkeleton NumCard={1} />
                ) :
                tableRow?.length === 0 && <p>No Data</p> || 
                  tableRow?.map((val) => (
            <Paper
              className={css.mobileEmailTemplateCard}
              onClick={() =>
                navigate('/settings-receivables-action', {
                  state: { type: 'view', from: id, dataShow: val },
                })
              }
            >
              <Stack
                direction="column"
                gap="16px"
                style={{ width: '90%', overflow: 'hidden' }}
              >
                {[
                  { headName: 'Template Name', bodyData: val?.name },
                  { headName: 'Delivery To', bodyData: val?.name },
                  { headName: 'Subject', bodyData: val?.subject },
                  {
                    headName: 'Body',
                    bodyData: (
                      <div
                        style={{
                          height: '22px',
                          overflow: 'hidden',
                          width: 300,
                        }}
                      >
                        <span dangerouslySetInnerHTML={{ __html: val?.body }} />
                      </div>
                    ),
                  },
                ]?.map((data) => (
                  <Stack direction="row" gap="12px">
                    <p className={css.emailTemplateHeadMobile}>
                      {data?.headName}
                    </p>
                    <p className={css.emailTemplateBodyMobile}>
                      {data?.bodyData}
                    </p>
                  </Stack>
                ))}
              </Stack>
              <IconButton
                className={css.mobileVertIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveItem(val);
                  openDrawerClick('remainderAction', e);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Paper>
          ))}
        </div>
      )}

      <Popover
        id="basic-menu-sort"
        anchorEl={anchorEl}
        PaperProps={{
          sx: {
            width: '164px',
            boxShadow:
              '0px 9px 42px rgba(0, 0, 0, 0.1), 0px 0px 6px rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
          },
        }}
        open={Boolean(anchorEl) && device === 'desktop'}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={() => setAnchorEl(null)}
      >
        <div>
          <div
            className={css.popoverelement}
            onClick={() => {
              setAnchorEl(null);
              if (device === 'desktop') {
                openDrawerClick('editExsistingRemainder', 'open');
              } else if (device === 'mobile') {
                navigate('/settings-receivables-action', {
                  state: { type: 'edit', from: id, dataShow: ActiveItem },
                });
              }
            }}
          >
            <img src={edit_settings} alt="edit" />
            <p className={css.popovertext}>Edit</p>
          </div>
          <div
            className={css.popoverelement}
            onClick={() => {
              setAnchorEl(null);
              dispatch(
                GetReceivablesDuplicateRemainderState({
                  remainderTemplateId: ActiveItem?.id,
                })
              );
            }}
          >
            <img src={copy_settings} alt="copy" />
            <p className={css.popovertext}>Duplicate</p>
          </div>
          <div
            className={css.popoverelement}
            onClick={() => {
              setAnchorEl(null);
              openDrawerClick('deleteRemainder', 'open');
            }}
          >
            <img src={red_color_delete} alt="delete" />
            <p className={css.popovertext}>Delete</p>
          </div>
        </div>
      </Popover>

      <SelectBottomSheet
        open={drawer.viewExsistingRemainder && device === 'desktop'}
        onClose={() => closeDrawerClick('viewExsistingRemainder', null)}
        triggerComponent={<div style={{ display: 'none' }} />}
        fixedWidthSheet="60vw"
      >
        <RemaindersActionSheet type="view" from={id} dataShow={ActiveItem} />
      </SelectBottomSheet>

      <SelectBottomSheet
        open={drawer.editExsistingRemainder && device === 'desktop'}
        onClose={() => closeDrawerClick('editExsistingRemainder', null)}
        triggerComponent={<div style={{ display: 'none' }} />}
        fixedWidthSheet="60vw"
      >
        <RemaindersActionSheet type="edit" from={id} dataShow={ActiveItem} duplicateType={!ActiveItem.id} />
      </SelectBottomSheet>

      <SelectBottomSheet
        open={drawer.remainderAction && device === 'mobile'}
        onClose={() => closeDrawerClick('remainderAction', null)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <div>
          <Puller />
          <br />
          <div
            className={css.popoverelement}
            onClick={() => {
              closeDrawerClick('remainderAction', null);
              navigate('/settings-receivables-action', {
                state: { type: 'edit', from: id, dataShow: ActiveItem },
              });
            }}
          >
            <img src={edit_settings} alt="edit" />
            <p className={css.popovertext}>Edit</p>
          </div>
          <div
            className={css.popoverelement}
            onClick={() => {
              closeDrawerClick('remainderAction', null);
              // setActiveItem({});
              dispatch(
                GetReceivablesDuplicateRemainderState({
                  remainderTemplateId: ActiveItem?.id,
                })
              );
            }}
          >
            <img src={copy_settings} alt="copy" />
            <p className={css.popovertext}>Duplicate</p>
          </div>
          <div
            className={css.popoverelement}
            onClick={() => {
              closeDrawerClick('remainderAction', null);
              openDrawerClick('deleteRemainder', 'open');
            }}
          >
            <img src={red_color_delete} alt="delete" />
            <p className={css.popovertext}>Delete</p>
          </div>
        </div>
      </SelectBottomSheet>

      <Dialog
        open={drawer?.deleteRemainder && device === 'desktop'}
        onClose={() => closeDrawerClick('deleteRemainder', false)}
        PaperProps={{
          style: {
            borderRadius: 16,
          },
        }}
      >
        <div className={css.deleteremaindercss}>
          <p className={css.titletag}>Delete Reminder</p>
          <p className={css.subTitleTag}>
            Are you sure that you want to delete this Reminder?
          </p>
          <div className={css.bottomCont}>
            <Button
              className={css.secondaryButton}
              onClick={() => closeDrawerClick('deleteRemainder', null)}
            >
              No
            </Button>
            <Button
              className={css.primaryButton}
              onClick={() => {
                closeDrawerClick('deleteRemainder', null);
                dispatch(
                  DeleteReceivablesRemainderState({
                    remainderTemplateId: ActiveItem?.id,
                  })
                );
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </Dialog>

      <SelectBottomSheet
        open={drawer.deleteRemainder && device === 'mobile'}
        onClose={() => closeDrawerClick('deleteRemainder', null)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <Puller />
        <br />
        <div className={css.deleteremaindercssMobile}>
          <p className={css.titletag}>Delete Reminder</p>
          <p className={css.subTitleTag}>
            Are you sure that you want to delete this Reminder?
          </p>
          <div className={css.bottomCont}>
            <Button
              className={css.secondaryButton}
              onClick={() => closeDrawerClick('deleteRemainder', null)}
            >
              No
            </Button>
            <Button
              className={css.primaryButton}
              onClick={() => {
                closeDrawerClick('deleteRemainder', null);
                dispatch(
                  DeleteReceivablesRemainderState({
                    remainderTemplateId: ActiveItem?.id,
                  })
                );
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </SelectBottomSheet>
    </>
  );
};

export default memo(RemaindersCardTable);
