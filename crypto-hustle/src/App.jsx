import { useState, useEffect } from 'react'
import CoinInfo from './components/CoinInfo';
import './App.css'
const API_KEY = import.meta.env.VITE_APP_CRYPTO_API_KEY

function App() {
  const [list, setList] = useState(null);
  const [filteredResults, setFilteredResults] = useState([])
  const [searchInput, setSearchInput] = useState("")

  // add limit url parameter for number

  useEffect(() => {
    // run this function and don't wait for it to finish before continuing with the rest of the app. when done, come back and do something with the result
    const fetchAllCoinData = async () => {
      const res = await fetch(`https://min-api.cryptocompare.com/data/all/coinlist?&api_key=${API_KEY}`)
      const data = await res.json()
      setList(data)
      console.log(list.Data) // put this here since outside of this list is null
    }
    fetchAllCoinData().catch(console.error)
   

  }, [])
  // renders only at mount/ when component appears


  // filters through API call results
  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    if (searchValue !== "") {
      // I think it is filtering the keys from list json by the values that include the searchValue in its name
      const filteredData = Object.keys(list.Data).filter((item) =>
      Object.values(item).join("").toLowerCase().includes(searchValue.toLowerCase()))
      setFilteredResults(filteredData)
    } else {
      // if no searchValue then there is no filter so display items regularly
      setFilteredResults(Object.keys(list.Data))
    }
  }
 
  
  return (
    <div className='whole-page'>
      <h1>My Crypto List</h1>
      <input
        type='text'
        placeholder='Search'
        onChange={(inputString) => searchItems(inputString.target.value)}/>
      <ul>
        {/* checks if list exists and extracts key value pairs from list json object where we then filter for valid coins and map the data into list items */}
        {/* only real blockchain coins currently in use */}
        {list && 
          Object.entries(list.Data)
          .filter(([_, coinData]) =>
            coinData.IsTrading &&
            coinData.Algorithm !== "N/A" &&
            coinData.ProofType !== "N/A"
          ).map(([coin, coinData]) => (
            <CoinInfo
              key={coin}
              image={list.Data[coin].ImageUrl}
              name={list.Data[coin].FullName}
              symbol={list.Data[coin].Symbol}
            />
          ))
          }
          {searchInput.length > 0
            ? filteredResults
                .map((coin) => {
                  // for each coin
                  const coinData = list.Data[coin]
                  // if we have valid current coin (it is trading, has a algorithm and proof type) then we will display the coin image, name, symbol
                  if (
                    coinData.IsTrading &&
                    coinData.Algorithm !== "N/A" &&
                    coinData.ProofType !== "N/A"
                  ) {
                    return (
                      <CoinInfo
                        key={coin}
                        image={coinData.ImageUrl}
                        name={coinData.FullName}
                        symbol={coinData.Symbol}
                      />
                    )
                  }
                  return null
                })
                // if we had returned null/no search value we check if list exists and display 20 entries if so
            : list &&
              Object.entries(list.Data)
                .filter(
                  ([_, coinData]) =>
                    coinData.IsTrading &&
                    coinData.Algorithm !== "N/A" &&
                    coinData.ProofType !== "N/A"
                )
                .slice(0, 20)
                .map(([coin, coinData]) => (
                  <CoinInfo
                    key={coin}
                    image={coinData.ImageUrl}
                    name={coinData.FullName}
                    symbol={coinData.Symbol}
                  />
                ))}
      </ul>


    </div>
  )
}

export default App
