export const getDaysCount = (data) => {
  const allDaysValues = data.map((item) => item.number);
  const daysResults = allDaysValues.reduce((r, i) => {
    while (r.length <= i) r[r.length] = 0;
    r[i] += 1;
    return r;
  }, []);
  return daysResults;
};
