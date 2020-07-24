// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '5dnbg3ig0e'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-06hrcd85.us.auth0.com',            // Auth0 domain
  clientId: 'SwVZhtl7k1AcmmsPE3ig3EQY1GMn75I9',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
