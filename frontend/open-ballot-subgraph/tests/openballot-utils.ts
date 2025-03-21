import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { ElectionCreated, VoteCast } from "../generated/openballot/openballot"

export function createElectionCreatedEvent(
  electionId: BigInt,
  startTime: BigInt,
  endTime: BigInt
): ElectionCreated {
  let electionCreatedEvent = changetype<ElectionCreated>(newMockEvent())

  electionCreatedEvent.parameters = new Array()

  electionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "electionId",
      ethereum.Value.fromUnsignedBigInt(electionId)
    )
  )
  electionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "startTime",
      ethereum.Value.fromUnsignedBigInt(startTime)
    )
  )
  electionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )

  return electionCreatedEvent
}

export function createVoteCastEvent(
  voter: Address,
  electionId: BigInt,
  presidentialCandidateId: BigInt,
  parliamentaryCandidateId: BigInt
): VoteCast {
  let voteCastEvent = changetype<VoteCast>(newMockEvent())

  voteCastEvent.parameters = new Array()

  voteCastEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam(
      "electionId",
      ethereum.Value.fromUnsignedBigInt(electionId)
    )
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam(
      "presidentialCandidateId",
      ethereum.Value.fromUnsignedBigInt(presidentialCandidateId)
    )
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam(
      "parliamentaryCandidateId",
      ethereum.Value.fromUnsignedBigInt(parliamentaryCandidateId)
    )
  )

  return voteCastEvent
}
