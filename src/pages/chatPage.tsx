import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Send, Calendar, Clock, MessageSquare, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { getMediaUrl } from '@/lib/utils';
import { AvatarImage } from '@/components/ui/avatar';

export default function ChatPage() {
    const { user } = useAuth();
    const [chats, setChats] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');

    // Scheduling State
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const [searchParams] = useSearchParams();
    const targetUserId = searchParams.get('userId');

    // 1. Fetch User's Chats
    useEffect(() => {
        if (!user?.id) return;
        const fetchChats = async () => {
            const res = await fetch(`http://localhost:5000/api/chats/user/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setChats(data);

                // Auto-select chat if query param exists
                if (targetUserId) {
                    const targetChat = data.find((c: any) =>
                        c.participants.some((p: any) => p._id === targetUserId)
                    );
                    if (targetChat) {
                        setActiveChat(targetChat);
                    }
                }
            }
        };
        fetchChats();
        // Poll for new chats/messages every 5 seconds
        const interval = setInterval(fetchChats, 5000);
        return () => clearInterval(interval);
    }, [user, targetUserId]);

    // 2. Load Messages when Chat Selected
    useEffect(() => {
        if (!activeChat) return;
        setMessages(activeChat.messages);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, [activeChat]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            const res = await fetch(`http://localhost:5000/api/chats/${activeChat._id}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderId: user?.id, text: newMessage })
            });

            if (res.ok) {
                const msg = await res.json();
                setMessages([...messages, msg]);
                setNewMessage('');
                // Scroll to bottom
                setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSchedule = async () => {
        if (!scheduleDate || !scheduleTime || !activeChat?.interviewId) return;

        try {
            const res = await fetch(`http://localhost:5000/api/chats/schedule/${activeChat.interviewId._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: scheduleDate, time: scheduleTime })
            });

            if (res.ok) {
                toast.success("Interview Scheduled!");
                // Send system message about scheduling
                await fetch(`http://localhost:5000/api/chats/${activeChat._id}/message`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        senderId: user?.id,
                        text: `SYSTEM: Interview scheduled for ${scheduleDate} at ${scheduleTime}`
                    })
                });
                setScheduleDate('');
                setScheduleTime('');
            }
        } catch (e) {
            toast.error("Failed to schedule");
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-4">
            {/* Sidebar: Chat List */}
            <div className="w-1/3 bg-card border rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b bg-muted/30">
                    <h2 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map(chat => {
                        const otherUser = chat.participants.find((p: any) => p._id !== user?.id);
                        return (
                            <div
                                key={chat._id}
                                onClick={() => setActiveChat(chat)}
                                className={`p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors ${activeChat?._id === chat._id ? 'bg-accent/10 border-l-4 border-l-primary' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={getMediaUrl(otherUser?.avatar)} />
                                        <AvatarFallback>{otherUser?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="font-medium truncate">{otherUser?.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main: Active Chat */}
            <div className="flex-1 bg-card border rounded-xl overflow-hidden flex flex-col">
                {activeChat ? (
                    <>
                        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={getMediaUrl(activeChat.participants.find((p: any) => p._id !== user?.id)?.avatar)} />
                                    <AvatarFallback>{activeChat.participants.find((p: any) => p._id !== user?.id)?.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{activeChat.participants.find((p: any) => p._id !== user?.id)?.name}</p>
                                    <Badge variant={activeChat.interviewId?.status === 'scheduled' ? 'success' : 'warning'}>
                                        {activeChat.interviewId?.status === 'scheduled' ? 'Scheduled' : 'Scheduling Needed'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Schedule Button (Only for Company) */}
                            {user?.role === 'company' && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm"><Calendar className="mr-2 h-4 w-4" /> Schedule Interview</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader><DialogTitle>Set Interview Time</DialogTitle></DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Date</Label>
                                                <Input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Time</Label>
                                                <Input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
                                            </div>
                                            <Button className="w-full" onClick={handleSchedule}>Confirm Schedule</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => {
                                const isMe = msg.sender === user?.id;
                                const isSystem = msg.text.startsWith('SYSTEM:');
                                if (isSystem) {
                                    return <div key={i} className="text-center text-xs text-muted-foreground my-2">{msg.text.replace('SYSTEM:', '')}</div>;
                                }
                                return (
                                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-lg ${isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                            />
                            <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>Select a chat to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

import { Badge } from '@/components/shared/Badge';