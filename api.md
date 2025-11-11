# Tài liệu api (Dành cho đội FE)

<!-- TOC -->
* [Tài liệu api (Dành cho đội FE)](#tài-liệu-api-dành-cho-đội-fe)
  * [API Documentation: Problems](#api-documentation-problems)
    * [Đối tượng Phản hồi (Response Wrapper)](#đối-tượng-phản-hồi-response-wrapper)
    * [Các đối tượng được sử dụng: (Các Enum được viết cuối)](#các-đối-tượng-được-sử-dụng-các-enum-được-viết-cuối)
    * [1\. ProblemEntity](#1-problementity)
    * [2\. ProblemInputDto](#2-probleminputdto)
    * [3\. TestcaseEntity](#3-testcaseentity)
    * [4\. CommonResponse](#4-commonresponse)
    * [5\. PageResult](#5-pageresult)
    * [6\. PageRequestDto](#6-pagerequestdto)
  * [1\. Tạo Problem](#1-tạo-problem)
    * [Request Body](#request-body)
    * [Responses](#responses)
  * [2\. Lấy danh sách Problem (Phân trang)](#2-lấy-danh-sách-problem-phân-trang)
      * [Lấy danh sách các bài tập, hỗ trợ `phân trang`, `sắp xếp` và `tìm kiếm`.](#lấy-danh-sách-các-bài-tập-hỗ-trợ-phân-trang-sắp-xếp-và-tìm-kiếm)
      * [Mức độ ưu tiên: Có thời gian thì làm, nếu làm, ưu tiên tìm kiếm, sau đó là phân trang](#mức-độ-ưu-tiên-có-thời-gian-thì-làm-nếu-làm-ưu-tiên-tìm-kiếm-sau-đó-là-phân-trang)
    * [Request Body](#request-body-1)
    * [📦 Responses](#-responses)
  * [3\. Lấy chi tiết Problem](#3-lấy-chi-tiết-problem)
    * [Path Variables](#path-variables)
    * [Responses](#responses-1)
  * [4\. Cập nhật Problem (và Testcase)](#4-cập-nhật-problem-và-testcase)
    * [Path Variables](#path-variables-1)
    * [Request Body](#request-body-2)
    * [Responses](#responses-2)
  * [5\. Xóa Problem](#5-xóa-problem)
    * [Path Variables](#path-variables-2)
    * [Responses](#responses-3)
  * [API Documentation: Submissions](#api-documentation-submissions)
    * [Các đối tượng được sử dụng: (Các Enum được viết cuối)](#các-đối-tượng-được-sử-dụng-các-enum-được-viết-cuối-1)
      * [1\. SubmissionEntity](#1-submissionentity)
      * [2\. SubmissionInputDto](#2-submissioninputdto)
      * [3\. SubmissionResultEntity](#3-submissionresultentity)
  * [1\. Nộp bài (Create Submission)](#1-nộp-bài-create-submission)
    * [Request Body](#request-body-3)
    * [Responses](#responses-4)
  * [2\. Lấy danh sách bài nộp (Phân trang)](#2-lấy-danh-sách-bài-nộp-phân-trang)
    * [Query Parameters](#query-parameters)
    * [Responses](#responses-5)
  * [3\. Lấy chi tiết bài nộp](#3-lấy-chi-tiết-bài-nộp)
    * [Path Variables](#path-variables-3)
    * [Responses](#responses-6)
  * [4\. Xóa bài nộp](#4-xóa-bài-nộp)
    * [Path Variables](#path-variables-4)
    * [Responses](#responses-7)
  * [5\. Xóa Bài Nộp theo Problem ID (Bulk Delete)](#5-xóa-bài-nộp-theo-problem-id-bulk-delete)
    * [Path Variables](#path-variables-5)
    * [Responses](#responses-8)
  * [6\. Xóa Bài Nộp theo User ID (Bulk Delete)](#6-xóa-bài-nộp-theo-user-id-bulk-delete)
    * [Path Variables](#path-variables-6)
    * [Responses](#responses-9)
  * [Các giá trị của Enum](#các-giá-trị-của-enum)
    * [1. `ProblemLevel` (Mức độ khó của Bài tập)](#1-problemlevel-mức-độ-khó-của-bài-tập)
    * [2. `LanguageType` (Ngôn ngữ lập trình được hỗ trợ)](#2-languagetype-ngôn-ngữ-lập-trình-được-hỗ-trợ)
    * [3. `ResponseStatus` (Trạng thái kết quả chấm bài)](#3-responsestatus-trạng-thái-kết-quả-chấm-bài)
<!-- TOC -->
## API Documentation: Problems

**Base Path:** `/api/v1/problems`

### Đối tượng Phản hồi (Response Wrapper)

Tất cả các API sẽ trả về một đối tượng `CommonResponse<T>` chuẩn.

| Thuộc tính     | Kiểu    | Mô tả                                                                    |
|:---------------|:--------|:-------------------------------------------------------------------------|
| `isSuccessful` | Boolean | `true` nếu thành công, `false` nếu thất bại.                             |
| `data`         | T       | Dữ liệu trả về (ví dụ: `ProblemEntity`).                                 |
| `code`         | String  | Mã lỗi/thành công. Thành công sẽ trả về 200, lỗi thì sẽ có dải lỗi riêng |
| `message`      | String  | Thông điệp mô tả.                                                        |

### Các đối tượng được sử dụng: (Các Enum được viết cuối)

### 1\. ProblemEntity

```json
{
  "problemId": "String",
  "contestId": "String",
  "title": "String",
  "description": "String",
  "tags": "List<String>",
  "imageUrls": "List<String>", // tạm thời bỏ qua, trường này ý nghĩa của nó là đưa ra link hình ảnh đính kèm vào description, vì trong đề bài có thể xuất hiện hình ảnh
  "level": "String (Enum ProblemLevel)",
  "supportedLanguage": "List<String (Enum LanguageType)>",
  "solution": "String",
  "rating": "String",
  "score": "Integer",
  "timeLimit": "Double",
  "memoryLimit": "Double",
  "inputType": "String",
  "outputType": "String",
  "authorId": "String",
  "testcaseEntities": "List<TestcaseEntity>",
  "createdBy": "String",
  "lastModifiedBy": "String",
  "createdAt": "LocalDateTime (String)",
  "lastModifiedDate": "LocalDateTime (String)"
}
```

-----

### 2\. ProblemInputDto

```json
{
  "contestId": "String",
  "title": "String",
  "description": "String",
  "tags": "List<String>",
  "imageUrls": "List<String>",
  "level": "String (Enum ProblemLevel)",
  "supportedLanguage": "List<String (Enum LanguageType)>",
  "solution": "String",
  "rating": "String",
  "score": "Integer",
  "timeLimit": "Double",
  "memoryLimit": "Double",
  "inputType": "String",
  "outputType": "String",
  "testcaseEntities": "List<TestcaseEntity>",
  "userId": "String"
}
```

-----

### 3\. TestcaseEntity

```json
{
  "testcaseName": "String",
  "input": "String",
  "output": "String"
}
```

-----

### 4\. CommonResponse

`TEntity` là kiểu dữ liệu chung.

```json
{
  "isSuccessful": "Boolean",
  "data": "TEntity (Object)",
  "code": "String",
  "message": "String"
}
```

-----

### 5\. PageResult

`TEntity` là kiểu dữ liệu chung.

```json
{
  "totalCount": "long (Number)",
  "data": "List<TEntity (Object)>"
}
```

-----

### 6\. PageRequestDto<TRequest>

Chỉ bao gồm các trường dữ liệu, không bao gồm các phương thức `get...`.

```json
{
  "maxResultCount": "Integer",
  "skipCount": "Integer",
  "sorting": "String",
  "filter": "TRequest" - kiểu trừu tuượng, truyền vào 1 object
}
```
-----

## 1\. Tạo Problem

Tạo một bài tập mới.

`POST /api/v1/problem/add-problem`

### Request Body

Sử dụng `ProblemInputDto`.

| Thuộc tính          | Kiểu           | Bắt buộc  | Mô tả                                                   |
|:--------------------|:---------------|:----------|:--------------------------------------------------------|
| `contestId`         | String         | **KHÔNG** |                                                         |
| `title`             | String         | **Có**    | Tiêu đề của bài tập.                                    |
| `description`       | String         | **Có**    | URL MinIO đến file markdown mô tả đề bài.               |
| `level`             | String         | **Có**    | Mức độ khó (ví dụ: "EASY", "MEDIUM", "HARD").           |
| `supportedLanguage` | List\<String\> | **Có**    | Danh sách ngôn ngữ (ví dụ: ["JAVA", "PYTHON"]).         |
| `timeLimit`         | Double         | **Có**    | Thời gian chạy tối đa (giây).                           |
| `memoryLimit`       | Double         | **Có**    | Memory limit                                            |
| `tags`              | List\<String\> | Không     | Danh sách tag (ví dụ: "DYNAMIC\_PROGRAMMING").          |
| `score`             | Integer        | Không     | Điểm số của bài tập.                                    |
| `testcaseEntities`  | List\<Object\> | **Có**    | Danh sách các test case. Xem cấu trúc `TestcaseEntity`. |
| `inputType`         | String         | Không     | mặc định là stdin                                       |
| `outputType`        | String         | Không     | mặc định là stdout                                      |

### Responses

* **`200 OK`**:
  ```json
  {
    "isSuccessful": true,
    "data": { /* ... đối tượng ProblemEntity đã được tạo ... */ },
    "code": "200",
    "message": "Successful"
  }
  ```
* **`400 Bad Request`**:
  ```json
  {
    "isSuccessful": false,
    "data": null,
    "code": "400",
    "message": "Bad request"
  }
  ```

-----

## 2\. Lấy danh sách Problem (Phân trang)

#### Lấy danh sách các bài tập, hỗ trợ `phân trang`, `sắp xếp` và `filter`.

`GET /api/v1/problem/get-page`

### Request Body (kiểu `PageRequestDto<ProblemInputDto>`)

| Tham số          | Kiểu            | Mô tả                                                                                                                                                                       |
|:-----------------|:----------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `skipCount`      | Integer         | Số lượng mục bỏ qua (offset). Mặc định: 0.                                                                                                                                  |
| `maxResultCount` | Integer         | Số lượng mục tối đa trên trang. Mặc định: 10.                                                                                                                               |
| `sorting`        | String          | Sắp xếp (ví dụ: "title asc, level desc").                                                                                                                                   |
| `filter`         | ProblemInputDto | Hạng mục filter theo `tag, level, language, rating, score` (tạm thời vẫn filter bằng, nếu muốn filter kiểu less than... thì liên hệ Nam :) hoặc Nam sẽ tự sửa phần này sau  |

### Responses

Phản hồi thành công sẽ trả về `CommonResponse<PageResult<ProblemEntity>>`.

* **`200 OK`**:

  ```json
  {
    "isSuccessful": true,
    "data": {
      "totalCount": 50,
      "data": [
        {
          "problemId": "p-123",
          "title": "Tìm tổng hai số (Two Sum)",
          "level": "EASY",
          "tags": ["ARRAY", "HASHING"],
          "score": 100
          // ... (các trường khác)
        },
        {
          "problemId": "p-124",
          "title": "Quy hoạch động",
          "level": "MEDIUM",
          "tags": ["DYNAMIC_PROGRAMMING"],
          "score": 200
          // ... (các trường khác)
        }
      ]
    },
    "code": "200",
    "message": "Success"
  }
  ```

* **`400 Bad Request`**:

  ```json
  {
    "isSuccessful": false,
    "data": null,
    "code": "400",
    "message": "Bad request"
  }
  ```

-----

## 3\. Lấy chi tiết Problem

Lấy thông tin chi tiết của một bài tập bằng ID của nó.

`GET /api/v1/problem/get-by-id/{problemId}`

### Path Variables

| Tham số     | Kiểu   | Mô tả                   |
|:------------|:-------|:------------------------|
| `problemId` | String | ID của `ProblemEntity`. |

### Responses

* **`200 OK`**:
  ```json
  {
    "isSuccessful": true,
    "data": { /* ... đối tượng ProblemEntity chi tiết ... */ },
    "code": "SUCCESS",
    "message": "Lấy chi tiết thành công."
  }
  ```
* **`404 Not Found`**:
  ```json
  {
    "isSuccessful": false,
    "data": null,
    "code": "404",
    "message": "Resource not found"
  }
  ```

-----

## 4\. Cập nhật Problem (và Testcase)

Cập nhật thông tin của một bài tập. **Đây cũng là API dùng để quản lý (thêm/sửa/xóa) Test case.**

`POST /api/v1/problem/update/{problemId}`

### Path Variables

| Tham số     | Kiểu   | Mô tả                   |
|:------------|:-------|:------------------------|
| `problemId` | String | ID của `ProblemEntity`. |

### Request Body

Sử dụng `ProblemInputDto`. (cập nhật bất kì trường nào của ProblemInputDto tuỳ theo nghiệp vụ - Phần này đội FE có thể lấy ra vài phần tiêu bieeur)

**Lưu ý quan trọng:** Để thêm/sửa/xóa test case, bạn phải gửi **toàn bộ danh sách `testcaseEntities`** mà bạn muốn. Hệ thống sẽ ghi đè (overwrite) toàn bộ danh sách cũ bằng danh sách mới bạn gửi lên.

### Responses

* **`200 OK`**:
  ```json
  {
    "isSuccessful": true,
    "data": { /* ... đối tượng ProblemEntity đã được cập nhật ... */ },
    "code": "SUCCESS",
    "message": "Cập nhật thành công."
  }
  ```
* **`404 Not Found`**:
  ```json
  {
    "isSuccessful": false,
    "data": null,
    "code": "404",
    "message": "Resource not found"
  }
  ```

-----

## 5\. Searching

Search theo title và description

### Request

`POST /api/v1/problem/searching`

Request-body: PageRequestDto<String>

| Tham số          | Kiểu    | Mô tả                                         |
|:-----------------|:--------|:----------------------------------------------|
| `skipCount`      | Integer | Số lượng mục bỏ qua (offset). Mặc định: 0.    |
| `maxResultCount` | Integer | Số lượng mục tối đa trên trang. Mặc định: 10. |
| `sorting`        | String  | Sắp xếp (ví dụ: "title asc, level desc").     |
| `filter`         | String  | chuỗi searching                               |

### Responses

Phản hồi thành công sẽ trả về `CommonResponse<PageResult<ProblemEntity>>`.

* **`200 OK`**:

  ```json
  {
    "isSuccessful": true,
    "data": {
      "totalCount": 50,
      "data": [
        {
          "problemId": "p-123",
          "title": "Tìm tổng hai số (Two Sum)",
          "level": "EASY",
          "tags": ["ARRAY", "HASHING"],
          "score": 100
          // ... (các trường khác)
        },
        {
          "problemId": "p-124",
          "title": "Quy hoạch động",
          "level": "MEDIUM",
          "tags": ["DYNAMIC_PROGRAMMING"],
          "score": 200
          // ... (các trường khác)
        }
      ]
    },
    "code": "200",
    "message": "Success"
  }
  ```

* **`400 Bad Request`**:

  ```json
  {
    "isSuccessful": false,
    "data": null,
    "code": "400",
    "message": "Bad request"
  }
  ```

-----

## 6\. Lấy tất cả problem theo contest

### Resquest

Json body
`POST /api/v1/problem/get-by-contest`

| Tham số          | Kiểu    | Mô tả                                          |
|:-----------------|:--------|:-----------------------------------------------|
| `skipCount`      | Integer | Số lượng mục bỏ qua (offset). Mặc định: 0.     |
| `maxResultCount` | Integer | Số lượng mục tối đa trên trang. Mặc định: 10.  |
| `sorting`        | String  | Sắp xếp (ví dụ: "title asc, level desc").      |
| `filter`         | String  | Chuỗi String chứa `contestId`                  |

### Responses

Phản hồi thành công sẽ trả về `CommonResponse<PageResult<ProblemEntity>>`.

* **`200 OK`**:

  ```json
  {
    "isSuccessful": true,
    "data": {
      "totalCount": 50,
      "data": [
        {
          "problemId": "p-123",
          "title": "Tìm tổng hai số (Two Sum)",
          "level": "EASY",
          "tags": ["ARRAY", "HASHING"],
          "score": 100
          // ... (các trường khác)
        },
        {
          "problemId": "p-124",
          "title": "Quy hoạch động",
          "level": "MEDIUM",
          "tags": ["DYNAMIC_PROGRAMMING"],
          "score": 200
          // ... (các trường khác)
        }
      ]
    },
    "code": "200",
    "message": "Success"
  }
  ```

* **`400 Bad Request`**:

  ```json
  {
    "isSuccessful": false,
    "data": null,
    "code": "400",
    "message": "Bad request"
  }
  ```


-----

## 7\. Xóa Problem

Xóa một bài tập khỏi hệ thống.

### Resquest

`DELETE /api/v1/problem/delete/{problemId}`

Path Variables

| Tham số     | Kiểu   | Mô tả                   |
|:------------|:-------|:------------------------|
| `problemId` | String | ID của `ProblemEntity`. |

### Responses

* **`200 OK`**:
  ```json
  {
    "isSuccessful": true,
    "data": null,
    "code": "SUCCESS",
    "message": "Xóa bài tập thành công."
  }
  ```
* **`404 Not Found`**:
  ```json
  {
    "isSuccessful": false,
    "data": null,
    "code": "404",
    "message": "Resource not found"
  }
  ```
----

## API Documentation: Submissions

**Base Path:** `/api/v1/submission`

### Các đối tượng được sử dụng: (Các Enum được viết cuối)

Tất cả các API sẽ trả về một đối tượng `CommonResponse<T>` chuẩn.

| Thuộc tính     | Kiểu    | Mô tả                                        |
|:---------------|:--------|:---------------------------------------------|
| `isSuccessful` | Boolean | `true` nếu thành công, `false` nếu thất bại. |
| `data`         | T       | Dữ liệu trả về (ví dụ: `SubmissionEntity`).  |
| `code`         | String  | Mã lỗi/thành công (từ `ErrorCode`).          |
| `message`      | String  | Thông điệp mô tả.                            |


#### 1\. SubmissionEntity

(Thực thể đại diện cho một bài nộp, lưu trữ trong MongoDB)

```json
{
  "submissionId": "String",
  "problemId": "String",
  "contestId": "String",
  "userId": "String",
  "sourceCode": "String",          // Mã nguồn bài nộp (hoặc URL tới MinIO)
  "language": "String (Enum LanguageType)",
  "submittedAt": "LocalDateTime",
  "result": "List<SubmissionResultEntity>" // Kết quả chạy trên từng test case
}
```

#### 2\. SubmissionInputDto

(DTO dùng để gửi lên khi tạo bài nộp mới)

```json
{
  "problemId": "String",
  "contestId": "String",
  "userId": "String",
  "sourceCode": "String",
  "language": "String (Enum LanguageType)"
}
```

#### 3\. SubmissionResultEntity

(Thực thể mô tả kết quả của từng Test Case trong một bài nộp)

```json
{
  "testcaseName": "String",
  "input": "String",
  "output": "String",
  "status": "ResponseStatus",      // kieeur enum, là trạng thái testcase đã pass hay chưa
  "time": "Float",                 // Thời gian thực thi (giây)
  "memory": "Float"                // Bộ nhớ sử dụng (MB)
}
```

-----

## 1\. Nộp bài (Create Submission)

Nộp một bài giải mới (`sourceCode`) để bắt đầu quá trình chấm điểm.

`POST /api/v1/submission/submit`

### Request Body

Sử dụng `SubmissionInputDto`.

| Thuộc tính   | Kiểu   | Bắt buộc | Mô tả                                                |
|:-------------|:-------|:---------|:-----------------------------------------------------|
| `problemId`  | String | **Có**   | ID của bài tập (`ProblemEntity`).                    |
| `userId`     | String | **Có**   | ID của người dùng nộp bài.                           |
| `sourceCode` | String | **Có**   | Nội dung mã nguồn của bài giải.                      |
| `language`   | String | **Có**   | Ngôn ngữ lập trình (ví dụ: "JAVA", "PYTHON", "CPP"). |
| `contestId`  | String | Không    | ID của cuộc thi (nếu bài nộp thuộc cuộc thi).        |

### Responses

* **`201 Created`**:
  ```json
  {
    "isSuccessful": true,
    "data": {
      "submissionId": "sub-abc12345",
      "problemId": "prob-xyz789",
      "userId": "user-001",
      "sourceCode": "public class Main { ... }",
      "language": "JAVA",
      "submittedAt": "2025-11-09T17:30:00Z",
      "result": List<SubmissionResultEntity> vd: 
                [
                  {
                     "testcaseName": "Test 1",
                     "input": "2/n 0 1",
                     "output": "1",
                     "status": "AC",
                     "time": 0.15,
                     "memory": 45.5
                  }
                ]
    },
    "code": "200",
    "message": "Successful"
  }
  ```
* **`400 Bad Request`** (Ví dụ: Ngôn ngữ không được hỗ trợ):
  ```json
  {
    "isSuccessful": false,
    "data": null,
    "code": "4003",
    "message": "Programming language not supported"
  }
  ```

-----

## 2\. Lấy danh sách bài nộp (Phân trang)

Lấy danh sách lịch sử các bài đã nộp, hỗ trợ phân trang và lọc. (nếu muốn kiểu getAll rồi tự xử lý tại FE thì cứ ể skipCount=0, maxResultCount = Int_Max - tuỳ đội FE gửi api như nào nhé)

`POST /api/v1/submission/get-page`

### Query Parameters

Sử dụng các trường từ `PageRequestDto<SubmissionInputDto>` (đã cung cấp ở ngữ cảnh trước).

| Tham số          | Kiểu               | Mô tả                                                                                     |
|:-----------------|:-------------------|:------------------------------------------------------------------------------------------|
| `skipCount`      | Integer            | Số lượng mục bỏ qua (offset). Mặc định: 0.                                                |
| `maxResultCount` | Integer            | Số lượng mục tối đa trên trang. Mặc định: 10.                                             |
| `sorting`        | String             | (có thể null) Sắp xếp (ví dụ: "submittedAt desc").                                        |
| `filter`         | SubmissionInputDto | (có thể null, nhma thường là không :>) lọc theo `problemId, contestId, userId, language`  |

### Responses

* **`200 OK`**:
  ```json
  // kiểu CommonResponse<PageResult<ProblemEntity>>
  {
    "isSuccessful": true,
    "data": {
      "totalCount": 150,
      "data": [
        {
          "submissionId": "sub-abc12345",
          "problemId": "prob-xyz789",
          "userId": "user-001",
          "language": "JAVA",
          "sourceCode": "public class Main { ... }",
          "submittedAt": "2025-11-09T17:30:00Z",
          "result": [
            {
              "testcaseName": "Test 1",
              "time": 0.15,
              "memory": 45.5
              // ... (Các trường khác của SubmissionResultEntity)
            }
          ]
        
        }
        // ... (các bài nộp khác)
      ]
    },
    "code": "200",
    "message": "Successful"
  }
  ```

-----

## 3\. Lấy chi tiết bài nộp

Lấy thông tin chi tiết của một bài nộp cụ thể, bao gồm kết quả chấm (nếu đã hoàn tất).

`GET /api/v1/submission/get-by-id/{submissionId}`

### Path Variables

| Tham số        | Kiểu   | Mô tả                      |
|:---------------|:-------|:---------------------------|
| `submissionId` | String | ID của `SubmissionEntity`. |

### Responses

* **`200 OK`**:
  ```json
  {
    "isSuccessful": true,
    "data": {
      "submissionId": "sub-abc12345",
      "problemId": "prob-xyz789",
      "userId": "user-001",
      "sourceCode": "public class Main { ... }",
      "language": "JAVA",
      "submittedAt": "2025-11-09T17:30:00Z",
      "result": [
        {
          "testcaseName": "Test 1",
          "input": "5 10",
          "output": "15",
          "status": "AC",
          "time": 0.15,
          "memory": 45.5
        },
        {
          "testcaseName": "Test 2",
          "input": "100 200",
          "output": "300",
          "status": "AC",
          "time": 0.18,
          "memory": 46.0
        }
      ]
    },
    "code": "200",
    "message": "Successful"
  }
  ```
* **`404 Not Found`**:
  ```json
  {
    "isSuccessful": false,
    "data": null,
    "code": "404",
    "message": "Resource not found"
  }
  ```

-----

## 4\. Xóa bài nộp

Xóa một bài nộp (thường là quyền của Admin).

`DELETE /api/v1/submission/delete-by-id/{submissionId}`

### Path Variables

| Tham số        | Kiểu   | Mô tả                      |
|:---------------|:-------|:---------------------------|
| `submissionId` | String | ID của `SubmissionEntity`. |

### Responses

* **`200 OK`**:
  ```json
  {
    "isSuccessful": true,
    "data": null,
    "code": "200",
    "message": "Xóa bài nộp thành công."
  }
  ```
* **`404 Not Found`**:
  ```json
  {
    "isSuccessful": false,
    "data": null,
    "code": "404",
    "message": "Resource not found"
  }
  ```

## 5\. Xóa Bài Nộp theo Problem ID (Bulk Delete)

Xóa tất cả các bài nộp (`SubmissionEntity`) liên quan đến một bài tập cụ thể. Thường dùng cho mục đích quản trị.

`DELETE /api/v1/submission/delete-by-problem/{problemId}`

### Path Variables

| Tham số     | Kiểu   | Mô tả                                                   |
|:------------|:-------|:--------------------------------------------------------|
| `problemId` | String | ID của bài tập (`Problem`) mà các bài nộp cần được xóa. |

### Responses

* **`200 OK`**:
  ```json
  {
    "isSuccessful": true,
    "data": 15, // số bản ghi đã xoá
    "code": "200",
    "message": "Xóa thành công 15 bài nộp liên quan đến Problem ID."
  }
  ```
* **`404 Not Found`**:
  ```json
  {
    "isSuccessful": false,
    "data": null,
    "code": "404",
    "message": "Problem ID không tồn tại hoặc không có bài nộp nào được tìm thấy."
  }
  ```

-----

## 6\. Xóa Bài Nộp theo User ID (Bulk Delete)

Xóa tất cả các bài nộp (`SubmissionEntity`) được gửi bởi một người dùng cụ thể.

`DELETE /api/v1/submission/delete-by-user/{userId}`

### Path Variables

| Tham số  | Kiểu   | Mô tả                                                   |
|:---------|:-------|:--------------------------------------------------------|
| `userId` | String | ID của người dùng (`User`) mà các bài nộp cần được xóa. |

### Responses

* **`200 OK`**:
  ```json
  {
    "isSuccessful": true,
    "data": 42,
    "code": "200",
    "message": "Xóa thành công 42 bài nộp của User."
  }
  ```
  (Lưu ý: `data` là số lượng bản ghi đã được xóa.)
* **`404 Not Found`**:
  ```json
  {
    "isSuccessful": false,
    "data": null,
    "code": "404",
    "message": "User ID không tồn tại hoặc không có bài nộp nào được tìm thấy."
  }
  ```

## Các giá trị của Enum

### 1. `ProblemLevel` (Mức độ khó của Bài tập)
Enum này được sử dụng trong trường `level` của `ProblemEntity` và `ProblemInputDto`.

| Giá trị (String) | Mô tả                                                              |
|:-----------------|:-------------------------------------------------------------------|
| `HARD`           | Bài tập rất khó, đòi hỏi kiến thức thuật toán sâu.                 |
| `MEDIUM`         | Bài tập trung bình, đòi hỏi tư duy thuật toán và cấu trúc dữ liệu. |
| `EASY`           | Bài tập dễ, thường dùng để khởi động hoặc kiểm tra cú pháp cơ bản. |
| `ENTRY_LEVEL`    | Bài tập cực kỳ cơ bản, dành cho người mới bắt đầu.                 |

---

### 2. `LanguageType` (Ngôn ngữ lập trình được hỗ trợ)
Enum này được sử dụng trong trường `supportedLanguage` của `Problem` và trường `language` của `SubmissionEntity`.

| Giá trị (String) | Ý nghĩa    |
|:-----------------|:-----------|
| `CPP`            | C++        |
| `JAVA`           | Java       |
| `PYTHON`         | Python     |
| `JAVASCRIPT`     | JavaScript |
| `CSHARP`         | C#         |

---

### 3. `ResponseStatus` (Trạng thái kết quả chấm bài)
Enum này được sử dụng để định nghĩa trạng thái của mỗi test case sau khi quá trình chấm bài hoàn tất (thường là một trường trong `SubmissionResultEntity`, mặc dù file đó không được cung cấp, nó là thành phần của `SubmissionEntity`).

| Giá trị (Code) | Ý nghĩa (Meaning)     | Mô tả chi tiết                                                                                                 |
|:---------------|:----------------------|:---------------------------------------------------------------------------------------------------------------|
| `AC`           | Accepted              | Mã nguồn chạy đúng, đưa ra kết quả khớp với Output mong muốn.                                                  |
| `WA`           | Wrong Answer          | Mã nguồn chạy đúng, nhưng kết quả đầu ra (Output) không khớp với kết quả mong muốn.                            |
| `TLE`          | Time Limit Exceeded   | Mã nguồn chạy quá thời gian giới hạn (`timeLimit`) của bài tập.                                                |
| `MLE`          | Memory Limit Exceeded | Mã nguồn sử dụng quá nhiều bộ nhớ (`memoryLimit`) được cho phép.                                               |
| `CE`           | Compilation Error     | Mã nguồn không thể biên dịch được (lỗi cú pháp).                                                               |
| `RTE`          | Runtime Error         | Mã nguồn bị dừng đột ngột trong khi chạy (ví dụ: chia cho 0, truy cập mảng ngoài giới hạn, lỗi segment fault). |
