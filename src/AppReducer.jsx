// import JSBridge from '@nativeBridge/jsbridge';

const AppReducer = (state, action) => {
  switch (action.type) {
    case 'changeView': {
      return {
        ...state,
        viewType: action.payload.viewType,
        loading: false,
      };
    }
    case 'changeSubView': {
      return {
        ...state,
        subView: action.payload.subView,
        pageParams: action.payload?.pageParams,
        loading: false,
        organization: {
          ...state.organization,
        },
      };
    }
    case 'setUserInfo': {
      const { userInfo } = action.payload;
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      return {
        ...state,
        user: {
          ...state.user,
          userInfo,
          userName:
            (userInfo &&
              userInfo.data &&
              userInfo.data[0] &&
              userInfo.data[0].current_user &&
              userInfo.data[0].current_user.name) ||
            (userInfo && userInfo.name) ||
            (userInfo &&
              userInfo.data &&
              userInfo.data[0] &&
              userInfo.data[0].creator &&
              userInfo.data[0].creator.name) ||
            'Username',
        },
      };
    }
    case 'setCurrentUserInfo': {
      const response = action.payload.currentUserInfo;
      localStorage.setItem('current_user_info', JSON.stringify(response));
      // JSBridge.currentUserData();
      const { id, name, permissions, email, role, entity_id, modules } =
        response;
      // JSBridge.sessionInfo();
      return {
        ...state,
        currentUserInfo: {
          id,
          name,
          mobileNumber: response.mobile_number,
          email,
          permissions,
          securityQuestion: response.security_question,
          transactionPasswordEnabled: response.transaction_password_enabled,
          transactionPasswordExpireDate:
            response.transaction_password_expires_on,
          role,
          freshchatId: response.freshchat_id,
          membershipId: response.membership_id,
          entity_id,
          conversationId: response.conversation_id,
          conversationStatus: response.conversation_status,
          sourceDocument: response.source_document,
          modules,
        },
      };
    }
    case 'setSessionToken': {
      const { activeToken, userName = null } = action.payload;
      localStorage.setItem('session_token', activeToken);
      return {
        ...state,
        user: {
          ...state.user,
          activeToken,
          userName,
        },
      };
    }
    case 'enableLoading': {
      const { loading } = action.payload;
      return {
        ...state,
        loading,
        loadingText: action.payload?.loadingText,
      };
    }
    case 'signIn': {
      const { userId, email, activeToken } = action.payload;

      return {
        ...state,
        hasLoginError: false,
        viewType: 'dashboard',
        user: {
          ...state.user,
          userId,
          email,
          activeToken,
        },
      };
    }
    case 'signUpSubmit': {
      const { userId, email, phoneNo } = action.payload;
      return {
        ...state,
        hasLoginError: false,
        viewType: 'vCode',
        user: {
          userId,
          email,
          phoneNo,
        },
      };
    }
    case 'addOrganization': {
      const { orgName, orgId, gstNo, shortName } = action.payload;
      return {
        ...state,
        organization: {
          ...state.organization,
          name: orgName,
          orgId, // setting 'orgId' since it's used in most places
          id: orgId, // TODO : We should decide either to use 'id' or 'orgId'
          gstNo,
          shortName,
        },
      };
    }
    case 'addGst': {
      const { gstNo } = action.payload;
      return {
        ...state,
        organization: {
          ...state.organization,
          gstNo,
        },
      };
    }
    case 'addOrgId': {
      const { orgId } = action.payload;
      return {
        ...state,
        organization: {
          ...state.organization,
          orgId,
        },
      };
    }

    case 'addOrgName': {
      const { orgName, shortName } = action.payload;
      return {
        ...state,
        organization: {
          ...state.organization,
          name: orgName,
          shortName,
        },
      };
    }

    case 'editrole': {
      return {
        ...state,
        editRole: action.payload,
      };
    }

    case 'selectedorganization': {
      return {
        ...state,
        selectedOrg: action.payload,
      };
    }

    case 'setActiveInvoiceId': {
      const { activeInvoiceId, activeInvoiceSubject = 'invoices' } =
        action.payload;
      return {
        ...state,
        organization: {
          ...state.organization,
          activeInvoiceId,
          activeInvoiceSubject,
        },
      };
    }

    case 'signUp':
      return {
        ...state,
        user: null,
        viewType: action.type,
      };

    case 'logout':
      return {
        ...state,
        user: null,
        viewType: 'signIn',
        subView: '',
      };

    case 'openSnackBar': {
      const { message, type } = action.payload;

      return {
        ...state,
        snackBar: {
          message,
          type,
          open: true,
        },
      };
    }

    case 'closeSnackBar': {
      return {
        ...state,
        snackBar: {},
      };
    }

    case 'toggleSidePanel': {
      return {
        ...state,
        openSidePanel: !state.openSidePanel,
      };
    }

    case 'closeSidePanel': {
      return {
        ...state,
        openSidePanel: false,
      };
    }

    case 'registerEventListeners': {
      const { registeredListeners } = state;
      const { name, method } = action.payload;

      if (!registeredListeners[name]) {
        document.addEventListener(name, method);
      }

      return {
        ...state,
        registeredListeners: {
          ...registeredListeners,
          [name]: method,
        },
      };
    }

    case 'deRegisterEventListener': {
      const { registeredListeners } = state;
      const { name, method } = action.payload;

      if (!registeredListeners[name]) {
        document.removeEventListener(name, method);
      }
      delete registeredListeners[name];
      return {
        ...state,
        registeredListeners: {
          ...registeredListeners,
        },
      };
    }

    case 'listNotifications': {
      const { notificationList } = action.payload;

      return {
        ...state,
        notificationList,
      };
    }

    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

export default AppReducer;
