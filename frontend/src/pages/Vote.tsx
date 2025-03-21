import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, User, MapPin, Copy, ExternalLink, Wallet } from 'lucide-react';
import OpenBallotLogo from '@/components/OpenBallotLogo';
import GhanaButton from '@/components/GhanaButton';
import GlassCard from '@/components/GlassCard';
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { PalCandidates, PresCandidates } from '@/hooks/elections';
import axios from 'axios';
import Web3 from 'web3';
import { VotingContract } from '@/lib/voting';

interface WalletInfo {
    address: string;
    balance: string;
    isReady: boolean;
}

const Voting = () => {
    const navigate = useNavigate();
    const { electionId } = useParams();
    const [electionDetails, setElectionDetails] = useState<{
        title: string;
        type: string;
        constituency: string;
        id: string;
    } | null>(null);
    const [step, setStep] = useState(1); // 1: Presidential, 2: Parliamentary, 3: Review
    const [selectedPresident, setSelectedPresident] = useState<number | null>(null);
    const [selectedMP, setSelectedMP] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const storedAddress = localStorage.getItem('walletAddress');
    const [walletInfo, setWalletInfo] = useState<WalletInfo>({
        address: storedAddress!,
        balance: '0.05 ETH',
        isReady: false
    });

    const [showWalletDialog, setShowWalletDialog] = useState(false);

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

            } catch (error) {
                console.error('Error loading election:', error);
                toast.error('Failed to load election data');
            }
        };

        loadElectionData();
    }, [electionId]);

    useEffect(() => {
        // Simulate fetching election details
        setTimeout(() => {
            // if (electionId?.includes('presidential')) {
            setElectionDetails({
                title: '2025 Presidential Election',
                type: 'Presidential and Parliamentary',
                constituency: 'Ayawaso West Wuogon',
                id: electionId || 'election-001'
            });
            // } 
            // else {
            //     setElectionDetails({
            //         title: '2025 Parliamentary Election',
            //         type: 'Parliamentary Only',
            //         constituency: 'Ayawaso West Wuogon',
            //         id: electionId || 'election-002'
            //     });
            //     // If it's parliamentary only, skip to step 2
            //     setStep(2);
            // }
        }, 500);

        // Simulate wallet connection
        setTimeout(() => {
            setWalletInfo({
                address: walletInfo.address,
                balance: '0.05 ETH',
                isReady: true
            });
        }, 1000);
    }, [electionId]);

    const handleSelectPresident = (candidateId: number) => {
        setSelectedPresident(candidateId);
    };

    const handleSelectMP = (candidateId: number) => {
        setSelectedMP(candidateId);
    };

    const handleNextStep = () => {
        if (step === 1) {
            if (!selectedPresident && electionDetails?.type.includes('Presidential')) {
                toast("Selection Required", {
                    description: "Please select a presidential candidate.",
                    duration: 3000,
                });
                return;
            }
            setStep(2); // Move to parliamentary selection
        } else if (step === 2) {
            if (!selectedMP) {
                toast("Selection Required", {
                    description: "Please select a parliamentary candidate.",
                    duration: 3000,
                });
                return;
            }
            setStep(3); // Move to review
        }
    };

    const handlePreviousStep = () => {
        if (step === 2 && electionDetails?.type.includes('Presidential')) {
            setStep(1); // Go back to presidential selection
        } else if (step === 3) {
            setStep(2); // Go back to parliamentary selection
        }
    };

    const handleSubmitVote = () => {
        // Show wallet confirmation dialog instead of immediate submission
        setShowWalletDialog(true);
    };

    const handleConfirmWalletVote = async () => {
        setIsSubmitting(true);
        setShowWalletDialog(false);

        // Use MetaMask's provider (window.ethereum)
        const provider = (window as any).ethereum;
        const voting = new VotingContract(provider);

        // Example: Get current account and perform actions
        const accounts = await new Web3(provider).eth.requestAccounts();
        const fromAddress = accounts[0];

        // // Create an election
        // await voting.createElection(1, 1625097600, 1625184000, fromAddress);

        // Cast a vote
        await voting.castVote(+electionDetails?.id!, selectedPresident!, selectedMP!, fromAddress);

        // Simulate blockchain transaction for vote submission
        setTimeout(() => {
            setIsSubmitting(false);

            toast("Vote Submitted", {
                description: "Your vote has been recorded on the blockchain successfully.",
                duration: 3000,
            });

            navigate(`/results/${electionId}`);
        }, 2000);
    };

    const handleCopyWalletAddress = () => {
        navigator.clipboard.writeText(walletInfo.address);
        toast("Address Copied", {
            description: "Wallet address copied to clipboard.",
            duration: 2000,
        });
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

                    {/* Wallet Status */}
                    <div className="flex items-center">
                        <GlassCard className="py-2 px-4 flex items-center">
                            <Wallet className="h-4 w-4 mr-2 text-ghana-gold" />
                            <span className="text-sm font-medium mr-2">
                                {walletInfo.address.substring(0, 7)}...{walletInfo.address.substring(walletInfo.address.length - 4)}
                            </span>
                            <button
                                onClick={handleCopyWalletAddress}
                                className="text-gray-500 hover:text-gray-700"
                                title="Copy Address"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <span className="text-xs text-gray-600">{walletInfo.balance}</span>
                        </GlassCard>
                    </div>
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
                        <div className="text-sm text-gray-500">
                            Election ID: {electionDetails.id}
                        </div>

                        {/* Step indicator */}
                        <div className="flex items-center mt-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white 
                ${step >= 1 ? 'bg-ghana-gold' : 'bg-gray-300'}`}>1</div>
                            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-ghana-gold' : 'bg-gray-300'}`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white 
                ${step >= 2 ? 'bg-ghana-gold' : 'bg-gray-300'}`}>2</div>
                            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-ghana-gold' : 'bg-gray-300'}`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white 
                ${step >= 3 ? 'bg-ghana-gold' : 'bg-gray-300'}`}>3</div>
                        </div>

                        <div className="flex justify-between text-xs mt-2 text-gray-600">
                            <span>Presidential</span>
                            <span>Parliamentary</span>
                            <span>Review</span>
                        </div>
                    </div>

                    <div className="animate-fade-in">
                        {step === 1 && electionDetails.type.includes('Presidential') && (
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

                                <div className="flex justify-end mt-8">
                                    <GhanaButton
                                        variant="gold"
                                        size="lg"
                                        onClick={handleNextStep}
                                        className="flex items-center gap-2"
                                    >
                                        Next <ArrowRight size={18} />
                                    </GhanaButton>
                                </div>
                            </section>
                        )}

                        {step === 2 && (
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

                                <div className="flex justify-between mt-8">
                                    {electionDetails.type.includes('Presidential') && (
                                        <GhanaButton
                                            variant="black"
                                            onClick={handlePreviousStep}
                                            className="flex items-center gap-2"
                                        >
                                            <ArrowLeft size={18} /> Previous
                                        </GhanaButton>
                                    )}

                                    <GhanaButton
                                        variant="gold"
                                        size="lg"
                                        onClick={handleNextStep}
                                        className="flex items-center gap-2 ml-auto"
                                    >
                                        Review Your Vote <ArrowRight size={18} />
                                    </GhanaButton>
                                </div>
                            </section>
                        )}

                        {step === 3 && (
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
                                        onClick={handlePreviousStep}
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
                        )}
                    </div>
                </div>
            </main>

            {/* Wallet Confirmation Dialog */}
            <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Your Vote</DialogTitle>
                        <DialogDescription>
                            You are about to cast your vote using blockchain technology
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Wallet Address</span>
                                <button
                                    onClick={handleCopyWalletAddress}
                                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                                >
                                    Copy <Copy className="h-3 w-3 ml-1" />
                                </button>
                            </div>
                            <p className="text-sm font-mono break-all">{walletInfo.address}</p>

                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-sm font-medium">Balance</span>
                                <span className="text-sm">{walletInfo.balance}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-sm font-medium mb-2">Transaction Details</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Election ID</span>
                                    <input
                                        type="text"
                                        className="font-mono border border-gray-300 rounded px-2 py-1 text-sm"
                                        value={electionDetails.id}
                                        onChange={(e) => setElectionDetails(prev => prev ? { ...prev, id: e.target.value } : null)}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Gas Fee (estimated)</span>
                                    <span>0.001 ETH</span>
                                </div>
                            </div>
                        </div>

                        {walletInfo.isReady ? (
                            <div className="text-center text-sm text-green-600 mb-4">
                                <Check className="h-4 w-4 inline mr-1" /> Your wallet is ready to cast a vote
                            </div>
                        ) : (
                            <div className="text-center text-sm text-amber-600 mb-4">
                                Your wallet needs funding before you can vote
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
                        <GhanaButton variant="black" onClick={() => setShowWalletDialog(false)}>
                            Cancel
                        </GhanaButton>

                        {!walletInfo.isReady ? (
                            <div className="flex flex-col sm:flex-row gap-2">
                                {/* <GhanaButton variant="gold" onClick={handleCopyWalletAddress}>
                  Copy Address for Funding
                </GhanaButton> */}
                                <GhanaButton variant="gold" disabled>
                                    <ExternalLink className="h-4 w-4 mr-1" /> Fund Wallet
                                </GhanaButton>
                            </div>
                        ) : (
                            <GhanaButton
                                variant="red"
                                onClick={handleConfirmWalletVote}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : "Confirm and Cast Vote"}
                            </GhanaButton>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Footer */}
            <footer className="py-4 px-6 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-sm text-gray-500">
                        ©️ {new Date().getFullYear()} OpenBallot. Secure electronic voting for the future.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Voting;