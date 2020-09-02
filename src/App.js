import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./components/InfoBox/InfoBox.component";
import Map from "./components/Map/Map.component";
import Table from "./components/Table/Table.component";
import { sortData } from "./util";
import LineGraph from "./components/LineGraph/LineGraph.component";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    // console.log("country code>>>", countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };
  console.log("country info >>>", countryInfo);
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              value={country}
              onChange={onCountryChange}
              variant="outlined"
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}

              {/* <MenuItem value="worldwide">Uganda</MenuItem>
        <MenuItem value="worldwide">Tanzania</MenuItem> */}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
            title="Corona virus cases"
          />
          <InfoBox
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
            title="Recovered"
          />
          <InfoBox
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
            title="deaths"
          />
        </div>
        <Map />
      </div>
      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Live cases by country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new cases</h3>
            <LineGraph />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
