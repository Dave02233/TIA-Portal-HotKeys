{
  "targets": [
    {
      "target_name": "keyaddon",
      "sources": [ "addon.cpp", "core.cpp" ],
      "libraries": [ "user32.lib" ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")"
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
    }
  ]
}