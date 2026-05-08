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


void SendAltF1ToForeground() {
    INPUT ip;
    ZeroMemory(&ip, sizeof(INPUT));
    ip.type = INPUT_KEYBOARD;
    ip.ki.wScan = 0;
    ip.ki.time = 0;
    ip.ki.dwExtraInfo = 0;

    // 1) Ctrl down
    ip.ki.wVk = VK_LMENU;
    ip.ki.dwFlags = 0;                // keydown
    SendInput(1, &ip, sizeof(INPUT));

    // 2) F2 down
    ip.ki.wVk = VK_F1;
    ip.ki.dwFlags = 0;                // keydown
    SendInput(1, &ip, sizeof(INPUT));

    Sleep(1000);

    // 3) F2 up
    ip.ki.wVk = VK_F1;
    ip.ki.dwFlags = KEYEVENTF_KEYUP;  // keyup
    SendInput(1, &ip, sizeof(INPUT));

    // 4) Ctrl up
    ip.ki.wVk = VK_LMENU;
    ip.ki.dwFlags = KEYEVENTF_KEYUP;  // keyup
    SendInput(1, &ip, sizeof(INPUT));
}


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


void sendKey(std::string& key) {
    WORD vk = VkFromName(key);

    
}

void sendCombo(std::vector<std::string>& keys) {
    
}


int main() {
    std::cout << "Launching keys..." << std::endl; 

    SendAltF1ToForeground();

    std::cout << "Keys launched" << std::endl;
    return 0;
}