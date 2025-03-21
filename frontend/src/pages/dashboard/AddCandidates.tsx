
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Plus, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useElectionStore } from '@/hooks/elections';

interface Candidate {
  id: string;
  name: string;
  party: string;
  constituency?: string;
}

const AddCandidates: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('presidential');
  const [presidentialCandidates, setPresidentialCandidates] = useState<Candidate[]>([]);
  const [parliamentaryCandidates, setParliamentaryCandidates] = useState<Candidate[]>([]);
  
  const {appendPalCandidates, appendPresCandidates, pal_candidates, pres_candidates} = useElectionStore()

  const [newCandidate, setNewCandidate] = useState<Candidate>({
    id: '',
    name: '',
    party: '',
    constituency: '',
  });

  const resetNewCandidate = () => {
    setNewCandidate({
      id: '',
      name: '',
      party: '',
      constituency: '',
    });
  };

  const handleInputChange = (field: keyof Candidate, value: string) => {
    setNewCandidate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCandidate = () => {
    // Validate fields
    if (!newCandidate.id || !newCandidate.name || !newCandidate.party) {
      toast.error("Please fill all required fields");
      return;
    }

    if (activeTab === 'parliamentary' && !newCandidate.constituency) {
      toast.error("Constituency is required for parliamentary candidates");
      return;
    }

    // Check if candidate ID already exists
    const candidateExists = [...presidentialCandidates, ...parliamentaryCandidates]
      .some(c => c.id === newCandidate.id);
    
    if (candidateExists) {
      toast.error("A candidate with this ID already exists");
      return;
    }

    // Add candidate to the appropriate list
    if (activeTab === 'presidential') {
      setPresidentialCandidates(prev => [...prev, { ...newCandidate }]);
      toast.success("Presidential candidate added");
    } else {
      setParliamentaryCandidates(prev => [...prev, { ...newCandidate }]);
      toast.success("Parliamentary candidate added");
    }

    // Reset form
    resetNewCandidate();
  };

  const removeCandidate = (id: string, type: 'presidential' | 'parliamentary') => {
    if (type === 'presidential') {
      setPresidentialCandidates(prev => prev.filter(c => c.id !== id));
    } else {
      setParliamentaryCandidates(prev => prev.filter(c => c.id !== id));
    }
    toast.success("Candidate removed");
  };

  const handleSubmit = () => {
    if (presidentialCandidates.length === 0 && parliamentaryCandidates.length === 0) {
      toast.error("Please add at least one candidate");
      return;
    }

    appendPresCandidates(presidentialCandidates.map(t => ({
      name: t.name, 
      political_party: t.party,
    })))

    appendPalCandidates(parliamentaryCandidates.map(t => ({
      name: t.name,
      political_party: t.party,
      constituency_id: 1
    })))

    navigate('/review-election');
  };

  return (
    <div className="page-transition">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add Candidates</h1>
        <p className="text-muted-foreground mt-1">Add presidential and parliamentary candidates to the election</p>
      </div>

      <Tabs 
        defaultValue="presidential" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="presidential">Presidential</TabsTrigger>
          <TabsTrigger value="parliamentary">Parliamentary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="presidential" className="mt-6">
          <Card className="openballot-card">
            <CardHeader className="pb-3">
              <CardTitle>Presidential Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="pres-id">Candidate ID <span className="text-ghana-red">*</span></Label>
                  <Input
                    id="pres-id"
                    className="openballot-input"
                    placeholder="e.g. PRES001"
                    value={newCandidate.id}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pres-name">Full Name <span className="text-ghana-red">*</span></Label>
                  <Input
                    id="pres-name"
                    className="openballot-input"
                    placeholder="Candidate's full name"
                    value={newCandidate.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pres-party">Political Party <span className="text-ghana-red">*</span></Label>
                  <Input
                    id="pres-party"
                    className="openballot-input"
                    placeholder="e.g. NPP, NDC"
                    value={newCandidate.party}
                    onChange={(e) => handleInputChange('party', e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={addCandidate}
                className="openballot-button openballot-button-secondary mb-6"
              >
                <UserPlus size={18} />
                <span>Add Presidential Candidate</span>
              </Button>
              
              {presidentialCandidates.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Party</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border">
                      {pres_candidates.map((candidate) => (
                        <tr key={candidate.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.political_party}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost" 
                              size="sm"
                              // onClick={() => removeCandidate(candidate.id, 'presidential')}
                              className="text-ghana-red hover:bg-ghana-red/10 hover:text-ghana-red"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No presidential candidates added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="parliamentary" className="mt-6">
          <Card className="openballot-card">
            <CardHeader className="pb-3">
              <CardTitle>Parliamentary Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="parl-id">Candidate ID <span className="text-ghana-red">*</span></Label>
                  <Input
                    id="parl-id"
                    className="openballot-input"
                    placeholder="e.g. PARL001"
                    value={newCandidate.id}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parl-name">Full Name <span className="text-ghana-red">*</span></Label>
                  <Input
                    id="parl-name"
                    className="openballot-input"
                    placeholder="Candidate's full name"
                    value={newCandidate.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parl-constituency">Constituency <span className="text-ghana-red">*</span></Label>
                  <Input
                    id="parl-constituency"
                    className="openballot-input"
                    placeholder="e.g. Ayawaso West Wuogon"
                    value={newCandidate.constituency || ''}
                    onChange={(e) => handleInputChange('constituency', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parl-party">Political Party <span className="text-ghana-red">*</span></Label>
                  <Input
                    id="parl-party"
                    className="openballot-input"
                    placeholder="e.g. NPP, NDC"
                    value={newCandidate.party}
                    onChange={(e) => handleInputChange('party', e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={addCandidate}
                className="openballot-button openballot-button-secondary mb-6"
              >
                <UserPlus size={18} />
                <span>Add Parliamentary Candidate</span>
              </Button>
              
              {parliamentaryCandidates.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Constituency</th> */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Party</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border">
                      {pal_candidates.map((candidate) => (
                        <tr key={candidate.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.name}</td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.constituency}</td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.political_party}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost" 
                              size="sm"
                              // onClick={() => removeCandidate(candidate.id, 'parliamentary')}
                              className="text-ghana-red hover:bg-ghana-red/10 hover:text-ghana-red"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No parliamentary candidates added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          className="openballot-button openballot-button-primary"
        >
          <span>Continue to Review</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default AddCandidates;