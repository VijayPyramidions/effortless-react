import { useEffect } from 'react';

const CapturePayment = () => {
  useEffect(() => {
    const url = 'http://localhost:8080/capture-payment';

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json.slip.advice);
      } catch (error) {
        console.log('error', error);
      }
    };

    fetchData();
  }, []);
};
export default CapturePayment;
