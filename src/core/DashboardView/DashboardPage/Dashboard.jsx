import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as Mui from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Input } from '@material-ui/core';
import LeftArrowCircleIcon from '@assets/LeftArrowCircleIcon.svg';
import AppContext from '@root/AppContext.jsx';
import PriceIcon from '@assets/PriceIcon.svg';
import WindowsIcon from '@assets/WindowsIcon.svg';
import InvoiceIcon from '@assets/InvoiceIcon.svg';
import ChartsPage from './charts/chartsPage';
import ChartsMain from './charts/chartsMain';

const useStyles = makeStyles(() => ({
  stackMain: {
    margin: '1rem',
  },
  stack1: {
    alignItems: 'center',
  },
  stackBody: {},
  text1: {},
  heading: {
    fontSize: '11px !important',
    textTransform: 'capitalize',
  },
  headingAmount: {
    fontSize: '25px !important',
    fontWeight: '700 !important',
  },
  cardAmount: {
    fontWeight: '600 !important',
  },
  subMenu: {
    letterSpacing: '0em !important',
    fontSize: '15px !important',
    fontWeight: '300 !important',
    color: '#273049C2',
    textTransform: 'capitalize',
    textAlign: 'left',
  },
  subMenuRadio: {
    letterSpacing: '0em !important',
    fontSize: '10px !important',
    fontWeight: '300 !important',
    color: '#273049C2',
    textTransform: 'capitalize',
    textAlign: 'left',
  },
  subMenuIcons: {
    fontSize: '12px !important',
    fontWeight: '300 !important',
    color: '#273049C2',
    textTransform: 'capitalize',
  },
  subMenu1: {
    fontSize: '15px !important',
    fontWeight: '500 !important',
    textAlign: 'right',
  },
  submenuStack: {
    margin: '1rem',
  },
  submenuStack1: {
    justifyContent: 'space-between',
  },
  debtStack: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    textAlign: 'center',
    width: '100%',

    borderRadius: '1rem !important',
    boxShadow:
      ' 0px 4px 34px rgba(114, 92, 193, 0.09), 0px -7px 23px rgba(0, 0, 0, 0.02) !important',
  },
  card1: {
    textAlign: 'center',
    padding: '1rem',
    height: '100%',
    borderRadius: '1rem !important',
    boxShadow:
      ' 0px 4px 34px rgba(114, 92, 193, 0.09), 0px -7px 23px rgba(0, 0, 0, 0.02) !important',
  },
  viewMore: {
    fontSize: '11px !important',
    color: '#00A676 !important',
    fontWeight: '600 !important',
  },
  btntext: {
    fontSize: '10px !important',
    fontWeight: '400 !important',
    color: '#283049CC !important',
    '&:hover': {
      fontSize: '11px !important',
      fontWeight: '800 !important',
      color: '#283049 !important',
    },
  },
  Button1: {
    backgroundColor: 'white !important',
    border: ' #D6D6D6 0.7px solid !important',

    borderRadius: '8px',
    '&:hover': {
      backgroundColor: '#EFEFED !important',
    },
  },
  styledCard1: {
    backgroundColor: '#eb7d1c !important',
    borderRadius: '16px !important',
    position: 'relative',
    boxShadow:
      ' 0px 4px 34px rgba(114, 92, 193, 0.09), 0px -7px 23px rgba(0, 0, 0, 0.02) !important',
  },
  styledCardDummy: {
    backgroundColor: '#faac66 !important',
    borderRadius: '16px !important',
    position: 'relative',
    width: '91%  !important',
    height: '32px  !important',
    left: '12px  !important',
    top: '35px  !important',
  },
  styledCard2: {
    backgroundColor: '#2F9682 !important',
    borderRadius: '16px !important',
    position: 'relative',
    boxShadow:
      ' 0px 4px 34px rgba(114, 92, 193, 0.09), 0px -7px 23px rgba(0, 0, 0, 0.02) !important',
  },
  styledCardDummy1: {
    backgroundColor: '#71d1be !important',
    borderRadius: '16px !important',
    position: 'relative',
    width: '91%  !important',
    height: '32px  !important',
    left: '12px  !important',
    top: '35px  !important',
  },
  cardUptext1: {
    fontSize: '17px',
    position: 'relative',
    top: '30px',
  },
  styledCardText1: {
    fontWeight: '500 !important',
    fontSize: '20px !important',
    color: 'white',
  },
  styledCardText2: {
    fontWeight: '300 !important',
    fontSize: '11px !important',
    color: 'white',
    textTransform: 'capitalize !important',
  },
  styledCardText3: {
    fontWeight: '200 !important',
    fontSize: '13px !important',
    color: 'white',
  },
  styledCardText4: {
    fontWeight: '400 !important',
    fontSize: '13px !important',
    color: 'white',
  },
  styledCardText5: {
    fontWeight: '300 !important',
    fontSize: '11px !important',
    color: 'white',
  },
  styledCardText6: {
    fontWeight: '400 !important',
    fontSize: '18px !important',
    color: 'white',
  },
  styledCardTextfield: {
    backgroundColor: 'white !important',
    height: '28px !important',
    width: '134px !important',
    borderRadius: '5.76px !important',
  },
  iconStack: {
    alignItems: 'center',
    textAlign: 'center',
  },
  percentage: {
    color: 'red',
    fontSize: '12px !important',
    textTransform: 'capitalize  !important',
  },
  percentageIcon: {
    color: 'red',
    width: '15px !important',
  },
  percentageIconGreen: {
    color: '#149D52',
    width: '15px !important',
  },
  percentageGreen: {
    color: '#149D52',
    fontSize: '12px !important',
  },
  percentageText: {
    color: '#cdced1',
    fontSize: '12px !important',
    textTransform: 'capitalize  !important',
  },
  section3Text: {
    fontSize: '13px !important',
    fontWeight: '400 !important',
    textTransform: 'capitalize  !important',
  },
  section3Text1: {
    fontSize: '18px !important',
    fontWeight: '600 !important',
    textTransform: 'capitalize  !important',
  },
  section3btn: {
    background: ' #FFFFFF !important',
    border: '0.7px solid #F08B32 !important',
    borderRadius: '16px !important',
  },
  section3btnText: {
    fontWeight: 400,
    fontSize: '10px !important',
    color: '#F08B32 !important',
    textTransform: 'capitalize  !important',
  },
  section3Stack: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
const Dashboard = () => {
  const classes = useStyles();
  const [toggleState, setToggleState] = React.useState(false);
  const [choice, setChoice] = React.useState('number');
  const handleRadio = (e) => {
    setChoice(e.target.value);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setToggleState(open);
  };
  const { changeSubView } = React.useContext(AppContext);

  return (
    <>
      <Mui.Grid container className={classes.stackHead}>
        <Mui.Grid item xs={12} style={{ backgroundColor: 'white' }}>
          <Mui.Stack className={classes.stackMain}>
            <Mui.Stack className={classes.stack1}>
              <Mui.Grid container>
                <Mui.Grid item xs={12}>
                  <Mui.Stack spacing={2} className={classes.stackBody}>
                    <Mui.Typography className={classes.text1}>
                      Hy,jayakumar
                    </Mui.Typography>
                    <Mui.Stack direction="column">
                      <Mui.Stack>
                        <ChartsMain />
                      </Mui.Stack>
                      <Mui.Stack mt="5rem">
                        <Mui.Typography className={classes.text1}>
                          Initiate Action
                        </Mui.Typography>
                        <Mui.Stack
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                        >
                          <Mui.Stack
                            className={classes.iconStack}
                            onClick={() => {
                              changeSubView('invoiceView');
                            }}
                          >
                            <img src={InvoiceIcon} alt="InvoiceIcon" />
                            <Mui.Typography className={classes.subMenuIcons}>
                              create invoice
                            </Mui.Typography>
                          </Mui.Stack>
                          <Mui.Stack
                            className={classes.iconStack}
                            onClick={() => {
                              changeSubView('receivables-ageing-view');
                            }}
                          >
                            <img src={PriceIcon} alt="PriceIcon" />
                            <Mui.Typography className={classes.subMenuIcons}>
                              pay a vendor
                            </Mui.Typography>
                          </Mui.Stack>
                          <Mui.Stack
                            className={classes.iconStack}
                            onClick={() => {
                              changeSubView('billbookView');
                            }}
                          >
                            <img src={WindowsIcon} alt="WindowsIcon" />
                            <Mui.Typography className={classes.subMenuIcons}>
                              record an expense
                            </Mui.Typography>
                          </Mui.Stack>
                        </Mui.Stack>
                      </Mui.Stack>
                    </Mui.Stack>
                    {/* //section3 */}
                    <Mui.Stack justifyContent="center">
                      <Mui.Card className={classes.card1}>
                        <Mui.Stack direction="column" spacing={1}>
                          <Mui.Stack
                            className={classes.section3Stack}
                            direction="row"
                          >
                            <Mui.Stack textAlign="left">
                              <Mui.Typography className={classes.section3Text}>
                                Overdue Payables
                              </Mui.Typography>
                              <Mui.Typography className={classes.section3Text1}>
                                Rs. 3.5 Lakhs
                              </Mui.Typography>
                            </Mui.Stack>
                            <Mui.Stack>
                              <Mui.Button className={classes.section3btn}>
                                <Mui.Typography
                                  className={classes.section3btnText}
                                >
                                  play now
                                </Mui.Typography>
                              </Mui.Button>
                            </Mui.Stack>
                          </Mui.Stack>
                          <Mui.Divider />
                          <Mui.Stack>
                            <Mui.Stack
                              className={classes.section3Stack}
                              direction="row"
                            >
                              <Mui.Stack textAlign="left">
                                <Mui.Typography
                                  className={classes.section3Text}
                                >
                                  Payables
                                </Mui.Typography>
                                <Mui.Typography
                                  className={classes.section3Text1}
                                >
                                  Rs. 3.5 Lakhs
                                </Mui.Typography>
                              </Mui.Stack>
                              <Mui.Stack>
                                <Mui.Button className={classes.section3btn}>
                                  <Mui.Typography
                                    className={classes.section3btnText}
                                  >
                                    play now
                                  </Mui.Typography>
                                </Mui.Button>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>
                        </Mui.Stack>
                      </Mui.Card>
                    </Mui.Stack>
                    {/* //section4 */}

                    <Mui.Card className={classes.card}>
                      <Mui.Stack className={classes.submenuStack} spacing={2}>
                        <Mui.Stack
                          direction="row"
                          className={classes.submenuStack1}
                        >
                          <Mui.Typography className={classes.text1}>
                            Recievables
                          </Mui.Typography>
                          <Mui.Link className={classes.viewMore}>
                            view more
                          </Mui.Link>
                        </Mui.Stack>
                        <Mui.Stack
                          direction="row"
                          className={classes.submenuStack1}
                        >
                          <Mui.Typography className={classes.subMenu}>
                            Collection Progress
                          </Mui.Typography>
                          <Mui.Typography className={classes.subMenu1}>
                            34%
                          </Mui.Typography>
                        </Mui.Stack>
                        <Mui.Stack
                          direction="row"
                          className={classes.submenuStack1}
                        >
                          <Mui.Typography className={classes.subMenu}>
                            Total Due as of today
                          </Mui.Typography>
                          <Mui.Typography className={classes.subMenu1}>
                            RS 4.5 Lakh
                          </Mui.Typography>
                        </Mui.Stack>
                      </Mui.Stack>
                    </Mui.Card>

                    {/* //section5 */}
                    <Mui.Stack justifyContent="center">
                      <Mui.Card className={classes.card1}>
                        <Mui.Stack direction="column" spacing={1}>
                          <Mui.Stack
                            className={classes.section3Stack}
                            direction="row"
                          >
                            <Mui.Stack textAlign="left">
                              <Mui.Typography className={classes.section3Text}>
                                Overdue Receivables
                              </Mui.Typography>
                              <Mui.Typography className={classes.section3Text1}>
                                Rs. 3.5 Lakhs
                              </Mui.Typography>
                            </Mui.Stack>
                            <Mui.Stack>
                              <Mui.Button className={classes.section3btn}>
                                <Mui.Typography
                                  className={classes.section3btnText}
                                >
                                  follow up
                                </Mui.Typography>
                              </Mui.Button>
                            </Mui.Stack>
                          </Mui.Stack>
                          <Mui.Divider />
                          <Mui.Stack>
                            <Mui.Stack
                              className={classes.section3Stack}
                              direction="row"
                            >
                              <Mui.Stack textAlign="left">
                                <Mui.Typography
                                  className={classes.section3Text}
                                >
                                  Overdue Receivables
                                </Mui.Typography>
                                <Mui.Typography
                                  className={classes.section3Text1}
                                >
                                  Rs. 3.5 Lakhs
                                </Mui.Typography>
                                <Mui.Typography className={classes.percentage}>
                                  *due in 5 days
                                </Mui.Typography>
                              </Mui.Stack>
                              <Mui.Stack>
                                <Mui.Button className={classes.section3btn}>
                                  <Mui.Typography
                                    className={classes.section3btnText}
                                  >
                                    get funding
                                  </Mui.Typography>
                                </Mui.Button>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>
                        </Mui.Stack>
                      </Mui.Card>
                    </Mui.Stack>

                    {/* //Section5 */}
                    <Mui.Card className={classes.card}>
                      <Mui.Stack className={classes.submenuStack} spacing={2}>
                        <Mui.Stack
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Mui.Typography className={classes.text1}>
                            Revenue
                          </Mui.Typography>
                          <Mui.Button onClick={toggleDrawer(true)}>
                            <Mui.Typography className={classes.heading}>
                              View as
                            </Mui.Typography>
                          </Mui.Button>
                          <Mui.Drawer
                            anchor="bottom"
                            open={toggleState}
                            onClose={toggleDrawer(false)}
                            PaperProps={{
                              elevation: 0,
                              style: {
                                backgroundColor: 'white',
                                borderTopLeftRadius: 18,
                                borderTopRightRadius: 18,
                              },
                            }}
                          >
                            <Mui.Stack spacing="3">
                              <Mui.Stack direction="row" alignItems="center">
                                <Mui.Radio
                                  checked={choice === 'number'}
                                  onChange={handleRadio}
                                  value="number"
                                  style={{ color: '#F08B32' }}
                                />
                                <Mui.Typography>Number</Mui.Typography>
                              </Mui.Stack>
                              <Mui.Stack direction="row" alignItems="center">
                                <Mui.Radio
                                  checked={choice === 'chart'}
                                  value="chart"
                                  onChange={handleRadio}
                                  style={{ color: '#F08B32' }}
                                />
                                <Mui.Typography>Charts</Mui.Typography>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Drawer>
                        </Mui.Stack>
                        {choice === 'chart' ? (
                          <div>
                            <Mui.Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Mui.Button className={classes.Button1}>
                                <Mui.Typography className={classes.btntext}>
                                  last month
                                </Mui.Typography>
                              </Mui.Button>
                              <Mui.Button className={classes.Button1}>
                                <Mui.Typography className={classes.btntext}>
                                  last 6 month
                                </Mui.Typography>
                              </Mui.Button>
                              <Mui.Button className={classes.Button1}>
                                <Mui.Typography className={classes.btntext}>
                                  last year
                                </Mui.Typography>
                              </Mui.Button>
                            </Mui.Stack>
                            <Mui.Stack direction="row" alignItems="center">
                              <img
                                src={LeftArrowCircleIcon}
                                alt="LeftArrowIcon"
                              />

                              <Mui.Typography className={classes.btntext}>
                                Increase in revenue compared to last month by 5%
                              </Mui.Typography>
                            </Mui.Stack>
                            <Mui.Stack>
                              <ChartsPage />
                            </Mui.Stack>
                            <Mui.Stack
                              direction="row"
                              className={classes.submenuStack1}
                            >
                              <Mui.Typography className={classes.subMenu}>
                                Total Revenue
                              </Mui.Typography>
                              <Mui.Typography className={classes.subMenu1}>
                                Rs 2.5 Lakh
                              </Mui.Typography>
                            </Mui.Stack>
                            <Mui.Stack
                              direction="row"
                              justifyContent="flex-end"
                              alignItems="center"
                            >
                              <ArrowDownwardIcon
                                className={classes.percentageIcon}
                              />
                              <Mui.Typography className={classes.percentage}>
                                -12%
                              </Mui.Typography>
                            </Mui.Stack>
                          </div>
                        ) : (
                          <div>
                            <Mui.Stack
                              justifyContent="space-evenly"
                              direction="row"
                              alignItems="center"
                            >
                              <Mui.Stack
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <ArrowUpwardIcon
                                  className={classes.percentageIconGreen}
                                />
                                <Mui.Typography
                                  className={classes.percentageGreen}
                                >
                                  -12%
                                </Mui.Typography>
                              </Mui.Stack>
                              <Mui.Stack direction="column">
                                <Mui.Typography className={classes.subMenu}>
                                  Last Month
                                </Mui.Typography>
                                <Mui.Typography
                                  className={classes.percentageText}
                                >
                                  Comapred to last month
                                </Mui.Typography>
                              </Mui.Stack>

                              <Mui.Stack>
                                <Mui.Typography
                                  className={classes.section3Text}
                                >
                                  Rs 3.5 Lakh
                                </Mui.Typography>
                              </Mui.Stack>
                            </Mui.Stack>
                            <Mui.Stack
                              justifyContent="space-evenly"
                              direction="row"
                              alignItems="center"
                            >
                              <Mui.Stack
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                              >
                                <ArrowDownwardIcon
                                  className={classes.percentageIcon}
                                />
                                <Mui.Typography className={classes.percentage}>
                                  -12%
                                </Mui.Typography>
                              </Mui.Stack>
                              <Mui.Stack direction="column">
                                <Mui.Typography className={classes.subMenu}>
                                  Last Month
                                </Mui.Typography>
                                <Mui.Typography
                                  className={classes.percentageText}
                                >
                                  Comapred to last month
                                </Mui.Typography>
                              </Mui.Stack>

                              <Mui.Stack>
                                <Mui.Typography
                                  className={classes.section3Text}
                                >
                                  Rs 3.5 Lakh
                                </Mui.Typography>
                              </Mui.Stack>
                            </Mui.Stack>
                          </div>
                        )}
                      </Mui.Stack>
                    </Mui.Card>

                    {/* //section6 */}
                    <Mui.Typography className={classes.cardUptext1}>
                      Pending Unapproved Invoices
                    </Mui.Typography>
                    <Mui.Card className={classes.styledCardDummy}>
                      <div>&emsp;</div>
                    </Mui.Card>
                    <Mui.Card className={classes.styledCard1}>
                      <Mui.Stack className={classes.submenuStack}>
                        <Mui.Stack
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Mui.Typography className={classes.styledCardText1}>
                            xeno
                          </Mui.Typography>
                          <Mui.Typography className={classes.styledCardText2}>
                            date of creations
                          </Mui.Typography>
                        </Mui.Stack>
                        <Mui.Stack
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Mui.Typography className={classes.styledCardText3}>
                            CMNO-12-222-123
                          </Mui.Typography>
                          <Mui.Typography className={classes.styledCardText2}>
                            22 Nov 2021
                          </Mui.Typography>
                        </Mui.Stack>
                        <Mui.Stack
                          direction="row"
                          justifyContent="space-between"
                          mt={5}
                        >
                          <Mui.Stack>
                            <Mui.Typography className={classes.styledCardText4}>
                              To pay
                            </Mui.Typography>
                            <Input className={classes.styledCardTextfield} />
                          </Mui.Stack>
                          <hr />
                          <Mui.Stack
                            direction="row"
                            justifyContent="space-between"
                          >
                            <Mui.Stack alignItems="center">
                              <Mui.Typography
                                className={classes.styledCardText5}
                              >
                                prepared by
                              </Mui.Typography>
                              <Mui.Typography
                                className={classes.styledCardText6}
                              >
                                XYZ
                              </Mui.Typography>
                            </Mui.Stack>
                          </Mui.Stack>
                        </Mui.Stack>
                      </Mui.Stack>
                    </Mui.Card>

                    {/* section7 */}
                    <Mui.Typography className={classes.cardUptext1}>
                      Pending Payment Approval
                    </Mui.Typography>
                    <Mui.Card className={classes.styledCardDummy1}>
                      <div>&emsp;</div>
                    </Mui.Card>
                    <Mui.Card className={classes.styledCard2}>
                      <Mui.Stack className={classes.submenuStack}>
                        <Mui.Stack
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Mui.Typography className={classes.styledCardText1}>
                            XYZ Corp
                          </Mui.Typography>
                          <Mui.Typography className={classes.styledCardText2}>
                            Due Date
                          </Mui.Typography>
                        </Mui.Stack>
                        <Mui.Stack
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Mui.Typography className={classes.styledCardText3}>
                            CMNO-12-222-123
                          </Mui.Typography>
                          <Mui.Typography className={classes.styledCardText2}>
                            30 Mar 2022
                          </Mui.Typography>
                        </Mui.Stack>
                        <Mui.Stack
                          direction="row"
                          justifyContent="space-between"
                          mt={5}
                        >
                          <Mui.Stack>
                            <Mui.Typography className={classes.styledCardText4}>
                              To pay
                            </Mui.Typography>
                            <Input className={classes.styledCardTextfield} />
                          </Mui.Stack>
                          <hr />
                          <Mui.Stack
                            direction="row"
                            justifyContent="space-between"
                          >
                            <Mui.Stack alignItems="center">
                              <Mui.Typography
                                className={classes.styledCardText5}
                              >
                                prepared by
                              </Mui.Typography>
                              <Mui.Typography
                                className={classes.styledCardText6}
                              >
                                Vignesh S.
                              </Mui.Typography>
                            </Mui.Stack>
                          </Mui.Stack>
                        </Mui.Stack>
                      </Mui.Stack>
                    </Mui.Card>

                    {/* sectionEnd */}
                  </Mui.Stack>
                </Mui.Grid>
              </Mui.Grid>
            </Mui.Stack>

            {/* //Stack end */}
          </Mui.Stack>
        </Mui.Grid>
      </Mui.Grid>
    </>
  );
};

export default Dashboard;
