const { quais } = require('quais');
try {
  const wallet = quais.Wallet.createRandom();
  console.log('Address: ' + wallet.address);
  console.log('PK: ' + wallet.privateKey);
} catch (e) {
  console.error(e);
}
