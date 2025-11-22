import "dotenv/config";
import { db } from "../db/index";
import { event, team, teamMember, user, registration } from "../db/schema/schema";
import { eq } from "drizzle-orm";

async function seedEvents() {
    console.log("🌱 Starting database seeding...");

    try {
        // Get or create users
        const users = await db.select().from(user).limit(5);

        if (users.length === 0) {
            console.error("❌ No users found in database. Please create users first.");
            process.exit(1);
        }

        console.log(`📋 Found ${users.length} users in database`);

        // Find a manager user (preferably one with role 'manager' or 'admin')
        let managerUser = users.find(u => u.role === 'manager' || u.role === 'admin') || users[0];
        console.log(`👤 Using manager: ${managerUser.name} (${managerUser.email})`);

        // Drop all existing events (this will cascade to registrations, etc.)
        console.log("🗑️  Dropping all existing events...");
        await db.delete(event);
        console.log("✅ All events deleted");

        // Drop all existing teams and members
        console.log("🗑️  Dropping all existing teams...");
        await db.delete(team);
        console.log("✅ All teams deleted");

        // Current date: 22-11-2025
        const today = new Date("2025-11-22T12:00:00Z");
        console.log(`📅 Today's date: ${today.toISOString()}`);

        // Create teams with members
        console.log("\n👥 Creating teams...");

        const team1 = await db.insert(team).values({
            name: "Tech Innovators",
            description: "A team of passionate developers and tech enthusiasts",
            createdBy: users[0].id,
        }).returning();
        console.log(`✅ Created team: ${team1[0].name}`);

        const team2 = await db.insert(team).values({
            name: "Code Warriors",
            description: "Elite coding competition team",
            createdBy: users[1]?.id || users[0].id,
        }).returning();
        console.log(`✅ Created team: ${team2[0].name}`);

        const team3 = await db.insert(team).values({
            name: "Startup Hustlers",
            description: "Entrepreneurs ready to disrupt the market",
            createdBy: users[2]?.id || users[0].id,
        }).returning();
        console.log(`✅ Created team: ${team3[0].name}`);

        const team4 = await db.insert(team).values({
            name: "AI Pioneers",
            description: "Exploring the frontiers of artificial intelligence",
            createdBy: users[0].id,
        }).returning();
        console.log(`✅ Created team: ${team4[0].name}`);

        const team5 = await db.insert(team).values({
            name: "DevOps Masters",
            description: "Cloud infrastructure and automation experts",
            createdBy: users[1]?.id || users[0].id,
        }).returning();
        console.log(`✅ Created team: ${team5[0].name}`);

        // Add team members
        console.log("\n👤 Adding team members...");

        // Team 1 members
        await db.insert(teamMember).values([
            {
                teamId: team1[0].id,
                email: users[0].email,
                name: users[0].name,
                userId: users[0].id,
                role: "leader",
                status: "accepted",
                joinedAt: new Date("2025-10-01T10:00:00Z").toISOString(),
            },
            {
                teamId: team1[0].id,
                email: "member1@example.com",
                name: "Alice Johnson",
                role: "member",
                status: "accepted",
                joinedAt: new Date("2025-10-02T10:00:00Z").toISOString(),
            },
            {
                teamId: team1[0].id,
                email: "member2@example.com",
                name: "Bob Smith",
                role: "member",
                status: "accepted",
                joinedAt: new Date("2025-10-02T11:00:00Z").toISOString(),
            },
        ]);
        console.log(`✅ Added 3 members to ${team1[0].name}`);

        // Team 2 members
        await db.insert(teamMember).values([
            {
                teamId: team2[0].id,
                email: users[1]?.email || users[0].email,
                name: users[1]?.name || users[0].name,
                userId: users[1]?.id || users[0].id,
                role: "leader",
                status: "accepted",
                joinedAt: new Date("2025-09-15T10:00:00Z").toISOString(),
            },
            {
                teamId: team2[0].id,
                email: "coder1@example.com",
                name: "Charlie Davis",
                role: "member",
                status: "accepted",
                joinedAt: new Date("2025-09-16T10:00:00Z").toISOString(),
            },
            {
                teamId: team2[0].id,
                email: "coder2@example.com",
                name: "Diana Chen",
                role: "member",
                status: "accepted",
                joinedAt: new Date("2025-09-16T11:00:00Z").toISOString(),
            },
            {
                teamId: team2[0].id,
                email: "coder3@example.com",
                name: "Ethan Martinez",
                role: "member",
                status: "pending",
            },
        ]);
        console.log(`✅ Added 4 members to ${team2[0].name}`);

        // Team 3 members
        await db.insert(teamMember).values([
            {
                teamId: team3[0].id,
                email: users[2]?.email || users[0].email,
                name: users[2]?.name || users[0].name,
                userId: users[2]?.id || users[0].id,
                role: "leader",
                status: "accepted",
                joinedAt: new Date("2025-10-10T10:00:00Z").toISOString(),
            },
            {
                teamId: team3[0].id,
                email: "startup1@example.com",
                name: "Frank Wilson",
                role: "member",
                status: "accepted",
                joinedAt: new Date("2025-10-11T10:00:00Z").toISOString(),
            },
        ]);
        console.log(`✅ Added 2 members to ${team3[0].name}`);

        // Team 4 members
        await db.insert(teamMember).values([
            {
                teamId: team4[0].id,
                email: users[0].email,
                name: users[0].name,
                userId: users[0].id,
                role: "leader",
                status: "accepted",
                joinedAt: new Date("2025-11-01T10:00:00Z").toISOString(),
            },
            {
                teamId: team4[0].id,
                email: "ai1@example.com",
                name: "Grace Lee",
                role: "member",
                status: "accepted",
                joinedAt: new Date("2025-11-02T10:00:00Z").toISOString(),
            },
            {
                teamId: team4[0].id,
                email: "ai2@example.com",
                name: "Henry Brown",
                role: "member",
                status: "accepted",
                joinedAt: new Date("2025-11-02T11:00:00Z").toISOString(),
            },
            {
                teamId: team4[0].id,
                email: "ai3@example.com",
                name: "Iris Thompson",
                role: "member",
                status: "accepted",
                joinedAt: new Date("2025-11-03T10:00:00Z").toISOString(),
            },
        ]);
        console.log(`✅ Added 4 members to ${team4[0].name}`);

        // Team 5 members
        await db.insert(teamMember).values([
            {
                teamId: team5[0].id,
                email: users[1]?.email || users[0].email,
                name: users[1]?.name || users[0].name,
                userId: users[1]?.id || users[0].id,
                role: "leader",
                status: "accepted",
                joinedAt: new Date("2025-11-05T10:00:00Z").toISOString(),
            },
            {
                teamId: team5[0].id,
                email: "devops1@example.com",
                name: "Jack Anderson",
                role: "member",
                status: "accepted",
                joinedAt: new Date("2025-11-06T10:00:00Z").toISOString(),
            },
            {
                teamId: team5[0].id,
                email: "devops2@example.com",
                name: "Kelly White",
                role: "member",
                status: "pending",
            },
        ]);
        console.log(`✅ Added 3 members to ${team5[0].name}`);

        // Create events
        console.log("\n🎪 Creating events...");

        // EXPIRED EVENTS (past events)
        console.log("\n⏰ Creating expired events...");

        const expiredEvent1 = await db.insert(event).values({
            title: "Summer Hackathon 2025",
            description: "48-hour hackathon focused on sustainable technology solutions. Build innovative projects that make a difference!",
            managerId: managerUser.id,
            startDate: new Date("2025-08-15T09:00:00Z").toISOString(),
            endDate: new Date("2025-08-17T18:00:00Z").toISOString(),
            location: "Tech Hub Innovation Center, Building A",
            maxCapacity: 100,
            minTeamSize: 2,
            maxTeamSize: 5,
            registrationDeadline: new Date("2025-08-10T23:59:59Z").toISOString(),
            status: "published",
            imageUrl: "/images/hackathon.jpg",
        }).returning();
        console.log(`✅ Created expired event: ${expiredEvent1[0].title}`);

        // Register teams to expired event
        await db.insert(registration).values([
            {
                eventId: expiredEvent1[0].id,
                teamId: team1[0].id,
                status: "confirmed",
                registeredAt: new Date("2025-08-05T10:00:00Z").toISOString(),
                checkedInAt: new Date("2025-08-15T09:15:00Z").toISOString(),
            },
            {
                eventId: expiredEvent1[0].id,
                teamId: team2[0].id,
                status: "confirmed",
                registeredAt: new Date("2025-08-06T14:00:00Z").toISOString(),
                checkedInAt: new Date("2025-08-15T09:30:00Z").toISOString(),
            },
        ]);
        console.log(`✅ Registered 2 teams to ${expiredEvent1[0].title}`);

        const expiredEvent2 = await db.insert(event).values({
            title: "AI Workshop Series - Part 1",
            description: "Introduction to Machine Learning and Neural Networks. Hands-on workshop with real-world datasets.",
            managerId: managerUser.id,
            startDate: new Date("2025-09-20T14:00:00Z").toISOString(),
            endDate: new Date("2025-09-20T18:00:00Z").toISOString(),
            location: "Virtual Event - Zoom",
            maxCapacity: 50,
            minTeamSize: 1,
            maxTeamSize: 3,
            registrationDeadline: new Date("2025-09-18T23:59:59Z").toISOString(),
            status: "published",
        }).returning();
        console.log(`✅ Created expired event: ${expiredEvent2[0].title}`);

        await db.insert(registration).values({
            eventId: expiredEvent2[0].id,
            teamId: team4[0].id,
            status: "confirmed",
            registeredAt: new Date("2025-09-15T10:00:00Z").toISOString(),
            checkedInAt: new Date("2025-09-20T14:05:00Z").toISOString(),
        });
        console.log(`✅ Registered 1 team to ${expiredEvent2[0].title}`);

        const expiredEvent3 = await db.insert(event).values({
            title: "Startup Pitch Competition 2025",
            description: "Present your startup idea to a panel of investors and industry experts. Win funding and mentorship!",
            managerId: managerUser.id,
            startDate: new Date("2025-10-05T10:00:00Z").toISOString(),
            endDate: new Date("2025-10-05T17:00:00Z").toISOString(),
            location: "Startup Incubator Hall, 5th Floor",
            maxCapacity: 30,
            minTeamSize: 1,
            maxTeamSize: 4,
            registrationDeadline: new Date("2025-10-01T23:59:59Z").toISOString(),
            status: "published",
        }).returning();
        console.log(`✅ Created expired event: ${expiredEvent3[0].title}`);

        await db.insert(registration).values({
            eventId: expiredEvent3[0].id,
            teamId: team3[0].id,
            status: "confirmed",
            registeredAt: new Date("2025-09-28T10:00:00Z").toISOString(),
            checkedInAt: new Date("2025-10-05T10:10:00Z").toISOString(),
        });
        console.log(`✅ Registered 1 team to ${expiredEvent3[0].title}`);

        // ONGOING EVENTS (currently happening)
        console.log("\n▶️  Creating ongoing events...");

        const ongoingEvent1 = await db.insert(event).values({
            title: "Cloud Computing Summit 2025",
            description: "Three-day summit exploring the latest in cloud infrastructure, serverless architecture, and DevOps practices. Network with industry leaders!",
            managerId: managerUser.id,
            startDate: new Date("2025-11-20T08:00:00Z").toISOString(),
            endDate: new Date("2025-11-23T20:00:00Z").toISOString(),
            location: "International Convention Center, Hall 3",
            maxCapacity: 200,
            minTeamSize: 1,
            maxTeamSize: 6,
            registrationDeadline: new Date("2025-11-15T23:59:59Z").toISOString(),
            status: "published",
            imageUrl: "/images/cloud-summit.jpg",
        }).returning();
        console.log(`✅ Created ongoing event: ${ongoingEvent1[0].title}`);

        await db.insert(registration).values([
            {
                eventId: ongoingEvent1[0].id,
                teamId: team5[0].id,
                status: "confirmed",
                registeredAt: new Date("2025-11-10T10:00:00Z").toISOString(),
                checkedInAt: new Date("2025-11-20T08:30:00Z").toISOString(),
            },
            {
                eventId: ongoingEvent1[0].id,
                teamId: team1[0].id,
                status: "confirmed",
                registeredAt: new Date("2025-11-12T14:00:00Z").toISOString(),
                checkedInAt: new Date("2025-11-20T08:45:00Z").toISOString(),
            },
        ]);
        console.log(`✅ Registered 2 teams to ${ongoingEvent1[0].title}`);

        const ongoingEvent2 = await db.insert(event).values({
            title: "GameDev Marathon",
            description: "Create a complete game in 72 hours! All game engines and platforms welcome. Prizes for best gameplay, graphics, and innovation.",
            managerId: managerUser.id,
            startDate: new Date("2025-11-21T18:00:00Z").toISOString(),
            endDate: new Date("2025-11-24T18:00:00Z").toISOString(),
            location: "Digital Arts Complex, Studio B",
            maxCapacity: 80,
            minTeamSize: 1,
            maxTeamSize: 5,
            registrationDeadline: new Date("2025-11-20T23:59:59Z").toISOString(),
            status: "published",
        }).returning();
        console.log(`✅ Created ongoing event: ${ongoingEvent2[0].title}`);

        await db.insert(registration).values({
            eventId: ongoingEvent2[0].id,
            teamId: team2[0].id,
            status: "confirmed",
            registeredAt: new Date("2025-11-18T10:00:00Z").toISOString(),
            checkedInAt: new Date("2025-11-21T18:20:00Z").toISOString(),
        });
        console.log(`✅ Registered 1 team to ${ongoingEvent2[0].title}`);

        // UPCOMING EVENTS (future events)
        console.log("\n🔮 Creating upcoming events...");

        const upcomingEvent1 = await db.insert(event).values({
            title: "Cybersecurity Challenge 2025",
            description: "Test your skills in penetration testing, cryptography, and security analysis. Capture the flag competition with real-world scenarios.",
            managerId: managerUser.id,
            startDate: new Date("2025-12-01T09:00:00Z").toISOString(),
            endDate: new Date("2025-12-02T18:00:00Z").toISOString(),
            location: "Security Operations Center, Tower C",
            maxCapacity: 60,
            minTeamSize: 2,
            maxTeamSize: 4,
            registrationDeadline: new Date("2025-11-28T23:59:59Z").toISOString(),
            status: "published",
            imageUrl: "/images/cybersecurity.jpg",
        }).returning();
        console.log(`✅ Created upcoming event: ${upcomingEvent1[0].title}`);

        await db.insert(registration).values({
            eventId: upcomingEvent1[0].id,
            teamId: team2[0].id,
            status: "confirmed",
            registeredAt: new Date("2025-11-20T10:00:00Z").toISOString(),
        });
        console.log(`✅ Registered 1 team to ${upcomingEvent1[0].title}`);

        const upcomingEvent2 = await db.insert(event).values({
            title: "Web3 & Blockchain Symposium",
            description: "Explore decentralized applications, smart contracts, and the future of Web3. Featuring talks from blockchain pioneers.",
            managerId: managerUser.id,
            startDate: new Date("2025-12-10T10:00:00Z").toISOString(),
            endDate: new Date("2025-12-11T17:00:00Z").toISOString(),
            location: "Crypto Innovation Lab",
            maxCapacity: 120,
            minTeamSize: 1,
            maxTeamSize: 5,
            registrationDeadline: new Date("2025-12-05T23:59:59Z").toISOString(),
            status: "published",
        }).returning();
        console.log(`✅ Created upcoming event: ${upcomingEvent2[0].title}`);

        await db.insert(registration).values([
            {
                eventId: upcomingEvent2[0].id,
                teamId: team1[0].id,
                status: "confirmed",
                registeredAt: new Date("2025-11-22T10:00:00Z").toISOString(),
            },
            {
                eventId: upcomingEvent2[0].id,
                teamId: team4[0].id,
                status: "confirmed",
                registeredAt: new Date("2025-11-22T11:00:00Z").toISOString(),
            },
        ]);
        console.log(`✅ Registered 2 teams to ${upcomingEvent2[0].title}`);

        const upcomingEvent3 = await db.insert(event).values({
            title: "Mobile App Development Workshop",
            description: "Learn to build cross-platform mobile apps with React Native and Flutter. From beginner to advanced techniques.",
            managerId: managerUser.id,
            startDate: new Date("2025-12-15T13:00:00Z").toISOString(),
            endDate: new Date("2025-12-15T18:00:00Z").toISOString(),
            location: "Mobile Dev Lab, Room 305",
            maxCapacity: 40,
            minTeamSize: 1,
            maxTeamSize: 3,
            registrationDeadline: new Date("2025-12-10T23:59:59Z").toISOString(),
            status: "published",
        }).returning();
        console.log(`✅ Created upcoming event: ${upcomingEvent3[0].title}`);

        const upcomingEvent4 = await db.insert(event).values({
            title: "Data Science Bootcamp",
            description: "Intensive 5-day bootcamp covering Python, data visualization, machine learning, and big data analytics.",
            managerId: managerUser.id,
            startDate: new Date("2026-01-10T09:00:00Z").toISOString(),
            endDate: new Date("2026-01-14T18:00:00Z").toISOString(),
            location: "Data Science Institute",
            maxCapacity: 50,
            minTeamSize: 1,
            maxTeamSize: 2,
            registrationDeadline: new Date("2026-01-05T23:59:59Z").toISOString(),
            status: "published",
        }).returning();
        console.log(`✅ Created upcoming event: ${upcomingEvent4[0].title}`);

        await db.insert(registration).values({
            eventId: upcomingEvent4[0].id,
            teamId: team4[0].id,
            status: "confirmed",
            registeredAt: new Date("2025-11-22T12:00:00Z").toISOString(),
        });
        console.log(`✅ Registered 1 team to ${upcomingEvent4[0].title}`);

        const upcomingEvent5 = await db.insert(event).values({
            title: "Tech Networking Mixer",
            description: "Connect with fellow developers, designers, and tech entrepreneurs. Casual evening with food, drinks, and great conversations.",
            managerId: managerUser.id,
            startDate: new Date("2025-11-29T18:00:00Z").toISOString(),
            endDate: new Date("2025-11-29T22:00:00Z").toISOString(),
            location: "Rooftop Lounge, Tech Center",
            maxCapacity: 100,
            minTeamSize: 1,
            maxTeamSize: 10,
            registrationDeadline: new Date("2025-11-27T23:59:59Z").toISOString(),
            status: "published",
        }).returning();
        console.log(`✅ Created upcoming event: ${upcomingEvent5[0].title}`);

        await db.insert(registration).values([
            {
                eventId: upcomingEvent5[0].id,
                teamId: team3[0].id,
                status: "confirmed",
                registeredAt: new Date("2025-11-22T13:00:00Z").toISOString(),
            },
            {
                eventId: upcomingEvent5[0].id,
                teamId: team5[0].id,
                status: "confirmed",
                registeredAt: new Date("2025-11-22T14:00:00Z").toISOString(),
            },
        ]);
        console.log(`✅ Registered 2 teams to ${upcomingEvent5[0].title}`);

        // Draft event (not published yet)
        const draftEvent = await db.insert(event).values({
            title: "Robotics Competition 2026",
            description: "Design, build, and program autonomous robots. Competition details to be announced.",
            managerId: managerUser.id,
            startDate: new Date("2026-02-20T09:00:00Z").toISOString(),
            endDate: new Date("2026-02-22T18:00:00Z").toISOString(),
            location: "Robotics Arena",
            maxCapacity: 40,
            minTeamSize: 3,
            maxTeamSize: 6,
            registrationDeadline: new Date("2026-02-10T23:59:59Z").toISOString(),
            status: "draft",
        }).returning();
        console.log(`✅ Created draft event: ${draftEvent[0].title}`);

        console.log("\n✨ Database seeding completed successfully!");
        console.log("\n📊 Summary:");
        console.log(`   - 5 teams created with members`);
        console.log(`   - 3 expired events (past)`);
        console.log(`   - 2 ongoing events (currently happening)`);
        console.log(`   - 5 upcoming events (future)`);
        console.log(`   - 1 draft event (not published)`);
        console.log(`   - Multiple team registrations`);

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }

    process.exit(0);
}

// Run the seed function
seedEvents();
