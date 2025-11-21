"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const events = [
        {
            id: 1,
            name: "Tech Talk: AI & Future",
            club: "Computer Club",
            category: "Technical",
            date: "Dec 22, 2024",
            time: "3:00 PM - 5:00 PM",
            location: "Auditorium Hall",
            attendees: 120,
            maxAttendees: 150,
            description:
                "Explore the latest trends in AI and machine learning.",
        },
        {
            id: 2,
            name: "Cultural Night",
            club: "Arts Club",
            category: "Cultural",
            date: "Dec 25, 2024",
            time: "6:00 PM - 9:00 PM",
            location: "Main Ground",
            attendees: 85,
            maxAttendees: 200,
            description:
                "An evening of music, dance, and cultural performances.",
        },
        {
            id: 3,
            name: "Robotics Workshop",
            club: "Mech Club",
            category: "Technical",
            date: "Dec 28, 2024",
            time: "10:00 AM - 4:00 PM",
            location: "Lab 3",
            attendees: 60,
            maxAttendees: 80,
            description: "Hands-on workshop on building autonomous robots.",
        },
        {
            id: 4,
            name: "Photography Walk",
            club: "Media Club",
            category: "Arts",
            date: "Jan 2, 2025",
            time: "7:00 AM - 10:00 AM",
            location: "Campus Tour",
            attendees: 42,
            maxAttendees: 50,
            description: "Capture the beauty of campus at sunrise.",
        },
        {
            id: 5,
            name: "Startup Pitching",
            club: "Entrepreneurship Cell",
            category: "Business",
            date: "Jan 5, 2025",
            time: "2:00 PM - 6:00 PM",
            location: "Conference Room",
            attendees: 90,
            maxAttendees: 100,
            description: "Present your startup ideas to investors and mentors.",
        },
        {
            id: 6,
            name: "Sports Tournament",
            club: "Sports Committee",
            category: "Sports",
            date: "Jan 8, 2025",
            time: "9:00 AM - 5:00 PM",
            location: "Sports Complex",
            attendees: 150,
            maxAttendees: 200,
            description: "Annual inter-department sports competition.",
        },
    ];

    const categories = [
        "all",
        "Technical",
        "Cultural",
        "Arts",
        "Business",
        "Sports",
    ];

    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleNavigateToEvent = (eventId: number) => {
        router.push(`/events/${eventId}`);
    };

    return (
        <div className="relative min-h-screen">
            {/* Content */}
            <div className="relative flex-1 space-y-6 p-8 pt-6">
                <div className="flex flex-col space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Browse Events
                    </h2>
                    <p className="text-muted-foreground">
                        Discover and register for upcoming college events
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search events, clubs, or keywords..."
                            className="pl-10 backdrop-blur-sm bg-background/95"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-[140px] backdrop-blur-sm bg-background/95">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category === "all" ? "All" : category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Events Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => (
                        <Card
                            key={event.id}
                            className="backdrop-blur-sm bg-background/95 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl">
                                            {event.name}
                                        </CardTitle>
                                        <CardDescription className="text-sm">
                                            {event.club}
                                        </CardDescription>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                        {event.category}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    {event.description}
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>
                                            {event.date} • {event.time}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() =>
                                            handleNavigateToEvent(event.id)
                                        }
                                    >
                                        Learn More
                                    </Button>
                                    <Button
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                                        onClick={() =>
                                            handleNavigateToEvent(event.id)
                                        }
                                    >
                                        Register Now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                            No events found matching your criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
