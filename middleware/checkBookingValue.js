export default function ({ params, query, redirect }) {
  if (!params.court && !query.code) {
    redirect("/booking");
  }
}
