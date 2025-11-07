### 1. Giải pháp 1: Middleware (API Gateway)

Những gì bạn mô tả "middleware chứa logic... đóng vai trò như một router api" chính xác là một **API Gateway**. Đây là một thành phần trung tâm trong hầu hết các kiến trúc microservice hiện đại.

* **Cách hoạt động:**
    1.  Tất cả yêu cầu từ client (React, mobile...) **đều** đi qua API Gateway (ví dụ: `api.myjudge.com`).
    2.  Gateway xác thực token (JWT) của người dùng.
    3.  Nó kiểm tra quyền của người dùng dựa trên `role` và endpoint (ví dụ: `POST /api/problems` chỉ cho `ADMIN`).
    4.  Nếu hợp lệ, Gateway sẽ "gắn thêm trường `userId`" (thường là qua một HTTP Header như `X-User-Id` hoặc `X-User-Roles`).
    5.  Cuối cùng, nó chuyển tiếp (forward) yêu cầu đến microservice phù hợp (`Main Server` hoặc `Judge Service`) trên một mạng nội bộ (private network).



* **Ưu điểm (Rất nhiều):**
    * **Tập trung Logic:** Bạn chỉ viết code Authen/Author ở *một* nơi duy nhất.
    * **Bảo mật cao:** Các service bên trong (`Main Server`, `Judge Service`) không cần phải lộ ra Internet công cộng. Chúng chỉ cần nhận yêu cầu từ Gateway (ví dụ: qua VPC, Docker network).
    * **Đơn giản hóa Service:** `Main Server` và `Judge Service` trở nên "ngốc" hơn (theo nghĩa tốt). Chúng không cần quan tâm đến token là gì, chúng chỉ cần tin tưởng vào header `X-User-Id` mà Gateway gửi đến và tập trung vào nghiệp vụ.
    * **Quản lý tập trung:** Dễ dàng thêm rate-limiting (chống DDoS), logging, caching ở một nơi duy nhất.

* **Nhược điểm (Và cách giải quyết):**
    * **Bottleneck (Nút cổ chai):** Sử dụng một Load Balancing ở ngay trước mặt API Gateway là giải quyết được vấn đề, đồng thời nhân bản Middleware lên (horizontally scalable).
---


### 2. Diễn giải Quyền và Trạng thái, Các thành phần trong phân quyền

`Chia các đối tượng và quyền thành 3 cấp độ: Toàn cục, Nghiệp vụ, và Ngữ cảnh.`

#### Cấp 1: Đối tượng Toàn cục (Quản lý bởi API Gateway)

Đây là các đối tượng và vai trò mà Gateway có thể xác thực mà không cần hỏi các service khác.

* **User:** Đối tượng cơ sở, có `userId`.
* **Role (Toàn cục):** Các vai trò này áp dụng cho *toàn bộ hệ thống*.
    * `ADMIN`: Có quyền cao nhất (phê duyệt contest, quản lý user).
    * `USER`: Vai trò cơ bản cho mọi người dùng đã đăng ký.
    * `PROBLEM_SETTER`: Có quyền sau ADMIN, được trực tiếp ADMIN bổ nhiệm, là người `UY TÍN` trong hệ thống. Nhiệm vụ chính của họ là đưa một contest từ ***unofficial*** thành ***official***
* **Permission (Toàn cục):** Gắn với `Role`. (Xác định sau dựa trên phân tích và logic nghiệp vụ)
    * `ADMIN` có quyền: `approve:contest`, `manage:users`,...
    * `USER` có quyền: `create:contest`, `join:contest`, `submit:solution`,...

#### Cấp 2: Đối tượng Nghiệp vụ (Trạng thái) (Xử lý tại Main Service)

Đây là các thực thể (entities) mà logic nghiệp vụ của bạn xoay quanh.

* **Problem:**
    * **Trạng thái:** `PUBLIC` (mọi người có thể xem/dùng), `PRIVATE` (chỉ những người có quyền (ví dụ: `ADMIN`, `Contest Staff`) mới thấy; đây là bản sao khi được add vào contest).
* **Contest:**
    * **Trạng thái (Status):**
        * `PENDING`: Sắp diễn ra. Logic: Cho phép `Owner`/`Staff` chỉnh sửa, cho phép `User` đăng ký (nếu `PUBLIC` hoặc được mời).
        * `RUNNING`: Đang diễn ra. Logic: Cho phép `User` nộp bài, **phải bảo mật solution**.
        * `CLOSED`: Đã kết thúc. Logic: Public solution, public bảng xếp hạng.
    * **Hiển thị (Visibility):**
        * `PUBLIC`: Mọi người có thể thấy.
        * `PRIVATE`: Chỉ người được mời/`Staff`/`Admin` mới thấy.
    * **Tính chất (Officiality):**
        * `OFFICIAL`: Được tính rating, bắt buộc: 1. `PUBLIC`; 2. đã được `ADMIN` duyệt.
        * `UNOFFICIAL`: Không tính rating (ví dụ: contest do user tự tạo).

#### Cấp 3: Quyền theo Ngữ cảnh (Quản lý bởi Main Service)

Note: Đây là phần phức tạp nhất và **không nên** để API Gateway xử lý. Quyền này phụ thuộc vào *mối quan hệ* của `User` 
với *một đối tượng cụ thể* (ví dụ: một `Contest` cụ thể).

* **Contest Owner:** Là `userId` đã tạo ra contest. Có toàn quyền trên contest đó (bao gồm `DELETE`).
* **Contest Staff (Vai trò `participant` bạn mô tả):**
    * Đây là một bảng map (`ContestStaff`): `(contestId, userId)`.
    * Họ *không* phải `ADMIN` toàn cục.
    * Họ có quyền `EDIT`, `ADD_PROBLEM`, `MANAGE_COMPETITORS`... *chỉ trên contest đó*.
* **Contest Competitor (Người thi):**
    * Đây là một bảng map (`ContestCompetitors`): `(contestId, userId)`.
    * Họ chỉ có quyền `VIEW_CONTEST` (nếu `PRIVATE`), `SUBMIT_SOLUTION` (khi `RUNNING`).

Note: tất cả role `USER`/`ADMIN`/`PROBLEM_SETTER` đều có thể có một trong 3 vai trò trên, trừ việc `ADMIN` imba nhất 
khi có thể xoá một contest khi không phải Staff hay Owner. (Phần này thực ra nhắc cho người đọc đỡ lú, còn theo logic thì 
tất cả thủ tục được filter tại API Gateway rồi)

---

### Giải pháp cho phân quyền và Một số ví dụ về nghiệp vụ

#### a. Tách bạch các Role tại từng Service - Giải pháp quản lý Permission?

##### Vai trò (Roles):

* **Bảng `Role` (Toàn cục - Trong DB của Gateway):**
    1.  `ADMIN`: Quản trị viên hệ thống.
    2.  `USER`: Người dùng đã đăng ký.
    3.  `PROBLEM_SETTER` (Khuyến nghị): Một vai trò "uy tín" như bạn nói. Đây là những user được `ADMIN` tin tưởng, có thể tạo `Problem` `PUBLIC` và có thể được cấp quyền duyệt `OFFICIAL` contest.

* **Bảng `ContestStaff` (Ngữ cảnh - Trong DB của Main Server):**
    * Không phải là Role toàn cục.
    * Cấu trúc: `(contest_staff_id, contest_id, user_id)`
    * Bảng này định nghĩa "Ai là `Staff` (người quản lý) cho contest nào".

##### Giải pháp Quản lý Permission: RBAC (Toàn cục) + Logic Nghiệp vụ (Ngữ cảnh)**
**Cách làm:**

* API Gateway:** Chỉ làm 2 việc:
  1. **Xác thực token (Authentication)
  2. Gắn Role toàn cục (Authorization) vào header thông qua token (ví dụ: `X-User-Id: 123`, `X-User-Roles: USER,PROBLEM_SETTER`).
* **Main Server:** Nhận yêu cầu đã được "tin tưởng" từ Gateway. Service này sẽ tự triển khai logic nghiệp vụ. 
* Ví dụ: Khi nhận `PUT /contests/abc`:
  1.  Lấy `userId` từ header.
  2.  Lấy `contest` "abc" từ DB.
  3.  Kiểm tra: `if (contest.ownerId == userId || contestStaff.contains(userId))` thì mới cho phép sửa.
  * **Ưu điểm:** Rõ ràng, tách bạch. Gateway làm việc nhẹ, Service tập trung vào nghiệp vụ.
  * **Nhược điểm:** Service phải tự viết logic phân quyền (nhưng đây là điều đúng đắn).

##### Ví dụ

Làm sao `GET /contests/abc` biết người gọi có quyền xem?
* **API Gateway:**
    * Kiểm tra endpoint `GET /contests/*` có tồn tại không.
    * Kiểm tra người dùng đã đăng nhập chưa (có token hợp lệ không).
    * Nếu hợp lệ, forward yêu cầu (gắn kèm `userId`, `userRoles`) đến `Main Server`.
* **Main Server nhận Endpoint `GET /contests/{id}`:**
  * Lấy `userId` và `userRoles` từ header (hoặc request body, tuỳ logic nghiệp vụ).
  * Lấy `contest` từ DB bằng `id`.
  * `if (contest == null) return 404;`
  * `// Kiểm tra quyền xem`
  * `if (contest.visibility == PUBLIC) return contest;`
  * `if (userRoles.contains("ADMIN")) return contest;`
  * `if (contest.ownerId == userId) return contest;`
  * `if (contestStaff.contains(userId)) return contest;`
  * `if (contestCompetitors.contains(userId)) return contest;`
  * `// Nếu không rơi vào các trường hợp trên`
  * `return 403 Forbidden;` (hoặc 404 để che giấu)

#### b. Bảo mật Solution khi Contest đang `RUNNING`?

Đây là một logic nghiệp vụ quan trọng, được xử lý ở **Service**.

1.  **Giải pháp 1: Logic kiểm tra quyền ở tầng API (Khuyến nghị)**
    * **Cách làm:** Khi có yêu cầu `GET /submissions/{subId}` (giả sử problem này thuộc 1 contest đang running):
        1.  `Judge Service` nhận yêu cầu, lấy `userId` và `userRole` từ header.
        2.  Lấy `submission` từ DB (nó chứa `problemId`, `ownerId`).
        3.  Từ `problemId`, `userId`, gửi lên Main Service để validate (user có permission không, contest có đang ở trạng thái nào). (lú mẹ rồi)
        4.  Lấy `contest` từ DB -> return contest.status.
        5.  `// Bắt đầu logic bảo mật`
        6.  `if (status == CLOSED) { return submission; } // Contest đã đóng, public`
        7.  `// Contest đang RUNNING, chỉ chủ sở hữu hoặc Staff/Admin được xem`
        8.  `if (submission.ownerUserId == userId) { return submission; }`
        9.  `if (userRoles.contains("ADMIN")) { return submission; }`
        10. `if (contestStaff.contains(userId)) { return submission; }`
        11. `// Nếu không phải, trả về 403/404`
        12. `return 403 Forbidden;`