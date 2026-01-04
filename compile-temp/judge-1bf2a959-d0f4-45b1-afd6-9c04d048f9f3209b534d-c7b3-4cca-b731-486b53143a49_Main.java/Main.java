import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Sử dụng Scanner để đọc dữ liệu từ bàn phím (stdin)
        Scanner scanner = new Scanner(System.in);
        
        // Kiểm tra xem có dữ liệu đầu vào không
        if (scanner.hasNextInt()) {
            int a = scanner.nextInt();
            int b = scanner.nextInt();
            
            // Tính tổng và in ra màn hình (stdout)
            System.out.println(a + b);
        }
        
        scanner.close();
    }
}
