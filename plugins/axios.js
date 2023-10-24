// plugins/axios.js

export default function ({ $axios, app}) {
    // Set the base URL for your API
    $axios.defaults.baseURL = process.env.API_URL || 'https://example.com/api';
  
    // Intercept requests to attach the authorization header
    $axios.onRequest((config) => {
      // Get the authentication token from your Nuxt Auth module
      if (app.$auth.loggedIn) {
        const token = app.$auth.strategy.token.get();
        if (token) {
        console.log(token)
          config.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    });
  
    // Handle errors or responses globally if needed
    $axios.onError((error) => {
      // Handle error globally here
      console.error('Axios error:', error);
    });
  }
  