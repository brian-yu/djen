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
      <h3>auth callback</h3>
      <p>{code}</p>
    </>
  );
}

export default Callback;