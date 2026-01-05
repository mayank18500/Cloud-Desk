import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Badge } from '@/components/shared/Badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Briefcase, IndianRupee, Plus, Check, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PostJob() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [newJob, setNewJob] = useState({ title: '', description: '', budget: '', requirements: '' });

  // Fetch Existing Jobs
  const fetchJobs = async () => {
    if (!user?.id) return;
    const res = await fetch(`http://localhost:5000/api/jobs/company/${user.id}`);
    if (res.ok) setJobs(await res.json());
  };

  useEffect(() => { fetchJobs(); }, [user]);

  // Handle Post
  const handlePost = async () => {
    if (!newJob.title || !newJob.description) return toast.error("Title and Description required");

    try {
      await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: user?.id,
          title: newJob.title,
          description: newJob.description,
          budget: Number(newJob.budget),
          requirements: newJob.requirements.split(',').map(s => s.trim())
        })
      });
      toast.success("Job Posted!");
      setNewJob({ title: '', description: '', budget: '', requirements: '' });
      fetchJobs();
    } catch (e) { toast.error("Failed to post job"); }
  };

  // Handle Select Applicant
  const handleSelect = async (jobId: string, interviewerId: string) => {
    try {
      await fetch(`http://localhost:5000/api/jobs/${jobId}/select`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewerId })
      });
      toast.success("Interviewer Selected!");
      fetchJobs();
    } catch (e) { toast.error("Failed to select"); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Hiring Needs</h1>
        <p className="text-muted-foreground">Post requirements and manage applicants.</p>
      </div>

      {/* Post Form */}
      <Card>
        <CardHeader><CardTitle>Post a New Need</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Job Title (e.g. Senior React Interviewer)" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
          <Textarea placeholder="Description" value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Budget (₹)" type="number" value={newJob.budget} onChange={e => setNewJob({ ...newJob, budget: e.target.value })} />
            <Input placeholder="Requirements (comma separated)" value={newJob.requirements} onChange={e => setNewJob({ ...newJob, requirements: e.target.value })} />
          </div>
          <Button onClick={handlePost}><Plus className="mr-2 h-4 w-4" /> Post Job</Button>
        </CardContent>
      </Card>

      {/* Active Listings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Active Listings</h2>
        {jobs.map(job => (
          <Card key={job._id}>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
                </div>
                <Badge>₹{job.budget}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2 flex items-center gap-2"><Users className="h-4 w-4" /> Applicants ({job.applicants.length})</h3>
              <div className="space-y-2">
                {job.applicants.length === 0 && <p className="text-sm text-muted-foreground">No applicants yet.</p>}
                {job.applicants.map((app: any) => (
                  <div key={app._id} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{app.interviewerId.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{app.interviewerId.name}</p>
                        <p className="text-xs text-muted-foreground">{app.interviewerId.title} • ₹{app.interviewerId.hourlyRate}/hr</p>
                      </div>
                    </div>
                    {app.status === 'selected' ? (
                      <div className="flex gap-2">
                        <Badge variant="success"><Check className="h-3 w-3 mr-1" /> Hired</Badge>
                        <Button size="sm" variant="secondary" asChild>
                          <Link to={`/chat?userId=${app.interviewerId._id}`}>
                            <MessageSquare className="h-3 w-3 mr-1" /> Message
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleSelect(job._id, app.interviewerId._id)}>Select</Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import { Users } from 'lucide-react';