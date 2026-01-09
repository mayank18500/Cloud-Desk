import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
    const { user, logout } = useAuth();
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (!password) {
            toast.error('Please enter your password to confirm');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/users/${user?.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete account');
            }

            toast.success('Account deleted successfully');
            logout();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'An error occurred during account deletion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold text-foreground">Delete Account</DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground pt-2">
                        This action cannot be undone. All your data, including interviews and profile information, will be permanently removed.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Confirm with Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-xl border-primary/20 focus:border-primary"
                        />
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 rounded-xl"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="flex-1 rounded-xl shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : <><Trash2 className="mr-2 h-4 w-4" /> Delete Permanently</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
