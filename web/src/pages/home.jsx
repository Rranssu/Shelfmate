import Navbar from '../components/navbar.jsx'
import Hero from '../components/hero.jsx'
import Pricing from '../components/pricing.jsx'
import Partners from '../components/partners.jsx'
import About from '../components/about.jsx'
function Home() {
  return(
    <>
    <Navbar />
    <Hero />
    <div id="prcng">
      <Pricing />
    </div>
    <div id="prtnrs">
      <Partners />
    </div>
    <div id="abt">
      <About />
    </div>
    </>
  );
}

export default Home;
