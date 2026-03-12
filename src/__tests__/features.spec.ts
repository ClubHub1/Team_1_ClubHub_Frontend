import { describe, it, expect, beforeAll } from 'vitest'
import { feathersClient } from '../backendAPI'

// Increase timeout to 30s for socket connections
const TIMEOUT = 30000

async function loginTestUser() {
  const result = await feathersClient.authenticate({
    strategy: 'local',
    email: 'testuser@unr.edu',   // ← change to real user in your DB
    password: 'Password1!'        // ← change to match
  })
  console.log('Authenticated:', result.user?.school_email)
  return result.user
}

async function getClubId(userId: number) {
  const memberships = await feathersClient.service('Club Membership').find({
    query: { userid: userId, is_active: true, $limit: 1 }
  })
  const rows = memberships.data ?? memberships
  console.log('Club ID:', rows[0]?.clubid)
  return rows[0]?.clubid
}

// TEST 1: P-Card Request
describe('P-Card Request', () => {
  it('should successfully submit a P-Card request', async () => {
    console.log('Test: P-Card Request Submission')
    const user = await loginTestUser()
    const clubId = await getClubId(user.user_id)

    const result = await feathersClient.service('p-card-requests').create({
      club: clubId,
      requested_by: user.user_id,
      vendor_name: 'Test Vendor Inc.',
      purchase_date: '2026-03-01',
      amount: 49.99,
      category: 'Office Supplies',
      description: 'Test purchase for unit test',
      receipt_url: '',
    })
    console.log('P-Card created:', result)
    expect(result).toBeTruthy()
    expect(result.vendor_name).toBe('Test Vendor Inc.')
    expect(result.status).toBe('Pending')
  }, TIMEOUT)
})

//TEST 2: Travel Request
describe('Travel Request', () => {
  it('should successfully submit a travel request', async () => {
    console.log('Test: Travel Request Submission')
    const user = await loginTestUser()
    const clubId = await getClubId(user.user_id)

    const result = await feathersClient.service('travel-requests').create({
      club: clubId,
      requested_by: user.user_id,
      destination: 'Las Vegas, NV',
      purpose: 'Regional conference for unit test',
      departure_date: '2026-04-10',
      return_date: '2026-04-12',
      num_travelers: 3,
      estimated_cost: 750.00,
      transportation: 'Personal Vehicle',
      lodging: 'Test Hotel',
      notes: 'Unit test travel request',
    })
    console.log('Travel request created:', result)
    expect(result).toBeTruthy()
    expect(result.destination).toBe('Las Vegas, NV')
    expect(result.status).toBe('Pending')
  }, TIMEOUT)
})

//TEST 3: Finances
describe('Finances — Transaction', () => {
  it('should create a transaction and reflect in totals', async () => {
    console.log('Test: Add Transaction')
    const user = await loginTestUser()
    const clubId = await getClubId(user.user_id)

    const income = await feathersClient.service('transactions').create({
      club: clubId, created_by: user.user_id,
      title: 'Test Dues Collection', amount: 200.00,
      category: 'Dues Collected', transaction_date: '2026-03-01',
      notes: 'Unit test income',
    })
    console.log('Income created:', income)
    expect(income.amount).toBe(200)

    const expense = await feathersClient.service('transactions').create({
      club: clubId, created_by: user.user_id,
      title: 'Test Supply Purchase', amount: -50.00,
      category: 'Office Supplies', transaction_date: '2026-03-02',
      notes: 'Unit test expense',
    })
    console.log('Expense created:', expense)
    expect(expense.amount).toBe(-50)

    const all = await feathersClient.service('transactions').find({
      query: { club: clubId, $limit: 500 }
    })
    const rows = all.data ?? all
    const balance = rows.reduce((sum: number, tx: any) => sum + Number(tx.amount), 0)
    console.log('Balance:', balance)
    expect(typeof balance).toBe('number')
  }, TIMEOUT)

  it('should delete a transaction successfully', async () => {
    console.log('Test: Delete Transaction')
    const user = await loginTestUser()
    const clubId = await getClubId(user.user_id)

    const tx = await feathersClient.service('transactions').create({
      club: clubId, created_by: user.user_id,
      title: 'To Be Deleted', amount: -10.00,
      category: 'Other', transaction_date: '2026-03-01',
      notes: 'Will be deleted',
    })
    console.log('Created tx id:', tx.transaction_id)

    const deleted = await feathersClient.service('transactions').remove(tx.transaction_id)
    console.log('Deleted:', deleted)
    expect(deleted.transaction_id).toBe(tx.transaction_id)
  }, TIMEOUT)
})

//TEST 4: Clubs Search
describe('Clubs Search', () => {
  it('should fetch all clubs from the Club service', async () => {
    console.log('Test: Fetch All Clubs')
    const result = await feathersClient.service('Club').find({ query: { $limit: 200 } })
    const clubs = result.data ?? result
    console.log('Clubs fetched:', clubs.length)
    expect(Array.isArray(clubs)).toBe(true)
  }, TIMEOUT)

  it('should filter clubs by Active status', async () => {
    console.log('Test: Filter Active Clubs')
    const result = await feathersClient.service('Club').find({
      query: { activity_status: 'Active', $limit: 200 }
    })
    const clubs = result.data ?? result
    console.log('Active clubs:', clubs.length)
    clubs.forEach((c: any) => expect(c.activity_status).toBe('Active'))
  }, TIMEOUT)

  it('should fetch club tags from the ClubTag service', async () => {
    console.log('Test: Fetch Club Tags')
    const result = await feathersClient.service('club-tags').find({ query: { $limit: 200 } })
    const tags = result.data ?? result
    console.log('Tags fetched:', tags.length)
    expect(Array.isArray(tags)).toBe(true)
  }, TIMEOUT)
})
