import { useEffect, useState } from "react";
const API_KEY = import.meta.env.VITE_APP__CRYPTO_API_KEY

const CoinInfo = ({ image, name, symbol }) => {
    const [price, setPrice] = useState(null);

    useEffect(() => {
        if (!symbol) return;
        const getCoinPrice = async () => {
            const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD&api_key=${API_KEY}`)
            const data = await response.json()
            setPrice(data)
        }
        getCoinPrice().catch(console.error)
    }, [symbol])
    
    return (
        <div>
            {price ? ( 
             <li className="main-list" key={symbol}>
             <img
                className="icons"
                src={`https://www.cryptocompare.com${image}`}
                alt={`Small icon for ${name} crypto coin`}
             />
             {name}
             {price && price.USD ? ` $${price.USD} USD` : null}
             </li>
             ) : 
             null
            }
                        
        </div>
    );

}

export default CoinInfo;