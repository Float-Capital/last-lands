// TODO: move to `eventFetching`

let nounsTokenAbi = `
[{"type":"event","name":"NounCreated","inputs":[{"name":"tokenId","type":"uint256","indexed":true}],"anonymous":false}]
`->Js.Json.parseExn
