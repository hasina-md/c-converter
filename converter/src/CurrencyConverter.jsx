import React, { useState, useEffect } from 'react';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    // Fetch API for collecting currency codes.
    const fetchCurrencies = async () => {
      try {
        const response = await fetch('https://app.exchangerate-api.com/activate/2a32b129e7b3126ccb68b6c488');
        const data = await response.json();
        const currencyCodes = Object.keys(data.rates);
        setCurrencies(currencyCodes);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleConvert = async (event) => {
    event.preventDefault();

    if (amount === '' || isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      const rate = data.rates[toCurrency];

      if (rate) {
        const convertedAmount = amount * rate;
        setResult(`${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`);
      } else {
        alert('Currency not supported');
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      alert('Failed to fetch exchange rates');
    }
  };

  return (
    <form onSubmit={handleConvert}>
      <table>
        <tbody>
          <tr>
            <td><label htmlFor="amount">Amount:</label></td>
            <td>
              <input 
                type="number" 
                id="amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
              />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="from-currency">From:</label></td>
            <td>
              <select 
                id="from-currency" 
                value={fromCurrency} 
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td><label htmlFor="to-currency">To:</label></td>
            <td>
              <select 
                id="to-currency" 
                value={toCurrency} 
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan="2"><button type="submit">Convert</button></td>
          </tr>
        </tbody>
      </table>
      {result && <div id="result">{result}</div>}
    </form>
  );
};

export default CurrencyConverter;
