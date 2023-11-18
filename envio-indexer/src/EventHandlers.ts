import {
  // NounsAuctionHouseContract_AuctionCreated_loader,
  // NounsAuctionHouseContract_AuctionCreated_handler,
  // NounsAuctionHouseContract_AuctionBid_loader,
  // NounsAuctionHouseContract_AuctionBid_handler,
  NounsTokenContract_NounCreated_loader,
  NounsTokenContract_NounCreated_handler,
} from "../generated/src/Handlers.gen";

import {
  // AuctionEntity
  GlobalStateEntity,
} from "../generated/src/Types.gen";

const globalStateId = "singleton";

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

let mapIdToIsoCode = (tokenId: any) => {
  let isoCode = countryIsoCodes[Number(tokenId)];
  if (isoCode == null) {
    return "NOT";
  } else {
    return isoCode;
  }
};

NounsTokenContract_NounCreated_loader(({ event, context }) => {
  context.GlobalState.load(globalStateId);
});

NounsTokenContract_NounCreated_handler(({ event, context }) => {
  let globalState = context.GlobalState.get(globalStateId);

  if (globalState == null) {
    //create
    let globalObject: GlobalStateEntity = {
      id: globalStateId,
      mintedLand: [event.params.tokenId],
      mintedLandIsoCodes: [mapIdToIsoCode(event.params.tokenId)],
    };

    context.GlobalState.set(globalObject);
  } else {
    //update

    globalState.mintedLand.push(event.params.tokenId);
    globalState.mintedLandIsoCodes.push(mapIdToIsoCode(event.params.tokenId));

    let globalObject: GlobalStateEntity = {
      ...globalState,
      mintedLand: globalState.mintedLand,
      mintedLandIsoCodes: globalState.mintedLandIsoCodes,
    };

    context.GlobalState.set(globalObject);
  }
});

// NounsAuctionHouseContract_AuctionCreated_loader(({ event, context }) => {});

// NounsAuctionHouseContract_AuctionCreated_handler(({ event, context }) => {
//   let auctionObject: AuctionEntity = {
//     id: event.blockTimestamp.toString(),
//     startTime: event.params.startTime,
//     endTime: event.params.endTime,
//   };

//   context.Auction.set(auctionObject);
// });

// NounsAuctionHouseContract_AuctionCreated_loader(({ event, context }) => {});

// NounsAuctionHouseContract_AuctionCreated_handler(({ event, context }) => {
//   let auctionObject: AuctionEntity = {
//     id: event.blockTimestamp.toString(),
//     startTime: event.params.startTime,
//     endTime: event.params.endTime,
//   };

//   context.Auction.set(auctionObject);
// });

// NounsAuctionHouseContract_AuctionCreated_loader(({ event, context }) => {
//   context.Greeting.load(event.params.user.toString());
// });

// NounsAuctionHouseContract_AuctionCreated_handler(({ event, context }) => {
//   let currentGreeter = context.Greeting.get(event.params.user);

//   if (currentGreeter != null) {
//     let greetingObject: GreetingEntity = {
//       id: event.params.user.toString(),
//       latestGreeting: event.params.greeting,
//       numberOfGreetings: currentGreeter.numberOfGreetings + 1,
//       greetings: [...currentGreeter.greetings, event.params.greeting],
//     };

//     context.Greeting.set(greetingObject);
//   } else {
//     let greetingObject: GreetingEntity = {
//       id: event.params.user.toString(),
//       latestGreeting: event.params.greeting,
//       numberOfGreetings: 1,
//       greetings: [event.params.greeting],
//     };
//     context.Greeting.set(greetingObject);
//   }
// });
