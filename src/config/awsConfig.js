const awsConfig = {
  // Dev
  // awsUserPoolId: 'ap-southeast-1_06bLrZ4t8',
  // awsUserPoolWebClientId: 'noba3tnv3li8m1um0bvb21d8g',

  // Demo
  awsUserPoolId: 'ap-southeast-1_w525Hvp6g',
  awsUserPoolWebClientId: '2bt452vj3impp8iaq6cgdooq13',

  identityPoolId: 'ap-southeast-1:346468483688:userpool/ap-southeast-1_06bLrZ4t8',
  awsClientId: '7assk8plr257el191tk9rsouah',
  region: 'ap-southeast-1',
  endpoint: 'https://xxxxxxxxxx.execute-api.ap-southeast-1.amazonaws.com/dev',
  base_url: 'https://api.proseller.io',
  register: 'https://api.proseller.io/customer/register',
  confirm: 'https://api.proseller.io/customer/confirm',
  login: 'https://api.proseller.io/customer/login',
  authorization: 'eyJraWQiOiJkMEh1SFBtR1lcLzJ3eVZQOHVEYXBxbGFRZVNYVmR1bHM1cGg3RUVHc1wvaGs9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjMDg4MjRmYy03YzcwLTQ0NjYtYWU2YS0yZDQ4ZjM0MmZhZDMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYWRkcmVzcyI6eyJmb3JtYXR0ZWQiOiJKYWthcnRhIFB1c2F0In0sImJpcnRoZGF0ZSI6IjI1XC8xMVwvMTk5NiIsImdlbmRlciI6Im1hbGUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfMDZiTHJaNHQ4IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6ImNyc3N1bHRvbiIsImF1ZCI6Im5vYmEzdG52M2xpOG0xdW0wYnZiMjFkOGciLCJldmVudF9pZCI6IjdlMDNiNDg0LWM3MGItNDY1MC05YmM0LTVkOGZmNTI2ZWE1MSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTY4MjYwODYwLCJuYW1lIjoiQ2hhZXJ1cyBTdWx0b24iLCJuaWNrbmFtZSI6ImNycyIsInBob25lX251bWJlciI6Iis2MjgxOTk4OTQ4NTc1IiwiZXhwIjoxNTY4MjY0NDYwLCJpYXQiOjE1NjgyNjA4NjAsImVtYWlsIjoic3VsdG9uY2hhZXJ1czk2QGdtYWlsLmNvbSJ9.apss1d74GO5XxW_fabNk9Up3AAQv1aorImWPYgEffAa_2czZh0jaJSamQDRjBuDl_4ooe9XnwHIjaHWqapv-4g9S8WovSIZHSuev2JWOdxbUpMaUv3sX1Y6npxFNAggezixH2SSHAX7pclPINP31U8tmyGJNExGHjd16_sFcUXB07b1pslDv2Lf5iJPwBxVXMWIFbpzz4cfOcErHDZsWu9Hp1c2AfljNl3U4MtCxeRd7HL2icUWYBssDkDDdybKoZNdOdraCHSXwjNKe_o2hpHNIPthBXaC8Y58W77NyizErxyVcd2yjNn8eHipueSkHaehyQuAlLardYcwL8fOJdw',
  getStores: 'https://api.proseller.io/store',
  getRewords: 'https://api.proseller.io/campaign',
};

export default awsConfig;