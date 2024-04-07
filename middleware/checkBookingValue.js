export default function ({ params, redirect }) {
    if(!params.code){
      redirect('/booking');
    }
  }