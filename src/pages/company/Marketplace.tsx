import { useState, useMemo, useEffect } from 'react';
import { FilterBar } from '@/components/marketplace/FilterBar';
// Import the interface from the component we just fixed
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
import { Users, Calendar as CalendarIcon, Loader2, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Marketplace() {
  const { user } = useAuth();
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | null>(null);
  
  // Booking Modal State
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [bookingDetails, setBookingDetails] = useState({
    candidateName: '',
    role: '',
    time: '10:00',
    notes: '',
  });

  // 1. Fetch Interviewers
  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/interviewer'); 
        
        if (!response.ok) {
           console.error("Server returned:", response.status);
           setInterviewers([]); // Safety fallback
           return;
        }
        
        const data = await response.json();
        
        // CRASH PROTECTION: Check if data is actually an array
        if (!Array.isArray(data)) {
            console.error("Expected array but got:", data);
            setInterviewers([]);
            return;
        }
        
        const formattedData = data.map((item: any) => ({
            ...item,
            id: item._id || item.id,
            hourlyRate: item.hourlyRate || 0,
            skills: item.skills || [],
            name: item.name || 'Unknown Interviewer',
            title: item.title || 'Interviewer',
            yearsExperience: item.yearsExperience || 0,
            rating: item.rating || 0
        }));
        
        setInterviewers(formattedData);
      } catch (error) {
        console.error("Error loading interviewers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviewers();
  }, []);

  // 2. Filter Logic
  const allSkills = useMemo(() => {
    return [...new Set(interviewers.flatMap(i => i.skills || []))].sort();
  }, [interviewers]);

  const filteredInterviewers = useMemo(() => {
    return interviewers.filter(interviewer => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches = 
            interviewer.name.toLowerCase().includes(query) ||
            interviewer.title.toLowerCase().includes(query) ||
            interviewer.skills?.some(s => s.toLowerCase().includes(query));
        if (!matches) return false;
      }
      // Skills
      if (skillFilter && !interviewer.skills?.includes(skillFilter)) return false;
      // Price
      if (priceFilter) {
        if (interviewer.hourlyRate < priceFilter.min || interviewer.hourlyRate > priceFilter.max) return false;
      }
      return true;
    });
  }, [searchQuery, skillFilter, priceFilter, interviewers]);

  const handleHire = (interviewer: Interviewer) => {
    setSelectedInterviewer(interviewer);
  };

  // 3. Handle Booking Logic
  const handleBooking = async () => {
    if (!selectedDate || !bookingDetails.candidateName || !bookingDetails.role || !bookingDetails.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user?.id) {
        toast.error("You must be logged in as a Company to book.");
        return;
    }

    try {
        const payload = {
            companyId: user.id,
            interviewerId: selectedInterviewer?.id,
            candidateName: bookingDetails.candidateName,
            role: bookingDetails.role,
            date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
            time: bookingDetails.time,
            notes: bookingDetails.notes
        };

        const response = await fetch('http://localhost:5000/api/interviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Booking failed');

        toast.success(`Interview scheduled with ${selectedInterviewer?.name}!`);
        
        // Reset Modal
        setSelectedInterviewer(null);
        setSelectedDate(undefined);
        setBookingDetails({ candidateName: '', role: '', time: '10:00', notes: '' });

    } catch (error) {
        console.error(error);
        toast.error("Failed to book interview.");
    }
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
          Find and hire top interviewers
        </p>
      </div>

      <FilterBar
        onSearch={setSearchQuery}
        onSkillFilter={setSkillFilter}
        onPriceFilter={setPriceFilter}
        skills={allSkills}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredInterviewers.length} of {interviewers.length} interviewers
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

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
          <p className="text-muted-foreground mt-1">
            Ensure backend is running and you have users with role "interviewer".
          </p>
        </div>
      )}

      {/* Booking Modal */}
      <Dialog open={!!selectedInterviewer} onOpenChange={(open) => !open && setSelectedInterviewer(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Interview with {selectedInterviewer?.name}</DialogTitle>
            <DialogDescription>
              Book a session (Rate: ${selectedInterviewer?.hourlyRate}/hr)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="candidateName">Candidate Name *</Label>
                <Input
                    id="candidateName"
                    value={bookingDetails.candidateName}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, candidateName: e.target.value })}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                    id="role"
                    value={bookingDetails.role}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, role: e.target.value })}
                />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Date *</Label>
                    <div className="border rounded-lg p-2 flex justify-center">
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
                    <Label htmlFor="time">Time *</Label>
                    <div className="relative">
                        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="time"
                            type="time"
                            className="pl-9"
                            value={bookingDetails.time}
                            onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
                        />
                    </div>
                    <Label htmlFor="notes" className="mt-4 block">Notes</Label>
                    <Textarea
                        id="notes"
                        className="h-32"
                        placeholder="Topics..."
                        value={bookingDetails.notes}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                    />
                </div>
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