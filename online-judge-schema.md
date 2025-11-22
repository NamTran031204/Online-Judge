# Online Judge — Flows & Database (Markdown)
---

## 1) Luồng chức năng (tóm tắt, gọn – rõ)

Chắc chắn rồi. Dưới đây là luồng chức năng đã được lọc bỏ **Gym Contest** và sắp xếp lại các nghiệp vụ liên quan đến **Tester** và **Group** xuống cuối cùng.

---

### Luồng chức năng đã sắp xếp lại

#### I. Core System & Nghiệp vụ Thi đấu

| STT     | Chức năng                                           | Ghi chú                                                          |
|:--------|:----------------------------------------------------|:-----------------------------------------------------------------|
| **0**   | **Register**                                        | Đăng ký người dùng mới.                                          |
| **1**   | **Login**                                           | Đăng nhập (cấp access\_token & refresh\_token).                  |
| **2**   | **CRUD Contest**                                    | Tạo, Đọc, Cập nhật, Xóa Contest (ở trạng thái Draft/Pending).    |
| **3**   | **CRUD Problem**                                    | Tạo, Đọc, Cập nhật, Xóa Problem.                                 |
| **4**   | **Register Contest**                                | Đăng ký tham gia Contest (Official).                             |
| **5**   | **Enter Contest**                                   | Vào phòng thi (khi Contest đang running).                        |
| **6**   | **Submit trong Contest**                            | Gửi bài giải trong thời gian thi.                                |
| **7**   | **Submit ngoài Contest (Practice)**                 | Gửi bài giải khi không trong Contest (Luyện tập).                |
| **8**   | **Xem Submission trong Contest**                    |                                                                  |
| **9**   | **Xem Submission ngoài Contest**                    |                                                                  |
| **10**  | **Dashboard Contest theo trang**                    | Xem bảng xếp hạng theo phân trang.                               |
| **11**  | **Dashboard Contest theo Bạn bè** (đi theo mục III) | Xem bảng xếp hạng trong nhóm bạn bè.                             |
| **12**  | **Dashboard Contest theo Nhóm**   (đi theo mục III) | Xem bảng xếp hạng theo Nhóm (user chung group / cùng tên group). |
| **13**  | **Tính Rating sau khi kết thúc Contest**            |                                                                  |
| **14**  | **Mở Lời giải (Solution) cho Problem sau Contest**  |                                                                  |
| **15**  | **Quản trị User**                                   | (Ủy nhiệm Pro\_User hoặc phạt rate −100000000 nếu cheat).        |
| **16**  | **Quản trị Contest**                                | (Đánh dấu Unrated).                                              |

---

#### II. Quy trình Duyệt & Thử nghiệm (Tester / Draft)

| STT    | Chức năng                                | Ghi chú                                                                   |
|:-------|:-----------------------------------------|:--------------------------------------------------------------------------|
| **17** | **Author mời Tester vào Draft của mình** | Mời người dùng có vai trò Tester để review.                               |
| **18** | **Mời & thi thử Draft**                  | Tester thực hiện thi thử Contest (Draft).                                 |
| **19** | **Đẩy Draft vào Queue đề xuất**          | Chủ Contest gửi đề xuất (chờ Bot/Admin Duyệt thành official).             |
| **20** | **Bot duyệt Draft → Official**           | Hệ thống tự động/Admin phê duyệt để Contest chuyển trạng thái chính thức. |

---

#### III. Quản lý Nhóm (Group)

| STT    | Chức năng                                  | Ghi chú                        |
|:-------|:-------------------------------------------|:-------------------------------|
| **21** | **User mời người khác vào Group của mình** | Quản lý thành viên trong nhóm. |
---


### 1.2. Diễn giải Quyền và Trạng thái, Các thành phần trong phân quyền

`Chia các đối tượng và quyền thành 3 cấp độ: Toàn cục, Nghiệp vụ, và Ngữ cảnh.`

#### Cấp 1: Đối tượng Toàn cục (Quản lý bởi API Gateway)

Đây là các đối tượng và vai trò mà Gateway có thể xác thực mà không cần hỏi các service khác.

* **User:** Đối tượng cơ sở, có `userId`.
* **Role (Toàn cục):** Các vai trò này áp dụng cho *toàn bộ hệ thống*.
    * `ADMIN`: Có quyền cao nhất (phê duyệt contest, quản lý user).
    * `USER`: Vai trò cơ bản cho mọi người dùng đã đăng ký.
    * `TESTER`: Có quyền sau ADMIN, được trực tiếp ADMIN bổ nhiệm, là người `UY TÍN` trong hệ thống. Nhiệm vụ chính của họ là đưa một contest từ ***unofficial*** thành ***official*** sau quá trình đánh giá.
      * Lưu ý với `TESTER`: nghiệp vụ đánh giá là nghiệp vụ ngoài hệ thống - được thể hiện băằng việc một contest sau khi được tester join vào, tester có quyền thi thử kể cả khi contest đó đang ở trạng thái `CLOSED` - nghiệp vụ chuyển đổi một contest từ ***unofficial*** thành ***official*** là nghiệp vụ trong hệ thống.
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

## 2. Luồng chức năng - Triển khai

### Lưu ý: tất cả các request GET theo kiểu getAll, tìm kiếm, filter... đều cần phân trang và gửi request phân trang.

### I. Core System & Nghiệp vụ Thi đấu

#### 0-1. Register - Login

* Đăng ký người dùng mới, đăng nhập vào hệ thống. Mỗi user có một role là USER.
* Nghiệp vụ Phân quyền ADMIN - TESTER được thực hiện ngoài hệ thống, nếu có thời gian thì mới làm.

#### 2,4. CRUD Contest

* ADMIN có quyền cao nhất - luôn là vậy.
* Tạo, Đọc, Cập nhật, Xóa Contest (ở trạng thái Draft/Pending).
* Mỗi `contest` có một danh sách người tham gia:
  * `contest public`: user có thể registry tự do, bất kế status.
  * `contest private`: user phải được mời hoặc tham gia theo link mời (tức nghiệp vụ là sử dụng link mời để thêm một user khác), hoặc được contestOwner thêm một danh sách userId vào.
* Khi thêm một `problem` sẵn có vào contest, thực chất là thêm một bản sao của problem vào contest và problem sẽ có id mới, trạng thái (visibility) của `problem bản sao` này sẽ phụ thuộc vào trạng thái của `contest`.
* Validate: (visibility)
  * private: contest private thì user thường không thể tìm thấy - đồng nghĩa không thể thi, submit,...
  * public: contest public thì user có thể tìm thấy và join/đăng ký được.
* Validate: (status)
  * Pending: chỉ contestOwner mới được RUD, hoặc ADMIN có quyền xoá contest.
  * RUNNING: USER có thể submit, nhưng không thể xem submit của nhau, có bảng Dashboard được visible vào lúc này để mọi người theo dõi kết quả thực tế của nhau.
  * CLOSED: submission được public, solution được public, nếu là contest official, USER lúc này mới được tính điểm để cập nhật rank của mình trên Dashboard chung. Khi trạng thái này, các submission sẽ không được tính điểm.

#### 3. CRUD Problem

* ADMIN có quyền cao nhất.
* Khi tạo một problem, thường problem sẽ có trạng thái public.
* Khi `problem` sẵn có được thêm vào một `contest`, thực chất là thêm vào một bản sao của problem đó, gọi api `/add/{problemId}/to/{contestId}`
* Khi `problem` được tạo bên trong một contest, thực chất nghiệp vụ là gửi api `tạo problem` và nội dung ProblemInputDto có contestId, lúc này thì problem là duy nhất.
* -> khi xoá một problem, không ảnh hưởng đến các contest mà có chứa problem đó.

#### 3. Đăng kí contest

* User chỉ được đăng kí một contest `public` và đang ở 1 trong 2 trạng thái `PENDING` & `RUNNING`.

#### 6-9: Submission

* `problem` không thuộc contest nào thì user submit thoải mái.
* `problem` thuộc một contest `CLOSED`: user được submit nhưng không được tính điểm và không được tính rank trong dashboard trong contest.
* `problem` thuộc contest `PENDING`: user không được phép submit.
* `problem` thuộc một contest `private`: chỉ người tham gia mới có thể submit.
* `contest` status running và closed, xem bên trên.

#### 10. Dashboard public (chính thức, dashboard chính, tuỳ cách gọi)

* là dashboard công khai rank của users, những người tham gia contest chính thức (official) thì được tính điểm và mức điểm đó ảnh hưởng đến rank của họ trong dashboard chính này.
* Dashboard hiện trên màn hình cần có phân trang.


#### 11. Dashboard Contest
* là dashboard riêng đi theo từng contest, tính điểm cho user tham gia contest.

#### 13 14 đã diễn giải bên trên

#### 15. Quản trị user

Đã diễn giải ở mục 1.2

#### 16. Quản trị contest

Đã diễn giải ở trên







