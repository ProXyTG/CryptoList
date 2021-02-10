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

const defaultProps:ICoin[] = [];

const App: React.SFC = () => {
  const [coins, setCoins]: [ICoin[], (coins: ICoin[]) => void] = React.useState(defaultProps);
  const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
  const [error, setError]: [string, (error: string) => void] = React.useState("");

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

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="App">
     <ul className="coins">
       <h1>{coins.length}</h1>
       {coins.map((coin) => (
        <li key={coin.id}>
         <h3>{coin.symbol}</h3>
         <p>{coin.name}</p>
         {
          Object.keys(coin.platforms).map((key, i) => (
            <p key={i}>
              <span>Key Name: {key}</span>
              <span>Value: {coin.platforms[key]}</span>
            </p>
          ))
         }
        </li>
      ))}
     </ul>
     {error && <p className="error">{error}</p>}
   </div>
   );
};

export default App;
