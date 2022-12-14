import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_KEY
});

export default async (req, res) => {
  const endpoint = 'GET /users'

  try {
    const result = await octokit.request(endpoint, {})
    res.send(result)
  } catch (error) {
    console.log('Error!')
    res.end()
  }
};
