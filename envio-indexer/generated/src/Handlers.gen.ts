/* TypeScript file generated from Handlers.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const HandlersBS = require('./Handlers.bs');

import type {NounsTokenContract_NounCreatedEvent_context as Types_NounsTokenContract_NounCreatedEvent_context} from './Types.gen';

import type {NounsTokenContract_NounCreatedEvent_eventArgs as Types_NounsTokenContract_NounCreatedEvent_eventArgs} from './Types.gen';

import type {NounsTokenContract_NounCreatedEvent_loaderContext as Types_NounsTokenContract_NounCreatedEvent_loaderContext} from './Types.gen';

import type {eventLog as Types_eventLog} from './Types.gen';

export const NounsTokenContract_NounCreated_loader: (userLoader:((_1:{ readonly event: Types_eventLog<Types_NounsTokenContract_NounCreatedEvent_eventArgs>; readonly context: Types_NounsTokenContract_NounCreatedEvent_loaderContext }) => void)) => void = function (Arg1: any) {
  const result = HandlersBS.NounsTokenContract.NounCreated.loader(function (Argevent: any, Argcontext: any) {
      const result1 = Arg1({event:Argevent, context:{log:{debug:Argcontext.log.debug, info:Argcontext.log.info, warn:Argcontext.log.warn, error:Argcontext.log.error, errorWithExn:function (Arg11: any, Arg2: any) {
          const result2 = Curry._2(Argcontext.log.errorWithExn, Arg11, Arg2);
          return result2
        }}, contractRegistration:Argcontext.contractRegistration, GlobalState:Argcontext.GlobalState}});
      return result1
    });
  return result
};

export const NounsTokenContract_NounCreated_handler: (userHandler:((_1:{ readonly event: Types_eventLog<Types_NounsTokenContract_NounCreatedEvent_eventArgs>; readonly context: Types_NounsTokenContract_NounCreatedEvent_context }) => void)) => void = function (Arg1: any) {
  const result = HandlersBS.NounsTokenContract.NounCreated.handler(function (Argevent: any, Argcontext: any) {
      const result1 = Arg1({event:Argevent, context:{log:{debug:Argcontext.log.debug, info:Argcontext.log.info, warn:Argcontext.log.warn, error:Argcontext.log.error, errorWithExn:function (Arg11: any, Arg2: any) {
          const result2 = Curry._2(Argcontext.log.errorWithExn, Arg11, Arg2);
          return result2
        }}, GlobalState:Argcontext.GlobalState}});
      return result1
    });
  return result
};
