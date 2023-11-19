let registerNounsTokenHandlers = () => {
  try {
    let _ = %raw(`require("../../src/EventHandlers.ts")`)
  } catch {
  | err => {
      Logging.error(
        "EE500: There was an issue importing the handler file for NounsToken. Expected file at ../../src/EventHandlers.ts",
      )
      Js.log(err)
    }
  }
}

let registerAllHandlers = () => {
  registerNounsTokenHandlers()
}
