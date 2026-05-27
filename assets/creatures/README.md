# Creature placeholders

At runtime we render placeholder creatures using lineage-themed emoji inside
`components/CreatureImage.tsx`, gated by level (5 evolution stages × 4 lineages).

To drop in real PNGs later, save them here as:

```
creature_egg.png
creature_lv1.png
creature_lv2.png
...
creature_lv20.png
```

Then update `CreatureImage.tsx` to `require(...)` the right file by level.
