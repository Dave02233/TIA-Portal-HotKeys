#include <iostream>

void resetValore(int* p) {
    if (p == nullptr) {
        std::cerr << "Errore: Puntatore nullo!" << std::endl;        
        return; 
    } 
    *p = 0;
}

int main() {
    int val = 10;
    resetValore(&val);
    std::cout << val << std::endl;
    return 0;
}