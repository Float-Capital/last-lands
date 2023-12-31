@val external jsArrayCreate: int => array<'a> = "Array"

/* Given a comaprator and two sorted lists, combine them into a single sorted list */
let mergeSorted = (f: 'a => 'b, xs: array<'a>, ys: array<'a>) => {
  if Array.length(xs) == 0 {
    ys
  } else if Array.length(ys) == 0 {
    xs
  } else {
    let n = Array.length(xs) + Array.length(ys)
    let result = jsArrayCreate(n)

    let rec loop = (i, j, k) => {
      if i < Array.length(xs) && j < Array.length(ys) {
        if f(xs[i]) <= f(ys[j]) {
          result[k] = xs[i]
          loop(i + 1, j, k + 1)
        } else {
          result[k] = ys[j]
          loop(i, j + 1, k + 1)
        }
      } else if i < Array.length(xs) {
        result[k] = xs[i]
        loop(i + 1, j, k + 1)
      } else if j < Array.length(ys) {
        result[k] = ys[j]
        loop(i, j + 1, k + 1)
      }
    }

    loop(0, 0, 0)
    result
  }
}

type promiseWithHandles<'a> = {
  pendingPromise: promise<'a>,
  resolve: 'a => unit,
  reject: exn => unit,
}

let createPromiseWithHandles = () => {
  //Create a placeholder resovle
  let resolveRef = ref(None)
  let rejectRef = ref(None)

  let pendingPromise = Promise.make((resolve, reject) => {
    resolveRef := Some(resolve)
    rejectRef := Some(reject)
  })

  let resolve = (val: 'a) => {
    let res = resolveRef.contents->Belt.Option.getUnsafe
    res(. val)
  }

  let reject = (exn: exn) => {
    let rej = rejectRef.contents->Belt.Option.getUnsafe
    rej(. exn)
  }

  {
    pendingPromise,
    resolve,
    reject,
  }
}

let mapArrayOfResults = (results: array<result<'a, 'b>>): result<array<'a>, 'b> => {
  results->Belt.Array.reduce(Ok([]), (accum, nextItem) => {
    accum->Belt.Result.flatMap(currentOkItems => {
      nextItem->Belt.Result.map(item => Belt.Array.concat(currentOkItems, [item]))
    })
  })
}

let optionMapNone = (opt: option<'a>, val: 'b): option<'b> => {
  switch opt {
  | None => Some(val)
  | Some(_) => None
  }
}
