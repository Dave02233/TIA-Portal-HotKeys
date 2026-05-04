#include <iostream>
#include <vector>
#include <string>

struct Data
{
    std::string name;
    unsigned int id;
};

void swapByPointer(int* a, int* b) {
    if(a == nullptr || b == nullptr) {
        return;
    }
    int container = *a;
    *a = *b;
    *b = container;
}

void swapByRef(int& a, int& b) {
    int container = a;
    a = b;
    b = container;
}

std::vector<float> scaleArray(double* arr, std::size_t n, float factor) {
    if(arr == nullptr) {
        std::cerr << "Null pointer nella funzione scaleArray" << std::endl;
        return std::vector<float>{};
    }

    std::vector<float> scaled = {};
    scaled.resize(n);

    for(std::size_t i=0; i<n; i++) {
        scaled[i] = arr[i] * factor;
    }

    return scaled;
}

void printData(Data& d) {
    std::cout << d.id << "-" << d.name << std::endl;
}

void setName(Data* d, std::string name) {
    if(d == nullptr) {
        return;
    }
    d->name = name;
}

void setId(Data& d, unsigned int id) {
    d.id = id;
}

void replacePointer(int*& p, int* newP) {
    if(newP == nullptr) {
        std::cerr << "null pointer come newP in replacePointer" << std::endl;
        return;
    }

    p = newP;
}

void setNull(int** p) {
    *p = nullptr;
}

int main() {
    int first = 5;
    int second = 10;

    //
    std::cout << first << "-" << second << std::endl;
    swapByPointer(&first, &second);
    std::cout << first << "-" << second << std::endl;

    //
    std::cout << first << "-" << second << std::endl;
    swapByRef(first, second);
    std::cout << first << "-" << second << std::endl;

    //
    std::vector<double> raw = 
    {
        27648, 
        13864,
        1250,
        0
    };
    
    std::vector<float> scaled = scaleArray(&raw[0], raw.size(), 0.5);

    for(std::size_t i=0; i<raw.size(); i++) {
        std::cout << raw[i] << ": " << scaled[i] << std::endl;
    }

    //
    Data testData = { "Pippo", 1 };
    printData(testData);
    
    setName(&testData, "Mimmo");
    setId(testData, 2);
    printData(testData);

    //
    int a = 1;
    int b = 2;
    int* p = &a;
    int* newP = &b;

    std::cout << p << std::endl;
    replacePointer(p, newP);
    std::cout << p << std::endl;
    setNull(&p);
    std::cout << p << std::endl;
}