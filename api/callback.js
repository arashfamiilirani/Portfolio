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

  // If GitHub refuses to give a token, print the exact reason on the screen
  if (!data.access_token) {
    return res.send(`
      <html><body style="font-family: sans-serif; padding: 20px;">
        <h2>Authentication Failed ❌</h2>
        <p>GitHub refused the connection. <strong>Reason:</strong> ${data.error_description || data.error}</p>
        <p><strong>How to fix this:</strong> Go to your Vercel Dashboard -> Settings -> Environment Variables. Delete your current GITHUB_CLIENT_SECRET and carefully paste a brand new one from GitHub. Make sure there are no spaces.</p>
      </body></html>
    `);
  }

  // If it works, send the exact token format Decap needs
  res.send(`
    <html><body><script>
      window.opener.postMessage(
        'authorization:github:success:{"token":"${data.access_token}","provider":"github"}',
        '*'
      );
    </script></body></html>
  `);
}
