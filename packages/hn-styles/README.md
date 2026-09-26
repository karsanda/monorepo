# @repo/hn-styles

Shared CSS for every Hacker News app: theme tokens (light and dark), base styles and the component classes (`.story`, `.comment`, `.tab-button`, …) that keep the UIs identical.

```css
@import '@repo/hn-styles';

:root {
  --brand: #ff3e00; /* the app's framework color; everything else derives from it */
}
```

The theme follows the OS. Set `data-theme="light"` or `"dark"` on `<html>` to override it.
