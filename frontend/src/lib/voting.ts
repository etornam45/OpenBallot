// voting.ts

import Web3 from "web3";
import { AbiItem } from "web3-utils";

// Contract address
const contractAddress = "0x66e456A52E0bdef0d7dbE2F7e88EDBC5da7F93C6";

// Contract ABI
const contractAbi: AbiItem[] = [
  {
    inputs: [
      { internalType: "uint256", name: "_electionId", type: "uint256" },
      { internalType: "uint256", name: "_presidentialCandidateId", type: "uint256" },
      { internalType: "uint256", name: "_parliamentaryCandidateId", type: "uint256" }
    ],
    name: "castVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_electionId", type: "uint256" },
      { internalType: "uint256", name: "_startTime", type: "uint256" },
      { internalType: "uint256", name: "_endTime", type: "uint256" }
    ],
    name: "createElection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "electionId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "startTime", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "endTime", type: "uint256" }
    ],
    name: "ElectionCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "voter", type: "address" },
      { indexed: false, internalType: "uint256", name: "electionId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "presidentialCandidateId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "parliamentaryCandidateId", type: "uint256" }
    ],
    name: "VoteCast",
    type: "event"
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "elections",
    outputs: [
      { internalType: "uint256", name: "startTime", type: "uint256" },
      { internalType: "uint256", name: "endTime", type: "uint256" },
      { internalType: "bool", name: "isActive", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_electionId", type: "uint256" }
    ],
    name: "getVoteCount",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "hasVoted",
    outputs: [
      { internalType: "bool", name: "", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "votes",
    outputs: [
      { internalType: "uint256", name: "electionId", type: "uint256" },
      { internalType: "uint256", name: "presidentialCandidateId", type: "uint256" },
      { internalType: "uint256", name: "parliamentaryCandidateId", type: "uint256" },
      { internalType: "address", name: "voter", type: "address" }
    ],
    stateMutability: "view",
    type: "function"
  }
];

/**
 * A class to interact with the Voting smart contract using web3.js.
 */
export class VotingContract {
  private web3: Web3;
  private contract: any; // web3.eth.Contract

  /**
   * Creates a new instance of the VotingContract.
   * @param provider - Either a web3 provider URL or a provider injected by MetaMask (window.ethereum)
   */
  constructor(provider: any) {
    // Initialize web3 with the provided provider
    this.web3 = new Web3(provider);
    // Create the contract instance
    this.contract = new this.web3.eth.Contract(contractAbi, contractAddress);
  }

  /**
   * Creates a new election.
   * @param electionId - The unique identifier for the election.
   * @param startTime - The start time of the election (UNIX timestamp).
   * @param endTime - The end time of the election (UNIX timestamp).
   * @param fromAddress - The address that is creating the election.
   */
  async createElection(electionId: number, startTime: number, endTime: number, fromAddress: string): Promise<void> {
    const tx = this.contract.methods.createElection(electionId, startTime, endTime);
    const gas = await tx.estimateGas({ from: fromAddress });
    const gasPrice = await this.web3.eth.getGasPrice();
    
    const receipt = await tx.send({
      from: fromAddress,
      gas,
      gasPrice
    });
    console.log("Election created successfully:", receipt);
  }

  /**
   * Casts a vote for the specified election.
   * @param electionId - The election identifier.
   * @param presidentialCandidateId - The presidential candidate identifier.
   * @param parliamentaryCandidateId - The parliamentary candidate identifier.
   * @param fromAddress - The address of the voter.
   */
  async castVote(electionId: number, presidentialCandidateId: number, parliamentaryCandidateId: number, fromAddress: string): Promise<void> {
    const tx = this.contract.methods.castVote(electionId, presidentialCandidateId, parliamentaryCandidateId);
    const gas = await tx.estimateGas({ from: fromAddress });
    const gasPrice = await this.web3.eth.getGasPrice();
    
    const receipt = await tx.send({
      from: fromAddress,
      gas,
      gasPrice
    });
    console.log("Vote cast successfully:", receipt);
  }

  /**
   * Retrieves the vote count for a given election.
   * @param electionId - The election identifier.
   * @returns The vote count as a number.
   */
  async getVoteCount(electionId: number): Promise<number> {
    const count = await this.contract.methods.getVoteCount(electionId).call();
    return Number(count);
  }

  /**
   * Checks if a voter has already voted in a specific election.
   * @param voterAddress - The address of the voter.
   * @param electionId - The election identifier.
   * @returns True if the voter has voted; otherwise, false.
   */
  async hasVoted(voterAddress: string, electionId: number): Promise<boolean> {
    const result = await this.contract.methods.hasVoted(voterAddress, electionId).call();
    return result;
  }

  /**
   * Retrieves election details by election id.
   * @param electionId - The election identifier.
   * @returns An object with the election's startTime, endTime, and active status.
   */
  async getElection(electionId: number): Promise<{ startTime: number; endTime: number; isActive: boolean }> {
    const election = await this.contract.methods.elections(electionId).call();
    return {
      startTime: Number(election.startTime),
      endTime: Number(election.endTime),
      isActive: election.isActive
    };
  }

  /**
   * Retrieves the vote details for a given vote index.
   * @param voteIndex - The index of the vote.
   * @returns An object containing electionId, presidentialCandidateId, parliamentaryCandidateId, and voter address.
   */
  async getVote(voteIndex: number): Promise<{ electionId: number; presidentialCandidateId: number; parliamentaryCandidateId: number; voter: string }> {
    const vote = await this.contract.methods.votes(voteIndex).call();
    return {
      electionId: Number(vote.electionId),
      presidentialCandidateId: Number(vote.presidentialCandidateId),
      parliamentaryCandidateId: Number(vote.parliamentaryCandidateId),
      voter: vote.voter
    };
  }
}
