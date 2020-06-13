import React, { useState, useEffect } from "react";
import css from "./App.module.css";
import axios from "axios";
import { format } from "date-fns";
import { daysOfWeek } from "../costants";
import { getDaysCount } from "../helpers";
import ValuesChart from "../ValuesChart/ValuesChart";
import Form from "../Form/Form";

function App() {
  const [currentDay, setDay] = useState(1);
  const [currentMonth, setMonth] = useState(1);
  const [currentYear, setYear] = useState(1995);
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState(null);
  const [allValues, setAllValues] = useState([]);

  useEffect(() => {
    async function fetchDaysData() {
      const { data } = await axios.get("api/days/values");
      setAllValues(getDaysCount(data));
    }
    fetchDaysData();
  }, []);

  const onDateSubmit = async () => {
    const dateKey = format(
      new Date(currentYear, currentMonth - 1, currentDay),
      "yyyy-MM-d"
    );
    const { data: dayOfWeekNumber } = await axios.get(`/api/days/${dateKey}`);
    setCurrentDayOfWeek(dayOfWeekNumber);
    const { data: allDays } = await axios.get("/api/days/values");
    setAllValues(getDaysCount(allDays));
  };

  const handleDayChange = (event) => setDay(event.currentTarget.value);

  const handleMonthChange = (event) => setMonth(event.currentTarget.value);

  const handleYearChange = (event) => setYear(event.currentTarget.value);

  return (
    <section className={css.container}>
      <h1>Get day of week app</h1>
      <Form
        currentDay={currentDay}
        currentMonth={currentMonth}
        currentYear={currentYear}
        handleDayChange={handleDayChange}
        handleMonthChange={handleMonthChange}
        handleYearChange={handleYearChange}
        onDateSubmit={onDateSubmit}
      />
      {(currentDayOfWeek || currentDayOfWeek === 0) && (
        <h3>{daysOfWeek[currentDayOfWeek]}!</h3>
      )}
      <div>
        <ValuesChart daysValues={allValues} />
      </div>
    </section>
  );
}

export default App;
