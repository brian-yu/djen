import React, { useContext, useState } from "react";
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

function Submission(props) {
  const [auth, setAuth] = useContext(AuthContext);
  const submission = props.submission;

  return (
    <>
      <h4>
        <TitleLink to={`/${auth && auth.github_id == submission.username ? 'create' : 'view'}/${submission.id}`}>{submission.title}</TitleLink>
      </h4>
      <p>
        by{" "}
        <TitleLink to={`/profile/${submission.username}`}>
          {submission.username}
        </TitleLink>
      </p>
      <TrackVisibility partialVisibility>
        <Frame
          width="35vw"
          height="60vh"
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
