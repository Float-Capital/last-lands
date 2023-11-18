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

const Home: NextPage = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [openBidModal, setOpenBidModal] = useState(false);
  const [selectedIsoCode, setSelectedIsoCode] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");

  const [{ data: accountData, loading: accountLoading }] = useAccount();
  const [{ data: balanceData, loading: balanceLoading }] = useBalance({
    addressOrName: accountData?.address,
    watch: true,
  });

  const loading = (accountLoading || balanceLoading) && !balanceData;

  const renderContent = () => {
    if (loading) return <Loader size={8} />;
    if (balanceData) {
      return (
        <>
          <h1 className="mb-8 text-4xl font-bold">My Wallet</h1>
          <div className="inline-flex place-items-center">
            <h6 className="ml-2 text-2xl">{`Ξ ${Number(
              balanceData?.formatted
            ).toFixed(4)} ${balanceData?.symbol}`}</h6>
          </div>
        </>
      );
    }

    return (
      <>
        <h1 className="mb-8 text-4xl font-bold">
          Welcome to the NextJS wagmi template!
        </h1>
        <Button
          loading={accountLoading}
          onClick={() => setShowWalletOptions(true)}
        >
          Connect to Wallet
        </Button>
      </>
    );
  };

  let selectedListOfCountries = ["AFG", "GHA"];

  // use this to simulate the game display
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log('This will run every second!');
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <>
      <WalletOptionsModal
        open={showWalletOptions}
        setOpen={setShowWalletOptions}
      />

      <Layout
        showWalletOptions={showWalletOptions}
        setShowWalletOptions={setShowWalletOptions}
      >
        <div className="grid h-screen place-items-center">
          {/* <div className="grid place-items-center">{renderContent()}</div> */}
          <div className="p-20 border w-full">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 100,
              }}
            >
              <ZoomableGroup>
                <Geographies geography="./countries.json">
                  {({ geographies }) => {
                    return geographies.map((geo) => {
                      let isSelected = selectedListOfCountries.includes(geo.id);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={{
                            default: {
                              fill: isSelected ? "#586AE8" : "#D6D6DA",
                              stroke: "#FFF",
                              outline: "none",
                            },
                            hover: { fill: "#04D", outline: "none" },
                            pressed: { fill: "#02A", outline: "none" },
                          }}
                          onClick={(_) => {
                            setSelectedCountryName(geo.properties.name);
                            setSelectedIsoCode(geo.id);
                            setOpenBidModal(true);
                          }}
                        />
                      );
                    });
                  }}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
          {/* <SVGmap /> */}
        </div>
      </Layout>
      <BidModal
        open={openBidModal}
        setOpen={setOpenBidModal}
        isoCode={selectedIsoCode}
        selectedCountryName={selectedCountryName}
      />
    </>
  );
};

export default Home;
