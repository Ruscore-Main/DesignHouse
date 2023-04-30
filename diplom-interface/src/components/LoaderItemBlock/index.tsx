import React from 'react';
import ContentLoader from 'react-content-loader';
import styles from './LoaderItemBlock.module.scss'

const LoaderItemBlock = () => (
  <div className={styles.root}>
    <ContentLoader
      speed={1}
      width={380}
      height={206}
      viewBox="0 0 380 206"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      className={styles.imgLoader}>
      <rect x="0" y="0" rx="20" ry="20" width="380" height="206" />
    </ContentLoader>

    <ContentLoader
      speed={1}
      width={250}
      height={27}
      viewBox="0 0 250 27"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      className={styles.titleLoader}>
      <rect x="0" y="0" rx="0" ry="0" width="250" height="27" />
    </ContentLoader>

    <ContentLoader
      speed={1}
      width={380}
      height={42}
      viewBox="0 0 380 42"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      className={styles.descriptionLoader}>
      <rect x="0" y="0" rx="0" ry="0" width="380" height="42" />
    </ContentLoader>

    <ContentLoader
      speed={1}
      width={50}
      height={21}
      viewBox="0 0 50 21"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      className={styles.areaLoader}>
      <rect x="0" y="0" rx="0" ry="0" width="50" height="21" />
    </ContentLoader>

    <ContentLoader
      speed={1}
      width={100}
      height={21}
      viewBox="0 0 100 21"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      className={styles.priceLoader}>
      <rect x="0" y="0" rx="0" ry="0" width="100" height="21" />
    </ContentLoader>
  </div>
);

export default LoaderItemBlock;
