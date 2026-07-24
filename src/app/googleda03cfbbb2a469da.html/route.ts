export async function GET() {
  return new Response("google-site-verification: googleda03cfbbb2a469da.html", {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
