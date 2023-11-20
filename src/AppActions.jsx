/* @flow */
/**
 * @fileoverview App Actions
 */
import RestApi, { METHOD } from '@services/RestApi.jsx';

const AppActions = (dispatch) => {
  return {
    signIn: ({ userId, email }) =>
      dispatch({
        type: 'signIn',
        payload: { userId, email },
      }),
    signUpSubmit: ({ userId, email, phoneNo }) =>
      dispatch({
        type: 'signUpSubmit',
        payload: { userId, email, phoneNo },
      }),
    changeView: (viewType) =>
      dispatch({
        type: 'changeView',
        payload: { viewType },
      }),
    changeSubView: (subView, pageParams) =>
      dispatch({
        type: 'changeSubView',
        payload: { subView, pageParams },
      }),
    EditRole: (data) =>
      dispatch({
        type: 'editrole',
        payload: { data },
      }),
    NotificationOrganization: (data) =>
      dispatch({
        type: 'selectedorganization',
        payload: data,
      }),
    enableLoading: (loading, loadingText) =>
      dispatch({
        type: 'enableLoading',
        payload: { loading, loadingText },
      }),
    addOrganization: ({ orgName, orgId, gstNo, shortName }) =>
      dispatch({
        type: 'addOrganization',
        payload: {
          orgName,
          orgId,
          gstNo,
          shortName,
        },
      }),
    addGstNo: ({ gstNo }) =>
      dispatch({
        type: 'addGstNo',
        payload: {
          gstNo,
        },
      }),
    addOrgId: ({ orgId }) =>
      dispatch({
        type: 'addOrgId',
        payload: {
          orgId,
        },
      }),
    addOrgName: ({ orgName, shortName }) =>
      dispatch({
        type: 'addOrgName',
        payload: {
          orgName,
          shortName,
        },
      }),
    setSessionToken: ({ activeToken }) =>
      dispatch({
        type: 'setSessionToken',
        payload: {
          activeToken,
        },
      }),
    setUserInfo: ({ userInfo }) =>
      dispatch({
        type: 'setUserInfo',
        payload: {
          userInfo,
        },
      }),
    setCurrentUserInfo: ({ currentUserInfo }) =>
      dispatch({
        type: 'setCurrentUserInfo',
        payload: {
          currentUserInfo,
        },
      }),
    setActiveInvoiceId: ({ activeInvoiceId, activeInvoiceSubject }) =>
      dispatch({
        type: 'setActiveInvoiceId',
        payload: {
          activeInvoiceId,
          activeInvoiceSubject,
        },
      }),
    openSnackBar: ({ message, type }) =>
      dispatch({
        type: 'openSnackBar',
        payload: {
          message,
          type,
        },
      }),
    closeSnackBar: () => dispatch({ type: 'closeSnackBar' }),
    validateSession: (token, organizationsProps) => {
      const sessionToken = localStorage.getItem('session_token');
      if (token || (sessionToken && sessionToken !== 'null')) {
        RestApi(`organizations`, {
          method: METHOD.GET,
          headers: {
            Authorization: token || sessionToken,
          },
        })
          .then((res) => {
            if (res && !res.error) {
              if (res.data.length > 0) {
                /* TODO: Remove the block once bank add flow done */
                // RestApi(`organizations/${res.data[0].id}/bank_accounts`, {
                //   method: METHOD.POST,
                //   headers: {
                //     Authorization: sessionToken,
                //   },
                //   payload: {
                //     name: 'HDFC Bank',
                //     bank_account_name: 'HDFC',
                //     bank_branch: 'Teynemper',
                //     bank_account_number: '1234567489588',
                //     bank_ifsc_code: '2345',
                //     bank_swift_code: '123',
                //   },
                // })
                //   .then(() => {})
                //   .catch(() => {
                //     dispatch({
                //       type: 'enableLoading',
                //       payload: {
                //         loading: false,
                //       },
                //     });
                //   });

                dispatch({
                  type: 'setSessionToken',
                  payload: {
                    activeToken: token || sessionToken,
                  },
                });
                dispatch({
                  type: 'setUserInfo',
                  payload: {
                    userInfo: res,
                  },
                });
                dispatch({
                  type: 'addOrgId',
                  payload: {
                    orgId: organizationsProps
                      ? organizationsProps?.orgId
                      : res.data[0].id,
                  },
                });
                dispatch({
                  type: 'addOrgName',
                  payload: {
                    orgName: organizationsProps
                      ? organizationsProps?.orgName
                      : res.data[0].name,
                    shortName: organizationsProps
                      ? organizationsProps?.shortName
                      : res.data[0].short_name,
                  },
                });
                dispatch({
                  type: 'changeView',
                  payload: {
                    viewType: 'dashboard',
                  },
                });
                localStorage.setItem(
                  'selected_organization',
                  JSON.stringify({
                    orgId: organizationsProps
                      ? organizationsProps?.orgId
                      : res.data[0].id,
                    orgName: organizationsProps
                      ? organizationsProps?.orgName
                      : res.data[0].name,
                    shortName: organizationsProps
                      ? organizationsProps?.shortName
                      : res.data[0].short_name,
                  }),
                );
              } else {
                dispatch({
                  type: 'setSessionToken',
                  payload: {
                    activeToken: token || sessionToken,
                    userName:
                      (res.data &&
                        res.data[0] &&
                        res.data[0].creator &&
                        res.data[0].creator.name) ||
                      'Username',
                  },
                });
                dispatch({
                  type: 'setUserInfo',
                  payload: {
                    userInfo: res,
                  },
                });

                dispatch({
                  type: 'changeView',
                  payload: {
                    viewType: 'fillOrgDetails',
                  },
                });
              }
            } else {
              dispatch({
                type: 'changeView',
                payload: {
                  viewType: 'signIn',
                },
              });
            }
            dispatch({
              type: 'enableLoading',
              payload: {
                loading: false,
              },
            });
          })
          .catch(() => {
            dispatch({
              type: 'enableLoading',
              payload: {
                loading: false,
              },
            });
          });
      }
    },
    checkNotification: (orgId) => {
      const sessionToken = localStorage.getItem('session_token');
      RestApi(`organizations/${orgId}/notifications`, {
        method: METHOD.GET,
        headers: {
          Authorization: sessionToken,
        },
      }).then((res) => {
        const mockResp = [
          {
            id: '0acd43b4-ceb4-5340-b6a1-5a9085106f54',
            organization_id: '2b1ce97c-012b-5750-afb1-2ce04a118f7d',
            user_id: 'ebfd780d-ccbf-56f8-926a-3dfb74c58b65',
            subject: 'invoice approved',
            body: 'Your invoice has been approved',
            read: false,
            notification_type: 'invoice_approved_success',
          },
          {
            id: 'dbec54d0-1286-576c-991e-14e55ea19025',
            organization_id: '2b1ce97c-012b-5750-afb1-2ce04a118f7d',
            user_id: 'ebfd780d-ccbf-56f8-926a-3dfb74c58b65',
            subject: 'invoice generated',
            body: 'Your invoice has been generated',
            read: false,
            notification_type: 'approve_invoice_notification',
          },
        ];

        if (res && res.data) {
          dispatch({
            type: 'listNotifications',
            payload: {
              notificationList: [...res.data, ...mockResp],
            },
          });
        }
      });
    },
    toggleSidePanel: () => dispatch({ type: 'toggleSidePanel' }),
    closeSidePanel: () => dispatch({ type: 'closeSidePanel' }),
    registerEventListeners: ({ name, method }) => {
      dispatch({ type: 'registerEventListeners', payload: { name, method } });
    },
    deRegisterEventListener: ({ name, method }) => {
      dispatch({ type: 'deRegisterEventListener', payload: { name, method } });
    },
    getCurrentUser: (orgId) => {
      const sessionToken = localStorage.getItem('session_token');
      if (sessionToken && sessionToken !== 'null') {
        RestApi(`organizations/${orgId}/current_user_details`, {
          method: METHOD.GET,
          headers: {
            Authorization: sessionToken,
          },
        }).then((res) => {
          if (res) {
            dispatch({
              type: 'setCurrentUserInfo',
              payload: {
                currentUserInfo: res,
              },
            });
            dispatch({
              type: 'selectedorganization',
              payload: { id: orgId },
            });
          }
        });
      }
    },
  };
};

export default AppActions;
