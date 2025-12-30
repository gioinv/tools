import SignatureGenerator from './fliggy.js';

function highlightJson(jsonString) {
  const highlightedHtml = jsonString
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:') // Keys
      .replace(/: "(.*?)"/g, ': <span class="json-string">"$1"</span>') // String values
      .replace(/: (\d+(\.\d+)?)/g, ': <span class="json-number">$1</span>') // Number values
      .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>') // Boolean values
      .replace(/: (null)/g, ': <span class="json-null">$1</span>'); // Null values

  return highlightedHtml;
}

async function callApi() {
  const domain = document.getElementById('domainSelect').value;
  const apiPath = document.getElementById('apiSelect').value;

  let htmlContent = document.getElementById("requestBody").innerHTML;

  const bodyText = htmlContent.replace(/<[^>]*>/g, "").trim();

  const appKey = document.getElementById('appKey').value;
  const appSecret = document.getElementById('appSecret').value;
  const responseBodyElement = document.getElementById('responseBody'); 

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
    if (data && typeof data.success === 'boolean' && data.success === false) {
      const formattedJson = JSON.stringify(data, null, 2);
      responseBodyElement.innerHTML = `${highlightJson(formattedJson)}`; // Tô màu JSON lỗi
      responseBodyElement.style.backgroundColor = '#ffe6e6';
      console.error('API returned success: false', data);
      return;
    }

    // const readFile = await readFliggyJsonFile();
    // readFile[apiPath] = responseBodyElement; 

    const formattedJson = JSON.stringify(data, null, 2);
    responseBodyElement.innerHTML = highlightJson(formattedJson);
    responseBodyElement.style.backgroundColor = '#f9fafb';
  } catch (error) {
    responseBodyElement.textContent = 'Error: ' + error.message;
    responseBodyElement.style.backgroundColor = '#ffe6e6';
  }
}

// async function readFliggyJsonFile() {
//   const filePath = './fliggyApiRequestBody.json'; // Đường dẫn tương đối tới file JSON
//   try {
//     const response = await fetch(filePath);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const jsonData = await response.json(); // Đọc nội dung JSON
//     return jsonData;
//   } catch (err) {
//     console.error('Lỗi khi xử lý file:', err);
//   }
// }
function setToLocalStorage(key, value) {
  try {
    const serializedValue = typeof value === 'string'
      ? value
      : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Failed to set to localStorage:', error);
  }
}
document.getElementById('runButton').addEventListener('click', callApi);