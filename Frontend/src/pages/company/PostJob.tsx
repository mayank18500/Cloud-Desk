import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { Briefcase, Plus, Users, Trash2 } from 'lucide-react'; // Import Trash2
import { Badge } from '../../components/shared/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { getMediaUrl } from '../../lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../components/ui/dialog';
import { API_URL } from '../../lib/api';

export default function PostJob() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState(''); // Comma separated
    const [budget, setBudget] = useState('');

    const fetchCompanyJobs = async () => {
        if (!user?.id) return;
        const res = await fetch(`${API_URL}/api/jobs/company/${user.id}`);
        if (res.ok) setJobs(await res.json());
    };

    useEffect(() => { fetchCompanyJobs(); }, [user]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        try {
            const res = await fetch('${API_URL}/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyId: user.id,
                    title,
                    description,
                    requirements: requirements.split(',').map(s => s.trim()),
                    budget: Number(budget)
                })
            });

            if (res.ok) {
                toast.success("Job Posted Successfully!");
                setIsCreateOpen(false);
                setTitle(''); setDescription(''); setRequirements(''); setBudget('');
                fetchCompanyJobs();
            }
        } catch (error) {
            toast.error("Failed to post job");
        }
    };

    const handleDelete = async (jobId: string) => {
        if (!confirm("Are you sure you want to delete this job posting?")) return;
        try {
            const res = await fetch(`${API_URL}/api/jobs/${jobId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success("Job deleted");
                setJobs(jobs.filter(j => j._id !== jobId));
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            toast.error("Error deleting job");
        }
    };

    const handleSelectApplicant = async (jobId: string, interviewerId: string) => {
        try {
             const res = await fetch(`${API_URL}/api/jobs/${jobId}/select`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interviewerId })
            });
            if (res.ok) {
                toast.success("Applicant Selected! Chat created.");
                fetchCompanyJobs();
            }
        } catch (e) { toast.error("Selection failed"); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2"><Briefcase className="h-8 w-8 text-primary" /> My Job Postings</h1>
                    <p className="text-muted-foreground">Manage your open positions and applicants</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Post New Job</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create Job Posting</DialogTitle>
                            <DialogDescription>Fill in the details for the new position.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 py-4">
                            <div className="space-y-2"><Label>Job Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} required /></div>
                            <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} required /></div>
                            <div className="space-y-2"><Label>Requirements (comma separated)</Label><Input value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="React, Node.js, AWS" /></div>
                            <div className="space-y-2"><Label>Budget (₹)</Label><Input type="number" value={budget} onChange={e => setBudget(e.target.value)} required /></div>
                            <Button type="submit" className="w-full">Post Job</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6">
                {jobs.map(job => (
                    <Card key={job._id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{job.title}</CardTitle>
                                    <CardDescription className="mt-1">Budget: ₹{job.budget} • Posted on {new Date().toLocaleDateString()}</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                     <Badge>{job.status}</Badge>
                                     <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(job._id)}
                                     >
                                         <Trash2 className="h-4 w-4" />
                                     </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <h4 className="font-semibold mb-2 flex items-center gap-2"><Users className="h-4 w-4" /> Applicants ({job.applicants.length})</h4>
                             {job.applicants.length === 0 ? (
                                 <p className="text-sm text-muted-foreground italic">No applicants yet.</p>
                             ) : (
                                 <div className="space-y-3">
                                     {job.applicants.map((app: any) => (
                                         <div key={app._id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border">
                                             <div className="flex items-center gap-3">
                                                 <Avatar>
                                                     <AvatarImage src={getMediaUrl(app.interviewerId?.avatar)} />
                                                     <AvatarFallback>{app.interviewerId?.name?.[0]}</AvatarFallback>
                                                 </Avatar>
                                                 <div>
                                                     <p className="font-medium text-sm">{app.interviewerId?.name}</p>
                                                     <p className="text-xs text-muted-foreground">{app.interviewerId?.title}</p>
                                                 </div>
                                             </div>
                                             {app.status === 'applied' ? (
                                                 <Button size="sm" variant="outline" onClick={() => handleSelectApplicant(job._id, app.interviewerId?._id)}>Select</Button>
                                             ) : (
                                                 <Badge variant="success">Selected</Badge>
                                             )}
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </CardContent>
                    </Card>
                ))}
                {jobs.length === 0 && <div className="text-center py-10 text-muted-foreground">You haven't posted any jobs yet.</div>}
            </div>
        </div>
    );
}