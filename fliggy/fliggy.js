export default class SignatureGenerator {

  generateNonce() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    } else {
      console.warn("crypto.randomUUID not available, falling back to Math.random() for nonce generation.");
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
  }

  generateTimestamp() {
    return Date.now();
  }

  async sha256Hash(data) {
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async hmacSha256(secret, data) {
    const encoder = new TextEncoder();
    const secretBytes = encoder.encode(secret);
    const dataBytes = encoder.encode(data);

    const key = await crypto.subtle.importKey(
      'raw',
      secretBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      dataBytes
    );

    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async generateSignature(
    appKey,
    appSecret,
    httpMethod,
    url,
    contentString,
    timestamp,
    nonce,
    optionsKeysString
  ) {
    // Tạo hash value dựa trên contentString
    const contentHash = await this.sha256Hash(contentString);

    const stringToSign = [httpMethod, url, contentHash, optionsKeysString].join('\n');

    const plainText = `${appKey}${timestamp}${nonce}${stringToSign}`;

    const sign = await this.hmacSha256(appSecret, plainText);

    return sign.toUpperCase();
  }

  async generateSignatureAndHeaders(
    dto,
    appKey,
    appSecret,
    timeStamp = null,
    nonce = null
  ) {
    console.log("Calling...", document.getElementById('appKey').value);
    const request = JSON.stringify(dto); // Chuyển đổi DTO thành chuỗi JSON
    const httpMethod = "POST";
    const url = "/"; // Theo mã Kotlin, URL là "/"
    const optionsKeysString = ""; // Theo mã Kotlin, chuỗi này là rỗng

    const finalTimestamp = timeStamp !== null ? timeStamp : this.generateTimestamp();
    const finalNonce = nonce !== null ? nonce : this.generateNonce();

    const sign = await this.generateSignature(
      appKey,
      appSecret,
      httpMethod,
      url,
      request, // Sử dụng chuỗi JSON của request body
      finalTimestamp,
      finalNonce,
      optionsKeysString
    );

    const headers = new Headers();
    headers.append("Accept", "application/json, text/plain, */*");
    headers.append("Content-Type", "application/json");
    headers.append("Sign", sign);
    headers.append("Nonce", finalNonce);
    headers.append("Timestamp", finalTimestamp.toString()); // Chuyển timestamp sang chuỗi
    headers.append("App_Key", appKey);
    headers.append("Sign_Method", "HMAC-SHA256");

    return headers;
  }
}
