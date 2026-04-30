import jsPDF from 'jspdf'

const PRIMARY = '#041E42'
const LIGHT_GRAY = '#f5f5f5'
const MED_GRAY = '#666666'
const BLACK = '#111111'
const WHITE = '#ffffff'

function addHeader(doc: jsPDF, title: string, subtitle: string) {
  // Navy header bar
  doc.setFillColor(PRIMARY)
  doc.rect(0, 0, 210, 28, 'F')

  // ClubHub logo text
  doc.setTextColor(WHITE)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('CLUBHUB', 14, 12)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('University of Nevada, Reno', 14, 19)

  // Form title right-aligned
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 196, 12, { align: 'right' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(subtitle, 196, 19, { align: 'right' })

  // Generated date
  const now = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  doc.setFontSize(7)
  doc.setTextColor(WHITE)
  doc.text(`Generated: ${now}`, 196, 25, { align: 'right' })
}

function addSectionLabel(doc: jsPDF, label: string, y: number) {
  doc.setFillColor(LIGHT_GRAY)
  doc.rect(14, y - 4, 182, 7, 'F')
  doc.setTextColor(PRIMARY)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text(label.toUpperCase(), 16, y + 0.5)
  return y + 8
}

function addField(doc: jsPDF, label: string, value: string, x: number, y: number, width = 182) {
  doc.setTextColor(MED_GRAY)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text(label, x, y)

  doc.setTextColor(BLACK)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')

  const lines = doc.splitTextToSize(value || '—', width - 4)
  doc.text(lines, x, y + 5)

  // Underline
  const lineY = y + 5 + (lines.length - 1) * 4.5 + 3
  doc.setDrawColor('#dddddd')
  doc.line(x, lineY, x + width, lineY)

  return lineY + 4
}

function addTwoFields(doc: jsPDF, label1: string, val1: string, label2: string, val2: string, y: number) {
  const nextY1 = addField(doc, label1, val1, 14, y, 88)
  const nextY2 = addField(doc, label2, val2, 108, y, 88)
  return Math.max(nextY1, nextY2)
}

function addCheckbox(doc: jsPDF, label: string, checked: boolean, x: number, y: number) {
  doc.setDrawColor(PRIMARY)
  doc.setFillColor(checked ? PRIMARY : WHITE)
  doc.rect(x, y - 3, 4, 4, checked ? 'F' : 'S')
  if (checked) {
    doc.setTextColor(WHITE)
    doc.setFontSize(6)
    doc.text('✓', x + 0.8, y + 0.2)
  }
  doc.setTextColor(BLACK)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  const lines = doc.splitTextToSize(label, 160)
  doc.text(lines, x + 6, y)
  return y + lines.length * 5 + 2
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFillColor(PRIMARY)
    doc.rect(0, 284, 210, 13, 'F')
    doc.setTextColor(WHITE)
    doc.setFontSize(7)
    doc.text('ClubHub — University of Nevada, Reno', 14, 291)
    doc.text(`Page ${i} of ${pageCount}`, 196, 291, { align: 'right' })
  }
}

function checkPageBreak(doc: jsPDF, y: number, margin = 20): number {
  if (y > 270) {
    doc.addPage()
    return 40
  }
  return y
}

// ── P-Card Request PDF ──────────────────────────────────────────
export function downloadPCardPDF(form: any) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  addHeader(doc, 'P-Card Request', 'ASUN/CSE Credit Card Request Form FY 25-26')

  let y = 38

  y = addSectionLabel(doc, 'Requestor Information', y)
  y = addTwoFields(doc, 'First Name', form.first_name, 'Last Name', form.last_name, y)
  y = checkPageBreak(doc, y)
  y = addField(doc, 'Club / Organization Name', form.club_name, 14, y)
  y = checkPageBreak(doc, y)

  y = addSectionLabel(doc, 'Purchase Details', y)
  y = addTwoFields(doc, 'Packages Delivered?', form.packages_delivered ? 'Yes' : 'No', 'Travel Request?', form.is_travel ? 'Yes' : 'No', y)
  y = addTwoFields(doc, 'Gift/Prize/Award?', form.is_gift ? 'Yes' : 'No', 'Print Service?', form.is_print ? 'Yes' : 'No', y)
  y = addTwoFields(doc, 'Event/Meeting/Gathering?', form.is_event ? 'Yes' : 'No', 'Number of Vendors', String(form.num_vendors ?? '—'), y)
  y = checkPageBreak(doc, y)

  y = addSectionLabel(doc, 'Funding', y)
  y = addField(doc, 'Funding Sources', Array.isArray(form.funding_sources) ? form.funding_sources.join(', ') : form.funding_sources || '—', 14, y)
  y = addField(doc, 'ASUN Funding Info', form.asun_funding_info || '—', 14, y)
  y = checkPageBreak(doc, y)

  y = addSectionLabel(doc, 'Transaction Detail', y)
  y = addField(doc, 'Transaction Description', form.transaction_detail, 14, y)
  y = checkPageBreak(doc, y)

  if (form.is_event) {
    y = addSectionLabel(doc, 'Event Information', y)
    y = addTwoFields(doc, 'Event Name', form.event_name, 'Location', form.event_location, y)
    y = addTwoFields(doc, 'Date', form.event_date, 'Time Frame', form.event_timeframe, y)
    y = addField(doc, 'Number of Attendees', String(form.num_attendees ?? '—'), 14, y)
    y = checkPageBreak(doc, y)
  }

  if (form.using_unr_logo) {
    y = addSectionLabel(doc, 'UNR Name / Logo Use', y)
    y = addField(doc, 'Logo / Name Description', form.logo_description, 14, y)
    y = checkPageBreak(doc, y)
  }

  if (form.is_print) {
    y = addSectionLabel(doc, 'Print Service', y)
    y = addTwoFields(doc, 'Print Release Number', form.print_release_number, 'Design File URL', form.design_file_url, y)
    y = checkPageBreak(doc, y)
  }

  if (form.department_account) {
    y = addSectionLabel(doc, 'ASUN/CSE Department Funding', y)
    y = addTwoFields(doc, 'Department Account', form.department_account, 'Budget Approved?', form.budget_approved, y)
    if (form.public_meeting_date) {
      y = addField(doc, 'Public Meeting Approval Date', form.public_meeting_date, 14, y)
    }
    y = checkPageBreak(doc, y)
  }

  y = addSectionLabel(doc, 'Signatures & Verification', y)
  y = addField(doc, 'Submitter Email', form.email, 14, y)
  y = checkPageBreak(doc, y)
  y = addCheckbox(doc, 'ASUN Employee Verification', !!form.asun_employee_verified, 14, y)
  y = addCheckbox(doc, 'ASUN/Club Officer/Director Signature', !!form.officer_signature, 14, y)
  y = addCheckbox(doc, 'CSE Administrative Faculty Signature', !!form.faculty_signature, 14, y)

  addFooter(doc)
  doc.save(`pcard-request-${Date.now()}.pdf`)
}

// ── Travel Request PDF ──────────────────────────────────────────
export function downloadTravelPDF(form: any) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  addHeader(doc, 'Travel Request', 'ASUN/CSE Travel Request Form FY 25-26')

  let y = 38

  y = addSectionLabel(doc, 'Requestor Information', y)
  y = addTwoFields(doc, 'First Name', form.first_name, 'Last Name', form.last_name, y)
  y = addField(doc, 'Email', form.email, 14, y)
  y = addField(doc, 'Club / Organization', form.club_name, 14, y)
  y = checkPageBreak(doc, y)

  y = addSectionLabel(doc, 'Trip Details', y)
  y = addField(doc, 'Destination', form.destination, 14, y)
  y = addTwoFields(doc, 'Departure Date', form.departure_date, 'Return Date', form.return_date, y)
  y = addTwoFields(doc, 'Number of Travelers', String(form.num_travelers ?? '—'), 'Transportation Type', form.transportation_type, y)
  y = addField(doc, 'Purpose of Travel', form.purpose, 14, y)
  y = checkPageBreak(doc, y)

  y = addSectionLabel(doc, 'Budget', y)
  y = addField(doc, 'Estimated Total Cost', form.estimated_cost ? `$${Number(form.estimated_cost).toFixed(2)}` : '—', 14, y)
  y = checkPageBreak(doc, y)

  if (form.lodging_required) {
    y = addSectionLabel(doc, 'Lodging', y)
    y = addField(doc, 'Lodging Details', form.lodging_details, 14, y)
    y = checkPageBreak(doc, y)
  }

  if (form.traveler_names) {
    y = addSectionLabel(doc, 'Travelers', y)
    y = addField(doc, 'Traveler Names', form.traveler_names, 14, y)
    y = checkPageBreak(doc, y)
  }

  addFooter(doc)
  doc.save(`travel-request-${Date.now()}.pdf`)
}

// ── Resource Checkout PDF ───────────────────────────────────────
export function downloadResourceCheckoutPDF(form: any) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  addHeader(doc, 'Resource Checkout', 'ASUN Club Resource Checkout Request')

  let y = 38

  y = addSectionLabel(doc, 'Requestor Information', y)
  y = addField(doc, 'Full Name', form.full_name, 14, y)
  y = addTwoFields(doc, 'Email', form.email, 'Club / Organization', form.club_name, y)
  y = addTwoFields(doc, 'Leadership Position', form.leadership_position, 'Other Position', form.other_position || '—', y)
  y = checkPageBreak(doc, y)

  y = addSectionLabel(doc, 'Event Details', y)
  y = addField(doc, 'Event Title', form.event_title, 14, y)
  y = addTwoFields(doc, 'Checkout Date', form.checkout_date, 'Checkout Time', form.checkout_time, y)
  y = addTwoFields(doc, 'Return Date', form.return_date, 'Return Time', form.return_time, y)
  y = checkPageBreak(doc, y)

  y = addSectionLabel(doc, 'Requested Items', y)
  const items = Array.isArray(form.requested_items)
    ? form.requested_items.join(', ')
    : form.requested_items || '—'
  y = addField(doc, 'Items', items, 14, y)
  y = addField(doc, 'Quantity Notes', form.quantity_notes || '—', 14, y)
  y = checkPageBreak(doc, y)

  y = addSectionLabel(doc, 'Acknowledgements', y)
  y = addCheckbox(doc, 'Resources must be returned within 24 hours', !!form.return_24hrs, 14, y)
  y = addCheckbox(doc, 'Late return policy acknowledged (by 10:00 AM next day if CSE is closed)', !!form.late_return, 14, y)
  y = addCheckbox(doc, 'Resources are to remain on campus unless permission granted', !!form.on_campus, 14, y)
  y = addCheckbox(doc, 'All resources must be cleaned before being returned', !!form.must_clean, 14, y)
  y = addCheckbox(doc, 'Financially responsible if resources are damaged or lost', !!form.financially_responsible, 14, y)
  y = addCheckbox(doc, 'Policy warning and privilege revocation acknowledged', !!form.policy_warning, 14, y)
  y = addCheckbox(doc, 'Food equipment policy acknowledged', !!form.food_equipment, 14, y)

  addFooter(doc)
  doc.save(`resource-checkout-${Date.now()}.pdf`)
}

// ── Single Transaction Receipt PDF ─────────────────────────────
export function downloadTransactionPDF(tx: any, clubName: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const isIncome = Number(tx.amount) > 0

  addHeader(doc, isIncome ? 'Income Receipt' : 'Expense Receipt', clubName || 'Club Finances')

  let y = 38

  // Amount hero box
  const boxColor = isIncome ? '#e8f5e9' : '#fdecea'
  const textColor = isIncome ? '#2e7d32' : '#c62828'
  doc.setFillColor(boxColor)
  doc.roundedRect(14, y, 182, 22, 3, 3, 'F')
  doc.setTextColor(textColor)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  const sign = isIncome ? '+' : ''
  doc.text(
    sign + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(tx.amount)),
    105, y + 10, { align: 'center' }
  )
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(isIncome ? 'INCOME' : 'EXPENSE', 105, y + 17, { align: 'center' })
  y += 30

  y = addSectionLabel(doc, 'Transaction Details', y)
  y = addField(doc, 'Title / Description', tx.title, 14, y)
  y = addTwoFields(doc, 'Date', tx.transaction_date ? new Date(tx.transaction_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—', 'Category', tx.category || '—', y)
  y = addTwoFields(doc, 'Payment Method', tx.payment_method || '—', isIncome ? 'Payer / Source' : 'Vendor / Merchant', tx.vendor_payer || '—', y)
  y = addField(doc, 'Reference / Invoice Number', tx.reference_number || '—', 14, y)

  if (tx.receipt_url) {
    y = addSectionLabel(doc, 'Receipt', y)
    y = addField(doc, 'Receipt URL', tx.receipt_url, 14, y)
  }

  if (tx.notes) {
    y = addSectionLabel(doc, 'Notes', y)
    y = addField(doc, 'Additional Notes', tx.notes, 14, y)
  }

  addFooter(doc)
  const safeName = (tx.title || 'transaction').replace(/[^a-z0-9]/gi, '-').toLowerCase()
  doc.save('receipt-' + safeName + '-' + Date.now() + '.pdf')
}

// ── Full Transaction Report PDF ─────────────────────────────────
export function downloadTransactionReportPDF(transactions: any[], clubName: string, filters: { type?: string; category?: string; search?: string } = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  addHeader(doc, 'Finance Report', clubName || 'Club Finances')

  const income = transactions.filter(t => Number(t.amount) > 0)
  const expenses = transactions.filter(t => Number(t.amount) < 0)
  const totalBalance = transactions.reduce((s, t) => s + Number(t.amount), 0)
  const totalIncome = income.reduce((s, t) => s + Number(t.amount), 0)
  const totalExpenses = expenses.reduce((s, t) => s + Number(t.amount), 0)

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  let y = 38

  // Summary boxes
  const boxW = 56
  // Balance
  doc.setFillColor(PRIMARY)
  doc.roundedRect(14, y, boxW, 18, 2, 2, 'F')
  doc.setTextColor(WHITE)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('NET BALANCE', 14 + boxW / 2, y + 5, { align: 'center' })
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(fmt(totalBalance), 14 + boxW / 2, y + 13, { align: 'center' })

  // Income
  doc.setFillColor('#e8f5e9')
  doc.roundedRect(76, y, boxW, 18, 2, 2, 'F')
  doc.setTextColor('#2e7d32')
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('TOTAL INCOME', 76 + boxW / 2, y + 5, { align: 'center' })
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(fmt(totalIncome), 76 + boxW / 2, y + 13, { align: 'center' })

  // Expenses
  doc.setFillColor('#fdecea')
  doc.roundedRect(138, y, boxW, 18, 2, 2, 'F')
  doc.setTextColor('#c62828')
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('TOTAL EXPENSES', 138 + boxW / 2, y + 5, { align: 'center' })
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(fmt(totalExpenses), 138 + boxW / 2, y + 13, { align: 'center' })

  y += 26

  // Filter info if any
  if (filters.type || filters.category || filters.search) {
    doc.setTextColor(MED_GRAY)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'italic')
    const parts = []
    if (filters.type) parts.push('Type: ' + filters.type)
    if (filters.category) parts.push('Category: ' + filters.category)
    if (filters.search) parts.push('Search: ' + filters.search)
    doc.text('Filters applied: ' + parts.join(' | '), 14, y)
    y += 6
  }

  // Report date
  doc.setTextColor(MED_GRAY)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  const now = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  doc.text('Report generated: ' + now + '  |  ' + transactions.length + ' transactions', 14, y)
  y += 8

  // Table header
  const cols = { date: 14, title: 44, category: 100, method: 140, amount: 196 }

  const drawTableHeader = (yPos: number) => {
    doc.setFillColor('#041E42')
    doc.rect(14, yPos - 4, 182, 7, 'F')
    doc.setTextColor(WHITE)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text('DATE', cols.date, yPos)
    doc.text('DESCRIPTION', cols.title, yPos)
    doc.text('CATEGORY', cols.category, yPos)
    doc.text('METHOD', cols.method, yPos)
    doc.text('AMOUNT', cols.amount, yPos, { align: 'right' })
    return yPos + 5
  }

  y = drawTableHeader(y)

  // Rows
  transactions.forEach((tx, idx) => {
    if (y > 268) {
      doc.addPage()
      y = 20
      y = drawTableHeader(y)
    }

    // Alternating row bg
    if (idx % 2 === 0) {
      doc.setFillColor('#f9f9f9')
      doc.rect(14, y - 3, 182, 7, 'F')
    }

    const isIncome = Number(tx.amount) > 0
    doc.setTextColor(MED_GRAY)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(fmtDate(tx.transaction_date), cols.date, y)

    // Title — truncate
    const title = doc.splitTextToSize(tx.title || '—', 52)[0]
    doc.setTextColor(BLACK)
    doc.text(title, cols.title, y)

    doc.setTextColor(MED_GRAY)
    const cat = doc.splitTextToSize(tx.category || '—', 36)[0]
    doc.text(cat, cols.category, y)

    const method = doc.splitTextToSize(tx.payment_method || '—', 36)[0]
    doc.text(method, cols.method, y)

    doc.setTextColor(isIncome ? '#2e7d32' : '#c62828')
    doc.setFont('helvetica', 'bold')
    const sign = isIncome ? '+' : ''
    doc.text(sign + fmt(Number(tx.amount)), cols.amount, y, { align: 'right' })

    y += 7
  })

  // Totals row
  if (y > 265) { doc.addPage(); y = 20 }
  doc.setFillColor('#041E42')
  doc.rect(14, y, 182, 8, 'F')
  doc.setTextColor(WHITE)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('NET BALANCE', 16, y + 5.5)
  doc.text(fmt(totalBalance), cols.amount, y + 5.5, { align: 'right' })

  addFooter(doc)
  const safeClub = (clubName || 'club').replace(/[^a-z0-9]/gi, '-').toLowerCase()
  doc.save('finance-report-' + safeClub + '-' + Date.now() + '.pdf')
}