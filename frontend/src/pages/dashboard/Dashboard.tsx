
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PlusCircle, Calendar, Users, BarChart } from 'lucide-react';
import axios from 'axios';
import { ElectionBody } from '@/hooks/elections';



const ElectionCard: React.FC<ElectionBody> = ({
  elections, pres_candidates, pal_candidates
}) => {
  const statusColors = {
    upcoming: 'bg-ghana-gold/10 text-ghana-gold border-ghana-gold/20',
    active: 'bg-ghana-green/10 text-ghana-green border-ghana-green/20',
    completed: 'bg-ghana-red/10 text-ghana-red border-ghana-red/20',
  };

  useEffect(() => {
    console.log(pal_candidates)
  }, [])

  const statusText = {
    upcoming: 'Upcoming',
    active: 'Active',
    completed: 'Completed',
  };
  // return (<>{JSON.stringify(election)}</>)

  return (
    <Card className="openballot-card animate-slideUp">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{elections.title}</CardTitle>
            <CardDescription>
              {new Date(elections.start_time).toLocaleDateString()} - {new Date(elections.end_time).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors['active']}`}>
            {statusText['active']}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-muted-foreground" />
            <span className="text-sm">{pres_candidates.length + pal_candidates.length} Candidates</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-sm">{elections.status === 'completed' ? 'Ended on' : 'Starting'}: {new Date(elections.start_time).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full mt-2">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [mockElections, setElections] = useState<ElectionBody[]>()

  useEffect(() => {
    async function LoadElectionData() {
      const res = await axios.get("http://localhost:3001/election")
      // console.log(res.data.map(e => Object.keys(e)))
      setElections(res.data as ElectionBody[])
    }

    LoadElectionData()
  }, [])

  return (
    <div className="page-transition space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your elections and view statistics</p>
        </div>
        <Button
          className="openballot-button openballot-button-primary"
          onClick={() => navigate('/create-election')}
        >
          <PlusCircle size={18} />
          <span>Create Election</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="openballot-card animate-slideUp">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{mockElections?.length}</div>
          </CardContent>
        </Card>

        <Card className="openballot-card animate-slideUp animate-delay-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{mockElections?.length}</div>
          </CardContent>
        </Card>

        <Card className="openballot-card animate-slideUp animate-delay-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{mockElections?.reduce((total, election) => total + election.pres_candidates.length + election.pal_candidates.length, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Elections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockElections?.map((ele, index) => (
            <ElectionCard
              key={index}
              elections={ele.elections}
              pal_candidates={ele.pal_candidates}
              pres_candidates={ele.pres_candidates}
            />
            // <></>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;