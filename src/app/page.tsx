
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Navbar />
      <section className={styles.sectionIMG}>

      </section>
      <Footer />
    </main>
  );
}
