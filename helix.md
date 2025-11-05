# Helix Notes

Useful commands:
- Open buffer picker: `<space> b`.
- Open file picker: `<space> F`.

- Change your config: `:config-open` and `config-reload`.

- Go somewhere - `g...`.
  - Go to a word on screen: `gw`.
- Add something around selection `ms...`.
- To select between quotes `mi"`.

- Repeat the last `Fx` or `tx` command: `Alt + .`.

My config:

```toml
theme = "catppuccin_mocha"

[editor]
mouse = false
bufferline = "always"
true-color = true
auto-pairs = false

[editor.soft-wrap]
enabled = true
wrap-indicator = ""

[keys.insert]
"C-t" = "indent"
"C-u" = "unindent"
```

Links:
- [Config options](https://docs.helix-editor.com/configuration.html)
- [Better documentation](https://helix-nikita-revencos-projects.vercel.app/start-here/basics)
