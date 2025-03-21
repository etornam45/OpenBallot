
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, User, MapPin } from 'lucide-react';
import OpenBallotLogo from '@/components/OpenBallotLogo';
import GhanaButton from '@/components/GhanaButton';
import GlassCard from '@/components/GlassCard';
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"
import axios from 'axios';
import { ElectionBody, PalCandidates, PresCandidates } from '@/hooks/elections';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { castVote } from '@/lib/voting';


const Voting = () => {
  const navigate = useNavigate();
  const { electionId } = useParams();
  const [electionDetails, setElectionDetails] = useState<{
    title: string;
    type: string;
    constituency: string;
  } | null>(null);
  const [step, setStep] = useState(1);
  const [selectedPresident, setSelectedPresident] = useState<number | null>(null);
  const [selectedMP, setSelectedMP] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock candidates data
  const [presidentialCandidates, setPresidentialCandidates] = useState<PresCandidates[]>([]);

  const [parliamentaryCandidates, setParliamentaryCandidates] = useState<PalCandidates[]>([]);


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
  
        setPresidentialCandidates(processCandidates(data.pres_candidates, 'pres'));
        setParliamentaryCandidates(processCandidates(data.pal_candidates, 'parl'));
  
        setElectionDetails({
          title: data.elections.title,
          type: 'Presidential and Parliamentary',
          constituency: 'Ayawaso West Wuogon'
        });
  
      } catch (error) {
        console.error('Error loading election:', error);
        toast.error('Failed to load election data');
      }
    };
  
    loadElectionData();
  }, [electionId]);

  const handleSelectPresident = (candidateId: number) => {
    setSelectedPresident(candidateId);
  };

  const handleSelectMP = (candidateId: number) => {
    setSelectedMP(candidateId);
  };

  const handleReview = () => {
    if (!selectedPresident && electionDetails?.type.includes('Presidential')) {
      toast("Selection Required", {
        description: "Please select a presidential candidate.",
        duration: 3000,
      });
      return;
    }

    if (!selectedMP) {
      toast("Selection Required", {
        description: "Please select a parliamentary candidate.",
        duration: 3000,
      });
      return;
    }

    setStep(2);
  };

  const handleSubmitVote = async () => {
    if (!selectedPresident || !selectedMP) {
      toast.error("Please select all candidates");
      return;
    }

    
  
    setIsSubmitting(true);
  
    try {
      const electionIdNum = parseInt(electionId || '0', 10);
      if (isNaN(electionIdNum)) {
        throw new Error('Invalid election ID');
      }
  
      // Check if user has already voted
      // const hasVoted = await checkVotingStatus(electionIdNum);
      // if (hasVoted) {
      //   toast.error("You've already voted in this election");
      //   navigate(`/results/${electionId}`);
      //   return;
      // }
  
      // Submit vote to blockchain
      const tx = await castVote(
        electionIdNum,
        selectedPresident,
        selectedMP
      );
  
      toast.info("Vote submitted", {
        description: "Waiting for blockchain confirmation...",
        duration: 5000,
      });
  
      // Wait for transaction confirmation
      await tx.wait();
  
      // Record vote in backend
      // await axios.post(`http://localhost:3001/votes`, {
      //   electionId: electionIdNum,
      //   presidentialCandidateId: selectedPresident,
      //   parliamentaryCandidateId: selectedMP,
      //   transactionHash: tx.hash
      // });
  
      toast.success("Vote recorded successfully!", {
        description: `Transaction hash: ${tx.hash}`,
        duration: 7000,
      });
  
      navigate(`/results/${electionId}`);
  
    } catch (error) {
      console.error('Voting error:', error);
      const message = error instanceof Error ? error.message : 'Transaction failed';
      toast.error("Vote submission failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedCandidate = (candidateId: number | null, candidates: PalCandidates[] | PresCandidates[]) => {
    return candidateId ? candidates.find(c => c.id === candidateId) : null;
  };

  if (!electionDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-ghana-gold border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading election details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white  py-4 px-6">
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
          <ConnectWalletButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{electionDetails.title}</h1>
            <div className="flex items-center text-gray-600 mb-1">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Constituency: {electionDetails.constituency}</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-8 animate-fade-in">
              {electionDetails.type.includes('Presidential') && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Presidential Candidates</h2>
                  <p className="text-gray-600 mb-6">
                    Select your preferred candidate for President
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {presidentialCandidates.map((candidate) => (
                      <GlassCard
                        key={candidate.id}
                        className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${selectedPresident === candidate.id
                            ? 'ring-2 ring-ghana-green bg-ghana-green/5'
                            : ''
                          }`}
                        onClick={() => handleSelectPresident(candidate.id)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full bg-gray-100">
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                              <User className="h-12 w-12 text-gray-400" />
                            </div>
                          </div>

                          <h3 className="text-lg font-semibold mb-1">{candidate.name}</h3>
                          <p className="text-sm text-gray-600 mb-4">{candidate.political_party}</p>

                          {selectedPresident === candidate.id && (
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ghana-green">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </section>
              )}

              <Separator className="my-8" />

              <section>
                <h2 className="text-2xl font-semibold mb-4">Parliamentary Candidates</h2>
                <p className="text-gray-600 mb-6">
                  Select your preferred candidate for Member of Parliament
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {parliamentaryCandidates.map((candidate) => (
                    <GlassCard
                      key={candidate.id}
                      className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${selectedMP === candidate.id
                          ? 'ring-2 ring-ghana-green bg-ghana-green/5'
                          : ''
                        }`}
                      onClick={() => handleSelectMP(candidate.id)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full bg-gray-100">
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <User className="h-12 w-12 text-gray-400" />
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-1">{candidate.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{candidate.political_party}</p>

                        {selectedMP === candidate.id && (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ghana-green">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>

              <div className="flex justify-end mt-8">
                <GhanaButton
                  variant="gold"
                  size="lg"
                  onClick={handleReview}
                  className="flex items-center gap-2"
                >
                  Review Your Vote <ArrowRight size={18} />
                </GhanaButton>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <GlassCard className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Review Your Selections</h2>
                  <p className="text-gray-600">
                    Please confirm your selections before submitting your vote
                  </p>
                </div>

                <div className="space-y-8">
                  {electionDetails.type.includes('Presidential') && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Presidential Candidate</h3>
                      {selectedPresident ? (
                        <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                          <div className="relative w-16 h-16 overflow-hidden rounded-full bg-gray-100 mr-4">
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                              <User className="h-8 w-8 text-gray-400" />
                            </div>
                          </div>

                          <div>
                            <p className="font-semibold">
                              {getSelectedCandidate(selectedPresident, presidentialCandidates)?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {getSelectedCandidate(selectedPresident, presidentialCandidates)?.political_party}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600">No selection made</p>
                      )}
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Parliamentary Candidate</h3>
                    {selectedMP ? (
                      <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                        <div className="relative w-16 h-16 overflow-hidden rounded-full bg-gray-100 mr-4">
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <p className="font-semibold">
                            {getSelectedCandidate(selectedMP, parliamentaryCandidates)?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {getSelectedCandidate(selectedMP, parliamentaryCandidates)?.political_party}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">No selection made</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-12">
                  <GhanaButton
                    variant="black"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={16} className="mr-1" /> Back to Selection
                  </GhanaButton>

                  <GhanaButton
                    variant="red"
                    size="lg"
                    onClick={handleSubmitVote}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Vote"}
                  </GhanaButton>
                </div>
              </GlassCard>
            </div>
          )}
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

export default Voting;