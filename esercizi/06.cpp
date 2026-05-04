#include <iostream>
#include <vector>

struct Sensore {
    int id;
    float valore;
};

void resetSensore(Sensore& s) {
    s.id = 0;
    s.valore = 0.0f;
};

int main() {
    std::vector<Sensore> arr = {
        {1, 23.5f},
        {2, 24.1f}
    };

    resetSensore(arr.data()[0]);

    return 0;
}