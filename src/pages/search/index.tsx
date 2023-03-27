import React from "react";
import styles from "./search.module.css";

const search = () => {
  return (
    <>
      <div id="styles-setup" className={styles.search_container}>
        <img
          className={styles.search_item}
          src="assets/search.png"
          alt="search-icon"
        />
        <input
          className={styles.search}
          placeholder="Search for your location"
          type="text"
        />
      </div>
      <iframe
        id="map"
        className={styles.map}
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5125429.316419938!2d10.415039000000002!3d51.151785999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sde!2sde!4v1679694749290!5m2!1sde!2sde"
        width="600"
        height="450"
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      <img
        src="assets/background.png"
        alt="background"
        className={styles.background}
      />
    </>
  );
};

export default search;
