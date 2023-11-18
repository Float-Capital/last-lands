import { useEffect, useState } from "react";

import { Button, Loader, BidModal } from "../components";
import { useAccount } from "wagmi";
const ethers = require("ethers");

const auctionContractAddress = "0x14d9eB937fc751C2c64Ff4add21601085d9E70E3";
const auctionContractABI = [
  "function createBid(uint256 nounId, uint256 bidValue) external",
  "function auction() view returns (tuple(uint256 nounId, uint256 amount, uint256 startTime, uint256 endTime, address bidder, bool settled))",
  "function settleCurrentAndCreateNewAuction() external",
  "function unpause() external",
  "function pause() external",
  "function endEarlySettleCurrentAndCreateNewAuction() public",
];

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Option } from "react-dropdown";

const countryIsoCodes = [
  "AFG",
  "AGO",
  "ALB",
  "ARE",
  "ARG",
  "ARM",
  "ATF",
  "AUS",
  "AUT",
  "AZE",
  "BDI",
  "BEL",
  "BEN",
  "BFA",
  "BGD",
  "BGR",
  "BHS",
  "BIH",
  "BLR",
  "BLZ",
  "BOL",
  "BRA",
  "BRN",
  "BTN",
  "BWA",
  "CAF",
  "CAN",
  "CHE",
  "CHL",
  "CHN",
  "CIV",
  "CMR",
  "COD",
  "COG",
  "COL",
  "CRI",
  "CUB",
  "CYP",
  "CZE",
  "DEU",
  "DJI",
  "DNK",
  "GRL",
  "DOM",
  "DZA",
  "ECU",
  "EGY",
  "ERI",
  "ESP",
  "EST",
  "ETH",
  "FIN",
  "FJI",
  "FRA",
  "GUF",
  "GAB",
  "GBR",
  "GEO",
  "GHA",
  "GIN",
  "GMB",
  "GNB",
  "GNQ",
  "GRC",
  "GTM",
  "GUY",
  "HND",
  "HRV",
  "HTI",
  "HUN",
  "IDN",
  "IND",
  "IRL",
  "IRN",
  "IRQ",
  "ISL",
  "ISR",
  "ITA",
  "JAM",
  "JOR",
  "JPN",
  "KAZ",
  "KEN",
  "KGZ",
  "KHM",
  "KOR",
  "XXK",
  "KWT",
  "LAO",
  "LBN",
  "LBR",
  "LBY",
  "LKA",
  "LSO",
  "LTU",
  "LUX",
  "LVA",
  "MAR",
  "MDA",
  "MDG",
  "MEX",
  "MKD",
  "MLI",
  "MMR",
  "MNE",
  "MNG",
  "MOZ",
  "MRT",
  "MWI",
  "MYS",
  "NAM",
  "NCL",
  "NER",
  "NGA",
  "NIC",
  "NLD",
  "NOR",
  "NPL",
  "NZL",
  "OMN",
  "PAK",
  "PAN",
  "PER",
  "PHL",
  "PNG",
  "POL",
  "PRI",
  "PRK",
  "PRT",
  "PRY",
  "QAT",
  "ROU",
  "RUS",
  "RWA",
  "ESH",
  "SAU",
  "SDN",
  "SSD",
  "SEN",
  "SLB",
  "SLE",
  "SLV",
  "SOM",
  "SRB",
  "SUR",
  "SVK",
  "SVN",
  "SWE",
  "SWZ",
  "SYR",
  "TCD",
  "TGO",
  "THA",
  "TJK",
  "TKM",
  "TLS",
  "TTO",
  "TUN",
  "TUR",
  "TWN",
  "TZA",
  "UGA",
  "UKR",
  "URY",
  "USA",
  "UZB",
  "VEN",
  "VNM",
  "VUT",
  "PSX",
  "YEM",
  "ZAF",
  "ZMB",
  "ZWE",
  "CPV",
  "COM",
  "MUS",
  "SYC",
  "BHR",
  "MDV",
  "MHL",
  "FSM",
  "NRU",
  "PLW",
  "WSM",
  "SGP",
  "TON",
  "TUV",
  "ATG",
  "BRB",
  "DMA",
  "GRD",
  "KNA",
  "LCA",
  "VCT",
  "AND",
  "LIE",
  "MLT",
  "MCO",
  "SMR",
  "KIR",
  "STP",
];

const countriesNames = {
  AFG: "Afghanistan",
  AGO: "Angola",
  ALB: "Albania",
  ARE: "United Arab Emirates",
  ARG: "Argentina",
  ARM: "Armenia",
  ATF: "French Southern Territories",
  AUS: "Australia",
  AUT: "Austria",
  AZE: "Azerbaijan",
  BDI: "Burundi",
  BEL: "Belgium",
  BEN: "Benin",
  BFA: "Burkina Faso",
  BGD: "Bangladesh",
  BGR: "Bulgaria",
  BHS: "Bahamas",
  BIH: "Bosnia and Herzegovina",
  BLR: "Belarus",
  BLZ: "Belize",
  BOL: "Bolivia",
  BRA: "Brazil",
  BRN: "Brunei",
  BTN: "Bhutan",
  BWA: "Botswana",
  CAF: "Central African Republic",
  CAN: "Canada",
  CHE: "Switzerland",
  CHL: "Chile",
  CHN: "China",
  CIV: "Cote d'Ivoire",
  CMR: "Cameroon",
  COD: "Democratic Republic of Congo",
  COG: "Congo",
  COL: "Colombia",
  CRI: "Costa Rica",
  CUB: "Cuba",
  CYP: "Cyprus",
  CZE: "Czechia",
  DEU: "Germany",
  DJI: "Djibouti",
  DNK: "Denmark",
  GRL: "Greenland",
  DOM: "Dominican Republic",
  DZA: "Algeria",
  ECU: "Ecuador",
  EGY: "Egypt",
  ERI: "Eritrea",
  ESP: "Spain",
  EST: "Estonia",
  ETH: "Ethiopia",
  FIN: "Finland",
  FJI: "Fiji",
  FRA: "France",
  GUF: "French Guiana",
  GAB: "Gabon",
  GBR: "United Kingdom",
  GEO: "Georgia",
  GHA: "Ghana",
  GIN: "Guinea",
  GMB: "Gambia",
  GNB: "Guinea-Bissau",
  GNQ: "Equatorial Guinea",
  GRC: "Greece",
  GTM: "Guatemala",
  GUY: "Guyana",
  HND: "Honduras",
  HRV: "Croatia",
  HTI: "Haiti",
  HUN: "Hungary",
  IDN: "Indonesia",
  IND: "India",
  IRL: "Ireland",
  IRN: "Iran",
  IRQ: "Iraq",
  ISL: "Iceland",
  ISR: "Israel",
  ITA: "Italy",
  JAM: "Jamaica",
  JOR: "Jordan",
  JPN: "Japan",
  KAZ: "Kazakhstan",
  KEN: "Kenya",
  KGZ: "Kyrgyzstan",
  KHM: "Cambodia",
  KOR: "South Korea",
  XXK: "Kosovo",
  KWT: "Kuwait",
  LAO: "Laos",
  LBN: "Lebanon",
  LBR: "Liberia",
  LBY: "Libya",
  LKA: "Sri Lanka",
  LSO: "Lesotho",
  LTU: "Lithuania",
  LUX: "Luxembourg",
  LVA: "Latvia",
  MAR: "Morocco",
  MDA: "Moldova",
  MDG: "Madagascar",
  MEX: "Mexico",
  MKD: "North Macedonia",
  MLI: "Mali",
  MMR: "Myanmar",
  MNE: "Montenegro",
  MNG: "Mongolia",
  MOZ: "Mozambique",
  MRT: "Mauritania",
  MWI: "Malawi",
  MYS: "Malaysia",
  NAM: "Namibia",
  NCL: "New Caledonia",
  NER: "Niger",
  NGA: "Nigeria",
  NIC: "Nicaragua",
  NLD: "Netherlands",
  NOR: "Norway",
  NPL: "Nepal",
  NZL: "New Zealand",
  OMN: "Oman",
  PAK: "Pakistan",
  PAN: "Panama",
  PER: "Peru",
  PHL: "Philippines",
  PNG: "Papua New Guinea",
  POL: "Poland",
  PRI: "Puerto Rico",
  PRK: "North Korea",
  PRT: "Portugal",
  PRY: "Paraguay",
  QAT: "Qatar",
  ROU: "Romania",
  RUS: "Russia",
  RWA: "Rwanda",
  ESH: "Western Sahara",
  SAU: "Saudi Arabia",
  SDN: "Sudan",
  SSD: "South Sudan",
  SEN: "Senegal",
  SLB: "Solomon Islands",
  SLE: "Sierra Leone",
  SLV: "El Salvador",
  SOM: "Somalia",
  SRB: "Serbia",
  SUR: "Suriname",
  SVK: "Slovakia",
  SVN: "Slovenia",
  SWE: "Sweden",
  SWZ: "Eswatini",
  SYR: "Syria",
  TCD: "Chad",
  TGO: "Togo",
  THA: "Thailand",
  TJK: "Tajikistan",
  TKM: "Turkmenistan",
  TLS: "Timor",
  TTO: "Trinidad and Tobago",
  TUN: "Tunisia",
  TUR: "Turkey",
  TWN: "Taiwan",
  TZA: "Tanzania",
  UGA: "Uganda",
  UKR: "Ukraine",
  URY: "Uruguay",
  USA: "United States",
  UZB: "Uzbekistan",
  VEN: "Venezuela",
  VNM: "Vietnam",
  VUT: "Vanuatu",
  PSX: "West Bank",
  YEM: "Yemen",
  ZAF: "South Africa",
  ZMB: "Zambia",
  ZWE: "Zimbabwe",
  CPV: "Cape Verde",
  COM: "Comoros",
  MUS: "Mauritius",
  SYC: "Seychelles",
  BHR: "Bahrain",
  MDV: "Maldives",
  MHL: "Marshall Islands",
  FSM: "Micronesia (country)",
  NRU: "Nauru",
  PLW: "Palau",
  WSM: "Samoa",
  SGP: "Singapore",
  TON: "Tonga",
  TUV: "Tuvalu",
  ATG: "Antigua and Barbuda",
  BRB: "Barbados",
  DMA: "Dominica",
  GRD: "Grenada",
  KNA: "Saint Kitts and Nevis",
  LCA: "Saint Lucia",
  VCT: "Saint Vincent and the Grenadines",
  AND: "Andorra",
  LIE: "Liechtenstein",
  MLT: "Malta",
  MCO: "Monaco",
  SMR: "San Marino",
  KIR: "Kiribati",
  STP: "Sao Tome and Principe",
};

const Map = () => {
  const [openBidModal, setOpenBidModal] = useState(false);
  const [selectedIsoCode, setSelectedIsoCode] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");

  const [{ data: accountData }] = useAccount();
  const [provider, setProvider] = useState<any>(null); // ethers.providers.Web3Provider
  const [optAuctionContract, setOptAuctionContract] = useState<any>(null); // ethers.Contract
  let [activeCountryCodeIndex, setActiveCountryCodeIndex] = useState<
    number | null | undefined
  >(undefined);

  useEffect(() => {
    let interval: any;
    let shouldStop = false;
    if (
      optAuctionContract == null ||
      optAuctionContract == undefined ||
      provider == null ||
      provider == undefined
    ) {
      const providerPromise = accountData?.connector?.getSigner();
      console.log("getting the signer");
      providerPromise?.then(async (provider) => {
        console.log("WE HAVE THE PROVIDER");
        setProvider(provider);
        console.log("provider", provider);

        const auctionContract = new ethers.Contract(
          auctionContractAddress,
          auctionContractABI,
          provider
        );

        setOptAuctionContract(auctionContract);
        console.log("We have the auctionContract");
      });
    } else {
      if (
        !shouldStop &&
        optAuctionContract != null &&
        optAuctionContract != undefined
      ) {
        interval = setInterval(async () => {
          console.log("checking the latest state of the auction");
          const auction = await optAuctionContract.auction();
          console.log(auction);
          const nounId = auction.nounId.toNumber();
          console.log("Processing auction for ", nounId);
          setActiveCountryCodeIndex(auction.nounId.toNumber());
        }, 2000);
      }
    }
    return () => {
      shouldStop = true;
      if (interval != null) {
        clearInterval(interval);
      }
    };
  }, [accountData, optAuctionContract]);

  let selectedListOfCountries = (!!activeCountryCodeIndex) ? countryIsoCodes.slice(0, activeCountryCodeIndex-1) : [];


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
                    let isActive = ((!!activeCountryCodeIndex) ? countryIsoCodes[activeCountryCodeIndex] : "null") == geo.id;
                    console.log("isActive", isActive, countryIsoCodes[activeCountryCodeIndex], geo.id, !!activeCountryCodeIndex ? countryIsoCodes[activeCountryCodeIndex] : "null")

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: isActive ? "#E81220" /*red*/ : (isSelected ? "#586AE8" : "#D6D6DA"),
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

      <div className="fixed bottom-0 right-0 p-5">
        <h2 className="text-2xl font-bold text-right">Bid on {(!!activeCountryCodeIndex) ? countriesNames[countryIsoCodes[activeCountryCodeIndex]]: "loading"}</h2>
        <button onClick={() => {
          optAuctionContract?.createBid(activeCountryCodeIndex, "100000000000000000", { gasLimit: 10000000 })
        }}>
          <Button loading={!activeCountryCodeIndex}>Place auto bid</Button>
        </button>
      </div>
    </>
  );
};

export default Map;
