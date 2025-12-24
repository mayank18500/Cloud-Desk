import { useState, useMemo, useEffect } from 'react';
import { FilterBar } from '@/components/marketplace/FilterBar';
import { InterviewerCard, Interviewer } from '@/components/marketplace/InterviewerCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { Users, Calendar as CalendarIcon, Loader2 } from 'lucide-react';

export default function Marketplace() {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | null>(null);
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [bookingDetails, setBookingDetails] = useState({
    candidateName: '',
    role: '',
    notes: '',
  });

  // Fetch Interviewers from Backend
  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/interviewers');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        // Ensure ID mapping handles _id from MongoDB
        const formattedData = data.map((item: any) => ({
            ...item,
            id: item._id || item.id
        }));
        
        setInterviewers(formattedData);
      } catch (error) {
        console.error("Error loading interviewers:", error);
        toast.error("Could not load interviewers. Please ensure backend is running.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviewers();
  }, []);

  const allSkills = useMemo(() => {
    return [...new Set(interviewers.flatMap(i => i.skills || []))].sort();
  }, [interviewers]);

  const filteredInterviewers = useMemo(() => {
    return interviewers.filter(interviewer => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = interviewer.name.toLowerCase().includes(query);
        const matchesTitle = interviewer.title.toLowerCase().includes(query);
        const matchesSkill = interviewer.skills?.some(s => s.toLowerCase().includes(query));
        if (!matchesName && !matchesTitle && !matchesSkill) return false;
      }

      // Skill filter
      if (skillFilter && !interviewer.skills?.includes(skillFilter)) {
        return false;
      }

      // Price filter
      if (priceFilter) {
        if (interviewer.hourlyRate < priceFilter.min || interviewer.hourlyRate > priceFilter.max) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, skillFilter, priceFilter, interviewers]);

  const handleHire = (interviewer: Interviewer) => {
    setSelectedInterviewer(interviewer);
  };

  const handleBooking = () => {
    if (!selectedDate || !bookingDetails.candidateName || !bookingDetails.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would add a POST request to save the booking to the backend
    toast.success(`Interview scheduled with ${selectedInterviewer?.name}!`, {
      description: `${bookingDetails.candidateName} for ${bookingDetails.role}`,
    });
    
    setSelectedInterviewer(null);
    setSelectedDate(undefined);
    setBookingDetails({ candidateName: '', role: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Interviewer Marketplace
        </h1>
        <p className="text-muted-foreground mt-1">
          Find and hire top interviewers for your candidates
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        onSearch={setSearchQuery}
        onSkillFilter={setSkillFilter}
        onPriceFilter={setPriceFilter}
        skills={allSkills}
      />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredInterviewers.length} of {interviewers.length} interviewers
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Interviewer Grid */}
      {!isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviewers.map((interviewer, index) => (
            <InterviewerCard
                key={interviewer.id}
                interviewer={interviewer}
                onHire={handleHire}
                className={`animate-fade-in stagger-${(index % 5) + 1}`}
            />
            ))}
        </div>
      )}

      {!isLoading && filteredInterviewers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No interviewers found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your filters or checking your database connection</p>
        </div>
      )}

      {/* Booking Modal */}
      <Dialog open={!!selectedInterviewer} onOpenChange={(open) => !open && setSelectedInterviewer(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Interview with {selectedInterviewer?.name}</DialogTitle>
            <DialogDescription>
              Book a ${selectedInterviewer?.hourlyRate}/hr interview session
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="candidateName">Candidate Name *</Label>
              <Input
                id="candidateName"
                placeholder="e.g., John Smith"
                value={bookingDetails.candidateName}
                onChange={(e) => setBookingDetails({ ...bookingDetails, candidateName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Interview Role *</Label>
              <Input
                id="role"
                placeholder="e.g., Senior React Developer"
                value={bookingDetails.role}
                onChange={(e) => setBookingDetails({ ...bookingDetails, role: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Date *</Label>
              <div className="flex justify-center border rounded-lg p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any specific areas to focus on..."
                value={bookingDetails.notes}
                onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSelectedInterviewer(null)}>
              Cancel
            </Button>
            <Button onClick={handleBooking}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}