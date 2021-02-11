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
}

interface IFilteredCoin {
  id: number;
  symbol: string;
  name: string;
  platforms: {
    ethereum: string
  };
}

const defaultProps:ICoin[] = [];
const filteredProps:IFilteredCoin[] = [];

const App: React.SFC = () => {
  const [coins, setCoins]: [ICoin[], (coins: ICoin[]) => void] = React.useState(defaultProps);
  const [filteredCoins, setFilteredCoins]: [IFilteredCoin[], (coins: IFilteredCoin[]) => void] = React.useState(filteredProps);
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
      setFilteredCoins(response.data)
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
    setFilteredCoins(coins)
  }, []);

  React.useEffect(() => {
    setFilteredCoins([]);

    if(filter) {
      const filtered = coins.filter(p => Object.keys(p.platforms).includes(filter));
      setFilteredCoins(filtered);
    } else {
      setFilteredCoins(coins)
    }
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
          href="/ethereum"
          onClick={() => setFilter("ethereum")}
        >
          Ethereum
        </a>
      </div>
      <div className="portfolio__container">
        {
          window.location.pathname !== "/ethereum" ?
            <p>Coins on ethereum platform: {Math.round(coins.filter(p => Object.keys(p.platforms).includes("ethereum")).length / filteredCoins.length * 100)}%</p>
          : ""
        }
        {filteredCoins.map(coin =>
          <li key={coin.id}>
            <h3>Symbol: {coin.symbol}</h3>
            <p>Name: {coin.name}</p>
            {
              Object.keys(coin.platforms).map((key, i) => (
                <p key={i}>
                  <span>Platform: {key}</span>
                </p>
              ))
            }
          </li>
        )}
      </div>
    </>
  );
};

export default App;
