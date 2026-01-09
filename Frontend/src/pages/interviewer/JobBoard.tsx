import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Badge } from '../../components/shared/Badge';
import { Building2, IndianRupee, Briefcase } from 'lucide-react';
import { API_URL } from '../../lib/api';

export default function JobBoard() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);

    const fetchJobs = async () => {
        const res = await fetch(`${API_URL}/api/jobs`);
        if (res.ok) setJobs(await res.json());
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleApply = async (jobId: string) => {
        if (!user?.id) return;
        try {
            const res = await fetch(`${API_URL}/api/jobs/${jobId}/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interviewerId: user.id })
            });
            if (res.ok) {
                toast.success("Applied successfully!");
                fetchJobs(); // Refresh to disable button
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to apply");
            }
        } catch (e) { toast.error("Error applying"); }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2"><Briefcase className="h-8 w-8 text-primary" /> Job Board</h1>
                <p className="text-muted-foreground">Find companies looking for your expertise.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map(job => {
                    const hasApplied = job.applicants.some((a: any) => a.interviewerId === user?.id);
                    return (
                        <Card key={job._id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{job.title}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{job.companyId?.name || "Company"}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <p className="text-sm text-foreground/80 line-clamp-3">{job.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {job.requirements.map((req: string) => (
                                        <Badge key={req} className="text-xs">{req}</Badge>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                                    <IndianRupee className="h-4 w-4" /> Budget: ₹{job.budget}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" disabled={hasApplied} onClick={() => handleApply(job._id)}>
                                    {hasApplied ? "Applied" : "Apply Now"}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
                {jobs.length === 0 && <p className="text-muted-foreground">No open jobs at the moment.</p>}
            </div>
        </div>
    );
}