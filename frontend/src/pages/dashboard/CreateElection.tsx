
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useElectionStore } from '@/hooks/elections';

interface ElectionData {
  title: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: string;
  endTime: string;
}

const CreateElection: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ElectionData>({
    title: '',
    description: '',
    startDate: undefined,
    endDate: undefined,
    startTime: '08:00',
    endTime: '17:00',
  });

  const { SetElection } = useElectionStore()


  const handleChange = (field: keyof ElectionData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate dates
    if (formData.startDate > formData.endDate) {
      toast.error("End date must be after start date");
      return;
    }


    SetElection({
      title: formData.title,
      description: formData.description,
      start_time: formData.startDate,
      end_time: formData.endDate,
      status: 'ongoing'
    })

    toast.success("Election created successfully");
    navigate('/add-candidates');
  };

  return (
    <div className="page-transition max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Election</h1>
        <p className="text-muted-foreground mt-1">Set up a new election with start and end dates</p>
      </div>

      <Card className="openballot-card">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Election Title <span className="text-ghana-red">*</span></Label>
              <Input
                id="title"
                className="openballot-input"
                placeholder="e.g. Presidential Election 2024"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                className="openballot-input"
                placeholder="Provide a short description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Start Date <span className="text-ghana-red">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal openballot-input",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleChange('startDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time <span className="text-ghana-red">*</span></Label>
                <div className="flex items-center h-12">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    className="openballot-input"
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>End Date <span className="text-ghana-red">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal openballot-input",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleChange('endDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time <span className="text-ghana-red">*</span></Label>
                <div className="flex items-center h-12">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    className="openballot-input"
                    value={formData.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                className="openballot-button openballot-button-primary"
              >
                <span>Continue to Add Candidates</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateElection;