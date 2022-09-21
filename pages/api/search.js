import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_KEY
});

export default async (req, res) => {
  const endpoint = 'GET /search/users'
  const data = {
    q: req.query.q,
    per_page: 10
  }

  try {
    const result = await octokit.request(endpoint, data)
    res.send(JSON.stringify(result))
  } catch (error) {
    console.log('Error!')
  }
};
