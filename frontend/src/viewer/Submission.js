import React, { useContext, useState, useLayoutEffect } from "react";
import styled from "styled-components";
import TrackVisibility from "react-on-screen";

import AuthContext from "../auth/AuthContext";
import { API_HOST } from "../App";
import Frame from "./Frame";
import { Link } from "react-router-dom";

export function Like({ submission }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <LikeContainer>
    <Heart
      className={`${isHovered || isLiked ? 'fas' : 'far'} fa-heart`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    ></Heart> {submission.upvote_count}
    </LikeContainer>
  );
}

export function useWindowSize() {
  const [size, setSize] = useState(window.innerWidth - 200);
  useLayoutEffect(() => {
    function updateSize() {

      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width < 768) {
        setSize(width - 100);
      } else if (width < 992) {
        setSize(Math.min(width - 200, height-200));
      } else {
        setSize(Math.min(800, height-200));
      }
      
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

function Submission(props) {
  const [auth, setAuth] = useContext(AuthContext);
  const submission = props.submission;

  const size = useWindowSize();


  return (
    <>
      <h4>
        <TitleLink to={`/view/${submission.id}`}>{submission.title}</TitleLink>
      </h4>
      <p>
        by{" "}
        <TitleLink to={`/profile/${submission.username}`}>
          {submission.username}
        </TitleLink>
      </p>
      <TrackVisibility partialVisibility>
        <Frame
          width={`${size}px`}
          height={`${size}px`}
          src={`${API_HOST}/submissions/${submission.id}/render/`}
          ref={submission.iframe}
        ></Frame>
      </TrackVisibility>
      <div>
        <Like submission={submission}/>
      </div>
    </>
  );
}

export default Submission;

const TitleLink = styled(Link)`
  font-weight: 600;
  text-decoration: none;
`;

const LikeContainer = styled.div`
  margin-top: 20px;
  font-size: 1.5rem;
`;

const Heart = styled.i`
  cursor: pointer;
`;
