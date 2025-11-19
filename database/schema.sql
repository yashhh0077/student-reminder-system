-- Students Table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  parent_email VARCHAR(255),
  parent_phone VARCHAR(20),
  department VARCHAR(100),
  semester INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late')) NOT NULL,
  subject VARCHAR(100),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, date, subject)
);

-- Fees Table
CREATE TABLE fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  paid_amount DECIMAL(10, 2) DEFAULT 0,
  due_date DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'partial', 'paid')) DEFAULT 'pending',
  fee_type VARCHAR(50) NOT NULL,
  semester INTEGER,
  academic_year VARCHAR(20),
  payment_date DATE,
  transaction_id VARCHAR(100),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admins Table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reminder Logs Table
CREATE TABLE reminder_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  type VARCHAR(50) CHECK (type IN ('attendance', 'fee')) NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent'
);

-- Indexes for better performance
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_fees_student ON fees(student_id);
CREATE INDEX idx_fees_status ON fees(status);
CREATE INDEX idx_fees_due_date ON fees(due_date);
CREATE INDEX idx_reminder_logs_student ON reminder_logs(student_id);
CREATE INDEX idx_reminder_logs_type ON reminder_logs(type);

-- Insert sample admin (password: admin123)
INSERT INTO admins (name, email, password, role) 
VALUES ('Admin User', 'admin@school.com', '$2a$10$rKvVXqQJQYQXqQJQYQXqQOeKfKfKfKfKfKfKfKfKfKfKfKfKfKfKf', 'admin');