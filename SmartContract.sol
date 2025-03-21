// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OpenBallot {
    struct Election {
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }

    struct Vote {
        uint256 electionId;
        uint256 presidentialCandidateId;
        uint256 parliamentaryCandidateId;
        address voter;
    }

    mapping(uint256 => Election) public elections;
    mapping(address => mapping(uint256 => bool)) public hasVoted; // Tracks if a voter has voted in a specific election
    Vote[] public votes;

    event ElectionCreated(uint256 electionId, uint256 startTime, uint256 endTime);
    event VoteCast(address indexed voter, uint256 electionId, uint256 presidentialCandidateId, uint256 parliamentaryCandidateId);

    // Create a new election
    function createElection(uint256 _electionId, uint256 _startTime, uint256 _endTime) external {
        require(_startTime < _endTime, "Invalid election timeframe.");
        require(elections[_electionId].startTime == 0, "Election ID already exists.");

        elections[_electionId] = Election({
            startTime: _startTime,
            endTime: _endTime,
            isActive: true
        });

        emit ElectionCreated(_electionId, _startTime, _endTime);
    }

    // Cast a vote
    function castVote(uint256 _electionId, uint256 _presidentialCandidateId, uint256 _parliamentaryCandidateId) external {
        Election memory election = elections[_electionId];
        require(election.isActive, "Election is not active.");
        require(block.timestamp >= election.startTime && block.timestamp <= election.endTime, "Voting period has ended.");
        require(!hasVoted[msg.sender][_electionId], "You have already voted in this election.");

        votes.push(Vote({
            electionId: _electionId,
            presidentialCandidateId: _presidentialCandidateId,
            parliamentaryCandidateId: _parliamentaryCandidateId,
            voter: msg.sender
        }));

        hasVoted[msg.sender][_electionId] = true;
        emit VoteCast(msg.sender, _electionId, _presidentialCandidateId, _parliamentaryCandidateId);
    }

    // Get the total number of votes for a specific election
    function getVoteCount(uint256 _electionId) public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].electionId == _electionId) {
                count++;
            }
        }
        return count;
    }
}