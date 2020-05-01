import React from "react";
import css from "./Form.module.css";
import { monthNames } from "../costants";

function Form({
  onDateSubmit,
  currentDay,
  handleDayChange,
  currentMonth,
  handleMonthChange,
  currentYear,
  handleYearChange,
}) {
  const isButtonDisabled = () =>
    currentDay > 31 || currentDay < 1 || currentYear < 1;

  return (
    <>
      <div className={css.inputForms}>
        <input
          type="number"
          className={css.inputForms__item}
          placeholder="day"
          min={1}
          max={31}
          value={currentDay}
          onChange={handleDayChange}
        />
        <select
          className={css.inputForms__item}
          onChange={handleMonthChange}
          value={currentMonth}
        >
          {monthNames.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
        <input
          className={css.inputForms__item}
          type="number"
          placeholder="year"
          min={1900}
          max={2100}
          value={currentYear}
          onChange={handleYearChange}
        />
      </div>
      <button
        className={css.getDayBtn}
        disabled={isButtonDisabled()}
        onClick={onDateSubmit}
      >
        Get day of weeek
      </button>
    </>
  );
}

export default Form;
