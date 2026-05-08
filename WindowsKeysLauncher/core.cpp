#include <windows.h>
#include <iostream>
#include <vector>
#include <string>
#pragma comment(lib, "user32.lib") // lasciare windows.h una volta finito con vscode

/*
typedef struct tagKEYBDINPUT {
  WORD wVk;        // virtual key code
  WORD wScan;      // di solito 0 se usi wVk
  DWORD dwFlags;   // 0 per keydown, KEYEVENTF_KEYUP per keyup
  DWORD time;      // quasi sempre 0
  ULONG_PTR dwExtraInfo; // di solito 0
} KEYBDINPUT;

typedef struct tagINPUT              // definisco una struct chiamata internamente "struct tagINPUT"
{
    DWORD type;                      // tipo di input: INPUT_MOUSE, INPUT_KEYBOARD, INPUT_HARDWARE

    union {                          // union = un solo blocco di memoria condiviso tra i campi sotto
        MOUSEINPUT mi;               // dati per un evento di mouse (usato se type == INPUT_MOUSE)
        KEYBDINPUT ki;               // dati per un evento di tastiera (usato se type == INPUT_KEYBOARD)
        HARDWAREINPUT hi;            // dati per un evento hardware (usato se type == INPUT_HARDWARE)
    };
} INPUT;                             // alias "INPUT" per questa struct (così scrivi INPUT invece di struct tagINPUT
*/  

WORD VkFromName(const std::string& name) {
    
    if (name == "ctrl")  return VK_CONTROL;   
    if (name == "alt")   return VK_MENU;      // Alt generico se non funziona, lmenu
    if (name == "shift") return VK_SHIFT; 

    if (name == "f1")  return VK_F1;
    if (name == "f2")  return VK_F2;
    if (name == "f3")  return VK_F3;
    if (name == "f4")  return VK_F4;
    if (name == "f5")  return VK_F5;
    if (name == "f6")  return VK_F6;
    if (name == "f7")  return VK_F7;
    if (name == "f8")  return VK_F8;
    if (name == "f9")  return VK_F9;
    if (name == "f10") return VK_F10;
    if (name == "f11") return VK_F11;
    if (name == "f12") return VK_F12;

    return 0; 
}


void sendKey(const std::string& key, bool dir = false) { //dir = false down, true up 
    WORD vk = VkFromName(key);
    if(vk == 0) {
        std::cerr << "Comando non valido" << std::endl;
        return;
    }

    INPUT ip;
    ZeroMemory(&ip, sizeof(ip));
    ip.type = INPUT_KEYBOARD;
    ip.ki.wScan = 0;
    ip.ki.time = 0;
    ip.ki.dwExtraInfo = 0;

    ip.ki.wVk = vk;
    if(dir == 0) {
        ip.ki.dwFlags = 0; 
    } else {
        ip.ki.dwFlags = KEYEVENTF_KEYUP;
    }

    SendInput(1, &ip, sizeof(INPUT));
}

void sendCombo(const std::vector<std::string>& keys, unsigned int keyUpTime = 1000) {
    for(const std::string& k : keys) {
        sendKey(k, false);
    }

    Sleep(keyUpTime);

    for(const std::string& k : keys) {
        sendKey(k, true);
    }
}

void test() {
    std::vector<std::string> keyList = {"alt", "f1"};
    sendCombo(keyList, 1000);
}


int main() {
    std::cout << "Launching keys..." << std::endl; 

    test();

    std::cout << "Keys launched" << std::endl;
    return 0;
}