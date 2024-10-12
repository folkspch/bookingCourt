import { EventSourcePolyfill } from 'event-source-polyfill';
export default function ({ app }) {
  if (process.client) {
    const token = null;
    
    const eventSource = new EventSourcePolyfill('http://localhost:4000/events', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });;

    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.log('Received data:', data);

      // You can commit the data to the Vuex store if needed
      // store.commit('someMutation', data);
    };

    eventSource.onerror = function(error) {
      console.error('EventSource failed:', error);
    };
  }
};
