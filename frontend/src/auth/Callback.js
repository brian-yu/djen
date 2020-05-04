import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import { useLocation, useHistory } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Callback() {
  const code = useQuery().get("code");
  return (
    <>
      <h3>authenticating...</h3>
      <p>{code}</p>
      <div className="spinner">
        <div className="cube1"></div>
        <div className="cube2"></div>
      </div>
    </>
  );
}

export default Callback;