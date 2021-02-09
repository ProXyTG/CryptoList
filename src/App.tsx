import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

interface ICoin {
  id: number;
  symbol: string;
  name: string;
}

const defaultProps:ICoin[] = [];

const App: React.SFC = () => {
  const [coins, setCoins]: [ICoin[], (coins: ICoin[]) => void] = React.useState(defaultProps);

  React.useEffect(() => {
    axios
    .get<ICoin[]>("https://api.coingecko.com/api/v3/coins/list?include_platform=false", {
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(response => {
      setCoins(response.data);
    })
  }, []);

  return (
    <div className="App">
     <ul className="coins">
       {coins.map((coin) => (
        <li key={coin.id}>
         <h3>{coin.symbol}</h3>
         <p>{coin.name}</p>
        </li>
      ))}
     </ul>
   </div>
   );
};

export default App;
