export default function ({ store,route, redirect }) {
    const someValue = store.state.courtDetail;
    const x = route.params.code
    const xx = route.params.court
    // Replace with your actual getter
    console.log(someValue);
    console.log(x);
    console.log(xx);
    // if (!someValue) {
    //   redirect('/another-page'); // Replace with the desired redirection path
    // }
  }