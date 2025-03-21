export type VoteCast = {
    voter: string;
    electionId: string;
    presidentialCandidateId: string;
    parliamentaryCandidateId: string;
};

export type VoteCount = {
    presidentialCandidates: Record<string, number>;
    parliamentaryCandidates: Record<string, number>;
};

export function countVotes(voteCasts: VoteCast[]): VoteCount {
    const result: VoteCount = {
        presidentialCandidates: {},
        parliamentaryCandidates: {},
    };

    for (const vote of voteCasts) {
        // Count presidential candidate votes
        result.presidentialCandidates[vote.presidentialCandidateId] =
            (result.presidentialCandidates[vote.presidentialCandidateId] || 0) + 1;

        // Count parliamentary candidate votes
        result.parliamentaryCandidates[vote.parliamentaryCandidateId] =
            (result.parliamentaryCandidates[vote.parliamentaryCandidateId] || 0) + 1;
    }

    return result;
}