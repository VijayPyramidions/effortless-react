import React, { useContext } from 'react';
// import * as Mui from '@mui/material';
import JSBridge from '@nativeBridge/jsbridge';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import moment from 'moment';
import DownloadIcon from '@mui/icons-material/Download';
import AgeingChart from '@components/Charts/AgeingChart';
import CollectionDSOChart from '@components/Charts/CollectionDSOChart';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import * as css from '../Dashboard/Dashboard.scss';
import PopperComp from '../../../components/Popper/PopperComp';

const Reports = ({ id, date }) => {
  const { organization, user, enableLoading } = useContext(AppContext);
  const [value, setValue] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [chartRef, setChartRef] = React.useState({
    dpo: null,
    ageing: null,
  });

  const ageingLables = [
    'Not due',
    '1 to 30',
    '31 to 60',
    '61 to 120',
    'Above 360',
    'Advance',
  ];

  const barValue = {
    // labels: value?.total_payables?.map((val) => val?.age_bucket) || [],
    // data: value?.total_payables?.map((val) => val?.payable),
    labels: ageingLables,
    data:
      ageingLables.map(
        (data) =>
          value?.total_payables?.find((val) => val?.age_bucket === data)
            ?.payable || 0,
      ) || [],
  };
  const DPOLine = {
    labels: (value?.dpo_trend && Object?.keys(value?.dpo_trend)) || [],
    datasets: [
      {
        // label: "First dataset",
        data: (value?.dpo_trend && Object?.values(value?.dpo_trend)) || [],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        lineTension: 0.5,
      },
    ],
  };
  const device = localStorage.getItem('device_detect');

  const downloadChartAsPng = () => {
    enableLoading(true);
    setAnchorEl(null);
    const zip = new JSZip();
    const promises = [];

    ['Payables_Ageing', 'Payables_DPO'].forEach((div) => {
      const element = document.getElementById(div);
      const promise = html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        zip.file(`${div}.png`, imgData.substr(imgData.indexOf(',') + 1), {
          base64: true,
        });
      });
      promises.push(promise);
    });

    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }

    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        if (device === 'desktop') {
          enableLoading(false);
          saveAs(content, 'Payables.zip');
        } else {
          enableLoading(false);
          getBase64(content).then((data) =>
            JSBridge.downloadBase64(data, 'application/zip', 'Payables.zip'),
          );
        }
      });
    });
  };

  const downloadChartAsPdf = () => {
    enableLoading(true);
    setAnchorEl(null);
    // create a new jsPDF instance
    // eslint-disable-next-line new-cap
    const doc = new jsPDF();

    // get the chart canvas elements
    const chart1Canvas = chartRef?.dpo.current.canvas;
    const chart2Canvas = chartRef?.ageing.current.canvas;

    // create new Image objects from the chart canvases
    const chart1Image = chart1Canvas.toDataURL('image/png', 1.0);
    const chart2Image = chart2Canvas.toDataURL('image/png', 1.0);

    // add the chart images to the PDF document
    doc.addImage(chart1Image, 'PNG', 10, 10, 140, 75);
    doc.addImage(chart2Image, 'PNG', 10, 100, 90, 75);

    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }

    // function blobToFile(theBlob, fileName){
    //   theBlob.lastModifiedDate = new Date();
    //   theBlob.name = fileName;
    //   return theBlob;
    // }

    // save the PDF document
    if (device === 'desktop') {
      enableLoading(false);
      doc.save('payables-chart.pdf');
    } else {
      enableLoading(false);
      const blobPDF =  new Blob([ doc.output('blob') ], { type : 'application/pdf'});
      // eslint-disable-next-line no-undef
      const pdfFile = new File([blobPDF], "Payables-chart.pdf", {lastModified: new Date()});
      // const pdfFile = blobToFile(blobPDF,'Receivables-chart.pdf');
      // saveAs(pdfFile,'Receivables-chart.pdf');
      getBase64(pdfFile).then((data) =>
        JSBridge.downloadBase64(data, 'application/pdf', 'Payables-chart.pdf'),
      );
    }
  };

  const downloadChartAsXlsx = () => {
    enableLoading(true);
    setAnchorEl(null);
    if (device === 'mobile') {
      JSBridge.downloadWithAuthentication(
        `${BASE_URL}/organizations/${organization.orgId}/payables/dashboard/${id}.xlsx?date=${moment().format('YYYY-MM-DD')}`,
      );
    } else {
      enableLoading(true);
      fetch(`${BASE_URL}/organizations/${organization.orgId}/payables/dashboard/${id}.xlsx?date=${moment().format('YYYY-MM-DD')}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
        },
      )
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'payables-chart.xlsx';
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
      enableLoading(false);
    }
  };

  React.useEffect(() => {
    RestApi(
      `organizations/${
        organization.orgId
      }/payables/dashboard/${id}?date=${moment(date).format('YYYY-MM-DD')}`,
      {
        method: METHOD.GET,
        headers: {
          authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      setValue(res);
    });
  }, [id]);

  return (
    <div style={{ width: '100%', marginBottom: 5 }}>
      <div
        className={css.newDownloadReport}
        style={{
          width: device === 'mobile' ? '88%' : '98%',
          margin: device === 'mobile' ? '16px 6% 0' : '0 0 10px 0',
        }}
      >
        <div
          className={css.innerDiv}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <DownloadIcon sx={{ color: '#fff' }} />
          <p className={css.innerP}>Download Reports</p>
        </div>
      </div>
      <div
        className={
          device === 'mobile' ? css.SecondContNewChartPaya : css.mainPaya
        }
      >
        <div className={css.firstRow}>
          <div
            className={css.card1}
            style={{ marginTop: device === 'mobile' ? '15px' : 0, paddingTop: '1rem', height: device === 'desktop' && '415px' }}
            id="Payables_DPO"
          >

            <CollectionDSOChart
              dataLine={DPOLine}
              heightProps={device === 'mobile' ? '270px' : '360px'}
              setChartRef={(ref) =>
                setChartRef((prev) => ({ ...prev, dpo: ref }))
              }
              title="DPO Trend"
            />
          </div>

          <div className={css.card2} id="Payables_Ageing">
            <AgeingChart
              labels={barValue?.labels}
              data={barValue?.data}
              heightProps={device === 'mobile' ? 320 : 350}
              setChartRef={(ref) =>
                setChartRef((prev) => ({ ...prev, ageing: ref }))
              }
              title="Ageing"
            />
          </div>
        </div>
      </div>
      <PopperComp
        openProps={Boolean(anchorEl)}
        anchorElProps={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        popperStyle={{
          maxHeight: '50vh',
          width: device === 'mobile' ? '52vw' : '12.5rem',
          background: '#fff',
          borderRadius: '8px',
          marginTop: '10px',
        }}
      >
        <div>
          {['PNG', 'PDF', 'XLSX'].map((val) => (
            <div>
              <div
                className={css.innerDivPopper}
                onClick={() => {
                  if (val === 'PNG') {
                    // ['Payables_Ageing', 'Payables_DPO'].map((chart) =>
                    //   downloadChartAsPng(chart, `${chart}.png`),
                    // );
                    downloadChartAsPng();
                  } else if (val === 'PDF') {
                    downloadChartAsPdf();
                  } else if (val === 'XLSX') {
                    downloadChartAsXlsx();
                  }
                }}
              >
                <DownloadIcon />
                <p className={css.innerP}>Download {val}</p>
              </div>
            </div>
          ))}
        </div>
      </PopperComp>
    </div>
  );
};

export default Reports;
