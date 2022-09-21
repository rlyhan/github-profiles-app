import axios from 'axios'

import Head from 'next/head';
import Layout from '../../components/layout';

import utilStyles from '../../styles/utils.module.css';

const baseURL = 'http://localhost:3000/'

export async function getServerSideProps({ req, params }) {
  const userResponse = await axios.get(`${baseURL}/api/profiles/${params.username}`, {})
  const user = userResponse.data.data

  const userReposResponse = await axios.get(`${baseURL}/api/profiles/${params.username}/repos`, {})
  let userRepos = userReposResponse.data.data

  if (userRepos) {
    userRepos = userRepos.slice(0, 4).sort((a, b) => {
      return (parseInt(b['watchers_count']) > parseInt(a['watchers_count'])) ? 1 : ((parseInt(b['watchers_count']) < parseInt(a['watchers_count'])) ? -1 : 0)
    })
  }

  return {
    props: {
      user,
      userRepos
    },
  };
}

export default function Profile({ user, userRepos }) {
  return (
    <Layout>
      <Head>
        <title>{user.login}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{user.login}</h1>
        <img src={user.avatar_url} />
        <p>{user.followers} followers</p>
        <p>{user.public_repos} repositories</p>
        <p>Top 4 repositories</p>
        <ul>
          {
            userRepos.map((repo) => (
              <li key={repo.id}>
                {repo.name} ({repo.watchers_count} watchers)
              </li>
            ))
          }
        </ul>
      </article>
    </Layout>
  );
}
