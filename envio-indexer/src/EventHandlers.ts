/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */

import {
  NounsAuctionHouseContract_AuctionCreated_loader,
  NounsAuctionHouseContract_AuctionCreated_handler,
  NounsAuctionHouseContract_AuctionBid_loader,
  NounsAuctionHouseContract_AuctionBid_handler,
  NounsAuctionHouseContract_AuctionExtended_loader,
  NounsAuctionHouseContract_AuctionExtended_handler,
  NounsAuctionHouseContract_AuctionSettled_loader,
  NounsAuctionHouseContract_AuctionSettled_handler,
  NounsDAOContract_ProposalCreatedWithRequirements_loader,
  NounsDAOContract_ProposalCreatedWithRequirements_handler,
  NounsDAOContract_ProposalCreatedOnTimelockV1_loader,
  NounsDAOContract_ProposalCreatedOnTimelockV1_handler,
  NounsDAOContract_ProposalCanceled_loader,
  NounsDAOContract_ProposalCanceled_handler,
  NounsDAOContract_ProposalVetoed_loader,
  NounsDAOContract_ProposalVetoed_handler,
  NounsDAOContract_ProposalQueued_loader,
  NounsDAOContract_ProposalQueued_handler,
  NounsDAOContract_ProposalExecuted_loader,
  NounsDAOContract_ProposalExecuted_handler,
  NounsDAOContract_VoteCast_loader,
  NounsDAOContract_VoteCast_handler,
  NounsDAOContract_MinQuorumVotesBPSSet_loader,
  NounsDAOContract_MinQuorumVotesBPSSet_handler,
  NounsDAOContract_MaxQuorumVotesBPSSet_loader,
  NounsDAOContract_MaxQuorumVotesBPSSet_handler,
  NounsDAOContract_QuorumCoefficientSet_loader,
  NounsDAOContract_QuorumCoefficientSet_handler,
  NounsDAOContract_ProposalUpdated_loader,
  NounsDAOContract_ProposalUpdated_handler,
  NounsDAOContract_ProposalDescriptionUpdated_loader,
  NounsDAOContract_ProposalDescriptionUpdated_handler,
  NounsDAOContract_ProposalTransactionsUpdated_loader,
  NounsDAOContract_ProposalTransactionsUpdated_handler,
  NounsDAOContract_ProposalObjectionPeriodSet_loader,
  NounsDAOContract_ProposalObjectionPeriodSet_handler,
  NounsDAOContract_SignatureCancelled_loader,
  NounsDAOContract_SignatureCancelled_handler,
  NounsDAOContract_EscrowedToFork_loader,
  NounsDAOContract_EscrowedToFork_handler,
  NounsDAOContract_WithdrawFromForkEscrow_loader,
  NounsDAOContract_WithdrawFromForkEscrow_handler,
  NounsDAOContract_ExecuteFork_loader,
  NounsDAOContract_ExecuteFork_handler,
  NounsDAOContract_JoinFork_loader,
  NounsDAOContract_JoinFork_handler,
  NounsDAOContract_VoteSnapshotBlockSwitchProposalIdSet_loader,
  NounsDAOContract_VoteSnapshotBlockSwitchProposalIdSet_handler,
  NounsDAODataContract_ProposalCandidateCreated_loader,
  NounsDAODataContract_ProposalCandidateCreated_handler,
  NounsDAODataContract_ProposalCandidateUpdated_loader,
  NounsDAODataContract_ProposalCandidateUpdated_handler,
  NounsDAODataContract_ProposalCandidateCanceled_loader,
  NounsDAODataContract_ProposalCandidateCanceled_handler,
  NounsDAODataContract_SignatureAdded_loader,
  NounsDAODataContract_SignatureAdded_handler,
  NounsDAODataContract_FeedbackSent_loader,
  NounsDAODataContract_FeedbackSent_handler,
  NounsDAODataContract_CandidateFeedbackSent_loader,
  NounsDAODataContract_CandidateFeedbackSent_handler,
  NounsTokenContract_NounCreated_loader,
  NounsTokenContract_NounCreated_handler,
  NounsTokenContract_DelegateChanged_loader,
  NounsTokenContract_DelegateChanged_handler,
  NounsTokenContract_DelegateVotesChanged_loader,
  NounsTokenContract_DelegateVotesChanged_handler,
  NounsTokenContract_Transfer_loader,
  NounsTokenContract_Transfer_handler
} from "../generated/src/Handlers.gen";

import {
  AccountEntity,
  AuctionEntity,
  BidEntity,
  CandidateFeedbackEntity,
  DelegateEntity,
  DelegationEventEntity,
  DynamicQuorumParamsEntity,
  EscrowDepositEntity,
  EscrowedNounEntity,
  ForkEntity,
  ForkJoinedNounEntity,
  GovernanceEntity,
  NounEntity,
  ProposalEntity,
  ProposalCandidateEntity,
  ProposalCandidateContentEntity,
  ProposalCandidateSignatureEntity,
  ProposalCandidateVersionEntity,
  ProposalFeedbackEntity,
  ProposalVersionEntity,
  SeedEntity,
  TransferEventEntity,
  VoteEntity,
  EventsSummaryEntity
} from "../generated/src/Types.gen";

const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary";

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  delegationEventCount: BigInt(0),
  transferEventCount: BigInt(0),
  seedCount: BigInt(0),
  nounCount: BigInt(0),
  bidCount: BigInt(0),
  auctionCount: BigInt(0),
  accountCount: BigInt(0),
  delegateCount: BigInt(0),
  proposalCount: BigInt(0),
  voteCount: BigInt(0),
  governanceCount: BigInt(0),
  dynamicQuorumParamsCount: BigInt(0),
  proposalVersionCount: BigInt(0),
  proposalCandidateCount: BigInt(0),
  proposalCandidateVersionCount: BigInt(0),
  proposalCandidateContentCount: BigInt(0),
  proposalCandidateSignatureCount: BigInt(0),
  proposalFeedbackCount: BigInt(0),
  candidateFeedbackCount: BigInt(0),
  forkCount: BigInt(0),
  forkJoinCount: BigInt(0),
  escrowDepositCount: BigInt(0),
  escrowWithdrawalCount: BigInt(0),
  escrowedNounCount: BigInt(0),
  forkJoinedNounCount: BigInt(0),
};


NounsAuctionHouseContract_AuctionCreated_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsAuctionHouseContract_AuctionCreated_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    approvalsCount: currentSummaryEntity.auctionCount + BigInt(1),
  };

  let auctionEntity: AuctionEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    noun: event.params.nounId.toString(),
    amount: event.params.nounId.valueOf(),
    bidder: "",
    startTime: event.params.startTime.valueOf(),
    endTime: event.params.endTime.valueOf(),
    settled: false,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.Auction.set(auctionEntity);
});

NounsAuctionHouseContract_AuctionBid_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsAuctionHouseContract_AuctionBid_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    bidCount: currentSummaryEntity.bidCount + BigInt(1),
  };

  context.EventsSummary.set(nextSummaryEntity);
});

NounsAuctionHouseContract_AuctionExtended_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsAuctionHouseContract_AuctionExtended_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  
});

NounsAuctionHouseContract_AuctionSettled_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsAuctionHouseContract_AuctionSettled_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  
});

NounsDAOContract_ProposalCreatedWithRequirements_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_ProposalCreatedWithRequirements_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    approvalsCount: currentSummaryEntity.proposalCount + BigInt(1),
  };

  let proposalEntity: ProposalEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    proposer: event.params.proposer.toString(),
    targets: event.params.targets,
    values: event.params.values,
    signers: " ",
    signatures: event.params.signatures,
    calldatas: event.params.calldatas,
    createdTimestamp: BigInt(event.blockTimestamp.valueOf()),
    createdBlock: BigInt(event.blockNumber.valueOf()),
    lastUpdatedTimestamp: BigInt(event.blockTimestamp.valueOf()),
    lastUpdatedBlock: BigInt(event.blockNumber.valueOf()),
    createdTransactionHash: event.transactionHash,
    startBlock: event.params.startBlock.valueOf(),
    endBlock: event.params.endBlock.valueOf(),
    proposalThreshold: event.params.proposalThreshold.valueOf(),
    quorumVotes: event.params.quorumVotes.valueOf(),
    forVotes: BigInt(0),
    againstVotes: BigInt(0),
    abstainVotes: BigInt(0),
    title: event.params.description.slice(0, 32),
    description: event.params.description,
    status: BigInt(0),
    executionETA: BigInt(0),
    totalSupply: BigInt(0),
    adjustedTotalSupply: BigInt(0),
    minQuorumVotesBPS: 0,
    maxQuorumVotesBPS: 0,
    quorumCoefficient: BigInt(0),
    objectionPeriodEndBlock: BigInt(0),
    updatePeriodEndBlock: BigInt(0),
    voteSnapshotBlock: BigInt(0),
    onTimelockV1: false,
    queuedBlock: BigInt(0),
    queuedTimestamp: BigInt(0),
    canceledBlock: BigInt(0),
    canceledTimestamp: BigInt(0),
    executedBlock: BigInt(0),
    vetoedBlock: BigInt(0),
    vetoedTimestamp: BigInt(0),
    executedTimestamp: BigInt(0),
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.Proposal.set(proposalEntity);
});

NounsDAOContract_ProposalCreatedOnTimelockV1_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_ProposalCreatedOnTimelockV1_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);


  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    approvalsCount: currentSummaryEntity.proposalCount + BigInt(1),
  };

  let proposalEntity: ProposalEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    proposer: event.params.proposer.toString(),
    values: event.params.values,
    signatures: event.params.signatures,
    calldatas: event.params.calldatas,
    startBlock: event.params.startBlock.valueOf(),
    endBlock: event.params.endBlock.valueOf(),
    createdBlock: BigInt(event.blockNumber.valueOf()),
    forVotes: BigInt(0),
    againstVotes: BigInt(0),
    abstainVotes: BigInt(0),
    description: event.params.description,
    status: BigInt(0),
    executionETA: BigInt(0),
    onTimelockV1: true,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
});

NounsDAOContract_ProposalCanceled_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_ProposalCanceled_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    proposalsCount: currentSummaryEntity.proposalCount - BigInt(1),
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.Proposal.delete(event.srcAddress.toString());
});

NounsDAOContract_ProposalVetoed_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_ProposalVetoed_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);
  let proposal = summary!

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  proposal!.veteoedBlock = BigInt(event.blockNumber.valueOf());
  
});

NounsDAOContract_ProposalQueued_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_ProposalQueued_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  // let nextSummaryEntity = {
  //   ...currentSummaryEntity,
  //   proposalsCount: currentSummaryEntity.proposalCount - BigInt(1),
  // };

  // context.EventsSummary.set(nextSummaryEntity);
});

NounsDAOContract_ProposalExecuted_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_ProposalExecuted_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  // let nextSummaryEntity = {
  //   ...currentSummaryEntity,
  //   approvalsCount: currentSummaryEntity.proposalCount - BigInt(1),
  // };

  // context.EventsSummary.set(nextSummaryEntity);
});

NounsDAOContract_VoteCast_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_VoteCast_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    approvalsCount: currentSummaryEntity.voteCount + BigInt(1),
  };

   context.EventsSummary.set(nextSummaryEntity);
});

NounsDAOContract_MinQuorumVotesBPSSet_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_MinQuorumVotesBPSSet_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  // let nextSummaryEntity = {
  //   ...currentSummaryEntity,
  //   approvalsCount: currentSummaryEntity.voteCount + BigInt(1),
  // };

  // context.EventsSummary.set(nextSummaryEntity);
});

NounsDAOContract_MaxQuorumVotesBPSSet_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_MaxQuorumVotesBPSSet_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  // let nextSummaryEntity = {
  //   ...currentSummaryEntity,
  //   approvalsCount: currentSummaryEntity.voteCount + BigInt(1),
  // };

  // context.EventsSummary.set(nextSummaryEntity);
});

NounsDAOContract_QuorumCoefficientSet_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_QuorumCoefficientSet_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  // let nextSummaryEntity = {
  //   ...currentSummaryEntity,
  //   approvalsCount: currentSummaryEntity.voteCount + BigInt(1),
  // };

  // context.EventsSummary.set(nextSummaryEntity);
});

NounsDAOContract_ProposalUpdated_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_ProposalUpdated_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  // let nextSummaryEntity = {
  //   ...currentSummaryEntity,
  //   approvalsCount: currentSummaryEntity.voteCount + BigInt(1),
  // };

  // context.EventsSummary.set(nextSummaryEntity);
});


NounsDAOContract_ProposalDescriptionUpdated_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_ProposalDescriptionUpdated_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;
  
});

NounsDAOContract_ProposalTransactionsUpdated_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_ProposalTransactionsUpdated_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;
  
});

NounsDAOContract_ProposalObjectionPeriodSet_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_ProposalObjectionPeriodSet_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;
  
});

NounsDAOContract_SignatureCancelled_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_SignatureCancelled_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    approvalsCount: currentSummaryEntity.voteCount + BigInt(1),
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ProposalCandidateSignature.delete(event.srcAddress.toString());
});

NounsDAOContract_EscrowedToFork_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_EscrowedToFork_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;
  
});

NounsDAOContract_WithdrawFromForkEscrow_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_WithdrawFromForkEscrow_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;
  
});

NounsDAOContract_ExecuteFork_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_ExecuteFork_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;
  
});

NounsDAOContract_JoinFork_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_JoinFork_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;
  
});

NounsDAOContract_VoteSnapshotBlockSwitchProposalIdSet_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAOContract_VoteSnapshotBlockSwitchProposalIdSet_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;
  
});

NounsDAODataContract_ProposalCandidateCreated_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAODataContract_ProposalCandidateCreated_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;
  
});

NounsDAODataContract_ProposalCandidateUpdated_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAODataContract_ProposalCandidateUpdated_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;
  
});

NounsDAODataContract_ProposalCandidateCanceled_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAODataContract_ProposalCandidateCanceled_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    proposalCandidatesCount: currentSummaryEntity.proposalCandidateCount - BigInt(1),
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ProposalCandidate.delete(event.srcAddress.toString());
});

NounsDAODataContract_SignatureAdded_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAODataContract_SignatureAdded_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    proposalCandidateSignatureCount: currentSummaryEntity.proposalCandidateSignatureCount + BigInt(1),
  };

  let signatureEntity: ProposalCandidateSignatureEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    content: event.params.slug,
    signer: event.params.signer,
    sig: event.params.sig,
    expirationTimestamp: event.params.expirationTimestamp.valueOf(),
    encodedProposalHash: event.params.encodedPropHash,
    sigDigest: event.params.sigDigest,
    reason: event.params.reason,
    canceled: false,
    createdTimestamp: BigInt(event.blockTimestamp.valueOf()),
    createdBlock: BigInt(event.blockNumber.valueOf()),
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ProposalCandidateSignature.set(signatureEntity);
  
});

NounsDAODataContract_FeedbackSent_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAODataContract_FeedbackSent_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;
  
  let nextSummaryEntity = {
    ...currentSummaryEntity,
    proposalFeedbackCount: currentSummaryEntity.proposalFeedbackCount + BigInt(1),
  };

  let feedbackEntity: ProposalFeedbackEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    createdTimestamp: BigInt(event.blockTimestamp.valueOf()),
    createdBlock: BigInt(event.blockNumber.valueOf()),
    proposal: event.params.proposalId.toString(),
    voter: event.srcAddress.toString(),
    votes: BigInt(0),
    supportDetailed: Number(event.params.support.valueOf()),
    reason: event.params.reason,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ProposalFeedback.set(feedbackEntity);
});

NounsDAODataContract_CandidateFeedbackSent_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsDAODataContract_CandidateFeedbackSent_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    candidateFeedbackCount: currentSummaryEntity.candidateFeedbackCount + BigInt(1),
  };

  let candidateFeedbackEntity: CandidateFeedbackEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    createdTimestamp: BigInt(event.blockTimestamp.valueOf()),
    createdBlock: BigInt(event.blockNumber.valueOf()),
    candidate: event.srcAddress.toString(),
    voter: event.srcAddress.toString(),
    supportDetailed: Number(event.params.support.valueOf()),
    votes: BigInt(0),
    reason: event.params.reason,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.CandidateFeedback.set(candidateFeedbackEntity);
});

NounsTokenContract_NounCreated_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsTokenContract_NounCreated_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    nounCount: currentSummaryEntity.nounCount + BigInt(1),
  };

  let nounEntity: NounEntity = {
    id: event.params.tokenId.toString(),
    seed: event.params.seed.toString(),
    owner: event.srcAddress.toString(),
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.Noun.set(nounEntity);
});

NounsTokenContract_DelegateChanged_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsTokenContract_DelegateChanged_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
  summary ?? INITIAL_EVENTS_SUMMARY;

  // context.EventsSummary.set(nextSummaryEntity);
});

NounsTokenContract_DelegateVotesChanged_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsTokenContract_DelegateVotesChanged_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
  summary ?? INITIAL_EVENTS_SUMMARY;

  // let nextSummaryEntity = {
  //   ...currentSummaryEntity,
  //   approvalsCount: currentSummaryEntity.delegateCount + BigInt(1),
  // };

  // context.EventsSummary.set(nextSummaryEntity);
});

NounsTokenContract_Transfer_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

NounsTokenContract_Transfer_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
  summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    transferEventCount: currentSummaryEntity.transferEventCount + BigInt(1),
  };

  let transferEventEntity: TransferEventEntity = {    
    id: event.transactionHash + event.logIndex.toString(),
    noun: event.params.tokenId.toString(),
    previousHolder: event.params.from.toString(),
    newHolder: event.params.to.toString(),
    blockNumber: BigInt(event.blockNumber.valueOf()),
    blockTimestamp: BigInt(event.blockTimestamp.valueOf()),
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.TransferEvent.set(transferEventEntity);
});

// MyAwesomeContractContract_AwesomeEvent_handler(({ event, context }) => {
//   let awesomeEventObject = context.AwesomeEntity.get(event.params.identifier);
//   if (!!awesomeEventObject) {
//     const updatedEntity = {
//       id: awesomeEventObject.id,
//       awesomeAddress: event.params.awesomeAddress,
//       awesomeTotal: event.params.awesomeValue + awesomeEventObject.awesomeTotal,
//     };
//     context.AwesomeEntity.set(updatedEntity);
//   } else {
//     const awesomeEntityObject = {
//       id: event.params.identifier,
//       awesomeAddress: event.params.awesomeAddress,
//       awesomeTotal: event.params.awesomeValue,
//     };
//     context.AwesomeEntity.set(awesomeEntityObject);
//   }
// });
