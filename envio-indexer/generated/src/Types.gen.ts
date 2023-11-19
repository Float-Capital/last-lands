/* TypeScript file generated from Types.res by genType. */
/* eslint-disable import/first */


import type {BigInt_t as Ethers_BigInt_t} from '../src/bindings/Ethers.gen';

import type {Nullable as $$nullable} from './bindings/OpaqueTypes';

import type {ethAddress as Ethers_ethAddress} from '../src/bindings/Ethers.gen';

import type {userLogger as Logs_userLogger} from './Logs.gen';

// tslint:disable-next-line:interface-over-type-literal
export type id = string;
export type Id = id;

// tslint:disable-next-line:interface-over-type-literal
export type nullable<a> = $$nullable<a>;

// tslint:disable-next-line:interface-over-type-literal
export type globalStateLoaderConfig = boolean;

// tslint:disable-next-line:interface-over-type-literal
export type globalStateEntity = {
  readonly id: string; 
  readonly mintedLand: Ethers_BigInt_t[]; 
  readonly mintedLandIsoCodes: string[]
};
export type GlobalStateEntity = globalStateEntity;

// tslint:disable-next-line:interface-over-type-literal
export type eventLog<a> = {
  readonly params: a; 
  readonly blockNumber: number; 
  readonly blockTimestamp: number; 
  readonly blockHash: string; 
  readonly srcAddress: Ethers_ethAddress; 
  readonly transactionHash: string; 
  readonly transactionIndex: number; 
  readonly logIndex: number
};
export type EventLog<a> = eventLog<a>;

// tslint:disable-next-line:interface-over-type-literal
export type NounsTokenContract_NounCreatedEvent_eventArgs = { readonly tokenId: Ethers_BigInt_t };

// tslint:disable-next-line:interface-over-type-literal
export type NounsTokenContract_NounCreatedEvent_log = eventLog<NounsTokenContract_NounCreatedEvent_eventArgs>;
export type NounsTokenContract_NounCreated_EventLog = NounsTokenContract_NounCreatedEvent_log;

// tslint:disable-next-line:interface-over-type-literal
export type NounsTokenContract_NounCreatedEvent_globalStateEntityHandlerContext = {
  readonly get: (_1:id) => (undefined | globalStateEntity); 
  readonly set: (_1:globalStateEntity) => void; 
  readonly delete: (_1:id) => void
};

// tslint:disable-next-line:interface-over-type-literal
export type NounsTokenContract_NounCreatedEvent_context = { readonly log: Logs_userLogger; readonly GlobalState: NounsTokenContract_NounCreatedEvent_globalStateEntityHandlerContext };

// tslint:disable-next-line:interface-over-type-literal
export type NounsTokenContract_NounCreatedEvent_globalStateEntityLoaderContext = { readonly load: (_1:id) => void };

// tslint:disable-next-line:interface-over-type-literal
export type NounsTokenContract_NounCreatedEvent_contractRegistrations = { readonly addNounsToken: (_1:Ethers_ethAddress) => void };

// tslint:disable-next-line:interface-over-type-literal
export type NounsTokenContract_NounCreatedEvent_loaderContext = {
  readonly log: Logs_userLogger; 
  readonly contractRegistration: NounsTokenContract_NounCreatedEvent_contractRegistrations; 
  readonly GlobalState: NounsTokenContract_NounCreatedEvent_globalStateEntityLoaderContext
};
