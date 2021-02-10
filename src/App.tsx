import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

interface ICoin {
  id: number;
  symbol: string;
  name: string;
  platforms: {
    ethereum: string
  };
  filtered,
}

const defaultProps:ICoin[] = [];

const App: React.SFC = () => {
  const [coins, setCoins]: [ICoin[], (coins: ICoin[]) => void] = React.useState(defaultProps);
  const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
  const [error, setError]: [string, (error: string) => void] = React.useState("");
  const [filter, setFilter] = React.useState("all");

  React.useEffect(() => {
    axios
    .get<ICoin[]>("https://api.coingecko.com/api/v3/coins/list?include_platform=true", {
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(response => {
      setCoins(response.data);
      setLoading(false);
    })
    .catch(ex => {
      const error =
      ex.response.status === 404
        ? "Resource not found"
        : "An unexpected error has occurred";
      setError(error);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    setCoins([]);

    const filtered = coins.map(p => ({
      ...p,
      filtered: Object.keys(p.platforms).includes(filter),
    }));
    setCoins(filtered);
  }, [filter]);

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <div className="portfolio__labels">
        <a href="/#" onClick={() => setFilter("")}>
          All
        </a>
        <a
          href="/#ethereum"
          onClick={() => setFilter("ethereum")}
        >
          Ethereum
        </a>
      </div>
      <div className="portfolio__container">
        {coins.map(coin =>
          coin.filtered === true ?
          <li key={coin.id}>
            <h3>Symbol: {coin.symbol}</h3>
            <p>Name: {coin.name}</p>
            {
              Object.keys(coin.platforms).map((key, i) => (
                <p key={i}>
                  <span>Platfrom: {key}</span>
                </p>
              ))
            }
            </li>
          : ""
        )}
      </div>
    </>
  );
};

export default App;
