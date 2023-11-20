import React from 'react';

// export const CheckSvg = (props) => {
//   return (
//     <svg
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       {...props}
//     >
//       <rect
//         x="0.5"
//         y="0.5"
//         width="23"
//         height="23"
//         fill="white"
//         stroke="#9B9B9B"
//       />
//     </svg>
//   );
// };

// export const CheckedSvg = (props) => {
//   return (
//     <svg
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       style={{ border: '1px solid rgba(155, 155, 155, 1)' }}
//       {...props}
//     >
//       <path d="M4 13L9 18L20 7" stroke="black" strokeLinecap="round" />
//     </svg>
//   );
// };

export const CheckSvg = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="23"
        fill="white"
        stroke="#F08B32"
      />
    </svg>
  );
};

export const CheckedSvg = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ border: '1px solid rgba(240, 139, 50, 1)' }}
      {...props}
    >
      <path d="M4 13L9 18L20 7" stroke="#F08B32" strokeLinecap="round" />
    </svg>
  );
};
