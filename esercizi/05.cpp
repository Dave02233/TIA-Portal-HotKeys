#include <iostream>
#include <vector>

void printVecValues (int* p, int size) {
    for (size_t i = 0; i < size; i++) {
        std::cout << i << ": " << p[i] << std::endl;
    }
}

int main() {

    std::vector<int> arr = {10, 20, 30, 40};
    printVecValues(arr.data(), arr.size());

    return 0;

}