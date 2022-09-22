import axios from 'axios'

import Head from 'next/head';
import Layout from '../../components/layout';

import utilStyles from '../../styles/utils.module.scss';

import { sortByKey } from '../../utilities/helpers'

const baseURL = 'http://localhost:3000/'

export async function getServerSideProps({ req, params }) {
  const userResponse = await axios.get(`${baseURL}/api/profiles/${params.username}`, {})
  const user = userResponse.data.data || null

  const userReposResponse = await axios.get(`${baseURL}/api/profiles/${params.username}/repos`, {})
  let userRepos = userReposResponse.data.data || null

  if (userRepos) {
    userRepos = sortByKey(userRepos, 'stargazers_count').slice(0, 4)
  }

  return {
    props: {
      user,
      userRepos
    },
  };
}

export default function Profile(props) {
  return (
    <Layout>
      <Head>
        <title>{props.user ? props.user.login : "User not found"}</title>
      </Head>
      <article>
        { props.user ?
          <>
            <h1 className={utilStyles.headingXl}>{props.user.login}</h1>
            <img src={props.user.avatar_url} />
            <p>{props.user.followers} followers</p>
            <p>{props.user.public_repos} repositories</p>
            <p>Top 4 repositories</p>
            { props.userRepos &&
              <ul>
                {
                  props.userRepos.map((repo) => (
                    <li key={repo.id}>
                      {repo.name} ({repo.stargazers_count} stargazers, {repo.watchers_count} watchers)
                    </li>
                  ))
                }
              </ul>
            }
          </> : <p>No user found.</p>
        }
      </article>
    </Layout>
  );
}
