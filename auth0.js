import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({path: './config.env'});

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_API_AUDIENCE } = process.env;

// Function to get Auth0 Management API access token
export async function getAuth0AccessToken() {
  try {
    const response = await axios.post(
      `https://${AUTH0_DOMAIN}/oauth/token`,
      {
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        audience: AUTH0_API_AUDIENCE,
        grant_type: 'client_credentials',
        scope: 'create:users'
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data.access_token;
  } 
  
  catch (error) {
    console.error('Error getting Auth0 access token:', error);
    throw error;
  }
}


export async function getAccessTokenForUser(email, password) {
  try {
    const response = await axios.post(
      `https://${AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: 'password',
        username: email,
        password: password,
        audience: AUTH0_API_AUDIENCE,
        scope: 'openid profile'
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting user access token:', error);
    throw error;
  }
}


// Function to create a user in Auth0
export async function createUser(userData) {
    let token;
  try {
    const token = await getAuth0AccessToken();
        
    const response = await axios.post(
      `https://${AUTH0_DOMAIN}/api/v2/users`,
      userData,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    // console.log(response.data);
    // console.log(token);
    return response.data;
   
    
  } catch (error) {
    console.log(token);
    console.error('Error creating user in Auth0:', error.response?.data || error.message);

    // console.error('Error creating user in Auth0:', error);
    throw error;
  }
}




// Function to log in a user and get an access token
export async function loginUser(email, password) {
  try {
    const response = await axios.post(
      `https://${AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: 'password',
        username: email,
        password: password,
        audience: AUTH0_API_AUDIENCE,
        scope: 'openid profile',
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error.response?.data || error.message);
    throw error;
  }
}