
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, Clock, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useElectionStore } from '@/hooks/elections';
import axios from 'axios';



const ReviewElection: React.FC = () => {
  const navigate = useNavigate();
  const {pres_candidates, pal_candidates, election} = useElectionStore()

  const mockElectionDetails = election
  
  const mockPresidentialCandidates = pres_candidates
  
  const mockParliamentaryCandidates = pal_candidates

  const handleCreateElection = async () => {
    toast.success("Election created successfully!");

    const body = {
      election, pres_candidates, pal_candidates
    }
    const res = await axios.post("http://localhost:3001/election", body);
    const data = res.data;
    console.log(data);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <div className="page-transition">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Review Election</h1>
        <p className="text-muted-foreground mt-1">Review and confirm election details before finalizing</p>
      </div>

      <div className="space-y-8">
        <Card className="openballot-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-ghana-green" />
              Election Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Election Title</h3>
                <p className="text-lg">{mockElectionDetails.title}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-lg">{mockElectionDetails.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Start Date & Time</h3>
                {/* <p className="text-lg">
                  {mockElectionDetails.startDate} at {mockElectionDetails.startTime}
                </p> */}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">End Date & Time</h3>
                <p className="text-lg">
                  {/* {mockElectionDetails.endDate} at {mockElectionDetails.endTime} */}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="openballot-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-ghana-green" />
              Presidential Candidates ({mockPresidentialCandidates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Party</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                  {mockPresidentialCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.political_party}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="openballot-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-ghana-green" />
              Parliamentary Candidates ({mockParliamentaryCandidates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Constituency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Party</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                  {mockParliamentaryCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.name}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.constituency}</td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.political_party}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Once you finalize this election, the details cannot be modified. Please review all information carefully before proceeding.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline"
            onClick={() => navigate('/add-candidates')}
          >
            Go Back to Edit
          </Button>
          <Button 
            className="openballot-button openballot-button-primary"
            onClick={handleCreateElection}
          >
            <CheckCircle size={18} />
            <span>Finalize and Create Election</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewElection;