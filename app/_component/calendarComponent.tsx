"use client";

import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface Holiday {
  title: string;
  start: Date;
  end: Date;
}

interface Country {
  name: string;
  dial_code: string;
  code: string;
}

const localizer = momentLocalizer(moment);

export default function CalendarComponent() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [location, setLocation] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [locationData, setLocationData] = useState(null);
  const [date, setDate] = useState(new Date());

  const months = Array.from({ length: 12 }, (_, i) => i);

  useEffect(() => {
    const fetchLocation = async () => {
      const res = await axios.get("http://ip-api.com/json");
      console.log(res);
      if (res.status === 200) {
        setLocation(res.data?.countryCode);
      }
    };

    const fetchCountries = async () => {
      const response = await axios.get(
        "https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json"
      );
      setCountries(response.data);
      console.log("countries => ", response.data);
    };

    Promise.all([fetchLocation(), fetchCountries()]).catch((error) =>
      console.error("Error fetching data: ", error)
    );
  }, []);

  useEffect(() => {
    if (location) {
      axios
        .get(`https://date.nager.at/api/v3/publicholidays/${year}/${location}`)
        .then((response) => {
          const responseHolidays: Holiday[] = response.data.map(
            (holiday: any) => ({
              title: holiday.name,
              start: new Date(holiday.date),
              end: new Date(holiday.date),
            })
          );

          setHolidays(responseHolidays);

          console.log("holiday => ", responseHolidays);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }
  }, [location, year]);

  useEffect(() => {
    setDate(new Date(year, date.getMonth()));
  }, [year]);

  return (
    <div className="w-full">
      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        placeholder="Enter year"
      />
      <div className="flex">
        <div className="w-5/6">
          <div className="grid grid-cols-3 gap-4">
            {months.map((month) => (
              <Calendar
                key={month}
                selectable
                localizer={localizer}
                events={holidays}
                views={[Views.DAY, Views.WEEK, Views.MONTH]}
                defaultView={Views.MONTH}
                date={new Date(date.getFullYear(), month)}
                onNavigate={(date) => setDate(new Date(date))}
                style={{ height: 500 }}
              />
            ))}
          </div>
        </div>
        <div className="w-1/6 ml-4">
          <h2 className="text-xl font-bold mb-4">Events/Holidays</h2>
          <ul>
            {holidays.map((holiday, index) => (
              <li key={index}>
                <span className="font-bold">
                  {moment(holiday.start).format("MM/DD/YY")}
                </span>{" "}
                {holiday.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
