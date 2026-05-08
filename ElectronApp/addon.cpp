#include "node_modules/node-addon-api/napi.h"
#include "core.hpp"  // solo dichiarazioni, NON core.cpp

Napi::Value SendComboWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // 1) Validazione: deve esserci almeno un argomento di tipo Array
    if (info.Length() < 1 || !info[0].IsArray()) {
        Napi::TypeError::New(env, "Expected an array of strings as first argument")
            .ThrowAsJavaScriptException();
        return env.Undefined();
    }

    // 2) Estrai l'array di stringhe
    Napi::Array arr = info[0].As<Napi::Array>();
    std::vector<std::string> keys;
    for (uint32_t i = 0; i < arr.Length(); i++) {
        Napi::Value val = arr.Get(i);
        if (!val.IsString()) {
            Napi::TypeError::New(env, "Array must contain only strings")
                .ThrowAsJavaScriptException();
            return env.Undefined();
        }
        keys.push_back(val.As<Napi::String>().Utf8Value());
    }

    // 3) Leggi keyUpTime da info[1] se presente, altrimenti default 100ms
    unsigned int keyUpTime = 100;
    if (info.Length() >= 2 && info[1].IsNumber()) {
        keyUpTime = info[1].As<Napi::Number>().Uint32Value();
    }

    // 4) Chiama la funzione C++ del core
    sendCombo(keys, keyUpTime);

    // 5) Ritorna undefined (come una void in JS)
    return env.Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(
        Napi::String::New(env, "sendCombo"),
        Napi::Function::New(env, SendComboWrapped)
    );
    return exports;
}

NODE_API_MODULE(keyaddon, Init)