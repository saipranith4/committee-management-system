// Data Storage
let data = {
    donations: [],
    donors: [],
    members: [],
    events: [],
    expenses: [],
    messages: [],
    gallery: [],
    announcements: []
};

const STORAGE_KEY = 'committee_data';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    showPage('dashboard');
    updateDashboard();
});

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event?.target?.classList.add('active');
    
    document.getElementById('pageTitle').textContent = pageId.charAt(0).toUpperCase() + pageId.slice(1);
    
    // Refresh data for current page
    if (pageId === 'dashboard') updateDashboard();
    else if (pageId === 'donations') renderDonations();
    else if (pageId === 'donors') renderDonors();
    else if (pageId === 'expenses') renderExpenses();
    else if (pageId === 'members') renderMembers();
    else if (pageId === 'events') renderEvents();
    else if (pageId === 'announcements') renderAnnouncements();
}

// Forms
function showForm(type) {
    const modal = document.getElementById('formModal');
    const formFields = document.getElementById('formFields');
    
    const forms = {
        donation: `
            <div class="form-group">
                <label>Donor Name</label>
                <input type="text" id="donorName" placeholder="Enter donor name" required />
            </div>
            <div class="form-group">
                <label>Amount (₹)</label>
                <input type="number" id="amount" placeholder="Enter amount" required />
            </div>
            <div class="form-group">
                <label>Type</label>
                <select id="donationType" required>
                    <option>Cash</option>
                    <option>Check</option>
                    <option>Online</option>
                </select>
            </div>
        `,
        donor: `
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="donorFullName" placeholder="Full name" required />
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="donorEmail" placeholder="Email address" required />
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" id="donorPhone" placeholder="Phone number" required />
            </div>
        `,
        expense: `
            <div class="form-group">
                <label>Category</label>
                <select id="expenseCategory" required>
                    <option>Utilities</option>
                    <option>Supplies</option>
                    <option>Events</option>
                    <option>Maintenance</option>
                </select>
            </div>
            <div class="form-group">
                <label>Amount (₹)</label>
                <input type="number" id="expenseAmount" placeholder="Enter amount" required />
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="expenseDescription" placeholder="Description"></textarea>
            </div>
        `,
        member: `
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="memberName" placeholder="Full name" required />
            </div>
            <div class="form-group">
                <label>Role</label>
                <input type="text" id="memberRole" placeholder="e.g., President" required />
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="memberEmail" placeholder="Email address" required />
            </div>
        `,
        event: `
            <div class="form-group">
                <label>Event Name</label>
                <input type="text" id="eventName" placeholder="Event name" required />
            </div>
            <div class="form-group">
                <label>Date</label>
                <input type="date" id="eventDate" required />
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="eventDescription" placeholder="Event description"></textarea>
            </div>
        `,
        announcement: `
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="announcementTitle" placeholder="Announcement title" required />
            </div>
            <div class="form-group">
                <label>Message</label>
                <textarea id="announcementMessage" placeholder="Announcement message" required></textarea>
            </div>
        `
    };
    
    formFields.innerHTML = forms[type] || '';
    document.getElementById('dataForm').dataset.type = type;
    modal.classList.add('active');
}

function closeForm() {
    document.getElementById('formModal').classList.remove('active');
}

function submitForm(e) {
    e.preventDefault();
    const type = document.getElementById('dataForm').dataset.type;
    
    if (type === 'donation') {
        data.donations.push({
            id: Date.now(),
            donor: document.getElementById('donorName').value,
            amount: parseFloat(document.getElementById('amount').value),
            type: document.getElementById('donationType').value,
            date: new Date().toLocaleDateString()
        });
    } else if (type === 'donor') {
        data.donors.push({
            id: Date.now(),
            name: document.getElementById('donorFullName').value,
            email: document.getElementById('donorEmail').value,
            phone: document.getElementById('donorPhone').value
        });
    } else if (type === 'expense') {
        data.expenses.push({
            id: Date.now(),
            category: document.getElementById('expenseCategory').value,
            amount: parseFloat(document.getElementById('expenseAmount').value),
            description: document.getElementById('expenseDescription').value,
            date: new Date().toLocaleDateString()
        });
    } else if (type === 'member') {
        data.members.push({
            id: Date.now(),
            name: document.getElementById('memberName').value,
            role: document.getElementById('memberRole').value,
            email: document.getElementById('memberEmail').value
        });
    } else if (type === 'event') {
        data.events.push({
            id: Date.now(),
            name: document.getElementById('eventName').value,
            date: document.getElementById('eventDate').value,
            description: document.getElementById('eventDescription').value
        });
    } else if (type === 'announcement') {
        data.announcements.push({
            id: Date.now(),
            title: document.getElementById('announcementTitle').value,
            message: document.getElementById('announcementMessage').value,
            date: new Date().toLocaleDateString()
        });
    }
    
    saveData();
    closeForm();
    showPage(document.querySelector('.page.active').id);
}

// Render Functions
function updateDashboard() {
    const totalDonations = data.donations.reduce((sum, d) => sum + d.amount, 0);
    const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
    
    document.getElementById('totalDonations').textContent = totalDonations.toFixed(0);
    document.getElementById('totalDonors').textContent = data.donors.length;
    document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(0);
    document.getElementById('totalMembers').textContent = data.members.length;
    
    // Recent donations
    const recent = data.donations.slice(-5).reverse();
    document.getElementById('recentDonations').innerHTML = recent.map(d => 
        `<li>${d.donor}: ₹${d.amount} (${d.date})</li>`
    ).join('');
    
    // Upcoming events
    const upcoming = data.events.slice(0, 5);
    document.getElementById('upcomingEvents').innerHTML = upcoming.map(e =>
        `<li>${e.name} (${e.date})</li>`
    ).join('');
    
    // Reports
    document.getElementById('reportIncome').textContent = totalDonations.toFixed(0);
    document.getElementById('reportExpenses').textContent = totalExpenses.toFixed(0);
    document.getElementById('reportBalance').textContent = (totalDonations - totalExpenses).toFixed(0);
    document.getElementById('reportDonors').textContent = data.donors.length;
    document.getElementById('reportAverage').textContent = (totalDonations / (data.donors.length || 1)).toFixed(0);
    document.getElementById('reportTotal').textContent = totalDonations.toFixed(0);
}

function renderDonations() {
    const tbody = document.getElementById('donationsTable');
    tbody.innerHTML = data.donations.map(d => `
        <tr>
            <td>${d.date}</td>
            <td>${d.donor}</td>
            <td>₹${d.amount}</td>
            <td>${d.type}</td>
            <td>
                <button class="btn" onclick="deleteDonation(${d.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function deleteDonation(id) {
    data.donations = data.donations.filter(d => d.id !== id);
    saveData();
    renderDonations();
}

function renderDonors() {
    const list = document.getElementById('donorsList');
    list.innerHTML = data.donors.map(d => `
        <div class="list-item">
            <h4>${d.name}</h4>
            <p>Email: ${d.email}</p>
            <p>Phone: ${d.phone}</p>
            <button class="btn" onclick="deleteDonor(${d.id})">Delete</button>
        </div>
    `).join('');
}

function deleteDonor(id) {
    data.donors = data.donors.filter(d => d.id !== id);
    saveData();
    renderDonors();
}

function renderExpenses() {
    const tbody = document.getElementById('expensesTable');
    tbody.innerHTML = data.expenses.map(e => `
        <tr>
            <td>${e.date}</td>
            <td>${e.category}</td>
            <td>₹${e.amount}</td>
            <td>${e.description}</td>
            <td>
                <button class="btn" onclick="deleteExpense(${e.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function deleteExpense(id) {
    data.expenses = data.expenses.filter(e => e.id !== id);
    saveData();
    renderExpenses();
}

function renderMembers() {
    const list = document.getElementById('membersList');
    list.innerHTML = data.members.map(m => `
        <div class="list-item">
            <h4>${m.name}</h4>
            <p>Role: ${m.role}</p>
            <p>Email: ${m.email}</p>
            <button class="btn" onclick="deleteMember(${m.id})">Delete</button>
        </div>
    `).join('');
}

function deleteMember(id) {
    data.members = data.members.filter(m => m.id !== id);
    saveData();
    renderMembers();
}

function renderEvents() {
    const list = document.getElementById('eventsList');
    list.innerHTML = data.events.map(e => `
        <div class="list-item">
            <h4>${e.name}</h4>
            <p>Date: ${e.date}</p>
            <p>${e.description}</p>
            <button class="btn" onclick="deleteEvent(${e.id})">Delete</button>
        </div>
    `).join('');
}

function deleteEvent(id) {
    data.events = data.events.filter(e => e.id !== id);
    saveData();
    renderEvents();
}

function renderAnnouncements() {
    const list = document.getElementById('announcementsList');
    list.innerHTML = data.announcements.map(a => `
        <div class="announcement-item">
            <h4>${a.title}</h4>
            <p>${a.message}</p>
            <small>${a.date}</small>
        </div>
    `).join('');
}

// Chat
function sendMessage() {
    const input = document.getElementById('chatInput');
    if (input.value.trim()) {
        const msg = {
            text: input.value,
            sender: 'You',
            time: new Date().toLocaleTimeString()
        };
        data.messages.push(msg);
        const messagesDiv = document.getElementById('chatMessages');
        messagesDiv.innerHTML += `<div class="chat-message"><strong>${msg.sender}:</strong> ${msg.text} <small>${msg.time}</small></div>`;
        input.value = '';
        saveData();
    }
}

// Settings
function saveSettings() {
    alert('Settings saved successfully!');
}

// Sidebar Toggle
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'login.html';
    }
}

// Local Storage
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        data = JSON.parse(stored);
    }
}