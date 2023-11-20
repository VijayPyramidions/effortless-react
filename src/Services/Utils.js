export function toInr(input) {
  // console.log('🚀 ~ file: Utils.js ~ line 2 ~ toInr ~ input', input);
  let num = input;
  let n1;
  num = num ? `${num}` : '';
  // console.log('🚀 ~ file: Utils.js ~ line 6 ~ toInr ~ num', num);
  n1 = num.split('.');
  const n2 = n1[1] || null;
  n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, '$1,');
  const result = n2 ? `${n1}.${n2}` : n1;
  // console.log('🚀 ~ file: Utils.js ~ line 10 ~ toInr ~ result', result);
  return result;
}
