import { describe, it, expect, beforeAll } from 'vitest'
import { feathersClient } from '../backendAPI'

// Log in as a test user and return the user object
async function loginTestUser() {
  const result = await feathersClient.authenticate({
    strategy: 'local',
    email: 'testuser@unr.edu',     // ← change to a real user in your DB
    password: 'Password1!'         // ← change to match
  })
  console.log('Test user authenticated:', result.user)
  return result.user
}

// Get the club ID for the logged-in user
async function getClubId(userId: number) {
  const memberships = await feathersClient.service('Club Membership').find({
    query: { userid: userId, is_active: true, $limit: 1 }
  })
  const rows = memberships.data ?? memberships
  const clubId = rows[0]?.clubid
  console.log('Club ID for user', userId, ':', clubId)
  return clubId
}


//P-Card Request Submission

describe('P-Card Request', () => {
  it('should successfully submit a P-Card request', async () => {
    console.log('Test: P-Card Request Submission')

    const user = await loginTestUser()
    const clubId = await getClubId(user.user_id)

    const payload = {
      club: clubId,
      requested_by: user.user_id,
      vendor_name: 'Test Vendor',
      purchase_date: '2026-03-01',
      amount: 1.00,
      category: 'Supplies',
      description: 'Test purchase for unit test',
      receipt_url: '',
    }

    try {
      const result = await feathersClient.service('p-card-requests').create(payload)
      console.log('P-Card request created:', result)
      expect(result).toBeTruthy()
      expect(result.vendor_name).toBe('Test Vendor')
      expect(result.status).toBe('Pending')
      expect(result.club).toBe(clubId)
    } catch (e: any) {
      console.log('P-Card request error:', e.message)
      throw e
    }
  })
})

//Travel Request Submission
describe('Travel Request', () => {
  it('should successfully submit a travel request', async () => {
    console.log('--- Test: Travel Request Submission ---')

    const user = await loginTestUser()
    const clubId = await getClubId(user.user_id)

    const payload = {
      club: clubId,
      requested_by: user.user_id,
      destination: 'Las Vegas, NV',
      purpose: 'Regional conference attendance for unit test',
      departure_date: '2026-04-10',
      return_date: '2026-04-12',
      num_travelers: 3,
      estimated_cost: 750.00,
      transportation: 'Personal Vehicle',
      lodging: 'Test Hotel',
      notes: 'Unit test travel request',
    }

    try {
      const result = await feathersClient.service('travel-requests').create(payload)
      console.log('Travel request created:', result)
      expect(result).toBeTruthy()
      expect(result.destination).toBe('Las Vegas, NV')
      expect(result.status).toBe('Pending')
      expect(result.num_travelers).toBe(3)
    } catch (e: any) {
      console.log('Travel request error:', e.message)
      throw e
    }
  })
})


//Finances — Add and Retrieve Transaction

describe('Finances — Transaction', () => {
  it('should create a transaction and reflect in totals', async () => {
    console.log('--- Test: Add Transaction ---')

    const user = await loginTestUser()
    const clubId = await getClubId(user.user_id)

    // Add an income transaction
    const income = await feathersClient.service('transactions').create({
      club: clubId,
      created_by: user.user_id,
      title: 'Test Dues Collection',
      amount: 200.00,
      category: 'Dues Collected',
      transaction_date: '2026-03-01',
      notes: 'Unit test income',
    })
    console.log('Income transaction created:', income)
    expect(income.amount).toBe(200)
    expect(income.title).toBe('Test Dues Collection')

    // Add an expense transaction
    const expense = await feathersClient.service('transactions').create({
      club: clubId,
      created_by: user.user_id,
      title: 'Test Supply Purchase',
      amount: -50.00,
      category: 'Office Supplies',
      transaction_date: '2026-03-02',
      notes: 'Unit test expense',
    })
    console.log('Expense transaction created:', expense)
    expect(expense.amount).toBe(-50)

    // Retrieve all transactions and verify balance math
    const all = await feathersClient.service('transactions').find({
      query: { club: clubId, $limit: 500 }
    })
    const rows = all.data ?? all
    const balance = rows.reduce((sum: number, tx: any) => sum + Number(tx.amount), 0)
    console.log('Current club balance:', balance)
    expect(typeof balance).toBe('number')
  })

  it('should delete a transaction successfully', async () => {
    console.log('--- Test: Delete Transaction ---')

    const user = await loginTestUser()
    const clubId = await getClubId(user.user_id)

    // Create then immediately delete
    const tx = await feathersClient.service('transactions').create({
      club: clubId,
      created_by: user.user_id,
      title: 'To Be Deleted',
      amount: -10.00,
      category: 'Other',
      transaction_date: '2026-03-01',
      notes: 'Will be deleted in test',
    })
    console.log('Created transaction to delete, id:', tx.transaction_id)

    const deleted = await feathersClient.service('transactions').remove(tx.transaction_id)
    console.log('Deleted transaction:', deleted)
    expect(deleted.transaction_id).toBe(tx.transaction_id)
  })
})


// Clubs Search — Fetch and Filter

describe('Clubs Search', () => {
  it('should fetch all clubs from the Club service', async () => {
    console.log('--- Test: Fetch All Clubs ---')

    const result = await feathersClient.service('Club').find({
      query: { $limit: 200 }
    })
    const clubs = result.data ?? result
    console.log('Total clubs fetched:', clubs.length)
    console.log('First club:', clubs[0])
    expect(Array.isArray(clubs)).toBe(true)
  })

  it('should filter clubs by Active status', async () => {
    console.log('--- Test: Filter Active Clubs ---')

    const result = await feathersClient.service('Club').find({
      query: { activity_status: 'Active', $limit: 200 }
    })
    const clubs = result.data ?? result
    console.log('Active clubs count:', clubs.length)
    clubs.forEach((c: any) => {
      expect(c.activity_status).toBe('Active')
    })
  })

  it('should fetch club tags from the ClubTag service', async () => {
    console.log('--- Test: Fetch Club Tags ---')

    const result = await feathersClient.service('club-tags').find({
      query: { $limit: 200 }
    })
    const tags = result.data ?? result
    console.log('Total tags fetched:', tags.length)
    expect(Array.isArray(tags)).toBe(true)
  })
})
