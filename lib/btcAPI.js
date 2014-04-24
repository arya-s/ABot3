module.exports = {
  'bitstamp': {
    'api': 'https://www.bitstamp.net/api/ticker/',
    'currency': '$',
    'fetch': ['last']
  },
  'btce': {
    'api': 'https://btc-e.com/api/2/btc_usd/ticker',
    'currency': '$',
    'fetch': ['ticker', 'last']
  },
  'coinbase': {
    'api': 'https://coinbase.com/api/v1/prices/spot_rate',
    'currency': '$',
    'fetch': ['amount']
  }
};
