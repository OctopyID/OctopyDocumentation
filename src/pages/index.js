import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Expressive, Beautiful Syntax',
    description: 'Value elegance, simplicity, readability and easy to use ? You’ll fit right in. Octopy is designed for people just like you.',
    imageUrl: 'img/code.svg',
  },
  {
    title: 'Designed For Your Team',
    description: 'Whether you’re a solo developer or a 20 person team, Octopy is a breath of fresh air. Keep everyone in sync using Octopy’s database agnostic migrations and schema builder.',
    imageUrl: 'img/dev.svg',
  },
  {
    title: 'Zero Dependencies',
    description: 'Octopy is designed without dependency on other packages. But you are free to use packages from outside using composer.',
    imageUrl: 'img/zero.svg',
  },

];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3 class="text--center">{title}</h3>
      <p class="text--center">{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <div class="row">
            <div class="col padding-top--lg">
              <h1 className="hero__title">{siteConfig.tagline}</h1>
              <p className="hero__subtitle">Octopy is a lightweight MVC framework inspired by Laravel and less footprint.</p>
              <div className={styles.buttons}>
                <Link
                  className={classnames(
                    'button button--secondary button--lg margin-right--md octopy--button',
                    styles.getStarted,
                  )}
                  to={useBaseUrl('docs/installation')}>
                  Get Started
                </Link>
              </div>
            </div>
            <div class="col text--center"><img src={useBaseUrl('img/octopy-600px.png')} alt="{siteConfig.title}" /></div>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
