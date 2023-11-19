module NounsTokenContract = {
  module NounCreatedEvent = {
    type context = Types.NounsTokenContract.NounCreatedEvent.context

    type contextCreatorFunctions = {
      getLoaderContext: unit => Types.NounsTokenContract.NounCreatedEvent.loaderContext,
      //
      getContext: (unit, unit) => Types.NounsTokenContract.NounCreatedEvent.context,
      getEntitiesToLoad: unit => array<Types.entityRead>,
      getAddedDynamicContractRegistrations: unit => array<Types.dynamicContractRegistryEntity>,
    }
    let contextCreator: (
      ~inMemoryStore: IO.InMemoryStore.t,
      ~chainId: int,
      ~event: Types.eventLog<'a>,
      ~logger: Pino.t,
    ) => contextCreatorFunctions = (~inMemoryStore, ~chainId, ~event, ~logger) => {
      let logger =
        logger->Logging.createChildFrom(
          ~logger=_,
          ~params={"userLog": "NounsToken.NounCreated.context"},
        )
      let contextLogger: Logs.userLogger = {
        info: (message: string) => logger->Logging.uinfo(message),
        debug: (message: string) => logger->Logging.udebug(message),
        warn: (message: string) => logger->Logging.uwarn(message),
        error: (message: string) => logger->Logging.uerror(message),
        errorWithExn: (exn: option<Js.Exn.t>, message: string) =>
          logger->Logging.uerrorWithExn(exn, message),
      }

      let optSetOfIds_globalState: Set.t<Types.id> = Set.make()

      let entitiesToLoad: array<Types.entityRead> = []

      let addedDynamicContractRegistrations: array<Types.dynamicContractRegistryEntity> = []

      @warning("-16")
      let loaderContext: Types.NounsTokenContract.NounCreatedEvent.loaderContext = {
        log: contextLogger,
        contractRegistration: {
          //TODO only add contracts we've registered for the event in the config
          addNounsToken: (contractAddress: Ethers.ethAddress) => {
            let eventId = EventUtils.packEventIndex(
              ~blockNumber=event.blockNumber,
              ~logIndex=event.logIndex,
            )
            let dynamicContractRegistration: Types.dynamicContractRegistryEntity = {
              chainId,
              eventId,
              contractAddress,
              contractType: "NounsToken",
            }

            addedDynamicContractRegistrations->Js.Array2.push(dynamicContractRegistration)->ignore

            inMemoryStore.dynamicContractRegistry->IO.InMemoryStore.DynamicContractRegistry.set(
              ~key={chainId, contractAddress},
              ~entity=dynamicContractRegistration,
              ~dbOp=Set,
            )
          },
        },
        globalState: {
          load: (id: Types.id) => {
            let _ = optSetOfIds_globalState->Set.add(id)
            let _ = Js.Array2.push(entitiesToLoad, Types.GlobalStateRead(id))
          },
        },
      }

      let getHandlerContext: unit => Types.NounsTokenContract.NounCreatedEvent.context = () => {
        {
          log: contextLogger,
          globalState: {
            set: entity => {
              inMemoryStore.globalState->IO.InMemoryStore.GlobalState.set(
                ~key=entity.id,
                ~entity,
                ~dbOp=Types.Set,
              )
            },
            delete: id =>
              Logging.warn(
                `[unimplemented delete] can't delete entity(globalState) with ID ${id}.`,
              ),
            get: (id: Types.id) => {
              if optSetOfIds_globalState->Set.has(id) {
                inMemoryStore.globalState->IO.InMemoryStore.GlobalState.get(id)
              } else {
                Logging.warn(
                  `The loader for a "GlobalState" of entity with id "${id}" was not used please add it to your default loader function (ie. place 'context.globalState.load("${id}")' inside your loader) to avoid unexpected behaviour. This is a runtime validation check.`,
                )

                // NOTE: this will still retern the value if it exists in the in-memory store (despite the loader not being run).
                inMemoryStore.globalState->IO.InMemoryStore.GlobalState.get(id)

                // TODO: add a further step to syncronously try fetch this from the DB if it isn't in the in-memory store - similar to this PR: https://github.com/Float-Capital/indexer/pull/759
              }
            },
          },
        }
      }
      {
        getEntitiesToLoad: () => entitiesToLoad,
        getAddedDynamicContractRegistrations: () => addedDynamicContractRegistrations,
        getLoaderContext: () => loaderContext,
        getContext: () => {() => getHandlerContext()},
      }
    }
  }
}
