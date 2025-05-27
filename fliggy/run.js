import SignatureGenerator from './fliggy.js';
async function callApi() {
  const domain = document.getElementById('domainSelect').value;
  const apiPath = document.getElementById('apiSelect').value;
  const bodyText = document.getElementById('body').value;

  const appKey = document.getElementById('appKey').value;
  const appSecret = document.getElementById('appSecret').value;

  const url = domain + apiPath;

  const bodyObj = bodyText ? JSON.parse(bodyText) : {};

  const signatureGenerator = new SignatureGenerator();

  const headers = await signatureGenerator.generateSignatureAndHeaders(bodyObj, appKey, appSecret);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(bodyObj),
    });

    const data = await response.json();
    document.getElementById('responseBody').value = JSON.stringify(data, null, 2);
  } catch (error) {
    document.getElementById('responseBody').value = `Error: ${error.message}`;
  }
}

document.getElementById('runButton').addEventListener('click', callApi);
