import { gql, request } from 'graphql-request'


const query = gql`{
  voteCasts(where: {electionId: "123"}) {
    voter
    electionId
    presidentialCandidateId
    parliamentaryCandidateId
  }
}`

const url = 'https://api.studio.thegraph.com/query/107428/open-ballot/version/latest'


const headers = { Authorization: 'Bearer f75b2078bd79764b0a4a0d23e4c819a8' } //not secure I'll fix later

type VoteCast = {
    voter: string;
    electionId: string;
    presidentialCandidateId: string;
    parliamentaryCandidateId: string;
};

export async function FetchVotes(): Promise<VoteCast[]> {
    const data = await request<{ voteCasts: VoteCast[] }>(url, query, headers)
    return data.voteCasts
}