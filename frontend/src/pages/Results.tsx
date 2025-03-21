
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BarChart3, User, MapPin, RefreshCw, CheckCircle } from 'lucide-react';
import OpenBallotLogo from '@/components/OpenBallotLogo';
import GhanaButton from '@/components/GhanaButton';
import GlassCard from '@/components/GlassCard';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FetchVotes } from '@/lib/gql';
import { countVotes, VoteCount } from '@/lib/counter';
import { toast } from 'sonner';
import axios from 'axios';
import { PalCandidates, PresCandidates } from '@/hooks/elections';

interface CandidateResult {
  id: string;
  name: string;
  party: string;
  image: string;
  votes: number;
  percentage: number;
}

const Results = () => {
  const navigate = useNavigate();
  const { electionId } = useParams();
  const [electionDetails, setElectionDetails] = useState<{
    title: string;
    type: string;
    constituency: string;
    totalVotes: number;
    progress: number;
    lastUpdated: string;
  } | null>(null);
  const [presidentialResults, setPresidentialResults] = useState<PresCandidates[]>([]);
  const [parliamentaryResults, setParliamentaryResults] = useState<PalCandidates[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [results, setResults] = useState<VoteCount>();
  useEffect(() => {
    const loadElectionData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/election/${electionId}`);
        const data = response.data;

        // Create unique keys for candidates
        const processCandidates = (candidates: any[], type: string) => {
          const seen = new Set();
          return candidates.filter(candidate => {
            const key = `${type}-${candidate.election_id}-${candidate.id}`;
            if (!seen.has(key)) {
              seen.add(key);
              return true;
            }
            return false;
          }).map((candidate, index) => ({
            ...candidate,
            uniqueKey: `${type}-${candidate.election_id}-${candidate.id}-${index}`
          }));
        };

        setPresidentialResults(processCandidates(data.pres_candidates, 'pres'))
        setParliamentaryResults(processCandidates(data.pal_candidates, 'parl'))

      } catch (error) {
        console.error('Error loading election:', error);
        toast.error('Failed to load election data');
      }
    };

    loadElectionData();
    fetchResults();
    setElectionDetails({
      title: '2023 Presidential Election',
      type: 'Presidential and Parliamentary',
      constituency: 'Ayawaso West Wuogon',
      totalVotes: 24829,
      progress: 78,
      lastUpdated: new Date().toLocaleTimeString()
    });
  }, [electionId]);

  const fetchResults = async () => {
    // Simulate fetching results
    setIsRefreshing(true);

    const votes = await FetchVotes()
    const result = countVotes(votes)
    setResults(result)
    setIsRefreshing(false);
  };

  const handleRefresh = () => {
    fetchResults();
  };

  if (!electionDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-ghana-gold border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading election results...</p>
        </div>
      </div>
    );
  }

  const getWinner = (results: Record<string, number> | undefined) => {
      let winnerKey: string | null = null;
      let maxVotes = -1;
      for (const key in results) {
          const value = results[key];
          if (value > maxVotes) {
              maxVotes = value;
              winnerKey = key;
          }
      }
      return winnerKey;
  };

  const presidentialWinner_id = presidentialResults.length > 0 ? getWinner(results?.presidentialCandidates) : null;
  const parliamentaryWinner_id = parliamentaryResults.length > 0 ? getWinner(results?.parliamentaryCandidates) : null;

  function findCadidateWithID(id: string | number, str: string = "pres") {
    const presCandidate = presidentialResults.find(c => c.id === id);
    if (presCandidate && str == "pres") return presCandidate;
    
    const palCandidate = parliamentaryResults.find(c => c.id === id);
    if (palCandidate && str == "parl") return palCandidate;
    
    return null;
  }


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <GhanaButton
              variant="black"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-1" /> Dashboard
            </GhanaButton>
            <OpenBallotLogo />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="font-semibold mb-2">{electionDetails.title} Results</h1>
              <div className="flex items-center text-gray-600 mb-1">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Constituency: {electionDetails.constituency}</span>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center">
              <div className="mr-4 text-right">
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="font-medium">{electionDetails.lastUpdated}</div>
              </div>
              <GhanaButton
                variant="black"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-1"
                disabled={isRefreshing}
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </GhanaButton>
            </div>
          </div>

          {/* <GlassCard className="p-6 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reporting Progress</span>
                    <span className="font-medium">{electionDetails.progress}% Complete</span>
                  </div>
                  <Progress value={electionDetails.progress} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {electionDetails.progress}% of polling stations reporting
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-1">{electionDetails.totalVotes}</div>
                <div className="text-sm text-gray-600">Total Votes Cast</div>
              </div>
            </div>
          </GlassCard> */}

          <Tabs defaultValue={electionDetails.type.includes('Presidential') ? "presidential" : "parliamentary"} className="animate-fade-in">
            <TabsList className="w-full mb-6 gap-3">
              {electionDetails.type.includes('Presidential') && (
                <TabsTrigger value="presidential" className="flex-1">Presidential Results</TabsTrigger>
              )}
              <TabsTrigger value="parliamentary" className="flex-1">Parliamentary Results</TabsTrigger>
            </TabsList>

            {electionDetails.type.includes('Presidential') && (
              <TabsContent value="presidential">
                <GlassCard className="p-6 mb-8">
                  {findCadidateWithID(+presidentialWinner_id!) && (
                    <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-ghana-green text-white mb-4">
                        Leading Candidate
                      </div>
                      <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full bg-gray-100">
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <User className="h-12 w-12 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{findCadidateWithID(+presidentialWinner_id!)?.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{findCadidateWithID(+presidentialWinner_id!)?.political_party}</p>
                      <div className="flex items-center">
                        {/* <div className="text-2xl font-bold">{findCadidateWithID(+presidentialWinner_id!)?.percentage.toFixed(1)}%</div> */}
                        <span className="mx-2 text-gray-400">|</span>
                        <div className="text-gray-600">{results?.presidentialCandidates[presidentialWinner_id!]} votes</div>
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold mb-4">All Presidential Candidates</h3>
                  <div className="space-y-4">
                    {presidentialResults.map((candidate) => (
                      <div key={candidate.id} className="relative">
                        <div className="flex items-center mb-2">
                          <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gray-100 mr-3">
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{candidate.name}</p>
                              {candidate.id === findCadidateWithID(+presidentialWinner_id!)?.id && (
                                <CheckCircle className="h-4 w-4 ml-2 text-ghana-green" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{candidate.political_party}</p>
                          </div>
                          <div className="ml-auto text-right">
                            {/* <p className="font-semibold">{candidate.percentage.toFixed(1)}%</p> */}
                            <p className="text-xs text-gray-600">{results?.presidentialCandidates[candidate.id]} votes</p>
                          </div>
                        </div>
                        <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full ${candidate.id === findCadidateWithID(+presidentialWinner_id!)?.id
                              ? 'bg-ghana-green'
                              : 'bg-ghana-gold'
                              }`}
                            // style={{ width: `${candidate.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </TabsContent>
            )}

            <TabsContent value="parliamentary">
              <GlassCard className="p-6 mb-8">
                {findCadidateWithID(+parliamentaryWinner_id!) && (
                  <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-ghana-green text-white mb-4">
                      Leading Candidate
                    </div>
                    <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{findCadidateWithID(+parliamentaryWinner_id!, "parl")?.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{findCadidateWithID(+parliamentaryWinner_id!, 'parl')?.political_party}</p>
                    <div className="flex items-center">
                      {/* <div className="text-2xl font-bold">{parliamentaryWinner.percentage.toFixed(1)}%</div> */}
                      <span className="mx-2 text-gray-400">|</span>
                      <div className="text-gray-600">{results?.parliamentaryCandidates[parliamentaryWinner_id!]} votes</div>
                    </div>
                  </div>
                )}

                <h3 className="text-lg font-semibold mb-4">All Parliamentary Candidates</h3>
                <div className="space-y-4">
                  {parliamentaryResults.map((candidate) => (
                    <div key={candidate.id} className="relative">
                      <div className="flex items-center mb-2">
                        <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gray-100 mr-3">
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{candidate.name}</p>
                            {candidate.id === +parliamentaryWinner_id! && (
                              <CheckCircle className="h-4 w-4 ml-2 text-ghana-green" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{candidate.political_party}</p>
                        </div>
                        <div className="ml-auto text-right">
                          {/* <p className="font-semibold">{candidate.percentage.toFixed(1)}%</p> */}
                          <p className="text-xs text-gray-600">{results?.parliamentaryCandidates[candidate.id]} votes</p>
                        </div>
                      </div>
                      <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full rounded-full ${candidate.id === findCadidateWithID(+parliamentaryWinner_id!)?.id
                            ? 'bg-ghana-green'
                            : 'bg-ghana-gold'
                            }`}
                          // style={{ width: `${candidate.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2023 OpenBallot. Secure electronic voting for the future.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Results;