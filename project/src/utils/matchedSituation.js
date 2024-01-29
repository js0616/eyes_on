const matchedSituation = (situation) => {
  switch (situation) {
    case '정상':
      return 'nor';
    case '경고':
      return 'cau';
    case '위험':
      return 'war';
    default:
      return '';
  }
};

export default matchedSituation;