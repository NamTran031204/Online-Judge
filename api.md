# TÀI LIỆU API HỆ THỐNG ONLINE JUDGE

---

## 1. Thành phần tham gia hệ thống

| Thành phần | Vai trò | Port |
|------------|--------|------|
| **Client** | Giao diện người dùng, gửi yêu cầu, nhận kết quả | 3000 |
| **Server** | Quản lý nghiệp vụ, xác thực, lưu trữ, cung cấp API | 8080 |
| **Judge**  | Chấm bài, biên dịch và thực thi code, trả kết quả | 5000 |
| **Database** | Lưu trữ dữ liệu (MongoDB) | 27017 |

---

## 2. API giữa các thành phần

### 2.1. Client ↔ Server (Spring Boot)

#### 2.1.1. Đăng ký tài khoản
- **Method:** POST
- **API:** `/api/auth/signup`
- **Port:** 8080
- **Header:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "string",
  "username": "string",
  "email": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```
- **Chức năng:** Đăng ký tài khoản mới

---

#### 2.1.2. Đăng nhập
- **Method:** POST
- **API:** `/api/auth/signin`
- **Port:** 8080
- **Header:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "usernameOrEmail": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "accessToken": "string",
  "tokenType": "Bearer"
}
```
- **Chức năng:** Đăng nhập, nhận JWT token

---

#### 2.1.3. Lấy thông tin user
- **Method:** GET
- **API:** `/api/user/me`
- **Port:** 8080
- **Header:** `Authorization: Bearer <accessToken>`
- **Response:**
```json
{
  "id": "string",
  "name": "string",
  "username": "string",
  "email": "string"
}
```
- **Chức năng:** Lấy thông tin user hiện tại

---

#### 2.1.4. Lấy danh sách bài toán
- **Method:** GET
- **API:** `/api/problem`
- **Port:** 8080
- **Header:** `Authorization: Bearer <accessToken>`
- **Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "tags": ["string"],
    "author": "string",
    "statement": "string",
    "explanation": "string",
    "sampleTestcases": [{"input": "string", "output": "string"}],
    "systemTestcases": [{"input": "string", "output": "string"}],
    "time": 2.0,
    "memory": 256
  },
  ...
]
```
- **Chức năng:** Lấy danh sách bài toán

---

#### 2.1.5. Lấy chi tiết bài toán
- **Method:** GET
- **API:** `/api/problem/{id}`
- **Port:** 8080
- **Header:** `Authorization: Bearer <accessToken>`
- **Response:**
```json
{
  "id": "string",
  "name": "string",
  "tags": ["string"],
  "author": "string",
  "statement": "string",
  "explanation": "string",
  "sampleTestcases": [{"input": "string", "output": "string"}],
  "systemTestcases": [{"input": "string", "output": "string"}],
  "time": 2.0,
  "memory": 256
}
```
- **Chức năng:** Lấy chi tiết bài toán

---

#### 2.1.6. Tạo bài toán mới
- **Method:** POST
- **API:** `/api/problem`
- **Port:** 8080
- **Header:** `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "string",
  "tags": ["string"],
  "author": "string",
  "statement": "string",
  "explanation": "string",
  "sampleTestcases": [{"input": "string", "output": "string"}],
  "systemTestcases": [{"input": "string", "output": "string"}],
  "time": 2.0,
  "memory": 256
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Problem created successfully"
}
```
- **Chức năng:** Tạo bài toán mới

---

#### 2.1.7. Lấy danh sách submission của user
- **Method:** GET
- **API:** `/api/submission/user/{id}`
- **Port:** 8080
- **Header:** `Authorization: Bearer <accessToken>`
- **Response:**
```json
[
  {
    "id": "string",
    "problemName": "string",
    "code": "string",
    "language": "string",
    "userId": "string",
    "verdict": "string",
    "date": "yyyy-MM-dd HH:mm:ss",
    "result": [
      {"time": 0.1, "memory": 128, "verdict": "AC"}
    ]
  },
  ...
]
```
- **Chức năng:** Lấy danh sách bài nộp của user

---

#### 2.1.8. Tạo submission mới (lưu kết quả chấm bài)
- **Method:** POST
- **API:** `/api/submission`
- **Port:** 8080
- **Header:** `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "problemName": "string",
  "code": "string",
  "language": "string",
  "userId": "string",
  "verdict": "string",
  "result": [
    {"time": 0.1, "memory": 128, "verdict": "AC"}
  ]
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Submission saved successfully"
}
```
- **Chức năng:** Lưu kết quả chấm bài

---

### 2.2. Client ↔ Judge (Node.js)

#### 2.2.1. Chấm bài (submit code để chấm)
- **Method:** POST
- **API:** `/api/evaluate`
- **Port:** 5000
- **Header:** `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "problemId": "string",
  "problemName": "string",
  "code": "string",
  "language": "string", // "c", "cpp", "java", "py"
  "operation": "string" // "runcode" hoặc "submit"
}
```
- **Response:**
```json
{
  "verdict": "string", // "AC", "WA", "TLE", "MLE", "CE", "RTE"
  "result": [
    {
      "actualOutput": "string",
      "time": 0.1,
      "memory": 128,
      "verdict": "AC"
    },
    ...
  ]
}
```
- **Chức năng:** Chấm bài, trả về kết quả từng test case và tổng verdict

---

### 2.3. Judge ↔ Server

#### 2.3.1. Lấy thông tin bài toán để chấm
- **Method:** GET
- **API:** `/api/problem/{id}`
- **Port:** 8080
- **Header:** Không cần xác thực (nội bộ)
- **Response:**
```json
{
  "id": "string",
  "name": "string",
  "tags": ["string"],
  "author": "string",
  "statement": "string",
  "explanation": "string",
  "sampleTestcases": [{"input": "string", "output": "string"}],
  "systemTestcases": [{"input": "string", "output": "string"}],
  "time": 2.0,
  "memory": 256
}
```
- **Chức năng:** Lấy thông tin bài toán để chấm

---

## 3. Ý nghĩa các trường trong API

- **verdict:** Kết quả chấm bài
    - `AC`: Accepted (Đúng)
    - `WA`: Wrong Answer (Sai)
    - `TLE`: Time Limit Exceeded (Quá thời gian)
    - `MLE`: Memory Limit Exceeded (Quá bộ nhớ)
    - `CE`: Compilation Error (Lỗi biên dịch)
    - `RTE`: Runtime Error (Lỗi runtime)
- **result:** Kết quả từng test case (thời gian, bộ nhớ, verdict)
- **operation:** Loại thao tác ("runcode" để chạy thử, "submit" để nộp bài)

---

## 4. Lưu ý bảo mật
- Các API cần xác thực đều sử dụng JWT Bearer Token ở header
- Các API nội bộ (Judge ↔ Server) có thể không cần xác thực

---

## 5. Tổng quan nghiệp vụ
- **Đăng ký, đăng nhập, xác thực user**
- **Quản lý bài toán (CRUD)**
- **Quản lý submission (lưu, truy vấn)**
- **Chấm bài tự động qua Judge Server**
- **Lưu kết quả chấm bài về Server**
- **Truy vấn kết quả, thống kê, dashboard**

---

## 6. Sơ đồ luồng API

```
Client (3000) → Server (8080) → Database (27017)
         ↓
      Judge (5000)
         ↓
      Server (8080)
```

- **Client** gửi yêu cầu tới **Server** để lấy bài toán, nộp bài, lấy kết quả
- Khi nộp code, **Client** gửi code tới **Judge** để chấm
- **Judge** lấy thông tin bài toán từ **Server**, thực thi chấm bài, trả kết quả về **Client**
- **Client** lưu kết quả về **Server**

---

# KẾT THÚC TÀI LIỆU API
