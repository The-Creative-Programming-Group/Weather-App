import React from "react";
import styles from "./style-home.module.css";
import Layout from "~/components/Layout";

function Home() {
  return (
    <Layout>
      <div className={styles.contentflex}>
        <div className={styles.contentblock}>
          <h1 className={styles.headingtext}>London</h1>
          <h1 className={styles.temperature}>10°C</h1>
          <h1 className={styles.weather}>Sunny</h1>
        </div>
      </div>

      <div className={styles.daytemperature}></div>
      <div className={styles.flex}>
        <div className={styles.weektemperature}></div>
        <div className={styles.rain}></div>
        <div className={styles.map}></div>
      </div>
    </Layout>
  );
}

export default Home;
