import React, { useState, useEffect } from "react";
import { ICountryTable } from "./typeTable";
import { FilterOptions, HeaderItems } from "../constants/constants";
import { RemoveIcon } from "../icons/RemoveIcon";
import styles from "./table.module.scss";

const Table = () => {
    const [countries, setCountries] = useState<ICountryTable[]>([]);
    const [filteredCountries, setFilteredCountries] = useState<ICountryTable[]>([]);
    const [searchText, setSearchText] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("All");
    const [sortType, setSortType] = useState("");

    useEffect(() => {
        fetch("https://restcountries.com/v3/all")
            .then((response) => response.json())
            .then((data) => {
                setCountries(data.slice(0, 40));
                setFilteredCountries(data.slice(0, 40));
            });
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = [...countries];

            filtered = filtered.filter((country) =>
                country.name.common.toLowerCase().includes(searchText.toLowerCase())
            );

            if (selectedRegion !== "All") {
                filtered = filtered.filter((country) => country.region === selectedRegion);
            }

            if (sortType === "population") {
                filtered.sort((a, b) => b.population - a.population);
            } else if (sortType === "area") {
                filtered.sort((a, b) => b.area - a.area);
            }

            setFilteredCountries(filtered);
        };

        applyFilters();
    }, [searchText, selectedRegion, sortType, countries]);

    const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRegion(event.target.value);
    };

    const handleSortTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortType(event.target.value);
    };

    const removeCountry = (country: ICountryTable) => {
        setCountries(countries.filter((c) => c !== country));
        setFilteredCountries(filteredCountries.filter((c) => c !== country));
    };

    return (
        <div className={styles.countryTable}>
            <div>
                <h3>Filter</h3>
            </div>
            <div className={styles.filters}>
                <div className={styles.search}>
                    <input
                        type="text"
                        placeholder="Search by Country Name"
                        value={searchText}
                        onChange={handleSearchTextChange}
                    />
                    <select value={selectedRegion} onChange={handleRegionChange}>
                        {FilterOptions.map(option =>
                            <option value={option} key={option}>{option}</option>
                        )}
                    </select>
                </div>
                <div className={styles.sort}>
                    <select value={sortType} onChange={handleSortTypeChange}>
                        <option value="">No Sorting</option>
                        <option value="population">Sort by Population</option>
                        <option value="area">Sort by Area</option>
                    </select>
                </div>
            </div>
            <div className={styles.tableHeader}>
                {HeaderItems.map(item =>
                    <div className={styles.column} key={item}>{item}</div>
                )}
            </div>
            <div className={styles.tableBody}>
                {filteredCountries.map((country) => (
                    <div className={styles.tableRow} key={country.name.common}>
                        <div className={styles.column}>{country.name.common}</div>
                        <div className={styles.column}>{country.region}</div>
                        <div className={styles.column}>{country.population}</div>
                        <div className={styles.column}>{country.area} km²</div>
                        <div className={styles.column}>
                            <img src={country.flags[1]} alt={country.name.common} />
                        </div>
                        <div className={styles.column}>
                            <button onClick={() => removeCountry(country)}>
                                <RemoveIcon />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Table;
