import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.scss';

import Search from './search';


export default function Home({ allProfilesData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Search a GitHub Profile</p>
        <Search></Search>
      </section>
    </Layout>
  );
}
