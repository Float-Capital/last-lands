module InMemoryStore = {
  let entityCurrentCrud = (currentCrud: option<Types.dbOp>, nextCrud: Types.dbOp): Types.dbOp => {
    switch (currentCrud, nextCrud) {
    | (Some(Set), Read)
    | (_, Set) =>
      Set
    | (Some(Read), Read) => Read
    | (Some(Delete), Read)
    | (_, Delete) =>
      Delete
    | (None, _) => nextCrud
    }
  }

  module type StoreItem = {
    type t
    type key
    let hasher: key => string
  }

  module MakeStore = (StoreItem: StoreItem) => {
    type value = StoreItem.t
    type key = StoreItem.key
    type hasher = StoreItem.key => string
    type t = {
      dict: Js.Dict.t<Types.inMemoryStoreRow<StoreItem.t>>,
      hasher: hasher,
    }

    let make = (): t => {dict: Js.Dict.empty(), hasher: StoreItem.hasher}

    let set = (self: t, ~key: StoreItem.key, ~dbOp, ~entity: StoreItem.t) =>
      self.dict->Js.Dict.set(key->self.hasher, {entity, dbOp})

    let get = (self: t, key: StoreItem.key) =>
      self.dict->Js.Dict.get(key->self.hasher)->Belt.Option.map(row => row.entity)

    let values = (self: t) => self.dict->Js.Dict.values
  }

  module EventSyncState = MakeStore({
    type t = DbFunctions.EventSyncState.eventSyncState
    type key = int
    let hasher = Belt.Int.toString
  })

  type rawEventsKey = {
    chainId: int,
    eventId: string,
  }

  module RawEvents = MakeStore({
    type t = Types.rawEventsEntity
    type key = rawEventsKey
    let hasher = (key: key) =>
      EventUtils.getEventIdKeyString(~chainId=key.chainId, ~eventId=key.eventId)
  })

  type dynamicContractRegistryKey = {
    chainId: int,
    contractAddress: Ethers.ethAddress,
  }

  module DynamicContractRegistry = MakeStore({
    type t = Types.dynamicContractRegistryEntity
    type key = dynamicContractRegistryKey
    let hasher = ({chainId, contractAddress}) =>
      EventUtils.getContractAddressKeyString(~chainId, ~contractAddress)
  })

  module GlobalState = MakeStore({
    type t = Types.globalStateEntity
    type key = string
    let hasher = Obj.magic
  })

  type t = {
    eventSyncState: EventSyncState.t,
    rawEvents: RawEvents.t,
    dynamicContractRegistry: DynamicContractRegistry.t,
    globalState: GlobalState.t,
  }

  let make = (): t => {
    eventSyncState: EventSyncState.make(),
    rawEvents: RawEvents.make(),
    dynamicContractRegistry: DynamicContractRegistry.make(),
    globalState: GlobalState.make(),
  }
}

type uniqueEntityReadIds = Js.Dict.t<Types.id>
type allEntityReads = Js.Dict.t<uniqueEntityReadIds>

let loadEntities = async (
  sql,
  ~inMemoryStore: InMemoryStore.t,
  ~entityBatch: array<Types.entityRead>,
) => {
  let loadLayer = ref(false)

  let uniqueGlobalStateDict = Js.Dict.empty()

  let populateLoadAsEntityFunctions: ref<array<unit => unit>> = ref([])

  let uniqueGlobalStateAsEntityFieldArray: ref<array<string>> = ref([])

  @warning("-39")
  let rec globalStateLinkedEntityLoader = (entityId: string) => {
    if !loadLayer.contents {
      // NOTE: Always set this to true if it is false, I'm sure there are optimizations. Correctness over optimization for now.
      loadLayer := true
    }
    if Js.Dict.get(uniqueGlobalStateDict, entityId)->Belt.Option.isNone {
      let _ = uniqueGlobalStateAsEntityFieldArray.contents->Js.Array2.push(entityId)
      let _ = Js.Dict.set(uniqueGlobalStateDict, entityId, entityId)
    }

    ()
  }

  @warning("+39")
  (
    entityBatch
    ->Belt.Array.forEach(readEntity => {
      switch readEntity {
      | GlobalStateRead(entityId) => globalStateLinkedEntityLoader(entityId)
      }
    })
  )

  while loadLayer.contents {
    loadLayer := false

    if uniqueGlobalStateAsEntityFieldArray.contents->Array.length > 0 {
      let globalStateFieldEntitiesArray =
        await sql->DbFunctions.GlobalState.readGlobalStateEntities(
          uniqueGlobalStateAsEntityFieldArray.contents,
        )

      globalStateFieldEntitiesArray->Belt.Array.forEach(readRow => {
        let {entity} = DbFunctions.GlobalState.readRowToReadEntityData(readRow)

        inMemoryStore.globalState->InMemoryStore.GlobalState.set(
          ~key=entity.id,
          ~entity,
          ~dbOp=Types.Read,
        )
      })

      uniqueGlobalStateAsEntityFieldArray := []
    }

    let functionsToExecute = populateLoadAsEntityFunctions.contents

    populateLoadAsEntityFunctions := []

    functionsToExecute->Belt.Array.forEach(func => func())
  }
}

let executeEntityFunction = (
  sql: Postgres.sql,
  ~rows: array<Types.inMemoryStoreRow<'a>>,
  ~dbOp: Types.dbOp,
  ~dbFunction: (Postgres.sql, array<'b>) => promise<unit>,
  ~getInputValFromRow: Types.inMemoryStoreRow<'a> => 'b,
) => {
  let entityIds =
    rows->Belt.Array.keepMap(row => row.dbOp == dbOp ? Some(row->getInputValFromRow) : None)

  if entityIds->Array.length > 0 {
    sql->dbFunction(entityIds)
  } else {
    Promise.resolve()
  }
}

let executeSet = executeEntityFunction(~dbOp=Set)
let executeDelete = executeEntityFunction(~dbOp=Delete)

let executeSetSchemaEntity = (~entityEncoder) =>
  executeSet(~getInputValFromRow=row => {
    row.entity->entityEncoder
  })

let executeBatch = async (sql, ~inMemoryStore: InMemoryStore.t) => {
  let setEventSyncState = executeSet(
    ~dbFunction=DbFunctions.EventSyncState.batchSetEventSyncState,
    ~getInputValFromRow=row => row.entity,
    ~rows=inMemoryStore.eventSyncState->InMemoryStore.EventSyncState.values,
  )

  let setRawEvents = executeSet(
    ~dbFunction=DbFunctions.RawEvents.batchSetRawEvents,
    ~getInputValFromRow=row => row.entity,
    ~rows=inMemoryStore.rawEvents->InMemoryStore.RawEvents.values,
  )

  let setDynamicContracts = executeSet(
    ~dbFunction=DbFunctions.DynamicContractRegistry.batchSetDynamicContractRegistry,
    ~rows=inMemoryStore.dynamicContractRegistry->InMemoryStore.DynamicContractRegistry.values,
    ~getInputValFromRow={row => row.entity},
  )

  let deleteGlobalStates = executeDelete(
    ~dbFunction=DbFunctions.GlobalState.batchDeleteGlobalState,
    ~rows=inMemoryStore.globalState->InMemoryStore.GlobalState.values,
    ~getInputValFromRow={row => row.entity.id},
  )

  let setGlobalStates = executeSetSchemaEntity(
    ~dbFunction=DbFunctions.GlobalState.batchSetGlobalState,
    ~rows=inMemoryStore.globalState->InMemoryStore.GlobalState.values,
    ~entityEncoder=Types.globalStateEntity_encode,
  )

  let res = await sql->Postgres.beginSql(sql => {
    [
      setEventSyncState,
      setRawEvents,
      setDynamicContracts,
      deleteGlobalStates,
      setGlobalStates,
    ]->Belt.Array.map(dbFunc => sql->dbFunc)
  })

  res
}
