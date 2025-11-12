# Helix Notes

Useful commands:
- Open file picker: `<space> F`. (Open buffer picker: `<space> b`.)

- Go somewhere - `g...`.
  - Go to a word on screen: `gw`.
- Add something around selection `ms...`.
- To select between quotes `mi"`.

- Repeat the last `Fx` or `tx` command: `Alt + .`.

- Change your config: `:config-open` and `config-reload`.

My config:

```toml
theme = "catppuccin_mocha"

[editor]
mouse = false
bufferline = "always"
true-color = true
auto-pairs = false

[editor.soft-wrap]
enable = true
wrap-indicator = ""

[keys.insert]
"C-t" = "indent"
"C-u" = "unindent"
```

Links:
- [Config options](https://docs.helix-editor.com/configuration.html)
- [Better documentation](https://helix-nikita-revencos-projects.vercel.app/start-here/basics)

Troubleshooting:
- If syntax highlighting isn't working, try `hx -g fetch` and `hx -g build` ([source](https://github.com/helix-editor/helix/issues/3634#issuecomment-1234381661)).
