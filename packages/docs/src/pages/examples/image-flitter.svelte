<script lang="ts">
  import {
    Image,
    Colors,
    ColoredBox,
    Center,
    ObjectFit,
    ObjectPosition,
    type Widget,
  } from "@meursyphus/flitter";
  import SvelteWidget from "@meursyphus/flitter-svelte";

  const createImageCase = (
    width?: number,
    height?: number,
    objectFit: ObjectFit = ObjectFit.none,
  ) => {
    return Center({
      child: ColoredBox({
        color: Colors.white,
        child: Image({
          src: "/examples/object-fit/profile.png",
          width,
          height,
          objectFit,
          objectPosition: ObjectPosition.center,
        }),
      }),
    });
  };

  const objectFits: ObjectFit[] = [
    ObjectFit.contain,
    ObjectFit.cover,
    ObjectFit.fill,
    ObjectFit.none,
    ObjectFit.scaleDown,
  ];
  const sizes = [250, 500, 750];

  const cases: Widget[] = [
    // 1. 기본 (width/height 미지정)
    createImageCase(),

    // 2-4. Width만 지정 (50%, 100%, 150%)
    ...sizes.flatMap((width) =>
      objectFits.map((fit) => createImageCase(width, undefined, fit)),
    ),

    // 5-7. Height만 지정 (50%, 100%, 150%)
    ...sizes.flatMap((height) =>
      objectFits.map((fit) => createImageCase(undefined, height, fit)),
    ),

    // 8-10. Width와 Height 모두 지정 (50%, 100%, 150%)
    ...sizes.flatMap((size) =>
      objectFits.map((fit) => createImageCase(size, size, fit)),
    ),

    // 추가: Width와 Height 다르게 지정
    ...[
      [250, 500],
      [250, 750],
      [500, 250],
      [500, 750],
      [750, 250],
      [750, 500],
    ].flatMap(([width, height]) =>
      objectFits.map((fit) => createImageCase(width, height, fit)),
    ),
  ];
</script>

<div>
  {#each cases as item}
    <SvelteWidget width="100%" height="100vh" renderer="canvas" widget={item} />
  {/each}
</div>

<style>
</style>
