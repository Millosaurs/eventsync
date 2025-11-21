"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Mock events data - replace with actual API call
    const events = [
        {
            id: "550e8400-e29b-41d4-a716-446655440001",
            title: "Tech Conference 2024",
            description:
                "Join us for the biggest tech conference of the year! Connect with industry leaders and learn about cutting-edge technologies.",
            category: "Technology",
            date: "Dec 30, 2024",
            time: "9:00 AM - 5:00 PM",
            location: "San Francisco Convention Center",
            registered: 342,
            capacity: 500,
            status: "published",
        },
        {
            id: "550e8400-e29b-41d4-a716-446655440002",
            title: "Design Workshop",
            description:
                "Learn the fundamentals of modern UI/UX design from industry experts. Hands-on workshop with real projects.",
            category: "Design",
            date: "Dec 25, 2024",
            time: "2:00 PM - 6:00 PM",
            location: "Design Studio Downtown",
            registered: 32,
            capacity: 50,
            status: "published",
        },
        {
            id: "550e8400-e29b-41d4-a716-446655440003",
            title: "Startup Pitch Event",
            description:
                "Present your startup ideas to investors and mentors. Get valuable feedback and potential funding opportunities.",
            category: "Business",
            date: "Dec 28, 2024",
            time: "10:00 AM - 4:00 PM",
            location: "Innovation Hub",
            registered: 45,
            capacity: 100,
            status: "published",
        },
        {
            id: "550e8400-e29b-41d4-a716-446655440004",
            title: "Networking Mixer",
            description:
                "Connect with professionals from various industries. Expand your network and explore new opportunities.",
            category: "Networking",
            date: "Jan 5, 2025",
            time: "6:00 PM - 9:00 PM",
            location: "Downtown Event Space",
            registered: 78,
            capacity: 150,
            status: "published",
        },
        {
            id: "550e8400-e29b-41d4-a716-446655440005",
            title: "AI & ML Summit",
            description:
                "Explore the latest trends in artificial intelligence and machine learning. Featuring keynotes from top researchers.",
            category: "Technology",
            date: "Jan 10, 2025",
            time: "9:00 AM - 6:00 PM",
            location: "Tech Park Convention Hall",
            registered: 189,
            capacity: 300,
            status: "published",
        },
        {
            id: "550e8400-e29b-41d4-a716-446655440006",
            title: "Creative Coding Workshop",
            description:
                "Merge art and code in this unique workshop. Create interactive visual experiences using modern web technologies.",
            category: "Technology",
            date: "Jan 15, 2025",
            time: "1:00 PM - 5:00 PM",
            location: "Creative Space Lab",
            registered: 28,
            capacity: 40,
            status: "published",
        },
    ];

    const categories = [
        "all",
        "Technology",
        "Design",
        "Business",
        "Networking",
    ];

    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Browse Events
                    </h1>
                    <p className="text-muted-foreground">
                        Discover and register for upcoming events
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search events..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category === "all"
                                        ? "All Categories"
                                        : category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Events Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => {
                        const percentage = Math.round(
                            (event.registered / event.capacity) * 100,
                        );
                        const spotsLeft = event.capacity - event.registered;

                        return (
                            <Card
                                key={event.id}
                                className="flex flex-col hover:shadow-lg transition-all"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <CardTitle className="text-xl line-clamp-2">
                                            {event.title}
                                        </CardTitle>
                                        <Badge variant="outline">
                                            {event.category}
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2">
                                        {event.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col gap-4">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {event.date} • {event.time}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span className="line-clamp-1">
                                                {event.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>
                                                {event.registered} /{" "}
                                                {event.capacity} registered
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                {percentage}% filled
                                            </span>
                                            <span className="font-medium">
                                                {spotsLeft} spots left
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-1.5">
                                            <div
                                                className="bg-primary h-1.5 rounded-full transition-all"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className=" gap-2 mt-auto pt-2 ">
                                        <Link
                                            href={`/events/${event.id}`}
                                            className=""
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-5"
                                            >
                                                Learn More
                                            </Button>
                                        </Link>
                                        
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
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
