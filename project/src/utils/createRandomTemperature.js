const createRandomTemperature = (temperature, direction) => {
  const randomNum = parseFloat((parseFloat(Math.random() * 1) + 1 + 1).toFixed(1));

  if (direction === 1) {
    return (temperature + randomNum).toFixed(1);
  } else {
    return (temperature - randomNum).toFixed(1);
  }
};

export default createRandomTemperature;