export const mockSubmissions = [
  {
    submission_id: 10001,
    user_id: "Coder_A",
    problem_id: "A_PLUS_B",
    contest_id: null,

    result: "Accepted",
    status: "DONE",

    lang: "C++17",
    submit_time: 120, // ms
    created_at: "2025-12-10T18:00:00",

    source_code: `
#include <bits/stdc++.h>
using namespace std;

int main() {
  int a, b;
  cin >> a >> b;
  cout << a + b;
  return 0;
}
`,

    result_detail: [
      {
        test_id: 1,
        score: 10,
        status: "Accepted",
        time_limit: 5,
        memory_limit: 16,
      },
      {
        test_id: 2,
        score: 10,
        status: "Accepted",
        time_limit: 6,
        memory_limit: 16,
      },
    ],
  },

  {
    submission_id: 10002,
    user_id: "Hacker_B",
    problem_id: "A_PLUS_B",
    contest_id: null,

    result: "Wrong Answer",
    status: "DONE",

    lang: "C++17",
    submit_time: 80,
    created_at: "2025-12-10T17:55:30",

    source_code: `
#include <iostream>
using namespace std;

int main() {
  int a, b;
  cin >> a >> b;
  cout << a - b; // WRONG
}
`,

    result_detail: [
      {
        test_id: 1,
        score: 10,
        status: "Accepted",
        time_limit: 4,
        memory_limit: 15,
      },
      {
        test_id: 2,
        score: 0,
        status: "Wrong Answer",
        time_limit: 4,
        memory_limit: 15,
      },
    ],
  },

  {
    submission_id: 10003,
    user_id: "Coder_A",
    problem_id: "A_PLUS_B",
    contest_id: null,

    result: "Time Limit Exceeded",
    status: "DONE",

    lang: "C++17",
    submit_time: 2000,
    created_at: "2025-12-10T17:50:15",

    source_code: `
while(true) {}
`,

    result_detail: [
      {
        test_id: 1,
        score: 0,
        status: "Time Limit Exceeded",
        time_limit: 1000,
        memory_limit: 64,
      },
    ],
  },
];
