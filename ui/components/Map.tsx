import { useState } from "react";

import { Button, Loader, BidModal } from "../components";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const Map = () => {
  const [openBidModal, setOpenBidModal] = useState(false);
  const [selectedIsoCode, setSelectedIsoCode] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");

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
      </div>

      <BidModal
        open={openBidModal}
        setOpen={setOpenBidModal}
        isoCode={selectedIsoCode}
        selectedCountryName={selectedCountryName}
      />
    </>
  );
};

export default Map;
