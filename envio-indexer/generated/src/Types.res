//*************
//***ENTITIES**
//*************

@spice @genType.as("Id")
type id = string

@genType.import(("./bindings/OpaqueTypes", "Nullable"))
type nullable<'a> = option<'a>

let nullable_encode = (encoder: Spice.encoder<'a>, n: nullable<'a>): Js.Json.t =>
  switch n {
  | None => Js.Json.null
  | Some(v) => v->encoder
  }

let nullable_decode = Spice.optionFromJson

//nested subrecord types

@@warning("-30")
@genType
type rec globalStateLoaderConfig = bool

@@warning("+30")

type entityRead = GlobalStateRead(id)

type rawEventsEntity = {
  @as("chain_id") chainId: int,
  @as("event_id") eventId: string,
  @as("block_number") blockNumber: int,
  @as("log_index") logIndex: int,
  @as("transaction_index") transactionIndex: int,
  @as("transaction_hash") transactionHash: string,
  @as("src_address") srcAddress: Ethers.ethAddress,
  @as("block_hash") blockHash: string,
  @as("block_timestamp") blockTimestamp: int,
  @as("event_type") eventType: Js.Json.t,
  params: string,
}

type dynamicContractRegistryEntity = {
  @as("chain_id") chainId: int,
  @as("event_id") eventId: Ethers.BigInt.t,
  @as("contract_address") contractAddress: Ethers.ethAddress,
  @as("contract_type") contractType: string,
}

@spice @genType.as("GlobalStateEntity")
type globalStateEntity = {
  id: string,
  mintedLand: array<Ethers.BigInt.t>,
  mintedLandIsoCodes: array<string>,
}

type entity = GlobalStateEntity(globalStateEntity)

type dbOp = Read | Set | Delete

type inMemoryStoreRow<'a> = {
  dbOp: dbOp,
  entity: 'a,
}

//*************
//**CONTRACTS**
//*************

@genType.as("EventLog")
type eventLog<'a> = {
  params: 'a,
  blockNumber: int,
  blockTimestamp: int,
  blockHash: string,
  srcAddress: Ethers.ethAddress,
  transactionHash: string,
  transactionIndex: int,
  logIndex: int,
}

module NounsTokenContract = {
  module NounCreatedEvent = {
    //Note: each parameter is using a binding of its index to help with binding in ethers
    //This handles both unamed params and also named params that clash with reserved keywords
    //eg. if an event param is called "values" it will clash since eventArgs will have a '.values()' iterator
    type ethersEventArgs = {@as("0") tokenId: Ethers.BigInt.t}

    @spice @genType
    type eventArgs = {tokenId: Ethers.BigInt.t}

    @genType.as("NounsTokenContract_NounCreated_EventLog")
    type log = eventLog<eventArgs>

    type globalStateEntityHandlerContext = {
      get: id => option<globalStateEntity>,
      set: globalStateEntity => unit,
      delete: id => unit,
    }
    @genType
    type context = {
      log: Logs.userLogger,
      @as("GlobalState") globalState: globalStateEntityHandlerContext,
    }

    @genType
    type globalStateEntityLoaderContext = {load: id => unit}

    @genType
    type contractRegistrations = {
      //TODO only add contracts we've registered for the event in the config
      addNounsToken: Ethers.ethAddress => unit,
    }
    @genType
    type loaderContext = {
      log: Logs.userLogger,
      contractRegistration: contractRegistrations,
      @as("GlobalState") globalState: globalStateEntityLoaderContext,
    }
  }
}

@deriving(accessors)
type event = NounsTokenContract_NounCreated(eventLog<NounsTokenContract.NounCreatedEvent.eventArgs>)

type eventAndContext =
  | NounsTokenContract_NounCreatedWithContext(
      eventLog<NounsTokenContract.NounCreatedEvent.eventArgs>,
      unit => NounsTokenContract.NounCreatedEvent.context,
    )

type eventRouterEventAndContext = {
  chainId: int,
  event: eventAndContext,
}
@spice
type eventName = | @spice.as("NounsToken_NounCreated") NounsToken_NounCreated

let eventNameToString = (eventName: eventName) =>
  switch eventName {
  | NounsToken_NounCreated => "NounCreated"
  }

type chainId = int

type eventBatchQueueItem = {
  timestamp: int,
  chainId: int,
  blockNumber: int,
  logIndex: int,
  event: event,
}
