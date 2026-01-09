import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FilterBar } from '../../components/marketplace/FilterBar';
import { InterviewerCard, Interviewer } from '../../components/marketplace/InterviewerCard';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Calendar } from '../../components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { toast } from 'sonner';
import { Users, Calendar as CalendarIcon, Loader2, Clock, IndianRupee, FileText, ExternalLink, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { getMediaUrl } from '../../lib/utils';
import { API_URL } from '../../lib/api';

export default function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate(); // Hook for navigation
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | null>(null);

  // Booking Modal State
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  const [viewingInterviewer, setViewingInterviewer] = useState<Interviewer | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [bookingDetails, setBookingDetails] = useState({
    candidateName: '',
    role: '',
    time: '10:00 AM',
    description: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Generate time slots (12-hour format, 30 min intervals)
  const timeHourSlots = useMemo(() => {
    const slots = [];
    slots.push("12:00", "12:30");
    for (let i = 1; i <= 11; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
      slots.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return slots.sort();
  }, []);

  const [currentTimeVal, currentPeriod] = bookingDetails.time.includes(' ')
    ? bookingDetails.time.split(' ')
    : ['10:00', 'AM'];

  const handleTimeValChange = (val: string) => {
    setBookingDetails({ ...bookingDetails, time: `${val} ${currentPeriod}` });
  };

  const handlePeriodChange = (val: string) => {
    setBookingDetails({ ...bookingDetails, time: `${currentTimeVal} ${val}` });
  };

  // 1. Fetch Interviewers
  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/interviewer`);
        if (!response.ok) {
          setInterviewers([]);
          return;
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
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
          yearsExperience: item.yearsExperience || 0
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
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches =
          interviewer.name.toLowerCase().includes(query) ||
          interviewer.title.toLowerCase().includes(query) ||
          interviewer.skills?.some(s => s.toLowerCase().includes(query));
        if (!matches) return false;
      }
      if (skillFilter && !interviewer.skills?.includes(skillFilter)) return false;
      if (priceFilter) {
        if (interviewer.hourlyRate < priceFilter.min || interviewer.hourlyRate > priceFilter.max) return false;
      }
      return true;
    });
  }, [searchQuery, skillFilter, priceFilter, interviewers]);

  const handleHire = (interviewer: Interviewer) => {
    setSelectedInterviewer(interviewer);
  };
  
  // NEW: Handle Message Click
  const handleMessage = (interviewer: Interviewer) => {
    navigate(`/chat?userId=${interviewer.id}`);
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
      const formData = new FormData();
      formData.append('companyId', user.id);
      formData.append('interviewerId', selectedInterviewer?.id || '');
      formData.append('candidateName', bookingDetails.candidateName);
      formData.append('role', bookingDetails.role);
      formData.append('date', format(selectedDate, 'yyyy-MM-dd'));
      formData.append('time', bookingDetails.time);
      formData.append('description', bookingDetails.description);
      if (cvFile) {
        formData.append('cv', cvFile);
      }

      const response = await fetch('${API_URL}/api/interviews', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Booking failed');

      toast.success(`Interview scheduled with ${selectedInterviewer?.name}!`);

      // Reset Modal
      setSelectedInterviewer(null);
      setSelectedDate(undefined);
      setBookingDetails({ candidateName: '', role: '', time: '10:00 AM', description: '' });
      setCvFile(null);

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
              onViewProfile={setViewingInterviewer}
              onMessage={handleMessage} // Pass the message handler
              className={`animate-fade-in stagger-${(index % 5) + 1}`}
            />
          ))}
        </div>
      )}

      {/* Profile Details Modal */}
      <Dialog open={!!viewingInterviewer} onOpenChange={(open) => !open && setViewingInterviewer(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingInterviewer?.name}</DialogTitle>
            <DialogDescription>{viewingInterviewer?.title}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 ring-4 ring-primary/10">
                <AvatarImage src={getMediaUrl(viewingInterviewer?.avatar)} />
                <AvatarFallback className="text-2xl bg-gradient-signature text-white">
                  {viewingInterviewer?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-lg">
                  <IndianRupee className="h-5 w-5" />
                  <span>₹{viewingInterviewer?.hourlyRate}/hr</span>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Clock className="h-4 w-4" />
                  <span>{viewingInterviewer?.yearsExperience} years experience</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">About</h4>
              <p className="text-sm leading-relaxed text-foreground/80">
                {(viewingInterviewer as any)?.bio || "No bio provided yet."}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {viewingInterviewer?.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium border border-primary/10">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {viewingInterviewer?.cv && (
              <div className="pt-4 border-t">
                <div className="flex flex-col gap-3">
                  <a
                    href={getMediaUrl(viewingInterviewer.cv)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    View Professional CV / Resume
                  </a>
                  {viewingInterviewer?.portfolio && (
                    <a
                      href={viewingInterviewer.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Professional Link / Portfolio
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
             <Button variant="outline" className="flex-1" onClick={() => handleMessage(viewingInterviewer!)}>
              <MessageSquare className="mr-2 h-4 w-4" /> Message
            </Button>
            <Button
              className="flex-1 btn-gradient shadow-lg"
              onClick={() => {
                setSelectedInterviewer(viewingInterviewer);
                setViewingInterviewer(null);
              }}
            >
              Hire {viewingInterviewer?.name.split(' ')[0]}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Booking Modal (Keep existing code ...) */}
      <Dialog open={!!selectedInterviewer} onOpenChange={(open) => !open && setSelectedInterviewer(null)}>
        {/* ... (Keep existing booking modal content exactly as before) ... */}
         <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Schedule Interview with {selectedInterviewer?.name}</DialogTitle>
            <DialogDescription>
              Book a session (Rate: ₹{selectedInterviewer?.hourlyRate}/hr)
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
                <div className="flex items-center justify-between text-sm pt-2 border-t border-primary/5">
                  <div className="flex items-center gap-1.5 text-primary font-bold">
                    <IndianRupee className="h-4 w-4" />
                    <span>₹{selectedInterviewer?.hourlyRate}/hr</span>
                  </div>
                  {selectedInterviewer?.cv && (
                    <a
                      href={getMediaUrl(selectedInterviewer.cv)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary underline flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" /> View CV
                    </a>
                  )}
                  <span className="text-muted-foreground">{selectedInterviewer?.yearsExperience}y exp</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Select
                      value={currentTimeVal}
                      onValueChange={handleTimeValChange}
                    >
                      <SelectTrigger className="pl-9">
                        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                        <SelectValue placeholder="Time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeHourSlots.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-[100px]">
                    <Select
                      value={currentPeriod}
                      onValueChange={handlePeriodChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Label htmlFor="description" className="mt-4 block">Candidate/Job Description</Label>
                <Textarea
                  id="description"
                  className="h-24"
                  placeholder="Details about the role or candidate..."
                  value={bookingDetails.description}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, description: e.target.value })}
                />

                <div className="mt-4">
                  <Label htmlFor="cv" className="block mb-2">Upload CV (PDF/Doc)</Label>
                  <Input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCvFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
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