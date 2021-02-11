import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

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
  const columns = [{
      dataField: 'id',
      text: 'ID'
    },
    {
      dataField: 'symbol',
      text: "SYMBOL",
      filter: textFilter("")
    },
    {
      dataField: 'name',
      text: 'NAME',
      sort: true
    },
    {
      dataField: 'platforms.ethereum',
      text: 'PLATFORM ADDRESS',
      sort: true
    },
  ];
  const options = {
    paginationSize: 15,
    pageStartIndex: 0,
    firstPageText: 'First',
    prePageText: 'Back',
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    sizePerPageList: [
      {
        text: 'show 15', value: 15
      },
      {
        text: 'show 30', value: 30
      }
    ]
  };

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
      <div className="coinlist-wrapper">
        <div className="portfolio__header">
          <a href="/#" onClick={() => setFilter("")}>
            <button type="button" className="btn btn-primary">
              All Coins
            </button>
          </a>
          <a href="/#ethereum" onClick={() => setFilter("ethereum")}>
            <button type="button" className="btn btn-secondary">
              Coins on Ethereum Platform
            </button>
          </a>
        </div>
        <div className="portfolio__container">
          {
            window.location.hash !== "#ethereum" ?
              <p>Coins on ethereum platform: {Math.round(coins.filter(p => Object.keys(p.platforms).includes("ethereum")).length / filteredCoins.length * 100)}%</p>
            : ""
          }

          <BootstrapTable
            keyField='id'
            data={ filteredCoins }
            columns={ columns }
            pagination={ paginationFactory(options) }
            filter={ filterFactory() } />
        </div>
      </div>
    </>
  );
};

export default App;
