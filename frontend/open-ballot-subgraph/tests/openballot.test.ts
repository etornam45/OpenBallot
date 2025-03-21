import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ElectionCreated } from "../generated/schema"
import { ElectionCreated as ElectionCreatedEvent } from "../generated/openballot/openballot"
import { handleElectionCreated } from "../src/openballot"
import { createElectionCreatedEvent } from "./openballot-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let electionId = BigInt.fromI32(234)
    let startTime = BigInt.fromI32(234)
    let endTime = BigInt.fromI32(234)
    let newElectionCreatedEvent = createElectionCreatedEvent(
      electionId,
      startTime,
      endTime
    )
    handleElectionCreated(newElectionCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ElectionCreated created and stored", () => {
    assert.entityCount("ElectionCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ElectionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "electionId",
      "234"
    )
    assert.fieldEquals(
      "ElectionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "startTime",
      "234"
    )
    assert.fieldEquals(
      "ElectionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "endTime",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
