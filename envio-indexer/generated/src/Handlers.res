type functionRegister = Loader | Handler

let mapFunctionRegisterName = (functionRegister: functionRegister) => {
  switch functionRegister {
  | Loader => "Loader"
  | Handler => "Handler"
  }
}

// This set makes sure that the warning doesn't print for every event of a type, but rather only prints the first time.
let hasPrintedWarning = Set.make()

let getDefaultLoaderHandler: (
  ~functionRegister: functionRegister,
  ~eventName: string,
  ~event: 'a,
  ~context: 'b,
) => unit = (~functionRegister, ~eventName, ~event as _, ~context as _) => {
  let functionName = mapFunctionRegisterName(functionRegister)

  // Here we use this key to prevent flooding the users terminal with
  let repeatKey = `${eventName}-${functionName}`
  if !(hasPrintedWarning->Set.has(repeatKey)) {
    Logging.warn(
      // TODO: link to our docs.
      `Ignored ${eventName} event, as there is no ${functionName} registered. You need to implement a ${eventName}${functionName} method in your handler file. This will apply to all future ${eventName} events.`,
    )
    let _ = hasPrintedWarning->Set.add(repeatKey)
  }
}

module NounsTokenContract = {
  module NounCreated = {
    %%private(
      let nounCreatedLoader = ref(None)
      let nounCreatedHandler = ref(None)
    )

    @genType
    let loader = (
      userLoader: (
        ~event: Types.eventLog<Types.NounsTokenContract.NounCreatedEvent.eventArgs>,
        ~context: Types.NounsTokenContract.NounCreatedEvent.loaderContext,
      ) => unit,
    ) => {
      nounCreatedLoader := Some(userLoader)
    }

    @genType
    let handler = (
      userHandler: (
        ~event: Types.eventLog<Types.NounsTokenContract.NounCreatedEvent.eventArgs>,
        ~context: Types.NounsTokenContract.NounCreatedEvent.context,
      ) => unit,
    ) => {
      nounCreatedHandler := Some(userHandler)
    }

    let getLoader = () =>
      nounCreatedLoader.contents->Belt.Option.getWithDefault(
        getDefaultLoaderHandler(~eventName="NounCreated", ~functionRegister=Loader),
      )

    let getHandler = () =>
      nounCreatedHandler.contents->Belt.Option.getWithDefault(
        getDefaultLoaderHandler(~eventName="NounCreated", ~functionRegister=Handler),
      )
  }
}
