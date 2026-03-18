'use client';

import CanvasLoader from "./components/common/CanvasLoader";
import ScrollWrapper from "./components/common/ScrollWrapper";
import Experience from "./components/experience";
import Footer from "./components/footer";
import Hero from "./components/hero";
import Skills from "./components/skills";

const Home = () => {
  return (
    <CanvasLoader>
      <ScrollWrapper>
        <Hero/>
        <Skills/>
        <Experience/>
        <Footer/>
      </ScrollWrapper>
    </CanvasLoader>
  );
};
export default Home;
