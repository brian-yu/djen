import React from "react";
import styled from "styled-components";

const About = () => {
  return (
    <Wrapper>
      <p>djen is a community for generative art.</p>
      <p>
        it currently support <a href="https://p5js.org/">p5.js</a> and{" "}
        <a href="https://css-doodle.com/">css-doodle</a>.
      </p>
      <br />
      <br />
      <p>
        want support for more libraries? tweet{" "}
        <a href="https://twitter.com/intent/tweet?text=@brianyu8">@brianyu8</a>.
      </p>
      <br />
      <br />
      <p>
        made with <i className="fas fa-heart"></i> by{" "}
        <a href="https://brian.lol">brian</a>.
      </p>
    </Wrapper>
  );
};
export default About;

const Wrapper = styled.div`
  margin: 40px;
`;
