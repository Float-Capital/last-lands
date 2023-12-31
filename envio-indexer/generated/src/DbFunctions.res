let config: Postgres.poolConfig = {
  ...Config.db,
  transform: {undefined: Js.null},
}
let sql = Postgres.makeSql(~config)

type chainId = int
type eventId = string
type blockNumberRow = {@as("block_number") blockNumber: int}

module ChainMetadata = {
  type chainMetadata = {
    @as("chain_id") chainId: int,
    @as("block_height") blockHeight: int,
    @as("start_block") startBlock: int,
  }

  @module("./DbFunctionsImplementation.js")
  external setChainMetadata: (Postgres.sql, chainMetadata) => promise<unit> = "setChainMetadata"

  let setChainMetadataRow = (~chainId, ~startBlock, ~blockHeight) => {
    sql->setChainMetadata({chainId, startBlock, blockHeight})
  }
}

module EventSyncState = {
  type eventSyncState = {
    @as("chain_id") chainId: int,
    @as("block_number") blockNumber: int,
    @as("log_index") logIndex: int,
    @as("transaction_index") transactionIndex: int,
    @as("block_timestamp") blockTimestamp: int,
  }
  @module("./DbFunctionsImplementation.js")
  external readLatestSyncedEventOnChainIdArr: (
    Postgres.sql,
    ~chainId: int,
  ) => promise<array<eventSyncState>> = "readLatestSyncedEventOnChainId"

  let readLatestSyncedEventOnChainId = async (sql, ~chainId) => {
    let arr = await sql->readLatestSyncedEventOnChainIdArr(~chainId)
    arr->Belt.Array.get(0)
  }

  let getLatestProcessedBlockNumber = async (~chainId) => {
    let latestEventOpt = await sql->readLatestSyncedEventOnChainId(~chainId)
    latestEventOpt->Belt.Option.map(event => event.blockNumber)
  }

  @module("./DbFunctionsImplementation.js")
  external batchSetEventSyncState: (Postgres.sql, array<eventSyncState>) => promise<unit> =
    "batchSetEventSyncState"
}

module RawEvents = {
  type rawEventRowId = (chainId, eventId)
  @module("./DbFunctionsImplementation.js")
  external batchSetRawEvents: (Postgres.sql, array<Types.rawEventsEntity>) => promise<unit> =
    "batchSetRawEvents"

  @module("./DbFunctionsImplementation.js")
  external batchDeleteRawEvents: (Postgres.sql, array<rawEventRowId>) => promise<unit> =
    "batchDeleteRawEvents"

  @module("./DbFunctionsImplementation.js")
  external readRawEventsEntities: (
    Postgres.sql,
    array<rawEventRowId>,
  ) => promise<array<Types.rawEventsEntity>> = "readRawEventsEntities"

  @module("./DbFunctionsImplementation.js")
  external getRawEventsPageGtOrEqEventId: (
    Postgres.sql,
    ~chainId: chainId,
    ~eventId: Ethers.BigInt.t,
    ~limit: int,
    ~contractAddresses: array<Ethers.ethAddress>,
  ) => promise<array<Types.rawEventsEntity>> = "getRawEventsPageGtOrEqEventId"

  @module("./DbFunctionsImplementation.js")
  external getRawEventsPageWithinEventIdRangeInclusive: (
    Postgres.sql,
    ~chainId: chainId,
    ~fromEventIdInclusive: Ethers.BigInt.t,
    ~toEventIdInclusive: Ethers.BigInt.t,
    ~limit: int,
    ~contractAddresses: array<Ethers.ethAddress>,
  ) => promise<array<Types.rawEventsEntity>> = "getRawEventsPageWithinEventIdRangeInclusive"

  ///Returns an array with 1 block number (the highest processed on the given chainId)
  @module("./DbFunctionsImplementation.js")
  external readLatestRawEventsBlockNumberProcessedOnChainId: (
    Postgres.sql,
    chainId,
  ) => promise<array<blockNumberRow>> = "readLatestRawEventsBlockNumberProcessedOnChainId"

  let getLatestProcessedBlockNumber = async (~chainId) => {
    let row = await sql->readLatestRawEventsBlockNumberProcessedOnChainId(chainId)

    row->Belt.Array.get(0)->Belt.Option.map(row => row.blockNumber)
  }
}

module DynamicContractRegistry = {
  type contractAddress = Ethers.ethAddress
  type dynamicContractRegistryRowId = (chainId, contractAddress)
  @module("./DbFunctionsImplementation.js")
  external batchSetDynamicContractRegistry: (
    Postgres.sql,
    array<Types.dynamicContractRegistryEntity>,
  ) => promise<unit> = "batchSetDynamicContractRegistry"

  @module("./DbFunctionsImplementation.js")
  external batchDeleteDynamicContractRegistry: (
    Postgres.sql,
    array<dynamicContractRegistryRowId>,
  ) => promise<unit> = "batchDeleteDynamicContractRegistry"

  @module("./DbFunctionsImplementation.js")
  external readDynamicContractRegistryEntities: (
    Postgres.sql,
    array<dynamicContractRegistryRowId>,
  ) => promise<array<Types.dynamicContractRegistryEntity>> = "readDynamicContractRegistryEntities"

  type contractTypeAndAddress = {
    @as("contract_address") contractAddress: Ethers.ethAddress,
    @as("contract_type") contractType: string,
    @as("event_id") eventId: Ethers.BigInt.t,
  }
  ///Returns an array with 1 block number (the highest processed on the given chainId)
  @module("./DbFunctionsImplementation.js")
  external readDynamicContractsOnChainIdAtOrBeforeBlock: (
    Postgres.sql,
    ~chainId: chainId,
    ~startBlock: int,
  ) => promise<array<contractTypeAndAddress>> = "readDynamicContractsOnChainIdAtOrBeforeBlock"
}

type readEntityData<'a> = {entity: 'a}

module GlobalState = {
  open Types
  @spice
  type globalStateReadRow = {
    id: string,
    mintedLand: array<Ethers.BigInt.t>,
    mintedLandIsoCodes: array<string>,
  }

  let readRowToReadEntityData = (readRowJson: Js.Json.t): readEntityData<
    Types.globalStateEntity,
  > => {
    let readRow = switch readRowJson->globalStateReadRow_decode {
    | Ok(v) => Ok(v)
    | Error(e) =>
      Logging.error({
        "err": e,
        "msg": "EE700: Unable to parse row from database of entity globalState using spice",
        "raw_unparsed_object": readRowJson,
      })
      Error(e)
    }->Belt.Result.getExn

    let {id, mintedLand, mintedLandIsoCodes} = readRow

    {
      entity: {
        id,
        mintedLand,
        mintedLandIsoCodes,
      },
    }
  }

  @module("./DbFunctionsImplementation.js")
  external batchSetGlobalState: (Postgres.sql, array<Js.Json.t>) => promise<unit> =
    "batchSetGlobalState"

  @module("./DbFunctionsImplementation.js")
  external batchDeleteGlobalState: (Postgres.sql, array<Types.id>) => promise<unit> =
    "batchDeleteGlobalState"

  @module("./DbFunctionsImplementation.js")
  external readGlobalStateEntities: (Postgres.sql, array<Types.id>) => promise<array<Js.Json.t>> =
    "readGlobalStateEntities"
}
