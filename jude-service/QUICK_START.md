# Quick Start Guide - Docker Sandbox Setup

## Prerequisites

- Docker Desktop installed and running on Windows
- Java 21 JDK installed
- Maven installed
- Project dependencies installed

## Step 1: Build Docker Images

Open PowerShell in the project root directory and run:

```powershell
# Navigate to project directory
cd E:\_CONGVIEC\_PROJECT\Online-Judge\jude-service

# Build all sandbox images
docker build -t judge-sandbox-cpp:latest ./docker-sandbox/cpp
docker build -t judge-sandbox-java:latest ./docker-sandbox/java
docker build -t judge-sandbox-python:latest ./docker-sandbox/python

# Verify images are built
docker images | Select-String "judge-sandbox"
```

You should see three images:
- `judge-sandbox-cpp:latest`
- `judge-sandbox-java:latest`
- `judge-sandbox-python:latest`

## Step 2: Ensure Compile Directory Exists

```powershell
# Create compile-temp directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "E:\_CONGVIEC\_PROJECT\Online-Judge\jude-service\compile-temp"
```

## Step 3: Test the Integration

Create a test controller or use the existing submission endpoint:

### Sample Test Request (C++)

```json
POST /api/submissions
{
  "problemId": "problem123",
  "userId": "user123",
  "language": "CPP",
  "sourceCode": "#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}\n"
}
```

### Sample Test Request (Java)

```json
POST /api/submissions
{
  "problemId": "problem123",
  "userId": "user123",
  "language": "JAVA",
  "sourceCode": "import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}\n"
}
```

### Sample Test Request (Python)

```json
POST /api/submissions
{
  "problemId": "problem123",
  "userId": "user123",
  "language": "PYTHON",
  "sourceCode": "a, b = map(int, input().split())\nprint(a + b)\n"
}
```

## Step 4: Verify Execution

After submitting, check:

1. **Judge Directory Created**: `compile-temp/judge-{uuid}/` should exist temporarily
2. **Test Case Directories**: `testcase_1/`, `testcase_2/`, etc. should be created
3. **Output Files**: Check `output.txt` and `error.txt` in each test case directory
4. **Cleanup**: Directory should be removed after judging completes

## Common Issues and Solutions

### Issue 1: Docker not found

```powershell
# Verify Docker is installed
docker --version

# If not found, install Docker Desktop for Windows
```

### Issue 2: Images not building

```powershell
# Check Docker daemon is running
docker ps

# Rebuild with no cache
docker build --no-cache -t judge-sandbox-cpp:latest ./docker-sandbox/cpp
```

### Issue 3: Permission errors on Windows

```powershell
# Run PowerShell as Administrator
# Or give Docker access to the drive in Docker Desktop settings:
# Settings > Resources > File Sharing > Add E:\ drive
```

### Issue 4: Path not found errors

```powershell
# Verify the compile-temp directory exists and has write permissions
Test-Path "E:\_CONGVIEC\_PROJECT\Online-Judge\jude-service\compile-temp"

# Create if missing
New-Item -ItemType Directory -Force -Path "E:\_CONGVIEC\_PROJECT\Online-Judge\jude-service\compile-temp"
```

## Monitoring and Debugging

### View Docker Logs

```powershell
# List running containers
docker ps

# View logs of a specific container (if it's still running)
docker logs <container_id>

# View all containers including stopped ones
docker ps -a
```

### Manual Testing

You can test each sandbox manually:

```powershell
# Test C++ Sandbox
$testDir = "$PWD\test-manual"
New-Item -ItemType Directory -Force -Path $testDir

"#include <iostream>
using namespace std;
int main() {
    cout << `"Hello, World!`" << endl;
    return 0;
}
" | Out-File -FilePath "$testDir\solution.cpp" -Encoding utf8

"" | Out-File -FilePath "$testDir\input.txt" -Encoding utf8
"Hello, World!" | Out-File -FilePath "$testDir\expected.txt" -Encoding utf8
"" | Out-File -FilePath "$testDir\output.txt" -Encoding utf8
"" | Out-File -FilePath "$testDir\error.txt" -Encoding utf8

docker run --rm `
  --network=none `
  -v "$testDir\solution.cpp:/sandbox/imageSolution.cpp" `
  -v "$testDir\input.txt:/sandbox/imageInput.txt" `
  -v "$testDir\output.txt:/sandbox/imageOutput.txt" `
  -v "$testDir\error.txt:/sandbox/imageError.txt" `
  -v "$testDir\expected.txt:/sandbox/imageExpectedOutput.txt" `
  judge-sandbox-cpp:latest 2 128

# Check output
Get-Content "$testDir\output.txt"
Get-Content "$testDir\error.txt"

# Cleanup
Remove-Item -Recurse -Force $testDir
```

## Performance Tips

1. **Keep Images Running**: Consider keeping images pre-loaded in Docker's cache
2. **Disk Space**: Regularly clean up old containers and images:
   ```powershell
   docker system prune -f
   ```
3. **Parallel Execution**: The system supports multiple submissions running simultaneously

## Next Steps

1. Configure time and memory limits in the `ProblemEntity`
2. Add more test cases to your problems
3. Monitor execution times and adjust limits as needed
4. Set up logging and monitoring for production use

## Support

For issues or questions, check:
- `docker-sandbox/README.md` for detailed documentation
- Docker Desktop logs
- Application logs in Spring Boot console
