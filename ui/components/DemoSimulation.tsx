import { useState, useEffect } from "react";

import { Button, Loader, NameDisplayModal } from "../components";

import countriesData from "../public/countries.json";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const countriesList = countriesData.objects.world.geometries.map(
  (plek) => plek.id
);
shuffleArray(countriesList);

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap arr[i] and arr[j]
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

const DemoSimulation = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [dayCountdown, setDayCountDown] = useState(8); // hardcoded
  const [dayCountUp, setDayCountUp] = useState(0); // hardcoded

  const [auctionAnimationDone, setAuctionAnimationDone] = useState(false);

  // const [showList, setShowList] = useState(countriesList);
  const [showList, setShowList] = useState([]);

  const battleFrameRate = 1800;
  const auctionFrameRate = 120;

  useEffect(() => {
    if (!auctionAnimationDone) {
      const interval = setInterval(() => {
        setDayCountUp((dayCountUp) => dayCountUp + 2);
      }, auctionFrameRate);
      return () => {
        clearInterval(interval);
      };
    }
  }, [auctionAnimationDone]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("showList.length");
      console.log(showList.length);
      console.log(countriesList.length);
      if (showList.length < countriesList.length && !auctionAnimationDone) {
        setShowList((showList) => {
          let countryToAdd = countriesList[showList.length];

          showList.push(countryToAdd);
          return showList;
        });
      }
      if (showList.length >= countriesList.length) {
        setAuctionAnimationDone(true);
      }
    }, auctionFrameRate);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (auctionAnimationDone) {
      const interval = setInterval(() => {
        if (dayCountdown > 1) {
          setDayCountDown((dayCountdown) => dayCountdown - 1);
        }
      }, battleFrameRate);
      return () => {
        clearInterval(interval);
      };
    }
  }, [auctionAnimationDone]);

  useEffect(() => {
    if (auctionAnimationDone) {
      const interval = setInterval(() => {
        if (showList.length > 1) {
          setShowList((showList) => {
            const isOddAddition = showList.length % 2 != 0 ? 1 : 0;
            const middleIndex = Math.floor(
              (showList.length + isOddAddition) / 2
            );
            return showList.slice(0, middleIndex);
          });
          // setDayCountDown((dayCountdown) => dayCountdown - 1);
        }
      }, battleFrameRate);
      return () => {
        clearInterval(interval);
      };
    }
  }, [auctionAnimationDone]);

  return (
    <>
      <div className="grid h-screen place-items-center relative">
        <div className="absolute text-xl left-20 top-20">
          {auctionAnimationDone
            ? `Battle Day: ${dayCountdown > 0 ? dayCountdown : 0}`
            : `Auction Day: ${dayCountUp}`}
        </div>
        {showList.length < 300 ? (
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
                    // <Countries geographies={geographies} />;
                    return geographies.map((geo) => {
                      // let isSelected = selectedListOfCountries.includes(geo.id);
                      let isMeantToBeShown = showList.includes(geo.id);

                      console.log(dayCountUp);

                      return (
                        <Geography
                          key={geo.rsmKey + showList.Length}
                          geography={geo}
                          style={{
                            default: {
                              fill:
                                isMeantToBeShown && !auctionAnimationDone
                                  ? "#2c3265"
                                  : isMeantToBeShown
                                  ? "#586AE8"
                                  : "#EEE",
                              stroke:
                                isMeantToBeShown && !auctionAnimationDone
                                  ? "#ccc"
                                  : isMeantToBeShown
                                  ? "#FFF"
                                  : "",
                              outline: "none",
                            },
                            hover: { fill: "#04D", outline: "none" },
                            pressed: { fill: "#02A", outline: "none" },
                          }}
                          onClick={(_) => {
                            setSelectedCountryName(geo.properties.name);
                            setOpenModal(true);
                          }}
                        />
                      );
                    });
                  }}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        ) : null}
      </div>

      <NameDisplayModal
        open={openModal}
        setOpen={setOpenModal}
        selectedCountryName={selectedCountryName}
      />
    </>
  );
};

export default DemoSimulation;
