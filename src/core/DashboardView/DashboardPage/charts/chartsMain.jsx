import React from 'react';
import * as Mui from '@mui/material';
import Chart2 from './chart2';
import Chart3 from './chart3';
import * as css from './style.scss';
import Chart4 from './chart4';
import Chart6 from './chart6';
import Chart1 from './chart1';
import SpendBandWidth from './SpendBandWidth';

const ChartsMain = () => {
  // const [loading, setLoading] = React.useState(false);

  const [arr, setArr] = React.useState([
    <SpendBandWidth />,
    <Chart1 />,
    <Chart2 />,
    <Chart3 />,
    <Chart4 />,
    <Chart6 />,
  ]);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);
  const [loading, setLoading] = React.useState('');
  const swapPositions = () => {
    setLoading('forward');
    setTimeout(() => {
      setLoading('');
      setArr((prev) => [...prev.slice(1), prev[0]]);
    }, 500);
  };
  const swapPositionsBack = () => {
    setLoading('backward');
    setTimeout(() => {
      setLoading('');
      setArr((prev) => [...prev.slice(-1), ...prev.slice(0, -1)]);
    }, 500);
  };
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 200) {
      // do your stuff here for left swipe
      swapPositionsBack();
    }
    if (touchStart - touchEnd < -200) {
      // do your stuff here for right swipe
      swapPositions();
    }
  };
  return (
    <Mui.Stack className={css.report}>
      <Mui.Stack
        className={css.div}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Mui.Paper className={loading ? css.div33 : css.div3} elevation={3}>
          <Mui.Stack>{arr[4]}</Mui.Stack>
        </Mui.Paper>
        <Mui.Paper className={css.div2} elevation={3}>
          <Mui.Stack>{arr[3]}</Mui.Stack>{' '}
        </Mui.Paper>
        <Mui.Paper className={css.div2} elevation={3}>
          <Mui.Stack>{arr[2]}</Mui.Stack>
        </Mui.Paper>
        <Mui.Paper className={css.div2} elevation={3}>
          <Mui.Stack>{arr[1]}</Mui.Stack>
        </Mui.Paper>
        <Mui.Paper className={loading ? css.div11 : css.div1} elevation={3}>
          <Mui.Stack
            style={{
              height: '100%',
              justifyContent: 'center',
              backgroundColor: 'white',
            }}
          >
            {arr[0]}
          </Mui.Stack>
        </Mui.Paper>
      </Mui.Stack>
    </Mui.Stack>
  );
};

export default ChartsMain;
