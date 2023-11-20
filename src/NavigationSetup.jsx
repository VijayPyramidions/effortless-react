/* @flow */
/**
 * @fileoverview App Actions
 */

import SignInContainer from '@core/LoginContainer/SignInContainer.jsx';
import SignUpContainer from '@core/LoginContainer/SignUpContainer.jsx';
import VerificationCodeContainer from '@core/LoginContainer/VerificationCodeContainer.jsx';
import FillOrgDetailsContainer from '@core/LoginContainer/FillOrgDetailsContainer.jsx';
import ForgetPasswordContainer from '@core/LoginContainer/ForgotPasswordContainer.jsx';
import DashboardViewContainer from '@core/DashboardView/DashboardViewContainer.jsx';

const NavigationSetup = [
  {
    id: 'signIn',
    view: SignInContainer,
  },
  {
    id: 'signUp',
    view: SignUpContainer,
  },
  {
    id: 'vCode',
    view: VerificationCodeContainer,
  },
  {
    id: 'fillOrgDetails',
    view: FillOrgDetailsContainer,
  },
  {
    id: 'forgetPassword',
    view: ForgetPasswordContainer,
  },

  {
    id: 'dashboard',
    view: DashboardViewContainer,
  },
];

export default NavigationSetup;
