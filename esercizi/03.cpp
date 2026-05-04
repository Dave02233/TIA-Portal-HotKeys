#include <iostream>

void aggiungiDieciRef(int& x) { 
    x += 10;
}

void aggiungiDieciPtr(int* x) {
    *x += 10;
}

int main() {
    int a = 5;
    aggiungiDieciRef(a);
    std::cout << "a = " << a << std::endl;

    int b = 5;
    aggiungiDieciPtr(&b);
    std::cout << "b = " << b << std::endl;
    return 0;
}