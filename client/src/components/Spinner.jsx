/* eslint-disable react/prop-types */
function Spinner({ size = 'medium' }) {
  const sizeClass = {
    small: 'spinner-sm',
    medium: 'spinner-md',
    large: 'spinner-lg',
  }[size];

  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClass}`}></div>
    </div>
  );
}

export default Spinner;
