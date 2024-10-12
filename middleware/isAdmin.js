export default function ({ $auth, redirect }) {
  if($auth.user.account_type.toLowerCase() !== 'admin'){
    return redirect('/')
  }
}
