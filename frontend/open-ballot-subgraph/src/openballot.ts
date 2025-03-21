import {
  ElectionCreated as ElectionCreatedEvent,
  VoteCast as VoteCastEvent
} from "../generated/openballot/openballot"
import { ElectionCreated, VoteCast } from "../generated/schema"

export function handleElectionCreated(event: ElectionCreatedEvent): void {
  let entity = new ElectionCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.electionId = event.params.electionId
  entity.startTime = event.params.startTime
  entity.endTime = event.params.endTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoteCast(event: VoteCastEvent): void {
  let entity = new VoteCast(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.voter = event.params.voter
  entity.electionId = event.params.electionId
  entity.presidentialCandidateId = event.params.presidentialCandidateId
  entity.parliamentaryCandidateId = event.params.parliamentaryCandidateId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
