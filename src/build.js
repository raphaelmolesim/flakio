const result = await Bun.build({
  entrypoints: ["./root.tsx"],
  outdir: './dist/',
});