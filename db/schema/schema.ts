import {
    pgTable,
    text,
    timestamp,
    foreignKey,
    unique,
    boolean,
    uuid,
    jsonb,
    integer,
    decimal,
} from "drizzle-orm/pg-core";

export const verification = pgTable("verification", {
    id: text().primaryKey().notNull(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const account = pgTable(
    "account",
    {
        id: text().primaryKey().notNull(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id").notNull(),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at", {
            mode: "string",
        }),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
            mode: "string",
        }),
        scope: text(),
        password: text(),
        createdAt: timestamp("created_at", { mode: "string" }).notNull(),
        updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [user.id],
            name: "account_user_id_user_id_fk",
        }).onDelete("cascade"),
    ],
);

export const session = pgTable(
    "session",
    {
        id: text().primaryKey().notNull(),
        expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
        token: text().notNull(),
        createdAt: timestamp("created_at", { mode: "string" }).notNull(),
        updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id").notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [user.id],
            name: "session_user_id_user_id_fk",
        }).onDelete("cascade"),
        unique("session_token_unique").on(table.token),
    ],
);

export const user = pgTable(
    "user",
    {
        id: text().primaryKey().notNull(),
        name: text().notNull(),
        email: text().notNull(),
        emailVerified: boolean("email_verified").notNull(),
        image: text(),
        createdAt: timestamp("created_at", { mode: "string" }).notNull(),
        updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
        role: text().default("user").notNull(),
        banned: boolean("banned").default(false),
        banReason: text("ban_reason"),
        banExpires: timestamp("ban_expires", { mode: "string" }),
    },
    (table) => [unique("user_email_unique").on(table.email)],
);

export const team = pgTable("team", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    createdBy: text("created_by")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
        .defaultNow()
        .notNull(),
});

export const event = pgTable("event", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    teamId: uuid("team_id").references(() => team.id, { onDelete: "cascade" }),
    managerId: text("manager_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    startDate: timestamp("start_date", { mode: "string" }).notNull(),
    endDate: timestamp("end_date", { mode: "string" }),
    location: text("location"),
    maxCapacity: integer("max_capacity"),
    registrationDeadline: timestamp("registration_deadline", {
        mode: "string",
    }),
    status: text("status").default("draft").notNull(),
    imageUrl: text("image_url"),
    page: jsonb("page"),
    createdAt: timestamp("created_at", { mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
        .defaultNow()
        .notNull(),
});

export const registration = pgTable(
    "registration",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        eventId: uuid("event_id")
            .notNull()
            .references(() => event.id, { onDelete: "cascade" }),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        status: text("status").default("confirmed").notNull(),
        registeredAt: timestamp("registered_at", { mode: "string" })
            .defaultNow()
            .notNull(),
        checkedInAt: timestamp("checked_in_at", { mode: "string" }),
        cancelledAt: timestamp("cancelled_at", { mode: "string" }),
        formData: jsonb("form_data"),
        createdAt: timestamp("created_at", { mode: "string" })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { mode: "string" })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.eventId],
            foreignColumns: [event.id],
            name: "registration_event_id_event_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [user.id],
            name: "registration_user_id_user_id_fk",
        }).onDelete("cascade"),
        unique("registration_event_user_unique").on(
            table.eventId,
            table.userId,
        ),
    ],
);

export const transaction = pgTable(
    "transaction",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        registrationId: uuid("registration_id")
            .notNull()
            .references(() => registration.id, { onDelete: "cascade" }),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
        currency: text("currency").default("USD").notNull(),
        status: text("status").default("pending").notNull(),
        paymentMethod: text("payment_method"),
        transactionReference: text("transaction_reference"),
        metadata: jsonb("metadata"),
        createdAt: timestamp("created_at", { mode: "string" })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { mode: "string" })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.registrationId],
            foreignColumns: [registration.id],
            name: "transaction_registration_id_registration_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [user.id],
            name: "transaction_user_id_user_id_fk",
        }).onDelete("cascade"),
    ],
);
