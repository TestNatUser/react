const ErrorButton = () => {
  const throwError = () => {
    throw new Error('Something went wrong!');
  };

  return (
    <button onClick={throwError} className="error-btn">
      Error button
    </button>
  );
};

export default ErrorButton;
