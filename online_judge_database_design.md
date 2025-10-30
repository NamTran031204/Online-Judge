# 🧩 Online Judge Contest Platform Database Design

## 🗄️ SQL SCHEMA

### 1️⃣ user_profile
| Column       | Data Type        | Description                     |
|---------------|------------------|----------------------------------|
| user_id       | INT PRIMARY KEY AUTO_INCREMENT | Unique ID of user |
| user_name     | VARCHAR(100)     | Username |
| email         | VARCHAR(255) UNIQUE | Email address |
| password      | VARCHAR(255)     | Hashed password |
| role          | ENUM('ADMIN','USER') | User role |
| info          | VARCHAR(255)              | Additional information (set as JSON string for later adding more info) |

```sql
CREATE TABLE user_profile (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('ADMIN','USER'),
  info VARCHAR(255)
);
```

---

### 2️⃣ contest
| Column          | Data Type     | Description |
|-----------------|---------------|--------------|
| contest_id      | INT PRIMARY KEY AUTO_INCREMENT | Unique contest ID |
| title           | VARCHAR(255)  | Contest title |
| description     | TEXT          | Contest description (latex) |
| start_time      | DATETIME      | Start time |
| duration        | INT           | Duration (minutes) |
| contest_status  | ENUM('UPCOMING','RUNNING','FINISHED') | Contest status |

```sql
CREATE TABLE contest (
  contest_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  description TEXT,
  start_time DATETIME,
  duration INT,
  contest_status ENUM('UPCOMING','RUNNING','FINISHED')
);
```

---

### 3️⃣ contest_problem
| Column         | Data Type | Description |
|----------------|------------|--------------|
| contest_id     | INT        | FK to contest |
| problem_id     | VARCHAR(50) | MongoDB Problem ID |
| problem_status | ENUM('LOCK_DESCRIPTION','UNLOCK_DESCRIPTION','LOCK_SOLUTION','UNLOCK_SOLUTION') | Problem access status |

```sql
CREATE TABLE contest_problem (
  contest_id INT,
  problem_id VARCHAR(50),
  problem_status ENUM('LOCK_DESCRIPTION','UNLOCK_DESCRIPTION','LOCK_SOLUTION','UNLOCK_SOLUTION'),
  PRIMARY KEY (contest_id, problem_id),
  FOREIGN KEY (contest_id) REFERENCES contest(contest_id)
);
```

---

### 4️⃣ contest_participants
| Column     | Data Type | Description |
|-------------|------------|--------------|
| contest_id  | INT        | FK to contest |
| user_id     | INT        | FK to user_profile |
| penalty     | INT        | Total penalty |
| total_score | INT        | Total score |
| rank        | INT        | Contest rank |

```sql
CREATE TABLE contest_participants (
  contest_id INT,
  user_id INT,
  penalty INT,
  total_score INT,
  rank INT,
  PRIMARY KEY (contest_id, user_id),
  FOREIGN KEY (contest_id) REFERENCES contest(contest_id),
  FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);
```

---

### 5️⃣ comment
| Column     | Data Type | Description |
|-------------|------------|--------------|
| comment_id  | INT PRIMARY KEY AUTO_INCREMENT | Comment ID |
| user_id     | INT        | FK to user_profile |
| contents    | TEXT       | Comment text |
| is_deleted  | BOOLEAN DEFAULT FALSE | Soft delete flag |
| parent_id   | INT NULL   | Parent comment (for threads) |

```sql
CREATE TABLE comment (
  comment_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  contents TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  parent_id INT NULL,
  FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);
```

---

### 6️⃣ user_rating_history
| Column      | Data Type | Description |
|--------------|------------|--------------|
| user_id      | INT        | FK to user_profile |
| contest_id   | INT        | FK to contest |
| rating       | INT        | New rating after contest |
| delta        | INT        | Rating change |

```sql
CREATE TABLE user_rating_history (
  user_id INT,
  contest_id INT,
  rating INT,
  delta INT,
  PRIMARY KEY (user_id, contest_id),
  FOREIGN KEY (user_id) REFERENCES user_profile(user_id),
  FOREIGN KEY (contest_id) REFERENCES contest(contest_id)
);
```

---

### 7️⃣ submission_result
| Column           | Data Type | Description |
|------------------|------------|--------------|
| user_id          | INT        | FK to user_profile |
| contest_id       | INT        | FK to contest |
| result           | ENUM('AC','WA','TLE','MLE','CE','QUEUED') | Result |
| submission_id    | VARCHAR(50) | MongoDB Submission ID |
| submission_status| ENUM('IN_CONTEST','PRACTICE') | Submission type |

```sql
CREATE TABLE submission_result (
  user_id INT,
  contest_id INT,
  result ENUM('AC','WA','TLE','MLE','CE'),
  submission_id VARCHAR(50),
  submission_status ENUM('IN_CONTEST','PRACTICE'),
  PRIMARY KEY (user_id, submission_id),
  FOREIGN KEY (user_id) REFERENCES user_profile(user_id),
  FOREIGN KEY (contest_id) REFERENCES contest(contest_id)
);
```

---

## 🍃 MONGO SCHEMA

### 🧠 problem
```json
{
  "problem_id": "prob_001",
  "title": "Sum of Two Numbers",
  "description": "Given two integers, return their sum.",
  "time_limit": "1s",
  "memory_limit": "256MB",
  "tags": ["math", "constructive"],
  "sample": [
    { "sample_inp1": "1 2", "sample_out1": "3" }
  ],
  "system_test": [
    { "test_id": "t1", "system_inp": "100 200", "system_out": "300" }
  ],
  "score": 100,
  "solution": "Chỉ cần in ra a+b, code C++ : int main() { int a,b; cin>>a>>b; cout<<a+b; }",
  "rating": 800
}
```

---

### 🧩 submission
```json
{
  "submission_id": "sub_001",
  "problem_id": "prob_001",
  "source_code": "int main(){int a,b;cin>>a>>b;cout<<a+b;}",
  "lang": "C++",
  "submitted_at": "2025-10-30T14:00:00Z",
  "result": [
    {
      "test_id": "t1",
      "inp": "1 2",
      "out": "3",
      "verdict": "AC",
      "time": "0.001s",
      "memory": "8MB"
    }
  ]
}
```