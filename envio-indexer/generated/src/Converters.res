exception UndefinedEvent(string)

let eventStringToEvent = (eventName: string, contractName: string): Types.eventName => {
  switch (eventName, contractName) {
  | ("NounCreated", "NounsToken") => NounsToken_NounCreated
  | _ => UndefinedEvent(eventName)->raise
  }
}

module NounsToken = {
  let convertNounCreatedViemDecodedEvent: Viem.decodedEvent<'a> => Viem.decodedEvent<
    Types.NounsTokenContract.NounCreatedEvent.eventArgs,
  > = Obj.magic

  let convertNounCreatedLogDescription = (log: Ethers.logDescription<'a>): Ethers.logDescription<
    Types.NounsTokenContract.NounCreatedEvent.eventArgs,
  > => {
    //Convert from the ethersLog type with indexs as keys to named key value object
    let ethersLog: Ethers.logDescription<
      Types.NounsTokenContract.NounCreatedEvent.ethersEventArgs,
    > =
      log->Obj.magic
    let {args, name, signature, topic} = ethersLog

    {
      name,
      signature,
      topic,
      args: {
        tokenId: args.tokenId,
      },
    }
  }

  let convertNounCreatedLog = (
    logDescription: Ethers.logDescription<Types.NounsTokenContract.NounCreatedEvent.eventArgs>,
    ~log: Ethers.log,
    ~blockTimestamp: int,
  ) => {
    let params: Types.NounsTokenContract.NounCreatedEvent.eventArgs = {
      tokenId: logDescription.args.tokenId,
    }

    let nounCreatedLog: Types.eventLog<Types.NounsTokenContract.NounCreatedEvent.eventArgs> = {
      params,
      blockNumber: log.blockNumber,
      blockTimestamp,
      blockHash: log.blockHash,
      srcAddress: log.address,
      transactionHash: log.transactionHash,
      transactionIndex: log.transactionIndex,
      logIndex: log.logIndex,
    }

    Types.NounsTokenContract_NounCreated(nounCreatedLog)
  }
  let convertNounCreatedLogViem = (
    decodedEvent: Viem.decodedEvent<Types.NounsTokenContract.NounCreatedEvent.eventArgs>,
    ~log: Ethers.log,
    ~blockTimestamp: int,
  ) => {
    let params: Types.NounsTokenContract.NounCreatedEvent.eventArgs = {
      tokenId: decodedEvent.args.tokenId,
    }

    let nounCreatedLog: Types.eventLog<Types.NounsTokenContract.NounCreatedEvent.eventArgs> = {
      params,
      blockNumber: log.blockNumber,
      blockTimestamp,
      blockHash: log.blockHash,
      srcAddress: log.address,
      transactionHash: log.transactionHash,
      transactionIndex: log.transactionIndex,
      logIndex: log.logIndex,
    }

    Types.NounsTokenContract_NounCreated(nounCreatedLog)
  }
}

type parseEventError =
  ParseError(Ethers.Interface.parseLogError) | UnregisteredContract(Ethers.ethAddress)

exception ParseEventErrorExn(parseEventError)

let parseEventEthers = (~log, ~blockTimestamp, ~contractInterfaceManager): Belt.Result.t<
  Types.event,
  _,
> => {
  let logDescriptionResult = contractInterfaceManager->ContractInterfaceManager.parseLogEthers(~log)
  switch logDescriptionResult {
  | Error(e) =>
    switch e {
    | ParseError(parseError) => ParseError(parseError)
    | UndefinedInterface(contractAddress) => UnregisteredContract(contractAddress)
    }->Error

  | Ok(logDescription) =>
    switch contractInterfaceManager->ContractInterfaceManager.getContractNameFromAddress(
      ~contractAddress=log.address,
    ) {
    | None => Error(UnregisteredContract(log.address))
    | Some(contractName) =>
      let event = switch eventStringToEvent(logDescription.name, contractName) {
      | NounsToken_NounCreated =>
        logDescription
        ->NounsToken.convertNounCreatedLogDescription
        ->NounsToken.convertNounCreatedLog(~log, ~blockTimestamp)
      }

      Ok(event)
    }
  }
}

let parseEvent = (~log, ~blockTimestamp, ~contractInterfaceManager): Belt.Result.t<
  Types.event,
  _,
> => {
  let decodedEventResult = contractInterfaceManager->ContractInterfaceManager.parseLogViem(~log)
  switch decodedEventResult {
  | Error(e) =>
    switch e {
    | ParseError(parseError) => ParseError(parseError)
    | UndefinedInterface(contractAddress) => UnregisteredContract(contractAddress)
    }->Error

  | Ok(decodedEvent) =>
    switch contractInterfaceManager->ContractInterfaceManager.getContractNameFromAddress(
      ~contractAddress=log.address,
    ) {
    | None => Error(UnregisteredContract(log.address))
    | Some(contractName) =>
      let event = switch eventStringToEvent(decodedEvent.eventName, contractName) {
      | NounsToken_NounCreated =>
        decodedEvent
        ->NounsToken.convertNounCreatedViemDecodedEvent
        ->NounsToken.convertNounCreatedLogViem(~log, ~blockTimestamp)
      }

      Ok(event)
    }
  }
}

let decodeRawEventWith = (
  rawEvent: Types.rawEventsEntity,
  ~decoder: Spice.decoder<'a>,
  ~variantAccessor: Types.eventLog<'a> => Types.event,
): Spice.result<Types.eventBatchQueueItem> => {
  switch rawEvent.params->Js.Json.parseExn {
  | exception exn =>
    let message =
      exn
      ->Js.Exn.asJsExn
      ->Belt.Option.flatMap(jsexn => jsexn->Js.Exn.message)
      ->Belt.Option.getWithDefault("No message on exn")

    Spice.error(`Failed at JSON.parse. Error: ${message}`, rawEvent.params->Obj.magic)
  | v => Ok(v)
  }
  ->Belt.Result.flatMap(json => {
    json->decoder
  })
  ->Belt.Result.map(params => {
    let event = {
      blockNumber: rawEvent.blockNumber,
      blockTimestamp: rawEvent.blockTimestamp,
      blockHash: rawEvent.blockHash,
      srcAddress: rawEvent.srcAddress,
      transactionHash: rawEvent.transactionHash,
      transactionIndex: rawEvent.transactionIndex,
      logIndex: rawEvent.logIndex,
      params,
    }->variantAccessor

    let queueItem: Types.eventBatchQueueItem = {
      timestamp: rawEvent.blockTimestamp,
      chainId: rawEvent.chainId,
      blockNumber: rawEvent.blockNumber,
      logIndex: rawEvent.logIndex,
      event,
    }

    queueItem
  })
}

let parseRawEvent = (rawEvent: Types.rawEventsEntity): Spice.result<Types.eventBatchQueueItem> => {
  rawEvent.eventType
  ->Types.eventName_decode
  ->Belt.Result.flatMap(eventName => {
    switch eventName {
    | NounsToken_NounCreated =>
      rawEvent->decodeRawEventWith(
        ~decoder=Types.NounsTokenContract.NounCreatedEvent.eventArgs_decode,
        ~variantAccessor=Types.nounsTokenContract_NounCreated,
      )
    }
  })
}
