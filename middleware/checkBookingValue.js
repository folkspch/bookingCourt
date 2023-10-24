export default function ({ store,params, redirect }) {
    const someValue = store.state.courtDetail;
    const x = params.code
    // const xx = route.params.court
    // Replace with your actual getter
    console.log("x",x);
    console.log("x",someValue);
    // console.log(xx);
    // if (!someValue) {
    //   redirect('/another-page'); // Replace with the desired redirection path
    // }
  }