import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'High Performance',
    description: 'Hasty Server is designed for speed. It’s built using low-level networking APIs, ensuring minimal overhead and high concurrency. This makes it capable of handling thousands of requests per second with ease, perfect for high-traffic applications.',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
  },
  {
    title: 'Developer Friendly',
    description: 'It offers a simple and intuitive API, inspired by Express.js. Whether you’re a beginner or an experienced developer, the clear structure and easy-to-use syntax allow you to build applications faster and with fewer bugs.',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
  },
  {
    title: 'Built-in Security',
    description: 'Security is a top priority. Hasty Server includes built-in protections against common vulnerabilities such as XSS (Cross-Site Scripting), CSRF (Cross-Site Request Forgery), and SQL injection, helping you create secure applications without extra effort.',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
  },
  {
    title: 'Extensible Architecture',
    description: 'With its middleware-based architecture, Hasty Server allows you to add custom plugins and middlewares. You can extend its functionality by adding your own handlers or integrating third-party libraries with ease.',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
  },
  {
    title: 'Lightweight & Minimal',
    description: 'Despite its powerful features, Hasty Server remains lightweight and efficient. It minimizes resource consumption, making it ideal for resource-constrained environments such as microservices or serverless applications.',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
  },
  {
    title: 'Flexible Routing',
    description: 'Hasty Server provides a flexible routing system, allowing you to define routes for different HTTP methods (GET, POST, PUT, DELETE, etc.). You can also create dynamic routes with parameters for even more customization.',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
