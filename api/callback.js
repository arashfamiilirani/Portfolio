export default async function handler(req, res) {
  const { code } = req.query;
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await response.json();
  
  res.send(`
    <script>
      // The "*" below allows the "Success" message to jump from the popup 
      // back to your main window even if the "www" is missing.
      window.opener.postMessage("authorization:github:success:${JSON.stringify(data)}", "*");
      window.close();
    </script>
  `);
}
