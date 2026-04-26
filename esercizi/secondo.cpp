#include <iostream>

void raddoppia(int& x) {
    x *= 2;
}

int main() {
    int num = 5;
    raddoppia(num);
    std::cout << num << std::endl;
    return 0;
}