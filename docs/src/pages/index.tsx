import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <img src="/img/logo-min.svg" className={styles.heroLogo} />
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <video
          className={styles.video}
          src="/videos/viteshot.mp4"
          autoPlay
          playsInline
          loop
          muted
          disableRemotePlayback
        />
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="ViteShot is an open-source tool to generate screenshots of UI components within seconds."
    >
      <HomepageHeader />
      <main>
        <div className="row margin-top--lg margin-horiz--lg">
          <div className="col col--3 col--offset-3 margin-vert--sm">
            <Link
              href="/docs/getting-started"
              className="button button--block button--lg button--primary shadow--lw"
            >
              🚀 &nbsp; Get Started
            </Link>
          </div>
          <div className="col col--3 margin-vert--sm">
            <Link
              href="/docs/why"
              className="button button--block button--lg button--secondary"
            >
              ℹ️ &nbsp; Learn more
            </Link>
          </div>
        </div>
        <div className="row margin--lg">
          <div className="col col--4 margin-vert--sm">
            <div className="card">
              <div className="card__header">
                <h3>Fast</h3>
              </div>
              <div className="card__image">
                <img src="/img/undraw_Outer_space_drqu.svg" />
              </div>
              <div className="card__body">
                <p>
                  ViteShot is built on top of{" "}
                  <a href="https://vitejs.dev" target="_blank">
                    Vite
                  </a>
                  , a super-fast webpack alternative.
                </p>
                <p>
                  It only takes a few seconds to regenerate all screenshots in a
                  large project.
                </p>
              </div>
            </div>
          </div>
          <div className="col col--4 margin-vert--sm">
            <div className="card">
              <div className="card__header">
                <h3>Easy</h3>
              </div>
              <div className="card__image">
                <img src="/img/undraw_happy_feeling_slmw.svg" />
              </div>
              <div className="card__body">
                <p>
                  ViteShot works out of the box for React, Preact, Solid, Svelte
                  and Vue 3 projects.
                </p>
                <p>
                  All you need is a simple config file, which ViteShot can
                  generate for you.
                </p>
              </div>
            </div>
          </div>
          <div className="col col--4 margin-vert--sm">
            <div className="card">
              <div className="card__header">
                <h3>Flexible</h3>
              </div>
              <div className="card__image">
                <img src="/img/undraw_elements_cipa-3.svg" />
              </div>
              <div className="card__body">
                <p>
                  ViteShot can handle complex scenarios easily thanks to
                  pre-screenshot hooks.
                </p>
                <p>
                  It also supports CSS Modules, PostCSS and so on out of the
                  box.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
