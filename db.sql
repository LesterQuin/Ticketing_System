CREATE TABLE sg.ticketing_users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50) NULL,
    last_name VARCHAR(50) NOT NULL,    
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' 
        CHECK (role IN ('user','superadmin','admin')),
    token VARCHAR(500) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE sg.ticketing_tickets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    agent_id INT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(10) DEFAULT 'Medium' 
        CHECK (priority IN ('Low','Medium','High')),
    status VARCHAR(20) DEFAULT 'Open' 
        CHECK (status IN ('Open','Pending','On Progress','Cancelled','Resolved','Closed')),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    started_at DATETIME NULL,       
    resolved_at DATETIME NULL,      
    closed_at DATETIME NULL,        
    cancelled_at DATETIME NULL,     
    assigned_at DATETIME NULL
);

CREATE TABLE sg.ticketing_ticket_comments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE sg.ticketing_ticket_attachments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100),
    uploaded_at DATETIME DEFAULT GETDATE()
);