const NumberFormat = ({value}) => {
  const formattedValue = Number(value).toLocaleString('en-IN');
  return formattedValue;
};

export default NumberFormat;
