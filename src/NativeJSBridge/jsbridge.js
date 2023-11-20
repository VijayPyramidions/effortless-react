class JSBridge {
  showToast = (msg) => {
    window.JSBridgePlugin.showToast(msg);
  };

  ocrByScan = (type) => {
    console.log('call to native - ocrByScan');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.ocrByScan.postMessage(type);
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.ocrByScan(type);
    }
  };

  ocrByBrowse = (type) => {
    console.log('call to native - ocrByBrowse');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.ocrByBrowse.postMessage(type);
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.ocrByBrowse(type);
    }
  };

  ocrByReposition = () => {
    console.log('call to native - ocrByReposition');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.ocrByReposition.postMessage('');
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.ocrByReposition();
    }
  };

  scanDocument = (type) => {
    console.log('call to native - scanDocument');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.scanDocument.postMessage(type);
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.scanDocument(type);
    }
  };

  browseDocument = (type) => {
    console.log('call to native - browseDocument');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.browseDocument.postMessage(type);
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.browseDocument(type);
    }
  };

  logoSacn = (type) => {
    console.log('call to native - logoSacn');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.logoSacn.postMessage(type);
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.logoSacn(type);
    }
  };

  browseLogo = () => {
    console.log('call to native - browseLogo');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.browseLogo.postMessage('');
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.browseLogo();
    }
  };

  browseSignature = (type) => {
    console.log('call to native - browseSignature');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.browseSignature.postMessage(type);
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.browseSignature(type);
    }
  };

  getContacts = () => {
    console.log('call to native - getContacts');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.getContacts.postMessage('');
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.getContacts();
    }
  };

  getContactsVendor = () => {
    console.log('call to native - getContactsVendor');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.getContactsVendor.postMessage('');
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.getContactsVendor();
    }
  };

  shareLink = (url, type) => {
    console.log('call to native - shareLink');
    if (window.getOS() === 'ios') {
      // Object.assign(url, { type });
      window.webkit.messageHandlers.shareLink.postMessage({ url, type });
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.shareLink(url.pdf, url.file_name, type);
    }
  };

  connectYodlee = (data, accountType) => {
    console.log('call to native - connectYodlee');
    if (window.getOS() === 'ios') {
      Object.assign(data, { accountType });
      window.webkit.messageHandlers.connectYodlee.postMessage(data);
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.connectYodlee(
        data.access_token,
        data.fast_link_config_name,
        data.fastlink_url,
        accountType,
      );
    }
  };

  connectPayU = (data) => {
    console.log('call to native - connectPayU');
    if (window.getOS() === 'ios') {
      // Object.assign(data, { payUsha });
      window.webkit.messageHandlers.connectPayU.postMessage(data);
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.connectPayU(data);
    }
  };

  callPhoneNumber = (data) => {
    console.log('call to native - callPhoneNumber');
    if (window.getOS() === 'ios') {
      // Object.assign(data, { payUsha });
      window.webkit.messageHandlers.callPhoneNumber.postMessage(data);
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.callPhoneNumber(data);
    }
  };

  // freshChat = () => {
  //   if (window.getOS() === 'ios') {
  //     window.webkit.messageHandlers.freshChat.postMessage('');
  //   } else if (window.getOS() === 'android') {
  //     window.JSBridgePlugin.freshChat();
  //   }
  // };

  scanQR = () => {
    console.log('call to native - scanQR');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.scanQR.postMessage('');
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.scanQR();
    }
  };

  exitApp = () => {
    console.log('call to native - exitApp');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.exitApp.postMessage('');
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.exitApp();
    }
  };

  launchStaging = () => {
    console.log('call to native - launchStaging');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.launchStaging.postMessage('');
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.launchStaging();
    }
  };

  logoutNative = () => {
    console.log('call to native - logoutNative');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.logoutNative.postMessage('');
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.logoutNative();
    }
  };

  sessionInfo = () => {
    console.log('call to native - sessionInfo');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.sessionInfo.postMessage(
        localStorage.getItem('session_token'),
      );
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.sessionInfo(localStorage.getItem('session_token'));
    }
  };

  currentUserData = () => {
    console.log('call to native - currentUserData');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.currentUserData.postMessage(
        localStorage.getItem('current_user_info'),
      );
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.currentUserData(
        localStorage.getItem('current_user_info'),
      );
    }
  };

  launchGoogleSignIN = () => {
    console.log('call to native - launchGoogleSignIN');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.launchGoogleSignIN.postMessage(
        'onRecieveGoogleAuthCode',
      );
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.launchGoogleSignIN('onRecieveGoogleAuthCode');
    } else {
      /* TODO: WEB Platform related stuff's done here */
    }
  };

  launchGoogleForGmailConnect = () => {
    console.log('call to native - launchGoogleForGmailConnect');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.launchGoogleForGmailConnect.postMessage(
        'onRecieveGoogleGmailConnectCode',
      );
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.launchGoogleForGmailConnect(
        'onRecieveGoogleGmailConnectCode',
      );
    } else {
      /* TODO: WEB Platform related stuff's done here */
    }
  };

  launchAppleSignIN = () => {
    console.log('call to native - launchAppleSignIN');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.launchAppleSignIN.postMessage(
        'onRecieveAppleAuthCode',
      );
    } else {
      /* TODO: WEB Platform related stuff's done here */
    }
  };

  downloadLink = (url) => {
    console.log('call to native - downloadLink');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.downloadLink.postMessage(url);
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.downloadLink(url);
    } else {
      /* TODO: WEB Platform related stuff's done here */
    }
  };

  downloadWithAuthentication = (url) => {
    console.log('call to native - downloadWithAuthentication');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.downloadWithAuthentication.postMessage(url);
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.downloadWithAuthentication(
        url,
        localStorage.getItem('session_token'),
      );
    } else {
      /* TODO: WEB Platform related stuff's done here */
    }
  };

  downloadBase64 = (base64, contentType, fileName) => {
    console.log('call to native - downloadBase64');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.downloadBase64.postMessage({
        base64,
        contentType,
        fileName,
      });
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.downloadBase64(base64, contentType, fileName);
    }
  };

  userAuthenticationforPayments = () => {
    console.log('call to native - userAuthenticationforPayments');
    if (window.getOS() === 'ios') {
      window.webkit.messageHandlers.userAuthenticationforPayments.postMessage(
        '',
      );
    } else if (window.getOS() === 'android') {
      window.JSBridgePlugin.userAuthenticationforPayments();
    } else {
      /* TODO: WEB Platform related stuff's done here */
    }
  };

  sendGetRequest = (urlPath) => {
    window.JSBridgePlugin.sendGetRequest(urlPath, 'getRequestResponse');
  };

  sendPostRequest = (urlPath, dL) => {
    window.JSBridgePlugin.sendPostRequest(urlPath, dL, 'PostRequestResponse');
  };

  showDialog = (msg) => {
    window.JSBridgePlugin.showDialog(msg);
  };

  withCallback = (msg) => {
    window.JSBridgePlugin.withCallback(msg, 'JSPluginCallbackHandler.readData');
  };

  getBasePath = () => {
    return 'effortless_url';
  };
}

window.onRecieveUserAuthentication = function onRecieveUserAuthentication(
  data,
) {
  console.log('Received call from native - onRecieveUserAuthentication');
  const userAuthenticationEvent = new window.CustomEvent('userAuthorize', {
    detail: {
      value: typeof data === 'string' ? data : JSON.stringify(data),
    },
  });
  document.dispatchEvent(userAuthenticationEvent);
};

window.onRecieveGoogleAuthCode = function OnRecieveGoogleAuthCode(data) {
  console.log('Received call from native - onRecieveGoogleAuthCode');
  const autoLoginEvent = new window.CustomEvent('autoLogin', {
    detail: {
      code: data,
      provider: 'google',
    },
  });
  document.dispatchEvent(autoLoginEvent);
};

window.onPushNotification = function onPushNotification(data) {
  console.log('Received call from native - onPushNotification', data);
};

window.onRecieveGoogleGmailConnectCode =
  function onRecieveGoogleGmailConnectCode(data) {
    console.log('Received call from native - onRecieveGoogleGmailConnectCode');
    const gmailConnectEvent = new window.CustomEvent('gmailConnect', {
      detail: {
        code: data,
        provider: 'google',
      },
    });
    document.dispatchEvent(gmailConnectEvent);
  };

window.onRecieveAppleAuthCode = function onRecieveAppleAuthCode(data) {
  console.log('Received call from native - onRecieveAppleAuthCode');
  const autoLoginEvent = new window.CustomEvent('autoLogin', {
    detail: {
      code: JSON.parse(data).code,
      provider: 'apple',
    },
  });
  document.dispatchEvent(autoLoginEvent);
};

window.onRecieveOCRdetails = function onRecieveOCRdetails(data) {
  console.log('Received call from native - onRecieveOCRdetails', data);
  if (JSON.parse(data).eventType === 'ocrDetails') {
    const ocrEventocrDetails = new window.CustomEvent('ocrDetails', {
      detail: {
        value: data,
      },
    });
    document.dispatchEvent(ocrEventocrDetails);
  }
  if (JSON.parse(data).eventType === 'reimbursementOcr') {
    const ocrEventreimbursementOcr = new window.CustomEvent(
      'reimbursementOcr',
      {
        detail: {
          value: data,
        },
      },
    );
    document.dispatchEvent(ocrEventreimbursementOcr);
  }
  if (JSON.parse(data).eventType === 'BillboxOcr') {
    const ocrEventBillboxOcr = new window.CustomEvent('BillboxOcr', {
      detail: {
        value: data,
      },
    });
    document.dispatchEvent(ocrEventBillboxOcr);
  }
};

window.onRecieveDocDetails = function onRecieveDocDetails(data) {
  console.log('Received call from native - onRecieveDocDetails');
  const docDetailsEvent = new window.CustomEvent('docDetails', {
    detail: {
      value: data,
    },
  });
  document.dispatchEvent(docDetailsEvent);
};

window.onLogoDetails = function onLogoDetails(data) {
  console.log('Received call from native - onLogoDetails');
  const logoDetailEvent = new window.CustomEvent('logoDetails', {
    detail: {
      value: typeof data === 'string' ? data : JSON.stringify(data),
    },
  });
  document.dispatchEvent(logoDetailEvent);
};

window.onReceiveSignature = function onReceiveSignature(data) {
  console.log('Received call from native - onReceiveSignature');
  const signatureDetailsEvent = new window.CustomEvent('signatureDetails', {
    detail: {
      value: typeof data === 'string' ? data : JSON.stringify(data),
    },
  });
  document.dispatchEvent(signatureDetailsEvent);
};

window.onRecieveContacts = function onRecieveContacts(data) {
  console.log('Received call from native - onRecieveContacts');
  const contactDetailsEvent = new window.CustomEvent('contactDetailsData', {
    detail: {
      value: typeof data === 'string' ? data : JSON.stringify(data),
    },
  });
  document.dispatchEvent(contactDetailsEvent);
};

window.onRecieveContactsVendor = function onRecieveContactsVendor(data) {
  console.log('Received call from native - onRecieveContactsVendor');
  const contactDetailsEvent = new window.CustomEvent(
    'contactDetailsDataVendor',
    {
      detail: {
        value: typeof data === 'string' ? data : JSON.stringify(data),
      },
    },
  );
  document.dispatchEvent(contactDetailsEvent);
};

window.onRecieveBankData = function onRecieveBankData(data) {
  console.log('Received call from native - onRecieveBankData');
  const bankData = new window.CustomEvent('bankData', {
    detail: {
      value: typeof data === 'string' ? data : JSON.stringify(data),
    },
  });
  document.dispatchEvent(bankData);
};

window.onRecievePayU = function onRecievePayU(data) {
  console.log('Received call from native - onRecievePayU');
  const payUData = new window.CustomEvent('payUData', {
    detail: {
      value: typeof data === 'string' ? data : JSON.stringify(data),
    },
  });
  document.dispatchEvent(payUData);
};

window.onRecieveQRDetails = function onRecieveQRDetails(data) {
  console.log('Received call from native - onRecieveQRDetails');
  const qrEvent = new window.CustomEvent('qrDetails', {
    detail: {
      value: data,
    },
  });
  document.dispatchEvent(qrEvent);
};

window.onSwipeRight = function onSwipeRight() {
  console.log('Received call from native - onSwipeRight');
  const goBack = new window.CustomEvent('navigateBack', {});
  document.dispatchEvent(goBack);
};

window.onBackButtonPressed = function onBackButtonPressed() {
  console.log('Received call from native - onBackButtonPressed');
  const goBack = new window.CustomEvent('navigateBack', {});
  document.dispatchEvent(goBack);
};

window.onSwipeLeft = function onSwipeLeft() {
  console.log('Received call from native - onSwipeLeft');
  const goBack = new window.CustomEvent('navigateBack', {});
  document.dispatchEvent(goBack);
};

window.setConfig = function setConfig(data) {
  localStorage.setItem('app_config', data);
};

window.getUserInfo = function getUserInfo() {
  return localStorage.getItem('session_token');
};

export default new JSBridge();

/**
window.getRequestResponse = function GetRequestResponse(data) { };

window.postRequestResponse = function PostRequestResponse(data) { };

window.jsPluginCallbackHandler = function JSPluginCallbackHandler(data) { };

 */
