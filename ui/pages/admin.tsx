import { useState } from "react";
import type { NextPage } from "next";
import { useAccount, useBalance } from "wagmi";
import {
  Button,
  Layout,
  Loader,
  WalletOptionsModal,
  BidModal,
} from "../components";
// import MapChart from "../components/map";
// import SVGmap from "../components/SVGMap"; // backup map
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const Admin: NextPage = () => {
  return (
    <>
      "Admin page"
    </>
  );
};

export default Admin;
