import { pgTable, uuid, text, integer, timestamp, decimal, boolean, pgEnum, index, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const affiliateStatusEnum = pgEnum('affiliate_status', ['pending', 'approved', 'suspended'])
export const prospectStatusEnum = pgEnum('prospect_status', ['new', 'contacted', 'qualified', 'client', 'lost'])

// Affiliates table
export const affiliates = pgTable('affiliates', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  bankInfo: jsonb('bank_info'),
  status: affiliateStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Referral links table
export const referralLinks = pgTable('referral_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  affiliateId: uuid('affiliate_id').references(() => affiliates.id, { onDelete: 'cascade' }).notNull(),
  code: text('code').unique().notNull(),
  clicks: integer('clicks').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    codeIdx: index('idx_referral_links_code').on(table.code),
  }
})

// Prospects table
export const prospects = pgTable('prospects', {
  id: uuid('id').primaryKey().defaultRandom(),
  affiliateId: uuid('affiliate_id').references(() => affiliates.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company').notNull(),
  message: text('message'),
  status: prospectStatusEnum('status').default('new').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    affiliateIdIdx: index('idx_prospects_affiliate_id').on(table.affiliateId),
  }
})

// Invoices table
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  prospectId: uuid('prospect_id').references(() => prospects.id, { onDelete: 'cascade' }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  invoiceNumber: text('invoice_number'),
  fileUrl: text('file_url'),
  fileName: text('file_name'),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    prospectIdIdx: index('idx_invoices_prospect_id').on(table.prospectId),
  }
})

// Commissions table
export const commissions = pgTable('commissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  affiliateId: uuid('affiliate_id').references(() => affiliates.id, { onDelete: 'cascade' }).notNull(),
  invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paid: boolean('paid').default(false).notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    affiliateIdIdx: index('idx_commissions_affiliate_id').on(table.affiliateId),
  }
})

// Relations
export const affiliatesRelations = relations(affiliates, ({ many }) => ({
  referralLinks: many(referralLinks),
  prospects: many(prospects),
  commissions: many(commissions),
}))

export const referralLinksRelations = relations(referralLinks, ({ one }) => ({
  affiliate: one(affiliates, {
    fields: [referralLinks.affiliateId],
    references: [affiliates.id],
  }),
}))

export const prospectsRelations = relations(prospects, ({ one, many }) => ({
  affiliate: one(affiliates, {
    fields: [prospects.affiliateId],
    references: [affiliates.id],
  }),
  invoices: many(invoices),
}))

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  prospect: one(prospects, {
    fields: [invoices.prospectId],
    references: [prospects.id],
  }),
  commissions: many(commissions),
}))

export const commissionsRelations = relations(commissions, ({ one }) => ({
  affiliate: one(affiliates, {
    fields: [commissions.affiliateId],
    references: [affiliates.id],
  }),
  invoice: one(invoices, {
    fields: [commissions.invoiceId],
    references: [invoices.id],
  }),
}))

// Types
export type Affiliate = typeof affiliates.$inferSelect
export type NewAffiliate = typeof affiliates.$inferInsert
export type ReferralLink = typeof referralLinks.$inferSelect
export type NewReferralLink = typeof referralLinks.$inferInsert
export type Prospect = typeof prospects.$inferSelect
export type NewProspect = typeof prospects.$inferInsert
export type Invoice = typeof invoices.$inferSelect
export type NewInvoice = typeof invoices.$inferInsert
export type Commission = typeof commissions.$inferSelect
export type NewCommission = typeof commissions.$inferInsert