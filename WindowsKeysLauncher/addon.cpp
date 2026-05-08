#include <napi.h>
#include "core.cpp"  // dove hai dichiarato sendCombo

Napi::Value SendComboWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // 1) controlla argomenti: almeno un array
    //    opzionale: secondo argomento numero (keyUpTime)
    // 2) estrai array di stringhe
    // 3) estrai keyUpTime o usa default
    // 4) converti in std::vector<std::string>
    // 5) chiama sendCombo(vector, keyUpTime)
    // 6) ritorna undefined
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(
        Napi::String::New(env, "sendCombo"),
        Napi::Function::New(env, SendComboWrapped)
    );
    return exports;
}

NODE_API_MODULE(keyaddon, Init)